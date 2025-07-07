import { Fragment, useEffect } from 'react';
import css from './SparesPart.module.css';
import { BsWrench } from 'react-icons/bs';
import { GoDotFill } from 'react-icons/go';
import BottomPart from '../../BottomPart/BottomPart';

export default function SparesPart({
  title,
  togglePoints,
  setChosenSpares,
  spares,
  setSpares,
  openDetails,
  setOpenDetails,
  setSavedSparesPartOpen,
  repair,
  chosenPoints,
  filter,
}) {
  useEffect(() => {
    if (spares.length === 0 && togglePoints.length > 0) {
      setSpares(prevSpares =>
        prevSpares.length > 0
          ? prevSpares
          : togglePoints.map(spare => {
              const updatedSpare = { ...spare };

              // 1-й рівень
              if (updatedSpare.spareParts) {
                updatedSpare.spareParts = updatedSpare.spareParts.map(
                  sparePart =>
                    sparePart.tag === 'one_side'
                      ? {
                          ...sparePart,
                          isChosen: false,
                          categoryId: spare.id,
                        }
                      : {
                          ...sparePart,
                          isChosenLeft: false,
                          isChosenRight: false,
                          categoryId: spare.id,
                        }
                );
              }

              // 2-й рівень
              if (updatedSpare.nodes) {
                updatedSpare.nodes = updatedSpare.nodes.map(node => {
                  const newNode = { ...node };

                  if (newNode.spareParts) {
                    newNode.spareParts = newNode.spareParts.map(sparePart =>
                      sparePart.tag === 'one_side'
                        ? {
                            ...sparePart,
                            isChosen: false,
                            categoryId: spare.id,
                          }
                        : {
                            ...sparePart,
                            isChosenLeft: false,
                            isChosenRight: false,
                            categoryId: spare.id,
                          }
                    );
                  }

                  // 3-й рівень
                  if (newNode.nodes) {
                    newNode.nodes = newNode.nodes.map(subNode => {
                      const newSubNode = { ...subNode };

                      if (newSubNode.spareParts) {
                        newSubNode.spareParts = newSubNode.spareParts.map(
                          sparePart =>
                            sparePart.tag === 'one_side'
                              ? {
                                  ...sparePart,
                                  isChosen: false,
                                  categoryId: spare.id,
                                }
                              : {
                                  ...sparePart,
                                  isChosenLeft: false,
                                  isChosenRight: false,
                                  categoryId: spare.id,
                                }
                        );
                      }

                      return newSubNode;
                    });
                  }

                  return newNode;
                });
              }

              return updatedSpare;
            })
      );
    }
  }, [togglePoints]);

  useEffect(() => {
    setSpares(prev =>
      prev.map(category => {
        const isActive = chosenPoints.some(p => p.id === category.id);

        const resetFlags = part => ({
          ...part,
          isChosen: isActive ? part.isChosen : false,
          isChosenLeft: isActive ? part.isChosenLeft : false,
          isChosenRight: isActive ? part.isChosenRight : false,
        });

        const updateNodeTree = nodes =>
          nodes.map(node => ({
            ...node,
            spareParts: node.spareParts?.map(resetFlags),
            nodes: node.nodes ? updateNodeTree(node.nodes) : [],
          }));

        return {
          ...category,
          spareParts: category.spareParts?.map(resetFlags),
          nodes: category.nodes ? updateNodeTree(category.nodes) : [],
        };
      })
    );
  }, [chosenPoints]);

  const updateNodes = (nodes, id, side) => {
    return nodes.map(node => ({
      ...node,
      nodes: node.nodes ? updateNodes(node.nodes, id, side) : [],
      spareParts: node.spareParts?.map(part =>
        part.id === id ? { ...part, [side]: !part[side] } : part
      ),
    }));
  };

  const toggleSpareSelection = (id, side) => {
    setSpares(prevSpares =>
      prevSpares.map(category => ({
        ...category,
        spareParts: category.spareParts?.map(part =>
          part.id === id ? { ...part, [side]: !part[side] } : part
        ),
        nodes: category.nodes ? updateNodes(category.nodes, id, side) : [],
      }))
    );
  };

  const getSelectedSpares = nodes => {
    return nodes.flatMap(node => [
      ...getSelectedSpares(node.nodes || []), // Рекурсія для вкладених nodes
      ...(node.spareParts?.flatMap(part => {
        const selected = [];
        if (part.isChosenLeft) selected.push({ ...part, side: 'left' });
        if (part.isChosenRight) selected.push({ ...part, side: 'right' });
        if (part.isChosen) selected.push(part);
        return selected;
      }) || []),
    ]);
  };

  useEffect(() => {
    const selectedSpares = spares.flatMap(category => [
      ...getSelectedSpares(category.nodes || []),
      ...(category.spareParts?.flatMap(part => {
        const selected = [];
        if (part.isChosenLeft) selected.push({ ...part, side: 'left' });
        if (part.isChosenRight) selected.push({ ...part, side: 'right' });
        if (part.isChosen) selected.push(part);
        return selected;
      }) || []),
    ]);

    setChosenSpares(selectedSpares);
  }, [spares, setChosenSpares]);

  const visibleSpares = spares.map(category => ({
    ...category,
    nodes: category.nodes?.length
      ? category.nodes.map(node => ({
          ...node,
          nodes: node.nodes?.length
            ? node.nodes
                .filter(part =>
                  part.spareParts?.some(spare =>
                    spare.name.toLowerCase().includes(filter.toLowerCase())
                  )
                )
                .map(part => ({
                  ...part,
                  spareParts:
                    part.spareParts?.filter(spare =>
                      spare.name.toLowerCase().includes(filter.toLowerCase())
                    ) || [],
                }))
            : [], // Якщо немає дочірніх частин, повертаємо порожній масив
          spareParts:
            node.spareParts?.filter(spare =>
              spare.name.toLowerCase().includes(filter.toLowerCase())
            ) || [], // Фільтруємо spareParts для node
        }))
      : [],

    spareParts: !category.nodes?.length
      ? category.spareParts?.filter(spare =>
          spare.name.toLowerCase().includes(filter.toLowerCase())
        ) || [] // Фільтруємо spareParts для category
      : [],
  }));

  // const visibleSubcategories = visibleSpares.map(cat => ({
  //   ...cat,
  //   nodes: cat.nodes.map(node => ({
  //     ...node,
  //     nodes: node.nodes.filter(item =>
  //       item.spareParts.some(spare =>
  //         spare.name.toLowerCase().includes(filter.toLowerCase())
  //       )
  //     ),
  //   })),
  // }));

  return (
    <div className={`${css.wrapper} ${openDetails && css.wrapperIsOpen}`}>
      {/* <div className={css.title}>
        <p
          className={`${css.name}
         `}
        >
          {title}
        </p>
       
      </div> */}

      <ul className={css.detailsList}>
        {visibleSpares?.flatMap(cat =>
          cat.nodes?.length > 0
            ? cat.nodes.map((node, nodeIndex) =>
                node.name === title ? (
                  <Fragment key={nodeIndex}>
                    {node?.nodes?.length > 0 ? (
                      <>
                        <ul>
                          {node?.nodes.map((subNode, subNodeIndex) => (
                            <Fragment key={subNodeIndex}>
                              <div className={`${css.title} ${css.subTitle}`}>
                                <GoDotFill size={18} className={css.icon} />
                                <p
                                  className={`${css.name} ${css.onlyName} ${css.subTName}`}
                                >
                                  {subNode?.name}
                                </p>
                                <GoDotFill size={18} className={css.icon} />
                              </div>
                              {subNode.spareParts?.map((part, index) => {
                                const twoBtns = part.tag === 'two_side';
                                return (
                                  <li
                                    className={`${css.detailsItem} ${
                                      !twoBtns &&
                                      css.detailsItemFotItemWithOneBtn
                                    } ${
                                      node.spareParts?.length === 1 &&
                                      css.detailsItemOne
                                    }`}
                                    key={index}
                                  >
                                    <p
                                      className={`${css.subcategoryName} ${
                                        !twoBtns &&
                                        css.subcategoryNameWithOneBtn
                                      }`}
                                    >
                                      {part.name}
                                    </p>

                                    <div
                                      className={`${css.buttons} ${
                                        !twoBtns && css.btnAlone
                                      }`}
                                    >
                                      {twoBtns ? (
                                        <>
                                          <button
                                            type="button"
                                            className={`${css.btn} ${
                                              part.isChosenLeft
                                                ? repair
                                                  ? css.btnGreen
                                                  : css.btnRed
                                                : ''
                                            }`}
                                            onClick={() =>
                                              toggleSpareSelection(
                                                part.id,
                                                'isChosenLeft'
                                              )
                                            }
                                          >
                                            <BsWrench
                                              size={18}
                                              className={css.icon}
                                            />
                                          </button>
                                          <button
                                            type="button"
                                            className={`${css.btn} ${
                                              part.isChosenRight
                                                ? repair
                                                  ? css.btnGreen
                                                  : css.btnRed
                                                : ''
                                            }`}
                                            onClick={() =>
                                              toggleSpareSelection(
                                                part.id,
                                                'isChosenRight'
                                              )
                                            }
                                          >
                                            <BsWrench
                                              size={18}
                                              className={css.icon}
                                            />
                                          </button>
                                        </>
                                      ) : (
                                        <button
                                          type="button"
                                          className={`${css.btn} ${
                                            part.isChosen
                                              ? repair
                                                ? css.btnGreen
                                                : css.btnRed
                                              : ''
                                          }`}
                                          onClick={() =>
                                            toggleSpareSelection(
                                              part.id,
                                              'isChosen'
                                            )
                                          }
                                        >
                                          <BsWrench
                                            size={18}
                                            className={css.icon}
                                          />
                                        </button>
                                      )}
                                    </div>
                                  </li>
                                );
                              })}
                            </Fragment>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <ul>
                        {node.spareParts?.map((part, index) => {
                          const twoBtns = part.tag === 'two_side';
                          return (
                            <li
                              className={`${css.detailsItem} ${
                                !twoBtns && css.detailsItemFotItemWithOneBtn
                              }`}
                              key={index}
                            >
                              <p
                                className={`${css.subcategoryName} ${
                                  !twoBtns && css.subcategoryNameWithOneBtn
                                }`}
                              >
                                {part.name}
                              </p>

                              <div
                                className={`${css.buttons} ${
                                  !twoBtns && css.btnAlone
                                }`}
                              >
                                {twoBtns ? (
                                  <>
                                    <button
                                      type="button"
                                      className={`${css.btn} ${
                                        part.isChosenLeft
                                          ? repair
                                            ? css.btnGreen
                                            : css.btnRed
                                          : ''
                                      }`}
                                      onClick={() =>
                                        toggleSpareSelection(
                                          part.id,
                                          'isChosenLeft'
                                        )
                                      }
                                    >
                                      <BsWrench
                                        size={18}
                                        className={css.icon}
                                      />
                                    </button>
                                    <button
                                      type="button"
                                      className={`${css.btn} ${
                                        part.isChosenRight && css.btnRed
                                      }`}
                                      onClick={() =>
                                        toggleSpareSelection(
                                          part.id,
                                          'isChosenRight'
                                        )
                                      }
                                    >
                                      <BsWrench
                                        size={18}
                                        className={css.icon}
                                      />
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    type="button"
                                    className={`${css.btn} ${
                                      part.isChosen
                                        ? repair
                                          ? css.btnGreen
                                          : css.btnRed
                                        : ''
                                    }`}
                                    onClick={() =>
                                      toggleSpareSelection(part.id, 'isChosen')
                                    }
                                  >
                                    <BsWrench size={18} className={css.icon} />
                                  </button>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </Fragment>
                ) : null
              )
            : cat.name === title
            ? cat.spareParts?.map((part, index) => {
                const twoBtns = part.tag === 'two_side';
                return (
                  <li
                    className={`${css.detailsItem} ${
                      !twoBtns && css.detailsItemFotItemWithOneBtn
                    }`}
                    key={index}
                  >
                    <p
                      className={`${css.subcategoryName} ${
                        !twoBtns && css.subcategoryNameWithOneBtn
                      }`}
                    >
                      {part.name}
                    </p>

                    <div
                      className={`${css.buttons} ${!twoBtns && css.btnAlone}`}
                    >
                      {twoBtns ? (
                        <>
                          <button
                            type="button"
                            className={`${css.btn} ${
                              part.isChosenLeft
                                ? repair
                                  ? css.btnGreen
                                  : css.btnRed
                                : ''
                            }`}
                            onClick={() =>
                              toggleSpareSelection(part.id, 'isChosenLeft')
                            }
                          >
                            <BsWrench size={18} className={css.icon} />
                          </button>
                          <button
                            type="button"
                            className={`${css.btn} ${
                              part.isChosenRight
                                ? repair
                                  ? css.btnGreen
                                  : css.btnRed
                                : ''
                            }`}
                            onClick={() =>
                              toggleSpareSelection(part.id, 'isChosenRight')
                            }
                          >
                            <BsWrench size={18} className={css.icon} />
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          className={`${css.btn} ${
                            part.isChosen
                              ? repair
                                ? css.btnGreen
                                : css.btnRed
                              : ''
                          }`}
                          onClick={() =>
                            toggleSpareSelection(part.id, 'isChosen')
                          }
                        >
                          <BsWrench size={18} className={css.icon} />
                        </button>
                      )}
                    </div>
                  </li>
                );
              })
            : null
        )}
      </ul>

      {/* <BottomPart
        back={() => setOpenDetails(false)}
        buttonSpares={true}
        setNext={() => {
          setOpenDetails(false);
          setSavedSparesPartOpen(true);
        }}
      /> */}
    </div>
  );
}
