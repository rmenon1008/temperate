import './Background.css';
import React, { useEffect, useRef, useContext, useState } from 'react';
import Attribution from '../Attribution/Attribution';
import { UserStorageContext } from '../UserStorage/UserStorage';

const API_BASE = "http://api.rohanmenon.com/image/"

const Background = (props) => {
    const backgroundImgRef = useRef();

    const context = useContext(UserStorageContext);
    const userStorage = context.userStorage;
    const setUserStorage = context.setUserStorage;

    // useEffect(() => {
    //     if (props.imgUrl) {
    //         backgroundImgRef.current.addEventListener("load", () => {
    //             console.log("background loaded");
    //             backgroundImgRef.current.style.visibility = 'visible';
    //         });
    //     } else {
    //         backgroundImgRef.current.style.visibility = 'visible';
    //     }
    // }, [props.imgUrl]);
    const [profileName, setProfileName] = useState(undefined);
    const [profileLink, setProfileLink] = useState(undefined);
    const [loaded, setLoaded] = useState(false);
    // const [opacity, setOpacity] = useState(0);

    const updateImage = () => {
        let imageQuery = API_BASE + userStorage.background.imgSource;
        if (userStorage.background.imgOffset && userStorage.background.imgOffset !== 0) {
            imageQuery += "_" + (userStorage.background.imgOffset + 1);
        }
        fetch(imageQuery).then(response => response.json()).then(data => {
            setProfileName(data.credit);
            setProfileLink(data.profile);
            if (data.url != userStorage.background.imgUrl) {
                resetImageAnimation();
                setLoaded(false);
                setUserStorage((prev) => {
                    return {
                        ...prev,
                        background: {
                            ...prev.background,
                            imgUrl: data.url,
                            imgOffset: userStorage.background.justSwapped ? prev.background.imgOffset : 0,
                            justSwapped: false,
                        }
                    }
                });
            }
            if (userStorage.colors.autoColor) {
                setUserStorage((prev) => {
                    return {
                        ...prev,
                        colors: {
                            ...prev.colors,
                            cbg: "#ffffff",
                            c1: data.primaryColor,
                            c2: data.color,
                            c3: data.bgColor,
                        }
                    }
                });
            }
        });
    }

    const resetImageAnimation = () => {
        const el = backgroundImgRef.current;
        el.style.animation = 'none';
        console.log(el.offsetHeight); /* trigger reflow */
        el.style.animation = null;
    }

    useEffect(() => {
        setTimeout(() => {
            setLoaded(true);
        }, 1000);
    }, [userStorage.background.imgUrl]);

    useEffect(() => {
        if (userStorage.background.autoImage) {
            updateImage();
        }
    }, [userStorage.background.imgSource, userStorage.background.imgOffset, userStorage.colors.autoColor, userStorage.colors.autoImage]);

    const makeVisible = () => {
        // setTimeout(() => {
        //     backgroundImgRef.current.style.transform = "scale(1)";
        //     backgroundImgRef.current.style.opacity = 1;
        // }, 10);
        setLoaded(true);
    }

    const swapImage = (e) => {
        setUserStorage((prev) => {
            return {
                ...prev,
                background: {
                    ...prev.background,
                    imgOffset: (prev.background.imgOffset + 1) % 3,
                    justSwapped: true,
                }
            }
        });
    }

    return (
        <div className="Background">
            <img className={!loaded ? "unloaded" : null} style={{ opacity: loaded ? 1 : 0 }} ref={backgroundImgRef} alt="background" onLoad={makeVisible} src={userStorage.background.imgUrl} draggable="false" />
            <Attribution name={profileName} link={profileLink} show={!!profileName} swapImage={swapImage} />
        </div>
    );
}

export default Background;