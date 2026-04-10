import React from 'react';

interface BodyWrapperProps {
    children: React.ReactNode;
}

const BodyWrapper: React.FC<BodyWrapperProps> = ({ children }) => {
    return (
        // pt-16 covers the fixed header on all screen sizes (header is ~64px).
        // On mobile when the search bar drops below the logo the header grows,
        // but the SearchBar is only shown inside the header on authenticated pages,
        // so pt-16 is correct for public pages.  Authenticated pages that show
        // the in-header search bar get an extra row on small screens — the search
        // bar inside the header adds ~56px, so we use pt-28 on small screens
        // and revert to pt-16 on md+ where the search bar is inline.
        <main className="flex-1 pt-28 md:pt-16">
            {children}
        </main>
    );
};

export default BodyWrapper;
