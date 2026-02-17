
interface SectionHeaderProps {
    currentStep: number;
    totalSteps: number;
    title?: string;
}

/**
 * Header component for each section showing progress and title.
 */
const SectionHeader = ({ currentStep, totalSteps, title }: SectionHeaderProps) => {
    return (
        <header className="mb-8 flex justify-between items-center border-b pb-4">
            <h1 className="text-xl font-bold text-gray-500">
                Section {currentStep} <span className="text-gray-300 mx-1">/</span> {totalSteps}
            </h1>
            <div className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100 shadow-sm">
                {title}
            </div>
        </header>
    );
};

export default SectionHeader;
