import { Logo } from "../Logo/Logo"
import './Popup.css'
import { Cog, ChatAlt, Star, ArrowCircleUp, X } from '@styled-icons/heroicons-outline';
import React, { useContext } from "react";
import { UserStorageContext } from "../UserStorage/UserStorage";

const Popup = (props) => {
    const options = () => { window.open("?options") }
    const feedback = () => { window.open("mailto:rohan@rohanmenon.com") }
    const rate = () => { window.open("https://chrome.google.com/webstore/detail/temperate/bmjmchepldjmchgjkeedkgffpjglnfjc") }

    return (
        <div className="popup">
            <div className='logo-container'>
                <Logo />
            </div>
            <div className='popup-content'>
                <button className='popup-button dark' onClick={options}>
                    Options
                    <Cog />
                </button>
                <button className='popup-button' onClick={feedback}>
                    Feedback
                    <ChatAlt />
                </button>
                <button className='popup-button' onClick={rate}>
                    Rate the extension
                    <Star />
                </button>
            </div>
        </div>
    )
}

export default Popup;