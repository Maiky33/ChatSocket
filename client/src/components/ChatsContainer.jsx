import React, { useEffect } from 'react'
import "../components/Styles/chatsContainer.css";
import { VscDebugBreakpointData } from "react-icons/vsc";
import { IoChatbubblesSharp } from "react-icons/io5";
import { LuUsersRound } from "react-icons/lu";
import { GoGear } from "react-icons/go";
import { RxPlusCircled } from "react-icons/rx";
import { useAuth } from '../context/AuthContext';
import { useConversation } from "../context/ConversationContext.jsx";
import { useMessage } from '../context/MessageContext.jsx';




const ChatsContainer = (props) =>{    

    const {setMessages,setisOpenModal, setisOpenMainChat, setcurrentConversationOpen, currentConversationOpen} = props
    const {user,Socket} = useAuth()

    const {
        conversations,
        getConversations,
        markConversationAsRead
    } = useConversation();

    const {
        markMessagesAsRead
    } = useMessage();


    useEffect(() => {
        getConversations();
    }, [getConversations]);

    const formatHour = (date) => {

    if (!date) return "";

        return new Date(date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

    };

    const currentChatOpen = async (conversation) => {

        Socket.emit("joinConversation", conversation._id);

        setMessages([]);
        setisOpenMainChat(true);
        setcurrentConversationOpen(conversation);

        const success = await markMessagesAsRead(conversation._id);

        if (success) {
            markConversationAsRead(conversation._id);
        }
    };
   
    
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
                        conversations.map((conversation, index)=>( 
                            <div key={index} onClick={()=>currentChatOpen(conversation)} className={conversation?._id === currentConversationOpen?._id? "ChatsSelected Chats": "Chats"}>   
                                <img className='ChatImage' src="https://media.istockphoto.com/id/1223671392/es/vector/imagen-de-perfil-predeterminada-avatar-marcador-de-posici%C3%B3n-de-la-foto-ilustraci%C3%B3n-vectorial.jpg?s=612x612&w=0&k=20&c=z7iux2vOeMQ6SJyERGoJZsye3msSp3Nflg_GXMCou3c=" alt="" />
                                <div className='Name_Message'>
                                    <h3 className='Name'>{conversation?.user?.userName}<span className='HourMessage'>{formatHour(conversation?.lastMessage?.createdAt)}</span></h3>
                                    <p className='Message'>{conversation?.lastMessage?.message} 
                                        {conversation?.unreadCount > 0 && (
                                            <span className="NumberMessage">
                                                {conversation.unreadCount}
                                            </span>
                                        )}
                                    </p>
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