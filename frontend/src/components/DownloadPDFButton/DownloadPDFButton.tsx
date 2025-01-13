import React from 'react';
import {Button} from '@mui/material';
import {saveAs} from 'file-saver';
import axios, {AxiosResponse} from "axios";  // Для завантаження файлу

interface DownloadPDFButtonProps {
    apiUrl: string;  // URL для запиту до бекенду
    fileName: string; // Назва файлу для збереження
}

const DownloadPDFButton: React.FC<DownloadPDFButtonProps> = ({apiUrl, fileName}) => {
    const handleDownload = async () => {
        try {
            const token = localStorage.getItem('jwtToken');

            // Робимо запит на бекенд
            const response = await axios.get(apiUrl, {
                headers: {Authorization: `Bearer ${token}`},
                responseType: 'blob',
            });

            if (response.status === 200) {
                const fileName = response.headers['content-disposition']?.split('filename=')[1]?.replace(/"/g, '') ||
                'default_filename.pdf';

                const fileURL = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = fileURL;
                link.setAttribute('download', 'company_report.pdf'); // Назва файлу для завантаження
                document.body.appendChild(link);
                link.click(); // Симулюємо клік для початку завантаження
            }
        } catch (error) {
            console.error('Помилка при завантаженні файлу:', error);
        }
    };

    return (
        <Button variant="contained" color="primary" onClick={handleDownload}>
            Завантажити PDF
        </Button>
    );
};

export default DownloadPDFButton;
