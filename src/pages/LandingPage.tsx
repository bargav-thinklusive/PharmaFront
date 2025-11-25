import React from 'react';
import { Link } from 'react-router-dom';
import video from "../assets/AdobeStock_178894522_Video_4K_Preview.mov";

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="w-full py-12">
                    <div className="text-center">
                        <video
                            src={video}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-screen h-auto mb-8 object-cover"
                            style={{ maxHeight: '90vh' }}
                        />
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                            Welcome to <span className="text-[#36b669]">CMCINTEL</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            A data-driven platform that accelerates and de-risks drug development
                        </p>
                    </div>
                </div>

                {/* Background decoration */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#36b669]/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-16 bg-[#36b669] mt-12">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Explore the World of Pharmaceuticals?
                    </h2>
                    <p className="text-xl text-green-100 mb-8">
                        Join thousands of researchers and professionals using CMC Intel for their drug discovery needs.
                    </p>
                    <Link
                        to="/login"
                        className="bg-white text-[#36b669] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
                    >
                        Start Your Journey
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
