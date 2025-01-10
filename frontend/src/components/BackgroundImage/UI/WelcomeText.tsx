// src/components/BackgroundImage/UI/WelcomeText.tsx
import React, { useState, useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';

interface WelcomeTextProps {
  text: React.ReactNode;
}

const WelcomeText: React.FC<WelcomeTextProps> = ({ text }) => {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // const getTextLength = (node: React.ReactNode): number => {
  //     if (typeof node === 'string') {
  //         return node.length;
  //     } else if (React.isValidElement(node)) {
  //         // Перевіряємо, чи у елемента є дочірні елементи
  //         return React.Children.toArray(node.props.children).reduce(
  //             (acc, child) => acc + getTextLength(child),
  //             0
  //         );
  //     } else if (Array.isArray(node)) {
  //         // Якщо це масив дочірніх елементів, рекурсивно обробляємо його
  //         return node.reduce((acc, child) => acc + getTextLength(child), 0);
  //     }
  //     return 0; // Ігноруємо boolean, null, undefined
  // };
  // const textLength: number = getTextLength(text);
  //
  // console.log("Text Length:", textLength);

  const extractText = (node: React.ReactNode): string => {
    // Рендеримо React-елемент у строку
    const rendered = ReactDOMServer.renderToStaticMarkup(node);
    // Видаляємо всі HTML-теги, залишаючи тільки текст
    return rendered.replace(/<[^>]*>/g, '').trim();
  };

  const extractedText: string = extractText(text);
  const textLength: number = extractedText.length;

  console.log('Text:', text);
  console.log('Text length:', textLength);

  let fontSize: string;

  if (textLength > 350) {
    if (windowWidth < 500) {
      fontSize = '9px';
    } else if (windowWidth < 800) {
      fontSize = '10px';
    } else if (windowWidth < 1025) {
      fontSize = '15px';
    } else {
      fontSize = '18px';
    }
  } else {
    if (windowWidth < 500) {
      fontSize = '12px';
    } else if (windowWidth < 800) {
      fontSize = '14px';
    } else {
      fontSize = '18px';
    }
  }

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
