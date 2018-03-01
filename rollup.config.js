// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs'
  },
  plugins: [
    resolve({
      // pass custom options to the resolve plugin
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    }),
    babel({
      exclude: 'node_modules/**'
    })
  ],
  // indicate which modules should be treated as external
  external: ['redux', 'react-redux']
};