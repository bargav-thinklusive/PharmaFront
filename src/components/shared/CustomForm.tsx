import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import { FiTrash2, FiEdit2, FiChevronUp, FiChevronRight, } from "react-icons/fi";
import type { FieldConfig } from "./index";
import CustomSelect from "./CustomSelect";
import { useAppSelector } from "../../store/hooks";
import { formatKey } from "../../utils/utils";

interface CustomFormProps {
    field: FieldConfig;
    form: any;
}

const CustomForm: React.FC<CustomFormProps> = ({ field, form }) => {
    const { key, dynamicFields, label: cleanLabel } = field;
    const masterData = useAppSelector((state) => state.masterData);

    const activeTherapeuticAreas = masterData?.therapeuticAreas || {};
    const activeRegionsCountries = masterData?.regionsCountries || {};
    const activeAuthorities: any[] = masterData?.regulatoryAuthorities || [];

    // Extract all unique country names strictly from API responses
    const allCountries = Array.from(
        new Set([
            ...activeAuthorities.map((r: any) => r.country || r.region),
            ...Object.keys(activeRegionsCountries),
            ...Object.values(activeRegionsCountries).flat(),
        ].filter((c): c is string => typeof c === 'string' && Boolean(c.trim())))
    ).sort();

    // Build an empty row object from the dynamic field definitions
    const getEmptyRow = () => {
        const row: any = {};
        dynamicFields?.forEach((f) => {
            row[f.key] = f.key === "phone" ? "+1" : "";
        });
        return row;
    };

    // Rows that have been committed to the table
    const [tableRows, setTableRows] = useState<any[]>([]);

    // The single "input" row being filled in
    const [inputRow, setInputRow] = useState<any>(getEmptyRow());

    const getFieldOptions = (dynamicField: any) => {
        if (dynamicField.options && dynamicField.options.length > 0) {
            return dynamicField.options;
        }
        const fieldKey = dynamicField.key;
        if (fieldKey === "country") {
            return allCountries.map((c: string) => ({ label: c, value: c }));
        }
        if (fieldKey === "regulatoryBody" || fieldKey === "regulatoryAuthority" || fieldKey === "regulatorBody" || fieldKey === "regulatoryBodies") {
            const selectedCountry = inputRow?.country || inputRow?.region;
            let filtered = activeAuthorities;
            if (selectedCountry && selectedCountry.trim() !== "") {
                filtered = activeAuthorities.filter((r: any) => r.country?.toLowerCase() === selectedCountry.toLowerCase());
            }

            return filtered.map((r: any) => ({
                label: `${r.abbreviation ? `${r.abbreviation} - ` : ''}${r.authority}`,
                value: r.abbreviation ? `${r.authority} (${r.abbreviation})` : r.authority
            }));
        }
        if (fieldKey === "region" || fieldKey === "firstApprovedRegion") {
            return allCountries.map((c: string) => ({ label: c, value: c }));
        }
        if (fieldKey === "indication" || fieldKey === "approvedIndications") {
            const selectedTA = inputRow?.therapeuticArea;
            const indList = selectedTA && activeTherapeuticAreas[selectedTA] ? activeTherapeuticAreas[selectedTA] : [];
            return indList.map((ind: string) => ({ label: ind, value: ind }));
        }
        return [];
    };

    // Index of the row currently being edited
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    // Accordion expanded state - default to true
    const [accordionOpen, setAccordionOpen] = useState(true);

    // On mount: restore only previously saved values (e.g. from localStorage).
    useEffect(() => {
        const values = form.getFieldValue?.(key) || [];
        if (values.length > 0) {
            setTableRows(values);
        }
    }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

    // Sync tableRows into the form state whenever they change
    const syncToForm = (rows: any[]) => {
        if (form.setFieldsValue) {
            form.setFieldsValue({ [key]: rows });
        }
    };

    // Handle changes to the single input row
    const handleInputChange = (fieldKey: string, value: any) => {
        setInputRow((prev: any) => ({ ...prev, [fieldKey]: value }));
    };

    // Commit current input row to the table, then reset the input row
    const handleAdd = () => {
        let updatedRows;
        if (editingIndex !== null) {
            updatedRows = [...tableRows];
            updatedRows[editingIndex] = { ...inputRow };
            setEditingIndex(null);
        } else {
            updatedRows = [...tableRows, { ...inputRow }];
        }
        setTableRows(updatedRows);
        syncToForm(updatedRows);
        setInputRow(getEmptyRow());
    };

    // Remove a row from the table by index
    const handleRemove = (index: number) => {
        const updatedRows = tableRows.filter((_, i) => i !== index);
        setTableRows(updatedRows);
        syncToForm(updatedRows);

        if (editingIndex === index) {
            setEditingIndex(null);
            setInputRow(getEmptyRow());
        } else if (editingIndex !== null && index < editingIndex) {
            setEditingIndex(editingIndex - 1);
        }
    };

    const handleEditClick = (index: number) => {
        setInputRow({ ...tableRows[index] });
        setEditingIndex(index);
        setAccordionOpen(true);
    };

    const handleResetFields = () => {
        setInputRow(getEmptyRow());
        setEditingIndex(null);
    };

    const commonClasses =
        "w-full px-3.5 py-2.5 border border-border-main rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm text-main placeholder-[#94A3B8] bg-white transition-shadow";

    const renderInput = (dynamicField: any, value: any, onChange: (v: any) => void) => {
        switch (dynamicField.type) {
            case "text":
                return (
                    <input
                        type="text"
                        value={value || ""}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={dynamicField.placeholder || "Enter"}
                        className={commonClasses}
                    />
                );

            case "textarea":
                return (
                    <textarea
                        value={value || ""}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={dynamicField.placeholder || "Enter"}
                        rows={4}
                        className={`${commonClasses} resize-y`}
                    />
                );

            case "datepicker":
                return (
                    <input
                        type={dynamicField.includeTime ? "datetime-local" : "date"}
                        value={value || ""}
                        onChange={(e) => onChange(e.target.value)}
                        className={commonClasses}
                    />
                );

            case "dropdown": {
                const optionsList = getFieldOptions(dynamicField).map((opt: any) => ({
                    label: opt.label || opt.value,
                    value: opt.value || opt.label,
                }));
                return (
                    <CustomSelect
                        value={value || ""}
                        onChange={(v) => onChange(v)}
                        options={optionsList}
                        placeholder={dynamicField.placeholder || "Select"}
                    />
                );
            }

            case "contact":
                return (
                    <PhoneInput
                        country={"us"}
                        value={value || "+1"}
                        onChange={(v) => onChange(v)}
                        inputStyle={{ width: "100%", height: 42, borderRadius: 12, fontSize: 14, borderColor: "#E2E8F0" }}
                        containerStyle={{ width: "100%" }}
                    />
                );

            case "file":
                return (
                    <input
                        type="file"
                        accept="image/*,.pdf,.doc,.docx"
                        multiple
                        onChange={(e) => {
                            const files = e.target.files;
                            if (!files) return;
                            onChange(Array.from(files));
                        }}
                        className={commonClasses}
                    />
                );

            default:
                return (
                    <input
                        type="text"
                        value={value || ""}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={dynamicField.placeholder || "Enter"}
                        className={commonClasses}
                    />
                );
        }
    };

    // Render a table cell value (display-only)
    const renderCellValue = (dynamicField: any, value: any) => {
        if (dynamicField.type === "file") {
            if (Array.isArray(value) && value.length > 0) {
                return value.map((f: any) => f.name).join(", ");
            }
            return "—";
        }
        return value || "—";
    };

    const hasEntries = tableRows.length > 0;
    const headerBg = hasEntries ? "bg-[#0e8a67]/10 border-[#0e8a67]/40 text-[#0e8a67]" : "bg-slate-50/80 border-slate-200 text-slate-800";
    const badgeStyle = hasEntries ? "bg-[#0e8a67] text-white" : "bg-slate-100 text-slate-600 border border-slate-200";

    const displayMainKey = formatKey(cleanLabel || key);
    const isSingleField = dynamicFields?.length === 1;

    return (
        <div className="space-y-4 mb-6 text-left">
            {/* Accordion Box */}
            <div className={`border rounded-2xl overflow-hidden bg-white shadow-xs transition-all ${hasEntries ? "border-[#0e8a67]/40" : "border-slate-200"}`}>
                {/* Accordion Trigger Header with Main Key Title */}
                <div
                    onClick={() => setAccordionOpen(!accordionOpen)}
                    className={`px-6 py-4 flex items-center justify-between cursor-pointer transition-colors ${headerBg}`}
                >
                    <div className="flex items-center gap-3.5">
                        <span className="text-sm font-bold font-display">
                            {editingIndex !== null ? `Editing: ${displayMainKey}` : displayMainKey}
                        </span>
                        <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-2xs ${badgeStyle}`}>
                            {tableRows.length} {tableRows.length === 1 ? "entry" : "entries"}
                        </span>
                    </div>
                    {accordionOpen ? (
                        <FiChevronUp className="w-4 h-4 text-slate-500" />
                    ) : (
                        <FiChevronRight className="w-4 h-4 text-slate-500" />
                    )}
                </div>

                {/* Collapsible Input Form */}
                {accordionOpen && (
                    <div className="px-6 pb-6 pt-5 border-t border-border-main bg-white">
                        <div className="divide-y divide-slate-100 mb-4">
                            {dynamicFields?.map((dynamicField) => {
                                return (
                                    <div
                                        key={dynamicField.key}
                                        className="py-3 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6"
                                    >
                                        {!isSingleField && (
                                            <div className="w-full sm:w-48 shrink-0 pt-2">
                                                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                                                    {dynamicField.label}
                                                    {dynamicField.required && (
                                                        <span className="text-red-500 ml-0.5">*</span>
                                                    )}
                                                </label>
                                            </div>
                                        )}
                                        <div className={isSingleField ? "w-full min-w-0" : "w-full max-w-sm min-w-0"}>
                                            {renderInput(
                                                dynamicField,
                                                inputRow[dynamicField.key],
                                                (v) => handleInputChange(dynamicField.key, v)
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Accordion Actions */}
                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-main/50">
                            {(editingIndex !== null || Object.values(inputRow).some(v => v !== "" && v !== "+1")) && (
                                <button
                                    type="button"
                                    onClick={handleResetFields}
                                    className="px-4 py-2 border border-border-main bg-white text-main text-xs font-semibold rounded-lg hover:bg-alt transition-colors cursor-pointer shadow-sm"
                                >
                                    Clear
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={handleAdd}
                                className="px-5 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-hover transition-colors cursor-pointer shadow-sm"
                            >
                                {editingIndex !== null ? "Update" : "Add"}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Committed rows table ── */}
            {tableRows.length > 0 && (
                <div className="overflow-x-auto rounded-xl border border-border-main shadow-sm bg-white">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="bg-alt/50 border-b border-border-main">
                                {dynamicFields?.map((df) => (
                                    <th
                                        key={df.key}
                                        className="px-4 py-3 text-left text-xs font-bold text-main uppercase tracking-wider whitespace-nowrap"
                                    >
                                        {isSingleField ? displayMainKey : df.label}
                                    </th>
                                ))}
                                <th className="px-4 py-3 text-center text-xs font-bold text-main uppercase tracking-wider w-24">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableRows.map((row, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className="border-b border-border-main last:border-0 hover:bg-alt/20 transition-colors"
                                >
                                    {dynamicFields?.map((df) => (
                                        <td
                                            key={df.key}
                                            className="px-4 py-3 text-body whitespace-nowrap max-w-[240px] truncate"
                                            title={String(row[df.key] || "")}
                                        >
                                            {renderCellValue(df, row[df.key])}
                                        </td>
                                    ))}
                                    <td className="px-4 py-3 text-center whitespace-nowrap">
                                        <button
                                            type="button"
                                            onClick={() => handleEditClick(rowIndex)}
                                            className="inline-flex items-center justify-center p-1.5 text-primary hover:text-primary-hover hover:bg-primary-light rounded-lg transition-colors mr-1 cursor-pointer"
                                            aria-label="Edit row"
                                            title="Edit"
                                        >
                                            <FiEdit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleRemove(rowIndex)}
                                            className="inline-flex items-center justify-center p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                            aria-label="Remove row"
                                            title="Remove"
                                        >
                                            <FiTrash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CustomForm;
