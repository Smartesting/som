const esbuild = require("esbuild");
const { execSync } = require("child_process");

esbuild.build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    format: "iife",
    outfile: "dist/som.js",
    minify: true,
    sourcemap: true
}).catch(() => process.exit(1));

execSync("tsc --emitDeclarationOnly", { stdio: "inherit" });
