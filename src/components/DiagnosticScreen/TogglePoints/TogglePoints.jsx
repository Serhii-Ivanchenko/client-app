import css from './TogglePoints.module.css';

export default function TogglePoints({
  togglePoints,
  handleCheckboxChange,
  chosenPoints,
}) {
  return (
    <>
      <ul className={css.list}>
        {togglePoints?.map((point, index) => (
          <li className={css.listItem} key={index}>
            <p className={css.label}>{point.name}</p>
            <label className={css.toggleSwitch}>
              <input
                type="checkbox"
                checked={chosenPoints.some(p => p.id === point.id)}
                onChange={e => handleCheckboxChange(e, point.id, point.name)}
                //   disabled={disabled}
              />
              <span className={`${css.slider}`}></span>
            </label>
          </li>
        ))}
      </ul>
    </>
  );
}
