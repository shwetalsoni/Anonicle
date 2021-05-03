import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";


type RouterProps = {
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
}
  

const Testing = ({
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
}: RouterProps): any => {
    console.log(storage)
    return(
        <>
            <h1>Hello</h1>
            <p>storage</p>
            {JSON.stringify(storage)}
            {userAddress}
        </>
    )
}

export default Testing;
