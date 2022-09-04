import './Links.css'
import React, { useContext } from 'react';
import { UserStorageContext } from '../UserStorage/UserStorage';
import { ChevronDown } from '@styled-icons/heroicons-outline/ChevronDown';

const Links = (props) => {
    const context = useContext(UserStorageContext);
    const userStorage = context.userStorage;
    

    return (
        <div className="Links">
            {userStorage.links.map((link, index) => {
                if (link.text !== "") {
                    if (link.nested) {
                        return (
                            <div className="nested-group">
                                <span className="link category" target="_blank" rel="noopener noreferrer">{link.text}&nbsp;&nbsp;<ChevronDown /></span>
                                <div className="nested-links-contain">
                                    <div className="nested-links">
                                        {link.nested.map((linkNested, indexNested) => {
                                            if (linkNested.text !== "") {
                                                return (
                                                    <a className="nested-link" href={linkNested.link} target="_blank" rel="noopener noreferrer">{linkNested.text}</a>
                                                )
                                            }
                                        })}
                                    </div>
                                </div>
                            </div>
                        )
                    } else {
                        return (
                            <a href={link.link} className="link" rel="noopener noreferrer">
                                {link.text}
                            </a>
                        );
                    }
                } else {
                    return null;
                }
            })}
        </div>
    );
}

export default Links;