const path = require('path');
const dayjs = require('dayjs');
const esbuild = require('esbuild');
const nodemon = require('nodemon');
const chokidar = require('chokidar');

const workDir = process.cwd();
const isDev = process.argv.includes('--dev');
const pkg = require(path.resolve('./package.json'));

/**
 * @type {import('esbuild').BuildOptions}
 */
const esbConfig = {
  format: 'cjs',
  bundle: !isDev,
  minify: !isDev,
  sourcemap: true,
  target: 'node16',
  platform: 'node',
  incremental: isDev,
  outdir: path.join(workDir, isDev ? '/build' : '/dist'),
};

/**
 * @type {import('nodemon').Settings}
 */
const nmonConfig = {
  ext: 'json,js',
  watch: ['build/'],
  restartable: 'rs',
  env: { NODE_ENV: 'development' },
  exec: 'node --enable-source-maps build',
};

if (isDev) {
  /**
   * @type {import('esbuild').BuildResult}
   */
  let result;
  /**
   * @type {import('nodemon')}
   */
  let nmon;

  esbConfig.entryPoints = [];

  chokidar
    .watch('./src/**/*.ts')
    .on('add', async (file) => {
      esbConfig.entryPoints.push(path.join(workDir, file));
      if (result) {
        result = await esbuild.build(esbConfig);
        log(file, 'added, restarting server');
      }
    })
    .on('change', async (file) => {
      await result.rebuild();
      log(file, 'changed, restarting server');
    })
    .on('ready', async () => {
      result = await esbuild.build(esbConfig).catch(() => process.exit(1));
      console.log('Running in development mode. Watching for changes...');
      nmon = nodemon(nmonConfig);
    });
} else {
  esbConfig.entryPoints = [`${workDir}/src/index.ts`];
  esbConfig.external = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})];
  esbuild.build(esbConfig).catch(() => process.exit(1));
}

var log = (...msg) => console.log(`[${dayjs().format('DD/MM/YY HH:mm:ss')}]`, ...msg);
