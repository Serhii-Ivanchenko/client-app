import { IoIosCheckmarkCircle } from 'react-icons/io';
import { SlSpeedometer } from 'react-icons/sl';
import ServiceInfoDone from './ServiceInfoDone/ServiceInfoDone';
import FutureService from './FutureService/FutureService';
import css from './ListOfServices.module.css';
import { useEffect, useRef, useState } from 'react';
import { useSwipeable } from 'react-swipeable';

export default function ListOfServices({ services }) {
  const [activeService, setActiveService] = useState(1);
  const activeServiceContent = services.find(item => item.id === activeService);
  const serviceIds = services.map(service => service.id);
  const currentIndex = serviceIds.indexOf(activeService);
  const itemRefs = useRef([]);

  // console.log('currentIndex', currentIndex);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      const next = serviceIds[currentIndex + 1];
      if (next) setActiveService(next);
    },
    onSwipedRight: () => {
      const prev = serviceIds[currentIndex - 1];
      if (prev) setActiveService(prev);
    },
    trackTouch: true,
    trackMouse: false,
    preventScrollOnSwipe: true,
  });

  useEffect(() => {
    const index = services.findIndex(item => item.id === activeService);
    if (itemRefs.current[index]) {
      itemRefs.current[index].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeService, services]);

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
            ref={el => (itemRefs.current[index] = el)}
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

      <div {...swipeHandlers}>
        {activeServiceContent.status === 'done' ? (
          <ServiceInfoDone item={activeServiceContent} />
        ) : (
          <FutureService item={activeServiceContent} />
        )}
      </div>
    </div>
  );
}
