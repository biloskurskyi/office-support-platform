import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const useCheckOwnership = (companyId: string | undefined) => {
  const navigate = useNavigate();

  useEffect(() => {
    const userType = localStorage.getItem('user_type');
    if (userType !== '1') {
      navigate('/');
      return;
    }

    const checkCompanyOwnership = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8765/api/company/${companyId}/verify-ownership/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            },
          }
        );
        if (!response.data.isOwner) {
          navigate('/');
        }
      } catch (error) {
        console.error('Помилка перевірки компанії:', error);
        navigate('/error');
      }
    };

    if (companyId) {
      checkCompanyOwnership();
    }
  }, [companyId, navigate]);
};

export default useCheckOwnership;
