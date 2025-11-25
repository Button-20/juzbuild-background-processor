interface ImageUploadProps {
    value?: string;
    onChange: (url: string, alt?: string) => void;
    onRemove: () => void;
    disabled?: boolean;
    className?: string;
    placeholder?: string;
    showAltText?: boolean;
    isMain?: boolean;
    onMainToggle?: (isMain: boolean) => void;
}
export default function ImageUpload({ value, onChange, onRemove, disabled, className, placeholder, showAltText, isMain, onMainToggle, }: ImageUploadProps): any;
export {};
//# sourceMappingURL=ImageUpload.d.ts.map