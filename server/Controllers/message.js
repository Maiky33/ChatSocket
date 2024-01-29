import Message from "../models/message.js";


//hacemos objeto con las dos funciones a necesitar
const Controller = {
  //Funcion para guardar los mensajess

  save: (req, res) => {
    //guardamos lo que resibimos
    let params = req.body;

    //creamos una variable con el Schema importado de models
    let message = new Message();

    //damos valores al objeto
    message.message = params.message;
    message.from = params.from;

    //hacemos las consultas
    message.save((error, messageStored) => {
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
    //buscamos los mensajes
    let query = Message.find({});

    //hacemos las consultas
    query.sort("-_id").exec((error, messages) => {
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
