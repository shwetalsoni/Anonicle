import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";

import DonateButton from './DonateButton';
import BlogCard from './BlogCard';
import {parseStorage} from './Home';
import Loader from './Loader';

import '../css/author-profile.css';

type AuthorProfileProps = {
    Tezos: TezosToolkit;
    contractAddress: string;
    wallet: BeaconWallet;
    userAddress: string;
    userBalance: number;
    storage: any;
    contract: any;
}

const AuthorProfile = ({
    Tezos,
    contractAddress,
    wallet,
    userAddress,
    userBalance,
    storage,
    contract,
}: AuthorProfileProps): any => {
    const { authorAddress } = useParams<{authorAddress: string}>();

    const [exists, setExists] = useState<boolean>(true);
    const [name, setName] = useState<string>("Anonymous");
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [blogCount, setBlogCount] = useState<number>();
    const [likesCount, setLikesCount] = useState<number>();

    

    useEffect(() => {
        if(contract){
            setLoaded(false);
            contract.storage()
            .then((storage: any) => {
                console.log(storage);
                const [users, blogsMap] = parseStorage(storage);
                // console.log(users, blogsMap);
                if(users.has(authorAddress)){
                    setName(users.get(authorAddress));
                    let blogList:any[] = [];
                    let blogCount = 0;
                    let likesCount = 0;
                    blogsMap.forEach((blog, id) => {
                        if(blog.publicKey === authorAddress){
                            blog.id = id;
                            blog.author = users.get(blog.publicKey);
                            blogList.push(blog);
                            blogCount++;
                            likesCount += parseInt(blog.likes);
                        }
                    });

                    setBlogs(blogList)
                    setBlogCount(blogCount)
                    setLikesCount(likesCount)
                    console.log(blogList);
                    console.log("likesCount",likesCount);
                    setExists(true);
                }else{
                    setExists(false);
                }
                setLoaded(true);
                
            });
            
        }
    }, [contract, authorAddress])

    

    if(!loaded){
        return (
            <Loader />
        )
    }else if(exists){
        return (
            <div>
                
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <h1 className="author-name">{name}</h1>
                            <div className="author-flex">
                                <div className="author-address-block">
                                    {authorAddress}
                                </div>
                                <div className="ml-auto author-flex-right">
                                    <DonateButton
                                        Tezos={Tezos}
                                        userAddress={userAddress}
                                        authorAddress={authorAddress}
                                        authorName={name}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <h5 className="blogs-heading">Blogs By Author</h5>
                        </div>
                    </div>
                    <div className="div-cnt row">
                        <div className="col-md-3">
                            <div className="blog-cnt-flex">
                                <div className="blog-cnt"><h5 className="count">{blogCount+""}</h5></div>
                                <h5 className="total-blogs">Total Blogs</h5>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="likes-cnt-flex">
                                <div className="likes-cnt"><h5 className="count">{likesCount+""}</h5></div>
                                <h5 className="total-likes">Total Likes</h5>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {blogs.map((blog, i) => 
                        <div className="col-md-3" key={blog.id}>
                            <BlogCard
                                key={blog.id}
                                id={blog.id}
                                title={blog.title}
                                content={blog.content}
                                topic={blog.topic}
                                imageUrl={blog.imageUrl}
                                author={blog.author}
                                publicKey={blog.publicKey}
                                date={blog.date}
                                likes={blog.likes}
                            />
                        </div>
                        )}
                    </div>
                </div>
                
            </div>
        )
    }else{
        return (
            <h1>Not found</h1>
        )
    }
}

export default AuthorProfile;
