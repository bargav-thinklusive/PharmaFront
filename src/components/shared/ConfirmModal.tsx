import React from "react";
import { createPortal } from "react-dom";
import { FiX, FiInfo, FiTrash2, FiSave, FiSend } from "react-icons/fi";

export interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    icon?: React.ReactNode;
    iconBgColor?: string;
    confirmButtonColor?: string;
    isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    icon,
    iconBgColor = "bg-primary-light border-primary/30",
    confirmButtonColor = "bg-primary hover:bg-primary-hover",
    isLoading = false,
}) => {
    if (!isOpen) return null;

    const defaultIcon = icon || <FiInfo className="w-6 h-6 text-primary" />;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm animate-fade-in text-left">
            <div className="bg-white rounded-2xl shadow-2xl border border-border-main max-w-md w-full overflow-hidden animate-scale-up">
                {/* Modal header */}
                <div className="px-6 pt-6 pb-4 flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full border flex items-center justify-center flex-shrink-0 ${iconBgColor}`}>
                        {defaultIcon}
                    </div>
                    <div className="flex-1 min-w-0 pr-6">
                        <h3 className="text-lg font-bold text-main font-display mb-1">
                            {title}
                        </h3>
                        <p className="text-sm text-body leading-relaxed">
                            {description}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-body hover:text-main hover:bg-alt transition-colors cursor-pointer border-0"
                        aria-label="Close"
                    >
                        <FiX className="w-4 h-4" />
                    </button>
                </div>

                {/* Modal actions */}
                <div className="px-6 pb-6 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-5 py-2.5 rounded-xl border border-border-main bg-white text-main text-sm font-semibold hover:bg-alt transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-200 shadow-md hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 ${confirmButtonColor}`}
                    >
                        {isLoading ? "Processing..." : confirmText}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

// Convenient Specialized Reusable Modal Wrappers
export const DeleteConfirmModal: React.FC<Partial<ConfirmModalProps> & { isOpen: boolean; onClose: () => void; onConfirm: () => void }> = (props) => (
    <ConfirmModal
        title="Delete Confirmation"
        description="Are you sure you want to delete this record? This action cannot be undone."
        confirmText="Yes, Delete"
        icon={<FiTrash2 className="w-6 h-6 text-red-500" />}
        iconBgColor="bg-red-50 border-red-200"
        confirmButtonColor="bg-red-600 hover:bg-red-700"
        {...props}
    />
);

export const SaveDraftModal: React.FC<Partial<ConfirmModalProps> & { isOpen: boolean; onClose: () => void; onConfirm: () => void }> = (props) => (
    <ConfirmModal
        title="Save Draft"
        description="Are you sure you want to save this draft? You can reload your draft anytime from the header menu."
        confirmText="Yes, Save"
        icon={<FiSave className="w-6 h-6 text-amber-500" />}
        iconBgColor="bg-amber-50 border-amber-200"
        confirmButtonColor="bg-amber-500 hover:bg-amber-600"
        {...props}
    />
);

export const ConfirmSubmitModal: React.FC<Partial<ConfirmModalProps> & { isOpen: boolean; onClose: () => void; onConfirm: () => void }> = (props) => (
    <ConfirmModal
        title="Submit Confirmation"
        description="Are you sure you want to submit this entry?"
        confirmText="Yes, Submit"
        icon={<FiSend className="w-6 h-6 text-primary" />}
        iconBgColor="bg-primary-light border-primary/30"
        confirmButtonColor="bg-primary hover:bg-primary-hover"
        {...props}
    />
);
