import React from "react";
import { GiPill } from "react-icons/gi";
import { formatDraftDate } from "../../utils/utils";

interface CompoundFormHeaderProps {
    drugName: string;
    drugId: string;
    cid?: string | number;
    version?: string | number;
    lastUpdated?: string | number;
    overallProgressPct: number;
    completedStepsCount: number;
    totalStepsCount: number;
}

export const CompoundFormHeader: React.FC<CompoundFormHeaderProps> = ({
    drugName,
    drugId,
    cid,
    version,
    lastUpdated,
    overallProgressPct,
    completedStepsCount,
    totalStepsCount,
}) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-sm">
            {/* Left side: drug icon & info */}
            <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-[#0e8a67] flex-shrink-0 shadow-sm">
                    {/* Pill icon */}
                    <GiPill className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <h2 className="text-xl font-extrabold text-slate-800 font-display truncate leading-tight py-0.5">
                            {drugName || "New Drug Entry"}
                        </h2>
                        <span className="bg-green-50 text-[#0e8a67] border border-green-200 text-xs font-semibold px-2 py-0.5 rounded-md flex-shrink-0 shadow-sm">
                            Approved Drug
                        </span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium mt-1 flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-slate-700">Drug ID: {drugId || cid || "D004"}</span>
                        {cid && drugId && String(drugId) !== String(cid) && (
                            <span className="font-semibold text-slate-600">(CID: {cid})</span>
                        )}
                        <span>&nbsp;|&nbsp;</span>
                        <span className="font-semibold text-slate-700">Version: {version || "1.0"} (Draft)</span>
                        <span>&nbsp;|&nbsp; Last Updated: {formatDraftDate(lastUpdated || Date.now())}</span>
                    </div>
                </div>
            </div>

            {/* Overall Progress Section */}
            <div className="flex flex-col md:flex-row items-center gap-6 md:max-w-xl w-full">
                <div className="flex items-center gap-5 w-full">
                    <div className="flex flex-col items-start gap-1 w-full">
                        <div className="flex items-baseline justify-between w-full text-xs text-slate-500 font-semibold">
                            <span className="font-medium">Overall Progress</span>
                            <span className="text-slate-800 text-sm font-extrabold font-display">
                                {overallProgressPct}%
                            </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                            <div
                                className="h-full bg-[#0e8a67] transition-all duration-500 ease-in-out rounded-full"
                                style={{ width: `${overallProgressPct}%` }}
                            />
                        </div>
                    </div>
                    <div className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200/60 shadow-xs whitespace-nowrap">
                        {completedStepsCount} of {totalStepsCount} completed
                    </div>
                </div>
            </div>
        </div>
    );
};
