"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = markdownToHtml;
const remark_1 = require("remark");
const remark_html_1 = __importDefault(require("remark-html"));
async function markdownToHtml(markdown) {
    const result = await (0, remark_1.remark)().use(remark_html_1.default).process(markdown);
    return result.toString();
}
//# sourceMappingURL=markdownToHtml.js.map