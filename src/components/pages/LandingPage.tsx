import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
const images = [
    "/assets/Landingpageimage.jpg",
    "/assets/LandingPageImage.jpeg",
];

const LandingPage: React.FC = () => {
    const navigate = useNavigate()
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
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center relative">
                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                            Welcome to <span className="text-[#8ce1ae]">CMCINTEL</span>
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 max-w-3xl mx-auto">
                            A data-driven platform that accelerates and de-risks drug development
                        </p>
                        <button className='bg-[#8ce1ae] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#2d9d58] transition-colors mb-8' onClick={() => navigate("/contacts")}>Request A Call</button>

                        <div className="relative w-full h-48 sm:h-72 md:h-[500px] overflow-hidden rounded-lg">
                            {images.map((img, index) => (
                                <div
                                    key={img}
                                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                                        }`}
                                >
                                    <img
                                        src={img}
                                        alt={`Slide ${index + 1}`}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Carousel Controls Row */}
                        <div className="flex items-center justify-center gap-3 mt-4">
                            {/* Left Arrow */}
                            <button
                                onClick={prevSlide}
                                className="bg-gray-200 hover:bg-[#36b669] hover:text-white text-gray-600 p-2 rounded-full transition-colors duration-200"
                                aria-label="Previous slide"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                            </button>

                            {/* Indicator Bars */}
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    aria-label={`Go to slide ${index + 1}`}
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                        index === currentImageIndex
                                            ? 'w-10 bg-[#36b669]'
                                            : 'w-5 bg-gray-300 hover:bg-gray-400'
                                    }`}
                                />
                            ))}

                            {/* Right Arrow */}
                            <button
                                onClick={nextSlide}
                                className="bg-gray-200 hover:bg-[#36b669] hover:text-white text-gray-600 p-2 rounded-full transition-colors duration-200"
                                aria-label="Next slide"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>

                            {/* X of Y label */}
                            <span className="text-sm font-medium text-gray-500 ml-1">
                                {currentImageIndex + 1} of {images.length}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Background decoration */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#8ce1ae]/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-8 sm:py-16 bg-[#8ce1ae] mt-6 sm:mt-12">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
                        Ready to Explore the World of Pharmaceuticals?
                    </h2>
                    <p className="text-base sm:text-xl text-green-100 mb-4 sm:mb-8">
                        Join thousands of researchers and professionals using CMC Intel for their drug discovery needs.
                    </p>
                    <p className="text-base sm:text-xl text-green-100 mb-4 sm:mb-8">
                        CMC Intel transforms complex CMC data into actionable intelligence.
                        By curating drug substance, drug product, quality, and regulatory-CMC insights in one place, we streamline product development and global filings. Our tailored intelligence as per customer needs enables portfolio, R&D, CMC, quality, and regulatory teams to make faster, smarter, and lower-risk decisions.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
