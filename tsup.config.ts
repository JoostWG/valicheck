import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['./src'],
    outDir: './dist',
    dts: true,
    clean: true,
    minify: true,
    minifyWhitespace: true,
    minifyIdentifiers: true,
    minifySyntax: true,
});
