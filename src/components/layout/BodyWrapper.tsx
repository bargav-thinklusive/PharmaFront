import React from 'react';

interface BodyWrapperProps {
    children: React.ReactNode;
}

const BodyWrapper: React.FC<BodyWrapperProps> = ({ children }) => {
    return (
        // pt-16 covers the fixed header on all screen sizes (header is ~64px).
        <main className="flex-1 pt-16">
            {children}
        </main>
    );
};

export default BodyWrapper;
