import { useState } from 'react';
// import { ErrorMessage } from 'formik';
import { BsFillCaretDownFill } from 'react-icons/bs';
// import { IoIosArrowDown } from "react-icons/io";
import clsx from 'clsx';
import css from './Select.module.css';
import { useRef } from 'react';
import { useEffect } from 'react';
import { FaPlus } from 'react-icons/fa6';
// import Modal from '../../Modal/Modal';
// import AddCategoryModal from '../AddCategoryModal/AddCategoryModal';

export default function Select({
  field,
  form,
  array,
  chosenValue,
  setChosenValue,
  isDisabled,
  category,
  defaultValue,
}) {
  const [isOpen, setIsOpen] = useState(false);
  //   const { name } = field;

  const handleOptionClick = option => {
    //   form.setFieldValue(name, option?.value);
    setChosenValue(option?.value);
    setIsOpen(false);
  };

  // const handleBlur = (event) => {
  //   if (!event.currentTarget.contains(event.relatedTarget)) {
  //     setIsOpen(false);
  //   }
  // };

  const wrapperRef = useRef(null);

  const handleClickOutside = event => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={css.selectWrapper} ref={wrapperRef}>
      <div
        className={`${css.inputSelect} ${
          isDisabled && css.inputSelectDisabled
        }`}
        onClick={() => {
          setIsOpen(prev => !prev);
          if (isDisabled) {
            setIsOpen(false);
          }
        }}
      >
        <p
          className={`${css.selectedValue} ${
            isDisabled && css.selectedValueDisabled
          }`}
        >
          {/* {array?.find(option => option?.value === field?.value)?.label ||
            chosenValue} */}
          {chosenValue ? chosenValue : defaultValue}
        </p>
        <div className={css.arrowBox}>
          <BsFillCaretDownFill
            className={clsx(
              css.selectIcon,
              { [css.rotated]: isOpen },
              { [css.selectIconDisabled]: isDisabled }
            )}
          />
        </div>
      </div>
      {isOpen && (
        <div className={css.options}>
          {array?.map(option => (
            <div
              key={option?.value}
              className={`${css.option} ${
                chosenValue
                  ? chosenValue === option.value && css.activeOption
                  : defaultValue === option.value && css.activeOption
              }`}
              onClick={() => handleOptionClick(option)}
            >
              {option?.label}
            </div>
          ))}
          {/* <div
            className={`${css.option} ${css.optionPlus}`}
            onClick={() => {
              setOpenAddModal(true);
              setIsOpen(false);
            }}
          >
            <span className={css.icon}>
              <FaPlus className={css.iconPlus} />
            </span>
          </div> */}
        </div>
      )}
      {/* <ErrorMessage name={name} component="span" className={css.errorMessage} />
      {openAddModal && (
        <Modal isOpen={openAddModal} onClose={() => setOpenAddModal(false)}>
          <AddCategoryModal
            category={category}
            onClose={() => setOpenAddModal(false)}
          />
        </Modal>
      )} */}
    </div>
  );
}
