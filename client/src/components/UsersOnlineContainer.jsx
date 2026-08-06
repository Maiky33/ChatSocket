import React, { useEffect, useState } from 'react'
import "../components/Styles/userOnlineContainer.css"
import { VscDebugBreakpointData } from "react-icons/vsc";
import { useUsers } from '../context/UsersContext';
import { useAuth } from '../context/AuthContext';

const UserOnlineContainer = () =>{    

    const [usersOnline, setUsersOnline] = useState([]);
    const [allUsers, setAllUsers] = useState([]);

    const {Socket} = useAuth()

    const {getAllUsers} = useUsers() 

    useEffect(()=>{ 
        const loadUsersOnline = async () => {
            const users = await getAllUsers();
            setAllUsers(users);
        };

        loadUsersOnline();
    },[getAllUsers])

    useEffect(()=>{ 
        const handleOnlineUsers = (onlineIds) => {

            console.log("onlineIds",onlineIds);

            const usersWithStatus = allUsers?.map(user => ({
                ...user,
                online: onlineIds?.includes(user._id)
            }));

            setUsersOnline(usersWithStatus);
        };

        Socket.on("onlineUsers", handleOnlineUsers);

        return () => {
            Socket.off("onlineUsers", handleOnlineUsers);
        };

    },[allUsers, Socket])

    const onlineCount = usersOnline.filter(user => user.online).length;

    
    return  (
        <div className='user_Online_Container'>   
            <div className='container_Title_User_Online'>  
                <p>USUARIOS EN LÍNEA</p>
                <span>{onlineCount}</span>
            </div>

            <div className='container_Colum_Users_Online'>  
                {   
                    usersOnline?.map((item)=>(
                        <div className='container_Users_Online'>        
                            <img className='image_Users_Online' src="https://media.istockphoto.com/id/1223671392/es/vector/imagen-de-perfil-predeterminada-avatar-marcador-de-posici%C3%B3n-de-la-foto-ilustraci%C3%B3n-vectorial.jpg?s=612x612&w=0&k=20&c=z7iux2vOeMQ6SJyERGoJZsye3msSp3Nflg_GXMCou3c=" alt="" />
                            <div className='container_User'>   
                                <h3 className='userName'>{item?.userName}</h3>
                                <div className={item?.online? 'online': 'offline'}>   
                                    <VscDebugBreakpointData/>
                                    <p>{item?.online? "Online" : "Offline"}</p>
                                </div>
                            </div>
                        </div>
                    ))
                } 
            </div>
        </div>
    )
    
}

export default UserOnlineContainer