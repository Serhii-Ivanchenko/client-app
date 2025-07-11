import { useState } from 'react';
import css from './EnterCode.module.css';

export default function EnterCode({
  setForgotPasswordOpen,
  setLoginFormOpen,
  setEnterCodeOpen,
  setCreatePasswordOpen,
}) {
  const [code, setCode] = useState('');

    const onSendBtnClick = () => {
      console.log("code",code);
      
    setLoginFormOpen(false);
    setForgotPasswordOpen(false);
    setEnterCodeOpen(false);
    setCreatePasswordOpen(true);
  };

  return (
    <div className={css.page}>
      <p className={css.text}>Введіть код отриманий в повідомленні</p>
      <input type="text" className={css.input} value={code} onChange={(e)=>setCode(e.target.value)}/>
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
          onClick={onSendBtnClick}
          className={`${css.btn} ${css.submit}`}
          disabled={code === ''}
        >
          Відправити
        </button>
      </div>
    </div>
  );
}
