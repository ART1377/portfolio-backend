"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPass = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const hashPass = () => {
    bcrypt_1.default.hash("121212", 10).then((hash) => console.log("hash passss", hash));
};
exports.hashPass = hashPass;
