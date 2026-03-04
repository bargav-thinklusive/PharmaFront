import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { flattenDrug } from "./helper";
import useDraft from "../../hooks/useDraft";

interface AddDrugModalProps {
    onClose: () => void;
}

const AddDrugModal: React.FC<AddDrugModalProps> = ({ onClose }) => {
    const navigate = useNavigate();
    const { drugsData } = useUser();
    const { saveDraft, clearDraft } = useDraft();

    const [step, setStep] = useState<"choice" | "existing">("choice");
    const [query, setQuery] = useState("");
    const [error, setError] = useState("");

    // Extract drug name — API returns lowercase keys, local format uses uppercase
    const getDrugName = (d: any): string =>
        d?.ProductOverview?.drugName ||
        d?.ProductOverview?.brandName ||
        "";

    // Fuzzy match: all chars of query appear in order inside name (case-insensitive)
    // "aspiran" → "Aspirin Gold" ✓  |  "ASPIRIN" ✓  |  "aspirin gold" ✓
    const fuzzyMatch = (name: string, q: string): boolean => {
        const n = name.toLowerCase();
        const query = q.toLowerCase().trim();
        if (!query) return false;
        if (n.includes(query)) return true; // fast path: exact substring match
        let qi = 0;
        for (let i = 0; i < n.length && qi < query.length; i++) {
            if (n[i] === query[qi]) qi++;
        }
        return qi === query.length;
    };

    // Filter using fuzzy match
    const suggestions: any[] = (drugsData || []).filter((d: any) =>
        fuzzyMatch(getDrugName(d), query)
    );

    const handleNewDrug = () => {
        clearDraft();   // wipe any pre-filled data from a previous "Existing Drug" selection
        onClose();
        navigate("/drug-form");
    };

    const handleSelectDrug = (drug: any) => {
        if (!drug?.cid) return;
        // Flatten raw API record into the flat shape the form expects
        const flatData = flattenDrug(drug);
        // Save as draft so CompoundForm restores it on mount
        saveDraft(flatData, 0);
        onClose();
        navigate("/drug-form");
    };

    const handleOk = () => {
        if (!query.trim()) {
            setError("Please enter a drug name.");
            return;
        }
        const match = (drugsData || []).find((d: any) =>
            fuzzyMatch(getDrugName(d), query)
        );
        if (!match) {
            setError(`No drug found with name "${query}". Try selecting from the suggestions.`);
            return;
        }
        handleSelectDrug(match);
    };

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden animate-fadeIn">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-700 to-blue-500 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-white text-lg font-bold tracking-wide">Add Drug</h2>
                    <button
                        onClick={onClose}
                        className="text-white/70 hover:text-white text-2xl leading-none"
                    >
                        &times;
                    </button>
                </div>

                <div className="p-6">
                    {step === "choice" ? (
                        /* ── Step 1: Choose new or existing ── */
                        <div className="flex flex-col gap-4">
                            <p className="text-gray-600 text-sm text-center">What would you like to do?</p>
                            <button
                                onClick={handleNewDrug}
                                className="flex items-center gap-3 px-5 py-4 rounded-xl border-2 border-blue-500 text-blue-700 font-semibold hover:bg-blue-50 transition-colors"
                            >
                                <span className="text-2xl">✚</span>
                                <span>
                                    <div className="text-left font-semibold">New Drug</div>
                                    <div className="text-xs text-gray-400 font-normal">Start with a blank form</div>
                                </span>
                            </button>
                            <button
                                onClick={() => setStep("existing")}
                                className="flex items-center gap-3 px-5 py-4 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                            >
                                <span className="text-2xl">🔍</span>
                                <span>
                                    <div className="text-left font-semibold">Existing Drug</div>
                                    <div className="text-xs text-gray-400 font-normal">Pre-fill form from saved drug</div>
                                </span>
                            </button>
                        </div>
                    ) : (
                        /* ── Step 2: Search for existing drug ── */
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => { setStep("choice"); setQuery(""); setError(""); }}
                                className="text-sm text-blue-600 hover:underline self-start"
                            >
                                ← Back
                            </button>
                            <label className="text-sm font-medium text-gray-700">
                                Enter Drug Name
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => { setQuery(e.target.value); setError(""); }}
                                    onKeyDown={(e) => e.key === "Enter" && handleOk()}
                                    placeholder="e.g. Aspirin"
                                    autoFocus
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                                {/* Dropdown suggestions */}
                                {suggestions.length > 0 && (
                                    <ul className="absolute z-10 top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                        {suggestions.map((drug: any, i: number) => {
                                            const name = getDrugName(drug) || "Unknown";
                                            return (
                                                <li
                                                    key={i}
                                                    onClick={() => handleSelectDrug(drug)}
                                                    className="px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                                                >
                                                    {name}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                            {error && <p className="text-xs text-red-500">{error}</p>}
                            <button
                                onClick={handleOk}
                                className="mt-1 w-full py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
                            >
                                OK – Pre-fill Form
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddDrugModal;
