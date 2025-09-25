
import React, { useEffect, useState } from 'react'
import { drugData } from '../../sampleData/data'
import Summary from './Summary';
import Table from './Table';



const CompoundInformation: React.FC = () => {
    const [activeSection, setActiveSection] = useState<string>('');

    const formatKey = (key: string) => {
        const result = key.replace(/([A-Z])/g, " $1");
        return result.charAt(0).toUpperCase() + result.slice(1);
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                let maxDepth = -1;
                let active = '';
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const depth = entry.target.id.split('-').length;
                        if (depth > maxDepth) {
                            maxDepth = depth;
                            active = entry.target.id;
                        }
                    }
                });
                if (active) setActiveSection(active);
            },
            { threshold: 0, rootMargin: '0px 0px 0px 0px' }
        );

        const headings = document.querySelectorAll('[id^="section-"]');
        headings.forEach((h) => observer.observe(h));

        return () => observer.disconnect();
    }, []);

    return (

        <div className="w-full min-h-[60vh] flex flex-col items-center bg-white/80 py-8 text-black">

            {drugData.map((drug, index) => (
                <div className='w-full max-w-7xl flex flex-row md:flex-row gap-4'>

                    <div className='flex-1 flex flex-col gap-6 min-w-0 mr-80'>

                        <div className='mb-10'>
                            <Summary drug={drug} index={index} sectionId={0} />
                        </div>
                        <div>
                            <div key={index + 1} className="mb-10">
                                <h1 id={`section-1`} className="text-2xl font-bold border-blue-400 border-b-4 pb-1 mb-4">
                                    {index + 1}. Market Information:
                                </h1>
                                {Object.entries(drug.marketInformation)
                                    .filter(
                                        ([_, value]) =>
                                            value && value.toString().toLowerCase() !== "n/a"
                                    )
                                    .map(([key, value], idx) => (
                                        <div key={key} className="mb-4">
                                            <h2 id={`section-1-${idx + 1}`} className="font-bold border-blue-400 border-b-3 pb-1">
                                                {index + 1}.{idx + 1} {formatKey(key)}
                                            </h2>
                                            <p>{value}</p>
                                        </div>
                                    ))}
                            </div>
                            <div key={index + 2} id={`section-2`} className="mb-10">
                                <h1 id={`section-2`} className="text-2xl font-bold border-blue-400 border-b-4 pb-1 mb-4">
                                    {index + 2}.Drug Substance
                                </h1>
                                <div id={`section-2-1`}>
                                    <h2 id={`section-2-1`} className='text-xl font-bold border-blue-400 border-b-3 pb-1 mb-4'> {index + 2}.1. Physical And Chemical Properties</h2>
                                    {Object.entries(drug.drugSubstance.physicalAndChemicalProperties)
                                        .filter(
                                            ([_, value]) =>
                                                value && value.toString().toLowerCase() !== "n/a"
                                        )
                                        .map(([key, value], idx) => (
                                            <div key={key} id={`section-2-1-${idx + 1}`} className="mb-4">
                                                <h3 id={`section-2-1-${idx + 1}`} className="font-bold border-blue-400 border-b-2 pb-1">
                                                    {index + 2}.1.{idx + 1} {formatKey(key)}
                                                </h3>
                                                <p>{value}</p>
                                            </div>
                                        ))}
                                </div>
                                <div id={`section-2-2`}>
                                    <h2 id={`section-2-2`} className='text-xl font-bold border-blue-400 border-b-3 pb-1 mb-4'> {index + 2}.2. Process Development</h2>
                                    {Object.entries(drug.drugSubstance.processDevelopment)
                                        .filter(([_, value]) => value && value.toString().toLowerCase() !== "n/a")
                                        .map(([key, value], idx) => (
                                            <div key={`process-${idx}`} id={`section-2-2-${idx + 1}`} className="mb-4">
                                                <h3 id={`section-2-2-${idx + 1}`} className="font-bold border-blue-400 border-b-2 pb-1">
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
                                </div>
                                <div id={`section-2-3`}>
                                    <h2 id={`section-2-3`} className='text-xl font-bold border-blue-400 border-b-3 pb-1 mb-4'> {index + 2}.3. Analytical Development</h2>
                                    {Object.entries(drug.drugSubstance.analyticalDevelopment)
                                        .filter(
                                            ([_, value]) =>
                                                value && value.toString().toLowerCase() !== "n/a"
                                        )
                                        .map(([key, value], idx) => (
                                            <div key={key} id={`section-2-3-${idx + 1}`} className="mb-4">
                                                <h3 id={`section-2-3-${idx + 1}`} className="font-bold border-blue-400 border-b-2 pb-1">
                                                    {index + 2}.3.{idx + 1} {formatKey(key)}
                                                </h3>
                                                <p>{value}</p>
                                            </div>
                                        ))}
                                </div>
                            </div>
                            <div key={index + 3} className="mb-10">
                                <h1 id={`section-3`} className="text-2xl font-bold border-blue-400 border-b-4 pb-1 mb-4">
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
                                                    <h2 id={`section-3-${sectionCounter}`} className="font-bold border-blue-400 border-b-3 pb-1 mb-2">
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
                                                    <h2 id={`section-3-${sectionCounter}`} className="font-bold border-blue-400 border-b-3 pb-1 mb-2">
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
                                                    <h2 id={`section-3-${sectionCounter}`} className="font-bold border-blue-400 border-b-3 pb-1 mb-2">
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
                                                    <h2 id={`section-3-${sectionCounter}`} className="font-bold border-blue-400 border-b-3 pb-1 mb-1">
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
                                                    <h2 id={`section-3-${sectionCounter}`} className="font-bold border-blue-400 border-b-3 pb-1 mb-1">
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
                                <h1 id={`section-4`} className="text-2xl font-bold border-blue-400 border-b-4 pb-1 mb-4">
                                    {index + 4}. References
                                </h1>
                                {drug.references.map((ref, refindex) => (
                                    <div key={refindex} className="mb-2">
                                        <h2 id={`section-4-${refindex + 1}`} className="font-semibold">
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
                    <div className="fixed right-0 top-0 w-80 h-screen overflow-y-auto bg-white border border-gray-300 rounded-lg p-4">
                        <Table drug={drug} activeSection={activeSection} />
                    </div>
                </div>
            ))}
        </div>

    );
};

export default CompoundInformation;


