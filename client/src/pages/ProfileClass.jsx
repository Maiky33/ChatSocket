import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useMessage } from "../context/MessageContext";
import { IoChatbubblesSharp } from "react-icons/io5";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { TbPhoneCall } from "react-icons/tb";
import { BsCameraVideo, BsThreeDotsVertical  } from "react-icons/bs";
import { VscDebugBreakpointData } from "react-icons/vsc";
import { IoIosSend } from "react-icons/io";
import { CiFaceSmile } from "react-icons/ci";
import EmojiPicker, { Theme } from "emoji-picker-react";
import ChatsContainer from "../components/ChatsContainer.jsx"
import UserOnlineContainer from "../components/UsersOnlineContainer.jsx"
import ModalConvesation from "../components/ModalConvesation.jsx"

import "./Styles/App.css";



function ProfileClass() {
  const [PreviewMessages, setPreviewMessages] = useState([]);
  const [Messages, setMessages] = useState([]);
  
  const [Nickname, setNickname] = useState("");
  const [InputMessage, setInputMessage] = useState("");
  
  const {user,LogOut, Socket} = useAuth() 
  const {saveMessage, getMessages} = useMessage()

  const [showPicker, setShowPicker] = useState(false);
  const [isOpenModal, setisOpenModal]= useState(false)

  // estados de UserOnlineContainer
  const [usersOnline, setUsersOnline] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  // conversacion Actual
  const [conversations, setConversations] = useState([]);


  const onEmojiClick = (emojiData) => {
    setInputMessage(prev => prev + emojiData.emoji);
  };

  useEffect(() => {
    if (user) {
      setNickname(user.userName);
    }
  }, [user]);


  useEffect(() => {
    // traemos los mensages guardados en la db 
    const loadMessages = async () => {
      // seteamos el nickname, los mensaje guardados etc
      const messages = await getMessages();
      setPreviewMessages(messages);
    };

    loadMessages();
  }, [getMessages]);

  useEffect(() => {

    // es la fuincion que se ejecuta si el on recive el evento message de server
    const recivedMessage = (InputMessage) => {
      // seteamos los mensajes concatenando el mensaje resivido con los viejos
      setMessages((prevMessages) => [
        InputMessage,
        ...prevMessages
      ]);
    };
    
    // escuchamos el evento message y si se dispara, se ejecuta la funcion recivedMessage
    Socket.on("message", recivedMessage);
    
    //desuscribimos el evento(para dejar de escuchar el evento)
    return () => {
      Socket.off("message", recivedMessage);
    };
    
  }, [Socket]);
  

  const MessageSubmit = (e) => {
    e.preventDefault();

  
    if (InputMessage !== "") {
      // emitimos o disparamos el evento mensaje para que lo reciva el on del index y nos devuelva un solo objeto
      Socket.emit("message", InputMessage, Nickname);

      // creamos el nuevo mensaje para mostrarlo en el frontend como "yo"
      const newMessage = {
        body: InputMessage,
        from: "yo",
      };

      // seteamos los mensajes concatenando el mensaje nuevo con los anteriores a este no con los PreviewMessages
      setMessages([newMessage, ...Messages]);
      // limpiamos el input
      setInputMessage("");

      // gaurdamos en db
      saveMessage({
        message: InputMessage,
        from: Nickname,
      });

    } else {
      alert("Necesitas un Mensaje para enviar un mensaje");
    }
  };

  

  return (
    
    <div className="App">
      <ModalConvesation conversations={conversations} setConversations={setConversations} usersOnline={usersOnline} isOpenModal={isOpenModal} setisOpenModal={setisOpenModal}/>
        <div className="ContainerTitleLogOut"> 
          <div className="title"> 
            <IoChatbubblesSharp />
            ChatSocket
          </div>

          <button onClick={()=>LogOut()} className="logOut">  
            <RiLogoutBoxRLine />
            LogOut
          </button>
        </div>
        <div className="ContainerVideoAndChat"> 
          <ChatsContainer conversations={conversations} setConversations={setConversations} setisOpenModal={setisOpenModal} />

          <div className="ContainerForm">
            <div className="containerNavFromChat"> 
              <div className="container_image_User_coonversation"> 
                <img src="https://scontent-bog2-2.xx.fbcdn.net/v/t39.30808-6/754308387_3362855430564881_8451400062443898209_n.jpg?stp=dst-jpg_tt6&cstp=mx1254x1254&ctp=s1254x1254&_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeE39OYcgKi6r7uhs_SIJAx9aIOFrkFw3NJog4WuQXDc0vJTJIVPWKE4SrC2v5qfNAKzfgL3nPMkNf0OBOrPrUnq&_nc_ohc=s3-iwUYVGDsQ7kNvwG37hfF&_nc_oc=AdoitaW5kiXTZ8pZgudkbeM23uNMzB-IYH44o0J4J2aX2C_7spKDTERLYGfCa_mDVNfH4HpZTzHCCg0lumdGRDjZ&_nc_zt=23&_nc_ht=scontent-bog2-2.xx&_nc_gid=MmHdDt3_vcLtYJbloSs3lw&_nc_ss=7b2a8&oh=00_AQFfyBEEnIfmrCUbqt7-v1JiKcyVvbIQBfRAx1CbpmT9HA&oe=6A79EABA" alt="" />
                <div className="container_User"> 
                  <p className="userName">Daniela</p>
                  <div className="online"> 
                    <VscDebugBreakpointData/>
                    <p>Online</p>
                  </div>
                </div>
              </div>
              <div className="Container_Icons_Conversation"> 
                <div className="Icon_Conversation"><TbPhoneCall/></div>
                <div className="Icon_Conversation"><BsCameraVideo/></div>
                <div className="Icon_Conversation"><BsThreeDotsVertical /></div>
              </div>
            </div>
            <div className="Chat">
              <div className="ChatBody">
                <div className="ContainerMessages">
                  <div className="NewMessage">
                    {Messages?.map((message, index) => (
                      <div
                        className={
                          message.from === "yo" ? "MessageYOU" : "Messageother"
                        }
                        key={index}
                      >
                        <p>
                          {message.from}: {message.body}
                        </p>
                      </div>
                    ))}
                  </div>

                  <small className="SmallMessages">... Mensajes Guardados ...</small>

                  {PreviewMessages?.map((message, index) => (
                    <div
                      className={
                        message.from === Nickname? "MessageYOU"  : "Messageother"
                      }
                      key={index}
                    >
                      <p>
                        {message.from}: {message.message}
                      </p>
                    </div>
                  ))}
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

          <UserOnlineContainer 
            usersOnline={usersOnline} setUsersOnline={setUsersOnline} 
            allUsers={allUsers} setAllUsers={setAllUsers}
          />

        </div>
    </div>
    
  );
}

export default ProfileClass;
