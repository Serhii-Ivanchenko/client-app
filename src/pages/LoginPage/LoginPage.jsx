import css from './LoginPage.module.css';
import LoginForm from '../../components/LoginForm/LoginForm';
import ForgotPassword from '../../components/ForgotPassword/ForgotPassword.jsx';
import { useState } from 'react';
import EnterCode from './EnterCode/EnterCode.jsx';
import CreatePassword from '../../components/CreatePassword/CreatePassword.jsx';

export default function LoginPage() {
  const [loginFormOpen, setLoginFormOpen] = useState(true);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [enterCodeOpen, setEnterCodeOpen] = useState(false);
  const [createPasswordOpen, setCreatePasswordOpen] = useState(false);

  return (
    <div className={css.wrapper}>
      {loginFormOpen && (
        <LoginForm
          setForgotPasswordOpen={setForgotPasswordOpen}
          setLoginFormOpen={setLoginFormOpen}
          setEnterCodeOpen={setEnterCodeOpen}
          setCreatePasswordOpen={setCreatePasswordOpen}
        />
      )}
      {forgotPasswordOpen && (
        <ForgotPassword
          setForgotPasswordOpen={setForgotPasswordOpen}
          setLoginFormOpen={setLoginFormOpen}
          setEnterCodeOpen={setEnterCodeOpen}
          setCreatePasswordOpen={setCreatePasswordOpen}
        />
      )}
      {enterCodeOpen && (
        <EnterCode
          setForgotPasswordOpen={setForgotPasswordOpen}
          setLoginFormOpen={setLoginFormOpen}
          setEnterCodeOpen={setEnterCodeOpen}
          setCreatePasswordOpen={setCreatePasswordOpen}
        />
      )}

      {createPasswordOpen && (
        <CreatePassword
          setForgotPasswordOpen={setForgotPasswordOpen}
          setLoginFormOpen={setLoginFormOpen}
          setEnterCodeOpen={setEnterCodeOpen}
          setCreatePasswordOpen={setCreatePasswordOpen}
        />
      )}
    </div>
  );
}
