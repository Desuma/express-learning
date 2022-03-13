# !/bin/bash

######################### 变量定义区 #########################
# 当前脚本所在路径
script_dir=$(cd $(dirname $0);pwd);
# 日志保留位置
log_path=${script_dir}/start_$(date '+%Y-%m-%d').log;
# mysql 管理程序
server_mysql=$(find / -name mysql.server);
# mysql 命令程序
cmd_mysql=$(find / -name mysql | grep /bin);
# mysql 监听端口号
port_mysql='';
# express 后台程序端口号
port_express='8080';
# express 后台程序位置
express_path=${script_dir}/bin/index.js;


######################### 函数定义区 #########################
function log()
{
  echo $1 2&>1 | tee $log_path;
}

# 检查 mysql 是否启动
function check_mysqld()
{
  log 'Func check_mysqld is runnig.';

  if [[ $(pidof mysqld) != '' ]];
  then
    log 'MySQL is running.';
    log 'Func check_mysqld is end.';

    return 0;
  else
    log 'MySQL is stopped.';
    log 'Func check_mysqld is end.';

    return 1;
  fi
}

# 启动 mysql
function start_mysql() 
{
  log 'Func start_mysql is runnig.';

  log 'Start checking if MySQL is enabled.';
  check_mysqld;
  check_mysqld_status=$?;
  log 'Check if MySQL is enabled to complete.';

  if [[ $check_mysqld_status != '0' ]];
  then
    log 'Start starting MySQL.';
    $server_mysql start;
    if [[ $? == '0' ]];
    then
      log 'Succeed to start MySQL.';
      log 'Func start_mysql is end.';

      return 0;
    else
      log 'Failed to start MySQL.';
      log 'Func start_mysql is end.';

      return 1;
    fi
  fi

  log 'Func start_mysql is end.';
}

# 查询 mysql 端口号
function query_mysql_port() 
{
  log 'Func query_mysql_port is runnig.';

  port_mysql=$($cmd_mysql -D mysql -e 'show global variables like "port";' | grep -o '[0-9]*');
  if [[ $port_mysql != '' ]];
  then
    log 'Succeed to query MySQL port.';
    log 'Func query_mysql_port is end.';

    return 0;
  else
    log 'Failed to query MySQL port.';
    log 'Func query_mysql_port is end.';

    return 1;
  fi
}

# 检查 mysql 端口是否开放
function check_mysql_port()
{
  log 'Func check_mysql_port is runnig.';

  lsof -i:$port_mysql;
  if [[ $? != '' ]];
  then
    log "MySQL port($port_mysql) is opened.";
    log 'Func check_mysql_port is end.';

    return 0;
  else
    log "MySQL port($port_mysql) is closed.";
    log 'Func check_mysql_port is end.';

    return 1;
  fi
}

# 检查 express 后台程序端口是否开放
function check_express_port()
{
  log 'Func check_express_port is runnig.';

  lsof -i:$port_express;
  if [[ $? != '' ]];
  then
    log "Express port($port_express) is opened.";
    log 'Func check_express_port is end.';

    return 0;
  else
    log "Express port($port_express) is closed.";
    log 'Func check_express_port is end.';

    return 1;
  fi
}

function open_ports()
{
  log 'Func open_ports is runnig.';

  check_mysql_port;
  if [[ $? != '0' ]];
  then
    log "Start opening MySQL port($port_mysql).";
    iptables -I INPUT -p TCP --dport $port_mysql -j ACCEPT;
    if [[ $? == '0' ]];
    then
      log "Succeed to open MySQL port($port_mysql).";
    else
      log "Failed to open MySQL port($port_mysql). You need to open $port_mysql port that connect MySQL.";
      log 'Func open_ports is end.';

      return 2;
    fi
  fi

  check_express_port;
  if [[ $? != '0' ]];
  then
    log "Start opening express port($port_express).";
    iptables -I INPUT -p TCP --dport $port_express -j ACCEPT;
    if [[ $? == '0' ]];
    then
      log "Succeed to open express port($port_express).";
    else
      log "Failed to open express port($port_express). You need to open $port_express port that connect App.";
      log 'Func open_ports is end.';

      return 3;
    fi
  fi

  log 'Func open_ports is end.';

  return 0;
}

function start_app()
{
  log 'Func start_app is runnig.';

  node express_path;
  if [[ $? != '0' ]];
  then
    log 'Failed to start App.';
    return 1;
  fi

  log 'Func open_ports is end.';

  return 0;
}

# 入口函数
function main() 
{
  log 'Start running scripts.';

  start_mysql;
  if [[ $? != '0' ]];
  then
    log 'Failed to start MySQL. Program exit with 1.';
    exit 1;
  fi

  open_ports;
  if [[ $? == '2' ]];
  then
    log "Failed to open MySQL port($port_mysql). Program exit with 1.";
    exit 1;
  elif [[ $? == '3' ]]
    log "Failed to open express port($port_express). Program exit with 1.";
    exit 1;
  fi

  start_app;
  if [[ $? != '0' ]];
  then
    log 'Failed to start App. Program exit with 1.';
    exit 1;
  fi

  log 'App run succeed.';
}

main;