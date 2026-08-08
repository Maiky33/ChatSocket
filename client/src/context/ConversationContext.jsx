import { createContext, useState, useContext, useCallback,useEffect} from "react";
import { useAuth } from "./AuthContext";
import {
    getConversationsRequest,
    saveConversationRequest
} from "../api/conversations.js" 

export const ConversationContext = createContext();

export const useConversation = () => {
    const context = useContext(ConversationContext);

    if (!context) {
        throw new Error("useConversation must be within a ConversationProvider");
    }

    return context;
};

export const ConversationProvider = ({ children }) => {

    const { Socket } = useAuth();

    const [Errors, setErrors] = useState([]);
    // conversacion Actual
    const [conversations, setConversations] = useState([]);

    const getConversations = useCallback(async () => {

        try {

            const res = await getConversationsRequest();

            if (res.status === 200) {
                setConversations(res.data.conversations);
            }

        } catch (error) {

            if (Array.isArray(error?.response?.data)) {
                return setErrors(error.response.data);
            }

            setErrors([error?.response?.data?.message]);
        }

    }, []);

    useEffect(() => {

        const handleConversationUpdated = (message) => {
            console.log("Nueva actualización:", message);
            getConversations();
        };

        Socket.on("conversationUpdated", handleConversationUpdated);

        return () => {
            Socket.off("conversationUpdated", handleConversationUpdated);
        };

    }, [Socket, getConversations]);

    const saveConversation = async (conversation) => {

        try {

            const res = await saveConversationRequest(conversation);

            if (res.status === 200 || res.status === 201) {
                return res.data;
            }

        } catch (error) {

            if (Array.isArray(error?.response?.data)) {
                return setErrors(error.response.data);
            }

            setErrors([error?.response?.data?.message]);
        }

    };

    const updateConversation = (message, currentConversationId) => {

        setConversations(prevConversations =>
            prevConversations.map(conversation => {

                if (conversation._id !== message.conversationId) {
                    return conversation;
                }

                const isChatOpen =
                    conversation._id === currentConversationId;

                return {
                    ...conversation,
                    lastMessage: message,
                    unreadCount: isChatOpen
                        ? 0
                        : (conversation.unreadCount || 0) + 1,
                    updatedAt: message.createdAt
                };
            })
        );
    };

    const markConversationAsRead = (conversationId) => {

        setConversations(prevConversations =>
            prevConversations.map(conversation => {

                if (conversation._id !== conversationId) {
                    return conversation;
                }

                return {
                    ...conversation,
                    unreadCount: 0
                };

            })
        );

    };

    return (
        <ConversationContext.Provider
            value={{
                conversations, 
                getConversations,
                saveConversation,
                updateConversation,
                markConversationAsRead,
                Errors
            }}
        >
            {children}
        </ConversationContext.Provider>
    );
};