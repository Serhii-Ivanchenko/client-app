import css from './ProfilePage.module.css';
import { IoCloseOutline } from 'react-icons/io5';
import { RiLogoutBoxRFill } from 'react-icons/ri';
import {
  BsPiggyBankFill,
  BsKeyFill,
  BsMegaphoneFill,
  BsPhoneVibrate,
  BsFillExclamationCircleFill,
} from 'react-icons/bs';
import avatar from '../../assets/images/avatar.png';
import clsx from 'clsx';
import { useState } from 'react';
import EditProfileModal from './EditProfileModal/EditProfileModal';

export default function ProfilePage({ onClose }) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <div className={css.profileWrapper} onClick={onClose}>
      <div className={css.mainInfo} onClick={e => e.stopPropagation()}>
        <button className={css.closeBtn} onClick={onClose}>
          <IoCloseOutline className={css.closeIcon} />
        </button>

        <img src={avatar} alt="User avatar" className={css.avatar} />
        <p className={css.name}>Іван петренко</p>
        <p className={css.email}>ivan@gmail.com</p>
        <button className={css.editBtn} onClick={() => setIsEditOpen(true)}>
          Редагувати профіль
        </button>
        {isEditOpen && <EditProfileModal onClose={() => setIsEditOpen(false)} />}

        <div className={css.block}>
          <a href="#" className={css.link}>
            <div className={css.linkInfo}>
              <BsPiggyBankFill className={css.icon} />
              <span>Підписка</span>
              <span className={css.subscriptionType}>Free</span>
            </div>
            <button className={css.updateBtn}>Оновити</button>
          </a>
          <a href="#" className={css.link}>
            <BsKeyFill className={css.icon} />
            <span>Змінити пароль</span>
          </a>
          <a href="#" className={css.link}>
            <BsMegaphoneFill className={css.icon} />
            <span>Що нового</span>
          </a>
        </div>

        <div className={css.block}>
          <a href="#" className={css.link}>
            <BsPhoneVibrate className={clsx(css.icon, css.bigIcon)} />
            <span>Версія</span>
            <span className={css.subscriptionType}>v 1.3</span>
          </a>
          <a href="#" className={css.link}>
            <BsFillExclamationCircleFill />
            <span>Умови та правила</span>
          </a>
          <a href="#" className={css.link}>
            <RiLogoutBoxRFill className={clsx(css.icon, css.redIcon)} />
            <span>Вийти</span>
          </a>
        </div>
      </div>
    </div>
  );
}
