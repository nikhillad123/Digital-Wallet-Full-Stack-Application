import { createContext, useContext, useEffect, useState } from "react";
import Toast from "../components/Toast";

const ToastContext = createContext();

export function ToastProvider({ children }) {

    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success"
    });

    function showToast(message, type = "success") {

        setToast({
            show: true,
            message,
            type
        });

    }

    useEffect(() => {

        if (!toast.show) return;

        const timer = setTimeout(() => {

            setToast(prev => ({
                ...prev,
                show: false
            }));

        }, 3000);

        return () => clearTimeout(timer);

    }, [toast]);

    return (

        <ToastContext.Provider
            value={{ showToast }}
        >

            {children}

            <Toast
                show={toast.show}
                message={toast.message}
                type={toast.type}
            />

        </ToastContext.Provider>

    );

}

export function useToast() {

    return useContext(ToastContext);

}