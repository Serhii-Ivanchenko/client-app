import { BsCheckLg } from 'react-icons/bs';
import { BsReceipt } from 'react-icons/bs';
import { BsFillCameraFill } from 'react-icons/bs';
import css from './ServiceInfoDone.module.css';
import { useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';

export default function ServiceInfoDone({
  item,
  setCameraOn,
  setCameraMileageOn,
  photos,
  setPhotos,
}) {
  // useEffect(() => {
  //   setPhotos(item.photos);
  // }, [item]);

  return (
    <div className={css.wrapper}>
      <div className={css.categoryTitle}>Діагностика</div>
      <div className={css.doneBox}>
        <p className={css.title}>Запчастини:</p>
        <ul className={css.workList}>
          {item.works.map((work, index) => (
            <li key={index} className={css.listItem}>
              <BsCheckLg className={css.checkIcon} />
              <p className={css.workName}>{work}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className={css.categoryTitle}>Ремонт</div>
      <div className={css.doneBox}>
        <p className={css.title}>Замінено:</p>
        <ul className={css.workList}>
          {item.works.map((work, index) => (
            <li key={index} className={css.listItem}>
              <BsCheckLg className={css.checkIcon} />
              <p className={css.workName}>{work}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className={css.sumBox}>
        <BsReceipt className={css.receiptIcon} />
        <p className={css.sum}> {item.sum} грн</p>
      </div>

      <div className={css.photosPart}>
        <p className={css.photosPartTitle}>Фото поломки / документу</p>
        <div className={css.photosBox}>
          <button
            type="button"
            className={css.cameraBtn}
            onClick={() => {
              setCameraOn(true);
              setCameraMileageOn(false);
            }}
          >
            <BsFillCameraFill className={css.cameraIcon} size={33} />
          </button>
          <ul className={css.photosList}>
            {item.photos.map((photo, index) => (
              <li key={index}>
                <img src={photo} alt="car" className={css.carPhoto} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
