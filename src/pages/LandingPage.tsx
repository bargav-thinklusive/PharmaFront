import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
const images = [
    "/assets/Landingpageimage.jpg",
    "/assets/LandingPageImage.jpeg",
    "/assets/Landingpageimage4.webp",
    "/assets/Landingpageimage5.png"
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
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center relative">
                        <div className="relative w-full h-[500px] mb-8 overflow-hidden rounded-lg">
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

                            {/* Navigation Arrows */}
                            <button
                                onClick={prevSlide}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors z-10"
                                aria-label="Previous slide"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors z-10"
                                aria-label="Next slide"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>

                            {/* Carousel Dots */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                {images.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`w-3 h-3 rounded-full transition-colors ${index === currentImageIndex ? 'bg-[#8ce1ae]' : 'bg-white/50'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                            Welcome to <span className="text-[#8ce1ae]">CMCINTEL</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            A data-driven platform that accelerates and de-risks drug development
                        </p>
                        <button className='bg-[#8ce1ae] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#2d9d58] transition-colors' onClick={() => navigate("/contacts")}>Request A Call</button>
                    </div>
                </div>

                {/* Background decoration */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#8ce1ae]/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-16 bg-[#8ce1ae] mt-12">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Explore the World of Pharmaceuticals?
                    </h2>
                    <p className="text-xl text-green-100 mb-8">
                        Join thousands of researchers and professionals using CMC Intel for their drug discovery needs.
                    </p>
                    <p className="text-xl text-green-100 mb-8">
                        CMC Intel transforms complex CMC data into actionable intelligence.
                        By curating drug substance, drug product, quality, and regulatory-CMC insights in one place, we streamline product development and global filings. Our tailored intelligence as per customer needs enables portfolio, R&D, CMC, quality, and regulatory teams to make faster, smarter, and lower-risk decisions.

                    </p>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
