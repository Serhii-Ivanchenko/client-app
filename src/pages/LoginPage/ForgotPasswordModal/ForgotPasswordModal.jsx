import css from './ForgotPasswordModal.module.css';

export default function ForgotPasswordModal({ onClose }) {
  return (
    <div className={css.wrapper}>
      <h1 className={css.header}>Забули пароль ?</h1>
      <p className={css.text}>
        Для відновлення паролю зверніться до адміністрації компанії
      </p>
      <button type="button" onClick={onClose} className={css.btn}>
        ОК
      </button>
    </div>
  );
}
