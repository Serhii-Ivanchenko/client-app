import { BsCalendarWeek } from 'react-icons/bs';
import css from './CreateARecord.module.css';

export default function CreateARecord() {
  return (
    <div>
      <div></div>

      <button className={css.recordBtn}>
        <BsCalendarWeek className={css.calendar} />
        <p className={css.btnText}>Записатися</p>
      </button>
    </div>
  );
}
