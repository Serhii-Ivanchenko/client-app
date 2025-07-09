import clsx from 'clsx';
import css from './Footer.module.css';
import { BsFillHouseFill } from 'react-icons/bs';
import { BsDropletHalf } from 'react-icons/bs';
import { BsWrench } from 'react-icons/bs';
import { BsJournalCheck } from 'react-icons/bs';
import { NavLink } from 'react-router-dom';

export default function Footer() {
  const makeNavLinkClass = ({ isActive }) => {
    return clsx(css.navLink, isActive && css.active);
  };

  return (
    <div className={css.footerWrapper}>
      <nav className={css.nav}>
        <NavLink to="/garage" className={makeNavLinkClass}>
          <BsFillHouseFill className={css.icon} />
          <p className={css.text}>Гараж</p>
        </NavLink>
        <NavLink to="/service" className={makeNavLinkClass}>
          <BsDropletHalf className={css.icon} />
          <p className={css.text}>Сервіс</p>
        </NavLink>
        <NavLink to="/repair" className={makeNavLinkClass}>
          <BsWrench className={css.icon} />
          <p className={css.text}>Ремонт</p>
        </NavLink>
        <NavLink to="/recommendations" className={makeNavLinkClass}>
          <BsJournalCheck className={css.icon} />
          <p className={css.text}>Рекомендації</p>
        </NavLink>
      </nav>
    </div>
  );
}
