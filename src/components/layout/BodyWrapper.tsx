import React from 'react';

interface BodyWrapperProps {
    children: React.ReactNode;
}

const BodyWrapper: React.FC<BodyWrapperProps> = ({ children }) => {
    return (
        <main className="flex-1 pt-16">
            {children}
        </main>
    );
};

export default BodyWrapper;
