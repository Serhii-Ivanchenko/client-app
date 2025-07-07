import css from './Photos.module.css';
import { IoMdClose } from 'react-icons/io';
import { BsTrash } from 'react-icons/bs';
import { FaArrowLeft } from 'react-icons/fa';

export default function Photos({
  photos,
  setSavedPhotos,
  setCheckPhotos,
  completedDoc,
}) {
  const handlePhotoDelete = index => {
    setSavedPhotos(prev => prev.filter((item, idx) => idx !== index));
  };

  return (
    <div className={css.wrapperDiag}>
      <ul className={css.photoSectionWrapper}>
        {photos?.map((item, index) => (
          <li key={index} className={css.photoWrapper}>
            <img src={item} alt="car photo" className={css.photo} />
            {completedDoc ? (
              ''
            ) : (
              <button type="button" className={css.deleteBtn}>
                <BsTrash
                  className={css.deleteBtnIcon}
                  onClick={() => handlePhotoDelete(index)}
                />
              </button>
            )}
          </li>
        ))}
      </ul>

      <div className={css.btnBox}>
        <button
          className={css.cancelBtn}
          onClick={() => {
            setCheckPhotos(false);
          }}
        >
          <FaArrowLeft size={40} className={css.cross} />
        </button>
      </div>
    </div>
  );
}
