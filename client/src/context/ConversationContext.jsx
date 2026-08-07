import { createContext, useState, useContext, useCallback } from "react";
import { getConversationsRequest,saveConversationRequest} from "../api/conversations.js";

export const ConversationContext = createContext();

export const useConversation = () => {
    const context = useContext(ConversationContext);

    if (!context) {
        throw new Error("useConversation must be within a ConversationProvider");
    }

    return context;
};

export const ConversationProvider = ({ children }) => {

    const [Errors, setErrors] = useState([]);

    const getConversations = useCallback(async () => {

        try {

            const res = await getConversationsRequest();

            if (res.status === 200) {
                return res.data.conversations;
            }

        } catch (error) {

            if (Array.isArray(error?.response?.data)) {
                return setErrors(error.response.data);
            }

            setErrors([error?.response?.data?.message]);
        }

    }, []);

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

    return (
        <ConversationContext.Provider
            value={{
                getConversations,
                saveConversation,
                Errors
            }}
        >
            {children}
        </ConversationContext.Provider>
    );
};