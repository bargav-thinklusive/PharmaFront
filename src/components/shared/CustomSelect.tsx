import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import ReactDOM from "react-dom";
import { FiChevronDown } from "react-icons/fi";

export interface CustomSelectOption {
    label: string;
    value: any;
}

interface CustomSelectProps {
    value?: any;
    onChange?: (value: any) => void;
    options?: (CustomSelectOption | string)[];
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    className?: string;
    containerClassName?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
    value = "",
    onChange,
    options = [],
    placeholder = "Select...",
    disabled = false,
    required = false,
    className = "",
    containerClassName = "",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [coords, setCoords] = useState<{ top: number; left: number; width: number }>({
        top: 0,
        left: 0,
        width: 0,
    });

    // Normalize options into { label, value } array
    const normalizedOptions: CustomSelectOption[] = options.map((opt) => {
        if (typeof opt === "string") {
            return { label: opt, value: opt };
        }
        return {
            label: opt.label !== undefined ? String(opt.label) : String(opt.value),
            value: opt.value !== undefined ? opt.value : opt.label,
        };
    });

    const selectedOption = normalizedOptions.find((opt) => String(opt.value) === String(value));
    const displayLabel = selectedOption ? selectedOption.label : (placeholder || "Select...");

    const updateCoords = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + 4,
                left: rect.left,
                width: rect.width,
            });
        }
    };

    const handleToggle = () => {
        if (disabled) return;
        if (!isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + 4,
                left: rect.left,
                width: rect.width,
            });
        }
        setIsOpen((prev) => !prev);
    };

    useLayoutEffect(() => {
        if (isOpen) {
            updateCoords();
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const handleScrollOrResize = (e: Event) => {
            if (dropdownRef.current && dropdownRef.current.contains(e.target as Node)) {
                return;
            }
            updateCoords();
        };

        const handleClickOutside = (event: MouseEvent) => {
            const isClickOnButton = buttonRef.current && buttonRef.current.contains(event.target as Node);
            const isClickOnDropdown = dropdownRef.current && dropdownRef.current.contains(event.target as Node);
            if (!isClickOnButton && !isClickOnDropdown) {
                setIsOpen(false);
            }
        };

        window.addEventListener("scroll", handleScrollOrResize, true);
        window.addEventListener("resize", handleScrollOrResize);
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener("scroll", handleScrollOrResize, true);
            window.removeEventListener("resize", handleScrollOrResize);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleSelect = (optionValue: any) => {
        onChange?.(optionValue);
        setIsOpen(false);
    };

    return (
        <div className={`relative w-full ${containerClassName}`}>
            <button
                ref={buttonRef}
                type="button"
                disabled={disabled}
                onClick={handleToggle}
                className={`w-full px-3.5 py-2.5 border border-border-main rounded-xl text-sm text-left bg-white flex items-center justify-between transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                    disabled ? "bg-alt opacity-60 cursor-not-allowed" : "hover:border-primary/50"
                } ${className}`}
            >
                <span className={`truncate ${!selectedOption && placeholder ? "text-[#94A3B8]" : "text-main"}`}>
                    {displayLabel}
                </span>
                <FiChevronDown
                    className={`w-4 h-4 text-body shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-primary" : ""
                    }`}
                />
            </button>

            {/* Hidden native input for form validation if required */}
            {required && (
                <input
                    type="text"
                    required={required}
                    value={value || ""}
                    onChange={() => {}}
                    className="sr-only"
                    tabIndex={-1}
                />
            )}

            {/* Dropdown Options List — Rendered via React Portal only when measured */}
            {isOpen && coords.width > 0 && !disabled && ReactDOM.createPortal(
                <div
                    ref={dropdownRef}
                    style={{
                        position: "fixed",
                        top: coords.top,
                        left: coords.left,
                        width: coords.width,
                    }}
                    className="bg-white border border-border-main rounded-xl shadow-2xl z-[999999] max-h-60 overflow-y-auto py-1 animate-in fade-in zoom-in-95 duration-150"
                >
                    {placeholder && (
                        <div
                            onClick={() => handleSelect("")}
                            className={`px-3.5 py-2 cursor-pointer text-sm transition-colors text-[#94A3B8] hover:bg-slate-50 ${
                                !value ? "font-semibold bg-primary-light/30" : ""
                            }`}
                        >
                            {placeholder}
                        </div>
                    )}
                    {normalizedOptions.length === 0 ? (
                        <div className="px-3.5 py-2 text-sm text-body text-center">No options available</div>
                    ) : (
                        normalizedOptions.map((option, idx) => {
                            const isSelected = String(option.value) === String(value);
                            return (
                                <div
                                    key={`${option.value}-${idx}`}
                                    onClick={() => handleSelect(option.value)}
                                    className={`px-3.5 py-2 cursor-pointer text-sm transition-colors flex items-center justify-between ${
                                        isSelected
                                            ? "bg-primary-light/40 text-primary font-semibold"
                                            : "text-main hover:bg-slate-50"
                                    }`}
                                >
                                    <span className="truncate">{option.label}</span>
                                </div>
                            );
                        })
                    )}
                </div>,
                document.body
            )}
        </div>
    );
};

export default CustomSelect;
