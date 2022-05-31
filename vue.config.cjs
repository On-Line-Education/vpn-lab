module.exports = {
    lintOnSave: false,
    outputDir: "./dist/client",
    pages: {
        index: {
            entry: "./client/main.js",
        },
    },
    devServer: {
        https: false,
        allowedHosts: ['all']   // needs to be changed to .oedu.pl
    },
};
