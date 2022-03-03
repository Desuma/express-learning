import multer from 'multer';

import { mkdirIfNotExits } from './fsExtension';

/**
 * 生成文件存储池
 */
export const storage = multer.diskStorage({
  destination: function (_req, _file, next) {
    /**
     * 参数1: null 表示不修改数据流
     */
    next(null, mkdirIfNotExits('./files'));
  },
  filename: function (_req, file, next) {
    /**
     * 使用原本的文件名
     */
    next(null, file.originalname);
  }
});

/**
 * 配置文件接收器
 */
export const files = multer({ storage: storage });

/**
 * 得到文件处理函数，该函数接受
 */
export const onUpload = files.any();

export const fileStorage = {
  storage,
  onUpload,
  files
};

export default fileStorage;