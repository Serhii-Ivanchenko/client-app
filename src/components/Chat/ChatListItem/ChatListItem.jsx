import { FaFileDownload } from "react-icons/fa";
import styles from "./ChatListItem.module.css";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import FullSizeImgModal from "../FullSizeImgModal/FullSizeImgModal";
import { useImageModal } from "../../../utils/useImageModal";

function ChatListItem({ message }) {
  const { sender, avatar, author, time, text, files, audio } = message;
  const isClient = sender === "client";
  const infoClass = isClient ? styles.userInfo : styles.managerInfo;

  const { isImgModalOpen, modalImage, handleImageClick, closeImgModal } =
    useImageModal();

  const handleDownload = (file) => {
    const blob = new Blob([file.file], { type: file.type });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = file.name;
    link.click();
    console.log("Download file");
  };

  return (
    <div className={styles.wrapper}>
      <div className={infoClass}>
        <img className={styles.avatar} src={avatar} alt="Avatar" />
        <p className={styles.name}>{author}</p>
        <p className={styles.time}>{time}</p>
      </div>
      <div className={isClient ? styles.message : styles.messageManager}>
        {files?.length > 0 &&
          files.map((file, index) => {
            if (file.type.startsWith("image/")) {
              return (
                <img
                  key={index}
                  src={file.url}
                  alt={`Зображення ${index + 1}`}
                  className={styles.image}
                  onClick={() => handleImageClick(file.url)}
                />
              );
            } else if (file.type.startsWith("audio/")) {
              return <AudioPlayer key={index} audio={file.url} size="big" />;
            } else if (
              file.type === "application/pdf" ||
              file.type === "application/msword" ||
              file.type ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
              file.type === "application/vnd.ms-excel" ||
              file.type ===
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
              file.type === "application/x-rar-compressed" ||
              file.type === "application/zip" ||
              file.type === "application/x-zip-compressed" ||
              file.type === "application/x-7z-compressed" ||
              file.type === "text/plain"
            ) {
              return (
                <button
                  key={index}
                  onClick={() => handleDownload(file)}
                  className={styles.downloadBtn}
                >
                  <FaFileDownload /> {file.name}
                </button>
              );
            }
            return null;
          })}
        {audio && (
          <AudioPlayer audio={audio} size="small" audioDuration="00:00" />
        )}
        {text && <p>{text}</p>}
      </div>

      <FullSizeImgModal
        isOpen={isImgModalOpen}
        imgUrl={modalImage}
        onClose={closeImgModal}
      />
    </div>
  );
}

export default ChatListItem;
