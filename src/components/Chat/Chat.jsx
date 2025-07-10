import avaClient from "../../assets/images/ava_client.png";
import avaManager from "../../assets/images/ava_manager.png";
import ChatList from "./ChatList/ChatList";
import MessageInput from "./MessageInput/MessageInput";
import css from "./Chat.module.css";
import { useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      sender: "client",
      author: "Олександр Мельник",
      avatar: avaClient,
      text: "Вітаю! Чи можна записатися на діагностику електрики та двигуна?",
      time: "09:00",
      files: [{ name: "", type: "", url: "" }],
    },
    {
      sender: "manager",
      author: "Ліза (менеджер)",
      avatar: avaManager,
      text: "Доброго дня, Олександре! Так, ми можемо записати вас на діагностику електрики та двигуна. Скажіть, будь ласка, який день і час вам зручні?",
      time: "09:04",
      files: [{ name: "", type: "", url: "" }],
    },
    {
      sender: "client",
      author: "Олександр Мельник",
      avatar: avaClient,
      text: "Мені було б зручно приїхати завтра після обіду, наприклад, о 15:00. Це можливо?",
      time: "09:07",
      files: [{ name: "", type: "", url: "" }],
    },
    {
      sender: "manager",
      author: "Ліза (менеджер)",
      avatar: avaManager,
      text: "Завтра о 15:00 підходить. Ми записали вас на діагностику. Адреса нашого автосервісу: вул. Центральна, 45. Якщо виникнуть додаткові питання, звертайтеся!",
      time: "09:08",
      files: [{ name: "", type: "", url: "" }],
    },
    {
      sender: "client",
      author: "Олександр Мельник",
      avatar: avaClient,
      text: "Дуже дякую за швидку відповідь! До зустрічі",
      time: "09:10",
      files: [{ name: "", type: "", url: "" }],
    },
  ]);
  const [filteredData, setFilteredData] = useState([]);
  const [activeSearch, setActiveSearch] = useState(false);
  const [inputHeight, setInputHeight] = useState(0);

  const addNewMessage = (newMessage) => {
    setMessages([...messages, newMessage]);
  };

//   const onFilter = (searchData) => {
//     setFilteredData(searchData);
//     setActiveSearch(true);
//   };

//   const onReset = () => {
//     setFilteredData(messages);
//     setActiveSearch(false);
//   };
  return (
    <div className={css.chatWrapper}>
      {/* <ChatHeader
        searchData={messages}
        handleFilter={onFilter}
        handleReset={onReset}
      /> */}
      <ChatList
        messages={activeSearch ? filteredData : messages}
        inputHeight={inputHeight}
      />
      <MessageInput
        addNewMessage={addNewMessage}
        setInputHeight={setInputHeight}
      />
    </div>
  );
}
