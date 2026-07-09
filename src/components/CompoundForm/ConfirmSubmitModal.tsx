import React from "react";
import { createPortal } from "react-dom";
import { FiAlertTriangle, FiX } from "react-icons/fi";

interface ConfirmSubmitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const ConfirmSubmitModal: React.FC<ConfirmSubmitModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
}) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm animate-fade-in text-left">
            <div className="bg-white rounded-2xl shadow-2xl border border-border-main max-w-md w-full overflow-hidden animate-scale-up">
                {/* Modal header */}
                <div className="px-6 pt-6 pb-4 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0 animate-pulse-slow">
                        <FiAlertTriangle className="w-6 h-6 text-amber-500" />
                    </div>
                    <div className="flex-1 min-w-0 pr-6">
                        <h3 className="text-lg font-bold text-main font-display mb-1">
                            Review & Submit
                        </h3>
                        <p className="text-sm text-body leading-relaxed">
                            Please review all your entries before submitting. This action will create a new drug record. Are you sure you want to proceed?
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
                        className="px-5 py-2.5 rounded-xl border border-border-main bg-white text-main text-sm font-semibold hover:bg-alt transition-colors cursor-pointer shadow-sm"
                    >
                        Go Back
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-all duration-200 shadow-md hover:-translate-y-0.5 cursor-pointer"
                    >
                        Yes, Submit
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};
