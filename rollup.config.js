import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/lambda.ts",
  output: {
    file: "dist/lambda.js",
    format: "cjs",
  },
  plugins: [typescript()],
};
