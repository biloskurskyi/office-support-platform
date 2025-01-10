import React from 'react';
import OfficeOverviewPage from '../components/OfficesListOwnerComponent/OfficeOverviewPage.tsx';

const OfficeOrdersOverviewPage = () => (
  <OfficeOverviewPage
    pageTitle={
      <h2>
        Перелік офісів компанії<h5>Оберіть офіс для перегляду замовлень</h5>
      </h2>
    }
    noExistTitle="Офісів не знайдено"
    noExistMessage="Здається, у цієї компанії ще немає офісів. Ви можете створити новий офіс за допомогою кнопки нижче та додавати замовлення."
    noExistButtonText="Створити офіс"
    noExistButtonLink={(id) => `/office-create/${id}`}
    cardButtonText="Переглянути замовлення"
    cardButtonLink={(id) => `/order-list/${id}`}
  />
);

export default OfficeOrdersOverviewPage;
