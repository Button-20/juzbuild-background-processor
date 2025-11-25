"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ImageUpload;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_hot_toast_1 = require("react-hot-toast");
function ImageUpload({ value, onChange, onRemove, disabled = false, className = "", placeholder = "Click to upload image", showAltText = true, isMain = false, onMainToggle, }) {
    const [uploading, setUploading] = (0, react_1.useState)(false);
    const [altText, setAltText] = (0, react_1.useState)("");
    const [dragOver, setDragOver] = (0, react_1.useState)(false);
    // Generate consistent IDs for form elements
    const mainImageId = (0, react_1.useMemo)(() => `main-image-${Math.random().toString(36).substr(2, 9)}`, []);
    const fileInputId = (0, react_1.useMemo)(() => `file-upload-${Math.random().toString(36).substr(2, 9)}`, []);
    const handleFileUpload = async (file) => {
        // Validate file type
        if (!file.type.startsWith("image/")) {
            react_hot_toast_1.toast.error("Please select an image file");
            return;
        }
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            react_hot_toast_1.toast.error("Image size should be less than 10MB");
            return;
        }
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            if (response.ok) {
                const data = await response.json();
                onChange(data.url, altText || file.name);
                react_hot_toast_1.toast.success("Image uploaded successfully!");
            }
            else {
                const error = await response.json();
                react_hot_toast_1.toast.error(error.error || "Upload failed");
            }
        }
        catch (error) {
            console.error("Upload error:", error);
            react_hot_toast_1.toast.error("Upload failed");
        }
        finally {
            setUploading(false);
        }
    };
    const handleInputChange = async (event) => {
        const file = event.target.files?.[0];
        if (file) {
            await handleFileUpload(file);
        }
    };
    const handleDrop = async (event) => {
        event.preventDefault();
        setDragOver(false);
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            await handleFileUpload(files[0]);
        }
    };
    const handleDragOver = (event) => {
        event.preventDefault();
        setDragOver(true);
    };
    const handleDragLeave = (event) => {
        event.preventDefault();
        setDragOver(false);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: `space-y-4 ${className}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col space-y-2", children: [value ? ((0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("img", { src: value, alt: "Property", className: "w-full h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-600" }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: onRemove, disabled: disabled, className: "absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-lg transition-colors", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) }), isMain && ((0, jsx_runtime_1.jsx)("div", { className: "absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium", children: "Main Image" }))] })) : ((0, jsx_runtime_1.jsxs)("div", { className: `flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${dragOver
                            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                            : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`, onDrop: handleDrop, onDragOver: handleDragOver, onDragLeave: handleDragLeave, children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: fileInputId, className: `flex flex-col items-center justify-center pt-5 pb-6 w-full h-full ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`, children: uploading ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Uploading..." })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("svg", { className: `w-8 h-8 mb-4 transition-colors duration-200 ${dragOver
                                                ? "text-indigo-500"
                                                : "text-gray-500 dark:text-gray-400"}`, "aria-hidden": "true", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 20 16", children: (0, jsx_runtime_1.jsx)("path", { stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" }) }), (0, jsx_runtime_1.jsxs)("p", { className: `mb-2 text-sm transition-colors duration-200 ${dragOver
                                                ? "text-indigo-600 dark:text-indigo-400"
                                                : "text-gray-500 dark:text-gray-400"}`, children: [(0, jsx_runtime_1.jsx)("span", { className: "font-semibold", children: "Click to upload" }), " or drag and drop"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: "PNG, JPG, JPEG or WEBP (MAX. 10MB)" })] })) }), (0, jsx_runtime_1.jsx)("input", { id: fileInputId, type: "file", className: "hidden", accept: "image/*", onChange: handleInputChange, disabled: disabled || uploading })] })), uploading && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center space-x-2 py-2", children: [(0, jsx_runtime_1.jsxs)("svg", { className: "animate-spin h-5 w-5 text-indigo-600", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [(0, jsx_runtime_1.jsx)("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), (0, jsx_runtime_1.jsx)("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Uploading..." })] }))] }), showAltText && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300", children: "Alt Text (for accessibility)" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: altText, onChange: (e) => setAltText(e.target.value), disabled: disabled, className: "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500", placeholder: "Describe the image for screen readers" })] })), onMainToggle && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", id: mainImageId, checked: isMain, onChange: (e) => onMainToggle(e.target.checked), disabled: disabled, className: "rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" }), (0, jsx_runtime_1.jsx)("label", { htmlFor: mainImageId, className: "ml-2 text-sm text-gray-700 dark:text-gray-300", children: "Set as main image" })] }))] }));
}
//# sourceMappingURL=ImageUpload.js.map