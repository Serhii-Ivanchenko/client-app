import css from './PartsForRepair.module.css';
import { BsWrench } from 'react-icons/bs';
import { BsFillMicFill } from 'react-icons/bs';
import { BsCameraFill } from 'react-icons/bs';
import { BiSolidMessageDetail } from 'react-icons/bi';

export default function PartsForRepair({
  statusParts,
  setStatusParts,
  statusServices,
  setStatusServices,
  completedRepair,
  photosFromRepair,
  audioURL,
  repair,
  setCheckPhotos,
  setCheckComment,
  setModalWithRecordings,
  comment,
  commentsList,
}) {
  const handleChangeStatus = id => {
    setStatusParts(prev =>
      prev?.map(part =>
        part?.id === id
          ? { ...part, status_repair: part?.status_repair === 0 ? 1 : 0 }
          : part
      )
    );
  };

  const handleChangeStatusService = id => {
    setStatusServices(prev =>
      prev?.map(service =>
        service?.id === id
          ? { ...service, status_repair: service?.status_repair === 0 ? 1 : 0 }
          : service
      )
    );
  };

  return (
    <div className={css.wrapper}>
      {statusParts?.length > 0 && (
        <>
          {' '}
          <div className={css.titleBox}>
            <p className={css.title}>Запчастини</p>
            {statusParts?.length > 0 && (
              <div className={css.btnBoxCompleted}>
                <div
                  className={`${css.circle} ${audioURL && css.circleFilled}`}
                  onClick={() => setModalWithRecordings(true)}
                >
                  <BsFillMicFill className={css.iconMedia} />
                </div>
                <div
                  className={`${css.circle} ${
                    (repair?.photos?.length > 0 ||
                      photosFromRepair?.length > 0) &&
                    css.circleFilled
                  }`}
                  onClick={() => setCheckPhotos(true)}
                >
                  <BsCameraFill className={css.iconMedia} />
                </div>
                <div
                  className={`${css.circle} ${
                    commentsList?.length > 0 && css.circleFilled
                  }`}
                  onClick={() => {
                    if (commentsList?.length === 0) return;
                    setCheckComment(true);
                  }}
                >
                  <BiSolidMessageDetail className={css.icon} />
                </div>
              </div>
            )}
          </div>
          <ul
            className={`${css.listOfItems} ${css.listParts} ${
              completedRepair && css.listCopmleted
            }`}
          >
            {statusParts?.map((part, index) => (
              <li
                key={index}
                className={`${css.item} ${
                  completedRepair && css.itemCompleted
                }`}
              >
                <p className={css.name}>{part.name}</p>
                {completedRepair ? (
                  <BsWrench
                    size={18}
                    className={`${css.icon} ${
                      part?.status_repair === 1 ? css.iconGreen : css.iconRed
                    }`}
                  />
                ) : (
                  <button
                    type="button"
                    className={`${css.btn} ${
                      part?.status_repair === 1 ? css.btnGreen : ''
                    }`}
                    onClick={() => handleChangeStatus(part?.id)}
                  >
                    <BsWrench size={18} className={css.icon} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      {statusServices?.length > 0 && (
        <>
          {' '}
          <div className={css.titleBox}>
            <p className={css.title}>Послуги</p>
            {statusParts?.length === 0 && (
              <div className={css.btnBoxCompleted}>
                <div
                  className={css.circle}
                  onClick={() => setModalWithRecordings(true)}
                >
                  <BsFillMicFill className={css.iconMedia} />
                </div>
                <div
                  className={`${css.circle} ${
                    (repair?.photos?.length > 0 ||
                      photosFromRepair?.length > 0) &&
                    css.circleFilled
                  }`}
                >
                  <BsCameraFill className={css.iconMedia} />
                </div>
                <div
                  className={`${css.circle} ${
                    repair?.comment && css.circleFilled
                  }`}
                  onClick={() => setCheckComment(true)}
                >
                  <BiSolidMessageDetail className={css.icon} />
                </div>
              </div>
            )}
          </div>
          <ul
            className={`${css.listOfItems} ${
              completedRepair && css.listCopmleted
            }`}
          >
            {statusServices?.map((service, index) => (
              <li
                key={index}
                className={`${css.item} ${
                  completedRepair && css.itemCompleted
                }`}
              >
                <p className={css.name}>{service.name}</p>
                {completedRepair ? (
                  <BsWrench
                    size={18}
                    className={`${css.icon} ${
                      service?.status_repair === 1 ? css.iconGreen : css.iconRed
                    }`}
                  />
                ) : (
                  <button
                    type="button"
                    className={`${css.btn} ${
                      service?.status_repair === 1 ? css.btnGreen : ''
                    }`}
                    onClick={() => handleChangeStatusService(service?.id)}
                  >
                    <BsWrench size={18} className={css.icon} />
                  </button>
                )}{' '}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
