import { useCallback } from "react";
import DraftService from "../services/DraftService";
import axiosInstance from "../services/shared/AxiosService";
import { useUser } from "../context/UserContext";

const draftService = new DraftService();

export interface DraftState {
    id: string;          // Unique identifier for the draft
    lastModified: number; // Timestamp
    formData: any;
    currentStep: number;
    userId?: string;   // embedded so we can find the draft even without a token
    drugName?: string; // human-readable label shown in the header/home banner
}

/**
 * Fallback standalone helper (for backwards compatibility/typing).
 * Active code should retrieve drafts from UserContext instead.
 */
export function getAllDrafts(): DraftState[] {
    return [];
}

const useDraft = () => {
    const { drafts, refetchDrafts } = useUser();

    /** Persist current form state to secure backend database */
    const saveDraft = useCallback(async (formData: any, currentStep: number, existingDraftId?: string | null): Promise<string> => {
        const extractedDrugName = (
            formData?.drugName ||
            formData?.ProductOverview?.drugName ||
            formData?.brandName ||
            formData?.genericName ||
            formData?.apiName ||
            ""
        ).trim();
        
        if (!extractedDrugName) {
            throw new Error("Cannot save draft without a Drug Name.");
        }

        const draftId = existingDraftId || Date.now().toString(36) + Math.random().toString(36).substring(2);
        
        const payload = {
            id: draftId,
            formData,
            currentStep,
            drugName: extractedDrugName,
            lastModified: Date.now(),
        };

        try {
            await axiosInstance.post(draftService.saveDraft(), payload);
            if (refetchDrafts) {
                await refetchDrafts();
            }
        } catch (e) {
            console.warn("[useDraft] Could not save draft to backend:", e);
            throw e;
        }
        return draftId;
    }, [refetchDrafts]);

    /**
     * Load a previously saved draft by its specific ID from UserContext.
     */
    const loadDraft = useCallback((draftId: string | null): DraftState | null => {
        if (!draftId) return null;
        try {
            const found = drafts.find((d: any) => d.id === draftId);
            return found || null;
        } catch (e) {
            console.warn("[useDraft] Could not load draft from context:", e);
            return null;
        }
    }, [drafts]);

    /**
     * Remove a specific draft after a successful final submission or manual delete
     */
    const clearDraft = useCallback(async (draftId: string | null) => {
        if (!draftId) return;
        try {
            await axiosInstance.delete(draftService.deleteDraft(draftId));
            if (refetchDrafts) {
                await refetchDrafts();
            }
        } catch (e) {
            console.warn("[useDraft] Could not clear draft from backend:", e);
        }
    }, [refetchDrafts]);

    return { saveDraft, loadDraft, clearDraft, getAllDrafts, drafts };
};

export default useDraft;
