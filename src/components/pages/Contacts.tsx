import React, { useState } from 'react';


const Contacts: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="text-center">
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-2">
              Contact us
            </h1>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#36b669]/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 pb-10">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
          <div className={`w-full max-w-2xl ${submitted ? 'mx-auto' : ''}`}>

            {submitted ? (
              /* ── Thank You State ── */
              <div className="flex flex-col items-center justify-center py-12 text-center gap-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9 text-[#36b669]" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Thank You!</h2>
                <p className="text-gray-600 text-base sm:text-lg max-w-md">
                  Thank you for showing interest in <span className="font-semibold text-[#36b669]">CMC Intel</span>. We've received your message and our team will get back to you shortly.
                </p>
                <p className="text-gray-500 text-sm">
                  In the meantime, feel free to reach us directly at{' '}
                  <a href="mailto:Sgarapati@cmcintel.com" className="text-[#36b669] underline font-medium hover:text-[#2d9d58]">
                    Sgarapati@cmcintel.com
                  </a>
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 bg-[#36b669] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#2d9d58] transition-colors text-sm"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              /* ── Contact Form ── */
              <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                {/* Contact info */}
                <div className="w-full">
                  <p className="text-sm sm:text-base mb-2">
                    Please contact{' '}
                    <a href="mailto:Sgarapati@cmcintel.com" className="text-[#36b669] underline hover:text-[#2d9d58] font-semibold break-all">
                      Sgarapati@cmcintel.com
                    </a>{' '}
                    for any queries
                  </p>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Name *</label>
                  <input
                    type="text" id="name" name="name" required
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#36b669] text-sm sm:text-base"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Company *</label>
                  <input
                    type="text" id="company" name="company" required
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#36b669] text-sm sm:text-base"
                    placeholder="Enter your company name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Email *</label>
                  <input
                    type="email" id="email" name="email" required
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#36b669] text-sm sm:text-base"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Registered Business Location</label>
                  <input
                    type="text" id="location" name="location"
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#36b669] text-sm sm:text-base"
                    placeholder="Enter your business location"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Message</label>
                  <textarea
                    id="message" name="message" rows={4}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#36b669] text-sm sm:text-base"
                    placeholder="Enter your message"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#36b669] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold text-base sm:text-lg hover:bg-[#2d9d58] transition-colors shadow-lg hover:shadow-xl"
                >
                  Submit
                </button>
              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;