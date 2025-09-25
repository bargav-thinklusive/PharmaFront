
import React from 'react'
import { drugData } from '../../sampleData/data'
import Summary from './Summary';
import Table from './Table';



const CompoundInformation: React.FC = () => {
    const formatKey = (key: string) => {
        const result = key.replace(/([A-Z])/g, " $1");
        return result.charAt(0).toUpperCase() + result.slice(1);
    };

    return (

        <div className="w-full min-h-[60vh] flex flex-col items-center bg-white/80 py-8 text-black">

            {drugData.map((drug, index) => (
                <div className='w-full max-w-7xl flex flex-row md:flex-row gap-4'>

                    <div className='flex-1 flex flex-col gap-6 min-w-0'>

                        <div className='mb-10'>
                            <Summary drug={drug} />
                        </div>
                        <div>
                            <div key={index + 1} className="mb-10">
                                <h1 className="text-2xl font-bold border-blue-400 border-b-4 pb-1 mb-4">
                                    {index + 1}. Market Information:
                                </h1>
                                {Object.entries(drug.marketInformation)
                                    .filter(
                                        ([_, value]) =>
                                            value && value.toString().toLowerCase() !== "n/a"
                                    )
                                    .map(([key, value], idx) => (
                                        <div key={key} className="mb-4">
                                            <h2 className="font-bold border-blue-400 border-b-3 pb-1">
                                                {index + 1}.{idx + 1} {formatKey(key)}
                                            </h2>
                                            <p>{value}</p>
                                        </div>
                                    ))}
                            </div>
                            <div key={index + 2} className="mb-10">
                                <h1 className="text-2xl font-bold border-blue-400 border-b-4 pb-1 mb-4">
                                    {index + 2}.Drug Substance
                                </h1>
                                <h2 className='text-xl font-bold border-blue-400 border-b-3 pb-1 mb-4'> {index + 2}.1. Physical And Chemical Properties</h2>
                                {Object.entries(drug.drugSubstance.physicalAndChemicalProperties)
                                    .filter(
                                        ([_, value]) =>
                                            value && value.toString().toLowerCase() !== "n/a"
                                    )
                                    .map(([key, value], idx) => (
                                        <div key={key} className="mb-4">
                                            <h3 className="font-bold border-blue-400 border-b-2 pb-1">
                                                {index + 2}.1.{idx + 1} {formatKey(key)}
                                            </h3>
                                            <p>{value}</p>
                                        </div>
                                    ))}
                                <h2 className='text-xl font-bold border-blue-400 border-b-3 pb-1 mb-4'> {index + 2}.2. Process Development</h2>
                                {Object.entries(drug.drugSubstance.processDevelopment)
                                    .filter(([_, value]) => value && value.toString().toLowerCase() !== "n/a")
                                    .map(([key, value], idx) => (
                                        <div key={`process-${idx}`} className="mb-4">
                                            <h3 className="font-bold border-blue-400 border-b-2 pb-1">
                                                {index + 2}.2.{idx + 1} {formatKey(key)}
                                            </h3>
                                            <div className="ml-4">
                                                {Array.isArray(value) ? (
                                                    typeof value[0] === "object" ? (
                                                        // Array of objects
                                                        value.map((obj, i) => (
                                                            <div key={i} className="ml-4 mb-2">
                                                                {Object.entries(obj).map(([k, val]) => (
                                                                    <div key={k}>
                                                                        <strong>{formatKey(k)}:</strong> {val}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        // Array of strings
                                                        <div className="ml-4">{value.join(", ")}</div>
                                                    )
                                                ) : (
                                                    // Single string
                                                    <div className="ml-4">{value}</div>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                <h2 className='text-xl font-bold border-blue-400 border-b-3 pb-1 mb-4'> {index + 2}.3. Analytical Development</h2>
                                {Object.entries(drug.drugSubstance.analyticalDevelopment)
                                    .filter(
                                        ([_, value]) =>
                                            value && value.toString().toLowerCase() !== "n/a"
                                    )
                                    .map(([key, value], idx) => (
                                        <div key={key} className="mb-4">
                                            <h3 className="font-bold border-blue-400 border-b-2 pb-1">
                                                {index + 2}.3.{idx + 1} {formatKey(key)}
                                            </h3>
                                            <p>{value}</p>
                                        </div>
                                    ))}
                            </div>
                            <div key={index + 3} className="mb-10">
                                <h1 className="text-2xl font-bold border-blue-400 border-b-4 pb-1 mb-4">
                                    {index + 3}. Drug Product
                                </h1>
                                {(() => {
                                    let sectionCounter = 0; // this will increment only for rendered sections
                                    return Object.entries(drug.drugProduct?.information || {}).map(([key, value], idx) => {
                                        if (!value || value.toString().toLowerCase() === "n/a") return null;

                                        sectionCounter++; // increment only if we render something

                                        // Strengths
                                        if (key === "strengths" && Array.isArray(value)) {
                                            return (
                                                <div key={idx} className="mb-6">
                                                    <h2 className="font-bold border-blue-400 border-b-3 pb-1 mb-2">
                                                        {index + 3}.{sectionCounter}. Strengths
                                                    </h2>
                                                    <table className="table-auto border-collapse border-b border-blue-400 mb-4">
                                                        <thead>
                                                            <tr>
                                                                <th className="border border-gray-400 px-2">Index</th>
                                                                <th className="border border-gray-400 px-2">Type</th>
                                                                <th className="border border-gray-400 px-2">Strength</th>
                                                                <th className="border border-gray-400 px-2">Description</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {value.map((v: any, i: number) => (
                                                                <tr key={i}>
                                                                    <td className="border border-gray-400 px-2">{i + 1}</td>
                                                                    <td className="border border-gray-400 px-2">{v.type}</td>
                                                                    <td className="border border-gray-400 px-2">{v.strength}</td>
                                                                    <td className="border border-gray-400 px-2">{v.description}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            );
                                        }

                                        // Current Expiration Dating
                                        if (key === "currentExpirationDating" && typeof value === "object") {
                                            return (
                                                <div key={idx} className="mb-6">
                                                    <h2 className="font-bold border-blue-400 border-b-3 pb-1 mb-2">
                                                        {index + 3}.{sectionCounter}. Current Expiration Dating
                                                    </h2>
                                                    {Object.entries(value).map(([k, v], i) => (
                                                        <p key={i}>
                                                            {formatKey(k)}: {v}
                                                        </p>
                                                    ))}
                                                </div>
                                            );
                                        }

                                        // Packaging and Storage Conditions
                                        if (key === "packagingAndStorageConditions" && typeof value === "object") {
                                            const { storageTemperature, ...rest } = value as any;
                                            return (
                                                <div key={idx} className="mb-6">
                                                    <h2 className="font-bold border-blue-400 border-b-3 pb-1 mb-2">
                                                        {index + 3}.{sectionCounter}. Packaging and Storage Conditions
                                                    </h2>
                                                    <table className="table-auto border-collapse border border-gray-400 mb-4">
                                                        <thead>
                                                            <tr>
                                                                <th className="border border-gray-400 px-2">Strength</th>
                                                                <th className="border border-gray-400 px-2">Description</th>
                                                                <th className="border border-gray-400 px-2">Packaging</th>
                                                                <th className="border border-gray-400 px-2">Type</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {Object.entries(rest).map(([strengthKey, obj]: any, i) => (
                                                                <tr key={i}>
                                                                    <td className="border border-gray-400 px-2">{strengthKey}</td>
                                                                    <td className="border border-gray-400 px-2">{obj.description}</td>
                                                                    <td className="border border-gray-400 px-2">{obj.packaging}</td>
                                                                    <td className="border border-gray-400 px-2">{obj.type}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                    <p>
                                                        <strong>Storage Temperature:</strong> {storageTemperature}
                                                    </p>
                                                </div>
                                            );
                                        }

                                        // Arrays of strings (foodInteractions, drugDrugInteractions)
                                        if (Array.isArray(value) && value.every(v => typeof v === "string")) {
                                            return (
                                                <div key={idx} className="mb-4">
                                                    <h2 className="font-bold border-blue-400 border-b-3 pb-1 mb-1">
                                                        {index + 3}.{sectionCounter}. {formatKey(key)}
                                                    </h2>
                                                    {value.map((v, i) => (
                                                        <p key={i}>
                                                            {i + 1}. {v}
                                                        </p>
                                                    ))}
                                                </div>
                                            );
                                        }

                                        // Normal primitive values
                                        if (typeof value === "string" || typeof value === "number") {
                                            return (
                                                <div key={idx} className="mb-4">
                                                    <h2 className="font-bold border-blue-400 border-b-3 pb-1 mb-1">
                                                        {index + 3}.{sectionCounter}. {formatKey(key)}
                                                    </h2>
                                                    <p>{value}</p>
                                                </div>
                                            );
                                        }

                                        return null;
                                    });
                                })()}
                            </div>
                            <div key={index + 4} className='mb-10'>
                                <h1 className="text-2xl font-bold border-blue-400 border-b-4 pb-1 mb-4">
                                    {index + 4}. References
                                </h1>
                                {drug.references.map((ref, refindex) => (
                                    <div key={refindex} className="mb-2">
                                        <h2 className="font-semibold">
                                            {refindex + 1}. {ref.title}
                                        </h2>
                                        <a
                                            href={ref.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 underline hover:text-blue-800 break-words"
                                        >
                                            {ref.url}
                                        </a>
                                    </div>
                                ))}
                            </div>


                        </div>
                    </div>
                    <div className="w-1/3">
                        <Table drug={drug} />
                    </div>
                </div>
            ))}
        </div>

    );
};

export default CompoundInformation;


