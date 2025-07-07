import { Link, useNavigate, useParams } from 'react-router-dom';
import css from './PhotoCapturePage.module.css';
import { IoMdClose, IoMdCheckmark } from 'react-icons/io';
import { BsCameraFill, BsTrash } from 'react-icons/bs';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCars, uploadCarPhotos } from '../../redux/cars/operations';
import { selectCars } from '../../redux/cars/selectors';
import autoPhoto from '../../assets/images/absentAutoImg.webp';
import { selectUser } from '../../redux/auth/selectors.js';
import { use } from 'react';

export default function PhotoCapturePage({
  diag,
  // carId,
  setOpenCamera,
  setPhotosFromWorksPart,
  photosFromWorksPart,
  handleSavePhotos,
  repair,
  openCameraWorkPart,
  setOpenPhotoComp,
  setSavedPhotos,
  savedPhotos,
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [photosToDisplay, setPhotosToDisplay] = useState(
    diag ? savedPhotos : []
  );
  // const [photoPreview, setPhotoPreview] = useState('');
  const [checkPhotos, setCheckPhotos] = useState(false);
  const cars = useSelector(selectCars);
  const userData = useSelector(selectUser);
  const mechanicId = userData?.id;

  // console.log('photos', photos);

  const params = useParams();
  const carId = params?.carId;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const displayedCar = cars?.find(car => Number(car?.car_id === Number(carId)));
  // const photosToDisplay = diag ? photosFromWorksPart : photos;
  // const setPhotosToDisplay = diag ? setPhotosFromWorksPart : setPhotos;
  const openedCamera = diag ? openCameraWorkPart : isCameraOpen;

  // console.log('photos', photos);
  console.log('photosFromWorksPart', photosFromWorksPart);
  // console.log('photosToDisplay', photosToDisplay);

  console.log('displayedCar', displayedCar);

  useEffect(() => {
    const openCamera = async () => {
      if (openedCamera && videoRef.current && !stream) {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
          });
          videoRef.current.srcObject = mediaStream;
          setStream(mediaStream);
        } catch (err) {
          console.error('Ошибка доступа к камере:', err);
        }
      }
    };

    openCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [openedCamera, stream]);

  const handleMainButtonClick = () => {
    if (!openedCamera) {
      setIsCameraOpen(true);
      if (diag) {
        setOpenCamera?.(true);
      }
    } else {
      // Делаем снимок
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!video || !canvas || !context) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const photoData = canvas.toDataURL('image/png');
      // const base64String = photoData.split(',')[1];

      if (!diag) {
        setPhotos(prev => [...prev, photoData]);
      } else {
        setPhotosFromWorksPart(prev => [...prev, photoData]);
      }

      // setPhotoPreview(photoData);
    }
  };

  const handleCloseCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setIsCameraOpen(false);
    if (typeof setOpenCamera === 'function') {
      setOpenCamera(false);
    }
    if (diag && photosFromWorksPart?.length > 0) {
      setCheckPhotos(true);
    } else {
      if (typeof setOpenPhotoComp === 'function') {
        setOpenPhotoComp(false);
      }
    }
    diag ? setPhotosFromWorksPart([]) : setPhotos([]);
  };

  const onPreviewPhotoClick = () => {
    if (!diag) {
      setPhotosToDisplay(prev => [...prev, ...photos]);
      setPhotos([]);
    } else if (diag) {
      setPhotosToDisplay(prev => [...prev, ...photosFromWorksPart]);
      setPhotosFromWorksPart([]);
    }
    handleCloseCamera();
  };

  useEffect(() => {
    if (diag) {
      setSavedPhotos(photosToDisplay);
    }
  }, [photosToDisplay]);

  const handlePhotoDelete = index => {
    setPhotosToDisplay(prev => prev.filter((item, idx) => idx !== index));
  };

  const formattedDate = new Date().toISOString().split('T')[0];

  const onCheckmarkBtnClick = () => {
    if (!carId) return;

    if (diag || repair) {
      if (repair) {
        handleSavePhotos();
      }
      setOpenCamera(false);
      setOpenPhotoComp(false);
    } else if (photosToDisplay?.length === 0) {
      displayedCar?.status === 'repair'
        ? navigate(`/car/${carId}/repair`)
        : navigate(`/car/${carId}/diagnostics`);
    } else {
      const carData = {
        car_id: carId,
        photos: {
          photos_base64: photosToDisplay,
        },
      };
      console.log(carData);

      dispatch(uploadCarPhotos(carData))
        .unwrap()
        .then(() => {
          toast.success('Фото успішно додані', {
            position: 'top-center',
            duration: 3000,
            style: {
              background: 'var(--bg-input)',
              color: 'var(--white)FFF',
            },
          });
          dispatch(
            getAllCars({ date: formattedDate, mechanic_id: mechanicId })
          );
          // dispatch(getAllCars({ date: formattedDate, mechanic_id: 1 }));
          displayedCar?.status === 'repair'
            ? navigate(`/car/${carId}/repair`)
            : navigate(`/car/${carId}/diagnostics`);
        })
        .catch(err => {
          console.log(err);

          toast.error('Щось сталося, спробуйте ще раз', {
            position: 'top-center',
            style: {
              background: 'var(--bg-input)',
              color: 'var(--white)FFF',
            },
          });
        });
    }
  };
  console.log('photosToDisplay', photosToDisplay);
  // console.log('photos', photos);
  // console.log('displayedCar', displayedCar);
  return (
    <div className={`${css.wrapper} ${diag && css.wrapperDiag}`}>
      {openedCamera ? (
        <div className={`${css.video} ${diag && css.videoDiag}`}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className={`${css.video} ${diag && css.videoDiag}`}
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      ) : displayedCar?.cars_photo?.length === 0 ? (
        photosToDisplay?.length > 0 ? (
          <div className={css.photoSectionWrapper}>
            {photosToDisplay?.map((src, index) => (
              <div key={index} className={css.photoWrapper}>
                <img src={src} alt="car photo" className={css.photo} />
                <button type="button" className={css.deleteBtn}>
                  <BsTrash
                    className={css.deleteBtnIcon}
                    onClick={() => handlePhotoDelete(index)}
                  />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className={css.absentPhotos}>Фото відсутні</p>
        )
      ) : displayedCar?.cars_photo?.length > 0 ? (
        <div className={css.photoSectionWrapper}>
          {displayedCar?.cars_photo?.map((src, index) => (
            <img
              key={index}
              src={src}
              alt="car photo"
              className={css.existedPhoto}
            />
          ))}
          {photosToDisplay?.map((src, index) => (
            <div key={index} className={css.photoWrapper}>
              <img src={src} alt="car photo" className={css.photo} />
              <button type="button" className={css.deleteBtn}>
                <BsTrash
                  className={css.deleteBtnIcon}
                  onClick={() => handlePhotoDelete(index)}
                />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className={css.absentPhotos}>Фото відсутні</p>
      )}
      <div className={`${css.btnsWrapper} ${stream ? css.cameraOn : ''}`}>
        {!openedCamera ? (
          diag ? (
            <button
              className={css.cancelBtn}
              onClick={() => {
                // if (checkPhotos) {
                //   setCheckPhotos(false);
                //   setOpenCamera(true);
                // } else {
                setOpenPhotoComp(false);
                setSavedPhotos([]);
                // }
              }}
            >
              <IoMdClose className={`${css.cancelBtn} ${css.cross}`} />
            </button>
          ) : (
            <Link className={css.cancelBtn} to={`/car/${carId}/update-car`}>
              <IoMdClose className={`${css.cancelBtn} ${css.cross}`} />
            </Link>
          )
        ) : (
          <button className={css.cancelBtn} onClick={handleCloseCamera}>
            <IoMdClose className={`${css.cancelBtn} ${css.cross}`} />
          </button>
        )}

        <button
          type="button"
          className={css.cameraBtn}
          onClick={handleMainButtonClick}
        >
          <BsCameraFill className={css.cameraIcon} />
        </button>

        {/* {!isCameraOpen ? (
          <Link className={css.acceptBtn} to={`/car/${carId}/diagnostics`}>
            <IoMdCheckmark className={`${css.acceptBtn} ${css.check}`} />
          </Link>
        ) */}
        {!openedCamera ? (
          // <Link className={css.acceptBtn} to="/car/:carId/diagnostics">
          <IoMdCheckmark
            className={`${css.acceptBtn} ${css.check}`}
            onClick={onCheckmarkBtnClick}
          />
        ) : // {/* </Link> */}
        photos?.length > 0 || photosFromWorksPart?.length > 0 ? (
          <div
            className={css.photoPreviewWrapper}
            onClick={onPreviewPhotoClick}
          >
            <img
              src={
                !diag
                  ? photos[photos.length - 1]
                  : photosFromWorksPart[photosFromWorksPart.length - 1]
              }
              alt="photo preview"
              className={css.photoPreview}
              onError={e => {
                e.target.onerror = null;
                e.target.src = autoPhoto;
              }}
            />
            <p className={css.photoQuantity}>
              {photos?.length || photosFromWorksPart?.length}
            </p>
            <p className={css.approveIconWrapper}>
              <IoMdCheckmark className={`${css.approveIcon} ${css.check}`} />
            </p>
          </div>
        ) : (
          <div className={css.emptyDiv}></div>
        )}
      </div>
    </div>
  );
}
