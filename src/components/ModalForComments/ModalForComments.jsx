import { useEffect, useRef } from 'react';
import css from './ModalForComments.module.css';

export default function ModalForComments({
  onClose,
  setComment,
  comment,
  checkComment,
  setCommentsList,
  repair,
  commentsList,
}) {
  const focusRef = useRef(null);

  useEffect(() => {
    if (focusRef && focusRef.current && !comment) {
      focusRef.current.focus();
    }
  });

  const hanleAddComment = e => {
    setComment(e.target.value);
  };

  return (
    <div className={css.wrapper}>
      <p className={css.title}>
        {repair && commentsList.length > 1 ? 'Коментарі' : 'Коментар'}
      </p>
      {repair && checkComment ? (
        <ul className={css.list}>
          {commentsList?.map((item, index) => (
            <li key={index} className={css.listItem}>
              <p className={css.comment}>{item}</p>
            </li>
          ))}
        </ul>
      ) : (
        <textarea
          className={css.textarea}
          onChange={hanleAddComment}
          value={comment}
          ref={focusRef}
        />
      )}

      <div className={css.btnBox}>
        <button
          type="button"
          className={css.cancel}
          onClick={() => {
            onClose();
            // if (!checkComment) {
            //   setComment('');
            // }
          }}
        >
          Закрити
        </button>
        {!checkComment && (
          <button
            type="button"
            className={css.confirm}
            onClick={() => {
              if (repair) {
                setCommentsList(prev => [...prev, comment]);
                setComment('');
              }
              onClose();
            }}
          >
            Підтвердити
          </button>
        )}
      </div>
    </div>
  );
}
