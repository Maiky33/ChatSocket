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

    const [activeConversationId, setActiveConversationId] = useState(null);

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

        const handleConversationCreated = () => {
            getConversations();
        };

        Socket.on("conversationCreated", handleConversationCreated);

        return () => {
            Socket.off("conversationCreated", handleConversationCreated);
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

    const updateConversation = useCallback((message) => {
        setConversations(prevConversations =>
            prevConversations.map(conversation => {

                if (conversation._id !== message.conversationId) {
                    return conversation;
                }

                const isChatOpen =
                    conversation._id === activeConversationId;

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
    }, [activeConversationId]);

    useEffect(() => {

        const handleConversationUpdated = (message) => {
            updateConversation(message);
        };

        Socket.on("conversationUpdated", handleConversationUpdated);

        return () => {
            Socket.off("conversationUpdated", handleConversationUpdated);
        };

    }, [Socket, activeConversationId, updateConversation]);

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
                setActiveConversationId,
                Errors
            }}
        >
            {children}
        </ConversationContext.Provider>
    );
};