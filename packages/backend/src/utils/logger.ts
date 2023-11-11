import debug from 'debug';

const createLogger = (suffix: string = '') =>
  debug(`backend${suffix ? `:${suffix}` : ''}`);

export const launchLogger = createLogger('launch');
export const infoLogger = createLogger('info');
export const fatalLogger = createLogger('fatal');
export const errorLogger = createLogger('error');
export const warnLogger = createLogger('warning');
export const requestLogger = createLogger('verbose:request');
export const responseLogger = createLogger('verbose:response');
