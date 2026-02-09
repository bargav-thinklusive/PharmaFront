import React, { useState, useEffect, useRef } from "react";
import { FiX, FiPlus } from "react-icons/fi";

interface Tag {
    text: string;
    color: string;
}

interface TagsInputProps {
    value?: Tag[];
    onChange: (tags: Tag[]) => void;
}

const TagsInput: React.FC<TagsInputProps> = ({ value = [], onChange }) => {
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (value && value.length > 0) {
            if (typeof value[0] === "string") {
                const updatedValues = (value as any).map((val: string) => ({
                    text: val,
                    color: getRandomColor(),
                }));
                onChange(updatedValues);
            }
        }
    }, []);

    useEffect(() => {
        if (inputVisible) {
            inputRef?.current?.focus();
        }
    }, [inputVisible]);

    const handleIconClick = () => {
        setInputVisible(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleInputConfirm = () => {
        if (inputValue.trim()) {
            onChange([
                ...value,
                { text: inputValue.trim(), color: getRandomColor() },
            ]);
            setInputValue("");
            setInputVisible(false);
        }
    };

    const handleClose = (removedTag: Tag) => {
        const newTags = value.filter((tag: Tag) => tag.text !== removedTag.text);
        onChange(newTags);
    };

    const getRandomColor = () => {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgba(${r}, ${g}, ${b}, 0.8)`;
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            {value.map((tag: Tag, index: number) => (
                <span
                    key={`${tag.text}-${index}`}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded text-sm text-white"
                    style={{ backgroundColor: tag.color }}
                >
                    {tag.text}
                    <button
                        type="button"
                        onClick={() => handleClose(tag)}
                        className="hover:opacity-70 transition-opacity"
                    >
                        <FiX className="w-3 h-3" />
                    </button>
                </span>
            ))}
            {inputVisible ? (
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleInputConfirm();
                        }
                    }}
                    onBlur={() => {
                        setInputVisible(false);
                        setInputValue("");
                    }}
                    ref={inputRef}
                    placeholder="New tag"
                    className="w-20 h-6 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
            ) : (
                <button
                    type="button"
                    onClick={handleIconClick}
                    className="inline-flex items-center gap-1 px-2 py-1 h-6 text-sm text-gray-600 border border-dashed border-gray-300 rounded hover:border-blue-500 hover:text-blue-500 transition-colors"
                >
                    <FiPlus className="w-3 h-3" />
                    New Tag
                </button>
            )}
        </div>
    );
};

export default TagsInput;
