// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import istanbul from 'rollup-plugin-istanbul';
import pkg from './package.json';

export default {
  input: 'src/index.js',
  output: {
    file: pkg.main,
    format: 'cjs'
  },
  plugins: [
    resolve({
      // pass custom options to the resolve plugin
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    }),
    // istanbul({
    //   exclude: ['test/**']
    // }), TODO figure out coverage
    babel({
      exclude: 'node_modules/**'
    })
  ],
  // indicate which modules should be treated as external
  external: ['redux', 'react-redux']
};