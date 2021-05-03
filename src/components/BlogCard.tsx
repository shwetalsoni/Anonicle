import React from "react";
import {Link} from 'react-router-dom';
import '../css/blog-card.css'

import Like from '../assets/like.svg';

type BlogCardProps = {
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

const BlogCard = ({
    id,
    title,
    content,
    topic,
    imageUrl,
    author,
    publicKey,
    date,
    likes
}: BlogCardProps): any => {
    return(
        <><Link to={"/blog/"+id}>
            <div className="blog-card-body">
                <div className="card-header">
                    <p className="title">
                        {title || "Title"}
                    </p>
                    <p className="name">
                        {author || "Anonymous"}
                    </p>
                </div>
                {imageUrl?(
                    <img src={imageUrl} className="card-img" alt="" />
                ):(
                    ""
                )}
                <div className="card-body">
                    <p className="content"> 
                    {content?(
                        content
                    ):(
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                    )}
                    </p>
                </div>
                <div className="card-footer-tag">
                    <p className="hashtag"># {topic}</p>
                    <span><img src={Like} className="home-like" /></span><span className="blog-card-likes">{''+likes}</span><span className="likes-text">Likes</span>
                </div>
            </div>
            </Link>
        </>
    )
}

export default BlogCard;
