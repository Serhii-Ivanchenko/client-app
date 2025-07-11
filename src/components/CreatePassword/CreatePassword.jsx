import { ErrorMessage, Field, Form, Formik } from 'formik';
import css from './CreatePassword.module.css';
import { CreatePasswordSchema } from '../../validationSchemas/CreatePasswordSchema';
import { BsKeyFill } from 'react-icons/bs';
import { ImEye, ImEyeBlocked } from 'react-icons/im';
import { useState } from 'react';

export default function CreatePassword({
  setForgotPasswordOpen,
  setLoginFormOpen,
  setEnterCodeOpen,
  setCreatePasswordOpen,
}) {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isForgotPasswordShown, setIsForgotPasswordShown] = useState(false);

  const handleSubmit = (values, actions) => {
    console.log('values', values);
    actions.resetForm();
    setLoginFormOpen(true);
    setForgotPasswordOpen(false);
    setEnterCodeOpen(false);
    setCreatePasswordOpen(false);
  };

  return (
    <div className={css.page}>
      <Formik
        initialValues={{
          password: '',
          repeatPassword: '',
        }}
        validationSchema={CreatePasswordSchema}
        validateOnChange={true}
        validateOnBlur={true}
        onSubmit={handleSubmit}
      >
        {({ values, errors }) => (
          <Form className={css.form}>
            <div className={css.inputWrapper}>
              <label htmlFor="password" className={css.loginLabel}>
                Пароль*
              </label>
              <div className={css.inputWithIconWrapper}>
                <BsKeyFill className={css.inputIcon} />
                <Field
                  name="password"
                  type={isPasswordShown ? 'text' : 'password'}
                  className={css.input}
                  placeholder="password"
                />
                {isPasswordShown ? (
                  <ImEye
                    className={css.eyeIcon}
                    onClick={() => setIsPasswordShown(!isPasswordShown)}
                  />
                ) : (
                  <ImEyeBlocked
                    className={css.eyeIcon}
                    onClick={() => setIsPasswordShown(!isPasswordShown)}
                  />
                )}
              </div>
              <ErrorMessage
                name="password"
                component="div"
                className={css.errorMsg}
              />
            </div>
            <div className={css.inputWrapper}>
              <label htmlFor="repeatPassword" className={css.loginLabel}>
                Повторіть пароль*
              </label>
              <div className={css.inputWithIconWrapper}>
                <BsKeyFill className={css.inputIcon} />
                <Field
                  name="repeatPassword"
                  type={isForgotPasswordShown ? 'text' : 'password'}
                  className={css.input}
                  placeholder="password"
                />
                {isForgotPasswordShown ? (
                  <ImEye
                    className={css.eyeIcon}
                    onClick={() =>
                      setIsForgotPasswordShown(!isForgotPasswordShown)
                    }
                  />
                ) : (
                  <ImEyeBlocked
                    className={css.eyeIcon}
                    onClick={() =>
                      setIsForgotPasswordShown(!isForgotPasswordShown)
                    }
                  />
                )}
              </div>
              <ErrorMessage
                name="repeatPassword"
                component="div"
                className={css.errorMsg}
              />
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
                type="submit"
                className={`${css.btn} ${css.submit}`}
                disabled={
                  !values.password ||
                  !values.repeatPassword ||
                  errors.password ||
                  errors.repeatPassword
                }
              >
                Відправити
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
