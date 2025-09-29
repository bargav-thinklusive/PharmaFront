import React, { useEffect, useState, useCallback } from 'react'
import { drugData } from '../../sampleData/data'
import Summary from './Summary';
import Table from './Table';
import { IoIosLink } from 'react-icons/io';


const CompoundInformation: React.FC = () => {
    const [activeSection, setActiveSection] = useState<string>('');


    const formatKey = (key: string) => {
        const result = key.replace(/([A-Z])/g, " $1");
        return result.charAt(0).toUpperCase() + result.slice(1);
    };

    // Improved intersection observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries: IntersectionObserverEntry[]) => {
                // Only update if user is scrolling, not clicking
                const isScrolling = !document.querySelector('[data-clicking="true"]');

                if (!isScrolling) return;

                // Find the most specific visible section near the top
                let bestEntry: IntersectionObserverEntry | null = null;
                let bestDepth = -1;
                let bestTopDistance = Infinity;

                for (const entry of entries) {
                    if (!entry.isIntersecting) continue;

                    const rect = entry.boundingClientRect;
                    const depth = entry.target.id.split('-').length;
                    const topDistance = Math.abs(rect.top - 100);

                    // Prioritize deeper sections that are closer to top
                    if (depth > bestDepth || (depth === bestDepth && topDistance < bestTopDistance)) {
                        bestDepth = depth;
                        bestTopDistance = topDistance;
                        bestEntry = entry;
                    }
                }

                if (bestEntry !== null) {
                    setActiveSection(bestEntry.target.id);
                }
            },
            {
                threshold: [0, 0.1, 0.5, 1.0],
                rootMargin: '-150px 0px -70% 0px'
            }
        );

        const headings = document.querySelectorAll('[id^="section-"]');
        headings.forEach((h) => observer.observe(h));

        return () => observer.disconnect();
    }, []);

    // Handle navigation from TOC
    const handleNavigate = useCallback((sectionId: string) => {
        // Mark as clicking to prevent observer interference
        document.body.setAttribute('data-clicking', 'true');
        setActiveSection(sectionId);

        setTimeout(() => {
            document.body.removeAttribute('data-clicking');
        }, 1000);
    }, []);

    return (
        <div className="w-full min-h-[60vh] flex flex-col items-center bg-white/80 py-8 text-black">
            {drugData.map((drug, drugIndex) => (
                <div key={drugIndex} className='w-full max-w-7xl flex flex-row gap-4'>
                    <div className='flex-1 flex flex-col gap-6 min-w-0 mr-80'>

                        {/* Title and Summary - Section 0 */}
                        <div className='mb-10' id="section-0">
                            <Summary drug={drug} sectionId={0} />
                        </div>

                        <div>
                            {/* Market Information - Section 1 */}
                            <div className="mb-10">
                                {/* Main title (no “1.” prefix) */}
                                <h1
                                    id="section-1"
                                    className="text-2xl font-bold border-sky-400 border-b-4 pb-1 mb-4"
                                >
                                    1.Market Information
                                </h1>

                                {/* Key-value table */}
                                <div className='border-2 border-sky-400 rounded bg-white max-w-3xl'>
                                    <table className="w-full text-sm text-black">
                                        <tbody>
                                            {Object.entries(drug.marketInformation || {})
                                                .filter(
                                                    ([_, value]) =>
                                                        value && value.toString().toLowerCase() !== 'n/a'
                                                )
                                                .map(([key, value]) => (
                                                    <tr
                                                        key={key}
                                                        className="border-b border-blue-100"
                                                    >
                                                        {/* KEY cell */}
                                                        <td className="w-56 p-3 text-black font-semibold" >
                                                            {formatKey(key)}
                                                        </td>

                                                        {/* VALUE cell */}
                                                        <td className="py-2 px-4">{String(value)}</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Drug Substance - Section 2 */}
                            <div className="mb-10">
                                <h1 id="section-2" className="text-2xl font-bold border-blue-400 border-b-4 pb-1 mb-4">
                                    2. Drug Substance
                                </h1>

                                {/* 2.1 ───────────────────────────────── Physical & Chemical Properties */}
                                <div className="mb-6">
                                    <h2
                                        id="section-2-1"
                                        className="text-xl font-bold border-blue-400 border-b-3 pb-1 mb-4"
                                    >
                                        2.1. Physical And Chemical Properties
                                    </h2>

                                    <div className="border-2 border-sky-400 rounded bg-white max-w-3xl">
                                        <table className="w-full  text-sm text-black">
                                            <tbody>
                                                {Object.entries(
                                                    drug.drugSubstance?.physicalAndChemicalProperties || {}
                                                )
                                                    .filter(([_, v]) => v && v.toString().toLowerCase() !== 'n/a')
                                                    .map(([key, value]) => (
                                                        <tr key={key} className='border-b border-blue-100'>
                                                            {/* key / label */}
                                                            <td className="w-56 p-3 text-black font-semibold">
                                                                {formatKey(key)}
                                                            </td>

                                                            {/* value */}
                                                            <td className="py-2 px-4 whitespace-pre-wrap">
                                                                {Array.isArray(value)
                                                                    ? value.join(', ')
                                                                    : typeof value === 'object'
                                                                        ? JSON.stringify(value, null, 2)
                                                                        : String(value)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* 2.2 ───────────────────────────────── Process Development */}
                                <div className="mb-6">
                                    <h2
                                        id="section-2-2"
                                        className="text-xl font-bold border-blue-400 border-b-3 pb-1 mb-4"
                                    >
                                        2.2. Process Development
                                    </h2>

                                    <div className="border-2 border-sky-400 rounded bg-white max-w-3xl">
                                        <table className="w-full  text-sm text-black">
                                            <tbody>
                                                {Object.entries(drug.drugSubstance?.processDevelopment || {})
                                                    .filter(([_, v]) => v && v.toString().toLowerCase() !== 'n/a')
                                                    .map(([key, value]) => (
                                                        <tr key={key} className='border-b border-blue-100'>
                                                            <td className="w-56 p-3 text-black font-semibold">
                                                                {formatKey(key)}
                                                            </td>
                                                            <td className="py-2 px-4 whitespace-pre-wrap">
                                                                {Array.isArray(value)
                                                                    ? value.join(', ')
                                                                    : typeof value === 'object'
                                                                        ? JSON.stringify(value, null, 2)
                                                                        : String(value)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Analytical Development - Section 2.3 */}
                                <div className="mb-6">
                                    <h2 id="section-2-3" className='text-xl font-bold border-blue-400 border-b-3 pb-1 mb-4'>
                                        2.3. Analytical Development
                                    </h2>
                                    {Object.entries(drug.drugSubstance?.analyticalDevelopment || {})
                                        .filter(([_, value]) => value && value.toString().toLowerCase() !== "n/a")
                                        .map(([key, value], idx) => (
                                            <div key={key} className="mb-4">
                                                <h3 id={`section-2-3-${idx + 1}`} className="font-bold border-blue-400 border-b-2 pb-1">
                                                    2.3.{idx + 1} {formatKey(key)}
                                                </h3>
                                                <p>{value}</p>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* Drug Product - Section 3 */}
                            <div className="mb-10">
                                <h1 id="section-3" className="text-2xl font-bold border-blue-400 border-b-4 pb-1 mb-4">
                                    3. Drug Product
                                </h1>
                                {(() => {
                                    let sectionCounter = 0;
                                    return Object.entries(drug.drugProduct?.information || {})
                                        .filter(([_, value]) => value && value.toString().toLowerCase() !== "n/a")
                                        .map(([key, value], idx) => {
                                            sectionCounter++;
                                            const sectionId = `section-3-${sectionCounter}`;

                                            if (key === "strengths" && Array.isArray(value)) {
                                                return (
                                                    <div key={idx} className="mb-6">
                                                        <h2 id={sectionId} className="text-lg font-bold border-blue-400 border-b-3 pb-1 mb-2">
                                                            3.{sectionCounter}. Strengths
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

                                            if (key === "packagingAndStorageConditions" && typeof value === "object") {
                                                const { storageTemperature, ...rest } = value as any;
                                                return (
                                                    <div key={idx} className="mb-6">
                                                        <h2 id={sectionId} className="text-lg font-bold border-blue-400 border-b-3 pb-1 mb-2">
                                                            3.{sectionCounter}. Packaging And Storage Conditions
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
                                                        {storageTemperature && (
                                                            <p>
                                                                <strong>Storage Temperature:</strong> {storageTemperature}
                                                            </p>
                                                        )}
                                                    </div>
                                                );
                                            }

                                            if (typeof value === "object" && !Array.isArray(value)) {
                                                return (
                                                    <div key={idx} className="mb-6">
                                                        <h2 id={sectionId} className="text-lg font-bold border-blue-400 border-b-3 pb-1 mb-2">
                                                            3.{sectionCounter}. {formatKey(key)}
                                                        </h2>
                                                        {Object.entries(value).map(([k, v], i) => (
                                                            <p key={i}>
                                                                <strong>{formatKey(k)}:</strong> {String(v)}
                                                            </p>
                                                        ))}
                                                    </div>
                                                );
                                            }

                                            return (
                                                <div key={idx} className="mb-4">
                                                    <h2 id={sectionId} className="text-lg font-bold border-blue-400 border-b-3 pb-1 mb-1">
                                                        3.{sectionCounter}. {formatKey(key)}
                                                    </h2>
                                                    {Array.isArray(value) ? (
                                                        value.map((v: any, i) => <p key={i}>{i + 1}. {v}</p>)
                                                    ) : (
                                                        <p>{String(value)}</p>
                                                    )}
                                                </div>
                                            );
                                        });
                                })()}
                            </div>
                            {/* Appendices - Section 4 */}
                            <div className='mb-10'>
                                <h1 id="section-4" className="text-2xl font-bold border-blue-400 border-b-4 pb-1 mb-4">
                                    4. Appendices
                                </h1>
                                {/* 4.1 ───────────────────────────────── Appendix 1 */}
                                <div>
                                    <div className='ml-6'>
                                        <div className='flex flex-row justify-between align-center border-blue-400 border-b-4' >
                                            <h2 className='font-semibold'>4.1 {drug?.appendices?.appendix1.name}</h2>
                                            <a
                                                href={drug?.appendices?.appendix1.reference}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <IoIosLink className="cursor-pointer  text-blue-600" style={{ color: "black" }} />
                                            </a>
                                        </div>
                                        <p>{drug.appendices.appendix1.description}</p>

                                    </div>
                                    <div className='ml-10'>
                                        <h3 className='font-semibold border-blue-400 border-b-4'>4.1.1 ModularSynthesis</h3>
                                        <p>{drug.appendices.appendix1.modularSynthesis.overview}</p>
                                        <div className='ml-12'>
                                            {drug.appendices.appendix1.modularSynthesis.steps.map((step, index) => (
                                                <>
                                                    <div key={index} className='font-semibold border-blue-400 border-b-4' >
                                                        <strong >4.1.1.{index + 1} {step.name}</strong>

                                                    </div>
                                                    {step.details.map((detail, detailIndex) => (
                                                        <p key={detailIndex}>{detail}</p>
                                                    ))}
                                                </>
                                            ))}
                                        </div>


                                    </div>
                                    <div className='ml-10'>
  <h3 className='font-semibold border-blue-400 border-b-4'>4.1.2 Synthesis Steps</h3>
  <div className='ml-12'>
    {drug.appendices.appendix1.synthesisSteps.map((step, index) => (
      <div key={index} className="mb-4">
        <div className='font-semibold border-blue-400 border-b-4 pb-1'>
          4.1.2.{index+1}.  {step.title}
        </div>
        <p>{step.description}</p>
        <div >

            {step.links && step.links.map((linkString, linkIndex) => (
          // split concatenated links by 'https://' and add 'https://' back
          linkString.split("https://").filter(Boolean).map((url, i) => (
            <div key={linkIndex} className='flex items-center justify-start'>
                {linkIndex+1}.
                <a
            
              key={i}
              href={`https://${url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800 block break-words"
            >
              {`https://${url}`}
            </a>
            </div>
          ))
        ))}
        </div>
      </div>
    ))}
  </div>
</div>

                                </div>
                                {/* 4.2 ───────────────────────────────── Appendix 2 */}
                                <div className='mt-6'>
                                    <div className='ml-6'>


                                        <h2 className='flex flex-row justify-between align-center border-blue-400 border-b-4 font-bold'>4.2 {drug.appendices.appendix2.name}</h2>

                                    </div>
                                    <div className='ml-10'>
                                        {Object.entries(drug.appendices.appendix2.specifications).map(
                                            ([key, value], index) => {
                                                // Skip if value is undefined, empty, or "N/A"
                                                if (value === undefined || value === "N/A" || value.trim() === "") return null;

                                                return (
                                                    <div key={index} className="mb-2">
                                                        <h3 className="font-semibold border-blue-400 border-b-4 pb-1">
                                                            4.2.{index + 1} {formatKey(key)}
                                                        </h3>
                                                        <p>{value}</p>
                                                    </div>
                                                );
                                            }
                                        )}

                                    </div>
                                </div>
                                {/* 4.3 ───────────────────────────────── Appendix 3 */}
                                <div className='mt-6 ml-6'>
                                    <h2 className='font-bold border-blue-400 border-b-4'>4.3 {drug.appendices.appendix3.name}</h2>
                                    <p>{drug.appendices.appendix3.note}</p>
                                    <div className='ml-10 mt-2'>
                                        <h3 className='font-semibold border-blue-400 border-b-4 pb-1'>4.3.1 Inactive Ingredients</h3>
                                        <table className="table-auto border-collapse border border-gray-400 w-full mt-2">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="border border-gray-400 px-4 py-2 text-left">Ingredient Name</th>
                                                    <th className="border border-gray-400 px-4 py-2 text-left">Strength</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {drug.appendices.appendix3.inactiveIngredients.map((ingredient, index) => (
                                                    <tr key={index}>
                                                        <td className="border border-gray-400 px-4 py-2">{ingredient.ingredientName}</td>
                                                        <td className="border border-gray-400 px-4 py-2">{ingredient.strength}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                </div>
                                {/* 4.4 ───────────────────────────────── Appendix 4 */}
                                <div className='mt-6 ml-6'>

                                    <h2 className='font-bold border-blue-400 border-b-4'>4.4 {drug.appendices.appendix4.name}</h2>
                                    <ul className='list-disc list-inside'>
                                        {drug.appendices.appendix4.labels.map((item, index) => (
                                            <li key={index}>
                                                <p>{item.label}</p>
                                                <img src={item.image} alt={item.label} className="w-64 h-64 object-contain border my-2 cursor-pointer hover:shadow-lg" />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {/* 4.5 ───────────────────────────────── Appendix 5 */}
                                <div className='mt-6 ml-6'>
                                    <div>
                                        <h2 className='font-bold border-blue-400 border-b-4'>4.5 {drug.appendices.appendix5.name}</h2>
                                        <p>{drug.appendices.appendix5.description}</p>
                                        <div className='ml-10 mt-2'>
                                            {Object.entries(drug.appendices.appendix5.designations).map(([key, value], index) => (
                                                <div key={index} className="mb-4">
                                                    <h3 className="font-semibold border-blue-400 border-b-4 pb-1">
                                                        4.5.{index + 1} {formatKey(key)}
                                                    </h3>
                                                    {Array.isArray(value) ? (
                                                        <ul className="list-disc list-inside">
                                                            {value.map((item, idx) => (
                                                                <li key={idx}>{item}</li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p>{String(value)}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* References - Section 4 */}
                            <div className='mb-10'>
                                <h1 id="section-5" className="text-2xl font-bold border-blue-400 border-b-4 pb-1 mb-4">
                                    5. References
                                </h1>
                                {(drug.references || []).map((ref: any, refIndex: number) => (
                                    <div key={refIndex} className="mb-2">
                                        <h2 id={`section-5-${refIndex + 1}`} className="font-semibold">
                                            {refIndex + 1}. {ref.title}
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

                    {/* Fixed TOC */}
                    <div className="fixed right-0 top-20 w-80 h-[calc(100vh-5rem)] overflow-y-auto bg-white border border-gray-300 rounded-lg p-4 shadow-lg" style={{ zIndex: 50 }}>
                        <Table
                            drug={drug}
                            activeSection={activeSection}
                            onNavigate={handleNavigate}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CompoundInformation;