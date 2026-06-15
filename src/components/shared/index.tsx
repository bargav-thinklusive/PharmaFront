import React, { useState, useRef, useEffect } from "react";
import { renderArrayInput } from "./renderingArray";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import get from "lodash.get";
import TagsInput from "./TagSelector";
import { FiInfo, FiChevronDown, FiChevronRight, FiChevronUp, FiShield, FiDollarSign, FiClock, FiActivity, FiLayers, FiFileText } from "react-icons/fi";
import ToggleSwitch from "./Switch";

// ─── Shared input class strings ───────────────────────────────────────────────
const baseInput =
    "w-full px-3.5 py-2.5 border border-border-main rounded-xl text-sm text-main bg-white " +
    "placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary " +
    "transition-shadow duration-150";

const disabledInput = "bg-alt opacity-60 cursor-not-allowed";

// ─── Autocomplete ─────────────────────────────────────────────────────────────
interface AutocompleteOption { value: any; label: string; }
interface AutocompleteProps {
    value?: string;
    onChange?: (value: string) => void;
    options?: AutocompleteOption[];
    placeholder?: string;
    disabled?: boolean;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
    value = "", onChange, options = [], placeholder = "Select...", disabled = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value);
    const [filteredOptions, setFilteredOptions] = useState(options);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => { setInputValue(value); }, [value]);
    useEffect(() => {
        setFilteredOptions(options.filter((o) => o.label.toLowerCase().includes(inputValue.toLowerCase())));
    }, [inputValue, options]);
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={containerRef} className="relative w-full">
            <div className="relative">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => { setInputValue(e.target.value); setIsOpen(true); onChange?.(e.target.value); }}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`${baseInput} pr-10 ${disabled ? disabledInput : ""}`}
                />
                <FiChevronDown
                    className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-body transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
            </div>
            {isOpen && filteredOptions.length > 0 && !disabled && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-border-main rounded-xl shadow-lg max-h-60 overflow-auto">
                    {filteredOptions.map((option, index) => (
                        <div
                            key={`${option.value}-${index}`}
                            onClick={() => { setInputValue(option.label); onChange?.(option.value); setIsOpen(false); }}
                            className="px-3.5 py-2.5 cursor-pointer hover:bg-primary-light text-sm text-main transition-colors"
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
            {isOpen && filteredOptions.length === 0 && inputValue && !disabled && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-border-main rounded-xl shadow-lg">
                    <div className="px-3.5 py-2.5 text-sm text-body">No options found</div>
                </div>
            )}
        </div>
    );
};

// ─── FieldConfig interface (unchanged) ────────────────────────────────────────
export interface FieldConfig {
    label: string;
    key: string;
    type?:
    | "text" | "dropdown" | "autocomplete" | "datepicker" | "array"
    | "textarea" | "contact" | "select" | "checkbox" | "Switch"
    | "number" | "radio" | "tag" | "header" | "dynamic" | "file"
    | "rangepicker" | "linkedin";
    render?: (value: any, onChange: (newValue: any) => void) => React.ReactNode;
    dynamicComponent?: (key: string, field: any, form: any) => React.ReactNode;
    fileComponent?: (key: string, field: any, form: any) => React.ReactNode;
    dynamicOtions?: { label: string; value: any; icon: any }[];
    options?: { label: string; value: any }[];
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
    valueKey?: string;
    labelKey?: string;
    includeTime?: boolean;
    fields?: { label: string; key: string; type: string; placeholder: string; required: boolean; includeTime?: boolean; options?: { label: string; value: string }[]; }[];
    filterOptions?: (inputValue: string, option: any) => boolean;
    singleFieldInRow?: boolean;
    fullRowWidth?: boolean;
    additinalLabel?: string;
    initialValues?: any[];
    dynamicFields?: FieldConfig[];
    tooltip?: string;
    defaultValue?: string;
}

interface DynamicFormBuilderProps {
    fields: FieldConfig[];
    form: any;
    columns?: number;
    dynamicOptions?: { [key: string]: any[] };
    notFoundContent?: { [key: string]: React.ReactNode };
    onChange?: (changedValues: any, allValues: any) => void;
}

// ─── DynamicFormBuilder ───────────────────────────────────────────────────────
const DynamicFormBuilder: React.FC<DynamicFormBuilderProps> = ({
    fields, form, columns = 1, dynamicOptions = {}, onChange,
}) => {
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [openHeaders, setOpenHeaders] = useState<{ [key: string]: boolean }>({});

    // Initialize the first accordion as open
    useEffect(() => {
        const firstHeader = fields.find(f => f.type === "header");
        if (firstHeader) {
            setOpenHeaders({ [firstHeader.key]: true });
        } else {
            setOpenHeaders({});
        }
    }, [fields]);

    const toggleHeader = (key: string) => {
        setOpenHeaders(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const getIconForHeader = (label: string) => {
        const l = label.toLowerCase();
        if (l.includes("drug")) return <FiLayers className="w-4 h-4" />;
        if (l.includes("regulatory")) return <FiShield className="w-4 h-4" />;
        if (l.includes("commercial") || l.includes("revenue")) return <FiDollarSign className="w-4 h-4" />;
        if (l.includes("exclusivity") || l.includes("patent")) return <FiClock className="w-4 h-4" />;
        if (l.includes("market") || l.includes("generic")) return <FiActivity className="w-4 h-4" />;
        if (l.includes("additional") || l.includes("source") || l.includes("glossary")) return <FiFileText className="w-4 h-4" />;
        return <FiFileText className="w-4 h-4" />;
    };

    const validateZipCode = (value: any) => {
        if (value && !/^\d+$/.test(value)) return "Zip Code must be numeric";
        if (value && value.length < 5) return "Zip Code must be at least 5 characters";
        return true;
    };

    const handleFieldChange = (key: string, value: any) => {
        if (form.setFieldsValue) form.setFieldsValue({ [key]: value });
        if (onChange) onChange({ [key]: value }, form.getFieldsValue ? form.getFieldsValue() : form);
        validateField(key, value);
    };

    const validateField = (key: string, value: any) => {
        const field = fields.find((f) => f.key === key);
        if (!field) return;
        let error = "";
        if (field.required && (!value || (typeof value === "string" && value.trim() === ""))) error = "Required";
        if (!error && value) {
            if (key === "firstName" || key === "lastName") { if (value.length < 4) error = "Name must be greater than 3 characters"; }
            if (key === "email") { if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Invalid email format"; }
            if (field.type === "linkedin") { if (!/^(https?:\/\/)?(www\.)?linkedin\.com\/in\/.+$/.test(value)) error = "Please enter a valid LinkedIn URL"; }
            if (key === "zipCode") { const ze = validateZipCode(value); if (ze !== true) error = ze; }
            if (key === "version") { if (!/^\d+$/.test(value)) error = "Version should be a number"; }
        }
        setErrors((prev) => ({ ...prev, [key]: error }));
    };

    const handleSwitch = (key: string, checked: boolean) => handleFieldChange(key, checked);

    const selectClass = `${baseInput} appearance-none cursor-pointer`;

    const renderFieldComponent = (field: FieldConfig) => {
        const {
            key, type = "text", required, placeholder, disabled, options = [],
            valueKey = "value", labelKey = "label", includeTime = false,
            additinalLabel, dynamicComponent, defaultValue, render,
        } = field;

        const allOptions = [...options, ...(dynamicOptions?.[key] || [])].filter((o) => o !== null);
        const fieldValue = (form.getFieldValue ? form.getFieldValue(key) : form[key]) ?? defaultValue ?? "";
        const fieldOnChange = (newValue: any) => handleFieldChange(key, newValue);

        switch (type) {
            case "text":
                return render ? render(fieldValue, fieldOnChange) : (
                    <input
                        value={fieldValue}
                        onChange={(e) => fieldOnChange(e.target.value)}
                        type="text"
                        disabled={disabled}
                        placeholder={placeholder}
                        required={required}
                        className={`${baseInput} ${disabled ? disabledInput : ""}`}
                    />
                );

            case "number":
                return render ? render(fieldValue, fieldOnChange) : (
                    <input
                        value={fieldValue}
                        onChange={(e) => fieldOnChange(e.target.value)}
                        type="number"
                        disabled={disabled}
                        placeholder={placeholder}
                        required={required}
                        className={`w-full ${baseInput} ${disabled ? disabledInput : ""}`}
                    />
                );

            case "dropdown":
            case "select":
                return render ? render(fieldValue, fieldOnChange) : (
                    <div className="relative">
                        <select
                            value={fieldValue}
                            onChange={(e) => fieldOnChange(e.target.value)}
                            disabled={disabled}
                            required={required}
                            className={`${selectClass} ${disabled ? disabledInput : ""}`}
                        >
                            <option value="">{placeholder || "Select…"}</option>
                            {allOptions?.map((option, idx) => (
                                <option key={idx} value={type === "select" ? get(option, labelKey) : option[valueKey]}>
                                    {option[labelKey]}
                                </option>
                            ))}
                        </select>
                        <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-body" />
                    </div>
                );

            case "autocomplete":
                return (
                    <Autocomplete
                        value={fieldValue}
                        onChange={fieldOnChange}
                        options={allOptions?.map((o) => ({ value: get(o, valueKey), label: get(o, labelKey) }))}
                        placeholder={placeholder}
                        disabled={disabled}
                    />
                );

            case "datepicker":
                return (
                    <input
                        type={includeTime ? "datetime-local" : "date"}
                        value={fieldValue}
                        onChange={(e) => fieldOnChange(e.target.value)}
                        disabled={disabled}
                        required={required}
                        placeholder={placeholder}
                        className={`${baseInput} ${disabled ? disabledInput : ""}`}
                    />
                );

            case "rangepicker": {
                const rangeStart = fieldValue?.[0] || "";
                const rangeEnd = fieldValue?.[1] || "";
                return (
                    <div className="flex items-center gap-2">
                        <input
                            type={includeTime ? "datetime-local" : "date"}
                            value={rangeStart}
                            onChange={(e) => { fieldOnChange([e.target.value, rangeEnd]); handleFieldChange("minDateValue", e.target.value || null); }}
                            disabled={disabled}
                            placeholder={placeholder || "Start Date"}
                            className={`${baseInput} ${disabled ? disabledInput : ""}`}
                        />
                        <span className="text-body text-sm px-1">—</span>
                        <input
                            type={includeTime ? "datetime-local" : "date"}
                            value={rangeEnd}
                            onChange={(e) => { fieldOnChange([rangeStart, e.target.value]); handleFieldChange("maxDateValue", e.target.value || null); }}
                            disabled={disabled}
                            placeholder={placeholder || "End Date"}
                            min={rangeStart}
                            className={`${baseInput} ${disabled ? disabledInput : ""}`}
                        />
                    </div>
                );
            }

            case "array":
                return render ? render(fieldValue, fieldOnChange) : renderArrayInput(fieldValue || [], fieldOnChange);

            case "textarea":
                return (
                    <textarea
                        value={fieldValue}
                        onChange={(e) => fieldOnChange(e.target.value)}
                        disabled={disabled}
                        placeholder={placeholder}
                        required={required}
                        rows={3}
                        className={`${baseInput} resize-y ${disabled ? disabledInput : ""}`}
                    />
                );

            case "contact":
                return (
                    <PhoneInput
                        country={"us"}
                        value={fieldValue}
                        onChange={(val) => fieldOnChange(val)}
                        inputStyle={{ width: "100%", height: 42, borderRadius: 12, borderWidth: "1px", borderStyle: "solid", borderColor: "#E2E8F0", fontSize: 14, color: "#1E293B" }}
                        containerStyle={{ width: "100%" }}
                    />
                );

            case "checkbox":
                return (
                    <div className="flex items-center gap-2.5 mt-1">
                        <input
                            type="checkbox"
                            checked={fieldValue || false}
                            onChange={(e) => fieldOnChange(e.target.checked)}
                            required={required}
                            className="w-4 h-4 rounded border-border-main text-primary focus:ring-primary accent-primary cursor-pointer"
                        />
                        {additinalLabel && (
                            <label className="text-sm text-main cursor-pointer">{additinalLabel}</label>
                        )}
                    </div>
                );

            case "Switch":
                return (
                    <ToggleSwitch
                        checked={fieldValue || false}
                        onChange={(checked) => handleSwitch(key, checked)}
                        disabled={disabled}
                    />
                );

            case "radio":
                return (
                    <div className="flex flex-wrap gap-3 mt-1">
                        {allOptions?.map((option, idx) => (
                            <label key={idx} className={`flex items-center gap-2 cursor-pointer px-3.5 py-2 rounded-xl border text-sm font-medium transition-all duration-150 ${
                                fieldValue === option[valueKey]
                                    ? "border-primary bg-primary-light text-primary"
                                    : "border-border-main bg-white text-main hover:border-primary/40"
                            }`}>
                                <input
                                    type="radio"
                                    value={option[valueKey]}
                                    checked={fieldValue === option[valueKey]}
                                    onChange={() => fieldOnChange(option[valueKey])}
                                    required={required}
                                    className="sr-only"
                                />
                                {option[labelKey]}
                            </label>
                        ))}
                    </div>
                );

            case "tag":
                return <TagsInput value={fieldValue || []} onChange={(tags: any) => fieldOnChange(tags)} />;

            case "header":
                return <div />;

            case "dynamic":
                return dynamicComponent ? <>{dynamicComponent(key, field, form)}</> : <div />;

            case "file": {
                const fileValue = fieldValue;
                return (
                    <div className="space-y-2">
                        <label className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border-main rounded-xl cursor-pointer hover:border-primary hover:bg-primary-light/30 transition-colors ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
                            <span className="text-xs text-body mb-1">Click to upload or drag & drop</span>
                            <span className="text-[10px] text-body/60">PDF, DOC, images</span>
                            <input
                                type="file"
                                accept="image/*,.pdf,.doc,.docx"
                                multiple
                                className="sr-only"
                                onChange={(e) => {
                                    const files = e.target.files;
                                    if (!files) return;
                                    const currentFiles = Array.isArray(fieldValue) ? fieldValue : [];
                                    fieldOnChange([...currentFiles, ...Array.from(files)]);
                                }}
                            />
                        </label>
                        {Array.isArray(fileValue) && fileValue.length > 0 && (
                            <div className="space-y-1">
                                {fileValue.map((file: File, index: number) => (
                                    <div key={index} className="flex items-center justify-between bg-alt px-3 py-2 rounded-lg border border-border-main">
                                        <span className="text-xs text-main truncate">{file.name}</span>
                                        <button type="button" onClick={() => fieldOnChange(fileValue.filter((_: File, i: number) => i !== index))} className="text-xs text-red-500 hover:text-red-700 ml-2 font-medium cursor-pointer">
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            }

            case "linkedin":
                return (
                    <input
                        value={fieldValue}
                        onChange={(e) => fieldOnChange(e.target.value)}
                        type="url"
                        disabled={disabled}
                        placeholder={placeholder}
                        required={required}
                        className={`${baseInput} ${disabled ? disabledInput : ""}`}
                    />
                );

            default:
                return <div />;
        }
    };

    // Group fields by header
    const groups: { header: FieldConfig | null; fields: FieldConfig[] }[] = [];
    let currentGroup: { header: FieldConfig | null; fields: FieldConfig[] } = { header: null, fields: [] };

    fields.forEach((field) => {
        if (field.type === "header") {
            if (currentGroup.fields.length > 0 || currentGroup.header) {
                groups.push(currentGroup);
            }
            currentGroup = { header: field, fields: [] };
        } else {
            currentGroup.fields.push(field);
        }
    });
    if (currentGroup.fields.length > 0 || currentGroup.header) {
        groups.push(currentGroup);
    }

    const renderFieldsGrid = (groupFields: FieldConfig[]) => {
        const gridItems = groupFields.map((field, idx) => {
            const { key, label, required, singleFieldInRow, fullRowWidth, tooltip, type } = field;

            if (type === "dynamic") {
                return (
                    <div key={`${key}-${idx}`} className="col-span-full mb-4">
                        {renderFieldComponent(field)}
                    </div>
                );
            }

            const colSpan = (fullRowWidth || singleFieldInRow) ? "col-span-full" : "";
            const error = form.getFieldError?.(key) || get(errors, key);

            return (
                <React.Fragment key={`${key}-${idx}`}>
                    <div className={colSpan}>
                        <div className="mb-4">
                            {/* Label row */}
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <label className="block text-xs font-semibold text-main uppercase tracking-wide">
                                    {label}
                                    {required && <span className="text-red-500 ml-0.5">*</span>}
                                </label>
                                {tooltip && (
                                    <div className="group relative">
                                        <FiInfo className="w-3.5 h-3.5 text-body cursor-help" />
                                        <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2.5 text-xs text-white bg-navy rounded-xl shadow-xl z-50">
                                            {tooltip}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Field */}
                            {renderFieldComponent(field)}

                            {/* Error */}
                            {error && (
                                <p className="mt-1 text-xs text-red-500 font-medium flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-red-500 inline-block" />
                                    {error}
                                </p>
                            )}
                        </div>
                    </div>
                    {singleFieldInRow && <div key={`spacer-${idx}`} className={colSpan} />}
                </React.Fragment>
            );
        });

        return (
            <div
                className="grid gap-x-5 gap-y-1"
                style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
            >
                {gridItems}
            </div>
        );
    };

    // If there is only one group and no header, render it as a flat form
    if (groups.length === 1 && groups[0].header === null) {
        return renderFieldsGrid(groups[0].fields);
    }

    return (
        <div className="space-y-4 text-left">
            {groups.map((group, groupIdx) => {
                const header = group.header;
                if (!header) return null;
                const isOpen = !!openHeaders[header.key];

                return (
                    <div
                        key={header.key || groupIdx}
                        className="border border-border-main rounded-2xl bg-white shadow-sm overflow-hidden"
                    >
                        {/* Accordion trigger header */}
                        <div
                            onClick={() => toggleHeader(header.key)}
                            className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-alt/10 transition-colors"
                        >
                            <div className="flex items-center gap-3.5">
                                {/* Icon box */}
                                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563eb]">
                                    {getIconForHeader(header.label)}
                                </div>
                                <span className="text-sm font-bold text-main font-display">
                                    {header.label}
                                </span>
                            </div>
                            {isOpen ? (
                                <FiChevronUp className="w-4 h-4 text-slate-500" />
                            ) : (
                                <FiChevronRight className="w-4 h-4 text-slate-500" />
                            )}
                        </div>

                        {/* Accordion panel content */}
                        {isOpen && (
                            <div className="px-6 pb-6 pt-5 border-t border-border-main bg-white">
                                {renderFieldsGrid(group.fields)}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default DynamicFormBuilder;

// Re-export child components
export { default as ToggleSwitch } from './Switch';
export { default as TagsInput } from './TagSelector';
export { renderArrayInput } from './renderingArray';
export { default as CustomForm } from './CustomForm';
