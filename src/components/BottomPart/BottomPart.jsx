import { RxCross1 } from 'react-icons/rx';
import { BsCheckLg } from 'react-icons/bs';
import css from './BottomPart.module.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { BsFillMicFill } from 'react-icons/bs';
import { BsCameraFill } from 'react-icons/bs';
import { BiSolidMessageDetail } from 'react-icons/bi';
import { FaArrowLeft } from 'react-icons/fa';
import { FaArrowRight } from 'react-icons/fa';
import { TiHome } from 'react-icons/ti';
import { useDispatch } from 'react-redux';
import { deleteCarInfo } from '../../redux/cars/slice';

export default function BottomPart({
  back,
  next,
  button,
  categ,
  btnToggle,
  buttonSpares,
  chosenPoints,
  savedPartBottom,
  handleCreateDiag,
  savedPartScreen,
  setOpenCamera,
  setRecordAudio,
  repair,
  audioURL,
  photosFromWorksPart,
  setOpenComment,
  comment,
  setOpenPhotoComp,
  diag,
}) {
  const isDisabled = chosenPoints?.length === 0;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onHomeBtnClick = () => {
    dispatch(deleteCarInfo());
    navigate(`/main`);
  };

  return (
    <div
      className={`${css.wrapper} ${savedPartScreen ? css.wrapperSaved : ''}`}
    >
      {button || buttonSpares ? (
        <button
          type="button"
          onClick={back}
          className={`${css.cancel} ${savedPartScreen ? css.savedScreen : ''}`}
        >
          <FaArrowLeft className={css.icon} />
        </button>
      ) : (
        <NavLink to={back} className={css.cancel}>
          <FaArrowLeft className={css.icon} />
        </NavLink>
      )}

      {categ ? (
        <>
          <NavLink to="/main" className={css.home}>
            <TiHome className={css.icon} />
          </NavLink>
          <div
            className={`${css.greyCircle} ${audioURL && css.greenCircle}`}
            onClick={() => setRecordAudio(true)}
          >
            <BsFillMicFill className={css.icon} />
          </div>
          <div
            className={`${css.greyCircle} ${
              !repair && photosFromWorksPart?.length > 0 && css.greenCircle
            }`}
            onClick={() => {
              if (diag && photosFromWorksPart.length > 0) {
                setOpenCamera(false);
              } else {
                setOpenCamera(true);
              }
              setOpenPhotoComp(true);
            }}
          >
            <BsCameraFill className={css.icon} />
          </div>
          <div
            className={`${css.greyCircle} ${comment && css.greenCircle}`}
            onClick={() => setOpenComment(true)}
          >
            <BiSolidMessageDetail className={css.icon} />
          </div>
        </>
      ) : (
        <button className={css.home} onClick={onHomeBtnClick}>
          <TiHome className={css.icon} />
        </button>
      )}
      {/* 
      categ ? (
        <div style={{ width: '41px' }}></div>
      ) : */}
      {button || btnToggle || buttonSpares ? (
        <button
          type="button"
          onClick={savedPartBottom && !repair ? handleCreateDiag : next}
          className={`${css.confirm} ${isDisabled && css.confirmDisabled} ${
            savedPartScreen ? css.savedScreen : ''
          }`}
          disabled={isDisabled}
        >
          {savedPartBottom ? (
            <BsCheckLg className={css.icon} />
          ) : (
            <FaArrowRight className={css.icon} />
          )}
        </button>
      ) : (
        <NavLink to={next} className={css.confirm}>
          <FaArrowRight className={css.icon} />
        </NavLink>
      )}

      {}
    </div>
  );
}
