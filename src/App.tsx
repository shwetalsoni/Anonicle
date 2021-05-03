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
      openModal={openModal}
    />
  )

//   if (publicToken && (!userAddress || isNaN(userBalance))) {
//     return (
//       <div className="main-box">
//         <h1>Taquito Boilerplate</h1>
//         <div id="dialog">
//           <header>Try the Taquito Boilerplate App!</header>
//           <div id="content">
//             <p className="text-align-center">
//               <i className="fas fa-broadcast-tower"></i>&nbsp; Connecting to
//               your wallet
//             </p>
//             <div
//               dangerouslySetInnerHTML={generateQrCode()}
//               className="text-align-center"
//             ></div>
//             <p id="public-token">
//               {copiedPublicToken ? (
//                 <span id="public-token-copy__copied">
//                   <i className="far fa-thumbs-up"></i>
//                 </span>
//               ) : (
//                 <span
//                   id="public-token-copy"
//                   onClick={() => {
//                     if (publicToken) {
//                       navigator.clipboard.writeText(publicToken);
//                       setCopiedPublicToken(true);
//                       setTimeout(() => setCopiedPublicToken(false), 2000);
//                     }
//                   }}
//                 >
//                   <i className="far fa-copy"></i>
//                 </span>
//               )}

//               <span>
//                 Public token: <span>{publicToken}</span>
//               </span>
//             </p>
//             <p className="text-align-center">
//               Status: {beaconConnection ? "Connected" : "Disconnected"}
//             </p>
//           </div>
//         </div>
//         <div id="footer">
//           <img src="built-with-taquito.png" alt="Built with Taquito" />
//         </div>
//       </div>
//     );
//   } else if (userAddress && !isNaN(userBalance)) {
//     return (
//       <div className="main-box">
//         <h1>Taquito Boilerplate</h1>
//         <div id="tabs">
//           <div
//             id="transfer"
//             className={activeTab === "transfer" ? "active" : ""}
//             onClick={() => setActiveTab("transfer")}
//           >
//             Make a transfer
//           </div>
//           <div
//             id="contract"
//             className={activeTab === "contract" ? "active" : ""}
//             onClick={() => setActiveTab("contract")}
//           >
//             Interact with a contract
//           </div>
//         </div>
//         <div id="dialog">
//           <div id="content">
//             {activeTab === "transfer" ? (
//               <div id="transfers">
//                 <h3 className="text-align-center">Make a transfer</h3>
//                 <Transfers
//                   Tezos={Tezos}
//                   setUserBalance={setUserBalance}
//                   userAddress={userAddress}
//                 />
//               </div>
//             ) : (
//               <div id="increment-decrement">
//                 <h3 className="text-align-center">
//                   Current counter: <span>{storage}</span>
//                 </h3>
//                 <UpdateContract
//                   contract={contract}
//                   setUserBalance={setUserBalance}
//                   Tezos={Tezos}
//                   userAddress={userAddress}
//                   setStorage={setStorage}
//                 />
//               </div>
//             )}
//             <p>
//               <i className="far fa-file-code"></i>&nbsp;
//               <a
//                 href={`https://better-call.dev/florencenet/${contractAddress}/operations`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 {contractAddress}
//               </a>
//             </p>
//             <p>
//               <i className="far fa-address-card"></i>&nbsp; {userAddress}
//             </p>
//             <p>
//               <i className="fas fa-piggy-bank"></i>&nbsp;
//               {(userBalance / 1000000).toLocaleString("en-US")} ꜩ
//             </p>
//           </div>
//           <DisconnectButton
//             wallet={wallet}
//             setPublicToken={setPublicToken}
//             setUserAddress={setUserAddress}
//             setUserBalance={setUserBalance}
//             setWallet={setWallet}
//             setTezos={setTezos}
//             setBeaconConnection={setBeaconConnection}
//           />
//         </div>
//         <div id="footer">
//           <img src="built-with-taquito.png" alt="Built with Taquito" />
//         </div>
//       </div>
//     );
//   } else if (!publicToken && !userAddress && !userBalance) {
//     return (
//       <div className="main-box">
//         <div className="title">
//           <h1>Taquito Boilerplate</h1>
//           <a href="https://app.netlify.com/start/deploy?repository=https://github.com/ecadlabs/taquito-boilerplate">
//             <img
//               src="https://www.netlify.com/img/deploy/button.svg"
//               alt="netlify-button"
//             />
//           </a>
//         </div>
//         <div id="dialog">
//           <header>Welcome to Taquito Boilerplate App!</header>
//           <div id="content">
//             <p>Hello!</p>
//             <p>
//               This is a template Tezos dApp built using Taquito. It's a starting
//               point for you to hack on and build your own dApp for Tezos.
//               <br />
//               If you have not done so already, go to the{" "}
//               <a
//                 href="https://github.com/ecadlabs/taquito-boilerplate"
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 Taquito boilerplate Github page
//               </a>{" "}
//               and click the <em>"Use this template"</em> button.
//             </p>
//             <p>Go forth and Tezos!</p>
//           </div>
//           <ConnectButton
//             Tezos={Tezos}
//             setContract={setContract}
//             setPublicToken={setPublicToken}
//             setWallet={setWallet}
//             setUserAddress={setUserAddress}
//             setUserBalance={setUserBalance}
//             setStorage={setStorage}
//             contractAddress={contractAddress}
//             setBeaconConnection={setBeaconConnection}
//             wallet={wallet}
//           />
//         </div>
//         <div id="footer">
//           <img src="built-with-taquito.png" alt="Built with Taquito" />
//         </div>
//       </div>
//     );
//   } else {
//     return <div>An error has occurred</div>;
//   }
};

export default App;
