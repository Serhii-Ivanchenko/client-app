import * as Yup from 'yup';

export const LoginSchema = Yup.object().shape({
  phone_number: Yup.string()
    .matches(/^\d+$/, 'Можна вводити лише цифри')
    .matches(/^380\d{9}$/, 'Формат телефону 380123456789')
    .required('Це поле повинно бути заповнене'),
  password: Yup.string().required('Це поле повинно бути заповнене'),
});
