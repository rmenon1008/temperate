import React, { useEffect, useCallback, useState, useRef, Fragment } from "react";
import { Cog, Refresh, Download } from '@styled-icons/heroicons-outline';
import { useContext } from 'react';
import { UserStorageContext } from '../UserStorage/UserStorage';
import { saveAs } from 'file-saver';


import './ContextMenu.css';

const ContextMenu = () => {
    const context = useContext(UserStorageContext);
    const userStorage = context.userStorage;
    const setUserStorage = context.setUserStorage;
    const [show, setShow] = useState(false);
    const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });

    const options = () => { window.open("?options") }

    const swapImage = () => {
        // This is a little hacky. We set the imgUrl to 'swapped' so that the
        // offset doesn't get reset when the image is updated. Normally, the
        // offset is reset so that when the category is changed or it'a a new
        // daily image, we start with the default image.
        setUserStorage((prev) => {
            return {
                ...prev,
                background: {
                    ...prev.background,
                    imgOffset: (prev.background.imgOffset + 1) % 3,
                    imgUrl: "swapped",
                }
            }
        });
    }

    function saveImage() {
        saveAs(userStorage.background.imgUrl, 'temperate_background.jpg');
    }

    const contextMenuRef = useRef(null);

    const handleClick = useCallback((e) => {
        console.log("click", e.target);
        setShow(false);
    }, []);

    const handleContextMenu = (event) => {
        console.log("show", show);
        setShow((prev) => {
            if (!prev) {
                event.preventDefault();
                let x = event.clientX;
                let y = event.clientY;
                const rect = contextMenuRef.current.getBoundingClientRect();
                if (y > window.innerHeight - rect.height) {
                    y = event.clientY - rect.height;
                }
                if (x > window.innerWidth - rect.width) {
                    x = event.clientX - rect.width;
                }
                setAnchorPoint({ x, y });
                return true;
            }
        });
    }

    const visibilityChange = useCallback(() => {
        console.log("visibilityChange", show);
        setShow(false);
    }, []);

    useEffect(() => {
        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("click", handleClick);
        document.addEventListener("visibilitychange", visibilityChange);
        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("click", handleClick);
            document.removeEventListener("visibilitychange", visibilityChange);
        }
    }, []);

    return (
        <div className="context-menu" ref={contextMenuRef} style={{ opacity: (show ? 1 : 0), pointerEvents: (show ? 'auto' : 'none'), top: anchorPoint.y, left: anchorPoint.x }}>
            <button className="context-menu-item" onClick={options}>
                <Cog />
                Options
            </button>
            {userStorage.background.autoImage && (
                <button className="context-menu-item" onClick={swapImage}>
                    <Refresh />
                    Swap daily image
                </button>
            )}
            {userStorage.background.imgSource && userStorage.background.imgSource !== "" && (
                <button className="context-menu-item" onClick={saveImage}>
                    <Download />
                    Save image
                </button>
            )}
        </div>
    )
}

export default ContextMenu;