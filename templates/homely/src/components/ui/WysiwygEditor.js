"use client";
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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("@uiw/react-markdown-preview/markdown.css");
require("@uiw/react-md-editor/markdown-editor.css");
const dynamic_1 = __importDefault(require("next/dynamic"));
const react_1 = __importStar(require("react"));
// Dynamically import MDEditor to avoid SSR issues
const MDEditor = (0, dynamic_1.default)(() => import("@uiw/react-md-editor"), {
    ssr: false,
    loading: () => ((0, jsx_runtime_1.jsx)("div", { className: "h-64 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" })),
});
const WysiwygEditor = ({ value, onChange, placeholder = "Write your content here...", className = "", error = false, onImageUpload, }) => {
    const [mounted, setMounted] = (0, react_1.useState)(false);
    // Set mounted state after component mounts
    react_1.default.useEffect(() => {
        setMounted(true);
    }, []);
    // Handle image paste/drop functionality
    const handleImageUpload = (0, react_1.useCallback)(async (file) => {
        if (!onImageUpload) {
            return Promise.resolve("");
        }
        try {
            const imageUrl = await onImageUpload(file);
            return imageUrl;
        }
        catch (error) {
            console.error("Image upload failed:", error);
            throw error;
        }
    }, [onImageUpload]);
    // Handle paste events for image uploads
    const handlePaste = (0, react_1.useCallback)(async (event) => {
        const items = event.clipboardData?.items;
        if (!items || !onImageUpload)
            return;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.type.indexOf("image/") === 0) {
                event.preventDefault();
                const file = item.getAsFile();
                if (file) {
                    try {
                        const imageUrl = await handleImageUpload(file);
                        const imageMarkdown = `![Image](${imageUrl})`;
                        // Insert the image markdown at the current cursor position
                        const textarea = event.target;
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const newValue = value.substring(0, start) +
                            imageMarkdown +
                            value.substring(end);
                        onChange(newValue);
                    }
                    catch (error) {
                        console.error("Failed to upload pasted image:", error);
                    }
                }
                break;
            }
        }
    }, [value, onChange, handleImageUpload, onImageUpload]);
    // Handle drag and drop for images
    const handleDrop = (0, react_1.useCallback)(async (event) => {
        if (!onImageUpload)
            return;
        const files = event.dataTransfer?.files;
        if (!files)
            return;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type.indexOf("image/") === 0) {
                event.preventDefault();
                try {
                    const imageUrl = await handleImageUpload(file);
                    const imageMarkdown = `![${file.name}](${imageUrl})`;
                    // Append the image markdown to the current content
                    const newValue = value + (value ? "\n\n" : "") + imageMarkdown;
                    onChange(newValue);
                }
                catch (error) {
                    console.error("Failed to upload dropped image:", error);
                }
            }
        }
    }, [value, onChange, handleImageUpload, onImageUpload]);
    if (!mounted) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "h-64 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: `wysiwyg-editor ${className} ${error ? "error" : ""}`, children: [(0, jsx_runtime_1.jsx)("style", { jsx: true, global: true, children: `
        .wysiwyg-editor {
          min-height: 200px;
        }

        .wysiwyg-editor .w-md-editor {
          background-color: transparent;
        }

        .wysiwyg-editor .w-md-editor-text-textarea,
        .wysiwyg-editor .w-md-editor-text {
          min-height: 200px !important;
          font-size: 14px;
          line-height: 1.5;
        }

        .wysiwyg-editor .w-md-editor-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          border-color: rgb(209 213 219);
        }

        .wysiwyg-editor .w-md-editor {
          border-radius: 0.5rem;
          border-color: rgb(209 213 219);
        }

        /* Dark mode styles */
        .dark .wysiwyg-editor .w-md-editor {
          background-color: rgb(55 65 81);
          border-color: rgb(75 85 99);
          color: rgb(243 244 246);
        }

        .dark .wysiwyg-editor .w-md-editor-toolbar {
          background-color: rgb(55 65 81);
          border-color: rgb(75 85 99);
        }

        .dark .wysiwyg-editor .w-md-editor-text-textarea,
        .dark .wysiwyg-editor .w-md-editor-text {
          background-color: rgb(55 65 81);
          color: rgb(243 244 246);
        }

        /* Error styles */
        .wysiwyg-editor.error .w-md-editor {
          border-color: rgb(239 68 68);
        }

        .wysiwyg-editor.error .w-md-editor-toolbar {
          border-color: rgb(239 68 68);
        }

        /* Focus styles */
        .wysiwyg-editor .w-md-editor:focus-within {
          border-color: rgb(59 130 246);
          box-shadow: 0 0 0 1px rgb(59 130 246);
        }

        .dark .wysiwyg-editor .w-md-editor:focus-within {
          border-color: rgb(96 165 250);
          box-shadow: 0 0 0 1px rgb(96 165 250);
        }
      ` }), (0, jsx_runtime_1.jsx)(MDEditor, { value: value, onChange: (val) => onChange(val || ""), preview: "edit", hideToolbar: false, visibleDragbar: false, textareaProps: {
                    placeholder,
                    style: { minHeight: 200 },
                    onPaste: handlePaste,
                    onDrop: handleDrop,
                    onDragOver: (e) => e.preventDefault(),
                }, height: 300 }), onImageUpload && ((0, jsx_runtime_1.jsx)("div", { className: "mt-2 text-sm text-gray-500 dark:text-gray-400", children: "\uD83D\uDCA1 Tip: You can paste or drag & drop images directly into the editor to upload them automatically." }))] }));
};
exports.default = WysiwygEditor;
//# sourceMappingURL=WysiwygEditor.js.map