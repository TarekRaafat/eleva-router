import { babel } from "@rollup/plugin-babel";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import pkg from "./package.json" assert { type: "json" };

export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/eleva-router.umd.js",
      format: "umd",
      name: "ElevaRouter",
      exports: "default",
      sourcemap: true,
      banner: `/* eleva-router v${pkg.version} | MIT License */`,
    },
    {
      file: "dist/eleva-router.esm.js",
      format: "es",
      name: "ElevaRouter",
      exports: "default",
      sourcemap: true,
      banner: `/* eleva-router v${pkg.version} | MIT License */`,
    },
    {
      file: "dist/eleva-router.min.js",
      format: "umd",
      name: "ElevaRouter",
      exports: "default",
      sourcemap: true,
      plugins: [terser()],
    },
  ],
  plugins: [
    nodeResolve(),
    commonjs(),
    babel({
      babelHelpers: "bundled",
      presets: [
        [
          "@babel/preset-env",
          {
            targets: "> 0.25%, not dead",
            bugfixes: true,
            loose: true,
          },
        ],
      ],
    }),
  ],
};
