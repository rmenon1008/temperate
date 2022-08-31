import './Temperature.css';
import React, { useContext, useState, useEffect } from 'react';
import { UserStorageContext } from '../UserStorage/UserStorage';

const WEATHER_API_BASE = "http://api.rohanmenon.com/weather/"
const IP_API = "https://www.cloudflare.com/cdn-cgi/trace"

const Temperature = (props) => {

    const userStorage = useContext(UserStorageContext).userStorage;
    const [temp, setTemp] = useState(undefined);
    const [condition, setCondition] = useState(undefined);

    const setTempC = (temp) => {
        if (userStorage.temperature.useCelsius) {
            setTemp(Math.round(temp));
        } else {
            setTemp(Math.round(temp * 1.8 + 32));
        }
    }

    useEffect(() => {
        const updateTemp = () => {
            if (userStorage.temperature.display) {
                let queryUrl = WEATHER_API_BASE
                if (userStorage.global.locationOverride) {
                    queryUrl += userStorage.global.locationOverride;
                }

                fetch(queryUrl)
                    .then(res => res.json())
                    .then(data => {
                        if (userStorage.temperature.useFeelsLike) {
                            setTempC(data.current.feelslike_c);
                        } else {
                            setTempC(data.current.temp_c);
                        }
                        if (userStorage.temperature.displayCond) {
                            setCondition(data.current.condition.text.toLowerCase());
                        }
                    });
            }
        }
        updateTemp();
        // const updateInterval = setInterval(updateTemp, 60000);
        // return () => clearInterval(updateInterval);
    }, []);


    return (
        <div className="Temperature">
            <span className='temp'>{temp}{temp ? "°" : ""}</span>

            <span className="condition">
                <svg viewBox="0 0 20 40">
                    {/* <filter id="f1" x="0" y="0">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="0.3" />
                    </filter> */}
                    {/* <circle id="conditionPath" cx="9.92" cy="18.16" r="7.1" fill="blue" /> */}
                    <path id="conditionPath" d="M-1.08,18.16a11,11 0 1,0 22,0a11,11 0 1,0 -22,0" fill="transparent" />
                    <text font-size="3px" text-anchor="middle">
                        <textPath id="conditionString" href="#conditionPath" startOffset="25.4%">
                            {condition}
                        </textPath>
                    </text>
                </svg>
            </span>
        </div>
    );
}

export default Temperature;