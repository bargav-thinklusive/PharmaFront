import React, { useEffect, useState } from 'react';
import Image1 from "../../../public/assets/Whatwedoimage1.png"
import Image2 from "../../../public/assets/Whatwedoimage21.jpg"
import Image3 from "../../../public/assets/Whatwedoimage3.png"

const WhatWeDo: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [
    Image1,
    Image2,
    Image3,
  ];

  // Content for each slide
  const slideContent = [
    // Slide 1 - Image1 content
    (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg border-l-4 border-[#36b669]">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              A data-driven platform that accelerates and de-risks
            </h3>
            <p className="text-gray-700">
              A data-driven platform that accelerates and de-risks drug development
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border-l-4 border-[#36b669]">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Welcome to CMC Intel
            </h3>
            <p className="text-gray-700">
              Welcome to CMC Intel - Your comprehensive platform for pharmaceutical intelligence.
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border-l-4 border-[#36b669]">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              CMCIntel provides transformative intelligence
            </h3>
            <p className="text-gray-700">
              CMCIntel provides transformative intelligence, empowering innovation through enriched data, advanced analytics, and expert insights across the pharmaceutical industry.
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border-l-4 border-[#36b669]">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Data as a Service
            </h3>
            <p className="text-gray-700">
              CMC Intel's Data-as-a-Service (DaaS) platform empowers faster and lower-risk drug development by providing comprehensive, structured intelligence on the development, manufacturing, and regulatory history of each molecule. By integrating global data from discovery through approval, the platform enables R&D, CMC, and regulatory teams to make informed, data-driven decisions—reducing duplication of effort, identifying development bottlenecks early, and accelerating the path from lab to market.
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border-l-4 border-[#36b669]">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Data Validation and Quality Check
            </h3>
            <p className="text-gray-700">
              All data within the CMC Intel platform undergoes rigorous validation and multi-layer quality checks to ensure accuracy, consistency, and regulatory relevance. Each data source is verified against authoritative references, and automated algorithms are complemented by expert scientific review to maintain data integrity. This robust quality framework ensures users can rely on CMC Intel's insights for confident, evidence-based decision-making across development and regulatory functions.
            </p>
          </div>
        </div>
      </div>
    ),
    // Slide 2 - Image2 content
    (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg border-l-4 border-[#36b669]">
            <p className="text-gray-700">
              We help teams anticipate regulatory expectations, reduce CMC risk, and accelerate approvals by translating complex global requirements into clear, actionable guidance.
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border-l-4 border-[#36b669]">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Global CMC Regulatory Intelligence
            </h3>
            <ul className="ml-6 space-y-1 text-gray-700">
              <li className="list-disc">Country-specific CMC expectations (US, EU, UK, JP, CN, IN, ROW)</li>
              <li className="list-disc">Comparative requirements for NDA, ANDA, 505(b)(2), IMPD, MAA</li>
              <li className="list-disc">Evolving regulatory trends, guidances, and precedent approvals</li>
            </ul>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border-l-4 border-[#36b669]">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Module 3 (Quality) Strategy & Readiness
            </h3>
            <ul className="ml-6 space-y-1 text-gray-700">
              <li className="list-disc">Drug Substance & Drug Product CMC strategy</li>
              <li className="list-disc">Specification setting and justification</li>
              <li className="list-disc">Stability strategy, shelf-life assignment, and extrapolation rationale</li>
              <li className="list-disc">Change management and comparability assessments</li>
            </ul>
          </div>
        </div>
      </div>
    ),
    // Slide 3 - Image3 content (placeholder for now)
    (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg border-l-4 border-[#36b669]">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Content Coming Soon
            </h3>
            <p className="text-gray-700">
              Additional content for this section will be added soon.
            </p>
          </div>
        </div>
      </div>
    ),
  ];

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length)
  }

  useEffect(() => {
    const timer = setInterval(nextSlide, 10000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              What we do
            </h1>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#36b669]/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Image Carousel Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="relative h-[500px]">
          {/* Image Container - Only shows current slide */}
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
            >
              <img
                src={image}
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
          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`rounded-full transition-all duration-300 ${currentSlide === index
                  ? 'bg-[#36b669] w-8 h-3'
                  : 'bg-gray-300 hover:bg-gray-400 w-3 h-3'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 min-h-[500px]">
          {slideContent[currentSlide]}
        </div>
      </div>
    </div >
  );
};

export default WhatWeDo;