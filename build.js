const esbuild = require("esbuild");

esbuild.build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    format: "esm",
    outfile: "dist/som.js",
    minify: true,
    sourcemap: true
}).catch(() => process.exit(1));
