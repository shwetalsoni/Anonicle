import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';

import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import {v4 as uuid} from 'uuid';

import Loader from './Loader';

import '../css/create-blog.css';
import { Redirect } from 'react-router';

const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK('e518d10f4050c63e7ec6', '1c0a31804b5bad5b4167c8b229b9b9a0dafcab8a1c23240b1536cb1b681f9490');

pinata.testAuthentication().then((result: any) => {
    //handle successful authentication here
    console.log("find-here")
    console.log(result);
}).catch((err: any) => {
    //handle error here
    console.log(err);
});


type CreateBlogProps = {
    setStorage: Dispatch<SetStateAction<any>>;
    contract: any;
    userAddress: string;
    username: string;
}

const CreateBlog = ({
    setStorage,
    contract,
    userAddress,
    username
}: CreateBlogProps): any => {

    const [title, setTitle] = useState<string>("");
    const [topic, setTopic] = useState<string>("");
    const [imageURL, setImageURL] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [redirect, setRedirect] = useState<boolean>(false);
    const [publishing, setPublishing] = useState<boolean>(false);

    const handleTitleChange = (e: any) => {
        setTitle(e.target.value)
    }
    const handleTopicChange = (e: any) => {
        setTopic(e.target.value)
    }
    const handleImageURLChange = (e: any) => {
        setImageURL(e.target.value)
    }
    const handleContentChange = (e: any) => {
        setContent(e.target.value)
    }
    const handleSubmit = async (e: any) => {
        const body = {
            title: title,
            topic: topic,
            content: content,
            author: userAddress
        };
        const options = {
            pinataMetadata: {
                name: 'Anonicle: '+ title,
            },
            pinataOptions: {
                cidVersion: 0
            }
        };
        
        let ipfs = await pinata.pinJSONToIPFS(body, options)

        let ipfsLink = "ipfs://"+ipfs.IpfsHash

        console.log(ipfsLink)

        const date = + new Date();
        const blogKey = uuid();
        console.log(title, topic, imageURL, content);
        setPublishing(true);
        try{
            const op = await contract.methods.createBlog(
                blogKey,
                ipfsLink,
                date,
                imageURL,
                userAddress,
                title,
                topic
            ).send();
            await op.confirmation();
            contract.storage()
            .then((storage: any) => {
                setStorage(storage);
            })
            setRedirect(true);
        }catch(err){
            console.log(err);
        }
        setPublishing(false);
    }
   
    if(publishing){
        <Loader />
    }
    if(redirect){
        return <Redirect to='/'></Redirect>
    }

    
    

    return(
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="text-center col-2 writing-as-div">
                        <p className="writing-as">Writing as {username}</p>
                    </div>
                    <form>
                        <div className="form-group">
                            <input type="text" className="form-control title" id="title" value={title} onChange={handleTitleChange} placeholder="Title" />
                        </div>  
                        <div className="form-group">
                            <input type="text" className="form-control topic" id="topic" value={topic} onChange={handleTopicChange} placeholder="Topic" />
                        </div>  
                        <div className="form-group">
                            <textarea className="form-control" id="content" rows={12} value={content} onChange={handleContentChange} placeholder="What do you wanna talk about? (Markdown Supported)"></textarea>
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control img" id="img" value={imageURL} onChange={handleImageURLChange} placeholder="Image URL" />
                        </div>
                        <button className="btn btn-submit" onClick={handleSubmit}>Publish</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateBlog;
