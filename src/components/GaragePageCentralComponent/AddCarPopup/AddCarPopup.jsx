import { useEffect, useRef } from 'react';
import css from './AddCarPopup.module.css';

export default function AddCarPopup({
  arr,
  fieldKey,
  setFieldValue,
  buttonRef,
  onClose,
  isOpen,
}) {
  const popupRef = useRef(null);

  const handleClickOutside = event => {
    if (
      popupRef.current &&
      !popupRef.current.contains(event.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target)
    ) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={css.popup} ref={popupRef}>
      {arr?.length > 0 ? (
        arr?.map((item, index) => (
          <p
            key={index}
            className={css.text}
            onClick={() => {
              setFieldValue(
                fieldKey ? { id: item.id, [fieldKey]: item[fieldKey] } : item
              );
              onClose();
            }}
          >
            {fieldKey ? item[fieldKey] : item}
          </p>
        ))
      ) : (
        <p className={css.text}>Нічого не знайдено</p>
      )}
    </div>
  );
}
