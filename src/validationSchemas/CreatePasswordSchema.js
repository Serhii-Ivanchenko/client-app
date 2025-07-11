import * as Yup from 'yup';

export const CreatePasswordSchema = Yup.object().shape({
  password: Yup.string().required('Поле повинно бути заповнене'),
  repeatPassword: Yup.string()
    .required('Поле повинно бути заповнене')
    .oneOf([Yup.ref('password'), null], 'Паролі повинні збігатися'),
});
