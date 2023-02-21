import { readFile, writeFile } from 'fs/promises';
import child_process from 'child_process';
import { getPlatform } from '../util';
import { ISetHostProps } from '../../public/actions/IHostsEventType';

const platform = getPlatform();

export const HostsUrl =
  platform === 'win32' ? 'C:/Windows/System32/drivers/etc/hosts' : '/etc/hosts';

export const getHost = (): Promise<string> => {
  return readFile(HostsUrl).then((res) => {
    return res.toString();
  });
};

interface IUpdateChmodProps {
  password: string;
  url: string;
  promiseCode: number;
}

const updateChmodPromiseCode = (props: IUpdateChmodProps): Promise<string> => {
  const { password, url, promiseCode } = props;
  return new Promise((resolve, reject) => {
    child_process.exec(
      `echo "${password}" | sudo -S chmod ${promiseCode} ${url}`,
      (error, stdout) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      }
    );
  });
};

export const setHost = (props: ISetHostProps): Promise<any> => {
  const { host, password } = props;

  return updateChmodPromiseCode({
    password,
    promiseCode: 777,
    url: HostsUrl,
  })
    .then((res) => {
      return writeFile(HostsUrl, host);
    })
    .then(() => {
      return updateChmodPromiseCode({
        password,
        promiseCode: 644,
        url: HostsUrl,
      });
    });
};
