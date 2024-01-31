
import io from "socket.io-client";
import axios from "axios";
import { useState,useEffect } from "react";
import { useForm } from "react-hook-form";
import "./Styles/registerStyle.css";
import LogoRegister from "../images/LogoRegister.png"
import {useAuth} from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
//Coneccion para escuchar y eviar los elementos



function RegisterUser() {

  const {register,handleSubmit,formState:{errors}} = useForm()
  const {SingUp,SingIn,isAuthenticated,Errors} = useAuth()

  const [formState, setformState] = useState(false)

  const navigate = useNavigate()

  
  const OnsubmitRegister = handleSubmit(async(values) =>{  
    if(formState){
      SingIn(values)
    }else{
      SingUp(values)
    }
  })

  const onSubmitSingUp =()=>{ 
    setformState(false)
  }
  const onSubmitSingIn =()=>{ 
    setformState(true)
  }

  useEffect(()=>{ 
    if(isAuthenticated){  
      navigate('/profileclass')
    }
  },[isAuthenticated])

  return (
    <div className="ContainerFromRegisterImage">   
      <div className="ContainerImage">
        <p className="ImageText">Aprende, Imagina, Crea</p> 
        <img className="ImageRegister" src={LogoRegister} alt="" />
      </div>

      <div className="ContainerForm"> 
        <div className="containeButtonsRegiter"> 
          <button onClick={onSubmitSingUp} className={!formState ? "ButtonSelectedButtonSingUp" : "ButtonSingUp"} type="submit">Sing Up</button>
          <button onClick={onSubmitSingIn} className={formState? "ButtonSelectedButtonSingIn" : "ButtonSingIn"} type="submit">Sing In</button>
        </div>

        <form onSubmit={OnsubmitRegister} className="FormContain">
          { 
            Errors.map((error, i)=>(  
              <div className="ErrorPost" key={i}> 
                {error}
              </div>
            ))
          }
          {
            !formState?
            <div className="containinputText"> 
            <p className="userNameText">UserName</p>
            <input placeholder="Enter your Name" className="usernameInput" type="text" {...register('userName', {required:true})}/>
            {
              errors.userName && <p className="errorData">UserName is Required</p>
            }
            </div>:null
          }


          <div className="containinputText"> 
            <p className="userNameText">E-mail</p>
            <input placeholder="Enter your Email" className="emailInput" type="email" {...register('email', {required:true})}/>
            {
              errors.email && <p className="errorData">Email is Required</p>
            }
          </div>

          <div className="containinputText"> 
            <p className="userNameText">Password</p>
            <input placeholder=". . . . . ." className="passwordInput" type="password" {...register('password', {required:true})}/>
            {
              errors.password && <p className="errorData">Password is Required</p>
            }
          </div>

          <button className="ButtonSingUpSend" type="submit">  
            {!formState? 'Sing Up' : 'Sing In'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterUser;
