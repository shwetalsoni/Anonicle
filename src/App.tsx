import React, { useState, useEffect } from "react";
import { TezosToolkit } from "@taquito/taquito";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
// import qrcode from "qrcode-generator";
import Router from "./Router/Router";
import Modal from 'react-modal';

enum BeaconConnection {
  NONE = "",
  LISTENING = "Listening to P2P channel",
  CONNECTED = "Channel connected",
  PERMISSION_REQUEST_SENT = "Permission request sent, waiting for response",
  PERMISSION_REQUEST_SUCCESS = "Wallet is connected"
}

const App = () => {
  const [Tezos, setTezos] = useState<TezosToolkit>(
    new TezosToolkit("https://edonet.smartpy.io")
  );
  const [contract, setContract] = useState<any>(undefined);
  const [publicToken, setPublicToken] = useState<string | null>("");
  const [wallet, setWallet] = useState<any>(null);
  const [username, setUsername] = useState<string>("Anonymous");
  const [userAddress, setUserAddress] = useState<string>("");
  const [userBalance, setUserBalance] = useState<number>(0);
  const [storage, setStorage] = useState<any>(null);
  const [copiedPublicToken, setCopiedPublicToken] = useState<boolean>(false);
  const [beaconConnection, setBeaconConnection] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("transfer");

  // Florencenet Increment/Decrement contract
  // const contractAddress: string = "KT1TP8o4zg14huDKhSbCKfxYmtRq2ZP6NVV4";
    const contractAddress: string = "KT1922Z1i85rj2YbvMBGgoduQTZ9Q7cKDpBp";

  // const generateQrCode = (): { __html: string } => {
  //   const qr = qrcode(0, "L");
  //   qr.addData(publicToken || "");
  //   qr.make();

  //   return { __html: qr.createImgTag(4) };
  // };

  const [modalIsOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("Anonymous");

    Modal.setAppElement('body')

    function openModal() {
        setIsOpen(true);
    }

    function closeModal(){
        setIsOpen(false);
    }

    const handleClick = async () => {
        try {
            const op = await contract.methods.addUser(userAddress, name).send()
            await op.confirmation()
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

    function handleNameChange(e: any) {
        setName(e.target.value)
    }

  useEffect(() => {
    if(!contract){
      Tezos.wallet.at(contractAddress)
      .then((contract: any) => {
          setContract(contract)
      })
    }
  }, [contract])

  return (
    <Router
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
      contract={contract}
      username={username}
      setUsername={setUsername}
    />
  )

};

export default App;
