import { useEffect, useRef } from 'react';
import css from './Filter.module.css';
import { IoIosSearch } from 'react-icons/io';
import { RxCrossCircled } from 'react-icons/rx';

export default function Filter({ filter, setFilter }) {
  const focusRef = useRef();
  const handleChange = e => {
    setFilter(e.target.value);
  };

  // useEffect(() => {
  //   if (focusRef.current) {
  //     focusRef.current.focus();
  //   }
  // }, [filter]);

  return (
    <div className={css.searchBox}>
      <div className={css.circle}>
        <IoIosSearch size={20} />
      </div>
      <input
        className={css.input}
        placeholder="Пошук запчастин"
        onChange={handleChange}
        value={filter}
        ref={focusRef}
      />
      {filter && (
        <RxCrossCircled
          className={css.icon}
          size={30}
          onClick={() => setFilter('')}
        />
      )}
    </div>
  );
}
