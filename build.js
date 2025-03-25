import esbuild from 'esbuild'
import { execSync } from 'node:child_process'

esbuild
  .build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    format: 'iife',
    outfile: 'dist/som.js',
    minify: true,
    sourcemap: true,
    drop: []
  })
  .catch(() => process.exit(1))

execSync('tsc --emitDeclarationOnly', { stdio: 'inherit' })
