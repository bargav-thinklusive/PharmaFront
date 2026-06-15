import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { FaFlask } from 'react-icons/fa';
import { FiBarChart2, FiShield, FiGlobe, FiPieChart, FiUsers, FiMail, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import MoleculeBackground from '../shared/MoleculeBackground';

const images = [
    "/assets/Landingpageimage.jpg",
    "/assets/LandingPageImage.jpeg",
];

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextSlide = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    useEffect(() => {
        const timer = setInterval(nextSlide, 10000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-page pt-20 pb-12 font-sans overflow-x-hidden">
            {/* Background decoration elements */}
            <div className="absolute top-0 right-0 -z-10 w-full h-full overflow-hidden opacity-30 pointer-events-none">
                <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-b from-primary-light to-transparent blur-3xl mix-blend-multiply"></div>
                <div className="absolute top-[40%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-t from-primary-light to-transparent blur-3xl mix-blend-multiply"></div>
            </div>
            <MoleculeBackground />

            {/* Hero Section */}
            <div className="max-w-[1500px] mx-auto px-3 sm:px-5 lg:px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
                    {/* Left Column (Text) — 2/5 width */}
                    <div className="lg:col-span-2">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-display text-main leading-tight mb-4 tracking-tight">
                            Welcome to <br className="hidden sm:block"/>
                            <span className="text-primary">cmcintel</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-body mb-8 max-w-lg leading-relaxed">
                            A data-driven platform that accelerates and de-risks drug development.
                        </p>
                        <button 
                            className='bg-primary text-white px-6 py-3 rounded-lg font-medium font-display hover:bg-primary-hover transition-colors flex items-center gap-3 shadow-md hover:shadow-lg' 
                            onClick={() => navigate("/contacts")}
                        >
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                            Request A Call
                        </button>
                    </div>

                    {/* Right Column (Image/Carousel) — 3/5 width, wide rectangle */}
                    <div className="lg:col-span-3 relative w-full rounded-2xl overflow-hidden shadow-xl border border-border-main" style={{ aspectRatio: '16/9', minHeight: '260px' }}>
                        {images.map((img, index) => (
                            <div
                                key={img}
                                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                                    }`}
                            >
                                <img
                                    src={img}
                                    alt={`Slide ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Features & Controls Row */}
                <div className="mt-16 flex flex-col lg:flex-row items-center justify-between gap-8 pt-8">
                    {/* Features */}
                    <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 w-full lg:w-auto">
                        <div className="flex items-start gap-4">
                            <div className="text-primary text-3xl mt-0.5">
                                <FiBarChart2 />
                            </div>
                            <div>
                                <h3 className="font-bold text-section font-display">Data-Driven</h3>
                                <p className="text-body text-sm">Real-world insights</p>
                            </div>
                        </div>
                        <div className="hidden sm:block w-px bg-border-main"></div>
                        <div className="flex items-start gap-4">
                            <div className="text-primary text-3xl mt-0.5">
                                <FiShield />
                            </div>
                            <div>
                                <h3 className="font-bold text-section font-display">De-risk Development</h3>
                                <p className="text-body text-sm">Smarter decisions</p>
                            </div>
                        </div>
                        <div className="hidden sm:block w-px bg-border-main"></div>
                        <div className="flex items-start gap-4">
                            <div className="text-primary text-3xl mt-0.5">
                                <FaFlask />
                            </div>
                            <div>
                                <h3 className="font-bold text-section font-display">Faster Outcomes</h3>
                                <p className="text-body text-sm">Better patient impact</p>
                            </div>
                        </div>
                    </div>

                    {/* Carousel Controls */}
                    <div className="flex items-center gap-4 text-body bg-content px-4 py-2 rounded-full shadow-sm border border-border-main">
                        <button onClick={prevSlide} className="hover:text-primary transition-colors">
                            <FiChevronLeft className="w-5 h-5" />
                        </button>
                        
                        <div className="flex gap-2">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                                        index === currentImageIndex ? 'bg-primary' : 'bg-gray-200'
                                    }`}
                                />
                            ))}
                        </div>

                        <span className="text-sm font-medium text-body ml-2 font-display">
                            {currentImageIndex + 1} of {images.length}
                        </span>

                        <button onClick={nextSlide} className="hover:text-primary transition-colors ml-2">
                            <FiChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Middle Section ("Ready to Explore...") */}
            <div className="max-w-[1500px] mx-auto px-3 sm:px-5 lg:px-6 py-16 relative z-10">
                <div className="bg-primary-light rounded-3xl p-8 sm:p-12 lg:p-16 text-center shadow-sm border border-border-main">
                    <h2 className="text-2xl sm:text-3xl font-bold font-display text-main mb-12">
                        Ready to Explore the World of Pharmaceuticals?
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
                        {/* Box 1 */}
                        <div className="flex flex-col sm:flex-row gap-5 items-start">
                            <div className="bg-primary text-white p-4 rounded-full flex-shrink-0 shadow-md">
                                <FiGlobe className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-section font-display mb-2">Comprehensive Coverage</h3>
                                <p className="text-body text-sm leading-relaxed">
                                    Explore an extensive database of drugs, companies, and pipeline intelligence.
                                </p>
                            </div>
                        </div>
                        {/* Box 2 */}
                        <div className="flex flex-col sm:flex-row gap-5 items-start">
                            <div className="bg-primary text-white p-4 rounded-full flex-shrink-0 shadow-md">
                                <FiPieChart className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-section font-display mb-2">Actionable Insights</h3>
                                <p className="text-body text-sm leading-relaxed">
                                    Leverage advanced analytics to make informed, confident decisions.
                                </p>
                            </div>
                        </div>
                        {/* Box 3 */}
                        <div className="flex flex-col sm:flex-row gap-5 items-start">
                            <div className="bg-primary text-white p-4 rounded-full flex-shrink-0 shadow-md">
                                <FiUsers className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-section font-display mb-2">Collaborate & Grow</h3>
                                <p className="text-body text-sm leading-relaxed">
                                    Partner with experts and accelerate innovation together.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Newsletter Section */}
            <div className="max-w-4xl mx-auto px-3 sm:px-5 lg:px-6 pb-20 relative z-10">
                <div className="bg-content rounded-2xl shadow-lg border border-border-main p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-5 w-full sm:w-auto">
                        <div className="bg-primary-light text-primary p-4 rounded-full flex-shrink-0">
                            <FiMail className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-section font-display">Newsletter</h3>
                            <p className="text-body text-sm">
                                Stay updated with the latest news and insights from cmcintel.
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex w-full sm:w-auto gap-3 flex-col sm:flex-row">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="w-full sm:w-64 px-4 py-3 sm:py-2.5 border border-border-main rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm text-body"
                        />
                        <button className="bg-primary text-white px-6 py-3 sm:py-2.5 rounded-lg font-medium font-display hover:bg-primary-hover transition-colors whitespace-nowrap text-sm shadow-md">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
