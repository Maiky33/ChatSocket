import Message from "../models/message.js";


//hacemos objeto con las dos funciones a necesitar
const Controller = {
  //Funcion para guardar los mensajess

  save: (req, res) => {
    //guardamos los parametros que resibimos 
    let params = req.body;
    
    //creamos el mensage nuevo pasandole los parametro que llegan por la peticion al schema
    const newMessage = new Message({  
      message: params?.message,
      from: params?.from
    })

    //hacemos las consultas save para guardar el mensaje y hacemos las condicionales en caso de error, en caso de que no alla error mandamos el menssge (message === mesageStored)
    newMessage.save((error, messageStored) => {
      if (error || !messageStored) {
        return res.status(404).send({
          status: "error",
          message: "No ha sido posible guardar el mensaje",
        });
      }

      return res.status(200).send({
        status: "Success",
        messageStored,
      });
    });
  },

  //funcion para obtener todos los mensajes
  getMessages: (req, res) => {

    const allmessages = Message.find({}).select('message from').lean()

    allmessages.sort("-_id").exec((error, messages) => {
      if (error) {
        return res.status(500).send({
          status: "error",
          message: "Error al extraer los datos",
        });
      }
      //Si no existen artículos:
      if (!messages) {
        return res.status(404).send({
          status: "error",
          message: "No hay mensajes para mostrar",
        });
      }
      return res.status(200).send({
        status: "success",
        messages
      });
    });

    
  },
};

export default Controller;
