import { Link } from 'react-router-dom';
import css from './CarsInWorkOrDoneList.module.css';
import { BsPatchExclamationFill } from 'react-icons/bs';
import { BsCheckCircleFill } from 'react-icons/bs';

export default function CarsInWorkOrDoneList({ done, list }) {
  const checkTime = (time, dayOfRecord) => {
    if (!time) {
      return;
    }
    const currentTime = new Date();
    const timeOfRecord = time;

    const [hours, minutes] = timeOfRecord.split(':').map(Number);
    const dateOfRecord = new Date(dayOfRecord);
    dateOfRecord.setHours(hours, minutes, 0, 0);

    // console.log(
    //   'dateOfRecord > currentTime',
    //   new Date(dateOfRecord) > new Date(currentTime)
    // );
    // console.log('dateOfRecord', new Date(dateOfRecord));
    // console.log('currentTime', new Date(currentTime));

    return new Date(dateOfRecord) > new Date(currentTime);
  };

  return (
    <>
      <ul className={`${css.list} ${done ? css.listDone : ''}`}>
        {list?.length === 0 ? (
          <p className={css.noRecords}>
            {done ? 'Готові авто відсутні' : 'Записи відсутні'}
          </p>
        ) : (
          list?.map((item, index) => (
            <li
              key={index}
              // onClick={() => setDiagOpen(true)}
              // className={css.listItem}
            >
              <Link
                to={
                  item?.diagnostic_id
                    ? `/car/${item.car_id}/completed-doc`
                    : `/car/${item.car_id}/update-car`
                  // item?.status === 'diagnostic'
                  // ? `/car/${item.car_id}/diagnostics`
                  // : item?.status === 'repair'
                  // ? `/car/${item.car_id}/repair`
                  // : ''
                }
                // to={`/car/${item.car_id}/update-car`}
              >
                <div className={css.listItem}>
                  {done ? (
                    <span className={css.iconBox}>
                      <BsPatchExclamationFill className={css.icon} />
                    </span>
                  ) : !checkTime(item?.time_rec || item.time, item?.date) ? (
                    <span className={css.iconBox}>
                      <BsPatchExclamationFill
                        className={`${css.icon} ${css.iconRed}`}
                      />
                    </span>
                  ) : (
                    <p className={css.time}>{item?.time_rec || item.time}</p>
                  )}
                  <div
                    className={`${css.stick} ${done ? css.stickDone : ''} ${
                      item?.status === 'diagnostic'
                        ? css.stickDiag
                        : item?.status === 'repair'
                        ? css.stickRepair
                        : ''
                    }`}
                  ></div>
                  <div className={css.carWrapper}>
                    <p className={css.car}>
                      {item.make && item.model
                        ? `${`${item?.make} ${item?.model}`}`
                        : item.carModel}
                    </p>
                    <div className={css.problemAndSpares}>
                      <p className={css.problem}>{item.problem}</p>
                      {item.sparesStatus ? (
                        <BsCheckCircleFill
                          className={`${css.iconTick} ${
                            item.sparesStatus === 'received' && css.iconTickOK
                          } ${
                            item.sparesStatus === 'ordered' && css.iconTickWait
                          }`}
                        />
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                  <p className={`${css.salary} ${done ? css.salaryDone : ''}`}>
                    {Math.trunc(item.total_work_earnings)}
                  </p>
                </div>
              </Link>
            </li>
          ))
        )}
      </ul>
    </>
  );
}
