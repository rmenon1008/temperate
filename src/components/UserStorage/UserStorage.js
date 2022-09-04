import React, { createContext, useEffect, useState } from "react";
import { attemptMigration } from "../../Utils";

const UserStorageContext = createContext();

const defaultOptions = {
    global: {
        use24h: false,
        locationOverride: "",
        usePreciseLocation: null,
        uiScale: 1,
        newUpdate: true,
    },
    colors: {
        autoColor: true,
        cbg: '#333333',
        c1: '#bac2d1',
        c2: '#8891A5',
        c3: '#3c403b',
    },
    background: {
        autoImage: true,
        imgSource: "mountains",
        justSwapped: false,
        imgOffset: 0,
        imgUrl: "",
    },
    temperature: {
        useCelsius: false,
        display: true,
        displayCond: true,
        useFeelsLike: false,
        tempScale: 1,
    },
    graph: {
        display: true,
        maxHours: 16,
        displayTemp: true,
        displayPercip: true,
    },
    links: [],
}

const UserStorage = (props) => {
    const [userStorage, _setUserStorage] = useState(null);

    const setUserStorage = (newUserStorage) => {
        if (typeof newUserStorage === 'function') {
            console.log("function: setting user storage to", newUserStorage(userStorage));
            _setUserStorage((prev) => {
                window.chrome.storage.sync.set({ temperateOptions: newUserStorage(prev) });
                return newUserStorage(prev)
            });

        } else {
            console.log("direct: setting user storage to", newUserStorage);
            _setUserStorage(newUserStorage);
            window.chrome.storage.sync.set({ temperateOptions: newUserStorage });
        }
    };

    useEffect(() => {
        // Get user storage from chrome storage if it exists
        window.chrome.storage.sync.get(function (result) {
            if (result.temperateOptions) {
                // set our copy of user storage to the chrome storage
                // no need to update it as it's already up to date
                _setUserStorage(result.temperateOptions);
            } else {
                console.log("No user storage found, replacing with default");
                console.log("Attempting migration")
                if (!attemptMigration(result, setUserStorage, defaultOptions)) {
                    console.log("Migration failed, using default");
                    setUserStorage(defaultOptions);
                }

            }
        });

        window.chrome.storage.onChanged.addListener((changes, area) => {
            if (changes.temperateOptions) {
                _setUserStorage(changes.temperateOptions.newValue);
            }
        });
    }, []);

    useEffect(() => {
        if (userStorage) {
            const colors = userStorage.colors;
            const cssVarMap = {
                "--cbg": colors.cbg,
                "--c1": colors.c1,
                "--c2": colors.c2,
                "--c3": colors.c3,
                "--c3a": colors.c3 + "77",
                "--c3a2": colors.c3 + "bb",
                "--uiScale": userStorage.global.uiScale,
                "--tempScale": userStorage.temperature.tempScale,
            }

            Object.keys(cssVarMap).forEach(key => {
                document.documentElement.style.setProperty(key, cssVarMap[key]);
            });
        }

    }, [userStorage]);

    return (
        <UserStorageContext.Provider value={{ userStorage, setUserStorage }}>
            {userStorage ? props.children : null}
        </UserStorageContext.Provider>
    );
}


export { UserStorage, UserStorageContext };