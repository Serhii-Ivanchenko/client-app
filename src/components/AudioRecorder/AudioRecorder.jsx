import { BsRecordCircle } from 'react-icons/bs';
import { BsFillMicFill } from 'react-icons/bs';
import { BsFillDoorOpenFill } from 'react-icons/bs';
import { GiSoundWaves } from 'react-icons/gi';
import { MdGraphicEq } from 'react-icons/md';
import { FaPlay, FaPause, FaArrowLeft } from 'react-icons/fa';
import { RxCrossCircled } from 'react-icons/rx';
import { BsCheckLg, BsFillStopFill } from 'react-icons/bs';

import css from './AudioRecorder.module.css';
import { useEffect, useRef, useState } from 'react';
import { uploadMedia } from '../../redux/cars/operations';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsConvertingMedia } from '../../redux/cars/selectors';

const convertAudioIntoBase64 = async blob => {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result); // returns "data:audio/webm;base64,..."
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export default function AudioRecorder({
  setRecordAudio,
  audioURL,
  setAudioURL,
  completedDoc,
  setOpenAudio,
  repair,
  diag,
  setAudios,
  modal,
  currentBlob,
  setCurrentBlob,
  setAudioLocalURLs,
  id,
  setCurrentlyPlayingId,
  currentlyPlayingId,
}) {
  const mediaRecorderRef = useRef(null);
  // const [audioURL, setAudioURL] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const audioChunks = useRef([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef(null);
  const audioRef = useRef(null);
  const audioRefs = useRef({});
  const streamRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const loader = useSelector(selectIsConvertingMedia);

  // console.log('audioUrl', audioURL);

  const playAudio = modal ? currentlyPlayingId === id : isPlaying;

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);

      audioChunks.current = [];

      mediaRecorderRef.current.ondataavailable = e => {
        audioChunks.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        if (diag) {
          setAudioURL(url);
        }
        if (repair) {
          setCurrentBlob(blob);
        }

        const arrayBuffer = await blob.arrayBuffer();
        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        const duration = audioBuffer.duration;
        setDuration(formatTime(duration));

        // if (timerRef.current) {
        //   clearInterval(timerRef.current);
        // }

        if (repair) {
          const base64Audio = await convertAudioIntoBase64(blob);

          const media = {
            media_type: 'audios',
            files_base64: [base64Audio],
          };
          console.log('media', media);

          const data = await dispatch(uploadMedia(media)).unwrap();
          setAudioURL(data?.urls[0]);
          console.log('data', data);
          console.log('audio', data?.urls[0]);
        }

        //   timerRef.current = setInterval(() => {
        //     setRecordingTime(prev => prev + 1);
        //   }, 1000);
        //   setRecordingTime(0);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Не вдалося отримати доступ до мікрофона:', err);
    }
  };

  const stopRecording = async () => {
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach(track => track.stop());
    setRecordingTime(0);
    clearInterval(timerRef.current);
    timerRef.current = null;
    setIsRecording(false);
  };

  const formatTime = time => {
    const mins = Math.floor(time / 60)
      .toString()
      .padStart(2, '0');
    const secs = Math.floor(time % 60)
      .toString()
      .padStart(2, '0');
    // console.log('secs', secs);

    return `${mins}:${secs}`;
  };

  useEffect(() => {
    if (!modal) return;

    const audio = audioRefs.current[id];
    if (!audio) return;

    if (currentlyPlayingId === id) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          setTimeout(() => {
            audio.play();
          }, 200);
        });
      }
    } else {
      if (!audio.paused) audio.pause();
    }
  }, [currentlyPlayingId, id, modal]);

  const togglePlay = () => {
    if (!modal) {
      const audio = audioRef.current;
      if (!audio) return;

      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        // Якщо audio ще не готовий, спробуємо зачекати трохи
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch(() => {
              // якщо не спрацювало, спробуємо через timeout
              setTimeout(() => {
                audio.play().then(() => setIsPlaying(true));
              }, 200);
            });
        } else {
          setIsPlaying(true);
        }
      }
    } else {
      // Для модалки
      if (currentlyPlayingId === id) {
        setCurrentlyPlayingId(null);
      } else {
        setCurrentlyPlayingId(id);
      }
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  // const handleLoadedMetadata = () => {
  //   if (completedDoc) {
  //     const audioElement = audioRef.current;
  //     console.log('readyState:', audioElement.readyState); // Чи повністю готове
  //     const seconds = audioElement?.duration;
  //     console.log('seconds loaded:', seconds);
  //     if (seconds && isFinite(seconds)) {
  //       setDuration(formatTime(seconds));
  //     } else {
  //       console.warn('Duration not available yet');
  //     }
  //   }
  // };

  useEffect(() => {
    if (audioURL) {
      const loadAudioDuration = async () => {
        setIsLoading(true);

        try {
          const response = await fetch(audioURL);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const blob = await response.blob();
          const arrayBuffer = await blob.arrayBuffer();

          // Використовуємо AudioContext для декодування
          const audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

          const duration = audioBuffer.duration;
          console.log('MP3 Duration from decodeAudioData:', duration);

          if (isFinite(duration)) {
            setDuration(formatTime(duration));
          } else {
            console.warn('Duration not available yet');
          }
        } catch (err) {
          console.error('Error loading audio duration:', err);
        } finally {
          setIsLoading(false);
        }
      };

      loadAudioDuration();
    }
  }, [audioURL, completedDoc]);
  // console.log('duration', duration);
  // console.log('seconds', audioRef?.current?.duration);

  useEffect(() => {
    const audio = modal ? audioRefs.current[id] : audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener('timeupdate', updateTime);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
    };
  }, [modal, currentlyPlayingId, id, isPlaying]);

  return (
    <div className={`${css.wrapper} ${modal && css.wrapperModal}`}>
      <div className={css.player}>
        {loader && !audioURL ? (
          'Зачекайте...'
        ) : !audioURL ? (
          <>
            {' '}
            <p>{formatTime(recordingTime)}</p>
            {isRecording ? (
              <div className={css.soundBox}>
                <GiSoundWaves size={50} className={css.sound} />
                <GiSoundWaves size={50} className={css.sound} />
                {/* <MdGraphicEq size={30} /> */}
              </div>
            ) : (
              ''
            )}
            <button
              className={`${css.microBtn} ${isRecording ? css.active : ''}`}
              onClick={isRecording ? stopRecording : startRecording}
            >
              {isRecording ? (
                <BsFillStopFill className={css.icon} />
              ) : (
                <BsFillMicFill className={css.icon} />
              )}
              {/* <BsFillMicFill className={css.icon} /> */}
            </button>
          </>
        ) : (
          <>
            {isLoading || loader ? (
              'Зачекайте...'
            ) : (
              <>
                {' '}
                <button className={css.playBtn} onClick={togglePlay}>
                  {playAudio ? (
                    <FaPause size={24} className={css.playerBtn} />
                  ) : (
                    <FaPlay size={24} className={css.playerBtn} />
                  )}
                </button>
                <audio
                  src={audioURL}
                  ref={el => {
                    if (modal) audioRefs.current[id] = el;
                    else audioRef.current = el;
                  }}
                  // onLoadedMetadata={handleLoadedMetadata}
                  onEnded={() => {
                    setCurrentTime(0);
                    if (modal) {
                      setCurrentlyPlayingId(null);
                    } else {
                      setIsPlaying(false);
                    }
                  }}
                />
                <p>
                  {formatTime(currentTime)} / {duration}
                </p>
                {!completedDoc && (
                  <RxCrossCircled
                    size={24}
                    className={css.iconCross}
                    onClick={() => {
                      // if (repair) {
                      //   setAudioURL([]);
                      // } else {
                      setAudioURL(null);
                      // }
                      setDuration(null);
                      setCurrentTime(0);
                      // setRecordingTime(0);
                      // setRecordAudio(false);
                      setIsPlaying(false);
                    }}
                  />
                )}{' '}
              </>
            )}
          </>
        )}
      </div>
      {modal ? (
        ''
      ) : (
        <div className={css.btnBox}>
          {audioURL && !completedDoc ? (
            <button
              className={css.btnCheck}
              onClick={() => {
                setRecordAudio(false);
                if (repair) {
                  setAudios(prev => [...prev, currentBlob]);
                  setAudioLocalURLs(prev => [...prev, audioURL]);
                  setAudioURL(null);
                }
              }}
            >
              <BsCheckLg className={css.iconCheck} />
            </button>
          ) : (
            // <button className={css.btn} onClick={() => setRecordAudio(false)}>
            //   <BsFillDoorOpenFill className={css.iconDoor} />
            // </button>
            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                if (completedDoc) {
                  setOpenAudio(false);
                } else {
                  setRecordAudio(false);
                }
              }}
              className={css.cancel}
            >
              <FaArrowLeft />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
