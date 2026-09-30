export interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export interface IConfirmModalProps extends IModalProps {
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
}
