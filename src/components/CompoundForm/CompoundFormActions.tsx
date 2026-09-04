import React from "react";
import { FiChevronLeft, FiChevronRight, FiSave, FiCheck } from "react-icons/fi";

interface CompoundFormActionsProps {
    currentStep: number;
    isLastStep: boolean;
    isSavingDraft: boolean;
    isEdit?: boolean;
    handleBack: () => void;
    handleSaveDraftClick: () => void;
    handleNext: () => void;
    handleDone: () => void;
}

export const CompoundFormActions: React.FC<CompoundFormActionsProps> = ({
    currentStep,
    isLastStep,
    isSavingDraft,
    isEdit = false,
    handleBack,
    handleSaveDraftClick,
    handleNext,
    handleDone,
}) => {
    return (
        <div className="mt-8 py-6 flex items-center justify-between border-t border-slate-200 bg-transparent flex-wrap gap-4">
            <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 0}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border border-slate-200 ${
                    currentStep === 0
                        ? "bg-slate-50 text-slate-300 cursor-not-allowed opacity-50"
                        : "bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-800 cursor-pointer shadow-xs"
                }`}
            >
                <FiChevronLeft className="w-4 h-4" />
                Previous
            </button>

            <button
                type="button"
                onClick={handleSaveDraftClick}
                disabled={isSavingDraft}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-800 text-sm font-semibold transition-all disabled:opacity-50 cursor-pointer shadow-xs"
            >
                <FiSave className="w-4 h-4" />
                {isSavingDraft ? "Saving…" : "Save Draft"}
            </button>

            <div className="flex items-center gap-3">
                {isEdit && !isLastStep && (
                    <button
                        type="button"
                        onClick={handleDone}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold transition-all shadow-sm cursor-pointer"
                        title="Save all changes directly to the published database record"
                    >
                        <FiCheck className="w-4 h-4" />
                        Update Drug
                    </button>
                )}

                {!isLastStep ? (
                    <button
                        type="button"
                        onClick={handleNext}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0e8a67] text-white text-sm font-bold hover:bg-[#0c7557] transition-all shadow-sm cursor-pointer"
                    >
                        Next Tab
                        <FiChevronRight className="w-4 h-4" />
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleDone}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-all shadow-sm cursor-pointer"
                    >
                        <FiCheck className="w-4 h-4" />
                        {isEdit ? "Update Drug" : "Submit"}
                    </button>
                )}
            </div>
        </div>
    );
};
