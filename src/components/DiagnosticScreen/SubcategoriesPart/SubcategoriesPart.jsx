import React, { useEffect, useMemo, useRef, useState } from 'react';
import css from './SubcategoriesPart.module.css';
import { BsFillCaretDownFill } from 'react-icons/bs';
import SparesPart from '../SparesPart/SparesPart';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';

export default function SubcategoriesPart({
  setCategoryForDetailsPart,
  chosenPoints,
  point,
  togglePoints,
  openDetails,
  setOpenDetails,
  categoryForDetailsPart,
  spares,
  setSpares,
  chosenSpares,
  setChosenSpares,
  repair,
  containerRef,
  filter,
  // visiblePoints,
}) {
  // const matchedPoint = togglePoints?.find(cat => cat.name === point.label);
  // console.log('matchedPoint', matchedPoint);

  const [expandedMap, setExpandedMap] = useState({});

  const summaryRefs = useRef({});

  const scrollTopRef = useRef({}); // Реф для збереження прокрутки кожного акордеону

  const handleAccordionToggle =
    (categoryId, nodeId, name) => (event, isExpanded) => {
      let prevTopInContainer = null;

      // 1. ЗБЕРЕЖЕННЯ ПОЗИЦІЇ summary елемента ВІДНОСНО СКРОЛ-КОНТЕЙНЕРА
      if (!isExpanded && summaryRefs.current[nodeId] && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const summaryRect = summaryRefs.current[nodeId].getBoundingClientRect();
        prevTopInContainer = summaryRect.top - containerRect.top;
      }

      // 2. ЗМІНА СТАНУ АКОРДЕОНА
      setExpandedMap(prev => ({
        ...prev,
        [categoryId]: isExpanded ? nodeId : null,
      }));

      setOpenDetails(isExpanded ? nodeId : null);
      setCategoryForDetailsPart(isExpanded ? name : '');

      // 3. КОМПЕНСАЦІЯ СКРОЛУ ПІСЛЯ ЗАКРИТТЯ
      if (!isExpanded) {
        requestAnimationFrame(() => {
          if (
            summaryRefs.current[nodeId] &&
            containerRef.current &&
            prevTopInContainer !== null
          ) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const summaryRect =
              summaryRefs.current[nodeId].getBoundingClientRect();
            const newTopInContainer = summaryRect.top - containerRect.top;

            const delta = newTopInContainer - prevTopInContainer;

            containerRef.current.scrollTop += delta;
          }
        });
      }
    };

  // console.log("matched", matchedPoint);

  // const showDetails = id => {
  //   setOpenDetails(prevId => (prevId === id ? null : id));
  //   if (openDetails === null) {
  //     return;
  //   }

  //   // Перевіряємо серед підкатегорій
  //   const allNodes = togglePoints.flatMap(cat => cat.nodes || []);
  //   const chosenCategory = allNodes.find(node => node.id === openDetails);

  //   if (chosenCategory) {
  //     setCategoryForDetailsPart(chosenCategory.name);
  //     return;
  //   }

  //   // Якщо не знайдено серед підкатегорій, шукаємо серед головних категорій
  //   const mainCategory = togglePoints.find(cat => cat.id === openDetails);
  //   if (mainCategory) {
  //     setCategoryForDetailsPart(mainCategory.name);
  //   }
  // };

  // useEffect(() => {

  // }, [openDetails, togglePoints, setCategoryForDetailsPart]);

  useEffect(() => {
    // console.log("openDetails", openDetails);
  }, [openDetails]);

  const visiblePoints = point?.nodes?.filter(node => {
    if (node?.nodes) {
      return node.nodes?.some(part =>
        part.spareParts?.some(spare =>
          spare.name.toLowerCase().includes(filter.toLowerCase())
        )
      );
    } else {
      return node.spareParts?.some(spare =>
        spare.name.toLowerCase().includes(filter.toLowerCase())
      );
    }
  });
  // console.log('visiblePoints', visiblePoints);

  return (
    // <ul>
    <li>
      <p className={css.categoryName}>{point.name}</p>

      {visiblePoints?.length > 0 ? (
        <ul className={css.subcategoriesList}>
          {visiblePoints.map(node => (
            <li key={node.id}>
              <Accordion
                className={css.accordion}
                expanded={expandedMap[node.id] === node.id}
                onChange={handleAccordionToggle(node.id, node.id, node.name)}
              >
                <AccordionSummary
                  className={css.subcategoriesListItem}
                  sx={{
                    position:
                      expandedMap[node.id] === node.id ? 'sticky' : 'static',
                    top: '27px',
                    overflowAnchor: 'none',
                    '&.Mui-expanded': { minHeight: 'unset' },
                    minHeight: 'unset',
                  }}
                  ref={el => {
                    if (el) summaryRefs.current[node.id] = el;
                  }}
                >
                  <p className={css.subCategory}>{node.name || 'lala'}</p>
                  <div className={css.divForShadow}>
                    <div className={`${css.iconBox}`}>
                      <BsFillCaretDownFill
                        className={`${css.icon} ${
                          expandedMap[node.id] === node.id ? css.rotated : ''
                        }`}
                      />
                    </div>
                  </div>
                </AccordionSummary>

                {/* {openDetails && ( */}
                <AccordionDetails className={css.details}>
                  <SparesPart
                    title={node.name}
                    togglePoints={togglePoints}
                    setChosenSpares={setChosenSpares}
                    chosenSpares={chosenSpares}
                    spares={spares}
                    setSpares={setSpares}
                    openDetails={openDetails}
                    setOpenDetails={setOpenDetails}
                    // setSavedSparesPartOpen={setSavedSparesPartOpen}
                    setCategoryForDetailsPart={setCategoryForDetailsPart}
                    repair={repair}
                    chosenPoints={chosenPoints}
                    filter={filter}
                  />
                </AccordionDetails>
              </Accordion>
            </li>
          ))}
        </ul>
      ) : (
        <ul className={css.subcategoriesList}>
          <li>
            <Accordion
              className={css.accordion}
              expanded={expandedMap[point.id] === point.id}
              onChange={handleAccordionToggle(point.id, point.id, point.name)}
            >
              <AccordionSummary
                className={css.subcategoriesListItem}
                sx={{
                  position:
                    expandedMap[point.id] === point.id ? 'sticky' : 'static',
                  top: '27px',
                  overflowAnchor: 'none',
                  '&.Mui-expanded': { minHeight: 'unset' },
                  minHeight: 'unset',
                }}
                ref={el => {
                  if (el) summaryRefs.current[point.id] = el;
                }}
              >
                <p className={css.subCategory}>{point.name}</p>
                <div className={css.divForShadow}>
                  <div className={`${css.iconBox} `}>
                    <BsFillCaretDownFill
                      className={`${css.icon} ${
                        expandedMap[point.id] === point.id && css.rotated
                      }`}
                    />
                  </div>
                </div>
              </AccordionSummary>

              <AccordionDetails>
                <SparesPart
                  title={point.name}
                  togglePoints={togglePoints}
                  setChosenSpares={setChosenSpares}
                  chosenSpares={chosenSpares}
                  spares={spares}
                  setSpares={setSpares}
                  openDetails={openDetails}
                  setOpenDetails={setOpenDetails}
                  // setSavedSparesPartOpen={setSavedSparesPartOpen}
                  setCategoryForDetailsPart={setCategoryForDetailsPart}
                  repair={repair}
                  chosenPoints={chosenPoints}
                  filter={filter}
                />
              </AccordionDetails>
            </Accordion>
          </li>
        </ul>
      )}
    </li>
    // </ul>
  );
}
