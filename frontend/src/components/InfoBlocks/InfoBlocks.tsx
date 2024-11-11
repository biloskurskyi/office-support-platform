import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';

interface BlockData {
    title: string;
    content: string;
}

const InfoBlocks: React.FC = () => {
    // Масив з даними для кожного блоку
    const blocks: BlockData[] = [
        {
            title: 'Адаптованість та безпека',
            content: 'Платформа повністю адаптована під українського користувача. Широкий вибір функціоналу для керування офісами. Безкоштовно і з високим рівнем безпеки даних.'
        },
        {
            title: 'Керування компанією та офісами',
            content: 'Створюйте компанії та додавайте офіси в різних містах України. Призначайте менеджерів, контролюйте товари та комунальні послуги в кожному офісі. Отримуйте детальну статистику для оптимізації витрат.'
        },
        {
            title: 'Масштабування та підтримка',
            content: 'Легко масштабувати кількість офісів по Україні. Отримуйте підтримку та консультування з усіх питань управління офісами. Ваш бізнес зростає, а ми допомагаємо вам в цьому!'
        },
    ];

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0 10px', // Відступи з боків
                marginBottom: '100px', // Відступ знизу
            }}
        >
            <Grid container spacing={2} justifyContent="center">
                {/* Мапимо блоки на основі масиву */}
                {blocks.map((block, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                        <Paper
                            elevation={3}
                            sx={{
                                padding: 2,
                                textAlign: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-start', // Вирівнює контент вгорі
                                height: '100%', // Забезпечує, щоб блок займав рівну висоту
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    borderBottom: '2px solid #ccc', // Тонка лінія між заголовком та текстом
                                    paddingBottom: '8px', // Відступ між лінією і текстом
                                    marginBottom: '12px', // Відступ від лінії до тексту
                                }}
                            >
                                {block.title}
                            </Typography>
                            <Typography sx={{ paddingTop: '8px' }}>{block.content}</Typography> {/* Додаємо відступ для тексту */}
                        </Paper>
                    </Grid>
                ))}
            </Grid>
             <Typography
                variant="body1"
                sx={{
                    marginTop: '60px',
                    textAlign: 'center',
                    fontSize: '1.2rem',
                    color: '#333',
                    maxWidth: '600px',
                    fontWeight: 'bold',
                }}
            >
                Не гайте часу! Зареєструйтесь або увійдіть у свій акаунт, щоб отримати доступ до всіх можливостей платформи та розпочати ефективне керування офісами вже сьогодні!
            </Typography>
        </Box>
    );
};

export default InfoBlocks;
