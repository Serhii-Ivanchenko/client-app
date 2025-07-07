import css from './CarDetailsPart.module.css';
import flag from '../../../assets/images/flagUa.webp';
import car from '../../../assets/images/absentAutoImg.webp';
import { BiSolidMessageDetail } from 'react-icons/bi';

export default function CarDetailsPart({ particularCar }) {
  return (
    <div className={css.wrapper}>
      <img
        src={
          particularCar?.plate
            ? `https://aps.assist.cam/auto/${particularCar?.plate}.jpg`
            : car
        }
        onError={e => {
          e.target.onerror = null;
          e.target.src = car;
        }}
        alt="car"
        className={css.image}
      />
      <div
        className={`${css.statusStick} ${
          particularCar?.status === 'diagnostic'
            ? css.stickDiag
            : particularCar?.status === 'repair'
            ? css.stickRepair
            : particularCar?.status === 'complete'
            ? css.stickDone
            : ''
        }`}
      ></div>
      <div className={css.carRegContainer}>
        <div className={css.carRegCountry}>
          <img
            className={css.carRegFlag}
            src={flag}
            alt="Car registration country flag"
          />
          <p className={css.carRegCountry}>ua</p>
        </div>
        <p className={css.carRegNumber}>
          {particularCar?.plate || '- - - - -'}
        </p>
      </div>
      <BiSolidMessageDetail className={css.iconM} />
    </div>
  );
}
