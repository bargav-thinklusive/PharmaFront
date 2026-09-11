import { useCallback } from "react";
import DraftService from "../services/DraftService";
import axiosInstance from "../services/shared/AxiosService";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchDrafts } from "../store/slices/draftsSlice";
import { findExistingDraft } from "../utils/utils";

const draftService = new DraftService();

export interface DraftState {
    id: string;
    lastModified: number;
    formData: any;
    currentStep: number;
    userId?: string;
    drugName?: string;
}

export function getAllDrafts(): DraftState[] {
    return [];
}

const useDraft = () => {
    const dispatch = useAppDispatch();
    const drafts = useAppSelector((state) => state.drafts.drafts);

    const refetchDrafts = useCallback(async () => {
        await dispatch(fetchDrafts());
    }, [dispatch]);

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

        let draftId = existingDraftId;
        if (!draftId) {
            const existing = findExistingDraft(drafts, formData);
            if (existing && existing.id) {
                draftId = existing.id;
            }
        }
        if (!draftId) {
            draftId = Date.now().toString(36) + Math.random().toString(36).substring(2);
        }
        
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
    }, [drafts, refetchDrafts]);

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
