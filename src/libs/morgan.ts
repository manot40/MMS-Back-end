import morgan from 'morgan';

const rfs = require('rotating-file-stream');

const logFormat = '[:date[web]] :method :status :url :user-agent :response-time ms';
const logStream = rfs.createStream('access.log', {
  interval: '1d',
  maxFiles: 30,
  path: 'logs',
  size: '5M',
});

const isDev = process.env.NODE_ENV == 'development' && 'dev';

export default morgan(isDev || logFormat, {
  stream: isDev ? undefined : logStream,
  skip(_, res) {
    return res.statusCode < 400;
  },
});
