import { FiX } from "react-icons/fi";

export const renderArrayInput = (
    values: any[] = [],
    setValues: (newValue: any[]) => void
) => {
    return (
        <div className="space-y-2">
            {values.map((value: any, index: number) => (
                <div key={index} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => {
                            const newValues = [...values];
                            newValues[index] = e.target.value;
                            setValues(newValues);
                        }}
                        className="flex-1 px-3.5 py-2.5 border border-border-main rounded-xl text-sm text-main focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary placeholder-[#94A3B8] bg-white transition-shadow"
                    />
                    {index > 0 && (
                        <button
                            type="button"
                            onClick={() => {
                                const newValues = [...values];
                                newValues.splice(index, 1);
                                setValues(newValues);
                            }}
                            className="w-9 h-9 flex items-center justify-center text-sm text-red-500 hover:text-red-700 border border-red-200 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                        >
                            <FiX className="w-4 h-4" />
                        </button>
                    )}
                </div>
            ))}
            <button
                type="button"
                onClick={() => {
                    setValues([...values, ""]);
                }}
                className="px-4 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors cursor-pointer"
            >
                Add
            </button>
        </div>
    );
};
