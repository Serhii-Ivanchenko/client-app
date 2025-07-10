import { BsCalendarWeek } from 'react-icons/bs';
import css from './CreateARecord.module.css';
import Select from '../../Select/Select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BsCalendar2Week } from 'react-icons/bs';
import { BsChevronLeft } from 'react-icons/bs';
import { BsChevronRight } from 'react-icons/bs';
import { format, addDays, subDays } from 'date-fns';
import { useState, forwardRef, useEffect } from 'react';
import clsx from 'clsx';
import './CalendarStyles.css';
import { registerLocale } from 'react-datepicker';
import uk from 'date-fns/locale/uk';
registerLocale('uk', uk);

// import { useSelector } from 'react-redux';
// import { selectDate } from '../../../../redux/cars/selectors';

export default function CreateARecord() {
  // const selectedDate = useSelector(selectDate);
  const [chosenTime, setChosenTime] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [chosenCity, setChosenCity] = useState('');
  const [chosenService, setChosenService] = useState('');
  const [newValue, setNewValue] = useState('');
  const [pickedDate, setPickedDate] = useState(
    new Date(startDate).toLocaleDateString()
  );

  // const setNewDate = date => {
  //   setPickedDate(date);
  // };

  useEffect(() => {
    setPickedDate(startDate.toLocaleDateString());
  }, [startDate]);

  const [datesArray, setDatesArray] = useState([]);
  const [booking, setBooking] = useState([]);

  // console.log('chosenTime', chosenTime);
  // console.log('pickedDate', pickedDate);

  const handleChange = e => {
    setNewValue(e.target.value);
  };

  const onTimeBtnClick = time => {
    setChosenTime(prevValues => {
      const existingDate = prevValues.find(
        item => item.appointment_date === pickedDate
      );

      if (existingDate) {
        let updatedTimes = existingDate.times.includes(time)
          ? existingDate.times.filter(t => t !== time)
          : [...existingDate.times, time];

        updatedTimes = updatedTimes.sort();

        return updatedTimes.length > 0
          ? prevValues.map(item =>
              item.appointment_date === pickedDate
                ? { ...item, times: updatedTimes }
                : item
            )
          : prevValues.filter(item => item.appointment_date !== pickedDate);
      } else {
        return [
          ...prevValues,
          { appointment_date: pickedDate, times: [time].sort() },
        ];
      }
    });
  };

  useEffect(() => {
    const dataForBooking = chosenTime?.map(({ appointment_date, times }) => ({
      appointment_date: appointment_date.split('.').reverse().join('-'),
      times,
    }));

    const datesArray = chosenTime?.map(({ appointment_date, times }) => ({
      appointment_date: appointment_date.split('.').reverse().join('-'),
      start_time: times[0],
      end_time: times[times.length - 1],
    }));
    setDatesArray(datesArray);
    setBooking(dataForBooking);
  }, [setDatesArray, chosenTime, setBooking]);
  // console.log('chosenTime', chosenTime);

  const isChosenDate = chosenTime?.find(item => {
    return item.appointment_date === pickedDate;
  });
  const chosenHours = isChosenDate?.times;

  useEffect(() => {
    // if (!recordId) {
    //   return;
    // }

    // const recordById = dayRecords?.find(dayRecord => {
    //   return dayRecord.car_id === recordId;
    // });

    // const bookingTime = recordById?.booking;

    // const newArr = bookingTime?.map(({ appointment_date, times }) => ({
    //   appointment_date: appointment_date.split("-").reverse().join("."),
    //   times,
    // }));

    let timeArray = [];
    let datesArray = [];
    // if (car && car.status === 'new') {
    //   timeArray = [];
    //   datesArray = [];
    // } else {
    //   datesArray = recordById?.appointment_dates?.split(',');
    //   timeArray = recordById?.time_slots?.split(',');
    // }

    // console.log('datesArray', datesArray);
    // console.log('timeArray', timeArray);

    const grouped = {};

    datesArray?.forEach((dateStr, idx) => {
      const formattedDate = new Date(dateStr).toLocaleDateString('uk-UA'); // "23.04.2025"
      if (!grouped[formattedDate]) {
        grouped[formattedDate] = [];
      }
      grouped[formattedDate].push(timeArray[idx]);
    });
    // console.log('grouped', grouped);

    const result = Object.entries(grouped).map(([date, times]) => ({
      appointment_date: date,
      times,
    }));
    // console.log('result', result);

    setChosenTime(prevValues => {
      return result ? result : prevValues;
    });
    // setChosenTime(newArr);
  }, []);

  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <div className={css.datePickerWrapper}>
      <button
        type="button"
        className={css.datePaginationBtn}
        onClick={() => {
          setStartDate(subDays(value, 1));
        }}
        disabled={new Date(value) <= new Date()}
      >
        <BsChevronLeft className={css.btnIcon} />
      </button>
      <div className={css.dateWrapper} ref={ref} onClick={onClick}>
        <button type="button" className={css.customInput}>
          <BsCalendar2Week />
        </button>
        <p>{format(value, 'dd.MM.yyyy')}</p>
      </div>
      <button
        type="button"
        className={css.datePaginationBtn}
        onClick={() => setStartDate(addDays(value, 1))}
      >
        <BsChevronRight className={css.btnIcon} />
      </button>
    </div>
  ));

  CustomInput.displayName = 'CustomInput';

  const availableHours = {
    '9:00': 0,
    '10:00': 0,
    '11:00': 0,
    '12:00': 0,
    '13:00': 0,
    '14:00': 0,
    '15:00': 0,
    '16:00': 0,
    '17:00': 0,
  };

  const cities = [
    { value: 'Kyiv', label: 'Kyiv' },
    { value: 'Kharkiv', label: 'Kharkiv' },
    { value: 'Chernihiv', label: 'Chernihiv' },
  ];

  const services = [
    { value: 'KyivCars', label: 'KyivCars' },
    { value: 'KharkivCars', label: 'KharkivCars' },
    { value: 'ChernihivCars', label: 'ChernihivCars' },
  ];

  return (
    <div className={css.wrapper}>
      <Select
        array={cities}
        defaultValue={cities[0].value}
        chosenValue={chosenCity}
        setChosenValue={setChosenCity}
      />
      <Select
        array={services}
        defaultValue={services[0].value}
        chosenValue={chosenService}
        setChosenValue={setChosenService}
      />

      <div className={css.timeSelector}>
        <DatePicker
          selected={startDate}
          onChange={date => setStartDate(date)}
          minDate={new Date()}
          customInput={<CustomInput />}
          locale="uk"
        />

        <div className={css.timeWrapper}>
          {Object.entries(availableHours).map(([hour, value], index) => {
            const [hours, minutes] = hour.split(':');
            const transformedHours = hours.padStart(2, 0);
            const transformedTime = `${transformedHours}:${minutes}`;

            return (
              <button
                type="button"
                className={clsx(
                  css.timeBtn,
                  css.timeBtnFree,
                  // !recordId &&
                  //   value === 1 &&
                  //   !chosenHours?.includes(transformedTime) &&
                  //   css.timeBtnDisabled,
                  // recordId &&
                  //   car &&
                  //   value === 1 &&
                  //   !chosenHours?.includes(transformedTime) &&
                  //   css.timeBtnDisabled,
                  // recordId &&
                  //   !car &&
                  //   value === 1 &&
                  chosenHours?.includes(transformedTime) && css.timeBtnChosen,
                  chosenHours?.includes(transformedTime) && css.timeBtnChosen
                )}
                key={index}
                onClick={() => {
                  onTimeBtnClick(transformedTime, value);
                }}
                // disabled={
                //   (hour.split(':')[0] <= new Date().getHours() &&
                //     pickedDate === new Date(Date.now()).toLocaleDateString()) ||
                //   pickedDate < new Date(Date.now()).toLocaleDateString()
                // }
              >
                {transformedTime}
              </button>
            );
          })}
        </div>
      </div>

      <textarea
        className={css.textarea}
        value={newValue}
        onChange={e => handleChange(e)}
        placeholder="Залиште Ваш коментар"
      />

      <button className={css.recordBtn}>
        <BsCalendarWeek className={css.calendar} />
        <p className={css.btnText}>Записатися</p>
      </button>
    </div>
  );
}
