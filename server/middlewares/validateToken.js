import jwt from 'jsonwebtoken'
import {TOKEN_SECRET} from '../config.js'

export const authRequired = (req, res, next) => {   
    const cookieHeader = req.headers.cookie;
  
    if (cookieHeader) {
      const cookies = cookieHeader.split('; ').reduce((acc, cookie) => {
        const [name, value] = cookie.split('=');
        acc[name] = value;
        return acc;
      }, {});
  
      const token = cookies.token;
  
      // Si no hay token, responder con 401
      if (!token) return res.status(401).json({ message: "No token, authorization denied" });
  
      jwt.verify(token, TOKEN_SECRET, (err, user) => {  
        // Si hay algún error, responder con 403
        if (err) return res.status(403).json({ message: "Invalid token" });
  
        // Si todo está bien, añadir el usuario al req y pasar al siguiente middleware
        req.user = user;
        next();
      });
    } else {
      // Si no hay cabecera de cookies, responder con 401
      return res.status(401).json({ message: "No token, authorization denied" });
    }
  };