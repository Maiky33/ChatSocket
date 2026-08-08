import React, {useState} from 'react'
import "../components/Styles/modalConvesation.css";
import Swal from 'sweetalert2';
import { useConversation } from '../context/ConversationContext';


const ModalConvesation = (props) =>{    

    const {isOpenModal, setisOpenModal, usersOnline, conversations} = props
    const { getConversations,saveConversation } = useConversation();
    const [UserSelected, setUserSelected]= useState()

    const conversationsAdd = async()=>{   
        if (!UserSelected) return;

        const exists = conversations.some(conversation => conversation._id === UserSelected._id);

        if (exists) {
            Swal.fire({
                icon: 'warning',
                title: 'Select a user',
                text: 'Choose a user before creating the conversation.',
                background: '#1f2937',
                color: '#fff',
                confirmButtonColor: '#53d1bd'
            });
            return;
        }

        await saveConversation({receiverId: UserSelected._id})

        await getConversations()

        setUserSelected(null);
        setisOpenModal(false);
    }

    if (!isOpenModal) return null;

    return (    
        <div className="modalOverlay">

            <div className="modalContainer">

                <div className="modalHeader">

                    <h2>New Conversation</h2>

                    <button onClick={()=>setisOpenModal(false)} className="closeModal">
                        ✕
                    </button>

                </div>

                <div className="modalBody">

                    <input
                        type="text"
                        placeholder="Search user..."
                        className="searchUser"
                    />

                    <div className="containerUsers">

                        {usersOnline?.map((user)=>( 
                            <div
                                key={user._id}
                                className={UserSelected?._id === user?._id ? "cardUser selected" :"cardUser"}
                                onClick={()=>setUserSelected(user)}
                            >

                                <div className="containerAvatar">

                                    <img
                                        src={user.image || 'https://media.istockphoto.com/id/1223671392/es/vector/imagen-de-perfil-predeterminada-avatar-marcador-de-posici%C3%B3n-de-la-foto-ilustraci%C3%B3n-vectorial.jpg?s=612x612&w=0&k=20&c=z7iux2vOeMQ6SJyERGoJZsye3msSp3Nflg_GXMCou3c='}
                                        alt={user.userName}
                                    />

                                    <span
                                        className={
                                            user.online
                                                ? 'statusDot online'
                                                : 'statusDot offline'
                                        }
                                    />

                                </div>

                                <div className="cardUserInfo">

                                    <p className="userName">
                                        {user.userName}
                                    </p>

                                    <span className="userEmail">
                                        {user.email}
                                    </span>

                                </div>

                            </div>
                        ))}

                    </div>

                </div>

                <div className="modalFooter">

                    <button onClick={()=>setisOpenModal(false)} className="btnCancel">
                        Cancel
                    </button>

                    <button onClick={conversationsAdd} className="btnCreate">
                        Start Chat
                    </button>

                </div>

            </div>

        </div>
    )
    
    
}

export default ModalConvesation