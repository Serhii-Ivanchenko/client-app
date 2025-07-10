import css from './RepairPage.module.css';
import { IoCarSport, IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { SlSpeedometer } from 'react-icons/sl';
import { FaCircleCheck } from 'react-icons/fa6';
import { BsReceipt, BsCheckLg } from 'react-icons/bs';
import { IoClose } from "react-icons/io5";
import carImg from '../../assets/images/autoPhoto.webp';
import { useState } from 'react';
import Chat from '../../components/Chat/Chat';

const doneTasks = [
  'Ремень поликлиновый',
  'Насос системи охолодження',
  'Термостат',
  'Колодки гальмівні',
];

const photoList = [carImg, carImg, carImg];

export default function RepairPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
  };

  return (
    <div className={css.wrapper}>
      <div className={css.container}>
        <div className={css.bottomContainer}>
          <div className={css.firstContainer}>
            <div className={css.carInfo}>
              <IoCarSport className={css.iconCar} />
              <p className={css.carModel}>Audi A6</p>
            </div>
            <div className={css.millageInfo}>
              <SlSpeedometer className={css.speedIcon} />
              <p className={css.millageText}>261 000 км</p>
            </div>
          </div>

          <div className={css.secondContainer}>
            <FaCircleCheck className={css.iconCheck} />
            <p className={css.TOText}>TO</p>
            <SlSpeedometer className={css.speedIconSecond} />
            <p className={css.millage}>260 000</p>
          </div>

          <div className={css.thirdContainer}>
            <p className={css.list}>Виконано:</p>
            <ul className={css.doneList}>
              {doneTasks.map((task, idx) => (
                <li key={idx} className={css.doneItem}>
                  <input type="checkbox" />
                  <span className={css.list}>{task}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={css.fourContainer}>
            <div className={css.totalSum}>
              <BsReceipt size={18} />
              <p className={css.totalText}>10 150 грн</p>
            </div>
            <div className={css.invoices}>
              <BsReceipt className={css.receiptIcon} />
              <p>Накладна</p>
            </div>
          </div>

          <div className={css.fiveContainer}>
            <h2 className={css.title}>Фото поломки /документу</h2>
            <div className={css.photoGrid}>
              {photoList.map((url, idx) => (
                <div key={idx} className={css.photoItem}>
                  <img
                    src={url}
                    alt={`Фото ${idx + 1}`}
                    className={css.photo}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className={css.btnContainer}>
            <button className={css.acceptBtn}>
              <BsCheckLg />
              <span>Підтвердити</span>
            </button>
            <button className={css.rejectBtn}>Відхилити</button>
          </div>
        </div>
      </div>
      <div className={css.chatContainer}>
        {!isChatOpen && (
          <button className={css.chatToggleBtn} onClick={toggleChat}>
             <IoChatbubbleEllipsesOutline size={26} />
          </button>
        )}

        <div className={`${css.chatBox} ${isChatOpen ? css.chatOpen : ''}`}>
          <button className={css.chatCloseBtn} onClick={toggleChat}>
            <IoClose />
          </button>
          <Chat/>
        </div>
      </div>
    </div>
  );
}
