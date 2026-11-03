import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

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
        const response = await api.get(
          `/company/${companyId}/verify-ownership/`,
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
