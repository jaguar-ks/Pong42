"use client";

import React, { useContext, useState } from "react";
import classes from './SearchBar.module.css';
import searchLogoBlack from '../../../../assets/SearchBlack.svg'
import SearchLogoWithe from '../../../../assets/SearchWithe.svg'
import Image from "next/image";

const SearchBar = () => {
    const [searchVisibile, setSearchVisibile] = useState(false);
    const handleImageClick = () =>{
        setSearchVisibile(!searchVisibile);
    }

    return (
        <div className={classes.container}>
            <Image onClick={handleImageClick} className={classes.image} src={searchLogoBlack} alt="search logo black" />
            <input className={classes.input} placeholder="Search"></input>
        </div>
    );
};

export default SearchBar;
