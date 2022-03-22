"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var VPN = __importStar(require("vpnrpc"));
var SoftEtherHub_1 = __importDefault(require("./SoftEtherHub"));
var SoftEtherUser_1 = __importDefault(require("./SoftEtherUser"));
var SoftEtherAPI = (function () {
    function SoftEtherAPI(localhost, port, password, hub_name, reject_untrust_cert) {
        if (hub_name === void 0) { hub_name = ""; }
        if (reject_untrust_cert === void 0) { reject_untrust_cert = false; }
        VPN.VpnServerRpc.SetDebugMode(true);
        this.api = new VPN.VpnServerRpc(localhost, port, hub_name, password, reject_untrust_cert);
        this.user = new SoftEtherUser_1["default"](this.api);
        this.hub = new SoftEtherHub_1["default"](this.api);
    }
    return SoftEtherAPI;
}());
exports["default"] = SoftEtherAPI;
