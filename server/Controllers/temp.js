import User from "../models/user.js";


//hacemos objeto con las dos funciones a necesitar
const Controller = {

  getMessages: (req, res) => {
    User.find({})
    .select('userName email')
    .sort('-_id')
    .exec((error, Users) => {
    if (error) {
      return res.status(500).send({
      status: "error",
      message: "Error al extraer los Users",
      });
    }
    // Si no existen mensajes:
    if (!Users || Users.length === 0) {
      return res.status(404).send({
      status: "error",
      message: "No hay Users para mostrar",
      });
    }
    
    return res.status(200).send({
      status: "success",
      Users
    });
    });
  }
};

export default Controller;
