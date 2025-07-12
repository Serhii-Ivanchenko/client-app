import css from './ServiceScreen.module.css';
import { IoCarSport } from 'react-icons/io5';
import { SlSpeedometer } from 'react-icons/sl';
import { BsFillCameraFill } from 'react-icons/bs';
import ListOfServices from './ListOfServices/ListOfServices';
import car from '../../assets/images/autoPhoto.webp';
import { useEffect, useRef, useState } from 'react';
import { getMileageOrVinFromPhoto } from '../../redux/cars/operations';
import { useDispatch, useSelector } from 'react-redux';
import Camera from './Camera/Camera';
import { selectIsMileageOrVinLoading } from '../../redux/cars/selectors';
import LoaderSvg from '../Loader/LoaderSvg';

const services = [
  {
    id: 1,
    mileage: '259',
    works: ['Ремень поликлиновый', 'Насос системы охлаждения', 'Термостат'],
    status: 'done',
    sum: '5 500',
    photos: [car, car, car],
  },
  {
    id: 5,
    mileage: '278',
    works: [
      'Ремень поликлиновый',
      'Насос системы охлаждения',
      'Термостат',
      'Колодки гальмівні',
    ],
    status: 'future',
    sum: '',
    photos: [],
  },
  {
    id: 2,
    mileage: '293',
    works: [
      'Ремень поликлиновый',
      'Насос системы охлаждения',
      'Термостат',
      'Колодки гальмівні',
    ],
    status: 'future',
    sum: '',
    photos: [],
  },
  {
    id: 3,
    mileage: '218',
    works: [
      'Ремень поликлиновый',
      'Насос системы охлаждения',
      'Термостат',
      'Колодки гальмівні',
    ],
    status: 'done',
    sum: '5 200',
    photos: [car, car, car, car, car],
  },
  {
    id: 4,
    mileage: '350',
    works: [
      'Ремень поликлиновый',
      'Насос системы охлаждения',
      'Термостат',
      'Колодки гальмівні',
    ],
    status: 'future',
    sum: '',
    photos: [],
  },
];

export default function ServiceScreen(params) {
  const [activeInput, setActiveInput] = useState(false);
  const [newValue, setNewValue] = useState('');
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraMileageOn, setCameraMileageOn] = useState(false);
  const [stream, setStream] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [photosToDisplay, setPhotosToDisplay] = useState([]);
  const [mileagePhoto, setMileagePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [mileage, setMileage] = useState('');
  const [openPreviewScreen, setOpenPreviewScreen] = useState(false);

  const inputRef = useRef();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mileageLoading = useSelector(selectIsMileageOrVinLoading);

  const dispatch = useDispatch();

  const filteredServices = services.sort((a, b) => a.mileage - b.mileage);

  const handleChange = e => {
    setMileage(e.target.value);
  };

  // useEffect(() => {
  //   if (inputRef && inputRef.current) {
  //     inputRef.current.focus();
  //   }
  // });

  useEffect(() => {
    const openCamera = async () => {
      if ((cameraOn || cameraMileageOn) && videoRef.current && !stream) {
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
  }, [cameraOn, cameraMileageOn, stream]);

  // useEffect(() => {
  //   if (
  //     !mileageOrVin ||
  //     Object.keys(mileageOrVin).length === 0 ||
  //     mileageOrVin.odometer !== null
  //   )
  //     return;

  //   setChosenYear(mileageOrVin?.year);

  //   const existedMake = carData?.find(
  //     car =>
  //       car?.make?.toLocaleLowerCase() === mileageOrVin?.make?.toLowerCase()
  //   );
  //   setChosenMake({ id: existedMake?.id, make: existedMake?.make || '' });

  //   const existedModel = existedMake?.models?.find(
  //     model =>
  //       model?.model_name?.toLowerCase() === mileageOrVin?.model?.toLowerCase()
  //   );
  //   setChosenModel({
  //     id: existedModel?.id,
  //     model_name: existedModel?.model_name || '',
  //   });
  // }, [mileageOrVin]);

  const handleMainButtonClick = () => {
    // Делаем снимок
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (!video || !canvas || !context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const photoData = canvas.toDataURL('image/png');

    if (cameraOn) {
      setPhotos(prev => [...prev, photoData]);
    }

    setPhotoPreview(photoData);
  };

  console.log('photos', photos);

  const handleCloseCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setPhotoPreview(null);

    if (!openPreviewScreen) {
      setCameraOn(false);
    }
    setCameraMileageOn(false);
    setPhotos([]);
    if (openPreviewScreen) {
      setOpenPreviewScreen(false);
      setPhotosToDisplay([]);
    }

    // setCameraVinOn(false);
  };

  const onPhotoApproveClick = async () => {
    if (!cameraOn && !cameraMileageOn) {
      return;
    }
    if (cameraOn) {
      setOpenPreviewScreen(true);
      setPhotosToDisplay(photos);
      handleCloseCamera();
    } else if (cameraMileageOn) {
      setMileagePhoto(photoPreview);
      handleCloseCamera();
      dispatch(getMileageOrVinFromPhoto({ image_base64: photoPreview }))
        .unwrap()
        .then(result => {
          if (result.odometer !== null) {
            setMileage(result.odometer);
          }
        })
        .catch(err => console.log('mileagePhotoErr', err));
    }
    // else {
    //   setVinPhoto(photoPreview);
    //   handleCloseCamera();
    //   dispatch(getMileageOrVinFromPhoto({ image_base64: photoPreview }))
    //     .unwrap()
    //     .then(result => {
    //       if (result.vin !== null) {
    //         setVin(result.vin);
    //       }
    //     })
    //     .catch(err => console.log('vinPhotoErr', err));
    // }
  };

  return (
    <div className={css.wrapper}>
      {cameraMileageOn || cameraOn || openPreviewScreen ? (
        <Camera
          videoRef={videoRef}
          canvasRef={canvasRef}
          handleCloseCamera={handleCloseCamera}
          handleMainButtonClick={handleMainButtonClick}
          photoPreview={photoPreview}
          setPhotoPreview={setPhotoPreview}
          onPhotoApproveClick={onPhotoApproveClick}
          photos={photos}
          setPhotos={setPhotos}
          photosToDisplay={photosToDisplay}
          setPhotosToDisplay={setPhotosToDisplay}
          cameraOn={cameraOn}
          setCameraOn={setCameraOn}
          cameraMileageOn={cameraMileageOn}
          openPreviewScreen={openPreviewScreen}
          setOpenPreviewScreen={setOpenPreviewScreen}
        />
      ) : (
        <>
          <div className={css.topPartWrapper}>
            <div className={css.carNameBox}>
              <IoCarSport className={css.carIcon} />
              <p className={css.carName}>Audi A6</p>
            </div>
            <div className={css.mileageBox}>
              <SlSpeedometer className={css.mileageIcon} />

              {/* {activeInput ? ( */}
              {mileageLoading ? (
                'Зачекайте...'
              ) : (
                <>
                  <input
                    className={css.mileageNumActive}
                    value={mileage}
                    onChange={e => handleChange(e)}
                    ref={inputRef}
                    placeholder="257 000"
                  />
                  <p
                    className={css.mileage}
                    onClick={() => setActiveInput(true)}
                    onBlur={() => setActiveInput(false)}
                  >
                    {' '}
                    км
                  </p>
                </>
              )}

              {/* ) : (
              <span className={css.mileageNum}>{newValue}</span>
            )}{' '} */}

              {/* <input
            className={css.mileageNumActive}
            value={newValue}
            onChange={e => handleChange(e)}
            ref={inputRef}
          /> */}
              <BsFillCameraFill
                className={css.camera}
                onClick={() => {
                  setCameraOn(false);
                  setCameraMileageOn(true);
                }}
              />
            </div>
          </div>

          <ListOfServices
            services={filteredServices}
            // handleMainButtonClick={handleMainButtonClick}
            // handleCloseCamera={handleCloseCamera}
            // onPhotoApproveClick={onPhotoApproveClick}
            setCameraOn={setCameraOn}
            setCameraMileageOn={setCameraMileageOn}
            photos={photos}
            setPhotos={setPhotos}
          />
        </>
      )}
    </div>
  );
}
