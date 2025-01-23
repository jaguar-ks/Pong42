"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

// Define a type for the context value
interface UserContextType {
    currentPage: string;
    updateCurrentPage: (pageName: string) => void;
    userData: UserDataType;
    updateUserData: (data: UserDataType) => void;
    search: string;
    updateSearch: (data: string) => void;
    searchedUserData: SearchedUserDataType;
    updateSearchedUserData: (data: SearchedUserDataType) => void;
    userDataSearch: UserDataSearchType;
    updateUserDataSearch: (data: UserDataSearchType) => void;
    localTournementNames: string[];
    setLocalTournementNames: React.Dispatch<React.SetStateAction<string[]>>;
    localTournementCount: 4 | 8;
    setLocalTournementCount: React.Dispatch<React.SetStateAction<4 | 8>>;
    localOneVsOneNames: string[];
    setLocalOneVsOneNames: React.Dispatch<React.SetStateAction<string[]>>;
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

// Define a type for the searched user data
interface SearchedUserDataType {
    avatar_url: string;
    first_name: string;
    id: number;
    is_online: boolean;
    last_name: string;
    loses: number;
    rank: number;
    rating: number;
    username: string;
    wins: number;
    connection: string;
}

// Define a type for user data search
interface UserDataSearchType {
    id: number;
    username: string;
    avatar_url: string;
    is_online: boolean;
    first_name: string;
    last_name: string;
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
        avatar_url: null,
        wins: 0,
        loses: 0,
        rating: 0,
        rank: 0,
    });

    const [searchedUserData, setSearchedUserData] = useState<SearchedUserDataType>({
        avatar_url: "",
        first_name: "",
        id: 0,
        is_online: false,
        last_name: "",
        loses: 0,
        rank: 0,
        rating: 0,
        username: "",
        wins: 0,
        connection: ""
    });

    const [userDataSearch, setUserDataSearch] = useState<UserDataSearchType>({
        id: 0,
        username: "",
        avatar_url: "",
        is_online: false,
        first_name: "",
        last_name: "",
        wins: 0,
        loses: 0,
        rating: 0,
        rank: 0,
    });

    const [localTournementCount, setLocalTournementCount] = useState<4 | 8>(4);
    const [localTournementNames, setLocalTournementNames] = useState(Array(4).fill(""));

    const [localOneVsOneNames, setLocalOneVsOneNames] = useState(Array(2).fill(""));

    const [search, setSearch] = useState<string>("");

    return (
        <UserContext.Provider
            value={{
                currentPage,
                updateCurrentPage: setCurrentPage,
                userData,
                updateUserData: setUserData,
                search,
                updateSearch: setSearch,
                searchedUserData,
                updateSearchedUserData: setSearchedUserData,
                userDataSearch,
                updateUserDataSearch: setUserDataSearch,
                localTournementNames,
                setLocalTournementNames,
                localTournementCount,
                setLocalTournementCount,
                localOneVsOneNames,
                setLocalOneVsOneNames,
            }}
        >
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("https://localhost/api/users/me/", { withCredentials: true });
                context.updateUserData({
                    id: res.data.id,
                    otp_uri: res.data.otp_uri,
                    last_login: res.data.last_login,
                    is_superuser: res.data.is_superuser,
                    username: res.data.username,
                    first_name: res.data.first_name,
                    last_name: res.data.last_name,
                    email: res.data.email,
                    is_staff: res.data.is_staff,
                    is_active: res.data.is_active,
                    date_joined: res.data.date_joined,
                    two_fa_enabled: res.data.two_fa_enabled,
                    is_online: res.data.is_online,
                    avatar_url: res.data.avatar_url,
                    wins: res.data.wins,
                    loses: res.data.loses,
                    rating: res.data.rating,
                    rank: res.data.rank,
                })
            } catch (err: any) {
                console.log("Error in fetching user data", err);
            }
        };

        fetchData();
    }, [context.updateUserData]);

    return context;
};
