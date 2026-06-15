import React, { useState } from 'react';
import { FiUser, FiMail, FiMapPin, FiSend, FiPhone, FiClock } from 'react-icons/fi';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';
import MoleculeBackground from '../shared/MoleculeBackground';

const Contacts: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-page pt-20 pb-20 font-sans overflow-x-hidden relative">
      {/* Background decoration elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none -z-10">
          <div className="absolute top-[5%] -left-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-r from-primary-light to-transparent blur-3xl mix-blend-multiply"></div>
          <div className="absolute top-[10%] -right-[5%] w-[30%] h-[30%] rounded-full bg-gradient-to-l from-primary-light to-transparent blur-3xl mix-blend-multiply"></div>
      </div>
      <MoleculeBackground />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-12">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 text-primary font-bold text-sm tracking-wider uppercase mb-6 bg-primary-light px-3 py-1 rounded-full border border-primary-light">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Get In Touch
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold text-main font-display mb-6">
              Contact <span className="text-primary">us</span>
          </h1>
          
          <p className="text-lg text-body leading-relaxed max-w-2xl mx-auto mb-8">
              Have questions or need expert consultation? Reach out and our regulatory experts will get back to you shortly.
          </p>

          {/* Divider */}
          <div className="flex items-center justify-center w-full max-w-[150px] mx-auto">
              <div className="h-px bg-border-main flex-grow"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-primary mx-4"></div>
              <div className="h-px bg-border-main flex-grow"></div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-border-main overflow-hidden flex flex-col lg:flex-row mb-8">
            
            {/* Left Form Section */}
            <div className="w-full lg:w-3/5 p-8 sm:p-12 border-b lg:border-b-0 lg:border-r border-border-main">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12 animate-fade-in">
                    <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-main font-display mb-4">Message Sent!</h2>
                    <p className="text-body mb-8 max-w-sm">
                      Thank you for reaching out. Our regulatory experts will review your inquiry and get back to you shortly.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="bg-navy text-white px-8 py-3 rounded-xl font-bold font-display hover:bg-slate transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {/* Full Name */}
                          <div>
                              <label htmlFor="name" className="block text-sm font-medium text-section mb-2">Full Name *</label>
                              <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-body opacity-60">
                                      <FiUser className="w-5 h-5" />
                                  </div>
                                  <input type="text" id="name" required placeholder="Enter your name" className="w-full pl-11 pr-4 py-3 border border-border-main rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-section transition-shadow" />
                              </div>
                          </div>

                          {/* Company */}
                          <div>
                              <label htmlFor="company" className="block text-sm font-medium text-section mb-2">Company *</label>
                              <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-body opacity-60">
                                      <HiOutlineOfficeBuilding className="w-5 h-5" />
                                  </div>
                                  <input type="text" id="company" required placeholder="Enter your company name" className="w-full pl-11 pr-4 py-3 border border-border-main rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-section transition-shadow" />
                              </div>
                          </div>

                          {/* Email */}
                          <div>
                              <label htmlFor="email" className="block text-sm font-medium text-section mb-2">Email *</label>
                              <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-body opacity-60">
                                      <FiMail className="w-5 h-5" />
                                  </div>
                                  <input type="email" id="email" required placeholder="Enter your email" className="w-full pl-11 pr-4 py-3 border border-border-main rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-section transition-shadow" />
                              </div>
                          </div>

                          {/* Phone Number */}
                          <div>
                              <label htmlFor="phone" className="block text-sm font-medium text-section mb-2">Phone Number</label>
                              <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-body opacity-60">
                                      <FiPhone className="w-5 h-5" />
                                  </div>
                                  <input type="tel" id="phone" placeholder="Enter your phone number" className="w-full pl-11 pr-4 py-3 border border-border-main rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-section transition-shadow" />
                              </div>
                          </div>
                      </div>

                      {/* Registered Business Location */}
                      <div>
                          <label htmlFor="location" className="block text-sm font-medium text-section mb-2">Registered Business Location</label>
                          <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-body opacity-60">
                                  <FiMapPin className="w-5 h-5" />
                              </div>
                              <input type="text" id="location" placeholder="Enter your business location" className="w-full pl-11 pr-4 py-3 border border-border-main rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-section transition-shadow" />
                          </div>
                      </div>

                      {/* How can we help you? */}
                      <div>
                          <label htmlFor="message" className="block text-sm font-medium text-section mb-2">How can we help you? *</label>
                          <textarea id="message" required rows={4} placeholder="Type your message here..." className="w-full p-4 border border-border-main rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-section transition-shadow"></textarea>
                      </div>

                      {/* Checkbox */}
                      <div className="flex items-start gap-3">
                          <input type="checkbox" id="privacy" required className="mt-1 w-4 h-4 text-navy bg-page border-border-main rounded focus:ring-primary focus:ring-2 cursor-pointer" />
                          <label htmlFor="privacy" className="text-sm text-body cursor-pointer">
                              I agree to the <span className="font-bold text-navy">Privacy Policy</span> and consent to being contacted by CMC Intel.
                          </label>
                      </div>

                      {/* Submit Button */}
                      <button type="submit" className="w-full bg-navy text-white px-6 py-4 rounded-xl font-bold font-display flex items-center justify-center gap-2 hover:bg-slate transition-colors shadow-md hover:shadow-lg">
                          <FiSend className="w-5 h-5" /> Send Message
                      </button>
                  </form>
                )}
            </div>

            {/* Right Contact Info Section */}
            <div className="w-full lg:w-2/5 p-8 sm:p-12 bg-page flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-section font-display mb-4">Get in touch</h3>
                <p className="text-body mb-10 leading-relaxed">
                    We're here to help you accelerate drug development with data-driven insights and regulatory expertise.
                </p>

                <div className="space-y-8">
                    {/* Email */}
                    <div className="flex items-start gap-5">
                        <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-navy flex-shrink-0">
                            <FiMail className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-section font-display mb-1">Email us</h4>
                            <a href="mailto:sgarapati@cmcintel.com" className="text-body hover:text-primary transition-colors text-sm">
                                sgarapati@cmcintel.com
                            </a>
                        </div>
                    </div>

                    {/* Call */}
                    <div className="flex items-start gap-5">
                        <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-navy flex-shrink-0">
                            <FiPhone className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-section font-display mb-1">Call us</h4>
                            <a href="tel:+15551234567" className="text-body hover:text-primary transition-colors text-sm">
                                +1 (555) 123-4567
                            </a>
                        </div>
                    </div>

                    {/* Business Hours */}
                    <div className="flex items-start gap-5">
                        <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-navy flex-shrink-0">
                            <FiClock className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-section font-display mb-1">Business Hours</h4>
                            <p className="text-body text-sm">
                                Mon – Fri | 9:00 AM – 6:00 PM (EST)
                            </p>
                        </div>
                    </div>

                    {/* Office */}
                    <div className="flex items-start gap-5">
                        <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-navy flex-shrink-0">
                            <FiMapPin className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-section font-display mb-1">Our Office</h4>
                            <p className="text-body text-sm leading-relaxed">
                                123 Innovation Drive, Suite 400<br/>
                                Boston, MA 02110, USA
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Contacts;