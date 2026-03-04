import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import { FiTrash2 } from "react-icons/fi";
import type { FieldConfig } from "./index";

interface CustomFormProps {
    field: FieldConfig;
    form: any;
}

const CustomForm: React.FC<CustomFormProps> = ({ field, form }) => {
    const { key, dynamicFields } = field;

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

    // On mount: restore only previously saved values (e.g. from localStorage).
    // Do NOT pre-load initialValues — table stays hidden until the user adds a row.
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
        const updatedRows = [...tableRows, { ...inputRow }];
        setTableRows(updatedRows);
        syncToForm(updatedRows);
        setInputRow(getEmptyRow());
    };

    // Remove a row from the table by index
    const handleRemove = (index: number) => {
        const updatedRows = tableRows.filter((_, i) => i !== index);
        setTableRows(updatedRows);
        syncToForm(updatedRows);
    };

    const commonClasses =
        "w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm";

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
                        rows={2}
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
                        inputStyle={{ width: "100%", height: 34, borderRadius: 6, fontSize: 14 }}
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

    return (
        <div className="space-y-3">
            {/* ── Input row ── */}
            <div className="border border-blue-200 rounded-lg p-3 bg-blue-50/30">
                <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3 mb-3">
                    {dynamicFields?.map((dynamicField) => (
                        <div key={dynamicField.key} className="flex flex-col">
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                {dynamicField.label}
                                {dynamicField.required && (
                                    <span className="text-red-500 ml-1">*</span>
                                )}
                            </label>
                            {renderInput(
                                dynamicField,
                                inputRow[dynamicField.key],
                                (v) => handleInputChange(dynamicField.key, v)
                            )}
                        </div>
                    ))}
                </div>

                {/* Add button */}
                <button
                    type="button"
                    onClick={handleAdd}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Add
                </button>
            </div>

            {/* ── Committed rows table ── */}
            {tableRows.length > 0 && (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                {dynamicFields?.map((df) => (
                                    <th
                                        key={df.key}
                                        className="px-3 py-2 text-left text-xs font-semibold text-gray-600 whitespace-nowrap"
                                    >
                                        {df.label}
                                    </th>
                                ))}
                                <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600 w-16">
                                    Remove
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableRows.map((row, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className={`border-b border-gray-100 ${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                                >
                                    {dynamicFields?.map((df) => (
                                        <td
                                            key={df.key}
                                            className="px-3 py-2 text-gray-700 whitespace-nowrap max-w-[200px] truncate"
                                            title={String(row[df.key] || "")}
                                        >
                                            {renderCellValue(df, row[df.key])}
                                        </td>
                                    ))}
                                    <td className="px-3 py-2 text-center">
                                        <button
                                            type="button"
                                            onClick={() => handleRemove(rowIndex)}
                                            className="inline-flex items-center justify-center p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                            aria-label="Remove row"
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
