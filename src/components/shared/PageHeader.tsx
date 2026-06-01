import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, eyebrow }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-50/50 via-blue-50/30 to-transparent pt-8 pb-5 sm:pt-12 sm:pb-7 md:pt-14 md:pb-8 border-b border-green-100/50">
      {/* Decorative SVG grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      {/* Floating abstract glowing orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 bg-emerald-300/20 rounded-full blur-3xl animate-float-delayed -z-10" />
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-80 h-80 bg-blue-300/15 rounded-full blur-3xl animate-float -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {eyebrow && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider text-emerald-800 bg-emerald-100/80 uppercase mb-2 sm:mb-2.5 shadow-sm border border-emerald-200/50 animate-pulse-slow">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              {eyebrow}
            </span>
          )}
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-2 sm:mb-2.5">
            <span className="bg-gradient-to-r from-emerald-800 via-teal-700 to-blue-800 bg-clip-text text-transparent drop-shadow-sm">
              {title}
            </span>
          </h1>
          
          {subtitle && (
            <p className="text-sm sm:text-base text-gray-600 font-medium leading-relaxed max-w-2xl mx-auto drop-shadow-sm">
              {subtitle}
            </p>
          )}

          {/* Underline decorative bar */}
          <div className="mt-4 flex justify-center items-center gap-2">
            <div className="h-[2px] w-8 bg-emerald-300 rounded-full" />
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <div className="h-[2px] w-8 bg-emerald-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
