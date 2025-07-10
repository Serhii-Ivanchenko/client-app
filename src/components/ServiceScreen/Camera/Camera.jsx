import css from './Camera.module.css';
import { IoMdCheckmark, IoMdClose } from 'react-icons/io';
import { BsCameraFill } from 'react-icons/bs';
import { useState } from 'react';

export default function Camera({
  videoRef,
  canvasRef,
  handleCloseCamera,
  handleMainButtonClick,
  photoPreview,
  setPhotoPreview,
  onPhotoApproveClick,
  photos,
  cameraOn,
  openPreviewScreen,
  photosToDisplay,
  setPhotosToDisplay,
  setCameraOn,
  cameraMileageOn,
  setOpenPreviewScreen,
  setPhotos,
}) {
  //   console.log('photos2', photos);

  const handleDeletePhotos = index => {
    setPhotosToDisplay(photosToDisplay?.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className={css.video}>
        {openPreviewScreen ? (
          photosToDisplay?.length === 0 ? (
            <p className={css.noPhotos}>Фото відсутні</p>
          ) : (
            <ul className={css.photosList}>
              {photosToDisplay?.map((photo, index) => (
                <li key={index} className={css.photosItem}>
                  <img src={photo} alt="car" className={css.carPhoto} />
                  <p
                    className={css.deletePhoto}
                    onClick={() => {
                      handleDeletePhotos(index);
                    }}
                  >
                    <IoMdClose
                      className={`${css.deleteIcon} ${css.checkMark}`}
                    />
                  </p>
                </li>
              ))}
            </ul>
          )
        ) : cameraOn || cameraMileageOn ? (
          <>
            {' '}
            <video ref={videoRef} autoPlay playsInline className={css.video} />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </>
        ) : (
          ''
        )}
      </div>
      <div className={css.btnsWrapper}>
        <button className={css.cancelBtn} onClick={handleCloseCamera}>
          <IoMdClose className={`${css.cancelBtn} ${css.cross}`} />
        </button>
        <button
          type="button"
          className={css.cameraBtn}
          onClick={() => {
            handleMainButtonClick();
            if (openPreviewScreen) {
              setCameraOn(true);
              setPhotos(photosToDisplay);
              setOpenPreviewScreen(false);
            }
          }}
        >
          <BsCameraFill className={css.cameraIcon} />
        </button>
        {openPreviewScreen ? (
          <button className={css.confirmBtn} onClick={handleCloseCamera}>
            <IoMdCheckmark className={`${css.confirmBtn} ${css.cross}`} />
          </button>
        ) : photoPreview || photos?.length > 0 ? (
          <div className={css.photoPreviewWrapper}>
            <img
              src={cameraOn ? photos[photos.length - 1] : photoPreview}
              alt="photo preview"
              className={css.photoPreview}
            />
            <p
              className={css.photoQuantity}
              onClick={() => setPhotoPreview(null)}
            >
              {cameraOn ? (
                photos?.length
              ) : (
                <IoMdClose className={`${css.approveIcon} ${css.checkMark}`} />
              )}
            </p>
            <p className={css.approveIconWrapper} onClick={onPhotoApproveClick}>
              <IoMdCheckmark
                className={`${css.approveIcon} ${css.checkMark}`}
              />
            </p>
          </div>
        ) : (
          <div className={css.emptyDiv}></div>
        )}
      </div>
    </>
  );
}
