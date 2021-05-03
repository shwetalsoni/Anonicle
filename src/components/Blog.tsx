import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'
import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import ReactMarkdown from 'react-markdown'
import {render} from 'react-dom'

import DonateButton from './DonateButton';
import {parseStorage} from './Home';

import '../css/blog.css';

import Facebook from '../assets/facebook.png';
import Linkedin from '../assets/linkedin.png';
import CopyLink from '../assets/link.png';
import Twitter from '../assets/twitter.png';
import Like from '../assets/like.svg';
import Loader from './Loader';
import LikeLoader from './LikeLoader';

type BlogProps = {
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

const Blog = ({
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
}: BlogProps): any => {

    const { id } = useParams<{id: string}>();
    
    const [exists, setExists] = useState<boolean>(true);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [name, setName] = useState<string>("Anonymous");
    const [blog, setBlog] = useState<any>({});
    const [liked, setLike] = useState<boolean>(true);
    
    const defaultContent = `*Film industry sexism fired a commitment to feminism in the star, next in Beauty and the Beast. But, despite a UN women’s role, some are unconvinced of her dedication to the cause.*

Born Emma Charlotte Duerre Watson in Paris in 1990, Watson’s British parents were lawyers who divorced when she and her brother were young; the family returned to England, where Watson grew up between Oxfordshire and London.
    
Prior to her casting in Harry Potter, Watson’s acting experience was sorely limited: she had played three small roles in childhood productions, including a turn as “an angry cook” in a production of Alice in Wonderland. But after the recommendation of a theatre teacher and eight auditions, Watson was cast as Hermione alongside Daniel Radcliffe’s Harry Potter and Rupert Grint’s Ron Weasley. From the debut of the first film, Harry Potter and the Sorcerer’s Stone (Harry Potter and the Philosopher’s Stone in the UK), in 2001, the three unknown child actors became some of the best-known performers in the world. By 2009, with the release of Harry Potter and the Half-Blood Prince, Watson’s earnings in the series made her the industry’s most highly paid actress.`

    const shareText = "Checkout this awesome article on Anonicle!";
    const shareLink = window.location.href.replace('#', '%23');
    
    const loadFromStorage = (storage: any) => {
        const [users, blogs] = parseStorage(storage);
        // console.log(users, blogs);
        if(blogs.has(id)){
            setBlog(blogs.get(id));
            let blog = blogs.get(id);
            if(users.has(blog.publicKey)){
                setName(users.get(blog.publicKey));
            }
            console.log(blogs.get(id));
            setExists(true);
        }else{
            setExists(false);
        }
        setLoaded(true);
    }

    useEffect(() => {
        let content = blog.content;
        if(!content){
            content = defaultContent;
        }
        let contentParent = document.getElementById('article-content');
        console.log(contentParent);
        if(contentParent){
            render(<ReactMarkdown>{content}</ReactMarkdown>, contentParent);
        }
        setTimeout(()=> {
            contentParent = document.getElementById('article-content');
            if(contentParent){
                render(<ReactMarkdown>{content}</ReactMarkdown>, contentParent);
            }
        },500)
    }, [blog])

    useEffect(() => {
        console.log(storage);
        if(contract && id){
            if(storage){
                loadFromStorage(storage);
            }
            setLoaded(false);
            contract.storage()
            .then((storage: any) => {
                console.log(storage);
                setStorage(storage);
                loadFromStorage(storage);
            })
        }
        if(!id){
            setBlog({});
        }
    }, [contract, id])

    async function like() {
        if(!liked) return;
        setLike(false)
        try {
            const op = await contract.methods.like(id).send();
            await op.confirmation();
            contract.storage()
            .then((storage: any) => {
                setStorage(storage);
                loadFromStorage(storage);
                setLike(true);
            })
            console.log("Liked")
        }catch(err) {
            console.error(err)
            setLike(true);
        }
        
    }

    const pulseAnimation = "@keyframes pulse { 0% { transform: scale(1); } 100% { transform: scale(1.2); } }";

    const iconStyle = {
        // color: '#f11',
        animationName: 'pulse',
        animationDuration: `0.5s`,
        animationDirection: 'alternate',
        animationIterationCount: 'infinite',
        animationTimingFunction: 'linear'
      };

    if(!loaded && id){
        return (
            <Loader />
        )
    }else if(exists){
        return(
            <div className="container">
                <div className="article-header">
                    <div className="row">
                        <div className="col-md-6">
                            <img src={blog.imageUrl} className="img-fluid article-img" alt="" />
                        </div>
                        <div className="col-md-6">
                            <h1 className="article-title">
                                {blog.title? (
                                    blog.title
                                ):(
                                    "Feminist to the core or carefully polished brand"
                                )}
                            </h1>
                                <div className="flex">
                                    <div className="flex-left mr-auto">
                                        <Link to={'/authorProfile/'+blog.publicKey}>
                                            <h5 className="article-author">
                                                {name}
                                            </h5>
                                        </Link>
                                        <h5 className="article-date">Posted on{" "}
        
                                            <span className="posted-on-date">
                                            {blog.date? (
                                                (() => {
                                                    let d = new Date(blog.date.toNumber());
                                                    console.log(d);
                                                    return d.getDate() + '-' + (d.getMonth()+1) + '-' + d.getFullYear();
                                                })()
                                            ):(
                                                "28-04-21"
                                            )}
                                            </span>
                                        </h5>
                                    </div>
                                    <div className="flex-right">
                                        <a href={`http://twitter.com/share?text=${shareText}&url=${shareLink}`}><img src={Twitter} className="share" alt="" /></a>
                                        <a href={`http://www.facebook.com/sharer.php?u=${shareLink}}`}><img src={Facebook} className="share" alt="" /></a>
                                        {/* <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareLink}&title=${shareText}&summary=articleSummary&source=Anonicle`}><img src={Linkedin} className="share" /></a> */}
                                        <button className="share-copy" onClick={() => {navigator.clipboard.writeText(window.location.href)}}><img src={CopyLink} className="share" alt="" /></button>
                                    </div>
                                </div>
                               
                            {/* <div className="row"> */}
                                <div className="flex">
                                    <div className="mr-auto flex-left-like">
                                        <style type="text/css">{ pulseAnimation }</style>
                                        <>
                                            <img className="like" onClick={like} {...(liked ? {}: {style: iconStyle})} src={Like} alt=""></img>
                                            <span className="like-count" style={undefined}> {blog.likes.toNumber()} likes </span>
                                        </>
                                    </div>
                                    <div className="ml-auto flex-right">
                                        <DonateButton
                                            Tezos={Tezos}
                                            setUserBalance={setUserBalance}
                                            userAddress={userAddress}
                                            authorAddress={blog.publicKey}
                                            authorName={name}
                                        />
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
                <div className="article-description">
                    <div className="row">
                        <div className="col-md-9 mx-auto">
                            {blog.content? (
                                <div id="article-content" className="article-content">
                                    
                                    {blog.content}
                                </div>
                            ):(
                                <>
                                    <div id="article-content" className="article-content">
                                        
                                    </div>
                                </>
                            )}
                            
                        </div>

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

export default Blog;
