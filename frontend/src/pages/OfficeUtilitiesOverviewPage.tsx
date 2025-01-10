import React from 'react';
import OfficeOverviewPage from '../components/OfficesListOwnerComponent/OfficeOverviewPage.tsx';

const OfficeUtilitiesOverviewPage = () => (
  <OfficeOverviewPage
    pageTitle={
      <h2>
        Перелік офісів компанії
        <h5>Оберіть офіс для перегляду комунальних послуг</h5>
      </h2>
    }
    noExistTitle="Офісів не знайдено"
    noExistMessage="Здається, у цієї компанії ще немає офісів. Ви можете створити новий офіс за допомогою кнопки нижче."
    noExistButtonText="Створити офіс"
    noExistButtonLink={(id) => `/office-create/${id}`}
    cardButtonText="Переглянути комунальні послуги"
    cardButtonLink={(id) => `/utility-type-list/${id}`}
    cardButtonColor="green"
    cardButtonHoverColor="darkgreen"
  />
);

export default OfficeUtilitiesOverviewPage;
