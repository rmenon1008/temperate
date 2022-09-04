import './Temperature.css';
import React, { useContext, useState, useEffect } from 'react';
import { UserStorageContext } from '../UserStorage/UserStorage';
import 'chartist/dist/index.css';
import { LineChart, Interpolation } from 'chartist';
import 'chartist/dist/index.css';


const WEATHER_API_BASE = "http://api.rohanmenon.com/weather/"
const IP_API = "https://www.cloudflare.com/cdn-cgi/trace"

const Temperature = (props) => {
    const context = useContext(UserStorageContext);
    const userStorage = context.userStorage;
    const [temp, setTemp] = useState(undefined);
    const [condition, setCondition] = useState(undefined);
    const [forecast, setForecast] = useState(undefined);
    const [range, setRange] = useState(undefined);

    const setCorrectUnits = (temp) => {
        if (userStorage.temperature.useCelsius) {
            return Math.round(temp);
        } else {
            return Math.round(temp * 9 / 5 + 32);
        }
    }

    const getHour = (unix) => {
        const date = new Date(unix * 1000);
        const hours = date.getHours();
        return hours;
    }

    const setTempC = (temp) => {
        setTemp(setCorrectUnits(temp));
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
                            setCondition(data.current.condition.text.toLowerCase().replace("possible", ""));
                        }

                        const workingForecast = {
                            labels: [],
                            series: [{
                                name: 'temp',
                                data: []
                            }, {
                                name: 'rain',
                                data: []
                            }]
                        };
                        if (userStorage.graph.display) {
                            const forecastHours = data.forecast.forecastday[0].hour;
                            // Get the forecast for the next maxHours hours starting with the current hour
                            for (let i = 0; i < forecastHours.length; i++) {
                                const hour = forecastHours[i];
                                if (hour.time_epoch > (Date.now() / 1000) - 7200) {
                                    workingForecast.labels.push(getHour(hour.time_epoch));
                                    if (userStorage.graph.displayTemp) {
                                        if (userStorage.temperature.useFeelsLike) {
                                            workingForecast.series[0].data.push(setCorrectUnits(hour.feelslike_c));
                                        } else {
                                            workingForecast.series[0].data.push(setCorrectUnits(hour.temp_c));
                                        }
                                    }
                                    if (userStorage.graph.displayPercip) {
                                        workingForecast.series[1].data.push(hour.chance_of_rain);
                                    }
                                }
                            }

                            let maxLength = userStorage.graph.maxHours;
                            maxLength += maxLength % 2 ^ 1; // Make sure it's odd
                            workingForecast.labels = workingForecast.labels.slice(0, maxLength);
                            workingForecast.series[0].data = workingForecast.series[0].data.slice(0, maxLength);
                            workingForecast.series[1].data = workingForecast.series[1].data.slice(0, maxLength);

                            const tempMin = Math.min(...workingForecast.series[0].data) * 0.95;
                            const tempMax = Math.max(...workingForecast.series[0].data) * 1.05;
                            setRange([tempMin, tempMax]);

                            // scale rain values from between 0 and 100 to between tempMin and tempMax
                            workingForecast.series[1].data = workingForecast.series[1].data.map((val) => {
                                return (val / 100) * (tempMax - tempMin) + tempMin;
                            });

                            setForecast(workingForecast);
                        }
                    }).catch(err => {
                        console.log(err);
                    })
            }
        }
        updateTemp();
    }, [userStorage.global.locationOverride, userStorage.temperature, userStorage.graph]);


    return (
        <div className="TemperatureGraph">
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
            {userStorage.graph.display && forecast &&
                <Graph data={forecast} range={range} use24h={userStorage.global.use24h} />
            }
        </div>
    );
}

const ctPointLabels = (min, max, use24h) => {
    return (chart) => {
        const options = {
            labelClass: 'ct-label',
            textAnchor: 'middle'
        };

        if (chart) {
            chart.on('draw', function (data) {
                if (data.type === 'point' && data.index % 2 === 1) {
                    // const localSlope = (data.y2 - data.y1) / (data.x2 - data.x1);
                    // try getting the slope of the line at this point
                    let offsetX = 0;
                    let offsetY = 24;
                    if (data.index > 0 && data.index < data.series.data.length - 1) {
                        const deltaY = data.chartRect.y1 - data.chartRect.y2 / (max - min);
                        const deltaX = data.chartRect.x2 - data.chartRect.x1 / data.series.data.length - 1;
                        const prevPoint = data.series.data[data.index - 1] * deltaY;
                        const nextPoint = data.series.data[data.index + 1] * deltaY;
                        const localSlope = (prevPoint - nextPoint) / (2 * deltaX);
                        offsetY = -Math.round(Math.cos(Math.atan(localSlope)) * 16);
                        offsetX = Math.round(Math.sin(Math.atan(localSlope)) * 24);
                    }

                    if (data.series.name === 'temp') {
                        // Labels for temperature points
                        data.group.elem('text', {
                            x: data.x + offsetX,
                            y: data.y + offsetY,
                            style: 'text-anchor: ' + options.textAnchor
                        }, options.labelClass).text(data.value.y + '°');
                        // .text(data.value.y + '° (' + offsetX + ', ' + offsetY + ')');

                        // Axis labels
                        // This is duplicated for each point, but it's not that bad
                        let hours = data.axisX.ticks[data.index];
                        if (!use24h) {
                            hours = ((hours + 11) % 12 + 1) + (hours > 12 ? " PM" : " AM");
                        }
                        data.group.elem('text', {
                            x: data.x,
                            y: 50,
                            style: 'text-anchor: ' + options.textAnchor
                        }, options.labelClass).text(hours);
                    }
                    // else if (data.series.name === 'rain') {
                    //     // Labels for rain points
                    //     const rainVal = (data.value.y - min) / (max - min) * 100;
                    //     data.group.elem('text', {
                    //         x: data.x - offsetX*1.5,
                    //         y: data.y - offsetY*1.5 + 15,
                    //         style: 'text-anchor: ' + options.textAnchor
                    //     }, options.labelClass).text(Math.floor(rainVal) + "%");
                    // }
                }
            });
        }
    }
}

let options = {
    showPoint: true,
    fullWidth: true,
    axisX: {
        showGrid: false,
        showLabel: false,
        offset: 20,
    },
    axisY: {
        showGrid: false,
        showLabel: false,
        offset: 0,
    },
    chartPadding: {
        top: 50,
        right: -1,
        bottom: -20,
        left: -1
    },
    // plugins: [
    //     ctPointLabels(props.min, props.max),
    // ],
    series: {
        // 'temp': {},
        'rain': {
            showLine: false,
            showArea: true,
            lineSmooth: Interpolation.step(),
        }

    }
}
const Graph = (props) => {
    options.low = Math.min(...props.data.series[0].data) * 0.97;
    options.high = Math.max(...props.data.series[0].data) * 1.06;
    options.plugins = [ctPointLabels(props.range[0], props.range[1], props.use24h)];
    useEffect(() => {
        new LineChart('#chart', props.data, options);
    }, [props.data, props.range, props.use24h]);
    return (
        <div className="Graph">
            <div id='chart'></div>
        </div>
    );
}

export default Temperature;