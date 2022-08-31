import './Tab.css';
import React, { useState, cloneElement } from 'react';

const Tab = (props) => {
    const [open, setOpen] = useState(false);

    return (
        <div className='Tab' onMouseLeave={() => { setOpen(false) }}>
            <div
                className='tab-indicator'
                onMouseEnter={props.children ? () => { setOpen(true) } : null}
                // onMouseLeave={() => { setOpen(false) }}
                style={{ backgroundColor: open ? 'var(--c3a2)' : null }}
            >
                {
                    props.icon ? cloneElement(props.icon, { size: '1.45em' }) : null
                }
            </div>
            {props.children ? (
                <div>
                    <div className='tab-drawer'>
                        <div className='tab-drawer-inner' style={{ opacity: open ? '1' : '0' }}>
                            <div className='tab-title-bar'>
                                <div className='split'>
                                    <div className='tab-title'>
                                        {props.title}
                                    </div>
                                    <div className='tab-right'>
                                        {props.right}
                                    </div>
                                </div>
                            </div>
                            <div className='tab-content'>
                                {props.children}
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export default Tab;
