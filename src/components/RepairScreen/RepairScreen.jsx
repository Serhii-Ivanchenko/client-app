import BottomPart from '../BottomPart/BottomPart';
import CarDetailsPart from '../DiagnosticScreen/CarDetailsPart/CarDetailsPart';
import TogglePoints from '../DiagnosticScreen/TogglePoints/TogglePoints';
import WorksSwitcher from '../DiagnosticScreen/WorksSwitcher/WorksSwitcher';
import newTree from '../../utils/tree.json';
import { useEffect, useRef, useState } from 'react';

import SubcategoriesPart from '../DiagnosticScreen/SubcategoriesPart/SubcategoriesPart';
import css from './RepairScreen.module.css';
import SavedSparesPart from '../DiagnosticScreen/SavedSparesPart/SavedSparesPart.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCars,
  selectIsRepairLoading,
  selectNodesAndPartsForDiagnostics,
  selectRepair,
} from '../../redux/cars/selectors.js';
import {
  getAllCars,
  getNodesAndParts,
  getRepair,
  updateRepair,
  uploadCarPhotos,
} from '../../redux/cars/operations.js';
import Filter from '../DiagnosticScreen/Filter/Filter.jsx';
import PartsForRepair from './PartsForRepair/PartsForRepair.jsx';
import toast from 'react-hot-toast';
import { clearRepair } from '../../redux/cars/slice.js';
import AudioRecorder from '../AudioRecorder/AudioRecorder.jsx';
import PhotoCapturePage from '../../pages/PhotoCapturePage/PhotoCapturePage.jsx';
import Modal from '../Modal/Modal.jsx';
import ModalForComments from '../ModalForComments/ModalForComments.jsx';
import Photos from './Photos/Photos.jsx';
import ModalForListOfRecordings from '../ModalForListOfRecordings/ModalForListOfRecordings.jsx';
import LoaderSvg from '../Loader/LoaderSvg.jsx';
import { selectUser } from '../../redux/auth/selectors.js';

export default function RepairScreen() {
  // const togglePoints = newTree?.nodes;
  // const [chosenPoints, setChosenPoints] = useState([]);
  // const [categoryForDetailsPart, setCategoryForDetailsPart] = useState('');
  // const [subcatOpen, setSubcatOpen] = useState(false);
  // const [openDetails, setOpenDetails] = useState(null);
  // const [chosenSpares, setChosenSpares] = useState([]);
  // const [spares, setSpares] = useState([]);
  // const [savedSparesPartOpen, setSavedSparesPartOpen] = useState(false);
  // const containerRef = useRef(null);
  // const [filter, setFilter] = useState('');
  const [statusParts, setStatusParts] = useState([]);
  const [statusServices, setStatusServices] = useState([]);
  const [completedRepair, setCompletedRepair] = useState(false);
  const userData = useSelector(selectUser);
  const mechanicId = userData?.id;

  // Audios
  const [recordAudio, setRecordAudio] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [audios, setAudios] = useState([]);
  const [audioLocalURLs, setAudioLocalURLs] = useState([]);
  const [currentBlob, setCurrentBlob] = useState(null);
  const [modalWithRecordings, setModalWithRecordings] = useState(false);

  // Photos
  const [openCamera, setOpenCamera] = useState(false);
  const [openPhotoComp, setOpenPhotoComp] = useState(false);
  const [photosFromRepair, setPhotosFromRepair] = useState([]);
  const [savedRepairPhotos, setSavedRepairPhotos] = useState([]);
  const [savedPhotos, setSavedPhotos] = useState([]);
  const [checkPhotos, setCheckPhotos] = useState(false);

  // Comments
  const [openComment, setOpenComment] = useState(false);
  const [comment, setComment] = useState('');
  const [checkComment, setCheckComment] = useState(false);
  const [commentsList, setCommentsList] = useState([]);

  // console.log('audios', audios);
  console.log('local', audioLocalURLs);
  console.log('audioURL', audioURL);

  // console.log('comments', commentsList);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loader = useSelector(selectIsRepairLoading);

  const { carId } = useParams();
  // console.log('carId', carId);

  const cars = useSelector(selectCars);
  // console.log('cars', cars);

  const particularCar = cars?.find(car => car?.car_id === Number(carId));

  const id = '6830857da0bfeec5d409915b';

  useEffect(() => {
    dispatch(getRepair(id));
  }, [dispatch]);

  const repair = useSelector(selectRepair);
  // console.log('repair', repair);

  // function base64ToBlob(base64String, contentType = 'audio/webm') {
  //   const byteCharacters = atob(base64String.split(',')[1]);
  //   const byteArrays = [];

  //   for (let offset = 0; offset < byteCharacters.length; offset += 512) {
  //     const slice = byteCharacters.slice(offset, offset + 512);
  //     const byteNumbers = new Array(slice.length);
  //     for (let i = 0; i < slice.length; i++) {
  //       byteNumbers[i] = slice.charCodeAt(i);
  //     }
  //     const byteArray = new Uint8Array(byteNumbers);
  //     byteArrays.push(byteArray);
  //   }

  //   return new Blob(byteArrays, { type: contentType });
  // }

  // function base64ToBlobUrl(base64, mimeType = 'audio/webm') {
  //   const byteCharacters = atob(base64.split(',')[1]);
  //   const byteArrays = [];

  //   for (let offset = 0; offset < byteCharacters.length; offset += 512) {
  //     const slice = byteCharacters.slice(offset, offset + 512);
  //     const byteNumbers = new Array(slice.length);
  //     for (let i = 0; i < slice.length; i++) {
  //       byteNumbers[i] = slice.charCodeAt(i);
  //     }
  //     const byteArray = new Uint8Array(byteNumbers);
  //     byteArrays.push(byteArray);
  //   }

  //   const blob = new Blob(byteArrays, { type: mimeType });
  //   return URL.createObjectURL(blob);
  // }

  useEffect(() => {
    setSavedRepairPhotos(repair?.photos);
    setAudios(repair?.audios);
    setAudioLocalURLs(repair?.audios);
    setCommentsList(repair?.comments);
  }, [repair]);
  // console.log('savephotos', savedRepairPhotos);

  useEffect(() => {
    if (repair?.parts) {
      setStatusParts(
        repair?.parts.map(part => ({ ...part, id: Math.random() }))
      );
    }

    if (repair?.services) {
      setStatusServices(
        repair?.services.map(service => ({ ...service, id: Math.random() }))
      );
    }
  }, [repair?.parts, repair?.services]);

  // async function convertBlobsToBase64(blobs) {
  //   const base64Array = await Promise.all(
  //     blobs.map(
  //       blob =>
  //         new Promise((resolve, reject) => {
  //           const reader = new FileReader();
  //           reader.onloadend = () => resolve(reader.result);
  //           reader.onerror = reject;
  //           reader.readAsDataURL(blob);
  //         })
  //     )
  //   );
  //   return base64Array;
  // }

  const date = sessionStorage.getItem('date');

  const handleUpdateStatuses = async () => {
    try {
      // let audiosBase64 = [];

      // if (audios && audios.length > 0) {
      //   audiosBase64 = await convertBlobsToBase64(audios);
      // }

      const dataToUpdate = {
        ...repair,
        parts: statusParts,
        services: statusServices,
        repair_id: id,
        audios: audioLocalURLs,
        photos: savedRepairPhotos,
        comments: commentsList,
      };

      console.log('dataToUpdate', dataToUpdate);

      await dispatch(updateRepair(dataToUpdate))
        .unwrap()
        .then(() => {
          toast.success('Ремонт успішно оновлено', {
            position: 'top-center',
            duration: 3000,
            style: {
              background: 'var(--bg-input)',
              color: 'var(--white)',
            },
          });
          dispatch(clearRepair());
          dispatch(getAllCars({ date, mechanic_id: mechanicId }));
          // dispatch(getAllCars({ date, mechanic_id: 1 }));
          navigate('/main');
        });
    } catch (error) {
      console.error('Помилка при оновленні ремонту:', error);
      toast.error('Помилка оновлення ремонту', {
        position: 'top-center',
        duration: 3000,
      });
    }
  };

  const handleSavePhotos = async () => {
    const carData = {
      car_id: carId,
      photos: {
        photos_base64: savedPhotos,
      },
    };
    const data = await dispatch(uploadCarPhotos(carData)).unwrap();
    setSavedRepairPhotos(prevPhotos => [...prevPhotos, ...data.added_urls]);
    setOpenPhotoComp(false);
    setPhotosFromRepair([]);
  };

  // console.log('particularCar', particularCar);

  // useEffect(() => {
  //   dispatch(getNodesAndParts());
  // }, [dispatch]);

  // const togglePoints = useSelector(selectNodesAndPartsForDiagnostics);

  // const handleCloseSavedScreen = () => {
  //   setSavedSparesPartOpen(false);
  //   setSubcatOpen(true);
  // };

  // // console.log('chosenSpares', chosenSpares);
  // // console.log('spares', spares);

  // const handleCheckboxChange = (event, id, label) => {
  //   setChosenPoints(prevPoints => {
  //     if (event.target.checked) {
  //       return [...prevPoints, { id, label }];
  //     } else {
  //       return prevPoints?.filter(point => point.id !== id);
  //     }
  //   });
  //   //  setWithoutDamages(false);
  // };

  // const groupNodeSubcat = node_subcat => {
  //   const result = [];

  //   node_subcat.forEach(entry => {
  //     // Якщо це subNode (3-й рівень)
  //     if (entry.subNode) {
  //       const existing = result.find(e => e.name === entry.name);
  //       const subNodeEntry = {
  //         subNodeName: entry.subNode.subNodeName,
  //         parts: entry.subNode.parts,
  //       };

  //       if (existing) {
  //         existing.subNode.push(subNodeEntry);
  //       } else {
  //         result.push({
  //           name: entry.name,
  //           id: entry.id,
  //           subNode: [subNodeEntry],
  //         });
  //       }
  //     } else {
  //       // Якщо це parts напряму (1-й або 2-й рівень без вкладеного subNode)
  //       result.push(entry);
  //     }
  //   });

  //   return result;
  // };

  // const nodes = spares
  //   .map(spare => {
  //     const node_subcat = [];

  //     // 1-й рівень: якщо є вибрані запчастини прямо в spare
  //     if (spare.spareParts) {
  //       const chosen = spare.spareParts.filter(
  //         part => part.isChosen || part.isChosenRight || part.isChosenLeft
  //       );

  //       if (chosen.length > 0) {
  //         node_subcat.push({
  //           id: spare.id,
  //           name: spare.name, // ім'я вузла верхнього рівня
  //           parts: chosen.map(part => ({
  //             id: part.id,
  //             tag: part.tag,
  //             code: part.code,
  //             part_name: part.name,
  //             comment: 'Заміна',
  //             audio_file: '',
  //             photo_file: '',
  //           })),
  //         });
  //       }
  //     }

  //     // 2-й рівень
  //     if (spare.nodes) {
  //       spare.nodes.forEach(node => {
  //         const chosen = node.spareParts
  //           ? node.spareParts.filter(
  //               part => part.isChosen || part.isChosenRight || part.isChosenLeft
  //             )
  //           : [];

  //         if (chosen.length > 0) {
  //           node_subcat.push({
  //             id: node.id,
  //             name: node.name,
  //             parts: chosen.map(part => ({
  //               id: part.id,
  //               tag: part.tag,
  //               code: part.code,
  //               part_name: part.name,
  //               comment: 'Заміна',
  //               audio_file: '',
  //               photo_file: '',
  //             })),
  //           });
  //         }

  //         // 3-й рівень
  //         if (node.nodes) {
  //           node.nodes.forEach(subNode => {
  //             const chosen = subNode.spareParts
  //               ? subNode.spareParts.filter(
  //                   part =>
  //                     part.isChosen || part.isChosenRight || part.isChosenLeft
  //                 )
  //               : [];

  //             if (chosen.length > 0) {
  //               node_subcat.push({
  //                 name: node.name,
  //                 id: node.id,
  //                 subNode: {
  //                   subNodeName: subNode.name,
  //                   parts: chosen.map(part => ({
  //                     id: part.id,
  //                     tag: part.tag,
  //                     code: part.code,
  //                     part_name: part.name,
  //                     comment: 'Заміна',
  //                     audio_file: '',
  //                     photo_file: '',
  //                   })),
  //                 },
  //               });
  //             }
  //           });
  //           // console.log('node_subcat', node_subcat);
  //           // console.log('chosen', chosen);
  //           // console.log('node', node);
  //         }
  //       });
  //     }

  //     // Повертаємо об'єкт тільки якщо є хоча б один підвузол з частинами
  //     return node_subcat.length > 0
  //       ? {
  //           node_name: spare.name,
  //           node_subcat: groupNodeSubcat(node_subcat),
  //         }
  //       : null;
  //   })
  //   .filter(Boolean);

  // console.log('nodes', nodes);

  // const visiblePoints = togglePoints.filter(category => {
  //   // Перевірка spareParts на рівні категорії
  //   const hasCategoryMatch = category.spareParts?.some(spare =>
  //     spare.name.toLowerCase().includes(filter.toLowerCase())
  //   );

  //   // Перевірка spareParts на рівні першого node
  //   const hasNodeMatch = category.nodes?.some(node =>
  //     node.spareParts?.some(spare =>
  //       spare.name.toLowerCase().includes(filter.toLowerCase())
  //     )
  //   );

  //   // Перевірка spareParts на рівні глибших node.nodes
  //   const hasDeepNodeMatch = category.nodes?.some(node =>
  //     node.nodes?.some(part =>
  //       part.spareParts?.some(spare =>
  //         spare.name.toLowerCase().includes(filter.toLowerCase())
  //       )
  //     )
  //   );

  //   return hasCategoryMatch || hasNodeMatch || hasDeepNodeMatch;
  // });

  // const chp = chosenPoints.map(p => p.label);
  // // console.log('chp', chp);

  // const visibleSubcategories = visiblePoints.filter(point =>
  //   chp.includes(point.name)
  // );

  return (
    <div className={css.wrapper}>
      <CarDetailsPart particularCar={particularCar} />
      <WorksSwitcher
        // subcatRepairOpen={subcatOpen}
        carId={carId}
        car={particularCar}
      />

      {loader ? (
        <LoaderSvg />
      ) : openPhotoComp ? (
        <PhotoCapturePage
          diag={true}
          repair={true}
          carId={carId}
          setOpenCamera={setOpenCamera}
          setOpenPhotoComp={setOpenPhotoComp}
          openCameraWorkPart={openCamera}
          setPhotosFromWorksPart={setPhotosFromRepair}
          photosFromWorksPart={photosFromRepair}
          handleSavePhotos={handleSavePhotos}
          setSavedPhotos={setSavedPhotos}
          savedPhotos={savedPhotos}
        />
      ) : checkPhotos ? (
        <Photos
          photos={
            savedRepairPhotos.length > 0 ? savedRepairPhotos : repair?.photos
          }
          setCheckPhotos={setCheckPhotos}
          setSavedPhotos={setSavedPhotos}
        />
      ) : (
        <PartsForRepair
          parts={repair?.parts}
          services={repair?.services}
          setStatusParts={setStatusParts}
          statusParts={statusParts}
          setStatusServices={setStatusServices}
          statusServices={statusServices}
          completedRepair={completedRepair}
          audioURL={audios?.length > 0}
          photosFromRepair={savedPhotos}
          repair={repair}
          setCheckPhotos={setCheckPhotos}
          setCheckComment={setCheckComment}
          setModalWithRecordings={setModalWithRecordings}
          comment={comment}
          commentsList={commentsList}
        />
      )}

      {/* {savedSparesPartOpen ? (
        <SavedSparesPart nodes={nodes} />
      ) : subcatOpen ? (
        <>
          <Filter filter={filter} setFilter={setFilter} />
          <ul className={css.list} ref={containerRef}>
            {visibleSubcategories?.map(point => (
              <SubcategoriesPart
                key={point.id}
                point={point}
                setCategoryForDetailsPart={setCategoryForDetailsPart}
                chosenPoints={chosenPoints}
                togglePoints={togglePoints}
                setOpenDetails={setOpenDetails}
                openDetails={openDetails}
                categoryForDetailsPart={categoryForDetailsPart}
                spares={spares}
                setSpares={setSpares}
                setChosenSpares={setChosenSpares}
                chosenSpares={chosenSpares}
                containerRef={containerRef}
                repair={true}
                filter={filter}
              />
            ))}
          </ul>
        </>
      ) : (
        <TogglePoints
          togglePoints={togglePoints}
          handleCheckboxChange={handleCheckboxChange}
          chosenPoints={chosenPoints}
        />
      )} */}

      {!openPhotoComp &&
        !checkPhotos &&
        (recordAudio ? (
          <AudioRecorder
            setRecordAudio={setRecordAudio}
            audioURL={audioURL}
            setAudioURL={setAudioURL}
            repair={true}
            setAudios={setAudios}
            currentBlob={currentBlob}
            setCurrentBlob={setCurrentBlob}
            setAudioLocalURLs={setAudioLocalURLs}
          />
        ) : (
          <BottomPart
            back={completedRepair ? () => setCompletedRepair(false) : '/main'}
            button={completedRepair}
            btnToggle={true}
            // next="diagnostics-subcategories"
            categ={!completedRepair}
            next={
              !completedRepair
                ? () => setCompletedRepair(true)
                : completedRepair
                ? handleUpdateStatuses
                : undefined
            }
            // chosenPoints={chosenPoints}
            savedPartBottom={completedRepair}
            repair={true}
            setRecordAudio={setRecordAudio}
            setOpenCamera={setOpenCamera}
            setOpenPhotoComp={setOpenPhotoComp}
            photosFromWorksPart={savedPhotos}
            audioURL={audioURL}
            setOpenComment={setOpenComment}
            comment={comment}
          />
        ))}

      {(openComment || checkComment) && (
        <Modal
          isOpen={openComment || checkComment}
          onClose={() => {
            setOpenComment(false);
            setCheckComment(false);
          }}
        >
          <ModalForComments
            onClose={() => {
              setOpenComment(false);
              setCheckComment(false);
            }}
            setComment={setComment}
            comment={comment}
            checkComment={checkComment}
            setCommentsList={setCommentsList}
            repair={true}
            commentsList={commentsList}
          />
        </Modal>
      )}

      {modalWithRecordings && (
        <Modal
          isOpen={modalWithRecordings}
          onClose={() => setModalWithRecordings(false)}
        >
          <ModalForListOfRecordings
            audios={audioLocalURLs}
            onClose={() => setModalWithRecordings(false)}
          />
        </Modal>
      )}
    </div>
  );
}
