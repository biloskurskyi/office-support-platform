import React from 'react';
import {Button} from '@mui/material';
import axios from "axios";
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
                const fileName = contentDisposition?.split('filename=')[1]?.replace(/"/g, '') || 'default_filename.pdf';

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
        <Button variant="contained" color="primary" onClick={handleDownload}>
            Завантажити PDF
        </Button>
    );
};

export default DownloadPDFButton;
