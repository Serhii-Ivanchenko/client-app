import styles from "./FullSizeImgModal.module.css";

function FullSizeImgModal({ isOpen, imgUrl, onClose }) {
  if (!isOpen) return null;
  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalContent}>
        <img
          src={imgUrl}
          alt="Повне зображення"
          className={styles.modalImage}
        />
      </div>
    </div>
  );
}

export default FullSizeImgModal;
