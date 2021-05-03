import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";

import BlogCard from './BlogCard';
import '../css/home.css';
import Trending from "./Trending";
import Loader from './Loader';
import PopularAuthors from './PopularAuthors';

type HomeProps = {
    Tezos: TezosToolkit;
    setTezos: Dispatch<SetStateAction<any>>;
    setContract: Dispatch<SetStateAction<any>>;
    setWallet: Dispatch<SetStateAction<any>>;
    setUserAddress: Dispatch<SetStateAction<string>>;
    setUserBalance: Dispatch<SetStateAction<number>>;
    setStorage: Dispatch<SetStateAction<any>>;
    contractAddress: string;
    setBeaconConnection: Dispatch<SetStateAction<boolean>>;
    setPublicToken: Dispatch<SetStateAction<string | null>>;
    wallet: BeaconWallet;
    userAddress: string;
    userBalance: number;
    storage: any;
    contract: any;
}

const Home = ({
    Tezos,
    setTezos,
    setContract,
    setWallet,
    setUserAddress,
    setUserBalance,
    setStorage,
    contractAddress,
    setBeaconConnection,
    setPublicToken,
    wallet,
    userAddress,
    userBalance,
    storage,
    contract,
}: HomeProps): any => {

    const [name, setName] = useState<string>("Anonymous");
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [topAuthors, setTopAuthors] = useState<any>([]);
    const [popularBlogs, setPopularBlogs] = useState<any>([]);

    useEffect(() => {
        if(storage){
            const [users, blogsMap] = parseStorage(storage);
            console.log(users, blogsMap)
            let blogsList: any[] = [];
            blogsMap.forEach((blog, id) => {
                blog.id = id;
                blog.author = users.get(blog.publicKey);
                blogsList.push(blog);
            })
            setBlogs(blogsList);
            console.log(blogsList);

            // Trending Blogs
            // let blogsList2 = blogsList;
            
            let trendingBlogs = blogsList;
            trendingBlogs = trendingBlogs.sort((a: any, b: any): number =>{
                return b.likes - a.likes; 
            })
            trendingBlogs = trendingBlogs.slice(0, 3);
            setPopularBlogs(trendingBlogs);

            console.log(trendingBlogs);

            // Top Authors

            let topUsersMap = new Map();
            users.forEach((name, id) => {
                topUsersMap.set(id, {
                    name: name,
                    blogCount: 0,
                    likesCount: 0,
                })
            })
            blogsMap.forEach((blog, id) => {
                if(topUsersMap.has(blog.publicKey)){
                    topUsersMap.get(blog.publicKey).blogCount++;
                    topUsersMap.get(blog.publicKey).likesCount += parseInt(blog.likes);
                }
                
            })
            console.log(topUsersMap);

            let topAuthorList: any[] = [];
            topUsersMap.forEach((user, id) => {
                user.id = id
                topAuthorList.push(user)
            })
            topAuthorList = topAuthorList.sort((a: any, b: any): number => {
                return b.likesCount - a.likesCount;
            })
            topAuthorList = topAuthorList.slice(0, 3);
            console.log(topAuthorList);

            setTopAuthors(topAuthorList);


            setLoaded(true);
        }
    }, [storage])

    useEffect(() => {
        if(contract){
            contract.storage()
            .then((storage: any) => {
                console.log(storage);
                console.log(contract);
                setStorage(storage);
            });
        }
    }, [contract])


    if(!loaded){
        return (
            <Loader />
        )
    }else{
        return(
            <div className="container">
                <div className="row">
                    <div className="col-md-9 feed">
                        <div className="row filter-row">
                            <div className="filter-bar">
                                <a href="#" className="categories">All</a>
                                <a href="#" className="categories">News</a>
                                <a href="#" className="categories">Technology</a>
                                <a href="#" className="categories">Opinion</a>
                                <a href="#" className="categories">Tutorials</a>
                                <a href="#" className="categories">Cultural</a>
                                <a href="#" className="categories">Political</a>
                                <a href="#" className="categories">Misc</a>
                            </div>
                        </div>
                        <div className="row">
                            {blogs.map((blog, i) => 
                            <div className="col-md-4" key={blog.id}>
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
                    <div className="col">
                        <div className="side-column">
                            <div className="trending">
                                <div className="head-block">
                                    <h3 className="trending-head">Trending Blogs</h3>
                                </div>
                                <div className="trending-list">
                                    {popularBlogs.map((blog: any, i: any) =>
                                        <div className="trending-item" key={blog.id}>
                                            <Trending 
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
                            <div className="popular">
                                <div className="head-block">
                                    <h3 className="popular-head">Popular Authors</h3>
                                </div>
                                <div className="popular-list">
                                    {topAuthors.map((users: any, id: any) =>
                                        <PopularAuthors
                                            key={users.id}
                                            id={users.id}
                                            name={users.name}
                                            blogCount={users.blogCount}
                                            likesCount={users.likesCount}
                                        />
                                )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        )
    }
}

export function parseStorage(storage: any) {
    let users = new Map()
    let blogs = new Map()
    if(storage){
        storage.user.keyMap.forEach((key: any) => {
            let user = storage.user.valueMap.get('"'+key+'"');
            
            users.set(key, user);
        })
        storage.blog.keyMap.forEach((key: any) => {
            blogs.set(key, storage.blog.valueMap.get('"'+key+'"'));
        })
    }
    return [users, blogs]
}

export default Home;
