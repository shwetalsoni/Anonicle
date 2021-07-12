import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import { TezosToolkit } from "@taquito/taquito";
import Modal from 'react-modal';

import '../css/donate-btn.css';
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import ModalTitle from "react-bootstrap/esm/ModalTitle";
import ModalBody from "react-bootstrap/esm/ModalBody";

type DonationButtonProps = {
    Tezos: TezosToolkit;
    userAddress: string;
    authorAddress: string;
    authorName: string;
};

const customStyles = {
    overlay : {
        backgroundColor: 'rgba(255, 255, 255, 0.75)'
    },
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
        background            : '#121212',
    }
};

const DonateButton = ({
    Tezos,
    userAddress,
    authorAddress,
    authorName
}: DonationButtonProps ): JSX.Element => {

    const [modalIsOpen,setIsOpen] = useState(false);
    const [amount, setAmount] = useState(10);

    Modal.setAppElement('body')

    function openModal() {
        setIsOpen(true);
    }

    function closeModal(){
        setIsOpen(false);
    }

    const handleClick = async () => {
        console.log(userAddress, authorAddress)
        try {
            const op = await Tezos.wallet
                .transfer({to: authorAddress, amount: amount})
                .send()
            await op.confirmation()
            console.log("Donated!");
        } catch(error){
            console.log(error)
        }
    }

    function handleAmountChange(e: any) {
        setAmount(parseFloat(e.target.value))
    }

    return (
        <div>
            <button onClick={openModal} className="btn donate-btn">Support</button>
            <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Donation"
            >
            <ModalHeader>
                <ModalTitle className="modal-title">
                    Support {authorName}
                </ModalTitle>
                <button onClick={closeModal} className="close-btn">close</button>
            </ModalHeader>
            <ModalBody>
                <p className="p-text">The payment will be complety secure and anonymous.</p>
                <form>
                    <label className="enter-amount">Enter Amount</label><br/>
                    <input onChange={handleAmountChange} className="modal-input"/> <span className="tez">tez</span>
                    <button onClick={handleClick} className="modal-donate-btn">Donate</button>
                </form>
            </ModalBody>
            </Modal>
        </div>
    )
};

export default DonateButton;