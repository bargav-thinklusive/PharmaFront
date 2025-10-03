import React from 'react';

interface AppendixLinkProps {
  text: string;
}

const AppendixLink: React.FC<AppendixLinkProps> = ({ text }) => {
  const parts = text.split(/(Appendix \d+)/gi);
  return <>{parts.map((part, index) => {
    if (/^Appendix \d+$/i.test(part)) {
      const num = part.match(/(\d+)/)?.[1];
      if (num) {
        return <a key={index} href={`#section-5-${num}`} className="text-blue-600 underline">{part}</a>;
      }
    }
    return part;
  })}</>;
};

export default AppendixLink;