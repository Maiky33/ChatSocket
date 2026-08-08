import React, { useEffect, useState } from 'react'
import "../components/Styles/mainChatContainer.css";

import { TbPhoneCall } from "react-icons/tb";
import { BsCameraVideo} from "react-icons/bs";
import { HiOutlineX } from "react-icons/hi";

import { VscDebugBreakpointData } from "react-icons/vsc";
import { IoIosSend } from "react-icons/io";
import { CiFaceSmile } from "react-icons/ci";
import EmojiPicker, { Theme } from "emoji-picker-react";

import { useAuth } from '../context/AuthContext';
import { useMessage } from '../context/MessageContext';
import { useConversation } from '../context/ConversationContext';



const MainChatContainer = (props) =>{    
    
    
  const [PreviewMessages, setPreviewMessages] = useState([]);
  const [InputMessage, setInputMessage] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  
  const {Messages, setMessages ,currentConversationOpen,setcurrentConversationOpen, usersOnline, setisOpenMainChat} = props
  const {saveMessage, getMessages} = useMessage()
  const {Socket,user} = useAuth() 
  const {updateConversation} = useConversation();


  useEffect(() => {

    if (!currentConversationOpen) {
      setPreviewMessages([]);
      return;
    }

    const loadMessages = async () => {

      const messages = await getMessages(
        currentConversationOpen._id
      );

      setPreviewMessages([...messages].reverse());  
    };

    loadMessages();

  }, [getMessages, currentConversationOpen]);


  useEffect(() => {

    const receivedMessage = (message) => {

      setMessages(prevMessages => [
        message,
        ...prevMessages
      ]);

      updateConversation(
        message,
        currentConversationOpen?._id
      );
    };

    Socket.on("message", receivedMessage);

    return () => {
      Socket.off("message", receivedMessage);
    };

  }, [Socket, currentConversationOpen, setMessages,updateConversation]);


  const MessageSubmit = async (e) => {

    e.preventDefault();

    if (!InputMessage.trim() || !currentConversationOpen) return;

    const message = {
      conversationId: currentConversationOpen._id,
      message: InputMessage
    };

    const savedMessage = await saveMessage(message);

    if (savedMessage) {
      Socket.emit("message", savedMessage);
    }

    setInputMessage("");
  };

  const onClickExMainChat = ()=>{ 
    setcurrentConversationOpen(null)
    setisOpenMainChat(false)
  }

  const onEmojiClick = (emojiData) => {
    setInputMessage(prev => prev + emojiData.emoji);
  };

  const isUserOnline = usersOnline.some((user)=> user?._id === currentConversationOpen?.user?._id && user?.online)


  return (    
      <div className="ContainerForm">
          <div className="containerNavFromChat"> 
            <div className="container_image_User_coonversation"> 
              <img src="https://media.istockphoto.com/id/1223671392/es/vector/imagen-de-perfil-predeterminada-avatar-marcador-de-posici%C3%B3n-de-la-foto-ilustraci%C3%B3n-vectorial.jpg?s=612x612&w=0&k=20&c=z7iux2vOeMQ6SJyERGoJZsye3msSp3Nflg_GXMCou3c=" alt="" />
              <div className="container_User"> 
                <p className="userName">{currentConversationOpen?.user?.userName}</p>
                <div className={isUserOnline? "online" : "offline"}> 
                  <VscDebugBreakpointData/>
                  <p>{isUserOnline? "Online":"Offline"}</p>
                </div>
              </div>
            </div>
            <div className="Container_Icons_Conversation"> 
              <div className="Icon_Conversation"><TbPhoneCall/></div>
              <div className="Icon_Conversation"><BsCameraVideo/></div>
              <div onClick={onClickExMainChat} className="Icon_Conversation"><HiOutlineX/></div>
            </div>
          </div>
          <div className="Chat">
            <div className="ChatBody">
              <div className="ContainerMessages">
                <div className="NewMessage">
                  {Messages?.map((message) => {

                    const senderId = message.sender?._id || message.sender;

                    const isMyMessage = senderId?.toString() === user?.id?.toString();

                    return (
                      <div
                        className={isMyMessage ? "MessageYOU" : "Messageother"}
                        key={message._id}
                      >
                        <p>
                          {message.message}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <small className="SmallMessages">... Mensajes Guardados ...</small>

                {PreviewMessages?.map((message) => {

                  const senderId = message.sender?._id || message.sender;

                  const isMyMessage =
                  senderId?.toString() === user?.id?.toString();

                  return (
                    <div
                      className={isMyMessage ? "MessageYOU" : "Messageother"}
                      key={message._id}
                    >
                      <p>
                        {message.message}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="InputsForm">
              {/*Formulario*/}

              <form onSubmit={MessageSubmit}>
                <div className="ContainerButtonInput">
                  <button type="button" className="EmogiAbsolute" onClick={() => setShowPicker(!showPicker)}>
                    <CiFaceSmile/>
                  </button>

                  {showPicker && (
                    <div className="emoji-picker"> 
                      <EmojiPicker theme={Theme.DARK}  width={404} height={500} onEmojiClick={onEmojiClick} />
                    </div>
                  )}

                  <input
                    onChange={(e) => setInputMessage(e.target.value)}
                    type="text"
                    className="MessageInput"
                    placeholder="message..."
                    id="nickname"
                    value={InputMessage}
                  />
                  <button className="ButtonName"><IoIosSend/></button>
                </div>
              </form>
            </div>
          </div>
      </div>
  )
    
    
}

export default MainChatContainer