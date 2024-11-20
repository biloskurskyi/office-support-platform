import React from 'react';

interface PageWrapperProps {
    children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
    return <div style={{ position: 'relative' }}>{children}</div>;
};

export default PageWrapper;
