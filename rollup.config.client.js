/* Should run from package root, so paths accordingly */
export default {
    input: 'build/client/client/main.js',
    output: {
        format: 'umd',
        file: 'static/public/mudbud.js',
        name: 'mudbud',
        sourcemap: 'inline',
        globals: {
            xterm: "window"
        }
    },
    external: [ 'xterm' ]
};
