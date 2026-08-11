import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import useDraft from "../../hooks/useDraft";
import { FiFileText, FiTrash2, FiX, FiPlus } from "react-icons/fi";

import { formatDraftDate, getDraftTime } from "../../utils/utils";
import { ConfirmModal } from "../shared/ConfirmModal";

interface DraftsListModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const DraftsListModal: React.FC<DraftsListModalProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { drafts } = useUser();
    const { clearDraft } = useDraft();
    const [deletingDraftId, setDeletingDraftId] = React.useState<string | null>(null);

    if (!isOpen) return null;

    const handleSelectDraft = (draftId: string) => {
        onClose();
        navigate(`/drug-form?draftId=${draftId}`);
    };

    const handleRemoveDraftClick = (e: React.MouseEvent, draftId: string) => {
        e.stopPropagation(); // Prevent opening the draft when clicking delete
        setDeletingDraftId(draftId);
    };

    const handleConfirmRemoveDraft = async () => {
        if (deletingDraftId) {
            await clearDraft(deletingDraftId);
            setDeletingDraftId(null);
        }
    };

    const handleStartNew = () => {
        onClose();
        navigate("/drug-form");
    };

    // Sort drafts by last modified date (newest first)
    const sortedDrafts = [...drafts].sort((a: any, b: any) => getDraftTime(b) - getDraftTime(a));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs transition-opacity duration-300">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-primary-light text-primary flex items-center justify-center">
                            <FiFileText className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold font-display text-slate-800">
                                My Saved Drafts
                            </h3>
                            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                                Select a draft to resume editing
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer border-0"
                    >
                        <FiX className="w-4 h-4" />
                    </button>
                </div>

                {/* Drafts List */}
                <div className="flex-1 max-h-[380px] overflow-y-auto px-6 py-4">
                    {sortedDrafts.length === 0 ? (
                        <div className="text-center py-10 flex flex-col items-center">
                            <FiFileText className="w-12 h-12 text-slate-300 mb-3" />
                            <p className="text-sm font-semibold text-slate-600">No saved drafts found</p>
                            <p className="text-xs text-slate-400 mt-1 max-w-[280px]">
                                Start a new draft to save drug formulation details for later.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2.5">
                            {sortedDrafts.map((draft: any) => (
                                <div
                                    key={draft.id}
                                    onClick={() => handleSelectDraft(draft.id)}
                                    className="flex items-center justify-between gap-4 p-4 border border-slate-200/80 rounded-xl hover:border-primary hover:bg-primary-light/10 group transition-all duration-200 cursor-pointer"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 group-hover:border-primary/20 group-hover:bg-primary-light/20 flex items-center justify-center text-slate-500 group-hover:text-primary transition-colors flex-shrink-0">
                                            <FiFileText className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-semibold text-sm text-slate-700 truncate group-hover:text-primary transition-colors">
                                                {draft.drugName || "Unnamed Draft"}
                                            </div>
                                            <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                                                Last saved: {formatDraftDate(draft.lastModified || draft.updatedAt || draft.createdAt)}
                                            </div>
                                        </div>
                                    </div>

                                     {/* Action Buttons */}
                                    <button
                                        onClick={(e) => handleRemoveDraftClick(e, draft.id)}
                                        title="Delete draft"
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer border-0"
                                    >
                                        <FiTrash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold rounded-xl cursor-pointer transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleStartNew}
                        className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl cursor-pointer transition-colors border-0"
                    >
                        <FiPlus className="w-4 h-4" />
                        Start New Drug
                    </button>
                </div>
            </div>

            <ConfirmModal
                isOpen={!!deletingDraftId}
                onClose={() => setDeletingDraftId(null)}
                onConfirm={handleConfirmRemoveDraft}
                title="Delete Draft"
                description="Are you sure you want to delete this draft? This action cannot be undone."
                confirmText="Yes, Delete"
                icon={<FiTrash2 className="w-6 h-6 text-red-500" />}
                iconBgColor="bg-red-50 border-red-200"
                confirmButtonColor="bg-red-600 hover:bg-red-700"
            />
        </div>
    );
};

export default DraftsListModal;
