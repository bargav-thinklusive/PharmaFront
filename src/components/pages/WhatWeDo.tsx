import React, { useState, useEffect } from 'react';
import { FiDatabase, FiShield, FiGlobe, FiFileText, FiCheckCircle, FiBarChart2, FiUsers, FiChevronRight, FiChevronLeft, FiActivity, FiBox } from 'react-icons/fi';
import MoleculeBackground from '../shared/MoleculeBackground';
import Image1 from "../../../public/assets/Whatwedoimage1.png";
import Image2 from "../../../public/assets/Whatwedoimage21.jpg";
import Image3 from "../../../public/assets/Whatwedoimage3.png";

const WhatWeDo: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const images = [Image1, Image2, Image3];

    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % images.length);

    useEffect(() => {
        const timer = setInterval(nextSlide, 10000);
        return () => clearInterval(timer);
    }, []);

    // Content for the dynamic strip based on the slide
    const stripContent = [
        // Slide 1 Content (4 items)
        [
            {
                icon: <FiActivity className="w-8 h-8" />,
                title: "Data-Driven Platform",
                description: "A platform that accelerates and de-risks drug development."
            },
            {
                icon: <FiDatabase className="w-8 h-8" />,
                title: "Data as a Service",
                description: "Comprehensive, structured intelligence on development, manufacturing, and regulatory history."
            },
            {
                icon: <FiCheckCircle className="w-8 h-8" />,
                title: "Data Validation",
                description: "Rigorous validation and multi-layer quality checks for accuracy and regulatory relevance."
            },
            {
                icon: <FiBarChart2 className="w-8 h-8" />,
                title: "Transformative Intel",
                description: "Empowering innovation through enriched data, advanced analytics, and expert insights."
            }
        ],
        // Slide 2 Content (4 items)
        [
            {
                icon: <FiUsers className="w-8 h-8" />,
                title: "Anticipate Expectations",
                description: "We help teams anticipate regulatory expectations, reduce CMC risk, and accelerate approvals."
            },
            {
                icon: <FiGlobe className="w-8 h-8" />,
                title: "Global CMC Intel",
                description: "Country-specific expectations, comparative requirements, and evolving regulatory trends."
            },
            {
                icon: <FiFileText className="w-8 h-8" />,
                title: "Module 3 Strategy",
                description: "Drug Substance & Product CMC strategy, specifications, stability, and comparability."
            },
            {
                icon: <FiBox className="w-8 h-8" />,
                title: "Placeholder Box",
                description: "Data will be added later for this column."
            }
        ],
        // Slide 3 Content (4 items)
        [
            {
                icon: <FiShield className="w-8 h-8" />,
                title: "Content Coming Soon",
                description: "Additional content for this section will be added soon."
            },
            {
                icon: <FiBox className="w-8 h-8" />,
                title: "Placeholder Box",
                description: "Data will be added later for this column."
            },
            {
                icon: <FiBox className="w-8 h-8" />,
                title: "Placeholder Box",
                description: "Data will be added later for this column."
            },
            {
                icon: <FiBox className="w-8 h-8" />,
                title: "Placeholder Box",
                description: "Data will be added later for this column."
            }
        ]
    ];

    return (
        <div className="min-h-screen bg-page pt-20 pb-20 font-sans overflow-x-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 -z-10 w-full h-full overflow-hidden opacity-40 pointer-events-none">
                <div className="absolute -left-[10%] top-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-r from-primary-light to-transparent blur-3xl mix-blend-multiply"></div>
                <div className="absolute -right-[10%] bottom-[20%] w-[50%] h-[50%] rounded-full bg-gradient-to-l from-primary-light to-transparent blur-3xl mix-blend-multiply"></div>
            </div>
            <MoleculeBackground />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
                
                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center mb-16">
                    {/* Left content */}
                    <div className="lg:col-span-5">
                        <div className="inline-flex items-center gap-2 text-primary font-bold text-sm tracking-wider uppercase mb-6 bg-primary-light px-3 py-1 rounded-full border border-primary-light">
                            <span className="w-2 h-2 rounded-full bg-primary"></span>
                            Our Services
                        </div>
                        
                        <h1 className="text-5xl md:text-6xl font-extrabold text-main font-display mb-6 relative inline-block">
                            What we do
                            <div className="absolute -bottom-2 left-0 w-2/3 h-1.5 bg-primary rounded-full"></div>
                        </h1>
                        
                        <h2 className="text-xl md:text-2xl font-bold text-section font-display mb-4 mt-8 leading-snug">
                            Translating complex data <br className="hidden xl:block" />
                            into life-changing possibilities
                        </h2>
                        
                        <p className="text-lg text-body leading-relaxed max-w-lg">
                            A data-driven platform that accelerates and de-risks drug development with real-world intelligence and advanced analytics.
                        </p>
                    </div>

                    {/* Right Carousel */}
                    <div className="lg:col-span-7 relative">
                        <div className="relative w-full h-[350px] sm:h-[450px] md:h-[550px] rounded-3xl overflow-hidden shadow-lg bg-white border border-border-main p-2 lg:p-4">
                            <div className="w-full h-full relative rounded-2xl overflow-hidden">
                                {images.map((img, index) => (
                                    <div
                                        key={index}
                                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                                    >
                                        <img
                                            src={img}
                                            alt={`Service visualization ${index + 1}`}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Carousel Controls */}
                        <div className="flex justify-center items-center gap-4 mt-6">
                            <button onClick={prevSlide} className="p-2 text-secondary hover:text-main transition-colors bg-white rounded-full shadow-sm border border-border-main hover:shadow">
                                <FiChevronLeft className="w-5 h-5" />
                            </button>
                            
                            <div className="flex items-center gap-2">
                                <div className="h-1.5 w-8 bg-primary rounded-full"></div>
                                <span className="text-sm font-medium text-secondary px-2 font-display">
                                    {currentSlide + 1} of {images.length}
                                </span>
                            </div>

                            <button onClick={nextSlide} className="p-2 text-secondary hover:text-main transition-colors bg-white rounded-full shadow-sm border border-border-main hover:shadow">
                                <FiChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Dynamic Features Strip */}
                <div className="mb-16 transition-all duration-500 ease-in-out">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {stripContent[currentSlide].map((item, idx) => (
                            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-border-main p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                                <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center text-primary mb-4">
                                    {item.icon}
                                </div>
                                <h3 className="font-bold text-section font-display mb-2">{item.title}</h3>
                                <p className="text-body text-sm leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-border-main overflow-hidden flex flex-col lg:flex-row">
                    {/* Left Half */}
                    <div className="lg:w-5/12 bg-alt p-10 lg:p-14 flex flex-col justify-center items-start border-r border-border-main relative">
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-50 pointer-events-none -z-10">
                            <div className="absolute top-0 right-0 w-[150%] h-[150%] rounded-full bg-gradient-to-br from-primary-light to-transparent blur-3xl mix-blend-multiply transform -translate-y-1/2 translate-x-1/4"></div>
                        </div>
                        
                        <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center mb-8 relative border-[6px] border-primary-light">
                            <div className="w-16 h-16 rounded-full bg-navy flex items-center justify-center text-primary">
                                <FiBarChart2 className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-main font-display mb-4 leading-tight">
                            A data-driven platform that accelerates and de-risks drug development
                        </h2>
                        <p className="text-body text-lg">
                            Combining enriched data, advanced analytics, and expert insights.
                        </p>
                    </div>

                    {/* Right Half */}
                    <div className="lg:w-7/12 p-8 lg:p-12">
                        <div className="flex flex-col gap-6">
                            {/* Item 1 */}
                            <div className="flex items-start gap-6 group cursor-default">
                                <div className="flex-shrink-0 w-10 h-10 rounded bg-navy text-white flex items-center justify-center font-bold font-display text-sm shadow-sm">
                                    01
                                </div>
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center">
                                    <FiDatabase className="w-5 h-5" />
                                </div>
                                <div className="flex-grow">
                                    <h4 className="font-bold text-section font-display mb-1 group-hover:text-primary transition-colors">Enriched Data</h4>
                                    <p className="text-body text-sm">Access comprehensive and high-quality datasets from global sources.</p>
                                </div>
                                <div className="text-gray-300 group-hover:text-primary transition-colors mt-2">
                                    <FiChevronRight className="w-5 h-5" />
                                </div>
                            </div>

                            <hr className="border-border-main" />

                            {/* Item 2 */}
                            <div className="flex items-start gap-6 group cursor-default">
                                <div className="flex-shrink-0 w-10 h-10 rounded bg-primary text-white flex items-center justify-center font-bold font-display text-sm shadow-sm">
                                    02
                                </div>
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center">
                                    <FiBarChart2 className="w-5 h-5" />
                                </div>
                                <div className="flex-grow">
                                    <h4 className="font-bold text-section font-display mb-1 group-hover:text-primary transition-colors">Advanced Analytics</h4>
                                    <p className="text-body text-sm">Leverage AI/ML models and statistical insights for smarter decisions.</p>
                                </div>
                                <div className="text-gray-300 group-hover:text-primary transition-colors mt-2">
                                    <FiChevronRight className="w-5 h-5" />
                                </div>
                            </div>

                            <hr className="border-border-main" />

                            {/* Item 3 */}
                            <div className="flex items-start gap-6 group cursor-default">
                                <div className="flex-shrink-0 w-10 h-10 rounded bg-primary text-white flex items-center justify-center font-bold font-display text-sm shadow-sm opacity-90">
                                    03
                                </div>
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center">
                                    <FiUsers className="w-5 h-5" />
                                </div>
                                <div className="flex-grow">
                                    <h4 className="font-bold text-section font-display mb-1 group-hover:text-primary transition-colors">Expert Insights</h4>
                                    <p className="text-body text-sm">Benefit from domain expertise and deep therapeutic knowledge.</p>
                                </div>
                                <div className="text-gray-300 group-hover:text-primary transition-colors mt-2">
                                    <FiChevronRight className="w-5 h-5" />
                                </div>
                            </div>

                            <hr className="border-border-main" />

                            {/* Item 4 */}
                            <div className="flex items-start gap-6 group cursor-default">
                                <div className="flex-shrink-0 w-10 h-10 rounded bg-primary text-white flex items-center justify-center font-bold font-display text-sm shadow-sm opacity-80">
                                    04
                                </div>
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center">
                                    <FiShield className="w-5 h-5" />
                                </div>
                                <div className="flex-grow">
                                    <h4 className="font-bold text-section font-display mb-1 group-hover:text-primary transition-colors">Regulatory Confidence</h4>
                                    <p className="text-body text-sm">Built-in checks to ensure accuracy, consistency, and regulatory relevance.</p>
                                </div>
                                <div className="text-gray-300 group-hover:text-primary transition-colors mt-2">
                                    <FiChevronRight className="w-5 h-5" />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default WhatWeDo;