// src/components/BackgroundImage/UI/WelcomeText.tsx
import React, {useState, useEffect} from 'react';

interface WelcomeTextProps {
    text: string;
}

const WelcomeText: React.FC<WelcomeTextProps> = ({text}) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fontSize = windowWidth < 500 ? '12px' : windowWidth < 800 ? '14px' : '18px';

    return (
        <div
            style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(211, 211, 211, 0.7)',
                borderRadius: '12px',
                padding: '20px',
                color: '#333',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                lineHeight: '1.5',
                textAlign: 'center',
                fontSize: fontSize,
            }}
        >
            {text}
        </div>
    );
};

export default WelcomeText;