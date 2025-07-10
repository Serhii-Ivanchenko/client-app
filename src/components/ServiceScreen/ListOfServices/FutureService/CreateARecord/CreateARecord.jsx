import { BsCalendarWeek } from 'react-icons/bs';
import css from './CreateARecord.module.css';
import Select from '../../Select/Select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BsCalendar2Week } from 'react-icons/bs';
import { BsChevronLeft } from 'react-icons/bs';
import { BsChevronRight } from 'react-icons/bs';
import { format, addDays, subDays } from 'date-fns';
import { useState, forwardRef } from 'react';
import clsx from 'clsx';
import './CalendarStyles.css';
import { registerLocale } from 'react-datepicker';
import uk from 'date-fns/locale/uk';
registerLocale('uk', uk);

// import { useSelector } from 'react-redux';
// import { selectDate } from '../../../../redux/cars/selectors';

export default function CreateARecord() {
  // const selectedDate = useSelector(selectDate);
  const [startDate, setStartDate] = useState(new Date());
  const [chosenCity, setChosenCity] = useState('');
  const [chosenService, setChosenService] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleChange = e => {
    setNewValue(e.target.value);
  };

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
                  css.timeBtnFree
                  //   !recordId &&
                  //     value === 1 &&
                  //     !chosenHours?.includes(transformedTime) &&
                  //     css.timeBtnDisabled,
                  //   recordId &&
                  //     car &&
                  //     value === 1 &&
                  //     !chosenHours?.includes(transformedTime) &&
                  //     css.timeBtnDisabled,
                  //   recordId &&
                  //     !car &&
                  //     value === 1 &&
                  //     chosenHours?.includes(transformedTime) &&
                  //     css.timeBtnChosen,
                  //   chosenHours?.includes(transformedTime) && css.timeBtnChosen
                )}
                key={index}
                onClick={() => {
                  // onTimeBtnClick(transformedTime, value);
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
