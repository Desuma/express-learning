import process from 'process';

export const isDev = (): boolean => process.env.MODE?.trim() === 'development';

export default isDev;