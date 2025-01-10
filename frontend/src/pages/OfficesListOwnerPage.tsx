import React, { useEffect } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import PageWrapper from '../components/MainPageComponents/PageWrapper.tsx';
import ErrorMessage from '../components/OfficesListOwnerComponent/UI/ErrorMessage.tsx';
import useFetchOffices from '../hooks/useFetchOffices.tsx';
import NoOfficesMessage from '../components/OfficesListOwnerComponent/UI/NoOfficesMessage.tsx';
import OfficesList from '../components/OfficesListOwnerComponent/OfficesList.tsx';

const OfficesListOwnerPage: React.FC = () => {
  const { setText } = useOutletContext<{
    setText: (text: React.ReactNode) => void;
  }>();

  useEffect(() => {
    setText(<h2>Перелік офісів для комапнії</h2>);
  }, [setText]);

  const navigate = useNavigate();

  const user_type = localStorage.getItem('user_type');

  if (user_type !== '1') {
    navigate('/error');
  }

  const { id } = useParams<{ id: string }>();
  const { offices, loading, error } = useFetchOffices(id);

  useEffect(() => {
    setText(<h2>Перелік офісів для комапнії</h2>);
  }, [setText]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) return <ErrorMessage message={error} />;

  if (!offices.length) return <NoOfficesMessage companyId={id} />;

  return (
    <PageWrapper>
      <div style={{ height: '500px' }} />
      <OfficesList offices={offices} companyId={id} />
      <div style={{ height: '50px' }} />
    </PageWrapper>
  );
};

export default OfficesListOwnerPage;
