// src/components/BackgroundImage/BackgroundImage.tsx
import React from 'react';
import BackgroundContainer from './UI/BackgroundContainer';
import WelcomeText from './UI/WelcomeText';

const BackgroundImage: React.FC<{ text: React.ReactNode }> = ({ text }) => {
  console.log('text' + text);
  return (
    <BackgroundContainer>
      <WelcomeText text={text} />
    </BackgroundContainer>
  );
};

export default BackgroundImage;
