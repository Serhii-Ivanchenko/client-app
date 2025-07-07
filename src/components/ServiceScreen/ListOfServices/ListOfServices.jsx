import { IoIosCheckmarkCircle } from 'react-icons/io';
import { SlSpeedometer } from 'react-icons/sl';

export default function ListOfServices({ services }) {
  return (
    <div>
      <ul>
        {services.map((item, index) => (
          <li key={index}>
            <IoIosCheckmarkCircle />
            <p>TO</p>
            <SlSpeedometer />
            <p>{item.mileage}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
