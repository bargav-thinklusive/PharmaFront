import React, { useState, useRef, useEffect } from "react";
import { renderArrayInput } from "./renderingArray";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import get from "lodash.get";
import TagsInput from "./TagSelector";
import { FiInfo, FiChevronDown } from "react-icons/fi";
import ToggleSwitch from "./Switch";

// Inline Autocomplete Component
interface AutocompleteOption {
    value: any;
    label: string;
}

interface AutocompleteProps {
    value?: string;
    onChange?: (value: string) => void;
    options?: AutocompleteOption[];
    placeholder?: string;
    disabled?: boolean;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
    value = "",
    onChange,
    options = [],
    placeholder = "Select...",
    disabled = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value);
    const [filteredOptions, setFilteredOptions] = useState(options);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    useEffect(() => {
        const filtered = options.filter((option) =>
            option.label.toLowerCase().includes(inputValue.toLowerCase())
        );
        setFilteredOptions(filtered);
    }, [inputValue, options]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        setIsOpen(true);
        onChange?.(newValue);
    };

    const handleOptionClick = (option: AutocompleteOption) => {
        setInputValue(option.label);
        onChange?.(option.value);
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} className="relative w-full">
            <div className="relative">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`
            w-full px-3 py-2 pr-10 border border-gray-300 rounded-md 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${disabled ? "bg-gray-50 opacity-50 cursor-not-allowed" : "bg-white"}
          `}
                />
                <FiChevronDown
                    className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </div>

            {isOpen && filteredOptions.length > 0 && !disabled && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredOptions.map((option, index) => (
                        <div
                            key={`${option.value}-${index}`}
                            onClick={() => handleOptionClick(option)}
                            className="px-3 py-2 cursor-pointer hover:bg-blue-50 text-sm"
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}

            {isOpen && filteredOptions.length === 0 && inputValue && !disabled && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    <div className="px-3 py-2 text-sm text-gray-500">No options found</div>
                </div>
            )}
        </div>
    );
};

export interface FieldConfig {
    label: string;
    key: string;
    type?:
    | "text"
    | "dropdown"
    | "autocomplete"
    | "datepicker"
    | "array"
    | "textarea"
    | "contact"
    | "select"
    | "checkbox"
    | "Switch"
    | "number"
    | "radio"
    | "tag"
    | "header"
    | "dynamic"
    | "file"
    | "rangepicker"
    | "linkedin";

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
    fields?: {
        label: string;
        key: string;
        type: string;
        placeholder: string;
        required: boolean;
        includeTime?: boolean;
        options?: { label: string; value: string }[];
    }[];
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
    dynamicOptions?: {
        [key: string]: any[];
    };
    notFoundContent?: {
        [key: string]: React.ReactNode;
    };
    onChange?: (changedValues: any, allValues: any) => void;
}

const DynamicFormBuilder: React.FC<DynamicFormBuilderProps> = ({
    fields,
    form,
    columns = 1,
    dynamicOptions = {},
    onChange,
}) => {
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateZipCode = (value: any) => {
        if (value && !/^\d+$/.test(value)) {
            return "Zip Code must be numeric";
        } else if (value && value.length < 5) {
            return "Zip Code must be at least 5 characters";
        }
        return true;
    };

    const handleFieldChange = (key: string, value: any) => {
        if (form.setFieldsValue) {
            form.setFieldsValue({ [key]: value });
        }

        if (onChange) {
            onChange({ [key]: value }, form.getFieldsValue ? form.getFieldsValue() : form);
        }

        // Validate field
        validateField(key, value);
    };

    const validateField = (key: string, value: any) => {
        const field = fields.find(f => f.key === key);
        if (!field) return;

        let error = "";

        // Required validation
        if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
            error = "Required";
        }

        // Field-specific validations
        if (!error && value) {
            if (key === "firstName" || key === "lastName") {
                if (value.length < 4) {
                    error = "Name must be greater than 3 characters";
                }
            }
            if (key === "email") {
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    error = "Invalid email format";
                }
            }
            if (field.type === "linkedin") {
                if (!/^(https?:\/\/)?(www\.)?linkedin\.com\/in\/.+$/.test(value)) {
                    error = "Please enter a valid LinkedIn URL";
                }
            }
            if (key === "zipCode") {
                const zipError = validateZipCode(value);
                if (zipError !== true) {
                    error = zipError;
                }
            }
            if (key === "version") {
                if (!/^\d+$/.test(value)) {
                    error = "version should be number only";
                }
            }
        }

        setErrors(prev => ({
            ...prev,
            [key]: error
        }));
    };

    const handleSwitch = (key: string, checked: boolean) => {
        handleFieldChange(key, checked);
    };

    const renderFieldComponent = (field: FieldConfig) => {
        const {
            key,
            type = "text",
            required,
            placeholder,
            disabled,
            options = [],
            valueKey = "value",
            labelKey = "label",
            includeTime = false,
            additinalLabel,
            dynamicComponent,
            defaultValue,
            render,
        } = field;

        const allOptions = [...options, ...(dynamicOptions?.[key] || [])].filter(
            (option) => option !== null
        );

        const fieldValue = (form.getFieldValue ? form.getFieldValue(key) : form[key]) ?? defaultValue ?? "";
        const fieldOnChange = (newValue: any) => handleFieldChange(key, newValue);

        switch (type) {
            case "text":
                return render ? (
                    render(fieldValue, fieldOnChange)
                ) : (
                    <input
                        value={fieldValue}
                        onChange={(e) => fieldOnChange(e.target.value)}
                        type="text"
                        disabled={disabled}
                        placeholder={placeholder}
                        required={required}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${disabled ? "bg-gray-50 opacity-50 cursor-not-allowed" : ""
                            }`}
                    />
                );

            case "number":
                return render ? (
                    render(fieldValue, fieldOnChange)
                ) : (
                    <input
                        value={fieldValue}
                        onChange={(e) => fieldOnChange(e.target.value)}
                        type="number"
                        disabled={disabled}
                        placeholder={placeholder}
                        required={required}
                        className={`w-1/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${disabled ? "bg-gray-50 opacity-50 cursor-not-allowed" : ""
                            }`}
                    />
                );

            case "dropdown":
                return render ? (
                    render(fieldValue, fieldOnChange)
                ) : (
                    <select
                        value={fieldValue}
                        onChange={(e) => fieldOnChange(e.target.value)}
                        disabled={disabled}
                        required={required}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${disabled ? "bg-gray-50 opacity-50 cursor-not-allowed" : ""
                            }`}
                    >
                        <option value="">{placeholder || "Select..."}</option>
                        {allOptions?.map((option, idx) => (
                            <option key={idx} value={option[valueKey]}>
                                {option[labelKey]}
                            </option>
                        ))}
                    </select>
                );

            case "select":
                return render ? (
                    render(fieldValue, fieldOnChange)
                ) : (
                    <select
                        value={fieldValue}
                        onChange={(e) => fieldOnChange(e.target.value)}
                        disabled={disabled}
                        required={required}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${disabled ? "bg-gray-50 opacity-50 cursor-not-allowed" : ""
                            }`}
                    >
                        <option value="">{placeholder || "Select..."}</option>
                        {allOptions?.map((option, idx) => (
                            <option key={idx} value={get(option, labelKey)}>
                                {option[labelKey]}
                            </option>
                        ))}
                    </select>
                );

            case "autocomplete":
                return (
                    <Autocomplete
                        value={fieldValue}
                        onChange={fieldOnChange}
                        options={allOptions?.map((option) => ({
                            value: get(option, valueKey),
                            label: get(option, labelKey),
                        }))}
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
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${disabled ? "bg-gray-50 opacity-50 cursor-not-allowed" : ""
                            }`}
                    />
                );

            case "rangepicker":
                const rangeStart = fieldValue?.[0] || "";
                const rangeEnd = fieldValue?.[1] || "";
                return (
                    <div className="flex items-center gap-2">
                        <input
                            type={includeTime ? "datetime-local" : "date"}
                            value={rangeStart}
                            onChange={(e) => {
                                const newDates = [e.target.value, rangeEnd];
                                fieldOnChange(newDates);
                                handleFieldChange("minDateValue", e.target.value || null);
                            }}
                            disabled={disabled}
                            placeholder={placeholder || "Start Date"}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${disabled ? "bg-gray-50 opacity-50 cursor-not-allowed" : ""
                                }`}
                        />
                        <span className="text-gray-400">—</span>
                        <input
                            type={includeTime ? "datetime-local" : "date"}
                            value={rangeEnd}
                            onChange={(e) => {
                                const newDates = [rangeStart, e.target.value];
                                fieldOnChange(newDates);
                                handleFieldChange("maxDateValue", e.target.value || null);
                            }}
                            disabled={disabled}
                            placeholder={placeholder || "End Date"}
                            min={rangeStart}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${disabled ? "bg-gray-50 opacity-50 cursor-not-allowed" : ""
                                }`}
                        />
                    </div>
                );

            case "array":
                return render
                    ? render(fieldValue, fieldOnChange)
                    : renderArrayInput(fieldValue || [], fieldOnChange);

            case "textarea":
                return (
                    <textarea
                        value={fieldValue}
                        onChange={(e) => fieldOnChange(e.target.value)}
                        disabled={disabled}
                        placeholder={placeholder}
                        required={required}
                        rows={3}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y ${disabled ? "bg-gray-50 opacity-50 cursor-not-allowed" : ""
                            }`}
                    />
                );

            case "contact":
                return (
                    <PhoneInput
                        country={"us"}
                        value={fieldValue}
                        onChange={(formattedValue) => fieldOnChange(formattedValue)}
                        inputStyle={{
                            width: "100%",
                            height: 40,
                            borderRadius: 6,
                            borderWidth: "1px",
                            borderStyle: "solid",
                            borderColor: "#d1d5db",
                        }}
                        containerStyle={{
                            width: "100%",
                        }}
                    />
                );

            case "checkbox":
                return (
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={fieldValue || false}
                            onChange={(e) => fieldOnChange(e.target.checked)}
                            required={required}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        {additinalLabel && (
                            <label className="ml-2 text-sm text-gray-700">
                                {additinalLabel}
                            </label>
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
                    <div className="flex flex-col gap-2">
                        {allOptions?.map((option, idx) => (
                            <label
                                key={idx}
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <input
                                    type="radio"
                                    value={option[valueKey]}
                                    checked={fieldValue === option[valueKey]}
                                    onChange={() => fieldOnChange(option[valueKey])}
                                    required={required}
                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">
                                    {option[labelKey]}
                                </span>
                            </label>
                        ))}
                    </div>
                );

            case "tag":
                return (
                    <TagsInput
                        value={fieldValue || []}
                        onChange={(tags: any) => fieldOnChange(tags)}
                    />
                );

            case "header":
                return <div />;

            case "dynamic":
                return dynamicComponent ? <>{dynamicComponent(key, field, form)}</> : <div />;

            case "file":
                const fileValue = fieldValue;
                return (
                    <div className="space-y-2">
                        <input
                            type="file"
                            accept="image/*,.pdf,.doc,.docx"
                            multiple
                            onChange={(e) => {
                                const files = e.target.files;
                                if (!files) return;
                                const fileArray = Array.from(files);
                                const currentFiles = Array.isArray(fieldValue) ? fieldValue : [];
                                fieldOnChange([...currentFiles, ...fileArray]);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {Array.isArray(fileValue) && fileValue.length > 0 && (
                            <div className="space-y-1">
                                {fileValue.map((file: File, index: number) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between bg-gray-100 p-2 rounded"
                                    >
                                        <span className="text-sm truncate">{file.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newFiles = fileValue.filter(
                                                    (_: File, i: number) => i !== index
                                                );
                                                fieldOnChange(newFiles);
                                            }}
                                            className="text-red-500 hover:text-red-700 text-sm ml-2"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );

            case "linkedin":
                return (
                    <input
                        value={fieldValue}
                        onChange={(e) => fieldOnChange(e.target.value)}
                        type="url"
                        disabled={disabled}
                        placeholder={placeholder}
                        required={required}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${disabled ? "bg-gray-50 opacity-50 cursor-not-allowed" : ""
                            }`}
                    />
                );

            default:
                return <div />;
        }
    };

    const formItems = fields.map((field, idx) => {
        const { key, label, required, singleFieldInRow, fullRowWidth, tooltip, type } =
            field;

        // Don't render header type as a field
        if (type === "header") {
            return (
                <div
                    key={`header-${idx}`}
                    className="col-span-full text-lg font-semibold text-gray-900 mt-4 mb-2"
                >
                    {label}
                </div>
            );
        }

        const colSpan = (fullRowWidth || singleFieldInRow) ? "col-span-full" : "";
        // Check for errors from external form first, then fallback to internal errors
        const error = form.getFieldError?.(key) || get(errors, key);

        return (
            <React.Fragment key={`${key}-${idx}`}>
                <div className={colSpan}>
                    <div className="mb-4">
                        <div className="flex items-center gap-1 mb-1">
                            <label className="block text-sm font-medium text-gray-700">
                                {label}
                                {required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            {tooltip && (
                                <div className="group relative">
                                    <FiInfo className="w-4 h-4 text-gray-400 cursor-help" />
                                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 text-xs text-white bg-gray-900 rounded shadow-lg z-10">
                                        {tooltip}
                                    </div>
                                </div>
                            )}
                        </div>
                        {renderFieldComponent(field)}
                        {error && (
                            <p className="mt-1 text-xs text-red-500">
                                {error}
                            </p>
                        )}
                    </div>
                </div>
                {singleFieldInRow && <div key={`spacer-${idx}`} className={colSpan}></div>}
            </React.Fragment>
        );
    });

    return (
        <div
            className="grid gap-x-4"
            style={{
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
        >
            {formItems}
        </div>
    );
};

export default DynamicFormBuilder;

// Re-export child components
export { default as ToggleSwitch } from './Switch';
export { default as TagsInput } from './TagSelector';
export { renderArrayInput } from './renderingArray';
export { default as CustomForm } from './CustomForm';
