import React, { useState, useEffect } from 'react';
import backgroundImage from '../assets/images/background_1.png';  // Імпортуємо зображення

const BackgroundImage = () => {
    // Створюємо стейт для зберігання ширини екрану
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Хук для оновлення ширини вікна при зміні розміру
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth); // Оновлюємо ширину екрану
    };

    // Додаємо подію на зміну розміру вікна
    window.addEventListener('resize', handleResize);

    // Очищаємо подію при демонтажі компонента
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Визначаємо розмір шрифта в залежності від ширини екрану
  const fontSize = windowWidth < 800 ? '14px' : '18px';

    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '500px',  // Висота на всю видиму частину екрану
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',  // Обрізає зображення так, щоб воно покривало весь екран
                backgroundPosition: 'center',  // Центрує зображення
                backgroundRepeat: 'no-repeat',  // Зображення не буде повторюватися
                zIndex: -1,  // Зображення буде на фоні, а всі інші елементи будуть поверх нього
            }}
        >
            <div
                style={{
                    position: 'absolute', // Розміщуємо текст по центру
                    top: '50%', // Центруємо по вертикалі
                    left: '50%', // Центруємо по горизонталі
                    transform: 'translate(-50%, -50%)', // Коригуємо для точного центрування
                    backgroundColor: 'rgba(211, 211, 211, 0.7)', // Світло-сірий фон з прозорістю
                    borderRadius: '12px', // Заокруглені кути
                    padding: '20px', // Відступи для внутрішнього простору
                    color: '#333', // Темний колір тексту для контрасту
                    fontFamily: 'Arial, sans-serif', // Шрифт Arial
                    fontWeight: 'bold', // Виділяємо текст жирним шрифтом
                    lineHeight: '1.5', // Міжрядковий інтервал для зручності читання
                    textAlign: 'center', // Центруємо текст
                    fontSize: fontSize, // Початковий розмір шрифта
                }}
            >
                Вітаємо у системі для ефективного управління офісами! За допомогою нашої платформи ви можете:
                <br/>
                • Створювати та управляти офісами компанії.
                <br/>
                • Легко створювати замовлення для офісів.
                <br/>
                • Слідкувати за комунальними послугами і отримувати статистику витрат.
                <br/>
                Ваші офіси — в надійних руках!

            </div>
        </div>
    );
};

export default BackgroundImage;
