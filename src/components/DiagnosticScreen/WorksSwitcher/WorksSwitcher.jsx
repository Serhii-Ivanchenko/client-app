import { useState } from 'react';
import css from './WorksSwitcher.module.css';
import { BsUiRadiosGrid, BsWrench } from 'react-icons/bs';
import { NavLink } from 'react-router-dom';

export default function WorksSwitcher({
  subcatOpen,
  subcatRepairOpen,
  carId,
  disabled,
  car,
}) {
  // const [isActive, setIsActive] = useState('diag');

  return (
    <div className={css.btnsBox}>
      {car?.status === 'diagnostic' ? (
        !subcatRepairOpen && (
          <NavLink
            to={`/car/${carId}/diagnostics`}
            className={({ isActive }) =>
              `${css.buttons} ${isActive ? css.buttonsActive : ''}`
            }
            // onClick={() => {
            //   setIsActive('diag');
            // }}
            onClick={e => {
              if (disabled) e.preventDefault();
            }}
          >
            Діагностика
            <div className={css.indicator}>
              <BsUiRadiosGrid />
            </div>
          </NavLink>
        )
      ) : car?.status === 'repair' ? (
        !subcatOpen && (
          <NavLink
            to={`/car/${carId}/repair`}
            className={({ isActive }) =>
              `${css.buttons} ${isActive ? css.buttonsActive : ''}`
            }
            // onClick={() => setIsActive('repair')}
            onClick={e => {
              if (disabled) e.preventDefault();
            }}
          >
            Ремонт{' '}
            <div className={css.indicator}>
              <BsWrench />
            </div>
          </NavLink>
        )
      ) : (
        <>
          {!subcatRepairOpen && (
            <NavLink
              to={`/car/${carId}/diagnostics`}
              className={({ isActive }) =>
                `${css.buttons} ${isActive ? css.buttonsActive : ''}`
              }
              // onClick={() => {
              //   setIsActive('diag');
              // }}
              onClick={e => {
                if (disabled) e.preventDefault();
              }}
            >
              Діагностика
              <div className={css.indicator}>
                <BsUiRadiosGrid />
              </div>
            </NavLink>
          )}

          {!subcatOpen && (
            <NavLink
              to={`/car/${carId}/repair`}
              className={({ isActive }) =>
                `${css.buttons} ${isActive ? css.buttonsActive : ''}`
              }
              // onClick={() => setIsActive('repair')}
              onClick={e => {
                if (disabled) e.preventDefault();
              }}
            >
              Ремонт{' '}
              <div className={css.indicator}>
                <BsWrench />
              </div>
            </NavLink>
          )}
        </>
      )}
    </div>
  );
}
