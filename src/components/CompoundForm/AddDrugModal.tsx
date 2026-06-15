import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

interface AddDrugModalProps {
    onClose: () => void;
}

const AddDrugModal: React.FC<AddDrugModalProps> = ({ onClose }) => {
    const navigate = useNavigate();
    const { drugsData } = useUser();

    const [step, setStep] = useState<"choice" | "existing">("choice");
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("all");
    const [error, setError] = useState("");

    // Extract drug name — API returns lowercase keys, local format uses uppercase
    const getDrugName = (d: any): string =>
        d?.ProductOverview?.drugName ||
        d?.ProductOverview?.brandName ||
        "";

    // Fuzzy match: all chars of query appear in order inside name (case-insensitive)
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

    const q = query.toLowerCase().trim();
    const suggestions: any[] = [];
    if (q) {
        (drugsData || []).forEach((d: any) => {
            if (category === "all") {
                const text = [
                    d?.ProductOverview?.drugName,
                    d?.ProductOverview?.brandName,
                    d?.ProductOverview?.apiName,
                    d?.PhysicalChemicalProperties?.iupacName,
                    d?.PhysicalChemicalProperties?.innName,
                    d?.cid
                ].filter(Boolean).join(" ");
                if (fuzzyMatch(text, q)) suggestions.push(d);
            } else if (category === "drugName") {
                const text = [d?.ProductOverview?.drugName, d?.ProductOverview?.brandName].filter(Boolean).join(" ");
                if (fuzzyMatch(text, q)) suggestions.push(d);
            } else if (category === "apiName") {
                const text = d?.ProductOverview?.apiName || "";
                if (fuzzyMatch(text, q)) suggestions.push(d);
            } else if (category === "iupacName") {
                const text = d?.PhysicalChemicalProperties?.iupacName || "";
                if (fuzzyMatch(text, q)) suggestions.push(d);
            } else if (category === "innName") {
                const text = d?.PhysicalChemicalProperties?.innName || "";
                if (fuzzyMatch(text, q)) suggestions.push(d);
            } else if (category === "cid") {
                const text = d?.cid ? String(d.cid) : "";
                if (fuzzyMatch(text, q)) suggestions.push(d);
            }
        });
    }

    const handleNewDrug = () => {
        onClose();
        navigate("/drug-form");
    };

    const handleSelectDrug = (drug: any) => {
        onClose();
        navigate("/drug-preview", { state: { drug } });
    };

    const handleOk = () => {
        if (!query.trim()) {
            setError("Please enter a search query.");
            return;
        }
        if (suggestions.length === 0) {
            setError(`No drug found matching "${query}" in ${category === 'all' ? 'any category' : category}.`);
            return;
        }
        handleSelectDrug(suggestions[0]);
    };

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-visible animate-fadeIn">
                {/* Header */}
                <div className="bg-gradient-to-r from-navy to-slate px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <h2 className="text-white text-lg font-bold tracking-wide font-display">Add Drug</h2>
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
                                Search By
                            </label>
                            <div className="flex w-full bg-white border border-gray-300 rounded-lg shadow-sm overflow-visible relative focus-within:ring-2 focus-within:ring-blue-500 z-10">
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => { setQuery(e.target.value); setError(""); }}
                                    onKeyDown={(e) => e.key === "Enter" && handleOk()}
                                    placeholder="Search..."
                                    autoFocus
                                    className="flex-1 px-4 py-2.5 border-0 focus:ring-0 focus:outline-none text-sm rounded-l-lg"
                                />
                                <div className="relative border-l border-gray-300 bg-gray-50 rounded-r-lg flex items-center">
                                    <select
                                        className="h-full px-3 py-2.5 text-sm bg-transparent border-0 focus:ring-0 focus:outline-none text-gray-700 font-medium appearance-none pr-8 cursor-pointer"
                                        value={category}
                                        onChange={(e) => { setCategory(e.target.value); setQuery(""); setError(""); }}
                                    >
                                        <option value="all">All</option>
                                        <option value="drugName">Drug Name</option>
                                        <option value="apiName">API Name</option>
                                        <option value="iupacName">IUPAC Name</option>
                                        <option value="innName">INN Name</option>
                                        <option value="cid">CID</option>
                                    </select>
                                    <span className="absolute right-2 pointer-events-none text-gray-600 text-xs">
                                        ▼
                                    </span>
                                </div>
                                {/* Dropdown suggestions */}
                                {suggestions.length > 0 && (
                                    <ul className="absolute z-20 top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
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
                            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddDrugModal;
