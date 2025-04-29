import React from 'react';
import {Button} from '@mui/material';
import axios from "axios";
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

interface DownloadPDFButtonProps {
    apiUrl: string;
}

const DownloadPDFButton: React.FC<DownloadPDFButtonProps> = ({apiUrl}) => {
    const handleDownload = async () => {
        try {
            const token = localStorage.getItem('jwtToken');

            const response = await axios.get(apiUrl, {
                headers: {Authorization: `Bearer ${token}`},
                responseType: 'blob',
            });

            if (response.status === 200) {
                const contentDisposition = response.headers['content-disposition'];
                console.log('Content-Disposition:', contentDisposition);
                const fileName = contentDisposition?.split('filename=')[1]?.replace(/"/g, '') || 'звіт.pdf';

                const fileURL = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = fileURL;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
            }
        } catch (error) {
            console.error('Помилка при завантаженні файлу:', error);
        }
    };

    return (
        <Button
            variant="contained"
            color="error" // Червоний колір кнопки
            onClick={handleDownload}
            startIcon={<PictureAsPdfIcon/>} // Іконка PDF
            sx={{
                textTransform: 'none', // Прибрати великі літери
                fontWeight: 'bold', // Жирний текст
                padding: '10px 20px', // Простір
                borderRadius: '8px', // Заокруглення
                backgroundColor: '#e64034', // Основний червоний колір
                '&:hover': {
                    backgroundColor: '#d32f2f', // Темніший відтінок червоного при наведенні
                },
            }}
        >
            Завантажити звіт
        </Button>

    );
};

export default DownloadPDFButton;
