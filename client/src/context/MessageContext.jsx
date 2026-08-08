import { createContext, useState, useContext, useCallback } from "react";
import {
    getMessagesRequest,
    saveMessageRequest,
    markMessagesAsReadRequest
} from "../api/messages.js";

export const MessageContext = createContext();

export const useMessage = () => {
    const context = useContext(MessageContext);

    if (!context) {
        throw new Error("useMessage must be within a MessageProvider");
    }

    return context;
};

export const MessageProvider = ({ children }) => {

    const [Errors, setErrors] = useState([]);

    const getMessages = useCallback(async (conversationId) => {

        try {

            const res = await getMessagesRequest(conversationId);

            if (res.status === 200) {
                return res.data;
            }

        } catch (error) {

            if (Array.isArray(error?.response?.data)) {
                return setErrors(error.response.data);
            }

            setErrors([
                error?.response?.data?.message
            ]);
        }

    }, []);

    const saveMessage = async (message) => {

        try {

            const res = await saveMessageRequest(message);

            if (res.status === 201) {
                return res.data;
            }

        } catch (error) {

            if (Array.isArray(error?.response?.data)) {
                return setErrors(error.response.data);
            }

            setErrors([
                error?.response?.data?.message
            ]);
        }

    };

    const markMessagesAsRead = async (conversationId) => {

        try {

            const res = await markMessagesAsReadRequest(conversationId);

            if (res.status === 200) {
                return true;
            }

        } catch (error) {

            if (Array.isArray(error?.response?.data)) {
                return setErrors(error.response.data);
            }

            setErrors([
                error?.response?.data?.message
            ]);
        }

    };

    return (
        <MessageContext.Provider
            value={{
                getMessages,
                saveMessage,
                markMessagesAsRead,
                Errors
            }}
        >
            {children}
        </MessageContext.Provider>
    );
};