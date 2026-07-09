import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import { FiTrash2, FiEdit2, FiChevronUp, FiChevronRight, FiCheck } from "react-icons/fi";
import type { FieldConfig } from "./index";

interface CustomFormProps {
    field: FieldConfig;
    form: any;
}

const CustomForm: React.FC<CustomFormProps> = ({ field, form }) => {
    const { key, dynamicFields, label: cleanLabel } = field;

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

    // Index of the row currently being edited
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    // Accordion expanded state
    const [accordionOpen, setAccordionOpen] = useState(false);

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
        // Do not close accordion so user can add another entry, just reset fields
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
        setAccordionOpen(true); // Auto-expand when editing
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

            case "dropdown":
                return (
                    <select
                        value={value || ""}
                        onChange={(e) => onChange(e.target.value)}
                        className={commonClasses}
                    >
                        <option value="">{dynamicField.placeholder || "Select"}</option>
                        {dynamicField.options?.map((option: any, idx: number) => (
                            <option key={idx} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );

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



    const isInputRowActive = Object.entries(inputRow).some(([k, v]) => {
        if (k === "phone" && v === "+1") return false;
        return v !== "" && v !== undefined && v !== null;
    });
    
    const hasRows = tableRows.length > 0;
    
    let status = "Not Started";
    if (hasRows) {
        status = isInputRowActive ? "In Progress" : "Complete";
    } else {
        status = isInputRowActive ? "In Progress" : "Not Started";
    }

    let statusIcon = null;
    let statusBadge = null;
    
    if (status === "Complete") {
        statusIcon = (
            <div className="w-6 h-6 rounded-full bg-[#0e8a67] flex items-center justify-center text-white flex-shrink-0">
                <FiCheck className="w-3.5 h-3.5 stroke-[3]" />
            </div>
        );
        statusBadge = (
            <span className="text-[10px] font-semibold text-[#0e8a67] bg-[#e6f4f0] border border-[#0e8a67]/20 px-2 py-0.5 rounded-md">
                Complete
            </span>
        );
    } else if (status === "In Progress") {
        statusIcon = (
            <div className="w-6 h-6 rounded-full border-2 border-amber-500 bg-transparent flex-shrink-0" />
        );
        statusBadge = (
            <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-500/20 px-2 py-0.5 rounded-md">
                In Progress
            </span>
        );
    } else {
        statusIcon = (
            <div className="w-6 h-6 rounded-full border-2 border-slate-300 bg-transparent flex-shrink-0" />
        );
        statusBadge = (
            <span className="text-[10px] font-semibold text-slate-500 bg-slate-50 border border-slate-300/30 px-2 py-0.5 rounded-md">
                Not Started
            </span>
        );
    }

    return (
        <div className="space-y-4 mb-6 text-left">
            {/* Accordion Box */}
            <div className="border border-border-main rounded-2xl overflow-hidden bg-white shadow-sm">
                {/* Accordion Trigger Header */}
                <div
                    onClick={() => setAccordionOpen(!accordionOpen)}
                    className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-alt/10 transition-colors"
                >
                    <div className="flex items-center gap-3.5">
                        {statusIcon}
                        <span className="text-sm font-bold text-main font-display">
                            {editingIndex !== null ? `Editing: ${cleanLabel}` : cleanLabel}
                        </span>
                        {statusBadge}
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                            {dynamicFields?.map((dynamicField) => {
                                const isTextarea = dynamicField.type === "textarea";
                                return (
                                    <div
                                        key={dynamicField.key}
                                        className={`flex flex-col ${isTextarea ? "col-span-full" : ""}`}
                                    >
                                        <label className="block text-xs font-semibold text-main uppercase tracking-wide mb-1.5">
                                            {dynamicField.label}
                                            {dynamicField.required && (
                                                <span className="text-red-500 ml-0.5">*</span>
                                            )}
                                        </label>
                                        {renderInput(
                                            dynamicField,
                                            inputRow[dynamicField.key],
                                            (v) => handleInputChange(dynamicField.key, v)
                                        )}
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
                                        {df.label}
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
                                            className="inline-flex items-center justify-center p-1.5 text-[#2563eb] hover:text-[#1d4ed8] hover:bg-blue-50 rounded-lg transition-colors mr-1 cursor-pointer"
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
