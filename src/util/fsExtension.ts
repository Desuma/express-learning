import fs from 'fs';
import path from 'path';

/**
 * 如果目录不存在，则创建目录。
 * @param dirname string 相对目录，src为根目录。
 * @return string 该目录的绝对目录。
 */
export const mkdirIfNotExits = (dirname: string) => {
  const dir = path.resolve(__dirname, '../', dirname);

  fs.existsSync(dir) || fs.mkdirSync(dir);

  return dir;
};

export const ifs = {
  mkdirIfNotExits,
  ...fs
}