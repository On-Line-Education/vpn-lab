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
    },
};
