import React from "react";
import { FiChevronLeft, FiChevronRight, FiSave, FiCheck } from "react-icons/fi";

interface CompoundFormActionsProps {
    currentStep: number;
    isLastStep: boolean;
    isSavingDraft: boolean;
    handleBack: () => void;
    handleSaveDraftClick: () => void;
    handleNext: () => void;
    handleDone: () => void;
}

export const CompoundFormActions: React.FC<CompoundFormActionsProps> = ({
    currentStep,
    isLastStep,
    isSavingDraft,
    handleBack,
    handleSaveDraftClick,
    handleNext,
    handleDone,
}) => {
    return (
        <div className="mt-8 py-6 flex items-center justify-between border-t border-slate-200 bg-transparent">
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

            {!isLastStep ? (
                <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0e8a67] text-white text-sm font-bold hover:bg-[#0c7557] transition-all shadow-sm cursor-pointer"
                >
                    Save & Continue
                    <FiChevronRight className="w-4 h-4" />
                </button>
            ) : (
                <button
                    type="button"
                    onClick={handleDone}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-all shadow-sm cursor-pointer"
                >
                    <FiCheck className="w-4 h-4" />
                    Submit
                </button>
            )}
        </div>
    );
};
