import { useState } from 'react';
import css from './ForgotPassword.module.css';

export default function ForgotPassword({
  setForgotPasswordOpen,
  setLoginFormOpen,
  setEnterCodeOpen,
  setCreatePasswordOpen,
}) {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const validate = value => {
    const onlyDigits = /^\d+$/;
    const phoneFormat = /^380\d{9}$/;

    if (!onlyDigits.test(value)) {
      return 'Можна вводити лише цифри';
    } else if (!phoneFormat.test(value)) {
      return 'Телефон повинен мати формат 380123456789';
    }
    return '';
  };

  const handleChange = e => {
    const value = e.target.value;
    setPhone(value);
    setError(validate(value));
  };

  const onSubmitBtnClick = () => {
    setLoginFormOpen(false);
    setForgotPasswordOpen(false);
    setEnterCodeOpen(true);
    setCreatePasswordOpen(false);
  };

  return (
    <div className={css.wrapper}>
      <p className={css.text}>Введіть номер телефону в форматі 380123456789</p>
      <div className={css.inputWrapper}>
        <label htmlFor="phone_number" className={css.label}>
          Номер телефону*
        </label>
        <input
          type="text"
          name="phone_number"
          className={css.input}
          value={phone}
          onChange={handleChange}
          placeholder="380123456789"
        />
        {error && <p className={css.error}>{error}</p>}
      </div>
      <div className={css.btnWrapper}>
        <button
          type="button"
          className={`${css.btn} ${css.close}`}
          onClick={() => {
            setLoginFormOpen(true);
            setForgotPasswordOpen(false);
            setEnterCodeOpen(false);
            setCreatePasswordOpen(false);
          }}
        >
          Закрити
        </button>
        <button
          type="button"
          onClick={onSubmitBtnClick}
          className={`${css.btn} ${css.submit}`}
          disabled={phone === '' || error}
        >
          Отримати код
        </button>
      </div>
    </div>
  );
}
