import React, { useState } from "react";
import "./Styles/App.css";

import { IoChatbubblesSharp } from "react-icons/io5";
import { RiLogoutBoxRLine } from "react-icons/ri";


import { useAuth } from "../context/AuthContext";
import { useConversation } from "../context/ConversationContext.jsx";

import ChatsContainer from "../components/ChatsContainer.jsx"
import UserOnlineContainer from "../components/UsersOnlineContainer.jsx"
import ModalConvesation from "../components/ModalConvesation.jsx"
import MainChatContainer from "../components/MainChatContainer.jsx"




function ProfileClass() {
  
  
  
  
  const {LogOut} = useAuth() 
  const {conversations} = useConversation()

  const [isOpenModal, setisOpenModal] = useState(false)

  const [isOpenMainChat, setisOpenMainChat] = useState(false)
  const [currentConversationOpen, setcurrentConversationOpen] = useState()
  

  // estados MainChatContainer
  const [Messages, setMessages] = useState([]);
  
  // estados de UserOnlineContainer
  const [usersOnline, setUsersOnline] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  

  return (
    
    <div className="App">
      <ModalConvesation  conversations={conversations} usersOnline={usersOnline} 
        isOpenModal={isOpenModal} setisOpenModal={setisOpenModal}
      />

        <div className="ContainerTitleLogOut"> 
          <div className="title"> 
            <IoChatbubblesSharp />
            ChatSocket
          </div>

          <button onClick={()=>LogOut()} className="logOut">  
            <RiLogoutBoxRLine />
            LogOut
          </button>
        </div>
        <div className="ContainerVideoAndChat"> 
          <ChatsContainer setMessages={setMessages} currentConversationOpen={currentConversationOpen} setcurrentConversationOpen={setcurrentConversationOpen} setisOpenMainChat={setisOpenMainChat} setisOpenModal={setisOpenModal} />

          {isOpenMainChat?  
            <MainChatContainer Messages={Messages} setMessages={setMessages} setisOpenMainChat={setisOpenMainChat} usersOnline={usersOnline} currentConversationOpen={currentConversationOpen} setcurrentConversationOpen={setcurrentConversationOpen}/>:
            <div className="main_Chat_Close"> 
              <h1><p>Start chatting:</p>create or open a conversation right now.</h1>
            </div>
          }

          <UserOnlineContainer 
            usersOnline={usersOnline} setUsersOnline={setUsersOnline} 
            allUsers={allUsers} setAllUsers={setAllUsers}
          />

        </div>
    </div>
    
  );
}

export default ProfileClass;
