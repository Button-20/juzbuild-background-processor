interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: "danger" | "warning" | "info";
    loading?: boolean;
}
declare const ConfirmModal: React.FC<ConfirmModalProps>;
export default ConfirmModal;
//# sourceMappingURL=ConfirmModal.d.ts.map