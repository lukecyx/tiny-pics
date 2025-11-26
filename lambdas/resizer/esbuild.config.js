const esbuild = require("esbuild");

const { nodeExternalsPlugin } = require("esbuild-node-externals");
const tsconfigPathsPlugin = require("@esbuild-plugins/tsconfig-paths").default;

const fs = require("fs");
fs.rmSync("dist", { recursive: true, force: true });

esbuild
  .build({
    entryPoints: ["src/handler.ts"],
    bundle: true,
    platform: "node",
    target: "node22",
    outfile: "dist/handler.js",
    sourcemap: true,
    minify: false,
    external: ["@aws-sdk/*", "sharp"],
    plugins: [
      nodeExternalsPlugin(),
      tsconfigPathsPlugin({ tsconfig: "tsconfig.json" }),
    ],
    define: {
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "development",
      ),
    },
  })
  .catch(() => process.exit(1));
