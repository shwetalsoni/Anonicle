import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import {Route, Switch, HashRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import Home from '../components/Home';
import Blog from '../components/Blog';
import AuthorProfile from '../components/AuthorProfile';
import Testing from '../components/testing';
import CreateBlog from '../components/CreateBlog';

type RouterProps = {
  Tezos: TezosToolkit;
  setTezos: Dispatch<SetStateAction<any>>;
  setContract: Dispatch<SetStateAction<any>>;
  setWallet: Dispatch<SetStateAction<any>>;
  setUsername: Dispatch<SetStateAction<string>>;
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
  username: string;
}

const Router = ({
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
    setUsername,
    username,
}: RouterProps): any => {
    return (
      <HashRouter>
        <Navbar
          Tezos={Tezos}
          setTezos={setTezos}
          setContract={setContract}
          setPublicToken={setPublicToken}
          setWallet={setWallet}
          setUserAddress={setUserAddress}
          setUserBalance={setUserBalance}
          setStorage={setStorage}
          contractAddress={contractAddress}
          setBeaconConnection={setBeaconConnection}
          wallet={wallet}
          userAddress={userAddress}
          userBalance={userBalance}
          setUsername={setUsername}
          contract={contract}
          storage={storage}
        />
        <Switch>
            <Route exact
              path="/"
              render={() => <Home
                setStorage={setStorage}
                storage={storage}
                contract={contract}
              />}
            />
            <Route exact
              path="/blog"
              render={() => <Blog
                Tezos={Tezos}
                setStorage={setStorage}
                contractAddress={contractAddress}
                wallet={wallet}
                userAddress={userAddress}
                userBalance={userBalance}
                storage={storage}
                contract={contract}
              />}
            />
            <Route exact
              path="/blog/:id"
              render={() => <Blog
                Tezos={Tezos}
                setStorage={setStorage}
                contractAddress={contractAddress}
                wallet={wallet}
                userAddress={userAddress}
                userBalance={userBalance}
                storage={storage}
                contract={contract}
              />}
            />
            <Route exact path="/authorProfile" component={AuthorProfile} />
            <Route exact
              path="/authorProfile/:authorAddress"
              render={() => <AuthorProfile
                Tezos={Tezos}
                contractAddress={contractAddress}
                wallet={wallet}
                userAddress={userAddress}
                userBalance={userBalance}
                storage={storage}
                contract={contract}
              />}
            />
            <Route exact 
              path="/testing"
              render={() => <Testing 
                Tezos={Tezos}
                setTezos={setTezos}
                setContract={setContract}
                setPublicToken={setPublicToken}
                setWallet={setWallet}
                setUserAddress={setUserAddress}
                setUserBalance={setUserBalance}
                setStorage={setStorage}
                contractAddress={contractAddress}
                setBeaconConnection={setBeaconConnection}
                wallet={wallet}
                userAddress={userAddress}
                userBalance={userBalance}
                storage={storage}
              />}
            />
            <Route exact 
                path="/createBlog" 
                render={() => <CreateBlog 
                    setStorage={setStorage}
                    contract={contract}
                    userAddress={userAddress}
                    username={username}
                />}
            />
        </Switch>
      </HashRouter>
    )
}

export default Router;
