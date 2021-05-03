import React from "react";
import {Link} from 'react-router-dom';

import Navbar from "./Navbar"

import '../css/trending.css';
import Arrow from '../assets/arrow.png';

type TrendingProps = {
    id: string;
    title: string;
    content: string;
    topic: string;
    imageUrl: string;
    author: string;
    publicKey: string;
    date: Number;
    likes: Number;
}


const Trending = ({
    id,
    title,
    content,
    topic,
    imageUrl,
    author,
    publicKey,
    date,
    likes,
}: TrendingProps): any => {
    return(
        <Link to={"/blog/"+id}>
            <div className="trending-flex">
                <div className="trending-flex-left">
                    <p className="trending-title">{title}</p>
                    <p className="trending-author">{author}</p>
                </div>
                <div className="ml-auto trending-flex-right">
                    <img src={Arrow} className="arrow-icon" />
                </div>
            </div>
        </Link>
    )
}

export default Trending;
