import css from './GaragePageCentralComponent.module.css';
import { IoCarSport } from 'react-icons/io5';
import carData from '../../utils/output.json';
import {
  BsCameraFill,
  BsFillCpuFill,
  BsFillCaretDownFill,
} from 'react-icons/bs';
import { SlSpeedometer } from 'react-icons/sl';
import { IoMdCheckmark, IoMdClose } from 'react-icons/io';
import { useEffect, useRef, useState } from 'react';
import autoPhoto from '../../assets/images/autoPhoto.webp';
import flag from '../../assets/images/flagUa.webp';
import clsx from 'clsx';
import AddCarPopup from './AddCarPopup/AddCarPopup';
import {
  getMileageOrVinFromPhoto,
  recognizeLicensePlate,
} from '../../redux/cars/operations';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCarInfo,
  selectIsMileageOrVinLoading,
  selectIsRecognitionLoading,
  selectMileageOrVin,
} from '../../redux/cars/selectors';
import LoaderSvg from '../Loader/LoaderSvg';

const cars = [
  { make: 'Audi', model: 'A6', mileage: 150000 },
  { make: 'Audi', model: 'A6', mileage: 150000 },
  { make: 'Audi', model: 'A6', mileage: 150000 },
  { make: 'Audi', model: 'A6', mileage: 150000 },
  { make: 'Audi', model: 'A6', mileage: 150000 },
];

export default function GaragePageCentralComponent() {
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraMileageOn, setCameraMileageOn] = useState(false);
  const [cameraVinOn, setCameraVinOn] = useState(false);
  const [stream, setStream] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [vinPhoto, setVinPhoto] = useState(null);
  const [mileagePhoto, setMileagePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

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
  const canvasRef = useRef(null);
  // const originalDataRef = useRef({});

  const recognitionLoading = useSelector(selectIsRecognitionLoading);
  const mileageOrVinLoading = useSelector(selectIsMileageOrVinLoading);
  const carInfo = useSelector(selectCarInfo);

  const mileageOrVin = useSelector(selectMileageOrVin);

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
    if (!carInfo || Object.keys(carInfo).length === 0) return;
    console.log('carInfo', carInfo);

    setPlate(carInfo?.license_plate);
    setChosenYear(carInfo?.year);
    setVin(carInfo?.vin);
    setMileage(carInfo?.mileage);

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
    const openCamera = async () => {
      if (
        (cameraOn || cameraMileageOn || cameraVinOn) &&
        videoRef.current &&
        !stream
      ) {
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
  }, [cameraOn, cameraMileageOn, cameraVinOn, stream]);

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

  const handleMainButtonClick = () => {
    // Делаем снимок
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!video || !canvas || !context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const photoData = canvas.toDataURL('image/png');

    setPhotoPreview(photoData);
  };

  const handleCloseCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setPhotoPreview(null);
    setCameraOn(false);
    setCameraMileageOn(false);
    setCameraVinOn(false);
  };

  const onPhotoApproveClick = async () => {
    if (!cameraOn && !cameraMileageOn && !cameraVinOn) {
      return;
    }
    if (cameraOn) {
      setPhoto(photoPreview);
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
    } else {
      setVinPhoto(photoPreview);
      handleCloseCamera();
      dispatch(getMileageOrVinFromPhoto({ image_base64: photoPreview }))
        .unwrap()
        .then(result => {
          if (result.vin !== null) {
            setVin(result.vin);
          }
        })
        .catch(err => console.log('vinPhotoErr', err));
    }
  };

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
    dispatch(recognizeLicensePlate(photoToSend));
    // .unwrap()
    // .then(result => setPlate(result?.license_plate))
    // .catch(err => console.log(err));
  };

  return (
    <div className={css.pageWrapper}>
      {recognitionLoading || mileageOrVinLoading ? (
        <LoaderSvg />
      ) : (
        <>
          {(cameraOn || cameraMileageOn || cameraVinOn) && (
            <>
              <div className={css.video}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className={css.video}
                />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
              </div>
              <div className={css.btnsWrapper}>
                <button className={css.cancelBtn} onClick={handleCloseCamera}>
                  <IoMdClose className={`${css.cancelBtn} ${css.cross}`} />
                </button>
                <button
                  type="button"
                  className={css.cameraBtn}
                  onClick={handleMainButtonClick}
                >
                  <BsCameraFill className={css.cameraIcon} />
                </button>
                {photoPreview ? (
                  <div className={css.photoPreviewWrapper}>
                    <img
                      src={photoPreview}
                      alt="photo preview"
                      className={css.photoPreview}
                    />
                    <p
                      className={css.photoQuantity}
                      onClick={() => setPhotoPreview(null)}
                    >
                      <IoMdClose
                        className={`${css.approveIcon} ${css.checkMark}`}
                      />
                    </p>
                    <p
                      className={css.approveIconWrapper}
                      onClick={onPhotoApproveClick}
                    >
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
          )}
          {!cameraOn && !cameraMileageOn && !cameraVinOn && (
            <>
              <h3 className={css.header}>Збережені авто</h3>
              <div className={css.carsWrapper}>
                <div className={css.list}>
                  {cars?.map((car, index) => {
                    return (
                      <div key={index} className={css.listItemWrapper}>
                        <div className={css.listItem}>
                          <IoCarSport className={css.carIcon} />
                          <p className={css.carMake}>
                            {car.make} {car.model}
                          </p>
                          <p className={`${css.carMake} ${css.carMileage}`}>
                            {car.mileage} км
                          </p>
                        </div>
                        {index !== cars?.length - 1 && (
                          <span className={css.line}></span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <h3 className={css.header}>Додати авто</h3>

              {!photo ? (
                <div className={css.cameraWrapper}>
                  <button
                    type="button"
                    className={css.cameraBtn}
                    onClick={() => {
                      setCameraOn(true);
                      setCameraMileageOn(false);
                      setCameraVinOn(false);
                    }}
                  >
                    <BsCameraFill className={css.cameraIcon} />
                  </button>
                </div>
              ) : (
                <div className={css.carPhoto}>
                  <img src={photo} alt="car photo" className={css.carImg} />
                  <p
                    className={css.photoQuantity}
                    onClick={() => setPhoto(null)}
                  >
                    <IoMdClose
                      className={`${css.approveIcon} ${css.checkMark}`}
                    />
                  </p>
                </div>
              )}
              <div className={css.bottomWrapper}>
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
                    disabled={!photo}
                    onClick={handleSend}
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
                            chosenMake?.make
                              ? css.textColor
                              : css.placeholderColor
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
                      onClick={() => {
                        setCameraOn(false);
                        setCameraMileageOn(true);
                        setCameraVinOn(false);
                      }}
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
                      onClick={() => {
                        setCameraOn(false);
                        setCameraMileageOn(false);
                        setCameraVinOn(true);
                      }}
                    />
                    {vinError && <p className={css.error}>{vinError}</p>}
                  </div>
                </div>
                <button type="button" className={css.saveBtn}>
                  Зберегти
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
