import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { Link } from 'react-router-dom';

import ConnectButton from './ConnectWallet';
import DisconnectButton from './DisconnectWallet';

import "../css/navbar.css";

type NavbarProps = {
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
    setUsername: Dispatch<SetStateAction<string>>;
    username: string;
    contract: any;
    openModal: any;
};

const NavBar = ({
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
    setUsername,
    username,
    contract,
    openModal
}: NavbarProps): JSX.Element => {

  return (
    <div>
        <nav className="navbar navbar-expand-lg">
            <Link className="navbar-brand" to="/">Anonicle</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item active">
                        <Link to="/createBlog">
                            <button className="btn btn-round-hollow btn-create">Create Blog</button>
                        </Link>
                    </li>
                    <li className="nav-item active">
                        {userAddress && !isNaN(userBalance)? (
                            <DisconnectButton
                            wallet={wallet}
                            setPublicToken={setPublicToken}
                            setUserAddress={setUserAddress}
                            setUserBalance={setUserBalance}
                            setWallet={setWallet}
                            setTezos={setTezos}
                            setBeaconConnection={setBeaconConnection}
                            setUsername={setUsername}
                            />
                        ):(
                        <ConnectButton
                            Tezos={Tezos}
                            setContract={setContract}
                            setPublicToken={setPublicToken}
                            setWallet={setWallet}
                            setUserAddress={setUserAddress}
                            setUserBalance={setUserBalance}
                            setStorage={setStorage}
                            contractAddress={contractAddress}
                            setBeaconConnection={setBeaconConnection}
                            wallet={wallet}
                            setUsername={setUsername}
                            userAddress={userAddress}
                            contract={contract}
                            openModal={openModal}
                        />
                        )}
                    </li>
                </ul>
            </div>
        </nav>
       
    </div>
  );
};

export default NavBar;