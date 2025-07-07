import { BsCheckLg } from 'react-icons/bs';
import { BsFillMicFill } from 'react-icons/bs';
import { BsCameraFill } from 'react-icons/bs';
import css from './SavedSparesPart.module.css';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { BsWrench } from 'react-icons/bs';
import { BsFillCaretDownFill } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { createDiagnostic } from '../../../redux/cars/operations';
import { useState } from 'react';
import { BiSolidMessageDetail } from 'react-icons/bi';

export default function SavedSparesPart({
  nodes,
  completed,
  audioURL,
  photosFromDiag,
  completedDiag,
  setOpenAudio,
  setOpenPhotos,
  setCheckComment,
  comment,
}) {
  const [expandedMap, setExpandedMap] = useState({});

  const handleAccordionToggle = (categoryId, nodeId) => (event, isExpanded) => {
    setExpandedMap(prev => ({
      ...prev,
      [categoryId]: isExpanded ? nodeId : null,
    }));

    // setOpenDetails(isExpanded ? nodeId : null);
    // setCategoryForDetailsPart(isExpanded ? name : '');
  };

  console.log('completedDiag', completedDiag);

  return (
    <>
      {completed && (
        <div className={css.btnBoxCompleted}>
          <div
            className={`${css.circle} ${
              completedDiag?.audio_files?.length > 0 && css.circleFilled
            }`}
            onClick={() => {
              if (completedDiag?.audio_files?.length === 0) return;
              setOpenAudio(true);
            }}
          >
            <BsFillMicFill className={css.icon} />
          </div>
          <div
            className={`${css.circle} ${
              completedDiag?.photo_files?.length > 0 && css.circleFilled
            }`}
            onClick={() => {
              if (completedDiag?.photo_files?.length === 0) return;
              setOpenPhotos(true);
              setOpenAudio(false);
            }}
          >
            <BsCameraFill className={css.icon} />
          </div>
          <div
            className={`${css.circle} ${
              completedDiag?.general_comment && css.circleFilled
            }`}
            onClick={() => setCheckComment(true)}
          >
            <BiSolidMessageDetail className={css.icon} />
          </div>
        </div>
      )}
      <ul className={css.SavedSparesList}>
        {nodes?.length === 0 ? (
          <p className={css.noProblems}>
            Після проведення діагностики проблем з автомобілем не виявлено
          </p>
        ) : completed ? (
          nodes?.map((item, index) => (
            <li key={index} className={css.item}>
              <Accordion
                className={css.accordion}
                expanded={expandedMap[item.id] === item.id}
                onChange={handleAccordionToggle(item.id, item.id)}
              >
                <AccordionSummary
                  className={css.subcatListItem}
                  sx={{
                    // position:
                    //   expandedMap[node.id] === node.id
                    //     ? 'sticky'
                    //     : 'static',
                    // top: '27px',
                    // overflowAnchor: 'none',
                    '&.Mui-expanded': { minHeight: 'unset' },
                    minHeight: 'unset',
                  }}
                  // ref={el => {
                  //   if (el) summaryRefs.current[item.id] = el;
                  // }}
                >
                  <p className={css.subcatName}>{item.node_name}</p>
                  <div className={css.btnBox}>
                    {/* <div
                      className={`${css.circle} ${
                        item?.parts?.length > 0 ||
                        item?.subNode?.every(part => part?.parts?.length > 0)
                          ? css.circleFilled
                          : ''
                      }`}
                    >
                      <BsCheckLg className={css.iconCheck} />
                    </div>
                    <div className={css.circle}>
                      <BsFillMicFill className={css.icon} />
                    </div>
                    <div className={css.circle}>
                      <BsCameraFill className={css.icon} />
                    </div> */}
                    <BsFillCaretDownFill
                      className={`${css.icon} ${
                        expandedMap[item.id] === item.id ? css.rotated : ''
                      }`}
                    />
                  </div>
                </AccordionSummary>
                <AccordionDetails
                  className={css.details}
                  sx={{ width: '340px' }}
                >
                  <ul className={css.sparesList}>
                    {item?.parts
                      ? item?.parts?.map((part, index) => (
                          <li key={index} className={css.sparesListItem}>
                            <p className={css.sparesNames}>{part?.part_name}</p>
                            <BsWrench className={css.iconWrench} />
                          </li>
                        ))
                      : item?.subNode?.flatMap(part =>
                          part?.parts.map(item => (
                            <li key={item.id} className={css.sparesListItem}>
                              <p className={css.sparesNames}>
                                {item?.part_name}
                              </p>
                              <BsWrench className={css.iconWrench} />
                            </li>
                          ))
                        )}
                  </ul>
                </AccordionDetails>
              </Accordion>
            </li>
          ))
        ) : (
          nodes?.map((node, index) => (
            <li key={index}>
              <div className={css.itemSaved}>
                <p className={css.nodeName}>{node.node_name}</p>
                {index === 0 && (
                  <div className={css.btnBox}>
                    <div
                      className={`${css.circle} ${
                        audioURL && css.circleFilled
                      }`}
                      onClick={() => setOpenAudio(true)}
                    >
                      <BsFillMicFill className={css.icon} />
                    </div>
                    <div
                      className={`${css.circle} ${
                        photosFromDiag?.length > 0 && css.circleFilled
                      }`}
                      onClick={() => {
                        setOpenPhotos(true);
                        setOpenAudio(false);
                      }}
                    >
                      <BsCameraFill className={css.icon} />
                    </div>
                    <div
                      className={`${css.circle} ${comment && css.circleFilled}`}
                      onClick={() => setCheckComment(true)}
                    >
                      <BiSolidMessageDetail className={css.icon} />
                    </div>
                  </div>
                )}
              </div>
              <ul className={css.subcatList}>
                {node.node_subcat.map((item, index) => (
                  <li key={index} className={css.item}>
                    <Accordion
                      className={css.accordion}
                      expanded={expandedMap[item.id] === item.id}
                      onChange={handleAccordionToggle(item.id, item.id)}
                    >
                      <AccordionSummary
                        className={css.subcatListItem}
                        sx={{
                          // position:
                          //   expandedMap[node.id] === node.id
                          //     ? 'sticky'
                          //     : 'static',
                          // top: '27px',
                          // overflowAnchor: 'none',
                          '&.Mui-expanded': { minHeight: 'unset' },
                          minHeight: 'unset',
                        }}
                        // ref={el => {
                        //   if (el) summaryRefs.current[item.id] = el;
                        // }}
                      >
                        <p className={css.subcatName}>{item.name}</p>
                        <div className={css.btnBox}>
                          <div
                            className={`${css.circle} ${
                              item?.parts?.length > 0 ||
                              item?.subNode?.every(
                                part => part?.parts?.length > 0
                              )
                                ? css.circleFilled
                                : ''
                            }`}
                          >
                            <BsCheckLg className={css.iconCheck} />
                          </div>
                          {/* <div className={css.circle}>
                            <BsFillMicFill className={css.icon} />
                          </div>
                          <div className={css.circle}>
                            <BsCameraFill className={css.icon} />
                          </div> */}
                          <BsFillCaretDownFill
                            className={`${css.icon} ${
                              expandedMap[item.id] === item.id
                                ? css.rotated
                                : ''
                            }`}
                          />
                        </div>
                      </AccordionSummary>
                      <AccordionDetails
                        className={css.details}
                        sx={{ width: '340px' }}
                      >
                        <ul className={css.sparesList}>
                          {item?.parts
                            ? item?.parts?.map((part, index) => (
                                <li key={index} className={css.sparesListItem}>
                                  <p className={css.sparesNames}>
                                    {part?.part_name}
                                  </p>
                                  <BsWrench className={css.iconWrench} />
                                </li>
                              ))
                            : item?.subNode?.flatMap(part =>
                                part?.parts.map(item => (
                                  <li
                                    key={item.id}
                                    className={css.sparesListItem}
                                  >
                                    <p className={css.sparesNames}>
                                      {item?.part_name}
                                    </p>
                                    <BsWrench className={css.iconWrench} />
                                  </li>
                                ))
                              )}
                        </ul>
                      </AccordionDetails>
                    </Accordion>
                  </li>
                ))}
              </ul>
            </li>
          ))
        )}
      </ul>
    </>
  );
}
