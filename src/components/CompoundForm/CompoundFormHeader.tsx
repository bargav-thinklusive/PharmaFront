import React from "react";
import { GiPill } from "react-icons/gi";
import { FiUser, FiClock } from "react-icons/fi";
import { formatDraftDate } from "../../utils/utils";

interface CompoundFormHeaderProps {
    drugName: string;
    drugId: string;
    cid?: string | number;
    version?: string | number;
    createdBy?: string;
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
    createdBy,
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
                    <div className="text-[11px] text-slate-500 font-medium mt-1.5 flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-[#0e8a67] bg-green-50/80 px-2 py-0.5 rounded border border-green-200/60">CID: {cid || "D001"}</span>
                        {drugId && String(drugId) !== String(cid) && (
                            <span className="font-medium text-slate-400">(ID: {String(drugId).length === 24 ? String(drugId).slice(-6) : drugId})</span>
                        )}
                        <span className="text-slate-300">|</span>
                        <span className="font-semibold text-slate-700">Version: {version || "1.0"} (Draft)</span>
                        <span className="text-slate-300">|</span>
                        <span className="inline-flex items-center gap-1 text-slate-600">
                            <FiUser className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-slate-500">Created by:</span>
                            <span className="font-semibold text-slate-800">{createdBy || "testadmin"}</span>
                        </span>
                        <span className="text-slate-300">|</span>
                        <span className="inline-flex items-center gap-1 text-slate-600">
                            <FiClock className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-slate-500">Last Updated:</span>
                            <span className="font-semibold text-slate-800">{formatDraftDate(lastUpdated || Date.now())}</span>
                        </span>
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
