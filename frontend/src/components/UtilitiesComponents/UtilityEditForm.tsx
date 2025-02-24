import React from 'react';
import {Box, Button, FormHelperText, Grid, Typography} from '@mui/material';
import FormPaper from '../LoginForm/UI/FormPaper.tsx';
import CustomTextField from '../UserForm/UI/CustomTextField.tsx';
import UpdateButton from '../UserForm/UI/UpdateButton.tsx';
import {Link} from 'react-router-dom';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import {TextField} from '@mui/material';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import UseDeleteUtility from "../../hooks/useDeleteUtility.tsx";

interface UtilityFormProps {
    formData: any;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    handleSubmit: (event: React.FormEvent) => void;
    successMessage: string | null;
    errorMessage: string | null;
    utility: any;
}

const UtilityEditForm: React.FC<UtilityFormProps> = ({
                                                         formData,
                                                         setFormData,
                                                         handleSubmit,
                                                         successMessage,
                                                         errorMessage,
                                                         utility,
                                                     }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '10px',
            }}
        >
            <FormPaper title="Оновити дані">
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <CustomTextField
                            label="Тип комунальної послуги"
                            value={formData.utilities_type_display}
                            name="utilities_type_display"
                            disabled
                        />
                        <Grid item xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Дата реєстрації послуги"
                                    value={formData.date ? dayjs(formData.date) : null}
                                    onChange={(newValue) =>
                                        setFormData({
                                            ...formData,
                                            date: newValue ? newValue.toISOString() : '',
                                        })
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            sx={{
                                                minWidth: '100%',
                                                '& .MuiInputBase-root': {
                                                    padding: '10px',
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12}>
                            <FormHelperText sx={{fontSize: '0.75rem', color: 'gray'}}>
                                * Для типу послуги "Збір відходів" показник лічильника
                                автоматично збільшується і не може бути змінений вручну.
                            </FormHelperText>
                        </Grid>

                        <CustomTextField
                            label="Показники рахунка:"
                            value={formData.counter}
                            name="counter"
                            onChange={(e) =>
                                setFormData({...formData, [e.target.name]: e.target.value})
                            }
                            disabled={formData.utility_type_id === 4}
                        />
                        <CustomTextField
                            label="Сума оплати:"
                            value={formData.price}
                            name="price"
                            onChange={(e) =>
                                setFormData({...formData, [e.target.name]: e.target.value})
                            }
                        />
                        <CustomTextField
                            label="Офіс"
                            value={formData.office_display}
                            name="office_display"
                            disabled
                        />
                    </Grid>

                    {successMessage && (
                        <Typography color="success.main" sx={{marginTop: '10px'}}>
                            {successMessage}
                        </Typography>
                    )}
                    {errorMessage && (
                        <Typography color="error.main" sx={{marginTop: '10px'}}>
                            {errorMessage}
                        </Typography>
                    )}

                    <UpdateButton/>
                </form>

                <hr/>

                <Link
                    to={`/utility-for-office-by-type/${utility.office_id}/${utility.utility_type_id}/`}
                    style={{textDecoration: 'none', color: 'inherit'}}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginTop: '30px',
                        }}
                    >
                        <Button
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            sx={{
                                backgroundColor: '#58d68d',
                                color: '#fff',
                                fontWeight: 'bold',
                                '&:hover': {backgroundColor: '#1d8348'},
                            }}
                        >
                            Перелік записів про комунальні послуги
                        </Button>
                    </Box>
                </Link>

                <UseDeleteUtility utilityId={utility.utility_id}/>
            </FormPaper>
        </Box>
    );
};

export default UtilityEditForm;
