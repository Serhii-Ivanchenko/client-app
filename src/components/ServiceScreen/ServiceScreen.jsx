import css from './ServiceScreen.module.css';
import { IoCarSport } from 'react-icons/io5';
import { SlSpeedometer } from 'react-icons/sl';
import { BsFillCameraFill } from 'react-icons/bs';
import ListOfServices from './ListOfServices/ListOfServices';

const services = [
  {
    mileage: '259',
    works: [
      'Ремень поликлиновый',
      'Насос системы охлаждения',
      'Термостат',
      'Колодки гальмівні',
    ],
    status: 'done',
    sum: '',
    photos: [],
  },
  {
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
    mileage: '218',
    works: [
      'Ремень поликлиновый',
      'Насос системы охлаждения',
      'Термостат',
      'Колодки гальмівні',
    ],
    status: 'done',
    sum: '',
    photos: [],
  },
  {
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
  return (
    <div className={css.wrapper}>
      <div>
        <div>
          <IoCarSport />
          <p>Audi A6</p>
        </div>
        <div>
          <SlSpeedometer />
          <p>257 тис. км</p>
          <BsFillCameraFill />
        </div>
      </div>
      <ListOfServices services={services} />
    </div>
  );
}
