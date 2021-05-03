import React, { Dispatch, SetStateAction } from "react";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { TezosToolkit } from "@taquito/taquito";

import '../css/connect-wallet.css';

interface ButtonProps {
  wallet: BeaconWallet | null;
  setPublicToken: Dispatch<SetStateAction<string | null>>;
  setUserAddress: Dispatch<SetStateAction<string>>;
  setUserBalance: Dispatch<SetStateAction<number>>;
  setWallet: Dispatch<SetStateAction<any>>;
  setTezos: Dispatch<SetStateAction<TezosToolkit>>;
  setBeaconConnection: Dispatch<SetStateAction<boolean>>;
  setUsername: Dispatch<SetStateAction<string>>;
}

const DisconnectButton = ({
  wallet,
  setPublicToken,
  setUserAddress,
  setUserBalance,
  setWallet,
  setTezos,
  setBeaconConnection,
  setUsername
}: ButtonProps): JSX.Element => {
  const disconnectWallet = async (): Promise<void> => {
    setUserAddress("");
    setUserBalance(0);
    setWallet(null);
    const tezosTK = new TezosToolkit("https://api.tez.ie/rpc/edonet");
    setTezos(tezosTK);
    setBeaconConnection(false);
    setPublicToken(null);
    console.log("disconnecting wallet");
    if (wallet) {
      await wallet.client.removeAllAccounts();
      await wallet.client.removeAllPeers();
      await wallet.client.destroy();
    }
  };

  return (
    <div className="buttons">
      <button className="btn btn-round-hollow" onClick={disconnectWallet}>
          Sign Out
      </button>
    </div>
  );
};

export default DisconnectButton;
