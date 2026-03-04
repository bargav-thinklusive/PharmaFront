import { useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import TokenService from "../services/shared/TokenService";

const DRAFT_PREFIX = "drug_form_draft_";

/**
 * Returns a sessionStorage key scoped to the currently logged-in user.
 *
 * Falls back to "anonymous" when the access token is not yet available
 * (e.g. during the silent-refresh window on page load).  The real userId
 * is also embedded inside the draft payload so we can recover it even when
 * the key resolves to the wrong value – see loadDraft() below.
 */
function getDraftKey(): string {
    const userId = TokenService.decodeToken()?.sub ?? "anonymous";
    return `${DRAFT_PREFIX}${userId}`;
}

export interface DraftState {
    formData: any;
    currentStep: number;
    savedAt: string;   // ISO-8601 – shown in the "Draft restored" banner
    userId?: string;   // embedded so we can find the draft even without a token
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

const useDraft = () => {
    /** Persist current form state to sessionStorage */
    const saveDraft = useCallback((formData: any, currentStep: number) => {
        const userId = TokenService.decodeToken()?.sub ?? "anonymous";
        const draft: DraftState = {
            formData,
            currentStep,
            savedAt: new Date().toISOString(),
            userId,   // <-- embed so we can recover without a token
        };
        try {
            sessionStorage.setItem(`${DRAFT_PREFIX}${userId}`, JSON.stringify(draft));
        } catch (e) {
            console.warn("[useDraft] Could not save draft:", e);
        }
    }, []);

    /**
     * Load a previously saved draft.
     *
     * Strategy:
     *  1. Try the normal key (token is valid → works immediately).
     *  2. If the key resolves to "anonymous" (token expired / not yet
     *     refreshed), scan sessionStorage for a draft whose embedded
     *     userId matches the refresh-token payload so the data is not lost.
     *  Returns null when no draft exists.
     */
    const loadDraft = useCallback((): DraftState | null => {
        try {
            // Attempt 1 – token is available
            const key = getDraftKey();
            const raw = sessionStorage.getItem(key);
            if (raw) return JSON.parse(raw) as DraftState;

            // Attempt 2 – token absent; try to get userId from refresh token
            //   (refresh token is a JWT too, so we can decode it client-side
            //    just for the sub claim without trusting it for auth)
            const refreshToken = TokenService.getRefreshToken();
            if (refreshToken) {
                try {
                    const decoded: any = jwtDecode(refreshToken);
                    const userId = decoded?.sub;
                    if (userId) {
                        // First try the exact key
                        const directRaw = sessionStorage.getItem(`${DRAFT_PREFIX}${userId}`);
                        if (directRaw) return JSON.parse(directRaw) as DraftState;
                        // Then scan (handles edge cases like key collisions)
                        return findDraftByUserId(String(userId));
                    }
                } catch {
                    // refresh token not a JWT or decode failed – fall through
                }
            }

            return null;
        } catch (e) {
            console.warn("[useDraft] Could not load draft:", e);
            return null;
        }
    }, []);

    /**
     * Remove the draft.
     * Call this after a successful final submission so that opening the
     * drug form next time starts with a completely blank slate.
     */
    const clearDraft = useCallback(() => {
        try {
            // Clear by exact key first
            sessionStorage.removeItem(getDraftKey());
            // Also clear any orphan draft for this user (token-less save scenario)
            const refreshToken = TokenService.getRefreshToken();
            if (refreshToken) {
                try {
                    const decoded: any = jwtDecode(refreshToken);
                    const userId = decoded?.sub;
                    if (userId) sessionStorage.removeItem(`${DRAFT_PREFIX}${userId}`);
                } catch {
                    // ignore
                }
            }
        } catch (e) {
            console.warn("[useDraft] Could not clear draft:", e);
        }
    }, []);

    return { saveDraft, loadDraft, clearDraft };
};

export default useDraft;
