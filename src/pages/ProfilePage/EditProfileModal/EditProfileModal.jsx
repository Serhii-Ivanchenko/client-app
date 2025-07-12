import { useState } from 'react';
import css from './EditProfileModal.module.css';
import { IoCloseOutline } from 'react-icons/io5';
import { BsPencil } from 'react-icons/bs';

export default function EditProfileModal({ onClose, onSave, initialData }) {
  const [name, setName] = useState(initialData.name || '');
  const [surname, setSurname] = useState(initialData.surname || '');
  const [email, setEmail] = useState(initialData.email || '');
  const [phone, setPhone] = useState(initialData.phone || '');
  const [avatarFile, setAvatarFile] = useState(null);

const handleSave = () => {
  const updatedAvatar = avatarFile
    ? URL.createObjectURL(avatarFile)
    : initialData.avatar;

  onSave({
    name,
    surname,
    email,
    phone,
    avatar: updatedAvatar,
  });

  onClose();
};

  return (
    <div className={css.backdrop} onClick={onClose}>
      <div className={css.modal} onClick={e => e.stopPropagation()}>
        <button className={css.closeBtn} onClick={onClose}>
          <IoCloseOutline className={css.closeIcon} />
        </button>

        <h2 className={css.title}>Редагування профілю</h2>

        <label className={css.avatarLabel}>
          <img
            src={
              avatarFile ? URL.createObjectURL(avatarFile) : initialData.avatar
            }
            alt="avatar"
            className={css.avatar}
          />
          <BsPencil className={css.editIcon} />
          <input
            type="file"
            className={css.avatarInput}
            onChange={e => setAvatarFile(e.target.files[0])}
          />
        </label>

        <input
          type="text"
          className={css.input}
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Ім’я"
        />

        <input
          type="text"
          className={css.input}
          value={surname}
          onChange={e => setSurname(e.target.value)}
          placeholder="Прізвище"
        />

        <input
          type="tel"
          className={css.input}
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="+380..."
        />

        <input
          type="email"
          className={css.input}
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
        />

        <button className={css.saveBtn} onClick={handleSave}>
          Зберегти
        </button>
      </div>
    </div>
  );
}
