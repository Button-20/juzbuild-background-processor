import "@uiw/react-markdown-preview/markdown.css";
import "@uiw/react-md-editor/markdown-editor.css";
import React from "react";
interface WysiwygEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    error?: boolean;
    onImageUpload?: (file: File) => Promise<string>;
}
declare const WysiwygEditor: React.FC<WysiwygEditorProps>;
export default WysiwygEditor;
//# sourceMappingURL=WysiwygEditor.d.ts.map