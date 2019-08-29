// rollup.config.js
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import {terser} from "rollup-plugin-terser";
import replace from 'rollup-plugin-replace';

function babelPresets(polyfill) {
  const presetOptions = {
    targets: {
      "ie": 11
    }
  };
  if (polyfill) {
    presetOptions.useBuiltIns = "usage";
    presetOptions.corejs = "2";
  }
  return [["@babel/preset-env", presetOptions]];
}

const configs = [];
for (let minified of [true, false]) {
  for (let polyfill of [true, false]) {
    for (let output of [{
      file: `dist/js/dawa-autocomplete2.${polyfill ? '' : 'nopolyfill.'}${minified ? 'min.' : ''}js`,
      format: 'umd',
      name: 'dawaAutocomplete'
    }, {
      file: `dist/js/dawa-autocomplete2.es.${polyfill ? '' : 'nopolyfill.'}${minified ? 'min.' : ''}js`,
      format: 'es'
    }]) {
      const config = {
        input: 'src/dawa-autocomplete2.js',
        plugins: [
          resolve(),
          replace({
            'process.env.NODE_ENV': JSON.stringify('production')
          }),
          commonjs({}),
          babel({
            presets: babelPresets(polyfill),
            ignore: ['node_modules']
          }),
          ...(minified ? [terser({})] : [])
        ],
        output,

      };
      configs.push(config);
    }
  }
}
export default configs;
