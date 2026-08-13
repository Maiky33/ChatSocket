import { useState,useEffect,useCallback} from "react";
import { useForm } from "react-hook-form";
import "./Styles/registerStyle.css";
import LogoRegister from "../images/LogoRegister.png"
import {useAuth} from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { GridLoader } from "react-spinners";

//Coneccion para escuchar y eviar los elementos



function RegisterUser() {

  const {register,handleSubmit,formState:{errors}} = useForm()
  const {SingUp,SingIn,isAuthenticated} = useAuth()

  const [formState, setformState] = useState(false)
  const [loader, setloader] = useState(false)


  const navigate = useNavigate()

  
  const OnsubmitRegister = handleSubmit(async(values) =>{  
    setloader(true)
    if(formState){
      await SingIn(values)
    }else{
      await SingUp(values)
    }
    setloader(false)

  })

  const onSubmitSingUp =()=>{ 
    setformState(false)
  }
  const onSubmitSingIn =()=>{ 
    setformState(true)
  }

  



  const handleNavigation = useCallback(() => {
    if (isAuthenticated) {
      navigate('/profileclass');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    handleNavigation();
  }, [handleNavigation]);

  return (
    <div className="ContainerFromRegisterImage">   
      <div className="ContainerImage">
        <p className="ImageText">Chat Socket</p> 
        <img className="ImageRegister" src={LogoRegister} alt="" />
      </div>

      <div className="ContainerFormRegister"> 
        <div className="containeButtonsRegiter"> 
          <button onClick={onSubmitSingUp} className={!formState ? "ButtonSelectedButtonSingUp" : "ButtonSingUp"} type="submit">Sing Up</button>
          <button onClick={onSubmitSingIn} className={formState? "ButtonSelectedButtonSingIn" : "ButtonSingIn"} type="submit">Sing In</button>
        </div>

        {loader?  
          <div className="Loader"> 
            <GridLoader color="#62d5c4ee" size={70}/>
          </div>
          :
          <form onSubmit={OnsubmitRegister} className="FormContain">
            {
              !formState?
              <div className="containinputText"> 
              <p className="userNameText">UserName</p>
              <input placeholder="Enter your Name" className="usernameInput" type="text" {...register('userName', {required:true})}/>
              {
                errors?.userName && <p className="errorData">UserName is Required</p>
              }
              </div>:null
            }


            <div className="containinputText"> 
              <p className="userNameText">E-mail</p>
              <input placeholder="Enter your Email" className="emailInput" type="email" {...register('email', {required:true})}/>
              {
                errors?.email && <p className="errorData">Email is Required</p>
              }
            </div>

            <div className="containinputText"> 
              <p className="userNameText">Password</p>
              <input placeholder=". . . . . ." className="passwordInput" type="password" {...register('password', {required:true})}/>
              {
                errors?.password && <p className="errorData">Password is Required</p>
              }
            </div>

            <button className="ButtonSingUpSend" type="submit">  
              {!formState? 'Sing Up' : 'Sing In'}
            </button>
          </form>
        }

      </div>
    </div>
  );
}

export default RegisterUser;
