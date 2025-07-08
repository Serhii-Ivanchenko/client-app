import { BsCheckLg } from 'react-icons/bs';
import { BsReceipt } from 'react-icons/bs';
import { BsFillCameraFill } from 'react-icons/bs';

export default function ServiceInfoDone({ item }) {
  return (
    <div>
      <div>
        <p>Виконано:</p>
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
        <BsReceipt />
        <p> {item.sum} грн</p>
      </div>

      <div>
        <p>Фото поломки /документу</p>
        <div>
          <button type="button">
            <BsFillCameraFill />
          </button>
        </div>
      </div>
    </div>
  );
}
