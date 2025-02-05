"use client";

import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/UserContext";
import classes from "./SearchBar.module.css";
import searchLogoBlack from "../../../../assets/SearchBlack.svg";
import Api from "@/lib/api";

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

const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
};

const SearchResultComponent: React.FC<{
    searchResults: SearchResult[];
    hasMore: boolean;
    updateSearch: (value: string) => void;
    onShowMore?: () => void;
}> = ({ searchResults, hasMore, updateSearch, onShowMore }) => {
    const router = useRouter();

    const handleClick = (id: number) => {
        updateSearch(""); // Clear search input
        router.push(`/users/search/${id}`);
    };

    return (
        <>
            {searchResults.map((result) => (
                <button
                    key={result.id}
                    onClick={() => handleClick(result.id)}
                    className={classes.resultItem}
                    aria-label={`View profile of ${result.username}`}
                >
                    <Image
                        src={result.avatar_url || process.env.NEXT_PUBLIC_DEFAULT_AVATAR}
                        alt={`${result.username}'s avatar`}
                        width={24}
                        height={24}
                        className={classes.avatarImage}
                    />
                    <span className={classes.username}>{result.username}</span>
                    {result.is_online && (
                        <span
                            className={classes.onlineStatus}
                            aria-label="Online"
                        ></span>
                    )}
                </button>
            ))}
            {hasMore && onShowMore && (
                <button
                    onClick={onShowMore}
                    className={classes.showAllBtn}
                    aria-label="Show more results"
                >
                    Show more results
                </button>
            )}
        </>
    );
};

const SearchBar: React.FC = () => {
    const [searchVisible, setSearchVisible] = useState(false);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [hasMore, setHasMore] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { search, updateSearch } = useUserContext();
    const debouncedSearch = useDebounce(search, 300);
    const searchRef = useRef<HTMLDivElement>(null);
    const resultRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node) &&
                resultRef.current &&
                !resultRef.current.contains(event.target as Node)
            ) {
                setSearchVisible(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (debouncedSearch) {
            fetchSearchResults();
            setSearchVisible(true);
        } else {
            setSearchResults([]);
            setHasMore(false);
            setError(null);
        }
    }, [debouncedSearch]);

    const fetchSearchResults = async (page = 1) => {
        try {
            const response = await Api.get<SearchResponse>(
                "/users/search/",
                {
                    params: { page, search: debouncedSearch },
                    withCredentials: true,
                }
            );
            if (page === 1) {
                setSearchResults(response.data.results);
            } else {
                setSearchResults((prev) => [...prev, ...response.data.results]);
            }
            setHasMore(!!response.data.next);
            setError(null);
        } catch (err) {
            console.error("Error fetching search results:", err);
            setError("Failed to fetch search results. Please try again.");
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
            <div
                ref={searchRef}
                className={`${classes.container} ${
                    searchVisible ? classes.active : ""
                }`}
            >
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
            {searchVisible && search && (
                <div ref={resultRef} className={classes.resultContainer}>
                    {error ? (
                        <div className={classes.error}>{error}</div>
                    ) : (
                        <SearchResultComponent
                            searchResults={searchResults}
                            hasMore={hasMore}
                            onShowMore={handleShowMore}
                            updateSearch={updateSearch}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
