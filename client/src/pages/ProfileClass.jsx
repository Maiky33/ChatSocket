import io from "socket.io-client";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useMessage } from "../context/MessageContext";
import "./Styles/App.css";


//Coneccion para escuchar y eviar los elementos
const API = process.env.REACT_APP_API_URL

const Socket = io(API,{withCredentials: true});

function ProfileClass() {
  const [PreviewMessages, setPreviewMessages] = useState([]);
  const [Messages, setMessages] = useState([]);
  
  const [Nickname, setNickname] = useState("");
  const [InputMessage, setInputMessage] = useState("");
  
  const [Fristconnect, setFristconnect] = useState(false);
  const {user,LogOut} = useAuth() 
  const {saveMessage, getMessages} = useMessage()


  useEffect(() => {
    if (user) {
      setNickname(user.userName);
    }
  }, [user]);

  useEffect(() => {

    // traemos los mensages guardados en la db 
    const loadMessages = async () => {
      if (!Fristconnect) {
        const messages = await getMessages();
        // seteamos el nickname, los mensaje guardados etc
        setPreviewMessages(messages);
        setFristconnect(true);
      }
    };
    
    // ejecutamos la funcion ya que es async y no podemos ponerla directamente en el useEffect
    loadMessages();
    
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
    
  }, []);
  

  const MessageSubmit = (e) => {
    e.preventDefault();

    if (Nickname !== "") {
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
      alert("Necesitas un nickname para enviar un mensaje");
    }
  };

  return (
    
    <div className="App">
        <div className="ContainerTitleLogOut"> 
          <div className="title"> 
            ChatSocket
          </div>

          <button onClick={()=>LogOut()} className="logOut">  
            LogOut
          </button>
        </div>
        <div className="ContainerVideoAndChat"> 
          <div className="=ContainerForm">
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

                  <small>... Mensajes Guardados ...</small>

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
                    <input
                      onChange={(e) => setInputMessage(e.target.value)}
                      type="text"
                      className="MessageInput"
                      placeholder="message..."
                      id="nickname"
                      value={InputMessage}
                    />
                    <button className="ButtonName">Enviar</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
    </div>
    
  );
}

export default ProfileClass;
