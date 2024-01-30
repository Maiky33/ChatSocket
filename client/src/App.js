import "./styles/App.css";
import io from "socket.io-client";
import axios from "axios";
import { useState, useEffect } from "react";
import ReactPlayer from "react-player";

//Coneccion para escuchar y eviar los elementos

const Socket = io("http://localhost:4000");

function App() {
  const [Nickname, setNickname] = useState("");
  const [Message, setMessage] = useState("");
  const [Disable, setDisable] = useState(false);
  const [Messages, setMessages] = useState([]);

  const [PreviewMessages, setPreviewMessages] = useState([]);
  const [Fristconnect, setFristconnect] = useState(false);

  useEffect(() => {
    //cada vez que alguien envie un mensaje para que todos los Clientes puedan verlo aactualizado con el nuevo mensaje
    // (Aqui actualizamos los mensaje para todos los clientes)
    // creamos una funcion que recibe Message(el mensaje como parametro)
    const recivedMessage = (Message) => {
      // seteamos los mensajes concatenando el mensaje resivido con los viejos
      setMessages([Message, ...Messages]);
    };
    
    // Escuchamos el evento "message", y le pasamos el mensaje (recivedMessage)
    Socket.on("message", recivedMessage);

    //desuscribimos el evento(para dejar de escuchar el evento)
    return () => {
      Socket.off("message", recivedMessage);
    };
  }, [Messages]);

  if (!Fristconnect) {
    //traemos la los mensajes la primera vez
    axios.get("http://localhost:4000/api/messages").then((res) => {
      setPreviewMessages(res.data.messages);
      if(res?.data?.messages){ 
        setMessage("");
      }else{  
        setMessage(res?.data?.messages);
      }
    });

    // ponemos en true la validacion para que no vuelva a ejecutarse 
    setFristconnect(true);
  }

  const MessageSubmit = (e) => {
    e.preventDefault();
    if (Nickname !== "") {
      //emitimos (enviamos) en el evento "message", con los parametros que recibe en este caso Message y nickName
      Socket.emit("message", Message, Nickname);

      // al momento de enviar el mensaje lo enviamos con el from yo, para verlo en frontend, en el backend se guarda con el nickname agregado
      const newMessage = {
        body: Message,
        from: "yo",
      };

    // (Aqui actualizamos el mensaje para el user)
      // seteamos los mensajes y concatenamos con el mensaje nuevo
      setMessages([newMessage, ...Messages]);
      setMessage("");

      
      //Hacemos la peticion http por Post para guardar mensaje en la base de datos con el nickname correcto
      axios.post("http://localhost:4000/api/save", {
        message: Message,
        from: Nickname,
      });

    } else {
      alert("Necesitas un nickname para enviar un mensaje");
    }
  };

  const NiknameSubmit = (e) => {
    e.preventDefault();
    setNickname(Nickname);
    setDisable(true);
  };

  return (
    <>
      <h1 className="Title">Virtual Class</h1>
      <div className="App">
        <div className="AppVideo">
          <ReactPlayer
            controls={true}
            muted
            playing
            loop
            width={700}
            height={500}
            url="https://youtu.be/HhC75IonpOU"
          />
        </div>
        <div className="=ContainerForm">
          <div className="Chat">
            <h5>Chat</h5>
            <div className="ChatBody">
              <div className="ContainerMessages">
                <div className="NewMessage">
                  {Messages.map((message, index) => (
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

                {PreviewMessages.map((message, index) => (
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
              <form onSubmit={NiknameSubmit}>
                <div  className="ContainerButtonInput">
                  <input
                    disabled={Disable}
                    onChange={(e) => setNickname(e.target.value)}
                    type="text"
                    className="NikNameInput"
                    placeholder="Nickname..."
                    id="nickname"
                  />
                  <button className="ButtonName">Confirmar</button>
                </div>
              </form>

              <form onSubmit={MessageSubmit}>
                <div className="ContainerButtonInput">
                  <input
                    onChange={(e) => setMessage(e.target.value)}
                    type="text"
                    className="MessageInput"
                    placeholder="message..."
                    id="nickname"
                    value={Message}
                  />
                  <button className="ButtonName">Enviar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
