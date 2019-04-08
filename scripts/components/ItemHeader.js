import React from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTwitter,
    faFacebookF,
    faPinterest
} from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/pro-regular-svg-icons';
import { decodeString, formatURL } from '../utilities';

const ItemHeader = ({ item, button }) => {
    if (!item) return null;

    const shareURL = item.venue_id ? `${window.location.origin}/venue/${item.venue_id}` : `${window.location.origin}/artist/${item.artist_id}`;

    return (

        <div className="single-item-info">
            <img className="single-item-info__image" src={item.profile_image.src} alt={item.profile_image.alt} />
            <p className="single-item-info__context">{item.venue_id ? 'Venue' : 'Artist'}</p>
            <h4 className="single-item-info__title">{item.venue_id ? item.venue_name : item.artist_name}</h4>
            <p className="single-item-info__subtitle">{item.venue_id && item.about.website ? <a href={item.about.website}>{formatURL(item.about.website)}</a> : decodeString(item.subtitle)}</p>

            <div>
                <div className="dropdown">
                    <button className="button__share button__share--main" type="button">share</button>
                    <div className="dropdown-container">
                        <div className="button__share button__share--content">
                            <a href={`https://twitter.com/home?status=${shareURL}`} target="_blank" rel="noopener noreferrer" className="social social--twitter">
                                <FontAwesomeIcon icon={faTwitter} />
                            </a>
                            <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareURL}`} rel="noopener noreferrer" target="_blank" className="social social--facebook">
                                <FontAwesomeIcon icon={faFacebookF} />
                            </a>
                            <a href={`https://pinterest.com/pin/create/button/?url=&media=${shareURL}/&description=Check%20this%20out!`} rel="noopener noreferrer" target="_blank" className="social social--pinterest">
                                <FontAwesomeIcon icon={faPinterest} />
                            </a>
                            <a href={`mailto:?body=${shareURL}&subject=Check this out on Polynation!`} className="social social--email">
                                <FontAwesomeIcon icon={faEnvelope} />
                            </a>
                        </div>
                    </div>
                </div>
                <button type="button" className={`${button.class} button__follow-button--header`} onClick={button.function}>{button.content}</button>
            </div>
        </div>

    );
};

ItemHeader.propTypes = {
    item: PropTypes.object,
    button: PropTypes.object
};

export default ItemHeader;
