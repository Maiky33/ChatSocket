import React from 'react'
import "../components/Styles/chatsContainer.css";
import { VscDebugBreakpointData } from "react-icons/vsc";
import { IoChatbubblesSharp } from "react-icons/io5";
import { LuUsersRound } from "react-icons/lu";
import { GoGear } from "react-icons/go";
import { RxPlusCircled } from "react-icons/rx";
import { useAuth } from '../context/AuthContext';



const ChatsContainer = (props) =>{    

    const {setisOpenModal, conversations} = props
    const {user} = useAuth()
   
    
    return (    
        <div className='bannerLeft'>   
            <div className='container_image_User'>   
                <img src="https://media.istockphoto.com/id/1223671392/es/vector/imagen-de-perfil-predeterminada-avatar-marcador-de-posici%C3%B3n-de-la-foto-ilustraci%C3%B3n-vectorial.jpg?s=612x612&w=0&k=20&c=z7iux2vOeMQ6SJyERGoJZsye3msSp3Nflg_GXMCou3c=" alt="" />
                <div className='container_User'>   
                    <h3 className='userName'>{user.userName}</h3>
                    <div className='online'>   
                        <VscDebugBreakpointData/>
                        <p>Online</p>
                    </div>
                </div>
            </div>
            <div className='container_Menu'>   
                <div className='Item_Menu_Banner'> <IoChatbubblesSharp/> <p>Chats</p></div>
                <div className='Item_Menu_Banner'> <LuUsersRound/> <p>Usurios</p></div>
                <div className='Item_Menu_Banner'> <GoGear/> <p>Ajustes</p></div>
            </div>

            <span className='Line'></span>

            <div className='container_Conversation'>   
                <div className='conversation_Plus'>   
                    <h3>CONVERSACIONES</h3>

                    <RxPlusCircled onClick={()=>setisOpenModal(true)}/>
                </div>

                <div className='container_Chats'>
                    {   
                        conversations.map((conversation)=>( 
                            <div className="Chats">   
                                <img className='ChatImage' src="https://media.istockphoto.com/id/1223671392/es/vector/imagen-de-perfil-predeterminada-avatar-marcador-de-posici%C3%B3n-de-la-foto-ilustraci%C3%B3n-vectorial.jpg?s=612x612&w=0&k=20&c=z7iux2vOeMQ6SJyERGoJZsye3msSp3Nflg_GXMCou3c=" alt="" />
                                <div className='Name_Message'>
                                    <h3 className='Name'>{conversation.userName}<span className='HourMessage'>10:45 pm</span></h3>
                                    <p className='Message'>Hola como estas? <span className='NumberMessage'>1</span></p>
                                </div>
                            </div>
                        ))
                    }   
                </div>
            </div>
        </div>
    )
    
    
}

export default ChatsContainer