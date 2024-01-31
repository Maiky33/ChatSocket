
// import io from "socket.io-client";
// import axios from "axios";
import { useState, useEffect } from "react";
import {BrowserRouter,Routes,Route} from 'react-router-dom'

import RegisterUser from "./pages/ReagisterPage";
import ProfileClass from "./pages/ProfileClass";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./pages/ProtectedRoute";
 
function App() {

  return (
    <AuthProvider>  
      <BrowserRouter> 
        <Routes>  
          <Route path="/" element={<RegisterUser/>}/>

          <Route element={<ProtectedRoute/>}> 
            <Route path="/profileclass" element={<ProfileClass/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
