import { babel } from "@rollup/plugin-babel";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import pkg from "./package.json" with { type: "json" };

const name = "ElevaRouter";
const banner = `/*! ${name} v${pkg.version} | ${pkg.license} License | ${pkg.homepage} */`;

const commonOutputConfig = {
  name,
  sourcemap: true,
  banner,
};

const terserConfig = {
  compress: {
    passes: 2,
    drop_console: true,
    drop_debugger: true,
    pure_funcs: ["console.log", "console.warn"],
    unsafe_arrows: true,
    unsafe_methods: true,
    unsafe_proto: true,
    keep_fargs: false,
    toplevel: true,
    pure_getters: true,
    reduce_vars: true,
    collapse_vars: true,
  },
  mangle: {
    toplevel: true,
  },
  format: {
    comments: /^!/,
  },
};

const commonPlugins = [
  nodeResolve({
    browser: true,
  }),
  babel({
    babelHelpers: "bundled",
    exclude: "node_modules/**",
    presets: [
      [
        "@babel/preset-env",
        {
          targets: pkg.browserslist,
          bugfixes: true,
          loose: true,
          modules: false,
          useBuiltIns: false,
          corejs: false,
        },
      ],
    ],
  }),
];

export default {
  input: "src/index.js",
  output: [
    {
      ...commonOutputConfig,
      file: "./dist/eleva-router.cjs.js",
      format: "cjs",
      exports: "default",
    },
    {
      ...commonOutputConfig,
      file: "./dist/eleva-router.esm.js",
      format: "es",
      exports: "default",
    },
    {
      ...commonOutputConfig,
      file: "./dist/eleva-router.umd.js",
      format: "umd",
    },
    {
      ...commonOutputConfig,
      file: "./dist/eleva-router.umd.min.js",
      format: "umd",
      plugins: [terser(terserConfig)],
    },
  ],
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false,
    annotations: false,
    unknownGlobalSideEffects: false,
  },
  plugins: [
    ...commonPlugins
  ],
};
