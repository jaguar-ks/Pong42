"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Define a type for the context value
interface UserContextType {
    currentPage: string;
    updateCurrentPage: (pageName: string) => void;
}

// Create the context with a default value of `undefined` for type safety
export const UserContext = createContext<UserContextType | undefined>(undefined);

// Define the type for the provider's props
interface UserContextProviderProps {
    children: ReactNode;
}

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
    const [currentPage, setCurrentPage] = useState<string>("");

    const updateCurrentPage = (pageName: string) => {
        setCurrentPage(pageName);
    };

    return (
        <UserContext.Provider value={{ currentPage, updateCurrentPage }}>
            {children}
        </UserContext.Provider>
    );
};

// Create a custom hook for easier access to the context
export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within a UserContextProvider");
    }
    return context;
};
