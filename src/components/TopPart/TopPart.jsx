import { useDispatch, useSelector } from 'react-redux';
import css from './TopPart.module.css';
import { useEffect } from 'react';
import { getMechanicBalance } from '../../redux/auth/operations';
import { selectBalance, selectUser } from '../../redux/auth/selectors';

export default function TopPart({ wage, amountPossible }) {
  const dispatch = useDispatch();

  const balance = useSelector(selectBalance);
  const user = useSelector(selectUser);
  // console.log('balance', balance);
  // console.log('user', user);

  // useEffect(() => {
  //   dispatch(getMechanicBalance(user?.id));
  // }, [dispatch, user?.id]);

  // const nameToDisplay =

  return (
    <div className={css.topPart}>
      <div className={css.mechNameBox}>
        <p className={css.name}>{`${user?.first_name} ${user?.last_name}`}</p>
        <p className={css.paleText}>Механік</p>
      </div>
      <div className={css.salaryInfoBox}>
        <div className={css.salaryPoint}>
          <p className={css.paleText}>Нараховано</p>
          <p className={css.amount}>{balance?.total_earned ?? '0'}</p>
        </div>
        <div className={css.salaryPoint}>
          <p className={css.paleText}>Сьогодні</p>
          <p className={css.amount}>+ {balance?.today_earned ?? '0'}</p>
        </div>
        <div className={css.salaryPoint}>
          <p className={css.paleText}>Можлива ЗП</p>
          <p className={css.amountPossible}>
            {Number.isFinite(balance?.potential_earned)
              ? Math.trunc(balance.potential_earned)
              : '0'}
          </p>
        </div>
      </div>
    </div>
  );
}
