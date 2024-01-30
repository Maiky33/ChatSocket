
// import io from "socket.io-client";
// import axios from "axios";
import { useState, useEffect } from "react";
import {BrowserRouter,Routes,Route} from 'react-router-dom'

import RegisterUser from "./pages/ReagisterPage";
import LoginUser from "./pages/LoginPage";
import ProfileClass from "./pages/ProfileClass";


function App() {

  return (
    <BrowserRouter> 
      <Routes>  
        <Route path="/" element={<RegisterUser/>}/>
        <Route path="/login" element={<LoginUser/>}/>
        <Route path="/profileclass" element={<ProfileClass/>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
