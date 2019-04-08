import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
    formatTime,
    formatDate,
    getTextNode
} from '../utilities';

const UpcomingGigs = ({ upcomingGigs, buttonState, showMoreGigs }) => {
    if (!upcomingGigs) return null;

    if (upcomingGigs.subsequent_streams.length < 1) {
        return null;
    }

    const gigsToShow = buttonState ? 2 : upcomingGigs.subsequent_streams.length;

    let viewMoreButton = null;

    const gigs = upcomingGigs.subsequent_streams.slice(0, gigsToShow).map((gig) => {
        return (
            <div className="sidebar-result__item" key={gig.gig_id}>
                <Link to={`/gig/${gig.gig_id}`}><img className="sidebar-result__image" src={gig.profile_image.src} alt={gig.profile_image.alt} /></Link>
                <div className="sidebar-result__info">
                    <h4>
                        <Link to={`/gig/${gig.gig_id}`}>{gig.gig_title}</Link>
                    </h4>
                    <p>
                        <span className="subtitle-separator">{formatDate(gig.adjusted_start_datetime)}</span>
                        {formatTime(gig.adjusted_start_datetime)}
                    </p>
                </div>
            </div>
        );
    });

    // Can only click view more if there are more than 2 gigs to show
    if (upcomingGigs.subsequent_streams.length > 2) {
        viewMoreButton = (
            <button type="button" className="button__view-more button__view-more--title" onClick={showMoreGigs}>
                {buttonState ? getTextNode('see more') : getTextNode('see less') }
            </button>
        );
    }

    return (

        <div className="artist-upcoming">
            <h4 className="sidebar-result__title">
                {getTextNode('Upcoming gigs')}
                {viewMoreButton}
            </h4>
            {gigs}
        </div>

    );
};

UpcomingGigs.propTypes = {
    upcomingGigs: PropTypes.object,
    buttonState: PropTypes.bool,
    showMoreGigs: PropTypes.func
};

export default UpcomingGigs;
