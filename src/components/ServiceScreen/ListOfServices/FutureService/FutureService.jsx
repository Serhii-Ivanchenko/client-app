import { BsCheckLg } from 'react-icons/bs';
import { BsCreditCard } from 'react-icons/bs';
import { BsReceipt } from 'react-icons/bs';
import CreateARecord from './CreateARecord/CreateARecord';

export default function FutureService({ item }) {
  return (
    <div>
      <div>
        <p>Потрібно:</p>
        <ul>
          {item.works.map((work, index) => (
            <li key={index}>
              <BsCheckLg />
              <p>{work}</p>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <button>
          <BsCreditCard />
          <p>Розрахувати</p>
        </button>

        <div>
          <BsReceipt />
          <p> --- грн</p>
        </div>
      </div>

      <CreateARecord />
    </div>
  );
}
