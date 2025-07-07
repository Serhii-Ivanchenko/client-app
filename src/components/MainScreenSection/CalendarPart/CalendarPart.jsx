import { IoIosArrowBack } from 'react-icons/io';
import { IoIosArrowForward } from 'react-icons/io';
import css from './CalendarPart.module.css';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getAllCars } from '../../../redux/cars/operations';
import { setChosenDate } from '../../../redux/cars/slice';
import { useLocation } from 'react-router-dom';
// import { setChosenDay } from '../../../redux/cars/slice';

export default function CalendarPart() {
  const months = [
    'Січень',
    'Лютий',
    'Березень',
    'Квітень',
    'Травень',
    'Червень',
    'Липень',
    'Серпень',
    'Вересень',
    'Жовтень',
    'Листопад',
    'Грудень',
  ];
  const dispatch = useDispatch();
  const location = useLocation();
  const isMainPage = location.pathname === '/main';

  // const today = new Date();
  const storedDate = sessionStorage.getItem('date');
  const initialDate = storedDate ? new Date(storedDate) : new Date();
  const [year, setYear] = useState(initialDate.getFullYear());
  const [month, setMonth] = useState(initialDate.getMonth());
  const [day, setDay] = useState(initialDate.getDate());
  // console.log('today', today);
  // console.log('month', today.getMonth());

  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();

  const changeDay = delta => {
    const daysInMonth = getDaysInMonth(year, month);
    let newDay = day + delta;

    if (newDay < 1) {
      // Перехід назад на попередній місяць
      const prevMonth = month === 0 ? 11 : month - 1;
      const newYear = month === 0 ? year - 1 : year;
      const prevMonthDays = getDaysInMonth(newYear, prevMonth);
      setYear(newYear);
      setMonth(prevMonth);
      setDay(prevMonthDays);
    } else if (newDay > daysInMonth) {
      // Перехід вперед на наступний місяць
      const nextMonth = month === 11 ? 0 : month + 1;
      const newYear = month === 11 ? year + 1 : year;
      setYear(newYear);
      setMonth(nextMonth);
      setDay(1);
    } else {
      setDay(newDay);
    }
  };

  useEffect(() => {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(
      day
    ).padStart(2, '0')}`;

    // const data = {
    //   date,
    //   mechanic_id: 1, // Заміни на реальний ID механіка
    // };

    // console.log('date', date);
    // console.log('dispatching date:', date);
    // dispatch(setChosenDay(date));
    // dispatch(getAllCars(data));

    sessionStorage.setItem('date', date);
    dispatch(setChosenDate(date));
  }, [year, month, day, dispatch, isMainPage]);

  return (
    <div className={css.calendarBox}>
      <button className={css.btnArrow} onClick={() => changeDay(-1)}>
        <IoIosArrowBack className={css.icon} />
      </button>
      <div className={css.dayBox}>{day}</div>
      <p className={css.month}>{months[month]}</p>
      <button className={css.btnArrow} onClick={() => changeDay(1)}>
        <IoIosArrowForward className={css.icon} />
      </button>
    </div>
  );
}
