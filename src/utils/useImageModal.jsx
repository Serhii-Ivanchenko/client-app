import { useState } from "react";

export const useImageModal = () => {
  const [isImgModalOpen, setIsImgModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");

  const handleImageClick = (url) => {
    setModalImage(url);
    setIsImgModalOpen(true);
  };

  const closeImgModal = () => {
    setIsImgModalOpen(false);
    setModalImage("");
  };

  return { isImgModalOpen, modalImage, handleImageClick, closeImgModal };
};
