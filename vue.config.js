module.exports = {
    lintOnSave: false,
    outputDir: "./dist/client",
    pages: {
        index: {
            entry: "./client/main.ts",
        },
    },
    devServer: {
        https: false,
    },
};