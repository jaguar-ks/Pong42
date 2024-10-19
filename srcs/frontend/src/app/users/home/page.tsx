import React, { Children } from "react";
import classes from './page.module.css'
import VerticalNavbar from "@/components/VerticalNavbar/VerticalNavbar";
import HorizontalNavbar from "@/components/HorizontalNavbar/HorizontalNavbar";

const Home = () => {
    return (
        <div className={classes.container}>
            <div className={classes.verticalNavbar}>
                <VerticalNavbar />
            </div>
            <div className={classes.container2}>
                <div className={classes.horizontalNavbar}>
                    <HorizontalNavbar />
                </div>
                <div className={classes.children}>

                </div>

            </div>
        </div>
    );
};

export default Home;
