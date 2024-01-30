
// import io from "socket.io-client";
// import axios from "axios";
import { useState, useEffect } from "react";
import {BrowserRouter,Routes,Route} from 'react-router-dom'

import RegisterUser from "./pages/ReagisterPage";
import ProfileClass from "./pages/ProfileClass";
import { AuthProvider } from "./context/AuthContext";

function App() {

  return (
    <AuthProvider>  
      <BrowserRouter> 
        <Routes>  
          <Route path="/" element={<RegisterUser/>}/>
          <Route path="/profileclass" element={<ProfileClass/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
