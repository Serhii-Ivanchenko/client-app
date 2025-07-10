import { ErrorMessage, Field, Form, Formik } from 'formik';
import css from './LoginForm.module.css';
import { BsFillPersonFill, BsKeyFill } from 'react-icons/bs';
import { ImEye, ImEyeBlocked } from 'react-icons/im';
import { useEffect, useState } from 'react';
import { LoginSchema } from '../../validationSchemas/LoginSchema';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { selectUser } from '../../redux/auth/selectors';

export default function LoginForm({
  setForgotPasswordOpen,
  setLoginFormOpen,
  setEnterCodeOpen,
  setCreatePasswordOpen,
}) {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const userData = useSelector(selectUser);
  // const formattedDate = new Date().toISOString().split('T')[0];

  // const dispatch = useDispatch();

  const onButtonEyeClick = () => {
    setIsPasswordShown(!isPasswordShown);
  };

  // const handleSubmitLogin = (values, actions) => {
  //   // console.log('values', values);

  //   dispatch(logIn(values))
  //     .unwrap()
  //     .then(() => {
  //       dispatch(getUserData())
  //         .unwrap()
  //         .then((response) => {
  //           console.log('response', response);
  //           const mechanicId = response.id;
  //           console.log('mechanicId', mechanicId);
  //           dispatch(getMechanicBalance(mechanicId));
  //           dispatch(
  //             getAllCars({ date: formattedDate, mechanic_id: mechanicId })
  //           );
  //           toast.success('Welcome to CRMMech', {
  //             position: 'top-center',
  //             duration: 3000,
  //             style: {
  //               background: 'var(--bg-input)',
  //               color: 'var(--white)FFF',
  //             },
  //           });
  //         })
  //         .catch(err => {
  //           console.log('err', err);

  //           toast.error('Щось сталося, спробуйте ще раз', {
  //             position: 'top-center',
  //             style: {
  //               background: 'var(--bg-input)',
  //               color: 'var(--white)FFF',
  //             },
  //           });
  //         });
  //     })
  //     .catch(err => {
  //       if (err.status === 401) {
  //         toast.error('Невірний логін або пароль', {
  //           position: 'top-center',
  //           style: {
  //             background: 'var(--bg-input)',
  //             color: 'var(--white)FFF',
  //           },
  //         });
  //       } else {
  //         toast.error('Щось сталося, спробуйте ще раз', {
  //           position: 'top-center',
  //           style: {
  //             background: 'var(--bg-input)',
  //             color: 'var(--white)FFF',
  //           },
  //         });
  //       }
  //     });

  //   actions.resetForm();
  // };

  return (
    <div className={css.page}>
      <h1 className={css.header}>Вхід</h1>
      <p className={css.text}>Welcome to CRMMech</p>

      <Formik
        initialValues={{
          phone_number: '',
          password: '',
        }}
        validationSchema={LoginSchema}
        validateOnChange={true}
        validateOnBlur={true}
        // onSubmit={handleSubmitLogin}
      >
        {({ values, errors }) => (
          <Form className={css.form}>
            <div className={css.inputWrapper}>
              <label htmlFor="phone_number" className={css.loginLabel}>
                Номер телефону*
              </label>
              <div className={css.inputWithIconWrapper}>
                <BsFillPersonFill className={css.inputIcon} />
                <Field
                  name="phone_number"
                  type="text"
                  className={css.input}
                  placeholder="0733291544"
                />
              </div>
              <ErrorMessage
                name="phone_number"
                component="div"
                className={css.errorMsg}
              />
            </div>
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
                  <ImEye className={css.eyeIcon} onClick={onButtonEyeClick} />
                ) : (
                  <ImEyeBlocked
                    className={css.eyeIcon}
                    onClick={onButtonEyeClick}
                  />
                )}
              </div>
              <ErrorMessage
                name="password"
                component="div"
                className={css.errorMsg}
              />
            </div>
            <p
              className={css.link}
              onClick={() => {
                setLoginFormOpen(false);
                setForgotPasswordOpen(true);
                setEnterCodeOpen(false);
                setCreatePasswordOpen(false);
              }}
            >
              Забули пароль?
            </p>
            <button
              type="submit"
              className={css.submitBtn}
              disabled={
                !values.password ||
                !values.phone_number ||
                errors.password ||
                errors.phone_number
              }
            >
              Увійти
            </button>
          </Form>
        )}
      </Formik>

      <p className={css.linkText}>
        Ще не маєте акаунт?{' '}
        <span
          className={css.link}
          onClick={() => {
            setLoginFormOpen(false);
            setForgotPasswordOpen(true);
            setEnterCodeOpen(false);
            setCreatePasswordOpen(false);
          }}
        >
          Зареєструватись
        </span>
      </p>
    </div>
  );
}
