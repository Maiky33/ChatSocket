
import io from "socket.io-client";
import axios from "axios";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import "./Styles/registerStyle.css";
import LogoRegister from "../images/LogoRegister.png"
import {registeRequest} from "../api/auth.js";
//Coneccion para escuchar y eviar los elementos

// const Socket = io("http://localhost:4000");

function RegisterUser() {

  const {register,handleSubmit} = useForm()


  const OnsubmitRegister =()=>{ 
    handleSubmit(async(values) =>{  
      const res = await registeRequest(values)
    } )
  }

  return (
    <div className="ContainerFromRegisterImage">   
      <div className="ContainerImage">
        <p className="ImageText">Aprende, Imagina Crea</p> 
        <img className="ImageRegister" src={LogoRegister} alt="" />
      </div>

      <div className="ContainerForm"> 
        <div className="containeButtonsRegiter"> 
          <button className="ButtonSingUp" type="submit">Sing Up</button>
          <button className="ButtonSingIn"type="submit">Sing In</button>
        </div>

        <form onSubmit={OnsubmitRegister} className="FormContain">
          <div className="containinputText"> 
            <p className="userNameText">UserName</p>
            <input placeholder="Enter your Name" className="usernameInput" type="text" {...register('userName', {required:true})}/>
          </div>
          <div className="containinputText"> 
            <p className="userNameText">E-mail</p>
            <input placeholder="Enter your Email" className="emailInput" type="email" {...register('email', {required:true})}/>
          </div>
          <div className="containinputText"> 
            <p className="userNameText">Password</p>
            <input placeholder=". . . . . ." className="passwordInput" type="password" {...register('password', {required:true})}/>
          </div>

          <button className="ButtonSingUpSend" type="submit">  
            Sing Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterUser;
