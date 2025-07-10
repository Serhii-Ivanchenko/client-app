import { useRef, useEffect } from "react";
import styles from "./ChatList.module.css";
import ChatListItem from "../ChatListItem/ChatListItem";

function ChatList({ messages, inputHeight }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      const maxWrapperHeight = 350;
      scrollRef.current.style.maxHeight = `${
        maxWrapperHeight - inputHeight
      }px`;
    }
  }, [inputHeight]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

   return (
    <div className={styles.wrapper}>
      <div ref={scrollRef} className={styles.scrollArea}>
         <div style={{ textAlign: "center" }}>
    <div className={styles.date}>Сьогодні, 24 грудня</div>
  </div>
        {messages.map((message, index) => (
          <ChatListItem key={index} message={message} />
        ))}
      </div>
    </div>
  );
}

export default ChatList;
