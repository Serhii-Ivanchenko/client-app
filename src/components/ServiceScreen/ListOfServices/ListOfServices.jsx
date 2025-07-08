import { IoIosCheckmarkCircle } from 'react-icons/io';
import { SlSpeedometer } from 'react-icons/sl';
import ServiceInfoDone from './ServiceInfoDone/ServiceInfoDone';
import FutureService from './FutureService/FutureService';
import css from './ListOfServices.module.css';
import { useState } from 'react';

export default function ListOfServices({ services }) {
  const [activeService, setActiveService] = useState(1);

  const activeServiceContent = services.find(item => item.id === activeService);

  return (
    <div className={css.listWrapper}>
      <ul className={css.list}>
        {services.map((item, index) => (
          <li
            key={index}
            className={`${css.listItem} ${
              activeService === item.id && css.listItemActive
            }`}
            onClick={() => setActiveService(item.id)}
          >
            <IoIosCheckmarkCircle
              className={`${css.checkIcon} ${
                item.status === 'done' ? css.done : css.future
              }`}
            />
            <p className={css.text}>TO</p>
            <SlSpeedometer className={css.speedIcon} />
            <p className={css.mileage}>{item.mileage}</p>
          </li>
        ))}
      </ul>

      {activeServiceContent.status === 'done' ? (
        <ServiceInfoDone item={activeServiceContent} />
      ) : (
        <FutureService item={activeServiceContent} />
      )}
    </div>
  );
}
