import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import Modal from 'react-modal';
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import ModalTitle from "react-bootstrap/esm/ModalTitle";
import ModalBody from "react-bootstrap/esm/ModalBody";

import {
  NetworkType,
  BeaconEvent,
  defaultEventCallbacks
} from "@airgap/beacon-sdk";

import { parseStorage } from './Home';
import '../css/connect-wallet.css';

type ButtonProps = {
  Tezos: TezosToolkit;
  setContract: Dispatch<SetStateAction<any>>;
  setWallet: Dispatch<SetStateAction<any>>;
  setUserAddress: Dispatch<SetStateAction<string>>;
  setUserBalance: Dispatch<SetStateAction<number>>;
  setStorage: Dispatch<SetStateAction<any>>;
  contractAddress: string;
  setBeaconConnection: Dispatch<SetStateAction<boolean>>;
  setPublicToken: Dispatch<SetStateAction<string | null>>;
  wallet: BeaconWallet;
  setUsername: Dispatch<SetStateAction<string>>;
  userAddress: string;
  contract: any;
  storage: any;
};

const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
    }
};

const ConnectButton = ({
    Tezos,
    setContract,
    setWallet,
    setUserAddress,
    setUserBalance,
    setStorage,
    contractAddress,
    setBeaconConnection,
    setPublicToken,
    wallet,
    setUsername,
    userAddress,
    contract,
    storage,
}: ButtonProps): JSX.Element => {

    const [modalIsOpen,setIsOpen] = useState(false);
    const [name, setName] = useState("Anonymous");

    Modal.setAppElement('body')

    function openModal() {
        setIsOpen(true);
    }

    function closeModal(){
        setIsOpen(false);
    }

    const handleClick = async () => {
        if(storage && userAddress){
            let [users, blogs] = parseStorage(storage);
            if(users.has(userAddress)){
                console.log("exists")
                setUsername(users.get(userAddress));
                closeModal();
            }else{
                closeModal();
                try {
                    const op = await contract.methods.addUser(userAddress, name).send();
                    await op.confirmation();
                    console.log("Set Name");
                    setUsername(name);
                    contract.storage()
                    .then((storage: any) => {
                        setStorage(storage);
                    })
                } catch(error){
                    console.log(error)
                }
            }
        }
        
    }

    function handleNameChange(e: any) {
        setName(e.target.value)
    }

    const setup = async (userAddress: string): Promise<void> => {
        setUserAddress(userAddress);
        console.log(userAddress);
        // updates balance
        const balance = await Tezos.tz.getBalance(userAddress);
        setUserBalance(balance.toNumber());
        // creates contract instance
        const contract = await Tezos.wallet.at(contractAddress);
        const storage: any = await contract.storage();
        setContract(contract);
        setStorage(storage);
        console.log('sadsaf')
        const [users, blogs] = parseStorage(storage);
        if(users.has(userAddress)){
            console.log("exists")
            setUsername(users.get(userAddress));
            closeModal();
        }else{
            console.log("not exists")
            openModal();
        }

    };

    const connectWallet = async (): Promise<void> => {
        // openModal();
        try {
            await wallet.requestPermissions({
                network: {
                type: NetworkType.EDONET,
                rpcUrl: "https://edonet.smartpy.io"
            }
        });
        // gets user's address
        const userAddress = await wallet.getPKH();
        await setup(userAddress);
            setBeaconConnection(true);
        } catch (error) {
            console.log(error);
        }
  };

  useEffect(() => {
    (async () => {
        // creates a wallet instance
        const wallet = new BeaconWallet({
            name: "Anonicle",
            preferredNetwork: NetworkType.EDONET,
            disableDefaultEvents: true, // Disable all events / UI. This also disables the pairing alert.
            eventHandlers: {
                // To keep the pairing alert, we have to add the following default event handlers back
                [BeaconEvent.PAIR_INIT]: {
                    handler: defaultEventCallbacks.PAIR_INIT
                },
                [BeaconEvent.PAIR_SUCCESS]: {
                    handler: data => setPublicToken(data.publicKey)
                }
            }
      });
      Tezos.setWalletProvider(wallet);
      setWallet(wallet);
      // checks if wallet was connected before
      const activeAccount = await wallet.client.getActiveAccount();
        if (activeAccount) {
            const userAddress = await wallet.getPKH();
            await setup(userAddress);
            setBeaconConnection(true);
        }
    })();
  }, []);

  return (
      
    <>
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Donation"
            >
            <ModalHeader>
                <ModalTitle className="modal-title">
                    Set your username
                </ModalTitle>
                <button onClick={closeModal} className="close-btn">close</button>
            </ModalHeader>
            <ModalBody>
                <form>
                    <input onChange={handleNameChange} value={name} className="modal-input"/>
                    <button onClick={handleClick} className="modal-donate-btn">Submit</button>
                </form>
            </ModalBody>
        </Modal>
        <button className="btn btn-round-hollow" onClick={connectWallet}>
            Sign In
        </button>
    </>
        
        
  
  );
};

export default ConnectButton;
