import { ErrorMessage, Field, Form, Formik } from 'formik';
import css from './LoginPage.module.css';
import { BsFillPersonFill, BsKeyFill } from 'react-icons/bs';
import { ImEye, ImEyeBlocked } from 'react-icons/im';
import { useEffect, useState } from 'react';
import { LoginSchema } from '../../validationSchemas/LoginSchema';
import ForgotPasswordModal from './ForgotPasswordModal/ForgotPasswordModal';
import Modal from '../../components/Modal/Modal';
import { useDispatch, useSelector } from 'react-redux';
import {
  getMechanicBalance,
  getUserData,
  logIn,
} from '../../redux/auth/operations';
import toast from 'react-hot-toast';
import { selectUser } from '../../redux/auth/selectors';
import { getAllCars } from '../../redux/cars/operations';

export default function LoginPage() {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
    useState(false);
  const userData = useSelector(selectUser);
  const formattedDate = new Date().toISOString().split('T')[0];

  // const [mechanicId, setMechanicId] = useState();

  // console.log('userData', userData);
  // console.log('formattedDate', formattedDate);
  // console.log('mechanicId', mechanicId);

  const dispatch = useDispatch();

  // useEffect(() => {
  //   setMechanicId(userData?.id);
  // }, [userData]);

  const onButtonEyeClick = () => {
    setIsPasswordShown(!isPasswordShown);
  };

  const handleSubmitLogin = (values, actions) => {
    // console.log('values', values);

    dispatch(logIn(values))
      .unwrap()
      .then(() => {
        dispatch(getUserData())
          .unwrap()
          .then((response) => {
            console.log('response', response);
            const mechanicId = response.id;
            console.log('mechanicId', mechanicId);
            dispatch(getMechanicBalance(mechanicId));
            dispatch(
              getAllCars({ date: formattedDate, mechanic_id: mechanicId })
            );
            // dispatch(getMechanicBalance(1));
            // dispatch(
            //   formattedDate &&
            //     getAllCars({
            //       date: formattedDate,
            //       mechanic_id: 1,
            //     })
            // );
            toast.success('Welcome to CRMMech', {
              position: 'top-center',
              duration: 3000,
              style: {
                background: 'var(--bg-input)',
                color: 'var(--white)FFF',
              },
            });
          })
          .catch(err => {
            console.log('err', err);

            toast.error('Щось сталося, спробуйте ще раз', {
              position: 'top-center',
              style: {
                background: 'var(--bg-input)',
                color: 'var(--white)FFF',
              },
            });
          });
        // toast.success('Welcome to CRMMech', {
        //   position: 'top-center',
        //   duration: 3000,
        //   style: {
        //     background: 'var(--bg-input)',
        //     color: 'var(--white)FFF',
        //   },
        // });
        // navigate({ DiagnosticPage });
      })
      .catch(err => {
        if (err.status === 401) {
          toast.error('Невірний логін або пароль', {
            position: 'top-center',
            style: {
              background: 'var(--bg-input)',
              color: 'var(--white)FFF',
            },
          });
        } else {
          toast.error('Щось сталося, спробуйте ще раз', {
            position: 'top-center',
            style: {
              background: 'var(--bg-input)',
              color: 'var(--white)FFF',
            },
          });
        }
      });

    actions.resetForm();
  };

  return (
    <div className={css.wrapper}>
      <div className={css.page}>
        <h1 className={css.header}>Вхід</h1>
        <p className={css.text}>Welcome to CRMMech</p>

        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={LoginSchema}
          validateOnChange={true}
          validateOnBlur={true}
          onSubmit={handleSubmitLogin}
        >
          <Form className={css.form}>
            <div className={css.inputWrapper}>
              <label htmlFor="email" className={css.loginLabel}>
                Логін*
              </label>
              <div className={css.inputWithIconWrapper}>
                <BsFillPersonFill className={css.inputIcon} />
                <Field
                  name="email"
                  type="text"
                  className={css.input}
                  placeholder="0733291544"
                />
              </div>
              <ErrorMessage
                name="email"
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
              onClick={() => setIsForgotPasswordModalOpen(true)}
            >
              Забули пароль?
            </p>
            <button type="submit" className={css.submitBtn}>
              Увійти
            </button>
          </Form>
        </Formik>
      </div>
      {isForgotPasswordModalOpen && (
        <Modal
          isOpen={isForgotPasswordModalOpen}
          onClose={() => setIsForgotPasswordModalOpen(false)}
        >
          <ForgotPasswordModal
            onClose={() => setIsForgotPasswordModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}
