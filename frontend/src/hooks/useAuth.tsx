import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const useAuth = (): boolean => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    // Якщо токен є
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const currentTime = Date.now() / 1000; // поточний час в секундах

        // Якщо токен застарілий
        if (decoded.exp < currentTime) {
          localStorage.removeItem("jwtToken"); // Видаляємо застарілий токен
          setIsAuthenticated(false); // Зміна стану
        } else {
          setIsAuthenticated(true); // Токен актуальний
        }
      } catch (e) {
        console.error("Error decoding token:", e);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false); // Якщо токен відсутній
    }
  }, []);

  return isAuthenticated;
};

export default useAuth;
