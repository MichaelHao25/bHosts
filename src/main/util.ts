import { URL } from 'url';
import path from 'path';
import * as os from 'os';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export const getPlatform = () => {
  return os.platform();
};
export const getUserInfo = () => {
  return os.userInfo();
};
