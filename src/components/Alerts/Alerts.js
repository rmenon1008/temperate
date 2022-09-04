import React, { useContext, useEffect } from 'react';
import { UserStorageContext } from '../UserStorage/UserStorage';
import { InlineArrow } from '../Logo/Logo';
import './Alerts.css';

const Alerts = (props) => {
    const context = useContext(UserStorageContext);
    const userStorage = context.userStorage;
    const setUserStorage = context.setUserStorage;


    const enablePreciseLocation = () => {
        setUserStorage((prev) => {
            return {
                ...prev,
                global: {
                    ...prev.global,
                    usePreciseLocation: true,
                }
            }
        });
    }

    const disablePreciseLocation = () => {
        setUserStorage((prev) => {
            return {
                ...prev,
                global: {
                    ...prev.global,
                    usePreciseLocation: false,
                    locationOverride: "",
                }
            }
        });
    }

    const dismiss = () => {
        setUserStorage((prev) => {
            return {
                ...prev,
                global: {
                    ...prev.global,
                    updateCardDismissed: true,
                }
            }
        });
    }

    useEffect(() => {
        if (userStorage.global.usePreciseLocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                setUserStorage((prev) => {
                    return {
                        ...prev,
                        global: {
                            ...prev.global,
                            locationOverride: lat + "," + lon,
                        }
                    }
                });
            }, (error) => {
                setUserStorage((prev) => {
                    return {
                        ...prev,
                        global: {
                            ...prev.global,
                            locationOverride: "",
                        }
                    }
                });
                console.log("Error getting location: " + error.message);
            });
        }
    }, [userStorage.global.usePreciseLocation]);

    return (
        <div className="Alerts">
            {!userStorage.global.updateCardDismissed &&
                <div className="alert-card">
                    <p>
                        <h1>Welcome to Temperate V2!</h1>
                        <div style={{ height: '0.75em' }} />
                        Head over to the <a href="/index.html?options">options page</a> to customize your new tab.
                    </p>
                    <button onClick={() => dismiss()}>Dismiss</button>
                </div>
            }
            {userStorage.global.usePreciseLocation === undefined || userStorage.global.usePreciseLocation === null &&
                <div className="alert-card">
                    <p>
                        Temperate can use your precise location to get more accurate weather info.
                        <div style={{ height: '0.75em' }} />
                        All features will work regardless.
                    </p>
                    <button onClick={() => { enablePreciseLocation() }}>Give access</button>
                    <button onClick={() => { disablePreciseLocation() }}>Don't allow</button>
                </div>
            }
        </div>
    );
}

export default Alerts;