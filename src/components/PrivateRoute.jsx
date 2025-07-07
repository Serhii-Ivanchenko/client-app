import { useSelector } from 'react-redux';
import {
  selectIsLoggedIn,
  selectIsRefreshing,
} from '../redux/auth/selectors.js';
import { Navigate } from 'react-router-dom';
// import Loader from "./Loader/Loader.jsx";
import { useEffect, useState } from 'react';
import LoaderSvg from './Loader/LoaderSvg.jsx';

export default function PrivateRoute({ component: Component }) {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isRefreshing = useSelector(selectIsRefreshing);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    if (!isRefreshing) {
      setIsAuthChecked(true); // Встановлюємо прапорець після завершення перевірки
    }
  }, [isRefreshing]);

  // Показуємо лоадер до завершення перевірки автентифікації
  if (isRefreshing || !isAuthChecked) {
    return <LoaderSvg />;
  }

  return isLoggedIn ? Component : <Navigate to={'/login'} />;
}
