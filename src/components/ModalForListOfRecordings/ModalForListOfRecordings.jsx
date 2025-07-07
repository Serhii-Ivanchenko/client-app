import { useState } from 'react';
import AudioRecorder from '../AudioRecorder/AudioRecorder';
import css from './ModalForListOfRecordings.module.css';
import { FaArrowLeft } from 'react-icons/fa';

export default function ModalForListOfRecordings({ audios, onClose }) {
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState(null);

  return (
    <div className={css.wrapper}>
      <ul className={css.list}>
        {audios.map((audio, index) => (
          <li key={index}>
            <AudioRecorder
              completedDoc={true}
              audioURL={audio}
              modal={true}
              id={index}
              currentlyPlayingId={currentlyPlayingId}
              setCurrentlyPlayingId={setCurrentlyPlayingId}
            />
          </li>
        ))}
      </ul>

      <div className={css.btnBox}>
        <button className={css.cancelBtn} onClick={onClose}>
          <FaArrowLeft size={40} className={css.cross} />
        </button>
      </div>
    </div>
  );
}
