"use strict";
exports.__esModule = true;
var ResolversBuilder = (function () {
    function ResolversBuilder() {
    }
    ResolversBuilder.prototype.build = function () {
        return {
            Query: {
                hello: function () { return "Hello world!"; }
            }
        };
    };
    return ResolversBuilder;
}());
exports["default"] = ResolversBuilder;
