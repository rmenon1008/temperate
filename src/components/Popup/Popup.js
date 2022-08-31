import Logo from "../Logo/Logo"
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
                <NewUpdateCard />
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

const NewUpdateCard = () => {
    const context = useContext(UserStorageContext);
    const userStorage = context.userStorage;
    const setUserStorage = context.setUserStorage;

    const dismiss = () => {
        setUserStorage((prev) => {
            return {
                ...prev,
                global: {
                    ...prev.global,
                    updateCardDismissed: true
                }
            }
        })
    }

    if (!userStorage.global.updateCardDismissed) {
        return (
            <div className="popup-content-card">
                <span className="heading">Updated to version 2! <ArrowCircleUp /></span>

                <p>Here's what's new:</p>
                <ul>
                    <li>More readable links and graphs on images</li>
                    <li>If you don't like the daily image, you can swap it</li>
                    <li>Images continue to work when offline</li>
                    <li>More customization in the options page</li>
                </ul>
                <button className='popup-card-close' onClick={dismiss}>
                    <X />&nbsp;&nbsp;Dismiss
                </button>
            </div>
        )
    } else {
        return null
    }
}

export default Popup;