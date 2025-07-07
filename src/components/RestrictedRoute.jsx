import { useSelector } from 'react-redux';
import {
  selectIsLoggedIn,
  selectIsRefreshing,
} from '../redux/auth/selectors.js';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LoaderSvg from './Loader/LoaderSvg.jsx';

export default function RestrictedRoute({ component: Component }) {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isRefreshing = useSelector(selectIsRefreshing);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    if (!isRefreshing) {
      setIsAuthChecked(true); // Позначаємо, що перевірка завершена
    }
  }, [isRefreshing]);

  // Відображаємо лоадер, поки перевірка ще триває
  if (isRefreshing || !isAuthChecked) {
    return <LoaderSvg />;
  }

  return isLoggedIn ? <Navigate to={'/main'} /> : Component;
}
