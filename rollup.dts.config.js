import dts from "rollup-plugin-dts";

export default {
  input: "types/index.d.ts", // Entry point for your declarations
  output: {
    file: "dist/eleva-router.d.ts", // Bundled output file
    format: "es",
  },
  plugins: [dts()],
};
