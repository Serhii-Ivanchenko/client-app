import { IoIosCheckmarkCircle } from 'react-icons/io';
import { SlSpeedometer } from 'react-icons/sl';
import ServiceInfoDone from './ServiceInfoDone/ServiceInfoDone';
import FutureService from './FutureService/FutureService';

export default function ListOfServices({ services }) {
  return (
    <div>
      <ul>
        {services.map((item, index) => (
          <li key={index}>
            <div>
              <IoIosCheckmarkCircle />
              <p>TO</p>
              <SlSpeedometer />
              <p>{item.mileage}</p>
            </div>

            {item.status === 'done' ? (
              <ServiceInfoDone item={item} />
            ) : (
              <FutureService item={item} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
