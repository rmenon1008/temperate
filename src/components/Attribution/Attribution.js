import './Attribution.css';
import { Refresh } from '@styled-icons/heroicons-outline';
import React from 'react';

const Attribution = (props) => {
    return (
        <div className="Attribution" style={{ opacity: props.show ? 1 : 0 }}>
            <a className="link" href={props.link}>
                {props.name} on Unsplash
            </a>
            <span className="link icon" onClick={props.swapImage}><Refresh size="1.2em" style={{ marginTop: '-.2em' }} /></span>
        </div>
    );
}

export default Attribution;