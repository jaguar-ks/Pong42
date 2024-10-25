"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Define a type for the context value
interface UserContextType {
    currentPage: string;
    updateCurrentPage: (pageName: string) => void;
    userData: UserDataType;
    updateUserData: (data: UserDataType) => void;
}

// Define a type for the user data
interface UserDataType {
    id: number | null;
    otp_uri: string;
    last_login: string;
    is_superuser: boolean;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    is_staff: boolean;
    is_active: boolean;
    date_joined: string;
    two_fa_enabled: boolean;
    is_online: string;
    avatar_url: string | null;
    wins: number;
    loses: number;
    rating: number;
    rank: number;

}

// Create the context with a default value of `undefined` for type safety
export const UserContext = createContext<UserContextType | undefined>(undefined);

// Define the type for the provider's props
interface UserContextProviderProps {
    children: ReactNode;
}

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
    const [currentPage, setCurrentPage] = useState<string>("");
    const [userData, setUserData] = useState<UserDataType>({
        id: null,
        otp_uri: "",
        last_login: "",
        is_superuser: false,
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        is_staff: false,
        is_active: false,
        date_joined: "",
        two_fa_enabled: false,
        is_online: "",
        avatar_url: "" ,
        wins: 0,
        loses: 0,
        rating: 0,
        rank: 0,

    });

    const updateCurrentPage = (pageName: string) => {
        setCurrentPage(pageName);
    };

    const updateUserData = (data: UserDataType) => {
        setUserData(data);
        console.log("daata", data)
    };

    return (
        <UserContext.Provider value={{ currentPage, updateCurrentPage, userData, updateUserData }}>
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
