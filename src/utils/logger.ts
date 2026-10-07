import pc from 'picocolors';

export const logger = {
  info: (msg: string) => {
    console.log(`${pc.cyan('[INFO]')} ${msg}`);
  },
  success: (msg: string) => {
    console.log(`${pc.green('[SUCCESS]')} ${msg}`);
  },
  warn: (msg: string) => {
    console.warn(`${pc.yellow('[WARN]')} ${msg}`);
  },
  error: (msg: string, err?: any) => {
    console.error(`${pc.red('[ERROR]')} ${msg}`, err ? err : '');
  },
};
