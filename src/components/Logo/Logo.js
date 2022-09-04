import './Logo.css'
import React from 'react';

const Logo = (props) => {

    return (
        <span className="logo">
            Temperate
            <span className="logo-green"><InlineArrow /></span>
        </span>
    );
}

const InlineArrow = (props) => {
    return (
        <svg className="InlineArrow" width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.79545 11.8324L0.707387 9.74432L7.15625 3.29545H2.42614L2.44034 0.454545H12.0852V10.0994H9.23011L9.24432 5.38352L2.79545 11.8324Z" fill="#00C853" />
        </svg>
    );
}

export { Logo, InlineArrow };