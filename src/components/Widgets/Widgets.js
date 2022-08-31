import './Widgets.css';
import Tab from '../Tab/Tab';
import { Sun , Search, CheckCircle, Cloud, Check} from '@styled-icons/heroicons-outline';
import Weather from './Weather/Weather';
import React from 'react';

const Widgets = () => {
    return (
        <div className="Widgets">
            <Weather/>
            <Tab icon={<Search/>} />
            <Tab icon={<Cloud/>} />
            <Tab icon={<CheckCircle/>} />
        </div>
    );
}

export default Widgets;