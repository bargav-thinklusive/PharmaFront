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
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {index > 0 && (
                        <button
                            type="button"
                            onClick={() => {
                                const newValues = [...values];
                                newValues.splice(index, 1);
                                setValues(newValues);
                            }}
                            className="px-3 py-2 text-sm text-red-600 hover:text-red-700 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
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
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
                Add
            </button>
        </div>
    );
};
