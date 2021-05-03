import React from "react";
import {Link} from 'react-router-dom';

import '../css/popular-authors.css';

type PopularAuthorsProps = {
    id: string,
    name: string,
    blogCount: number,
    likesCount: number,
}

const PopularAuthors = ({
    id,
    name,
    blogCount,
    likesCount,
}: PopularAuthorsProps): any => {
    return(
        <>
            <Link to={"/authorProfile/"+id}>
            <div className="popular-item">
                <div className="stats-flex-left">
                    <p className="popular-author">{name}</p>
                </div>
                <div className="ml-auto stats-flex">
                    <div className="popular-author-blog-cnt">
                        <p className="popular-author-blog-cnt-head">Blogs</p>
                        <div className="text-center popular-author-blog-cnt-block">{blogCount}</div>
                    </div>
                    <div className="popular-author-likes-cnt">
                        <p className="popular-author-likes-cnt-head">Likes</p>
                        <div className="text-center popular-author-likes-likes-block">{likesCount}</div>
                    </div>
                </div>
            </div>
            </Link>
        </>
    )
}

export default PopularAuthors;
