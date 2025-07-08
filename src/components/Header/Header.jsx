import css from './Header.module.css';
import avatar from '../../assets/images/avatar.png';
import { BsBellFill } from 'react-icons/bs';
import { PiHeadsetFill } from 'react-icons/pi';

export default function Header() {
  const handleAvatarClick = () => {
    console.log('Avatar clicked');
  };

  const handleBellClick = () => {
    console.log('Bell clicked');
  };

  const handleHeadsetClick = () => {
    console.log('Headset clicked');
  };

  return (
    <div className={css.headerWrapper}>
      <div className={css.userAvatar} onClick={handleAvatarClick}>
        <img src={avatar} alt="avatar" />
      </div>

      <div className={css.controllersWrapper}>
        <button className={css.controllerItem} onClick={handleBellClick}>
          <BsBellFill className={css.icon} />
        </button>
        <button className={css.controllerItem} onClick={handleHeadsetClick}>
          <PiHeadsetFill className={css.icon} />
        </button>
      </div>
    </div>
  );
}
