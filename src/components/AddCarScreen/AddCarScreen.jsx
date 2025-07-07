import css from './AddCarScreen.module.css';
import autoPhoto from '../../assets/images/absentAutoImg.webp';
import flag from '../../assets/images/flagUa.webp';
import {
  BsFillCpuFill,
  BsFillCaretDownFill,
  BsCameraFill,
} from 'react-icons/bs';
import { IoMdClose } from 'react-icons/io';
import { IoMdCheckmark } from 'react-icons/io';
import { SlSpeedometer } from 'react-icons/sl';
import carData from '../../utils/output.json';
import { useEffect, useRef, useState } from 'react';
import AddCarPopup from './AddCarPopup/AddCarPopup';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import {
  createNewCar,
  getAllCars,
  getMileageOrVinFromPhoto,
  recognizeLicensePlate,
  updateCar,
} from '../../redux/cars/operations';
import {
  // selectCarId,
  selectCarInfo,
  selectCars,
  selectIsMileageOrVinLoading,
  selectIsRecognitionLoading,
  selectMileageOrVin,
} from '../../redux/cars/selectors';
import LoaderSvg from '../Loader/LoaderSvg.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { deleteCarInfo, deleteMileageOrVin } from '../../redux/cars/slice.js';
import { selectUser } from '../../redux/auth/selectors.js';

export default function AddCarScreen() {
  const [chosenMake, setChosenMake] = useState({});
  const [chosenModel, setChosenModel] = useState({});
  const [makePopupOpen, setMakePopupOpen] = useState(false);
  const [modelPopupOpen, setModelPopupOpen] = useState(false);
  const [makeSearchQuery, setMakeSearchQuery] = useState('');
  const [modelSearchQuery, setModelSearchQuery] = useState('');
  const [displayedMakeArr, setDisplayedMakeArr] = useState([]);
  const [displayedModelArr, setDisplayedModelArr] = useState([]);
  const [yearPopupOpen, setYearPopupOpen] = useState(false);
  const [yearSearchQuery, setYearSearchQuery] = useState('');
  const [displayedYearArr, setDisplayedYearArr] = useState([]);
  const [chosenYear, setChosenYear] = useState('');
  const [mileage, setMileage] = useState('');
  const [vin, setVin] = useState('');
  const [plate, setPlate] = useState('');
  const [vinError, setVinError] = useState('');
  const dispatch = useDispatch();

  const buttonMakeRef = useRef(null);
  const buttonModelRef = useRef(null);
  const buttonYearRef = useRef(null);
  const videoRef = useRef(null);
  const modelInputRef = useRef(null);
  const makeInputRef = useRef(null);
  const yearInputRef = useRef(null);

  const carInfo = useSelector(selectCarInfo);
  const mileageOrVin = useSelector(selectMileageOrVin);
  const isRecognitionLoading = useSelector(selectIsRecognitionLoading);
  const isMileageOrVinLoading = useSelector(selectIsMileageOrVinLoading);
  // const newCarId = useSelector(selectCarId);
  console.log('mileageOrVin', mileageOrVin);

  const cars = useSelector(selectCars);
  const params = useParams();
  const carId = params?.carId;
  const userData = useSelector(selectUser);
  const mechanicId = userData?.id;

  const canvasRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraMileageOn, setCameraMileageOn] = useState(false);
  const [cameraVinOn, setCameraVinOn] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [vinPhoto, setVinPhoto] = useState(null);
  const [mileagePhoto, setMileagePhoto] = useState(null);

  const originalDataRef = useRef({});

  const navigate = useNavigate();

  useEffect(() => {
    if (modelInputRef.current) {
      modelInputRef.current.focus();
    }
  }, [modelPopupOpen]);

  useEffect(() => {
    if (makeInputRef.current) {
      makeInputRef.current.focus();
    }
  }, [makePopupOpen]);

  useEffect(() => {
    if (yearInputRef.current) {
      yearInputRef.current.focus();
    }
  }, [yearPopupOpen]);

  const startCamera = async setCameraState => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setVideoStream(stream);
      setCameraState(true);
    } catch (err) {
      console.error('Ошибка при доступе к камере', err);
    }
  };

  const stopCamera = () => {
    if (!cameraOn && !cameraMileageOn && !cameraVinOn) return;
    if (cameraOn) {
      setCameraOn(false);
    } else if (cameraMileageOn) {
      setCameraMileageOn(false);
    } else {
      setCameraVinOn(false);
    }
    setVideoStream(null);
    const tracks = videoRef.current?.srcObject?.getTracks();
    tracks?.forEach(track => track.stop());
  };

  const takePhoto = async (setPhotoState, type) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg');
    // setPhoto(dataUrl);
    setPhotoState(dataUrl);
    stopCamera();
    const base64Photo = dataUrl;
    if (type === 'photo') {
      return;
    } else if (type === 'mileage') {
      dispatch(getMileageOrVinFromPhoto({ image_base64: base64Photo }))
        .unwrap()
        .then(result => {
          if (result.odometer !== null) {
            setMileage(result.odometer);
          }
        })
        .catch(err => console.log('mileagePhotoErr', err));
    } else {
      dispatch(getMileageOrVinFromPhoto({ image_base64: base64Photo }))
        .unwrap()
        .then(result => {
          if (result.vin !== null) {
            setVin(result.vin);
          }
        })
        .catch(err => console.log('mileagePhotoErr', err));
    }
  };

  const handleClick = (setPhotoState, cameraState, setCameraState, type) => {
    if (!cameraState) {
      startCamera(setCameraState);
    } else {
      takePhoto(setPhotoState, type);
    }
  };

  const handleCameraBtnClick = () => {
    if (cameraVinOn) {
      handleClick(setVinPhoto, cameraVinOn, setCameraVinOn, 'vin');
    } else if (cameraMileageOn) {
      handleClick(
        setMileagePhoto,
        cameraMileageOn,
        setCameraMileageOn,
        'mileage'
      );
    } else {
      handleClick(setPhoto, cameraOn, setCameraOn, 'photo');
    }
  };

  const displayedCar = cars?.find(car => Number(car?.car_id) === Number(carId));
  // console.log('chosenMake', chosenMake);
  // console.log('chosenModel', chosenModel);
  // console.log('displayedCar', displayedCar);
  // console.log('carinfo', carInfo);

  useEffect(() => {
    if (!carId || cars?.length === 0) return;

    const existedMake = carData?.find(
      car => car?.make?.toLocaleLowerCase() === displayedCar?.make.toLowerCase()
    );

    const existedModel = existedMake?.models?.find(
      model =>
        model?.model_name?.toLowerCase() === displayedCar?.model?.toLowerCase()
    );

    const existedPhoto = `https://aps.assist.cam/auto/${displayedCar?.plate}.jpg`;
    console.log('existedModel', existedModel);
    console.log('existedMake', existedMake);

    setChosenMake({ id: existedMake?.id, make: existedMake?.make || '' });

    setChosenModel({
      id: existedModel?.id,
      model_name: existedModel?.model_name || '',
    });

    setChosenYear(displayedCar?.year);
    setMileage(Number(displayedCar?.mileage));
    setPlate(displayedCar?.plate);
    setVin(displayedCar?.vin);
    setPhoto(existedPhoto);

    originalDataRef.current = {
      carMake: existedMake?.make,
      carModel: existedModel?.model_name,
      carYear: displayedCar?.year,
      carMileage: Number(displayedCar?.mileage),
      carPlate: displayedCar?.plate,
      carVin: displayedCar?.vin,
      carPhoto: existedPhoto,
    };
  }, [carId, displayedCar]);

  useEffect(() => {
    if (!carInfo || Object.keys(carInfo).length === 0) return;

    setPlate(carInfo?.license_plate);
    setChosenYear(carInfo?.year);
    setVin(carInfo?.vin || null);
    setMileage(carInfo?.mileage || null);

    const existedMake = carData?.find(
      car => car?.make?.toLocaleLowerCase() === carInfo?.make?.toLowerCase()
    );
    setChosenMake({ id: existedMake?.id, make: existedMake?.make || '' });

    const existedModel = existedMake?.models?.find(
      model =>
        model?.model_name?.toLowerCase() === carInfo?.model?.toLowerCase()
    );
    setChosenModel({
      id: existedModel?.id,
      model_name: existedModel?.model_name || '',
    });
  }, [carInfo]);

  useEffect(() => {
    if (
      !mileageOrVin ||
      Object.keys(mileageOrVin).length === 0 ||
      mileageOrVin.odometer !== null
    )
      return;

    setChosenYear(mileageOrVin?.year);

    const existedMake = carData?.find(
      car =>
        car?.make?.toLocaleLowerCase() === mileageOrVin?.make?.toLowerCase()
    );
    setChosenMake({ id: existedMake?.id, make: existedMake?.make || '' });

    const existedModel = existedMake?.models?.find(
      model =>
        model?.model_name?.toLowerCase() === mileageOrVin?.model?.toLowerCase()
    );
    setChosenModel({
      id: existedModel?.id,
      model_name: existedModel?.model_name || '',
    });
  }, [mileageOrVin]);

  const makeInputClick = e => {
    e.stopPropagation();
    setMakePopupOpen(!makePopupOpen);
    setMakeSearchQuery('');
    setChosenModel({});
    setChosenYear('');
  };

  const modelInputClick = e => {
    e.stopPropagation();
    setModelPopupOpen(!modelPopupOpen);
    setModelSearchQuery('');
  };

  const yearInputClick = e => {
    e.stopPropagation();
    setYearPopupOpen(!yearPopupOpen);
    setYearSearchQuery('');
  };

  const carMakesArr = carData?.map(car => ({ id: car.id, make: car.make }));

  useEffect(() => {
    setDisplayedMakeArr(
      makeSearchQuery.trim() === ''
        ? carMakesArr
        : carMakesArr?.filter(car =>
            car.make
              .toString()
              .toLowerCase()
              .includes(makeSearchQuery.trim().toLowerCase())
          )
    );
  }, [makeSearchQuery]);

  useEffect(() => {
    if (!chosenMake?.make) {
      return;
    }
    const existedMake = carData?.find(
      item => Number(item.id) === Number(chosenMake?.id)
    );
    setDisplayedModelArr(
      modelSearchQuery.trim() === ''
        ? existedMake?.models
        : existedMake?.models?.filter(car =>
            car?.model_name
              .toString()
              .toLowerCase()
              .includes(modelSearchQuery.trim().toLowerCase())
          )
    );
  }, [chosenMake, modelSearchQuery]);

  useEffect(() => {
    if (!chosenMake?.make || !chosenModel?.model_name) {
      return;
    }

    const existedMake = carData?.find(
      item => Number(item.id) === Number(chosenMake?.id)
    );
    const selectedCarModel = existedMake?.models.find(
      car =>
        chosenModel?.model_name?.toLocaleLowerCase() ===
        car.model_name.toLocaleLowerCase()
    );

    const selectedCarModelConstructionInterval =
      selectedCarModel?.construction_interval;
    const [startDate, endDate] =
      selectedCarModelConstructionInterval.split('- ');
    const [startMonth, startYear] = startDate.split('.');
    const [endMonth, endYear] = endDate.split('.');
    const defaultEndYear = endYear ? endYear : new Date().getFullYear();
    const yearArr = [];
    for (let i = startYear; i <= defaultEndYear; i++) {
      yearArr.push(i);
    }

    setDisplayedYearArr(
      yearSearchQuery.trim() === ''
        ? yearArr
        : yearArr?.filter(year =>
            year
              .toString()
              .toLowerCase()
              .includes(yearSearchQuery.trim().toLowerCase())
          )
    );
  }, [chosenModel, yearSearchQuery, chosenMake]);

  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);

  const handleSend = () => {
    if (!photo) {
      return;
    }
    const dataURLtoBlob = dataUrl => {
      const arr = dataUrl.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) u8arr[n] = bstr.charCodeAt(n);
      return new Blob([u8arr], { type: mime });
    };

    const photoToSend = dataURLtoBlob(photo);
    dispatch(recognizeLicensePlate(photoToSend))
      .unwrap()
      .then(res => {
        res.message
          ? toast.error(res.message)
          : toast.success('Авто розпізнано');
      });
  };

  const onCheckmarkBtnClick = () => {
    if (
      !chosenMake?.make ||
      !chosenModel?.model_name ||
      !plate ||
      !chosenYear ||
      !mileage ||
      !vin
    )
      return;

    if (carId) {
      const hasChanges =
        chosenMake?.make !== originalDataRef.current.carMake ||
        chosenModel?.model_name !== originalDataRef.current.carModel ||
        plate !== originalDataRef.current.carPlate ||
        vin !== originalDataRef.current.carVin ||
        chosenYear !== originalDataRef.current.carYear ||
        mileage !== originalDataRef.current.carMileage ||
        photo !== originalDataRef.current.carPhoto;

      if (!hasChanges) {
        navigate(`/car/${carId}/photos`);
      } else {
        const carData = {
          car_id: carId,
          plate,
          vin,
          year: Number(chosenYear),
          make: chosenMake?.make,
          model: chosenModel?.model_name,
          photo_url: photo,
          mileage: Number(mileage),
        };

        console.log('carDataWithId', carData);

        dispatch(updateCar(carData))
          .unwrap()
          .then(() => {
            toast.success('Інформація про авто успішно оновлена', {
              position: 'top-center',
              duration: 3000,
              style: {
                background: 'var(--bg-input)',
                color: 'var(--white)FFF',
              },
            });
            navigate(`/car/${carId}/photos`);
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
    } else {
      const carData = {
        license_plate: plate,
        make: chosenMake?.make,
        model: chosenModel?.model_name,
        year: Number(chosenYear),
        color: carInfo?.color ? carInfo?.color : '',
        capacity: carInfo?.capacity ? carInfo?.capacity : '',
        vin: vin,
        mileage: Number(mileage),
        photo: photo,
      };

      console.log('carDataWithoutId', carData);

      dispatch(createNewCar(carData))
        .unwrap()
        .then(result => {
          console.log('result', result);

          if (
            result.message ===
            'Авто з таким номером уже існує в процесі обробки.'
          ) {
            toast.error('Авто з таким номером вже існує', {
              position: 'top-center',
              duration: 5000,
              style: {
                background: 'var(--bg-input)',
                color: 'var(--white)FFF',
              },
            });
          }
          if (result.car_id) {
            toast.success('Авто успішно створене', {
              position: 'top-center',
              duration: 5000,
              style: {
                background: 'var(--bg-input)',
                color: 'var(--white)FFF',
              },
            });
            dispatch(
              getAllCars({
                date: new Date().toLocaleString('sv').split(' ')[0],
                mechanic_id: mechanicId,
                // mechanic_id: 1,
              })
            );
            navigate(`/car/${result.car_id}/photos`);
          } else {
            console.error('ID не знайдено:', result);
          }
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

  const onCloseBtnClick = () => {
    dispatch(deleteCarInfo());
    dispatch(deleteMileageOrVin());
    navigate(`/main`);
  };

  const validate = val => {
    const onlyLatinAndDigits = /^[A-Za-z0-9]*$/;

    if (!onlyLatinAndDigits.test(val)) {
      setVinError('VIN може містити лише латинські букви та цифри');
    } else if (val.length > 17) {
      setVinError('VIN має містити 17 символів');
    } else if (val.length === 17) {
      // Якщо символи окей, але довжина рівно 17 — тоді перевіряємо формат
      const fullVinRegex = /^[A-Za-z0-9]{17}$/;
      if (!fullVinRegex.test(val)) {
        setVinError('VIN має містити 17 символів');
      } else {
        setVinError('');
      }
    } else {
      // Символи валідні, але ще не введено 17 — не показуємо помилку
      setVinError('');
    }
  };

  return isRecognitionLoading || isMileageOrVinLoading ? (
    <LoaderSvg />
  ) : (
    <>
      <div className={`${css.wrapper} ${videoStream ? css.cameraOn : ''}`}>
        {(cameraOn || cameraMileageOn || cameraVinOn) && (
          <video ref={videoRef} autoPlay playsInline className={css.video} />
        )}
        {/* {cameraMileageOn && (
          <>
            <video ref={videoRef} autoPlay playsInline className={css.video} />
            <div className={css.mileageWrapper}>
              <SlSpeedometer className={css.mileageIcon} />
              <input
                className={css.mileage}
                type="text"
                value={mileage}
                onChange={e => {
                  setMileage(e.target.value);
                }}
                placeholder="123000"
              />

              <p className={css.mileageText}>км</p>

              <BsCameraFill
                className={css.cameraVinIcon}
                onClick={() =>
                  handleClick(
                    setMileagePhoto,
                    cameraMileageOn,
                    setCameraMileageOn,
                    'mileage'
                  )
                }
              />
            </div>
          </>
        )}
        {cameraVinOn && (
          <>
            <video ref={videoRef} autoPlay playsInline className={css.video} />
            <div className={`${css.mileageWrapper} ${css.vinWrapper}`}>
              <input
                className={css.mileage}
                type="text"
                value={vin}
                onChange={e => {
                  setVin(e.target.value);
                  validate(e.target.value);
                }}
                placeholder="vin"
              />
              <BsCameraFill
                className={css.cameraVinIcon}
                onClick={() =>
                  handleClick(setVinPhoto, cameraVinOn, setCameraVinOn, 'vin')
                  
                }
              />
              {vinError && <p className={css.error}>{vinError}</p>}
            </div>
          </>
        )} */}
        {!cameraOn && !cameraMileageOn && !cameraVinOn && (
          <>
            <div className={css.carPhoto}>
              {photo ? (
                <img
                  src={photo || autoPhoto}
                  alt="car photo"
                  className={css.carImg}
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = autoPhoto;
                  }}
                />
              ) : (
                <img
                  src={autoPhoto || autoPhoto}
                  alt="car photo"
                  className={css.carImg}
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = autoPhoto;
                  }}
                />
              )}
            </div>

            <div className={css.topWrapper}>
              <div className={css.carNumberWrapper}>
                <div className={css.numberWrapper}>
                  <img src={flag} alt="flag image" />
                  <p className={css.flagText}>UA</p>
                </div>
                <input
                  className={css.number}
                  type="text"
                  value={plate}
                  onChange={e => setPlate(e.target.value)}
                  placeholder="BA1234BA"
                />
              </div>
              <button
                type="button"
                className={css.btn}
                onClick={handleSend}
                disabled={!photo}
              >
                <BsFillCpuFill className={css.btnIcon} />
                Розпізнати
              </button>
            </div>
            <div className={css.bottomWrapper}>
              <div
                onClick={makeInputClick}
                ref={buttonMakeRef}
                className={css.inputWithPopup}
              >
                <div className={css.inputWrapper} onClick={makeInputClick}>
                  {makePopupOpen ? (
                    <input
                      type="text"
                      value={makeSearchQuery}
                      onChange={e => setMakeSearchQuery(e.target.value)}
                      className={`${css.input} ${css.text} ${css.textColor}`}
                      onClick={e => e.stopPropagation()}
                      placeholder="Марка авто"
                      ref={makeInputRef}
                    />
                  ) : (
                    <p
                      className={clsx(
                        css.text,
                        chosenMake?.make ? css.textColor : css.placeholderColor
                      )}
                    >
                      {chosenMake?.make || 'Марка авто'}
                    </p>
                  )}
                  <button
                    type="button"
                    className={css.arrow}
                    onClick={makeInputClick}
                  >
                    <BsFillCaretDownFill
                      className={clsx(
                        css.arrowIcon,
                        makePopupOpen && css.arrowIconOpen
                      )}
                    />
                  </button>
                </div>

                {makePopupOpen && (
                  <AddCarPopup
                    arr={displayedMakeArr}
                    fieldKey="make"
                    setFieldValue={setChosenMake}
                    buttonRef={buttonMakeRef}
                    onClose={() => setMakePopupOpen(false)}
                    isOpen={makePopupOpen}
                  />
                )}
              </div>
              <div
                onClick={modelInputClick}
                ref={buttonModelRef}
                className={css.inputWithPopup}
              >
                <div className={css.inputWrapper} onClick={modelInputClick}>
                  {modelPopupOpen ? (
                    <input
                      type="text"
                      value={modelSearchQuery}
                      onChange={e => setModelSearchQuery(e.target.value)}
                      className={`${css.input} ${css.text} ${css.textColor}`}
                      onClick={e => e.stopPropagation()}
                      placeholder="Модель авто"
                      ref={modelInputRef}
                    />
                  ) : (
                    <p
                      className={clsx(
                        css.text,
                        chosenModel?.model_name
                          ? css.textColor
                          : css.placeholderColor
                      )}
                    >
                      {chosenModel?.model_name || 'Модель авто'}
                    </p>
                  )}
                  <button
                    type="button"
                    className={css.arrow}
                    onClick={modelInputClick}
                  >
                    <BsFillCaretDownFill
                      className={clsx(
                        css.arrowIcon,
                        modelPopupOpen && css.arrowIconOpen
                      )}
                    />
                  </button>
                </div>
                {modelPopupOpen && (
                  <AddCarPopup
                    arr={displayedModelArr}
                    fieldKey="model_name"
                    setFieldValue={setChosenModel}
                    buttonRef={buttonModelRef}
                    onClose={() => setModelPopupOpen(false)}
                    isOpen={modelPopupOpen}
                  />
                )}
              </div>
              <div
                onClick={yearInputClick}
                ref={buttonYearRef}
                className={css.inputWithPopup}
              >
                <div className={css.inputWrapper} onClick={yearInputClick}>
                  {yearPopupOpen ? (
                    <input
                      type="text"
                      value={yearSearchQuery}
                      onChange={e => setYearSearchQuery(e.target.value)}
                      className={`${css.input} ${css.text} ${css.textColor}`}
                      onClick={e => e.stopPropagation()}
                      placeholder="Рік випуску"
                      ref={yearInputRef}
                    />
                  ) : (
                    <p
                      className={clsx(
                        css.text,
                        chosenYear ? css.textColor : css.placeholderColor
                      )}
                    >
                      {chosenYear || 'Рік випуску'}
                    </p>
                  )}
                  <button
                    type="button"
                    className={css.arrow}
                    onClick={yearInputClick}
                  >
                    <BsFillCaretDownFill
                      className={clsx(
                        css.arrowIcon,
                        yearPopupOpen && css.arrowIconOpen
                      )}
                    />
                  </button>
                </div>

                {yearPopupOpen && (
                  <AddCarPopup
                    arr={displayedYearArr}
                    setFieldValue={setChosenYear}
                    buttonRef={buttonYearRef}
                    onClose={() => setYearPopupOpen(false)}
                    isOpen={yearPopupOpen}
                  />
                )}
              </div>
              <div className={css.mileageWrapper}>
                <SlSpeedometer className={css.mileageIcon} />
                <input
                  className={css.mileage}
                  type="text"
                  value={mileage}
                  onChange={e => {
                    setMileage(e.target.value);
                  }}
                  placeholder="123000"
                />

                <p className={css.mileageText}>км</p>

                <BsCameraFill
                  className={css.cameraVinIcon}
                  onClick={() =>
                    // handleClick(
                    //   setMileagePhoto,
                    //   cameraMileageOn,
                    //   setCameraMileageOn,
                    //   'mileage'
                    // )
                    startCamera(setCameraMileageOn)
                  }
                />
              </div>
              <div className={`${css.mileageWrapper} ${css.vinWrapper}`}>
                <input
                  className={css.mileage}
                  type="text"
                  value={vin}
                  onChange={e => {
                    setVin(e.target.value);
                    validate(e.target.value);
                  }}
                  placeholder="vin"
                />
                <BsCameraFill
                  className={css.cameraVinIcon}
                  onClick={() =>
                    // handleClick(setVinPhoto, cameraVinOn, setCameraVinOn, 'vin')
                    startCamera(setCameraVinOn)
                  }
                />
                {vinError && <p className={css.error}>{vinError}</p>}
              </div>
            </div>
          </>
        )}
      </div>
      <div className={`${css.btnsWrapper} ${cameraOn ? css.isCameraOn : ''}`}>
        {!cameraOn && !cameraMileageOn && !cameraVinOn ? (
          <IoMdClose
            className={`${css.cancelBtn} ${css.cross}`}
            onClick={onCloseBtnClick}
          />
        ) : (
          <button className={css.cancelBtn} onClick={stopCamera}>
            <IoMdClose className={`${css.cancelBtn} ${css.cross}`} />
          </button>
        )}

        <div>
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          {/* {!cameraMileageOn && !cameraVinOn && ( */}
          <button
            type="button"
            className={css.cameraBtn}
            onClick={handleCameraBtnClick}
          >
            <BsCameraFill className={css.cameraIcon} />
          </button>
          {/* // )} */}
        </div>
        {!cameraOn &&
        !cameraMileageOn &&
        chosenMake?.make &&
        chosenModel?.model_name &&
        chosenYear &&
        mileage &&
        vin &&
        !vinError &&
        plate ? (
          <IoMdCheckmark
            className={`${css.acceptBtn} ${css.check}`}
            onClick={onCheckmarkBtnClick}
          />
        ) : (
          <div className={css.emptyDiv}></div>
        )}
      </div>
    </>
  );
}
