"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useUserContext } from "@/context/UserContext";
import classes from './SearchBar.module.css';
import searchLogoBlack from '../../../../assets/SearchBlack.svg';

interface SearchResult {
    id: number;
    username: string;
    avatar_url: string | null;
    is_online: boolean;
}

interface SearchResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: SearchResult[];
}

const SearchResultComponent: React.FC<{ searchResults: SearchResult[], hasMore: boolean }> = ({ searchResults, hasMore }) => {
    const router = useRouter();

    const handleClick = (result: SearchResult) => {
        router.push(`/users/friend/${result.id}`);
    };

    return (
        <div className={classes.resultContainer}>
            {searchResults.map((result) => (
                <button onClick={() => handleClick(result)} key={result.id} className={classes.resultItem}>
                    <Image 
                        src={result.avatar_url || "/default-avatar.png"} 
                        alt={`${result.username}'s avatar`} 
                        width={24} 
                        height={24} 
                        className={classes.avatarImage}
                    />
                    <span className={classes.username}>{result.username}</span>
                    {result.is_online && <span className={classes.onlineStatus} aria-label="Online"></span>}
                </button>
            ))}
            {hasMore && (
                <button className={classes.showAllBtn}>
                    Show more results
                </button>
            )}
        </div>
    );
};

const SearchBar: React.FC = () => {
    const [searchVisible, setSearchVisible] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(false);
    const { search, updateSearch } = useUserContext();
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        if (debouncedSearch) {
            fetchSearchResults();
        } else {
            setSearchResults([]);
            setHasMore(false);
        }
    }, [debouncedSearch]);

    const fetchSearchResults = async (page = 1) => {
        try {
            const response = await axios.get<SearchResponse>("http://localhost:8000/api/users/search/", {
                params: {
                    page: 1,
                    search: debouncedSearch,
                },
                withCredentials: true,
            });
            console.log(response.data);
            console.log(debouncedSearch);
            (response.data)
            const data = response.data;
            setSearchResults(data.results);
            setHasMore(!!data.next);
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        updateSearch(e.target.value);
    };

    const handleShowMore = () => {
        fetchSearchResults(Math.ceil(searchResults.length / 10) + 1);
    };

    const handleImageClick = () => {
        setSearchVisible(!searchVisible);
    };

    return (
        <div className={`${classes.container} ${searchVisible ? classes.active : ''}`}>
            <Image 
                onClick={handleImageClick} 
                className={classes.image} 
                src={searchLogoBlack} 
                alt="Search Logo"
                width={15} 
                height={15}
            />
            <input 
                className={classes.input} 
                placeholder="Search" 
                onChange={handleInputChange} 
                value={search}
                aria-label="Search users"
            />
            {searchResults.length > 0 && (
                <SearchResultComponent 
                    searchResults={searchResults} 
                    hasMore={hasMore} 
                    // onShowMore={handleShowMore} 
                />
            )}
        </div>
    );
};

export default SearchBar;

