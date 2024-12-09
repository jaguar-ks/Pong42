"use client";

import React, { useState, ChangeEvent, useEffect, useRef } from "react";
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

const SearchResultComponent: React.FC<{ 
    searchResults: SearchResult[], 
    hasMore: boolean,
    onShowMore?: () => void 
}> = ({ searchResults, hasMore, onShowMore }) => {
    const router = useRouter();

    const handleClick = (result: SearchResult) => {
        router.push(`/users/friend/${result.id}`);
    };

    return (
        <>
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
            {hasMore && onShowMore && (
                <button onClick={onShowMore} className={classes.showAllBtn}>
                    Show more results
                </button>
            )}
        </>
    );
};

const SearchBar: React.FC = () => {
    const [searchVisible, setSearchVisible] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(false);
    const { search, updateSearch } = useUserContext();
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setSearchVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        if (debouncedSearch) {
            fetchSearchResults();
            setSearchVisible(true);
        } else {
            setSearchResults([]);
            setHasMore(false);
        }
    }, [debouncedSearch]);

    const fetchSearchResults = async (page = 1) => {
        try {
            const response = await axios.get<SearchResponse>("http://localhost:8000/api/users/search/", {
                params: {
                    page,
                    search: debouncedSearch,
                },
                withCredentials: true,
            });
            console.log(response.data);
            
            if (page === 1) {
                setSearchResults(response.data.results);
            } else {
                setSearchResults(prev => [...prev, ...response.data.results]);
            }
            setHasMore(!!response.data.next);
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

    return (
        <div className={classes.searchWrapper}>
            <div ref={searchRef} className={`${classes.container} ${searchVisible ? classes.active : ''}`}>
                <Image 
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
                    onFocus={() => setSearchVisible(true)}
                    aria-label="Search users"
                />
            </div>
            {searchVisible && search && searchResults.length > 0 && (
                <div className={classes.resultContainer}>
                    <SearchResultComponent 
                        searchResults={searchResults} 
                        hasMore={hasMore}
                        onShowMore={handleShowMore}
                    />
                </div>
            )}
        </div>
    );
};

export default SearchBar;
