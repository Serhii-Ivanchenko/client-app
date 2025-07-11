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

export default function ProfilePage({ onClose, isProfileOpen }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: 'Іван',
    surname: 'Петренко',
    email: 'ivan@gmail.com',
    phone: '+380939621777',
    avatar: avatar,
  });

  const handleSaveProfile = updatedData => {
    setUserData(prev => ({ ...prev, ...updatedData }));
    setIsEditOpen(false);
  };

  return (
    <div
      className={clsx(css.profileWrapper, {
        [css.active]: isProfileOpen,
      })}
      onClick={onClose}
    >
      <div
        className={clsx(css.mainInfo, css.active)}
        onClick={e => e.stopPropagation()}
      >
        <button className={css.closeBtn} onClick={onClose}>
          <IoCloseOutline className={css.closeIcon} />
        </button>

        <img src={userData.avatar} alt="User avatar" className={css.avatar} />
        <p className={css.name}>
          {userData?.name
            ? `${userData.name}${
                userData.surname ? ' ' + userData.surname : ''
              }`
            : 'Гість'}
        </p>

        <p className={css.email}>{userData?.email || 'example@mail.com'}</p>

        <button className={css.editBtn} onClick={() => setIsEditOpen(true)}>
          Редагувати профіль
        </button>
        {isEditOpen && (
          <EditProfileModal
            onSave={handleSaveProfile}
            initialData={userData}
            onClose={() => setIsEditOpen(false)}
          />
        )}

        <div className={css.block}>
          <div className={css.link}>
            <div className={css.linkInfo}>
              <BsPiggyBankFill className={css.icon} />
              <span>Підписка</span>
              <span className={css.subscriptionType}>Free</span>
            </div>
            <button className={css.updateBtn}>Оновити</button>
          </div>
          <div className={css.link}>
            <BsKeyFill className={css.icon} />
            <span>Змінити пароль</span>
          </div>
          <div className={css.link}>
            <BsMegaphoneFill className={css.icon} />
            <span>Що нового</span>
          </div>
        </div>

        <div className={css.block}>
          <div className={css.link}>
            <BsPhoneVibrate className={clsx(css.icon, css.bigIcon)} />
            <span>Версія</span>
            <span className={css.subscriptionType}>v 1.3</span>
          </div>
          <div className={css.link}>
            <BsFillExclamationCircleFill />
            <span>Умови та правила</span>
          </div>
          <div className={css.link}>
            <RiLogoutBoxRFill className={clsx(css.icon, css.redIcon)} />
            <span>Вийти</span>
          </div>
        </div>
      </div>
    </div>
  );
}
