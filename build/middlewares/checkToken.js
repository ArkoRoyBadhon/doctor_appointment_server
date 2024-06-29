"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidToekn = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isValidToekn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getToken = req.header("Authorization");
        if (!getToken)
            return res.status(400).json({ msg: "Invalid Authentication." });
        const token = getToken.split(" ")[1];
        if (!token) {
            return res.status(204).json({
                success: false,
                message: "No token",
            });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
        if (!decoded)
            return res.status(400).json({ msg: "Invalid Authentication." });
        req.userInfo = decoded.user;
        next();
    }
    catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});
exports.isValidToekn = isValidToekn;
