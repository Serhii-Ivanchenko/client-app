import CalendarPart from './CalendarPart/CalendarPart';
import CarsInWorkOrDoneList from './CarsInWorkOrDoneList/CarsInWorkOrDoneList';
import { IoCarSport } from 'react-icons/io5';
import { BsPlusCircleDotted } from 'react-icons/bs';
import { BsCameraFill, BsBoxArrowLeft } from 'react-icons/bs';
import { BiSolidMessageDetail } from 'react-icons/bi';
import css from './MainScreenSection.module.css';
import { useEffect, useState } from 'react';
import DiagnosticScreen from '../DiagnosticScreen/DiagnosticScreen';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../../redux/auth/operations';
import { selectCars } from '../../redux/cars/selectors';
import { Link } from 'react-router-dom';
import { selectBalance } from '../../redux/auth/selectors.js';
import { clearChosenDate } from '../../redux/cars/slice.js';

export default function MainScreenSection({ array1, array2, wage }) {
  // const [car, setCar] = useState('');
  // const [diagOpen, setDiagOpen] = useState(false);
  const cars = useSelector(selectCars);
  const balance = useSelector(selectBalance);

  const dispatch = useDispatch();

  const handleLogOut = () => {
    dispatch(logOut());
    sessionStorage.removeItem('date');
    dispatch(clearChosenDate());
  };

  useEffect(() => {
    sessionStorage.setItem('visitedMain', 'true');
  }, []);

  console.log('cars', cars);

  const date = sessionStorage.getItem('date');

  const checkDate = dayOfRecord => {
    const currentDate = new Date(date);
    const dateOfRecord = new Date(dayOfRecord);

    // console.log(
    //   'dateOfRecord > currentTime',
    //   new Date(dateOfRecord).toISOString().split('T')[0] >
    //     new Date(currentDate).toISOString().split('T')[0]
    // );
    // console.log('dateOfRecord', new Date(dateOfRecord).toLocaleDateString());
    // console.log('currentTime', new Date(currentDate).toDateString());

    return (
      new Date(dateOfRecord).toISOString().split('T')[0] >
      new Date(currentDate).toISOString().split('T')[0]
    );
  };

  const carsInWork = cars?.filter(car =>
    car?.status === 'diagnostic' ? !car?.diagnostic_id : !car.complete_date
  );
  const carsDone = cars?.filter(car =>
    car?.status === 'diagnostic' ? car?.diagnostic_id : car.complete_date
  );
  console.log('carsInWork', carsInWork);
  // console.log('carsDone', carsDone);

  const filteredCarsInWork = carsInWork.filter(car => !checkDate(car.date));
  console.log('filteredCarsInWork', filteredCarsInWork);

  const carsArray = () => {
    if (
      date === new Date().toISOString().split('T')[0] ||
      date < new Date().toISOString().split('T')[0]
    ) {
      return filteredCarsInWork.filter(
        car =>
          car.date.split('T')[0] < new Date().toISOString().split('T')[0] ||
          car.date.split('T')[0] === date
      );
    } else if (date > new Date().toISOString().split('T')[0]) {
      return filteredCarsInWork.filter(car => car.date.split('T')[0] === date);
    }
  };

  // console.log('carsArray', carsArray());

  const carsDoneForParticularDay = carsDone?.filter(car =>
    car?.status === 'diagnostic'
      ? car?.diagnostic_created_at.split('T')[0] === date
      : car?.status === 'repair'
      ? car?.repair_created_at.split('T')[0] === date
      : ''
  );

  console.log('carsDoneForParticularDay', carsDoneForParticularDay);

  return (
    <div className={css.sectionWrapper}>
      <CarsInWorkOrDoneList list={carsArray()} />

      <Link to="/add-car" className={css.btnAddPhoto}>
        <IoCarSport className={css.icon} />
        <BsPlusCircleDotted className={css.icon} />
        <BsCameraFill className={css.icon} />
      </Link>

      <CarsInWorkOrDoneList
        done={true}
        list={carsDoneForParticularDay}
        // setDiagOpen={setDiagOpen}
      />

      <div className={css.bottomPart}>
        <button className={css.exitBox} onClick={() => handleLogOut()}>
          <BsBoxArrowLeft className={css.iconExit} />
        </button>
        <BiSolidMessageDetail className={css.iconMessage} />
        <p className={css.wage}>
          +{' '}
          {carsDoneForParticularDay.reduce(
            (sum, car) => sum + Math.trunc(car.total_work_earnings),
            0
          )}
        </p>
      </div>
      {/* </>
      )} */}
    </div>
  );
}
