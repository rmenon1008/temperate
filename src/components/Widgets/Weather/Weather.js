import './Weather.css';
// import Tab from '../Tab/Tab';
import { Sun } from '@styled-icons/heroicons-outline';
import { LocationMarker, ChevronUp, ChevronDown } from '@styled-icons/heroicons-outline';
import { WeatherPartlyCloudyNight, WeatherCloudy, WeatherHailDay, WeatherSnow, WeatherRain } from '@styled-icons/fluentui-system-regular';
import { cloneElement } from 'react';

import { Drop as DropFull, ContrastDrop2 as DropHalf } from 'styled-icons/remix-fill';
import { Drop as DropEmpty } from 'styled-icons/remix-line';

import Tab from '../../Tab/Tab';

const Weather = () => {
    return (
        <Tab title="Weather" icon={<Sun />}>
            <div className='box-group'>
                <div className='box'>
                    <div className='small'>
                        <div className='split'>
                            <div style={{ lineHeight: '19px' }}>
                                <LocationMarker size={'1.2em'} style={{ verticalAlign: '-19%', marginRight: '5px' }} />
                                Seattle
                            </div>
                            <div>
                                <div className='toggle-group'>
                                    <button className='toggle'>hourly</button>
                                    <button className='toggle selected'>daily</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
                <div className='box'>
                    <WeatherGroup />
                </div>
            </div>
        </Tab>
    );
}

const WeatherGroup = (props) => {

    const data = [
        {
            label: 'Mon',
            icon: <WeatherPartlyCloudyNight />,
            high: 32,
            low: 22,
            precip: 0
        },
        {
            label: 'Tue',
            icon: <WeatherRain />,
            high: 42,
            low: 33,
            precip: 46
        },
        {
            label: 'Wed',
            icon: <WeatherHailDay />,
            high: 52,
            low: 43,
            precip: 100
        },
        {
            label: 'Thu',
            icon: <WeatherSnow />,
            high: 62,
            low: 53,
            precip: 100
        },
        {
            label: 'Fri',
            icon: <WeatherCloudy />,
            high: 72,
            low: 63,
            precip: 73
        }

    ];
    return (
        <div className='weather-group'>
            {
                data.map((item, index) => {
                    return (
                        <WeatherItem {...item} />
                    );
                })
            }
        </div>
    );
}

const WeatherItem = (props) => {
    return (
        <div className='weather-item'>
            <div className='weather-item-label'>
                {props.label}
            </div>
            <div className='weather-item-icon'>
                {cloneElement(props.icon, { size: '2em' })}
            </div>
            <div className='weather-item-text'>
                {props.high}°

                {props.low && (<span><br />{props.low}°</span>)}

            </div>
            <div className='weather-item-text'>
                {props.precip <= 30 &&
                    <DropEmpty size={'0.9em'} style={{ marginRight: '1.5px' }} />
                }
                {props.precip > 30 && props.precip <= 70 &&
                    <DropHalf size={'0.9em'} style={{ marginRight: '1.5px' }} />
                }
                {props.precip > 70 &&
                    <DropFull size={'0.9em'} style={{ marginRight: '1.5px' }} />
                }


                {props.precip}%
            </div>
        </div>
    );
}

export default Weather;