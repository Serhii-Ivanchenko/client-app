import { useState } from 'react';
import css from './EditProfileModal.module.css';
import { IoCloseOutline } from 'react-icons/io5';
import { BsPencil } from "react-icons/bs";
import avatar from '../../../assets/images/avatar.png';

export default function EditProfileModal({ onClose }) {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  return (
    <div className={css.backdrop} onClick={onClose}>
      <div className={css.modal} onClick={e => e.stopPropagation()}>
        <button className={css.closeBtn} onClick={onClose}>
          <IoCloseOutline className={css.closeIcon} />
        </button>

        <h2 className={css.title}>Редагування профілю</h2>

        <label className={css.avatarLabel}>
          <img src={avatar} alt="avatar" className={css.avatar} />
          <BsPencil  className={css.editIcon} />
          <input type="file" className={css.avatarInput} />
        </label>

        <input
          type="text"
          className={css.input}
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Іван"
        />
        <input
          type="text"
          className={css.input}
          value={surname}
          onChange={e => setSurname(e.target.value)}
          placeholder="Петренко"
        />
        <input
          type="tel"
          className={css.input}
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="+38..."
        />
        <input
          type="email"
          className={css.input}
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="ivan@gmail.com"
        />

        <button className={css.saveBtn}>Зберегти</button>
      </div>
    </div>
  );
}
