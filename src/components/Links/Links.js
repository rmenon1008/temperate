import './Links.css'
import React, { useContext } from 'react';
import { UserStorageContext } from '../UserStorage/UserStorage';

const Links = (props) => {
    const context = useContext(UserStorageContext);
    const userStorage = context.userStorage;

    return (
        <div className="Links">
            {userStorage.links.map((link, index) => {
                if (link.link !== "" && link.text !== "") {
                    return (
                        <a href={link.link} className="link" rel="noopener noreferrer">
                            {link.text}
                        </a>
                    );
                } else {
                    return null;
                }
            })}
        </div>
    );
}

export default Links;