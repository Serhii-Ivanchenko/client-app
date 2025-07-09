import css from './ServiceScreen.module.css';
import { IoCarSport } from 'react-icons/io5';
import { SlSpeedometer } from 'react-icons/sl';
import { BsFillCameraFill } from 'react-icons/bs';
import ListOfServices from './ListOfServices/ListOfServices';
import car from '../../assets/images/autoPhoto.webp';
import { useEffect, useRef, useState } from 'react';

const services = [
  {
    id: 1,
    mileage: '259',
    works: [
      'Ремень поликлиновый',
      'Насос системы охлаждения',
      'Термостат',
      'Колодки гальмівні',
    ],
    status: 'done',
    sum: '5 200',
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
  const [newValue, setNewValue] = useState('257 000');
  const inputRef = useRef();

  const handleChange = e => {
    setNewValue(e.target.value);
  };

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  });

  return (
    <div className={css.wrapper}>
      <div className={css.topPartWrapper}>
        <div className={css.carNameBox}>
          <IoCarSport className={css.carIcon} />
          <p className={css.carName}>Audi A6</p>
        </div>
        <div className={css.mileageBox}>
          <SlSpeedometer className={css.mileageIcon} />
          <p
            className={css.mileage}
            onClick={() => setActiveInput(true)}
            onBlur={() => setActiveInput(false)}
          >
            {activeInput ? (
              <input
                className={css.mileageNumActive}
                value={newValue}
                onChange={e => handleChange(e)}
                ref={inputRef}
              />
            ) : (
              <span className={css.mileageNum}>{newValue}</span>
            )}{' '}
            км
          </p>
          <BsFillCameraFill className={css.camera} />
        </div>
      </div>

      <ListOfServices services={services} />
    </div>
  );
}
