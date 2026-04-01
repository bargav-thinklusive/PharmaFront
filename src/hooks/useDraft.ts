import { useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import TokenService from "../services/shared/TokenService";

const DRAFT_PREFIX = "drug_form_draft_";

/**
 * Returns a sessionStorage key scoped to the currently logged-in user.
 * Falls back to "anonymous" when the access token is not yet available.
 * The real userId is also embedded inside the draft payload so we can
 * recover it even when the key resolves to the wrong value.
 *
 * WHY sessionStorage (not localStorage)?
 *  - sessionStorage is tab-scoped and cleared automatically when the
 *    tab/browser closes → draft data never outlives the user's session.
 *  - Unlike localStorage, sessionStorage is NOT shared across tabs or
 *    accessible to other origins, reducing XSS exposure.
 */
function getDraftKey(): string {
    const userId = TokenService.decodeToken()?.sub ?? "anonymous";
    return `${DRAFT_PREFIX}${userId}`;
}

export interface DraftState {
    formData: any;
    currentStep: number;
    userId?: string;   // embedded so we can find the draft even without a token
    drugName?: string; // human-readable label shown in the header/home banner
}

/**
 * Fallback: scan all sessionStorage entries for a drug_form_draft_* key
 * whose embedded userId matches the given id.  This handles the race
 * where loadDraft() is called before the refreshed token cookie is written.
 */
function findDraftByUserId(userId: string): DraftState | null {
    try {
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            if (!key?.startsWith(DRAFT_PREFIX)) continue;
            const raw = sessionStorage.getItem(key);
            if (!raw) continue;
            const parsed = JSON.parse(raw) as DraftState;
            if (parsed.userId === userId) return parsed;
        }
    } catch {
        // ignore
    }
    return null;
}

/**
 * Standalone helper – reads the draft from sessionStorage without needing
 * the hook. Safe to call from any component (e.g. Header, Home page).
 * Because sessionStorage is synchronous there is no performance concern.
 */
export function getDraftData(): DraftState | null {
    try {
        const key = getDraftKey();
        const raw = sessionStorage.getItem(key);
        if (raw) return JSON.parse(raw) as DraftState;

        const refreshToken = TokenService.getRefreshToken();
        if (refreshToken) {
            try {
                const decoded: any = jwtDecode(refreshToken);
                const userId = decoded?.sub;
                if (userId) {
                    const directRaw = sessionStorage.getItem(`${DRAFT_PREFIX}${userId}`);
                    if (directRaw) return JSON.parse(directRaw) as DraftState;
                    return findDraftByUserId(String(userId));
                }
            } catch { /* ignore */ }
        }
        return null;
    } catch {
        return null;
    }
}

const useDraft = () => {
    /** Persist current form state to sessionStorage (secure – tab-scoped) */
    const saveDraft = useCallback((formData: any, currentStep: number) => {
        const userId = TokenService.decodeToken()?.sub ?? "anonymous";
        // Extract a human-readable drug name for display in the header/home
        const drugName =
            formData?.brandName ||
            formData?.drugName ||
            formData?.genericName ||
            "";
        const draft: DraftState = {
            formData,
            currentStep,
            userId,
            drugName,
        };
        try {
            sessionStorage.setItem(`${DRAFT_PREFIX}${userId}`, JSON.stringify(draft));
        } catch (e) {
            console.warn("[useDraft] Could not save draft:", e);
        }
    }, []);

    /**
     * Load a previously saved draft.
     * Strategy:
     *  1. Try the normal key (token is valid → works immediately).
     *  2. If key resolves to "anonymous" (token expired / not yet refreshed),
     *     scan sessionStorage for a draft whose embedded userId matches the
     *     refresh-token payload so the data is not lost.
     */
    const loadDraft = useCallback((): DraftState | null => {
        try {
            const key = getDraftKey();
            const raw = sessionStorage.getItem(key);
            if (raw) return JSON.parse(raw) as DraftState;

            const refreshToken = TokenService.getRefreshToken();
            if (refreshToken) {
                try {
                    const decoded: any = jwtDecode(refreshToken);
                    const userId = decoded?.sub;
                    if (userId) {
                        const directRaw = sessionStorage.getItem(`${DRAFT_PREFIX}${userId}`);
                        if (directRaw) return JSON.parse(directRaw) as DraftState;
                        return findDraftByUserId(String(userId));
                    }
                } catch { /* ignore */ }
            }
            return null;
        } catch (e) {
            console.warn("[useDraft] Could not load draft:", e);
            return null;
        }
    }, []);

    /** Quick boolean check – no need to parse the full payload */
    const hasDraft = useCallback((): boolean => {
        return getDraftData() !== null;
    }, []);

    /**
     * Remove the draft after a successful final submission so that opening
     * the drug form next time starts with a completely blank slate.
     */
    const clearDraft = useCallback(() => {
        try {
            sessionStorage.removeItem(getDraftKey());
            const refreshToken = TokenService.getRefreshToken();
            if (refreshToken) {
                try {
                    const decoded: any = jwtDecode(refreshToken);
                    const userId = decoded?.sub;
                    if (userId) sessionStorage.removeItem(`${DRAFT_PREFIX}${userId}`);
                } catch { /* ignore */ }
            }
        } catch (e) {
            console.warn("[useDraft] Could not clear draft:", e);
        }
    }, []);

    return { saveDraft, loadDraft, hasDraft, clearDraft };
};

export default useDraft;
