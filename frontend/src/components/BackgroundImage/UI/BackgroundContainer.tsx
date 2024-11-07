// src/components/BackgroundImage/UI/BackgroundContainer.tsx
import React from 'react';
import backgroundImage from '../../../assets/images/background_1.png';

const BackgroundContainer: React.FC = ({ children }) => (
    <div
        style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '500px',
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            zIndex: -1,
        }}
    >
        {children}
    </div>
);

export default BackgroundContainer;
