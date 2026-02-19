import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import { FiTrash2 } from "react-icons/fi";
import type { FieldConfig } from "./index";

interface CustomFormProps {
    field: FieldConfig;
    form: any;
}

const CustomForm: React.FC<CustomFormProps> = ({ field, form }) => {
    const [formFields, setFormFields] = useState<any[]>([]);
    const { key, dynamicFields } = field;

    const getInitialValues = () => {
        const initialValues: any = {};
        dynamicFields?.forEach((field) => {
            if (field.key === "phone") {
                initialValues[field.key] = "+1";
            } else {
                initialValues[field.key] = "";
            }
        });
        return initialValues;
    };

    useEffect(() => {
        let values = form.getFieldValue?.(key) || [];

        // Defensive check: ensure values is always an array
        if (!Array.isArray(values)) {
            console.warn(`CustomForm: Expected array for field "${key}" but got:`, typeof values);
            values = [];
        }

        if (values.length === 0) {
            const initialValuesRows = field.initialValues || [getInitialValues()];
            setFormFields(initialValuesRows);
            if (form.setFieldsValue) {
                form.setFieldsValue({ [key]: initialValuesRows });
            }
        } else {
            setFormFields(values);
        }
    }, [key, field.initialValues]);

    const handleAddDynamicField = () => {
        const initialValues = getInitialValues();
        const updatedFields = [...formFields, initialValues];
        setFormFields(updatedFields);
        if (form.setFieldsValue) {
            form.setFieldsValue({ [key]: updatedFields });
        }
    };

    const handleRemoveDynamicField = (index: number) => {
        const updatedFields = formFields.filter((_, i) => i !== index);
        setFormFields(updatedFields);
        if (form.setFieldsValue) {
            form.setFieldsValue({ [key]: updatedFields });
        }
    };

    const handleFieldChange = (index: number, fieldKey: string, value: any) => {
        const updatedFields = [...formFields];
        updatedFields[index] = {
            ...updatedFields[index],
            [fieldKey]: value,
        };
        setFormFields(updatedFields);
        if (form.setFieldsValue) {
            form.setFieldsValue({ [key]: updatedFields });
        }
    };

    const renderFieldInput = (
        dynamicField: any,
        index: number,
        value: any
    ) => {
        const commonClasses = `w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`;

        switch (dynamicField.type) {
            case "text":
                return (
                    <input
                        type="text"
                        value={value || ""}
                        onChange={(e) =>
                            handleFieldChange(index, dynamicField.key, e.target.value)
                        }
                        placeholder={dynamicField.placeholder || "Enter Text"}
                        required={dynamicField.required}
                        className={commonClasses}
                    />
                );

            case "contact":
                return (
                    <PhoneInput
                        country={"us"}
                        value={value || "+1"}
                        onChange={(formattedValue) =>
                            handleFieldChange(index, dynamicField.key, formattedValue)
                        }
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

            case "textarea":
                return (
                    <textarea
                        value={value || ""}
                        onChange={(e) =>
                            handleFieldChange(index, dynamicField.key, e.target.value)
                        }
                        placeholder={dynamicField.placeholder || "Enter Text"}
                        required={dynamicField.required}
                        rows={3}
                        className={`${commonClasses} resize-y`}
                    />
                );

            case "datepicker":
                return (
                    <input
                        type={dynamicField.includeTime ? "datetime-local" : "date"}
                        value={value || ""}
                        onChange={(e) =>
                            handleFieldChange(index, dynamicField.key, e.target.value)
                        }
                        placeholder={dynamicField.placeholder}
                        required={dynamicField.required}
                        className={commonClasses}
                    />
                );

            case "dropdown":
                return (
                    <select
                        value={value || ""}
                        onChange={(e) =>
                            handleFieldChange(index, dynamicField.key, e.target.value)
                        }
                        required={dynamicField.required}
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

            case "file":
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
                                const currentFiles = Array.isArray(value) ? value : [];
                                handleFieldChange(index, dynamicField.key, [...currentFiles, ...fileArray]);
                            }}
                            className={commonClasses}
                        />
                        {Array.isArray(value) && value.length > 0 && (
                            <div className="space-y-1">
                                {value.map((file: any, fileIndex: number) => (
                                    <div
                                        key={fileIndex}
                                        className="flex items-center justify-between bg-gray-100 p-2 rounded"
                                    >
                                        <span className="text-sm truncate">{file.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newFiles = value.filter(
                                                    (_: any, i: number) => i !== fileIndex
                                                );
                                                handleFieldChange(index, dynamicField.key, newFiles);
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

            default:
                return null;
        }
    };

    return (
        <div className="space-y-4">
            {formFields.map((fieldGroup, index) => (
                <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {dynamicFields?.map((dynamicField) => (
                            <div key={`${index}-${dynamicField.key}`} className="flex flex-col">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {dynamicField.label}
                                    {dynamicField.required && (
                                        <span className="text-red-500 ml-1">*</span>
                                    )}
                                </label>
                                {renderFieldInput(
                                    dynamicField,
                                    index,
                                    fieldGroup[dynamicField.key]
                                )}
                                {dynamicField.key === "email" && fieldGroup[dynamicField.key] && (
                                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                                        fieldGroup[dynamicField.key]
                                    ) && (
                                        <p className="mt-1 text-xs text-red-500">
                                            The input is not valid email!
                                        </p>
                                    )
                                )}
                            </div>
                        ))}
                        <div className="flex items-end">
                            <button
                                type="button"
                                onClick={() => handleRemoveDynamicField(index)}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                                aria-label="Remove field"
                            >
                                <FiTrash2 className="w-4 h-4" />

                            </button>
                        </div>
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={handleAddDynamicField}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
                Add
            </button>
        </div>
    );
};

export default CustomForm;
