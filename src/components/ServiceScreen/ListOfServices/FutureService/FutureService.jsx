import { BsCheckLg } from 'react-icons/bs';
import { BsCreditCard } from 'react-icons/bs';
import { BsReceipt } from 'react-icons/bs';
import CreateARecord from './CreateARecord/CreateARecord';
import css from './FutureService.module.css';

export default function FutureService({ item }) {
  return (
    <div>
      <div className={css.worksBox}>
        <p className={css.title}>Потрібно:</p>
        <ul className={css.workList}>
          {item.works.map((work, index) => (
            <li key={index} className={css.listItem}>
              <BsCheckLg />
              <p className={css.workName}>{work}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* <div className={css.sumInfoBox}>
        <button className={css.btnCount}>
          <BsCreditCard className={css.cardIcon} />
          <p className={css.text}>Розрахувати</p>
        </button>

        <div className={css.sumBox}>
          <BsReceipt className={css.receiptIcon} />
          <p className={css.sum}> --- грн</p>
        </div>
      </div> */}

      <CreateARecord />
    </div>
  );
}
