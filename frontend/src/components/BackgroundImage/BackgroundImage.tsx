// src/components/BackgroundImage/BackgroundImage.tsx
import React from 'react';
import BackgroundContainer from './UI/BackgroundContainer';
import WelcomeText from './UI/WelcomeText';

const BackgroundImage: React.FC<{ text: string }> = ({text}) => {
    return (
        <BackgroundContainer>
            <WelcomeText text={text}/>
        </BackgroundContainer>
    );
};

export default BackgroundImage;
