import { Link, useNavigate } from 'react-router-dom';
import css from './NotFoundPage.module.css';
import { useEffect } from 'react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/main', { replace: true });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);
    
  return (
    <div className={css.wrapper}>
      <h1>Сторінку не знайдено. Повертаємо на головну...</h1>
    </div>
  );
}
