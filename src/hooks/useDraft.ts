import { useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import TokenService from "../services/shared/TokenService";

const DRAFT_PREFIX = "drug_form_draft_v2_";

function getDraftKey(): string {
    const userId = TokenService.decodeToken()?.sub ?? "anonymous";
    return `${DRAFT_PREFIX}${userId}`;
}

export interface DraftState {
    id: string;          // Unique identifier for the draft
    lastModified: number; // Timestamp
    formData: any;
    currentStep: number;
    userId?: string;   // embedded so we can find the draft even without a token
    drugName?: string; // human-readable label shown in the header/home banner
}

/**
 * Fallback: scan all sessionStorage entries for a drug_form_draft_v2_* key
 * whose embedded userId matches the given id.  This handles the race
 * where loadDraft() is called before the refreshed token cookie is written.
 */
function findDraftsByUserId(userId: string): DraftState[] {
    try {
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            if (!key?.startsWith(DRAFT_PREFIX)) continue;
            const raw = sessionStorage.getItem(key);
            if (!raw) continue;
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].userId === userId) {
                return parsed;
            }
        }
    } catch {
        // ignore
    }
    return [];
}

/**
 * Standalone helper – reads the drafts from sessionStorage without needing
 * the hook. Safe to call from any component (e.g. Header, Home page).
 */
export function getAllDrafts(): DraftState[] {
    try {
        const key = getDraftKey();
        const raw = sessionStorage.getItem(key);
        if (raw) return JSON.parse(raw) as DraftState[];

        const refreshToken = TokenService.getRefreshToken();
        if (refreshToken) {
            try {
                const decoded: any = jwtDecode(refreshToken);
                const userId = decoded?.sub;
                if (userId) {
                    const directRaw = sessionStorage.getItem(`${DRAFT_PREFIX}${userId}`);
                    if (directRaw) return JSON.parse(directRaw) as DraftState[];
                    return findDraftsByUserId(String(userId));
                }
            } catch { /* ignore */ }
        }
        return [];
    } catch {
        return [];
    }
}

const useDraft = () => {
    /** Persist current form state to sessionStorage (secure – tab-scoped) */
    const saveDraft = useCallback((formData: any, currentStep: number, existingDraftId?: string | null): string => {
        const userId = TokenService.decodeToken()?.sub ?? "anonymous";
        // Extract a human-readable drug name for display in the header/home
        const drugName =
            formData?.brandName ||
            formData?.drugName ||
            formData?.genericName ||
            "";
        
        const currentDrafts = getAllDrafts();
        const draftId = existingDraftId || Date.now().toString(36) + Math.random().toString(36).substring(2);
        
        const newDraft: DraftState = {
            id: draftId,
            lastModified: Date.now(),
            formData,
            currentStep,
            userId,
            drugName,
        };

        const existingIdx = currentDrafts.findIndex(d => d.id === draftId);
        if (existingIdx !== -1) {
            currentDrafts[existingIdx] = newDraft;
        } else {
            currentDrafts.push(newDraft);
        }

        try {
            sessionStorage.setItem(`${DRAFT_PREFIX}${userId}`, JSON.stringify(currentDrafts));
        } catch (e) {
            console.warn("[useDraft] Could not save draft:", e);
        }
        return draftId;
    }, []);

    /**
     * Load a previously saved draft by its specific ID.
     */
    const loadDraft = useCallback((draftId: string | null): DraftState | null => {
        if (!draftId) return null;
        try {
            const drafts = getAllDrafts();
            return drafts.find(d => d.id === draftId) || null;
        } catch (e) {
            console.warn("[useDraft] Could not load draft:", e);
            return null;
        }
    }, []);

    /**
     * Remove a specific draft after a successful final submission
     */
    const clearDraft = useCallback((draftId: string | null) => {
        if (!draftId) return;
        try {
            const userId = TokenService.decodeToken()?.sub ?? "anonymous";
            
            // Reusable logic to clear a draft for a specific user ID's key
            const removeDraftForKey = (targetUserId: string) => {
                const key = `${DRAFT_PREFIX}${targetUserId}`;
                const raw = sessionStorage.getItem(key);
                if (raw) {
                    const drafts: DraftState[] = JSON.parse(raw);
                    const updatedDrafts = drafts.filter(d => d.id !== draftId);
                    if (updatedDrafts.length > 0) {
                        sessionStorage.setItem(key, JSON.stringify(updatedDrafts));
                    } else {
                        sessionStorage.removeItem(key);
                    }
                }
            };

            removeDraftForKey(userId);

            const refreshToken = TokenService.getRefreshToken();
            if (refreshToken) {
                try {
                    const decoded: any = jwtDecode(refreshToken);
                    const fallbackUserId = decoded?.sub;
                    if (fallbackUserId && String(fallbackUserId) !== userId) {
                         removeDraftForKey(String(fallbackUserId));
                    }
                } catch { /* ignore */ }
            }
        } catch (e) {
            console.warn("[useDraft] Could not clear draft:", e);
        }
    }, []);

    return { saveDraft, loadDraft, clearDraft, getAllDrafts };
};

export default useDraft;
