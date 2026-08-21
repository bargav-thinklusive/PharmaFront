import React from "react";
import { FiCheck, FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface CompoundFormSidebarProps {
    steps: any[];
    currentStep: number;
    setCurrentStep: (index: number) => void;
    isSidebarExpanded: boolean;
    setIsSidebarExpanded: (expanded: boolean) => void;
    getStepStatus: (index: number) => string;
    getSubsectionStats: (index: number) => any;
    validateCurrentStep: () => boolean;
    setErrors: (errors: any) => void;
}

export const CompoundFormSidebar: React.FC<CompoundFormSidebarProps> = ({
    steps,
    currentStep,
    setCurrentStep,
    isSidebarExpanded,
    setIsSidebarExpanded,
    getStepStatus,
    getSubsectionStats,
    validateCurrentStep,
    setErrors,
}) => {
    const handleStepClick = (index: number) => {
        if (index < currentStep || validateCurrentStep()) {
            setCurrentStep(index);
            setErrors({});
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <div className={isSidebarExpanded ? "lg:col-span-3 lg:sticky lg:top-24" : "lg:col-span-1 lg:sticky lg:top-24"}>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col max-h-[calc(100vh-120px)] overflow-y-auto">
                {/* Sidebar Header with Arrow Toggle Button */}
                <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                        className="w-8 h-8 flex items-center justify-center border border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors shadow-xs"
                        title={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
                    >
                        {isSidebarExpanded ? (
                            <FiChevronLeft className="w-4 h-4 text-slate-600" />
                        ) : (
                            <FiChevronRight className="w-4 h-4 text-slate-600" />
                        )}
                    </button>
                </div>

                {/* Steps List */}
                {!isSidebarExpanded ? (
                    /* Collapsed steps list */
                    <nav className="hidden lg:flex flex-col items-center py-4 px-1 space-y-3">
                        {steps.map((step, index) => {
                            const isActive = index === currentStep;
                            const status = getStepStatus(index);
                            
                            let circleClass = "bg-transparent border-slate-300 text-slate-500";
                            if (isActive) {
                                circleClass = "bg-transparent border-amber-500 text-amber-500 font-bold ring-2 ring-amber-500/20";
                            } else if (status === "Completed") {
                                circleClass = "bg-[#0e8a67] border-[#0e8a67] text-white";
                            } else if (status === "In Progress") {
                                circleClass = "bg-transparent border-amber-500 text-amber-500";
                            }

                            return (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleStepClick(index);
                                    }}
                                    className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                                        isActive
                                            ? "bg-slate-50 text-slate-800 shadow-xs border border-slate-200"
                                            : "text-slate-400 hover:text-slate-800 hover:bg-slate-50"
                                    }`}
                                    title={step.title}
                                >
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all flex-shrink-0 ${circleClass}`}>
                                        {status === "Completed" && !isActive ? <FiCheck className="w-3.5 h-3.5" /> : index + 1}
                                    </div>
                                </button>
                            );
                        })}
                    </nav>
                ) : (
                    /* Expanded steps list */
                    <nav className="flex flex-col gap-1.5 mt-3">
                        {steps.map((step, index) => {
                            const isActive = index === currentStep;
                            const status = getStepStatus(index);
                            const stats = getSubsectionStats(index);
                            
                            let circleClass = "bg-transparent border-slate-300 text-slate-400 group-hover:border-slate-500 group-hover:text-slate-600";
                            let statusBadge = null;
                            let rowBg = "text-slate-600 hover:bg-slate-50 hover:text-slate-800";
                            
                            if (isActive) {
                                circleClass = "bg-transparent border-amber-500 text-amber-500 font-bold ring-2 ring-amber-500/20";
                                rowBg = "bg-slate-50 border-l-4 border-[#0e8a67] text-[#0e8a67] font-bold shadow-xs";
                                statusBadge = null;
                            } else if (status === "Completed") {
                                circleClass = "bg-[#0e8a67] border-[#0e8a67] text-white";
                                rowBg = "text-slate-800 hover:bg-slate-50";
                                statusBadge = (
                                    <div className="w-4 h-4 rounded-full bg-[#0e8a67] flex items-center justify-center text-white flex-shrink-0 shadow-xs">
                                        <FiCheck className="w-2.5 h-2.5 stroke-[3]" />
                                    </div>
                                );
                            } else if (status === "In Progress") {
                                circleClass = "bg-transparent border-amber-500 text-amber-500";
                                rowBg = "text-slate-700 hover:bg-slate-50";
                                statusBadge = null;
                            } else {
                                statusBadge = null;
                            }
                            
                            return (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => handleStepClick(index)}
                                    className={`w-full flex items-start justify-between gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer group ${rowBg}`}
                                >
                                    <div className="flex items-start gap-3 min-w-0">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all flex-shrink-0 ${circleClass}`}>
                                            {status === "Completed" && !isActive ? <FiCheck className="w-3.5 h-3.5" /> : index + 1}
                                        </div>
                                        <span className="leading-tight py-0.5 break-words">{step.title}</span>
                                    </div>
                                    <div className="flex-shrink-0 mt-0.5">
                                        {statusBadge}
                                    </div>
                                </button>
                            );
                        })}
                    </nav>
                )}
            </div>
        </div>
    );

};
