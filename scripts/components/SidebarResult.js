import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { decodeString, truncateSubtitle } from '../utilities';

const SidebarResult = ({ item, button }) => {
    if (!item) return null;

    return (
        <div className="sidebar-result__item">
            <Link to={item.venue_id ? `venue/${item.venue_id}` : `/artist/${item.artist_id}`}>
                <img
                    className="sidebar-result__image"
                    src={item.profile_image.src}
                    alt={item.profile_image.alt}
                />
            </Link>

            <div className="sidebar-result__info">
                <h4>
                    {item.venue_id ? (
                        <Link to={`/venue/${item.venue_id}`}>{item.title}</Link>
                    ) : (
                        <Link to={`/artist/${item.artist_id}`}>{item.artist_name}</Link>
                    )}
                </h4>

                <p>{truncateSubtitle(decodeString(item.subtitle))}</p>
            </div>

            <button type="button" className={button.class} onClick={button.function}>
                {button.content}
            </button>

        </div>
    );
};

SidebarResult.propTypes = {
    item: PropTypes.object,
    button: PropTypes.object
};

export default SidebarResult;
