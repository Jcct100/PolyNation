import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket, faPlayCircle } from '@fortawesome/pro-regular-svg-icons';
import {
    formatTime,
    formatDate,
    getTextNode,
    decodeString,
    truncateSubtitle
} from '../utilities';
import AudioPlayerContext from '../containers/context';

// eslint-disable-next-line react/prefer-stateless-function
class NextGig extends React.Component {
    render() {
        const { gig, buttonState } = this.props;
        if (!gig) return null;

        const artistsToShow = buttonState ? 2 : gig.artist_schedule.length;
        let viewMoreButton = null;

        const artistList = gig.artist_schedule.slice(0, artistsToShow).map((artist) => {
            return (
                <div className="sidebar-result__item" key={artist.artist.artist_id}>
                    <Link to={`/artist/${artist.artist.artist_id}`}>
                        <img className="sidebar-result__image" src={artist.artist.profile_image.src} alt={artist.artist.profile_image.alt} />
                    </Link>
                    <div className="sidebar-result__info">
                        <h4>
                            <Link to={`/artist/${artist.artist.artist_id}`}>{artist.artist.artist_name}</Link>
                        </h4>
                        <p>
                            <span className="subtitle-separator">{truncateSubtitle(decodeString(artist.artist.subtitle))}</span>
                            <span>{formatTime(artist.adjusted_start_time)}</span>
                        </p>
                    </div>

                </div>
            );
        });

        // Can only click view more artists if there are more than 2 to show
        if (gig.artist_schedule.length > 2) {
            viewMoreButton = (
                <button type="button" className="button__view-more button__view-more--title">
                    {buttonState ? getTextNode('see more') : getTextNode('see less') }
                </button>
            );
        }

        const ticketButton = gig.tickets.buy_link_available ? (
            <a href={gig.tickets.link_url} target="_blank" rel="noopener noreferrer" className="button__tickets button__tickets--available">
                <FontAwesomeIcon icon={faTicket} className="fa-icon" />
                {getTextNode('buy tickets')}
            </a>
        ) : (
            <button type="button" className="button__tickets button__tickets--disabled" disabled>
                <FontAwesomeIcon icon={faTicket} className="fa-icon" />
                {getTextNode('buy tickets')}
            </button>
        );

        return (
            <AudioPlayerContext.Consumer>
                {({ onChange }) => {
                    return (
                        <div>
                            <div className="sidebar-result__item">
                                <div className="sidebar-result__info">
                                    <h4>
                                        <Link to={`/gig/${gig.gig_id}`}>{gig.gig_title}</Link>
                                    </h4>
                                    <p>{formatDate(gig.adjusted_start_datetime)}</p>
                                </div>
                                <div className="gig-status">
                                    <span className={`dot dot--${gig.stream.status_slug}`} />
                                    <p>{gig.stream.status_text}</p>
                                </div>
                            </div>

                            <div className="gig-buttons">

                                {/* { gig.stream.listen_now_available ? ( */}
                                <button type="button" className="button__listen button__listen--available" onClick={() => { onChange(gig.gig_id); }}>
                                    <FontAwesomeIcon icon={faPlayCircle} className="fa-icon" />
                                    <span>{getTextNode('listen now')}</span>
                                </button>
                                {/* : (
                                    <button type="button" className="button__listen button__listen--disabled" disabled>{getTextNode('listen now')}</button>
                                 )} */}

                                {ticketButton}
                            </div>

                            <div className="artist-upcoming">
                                <h4 className="sidebar-result__title">
                                    {getTextNode('Who is playing')}
                                    {viewMoreButton}
                                </h4>

                                {artistList}
                            </div>

                        </div>
                    );
                }}
            </AudioPlayerContext.Consumer>
        );
    }
}

NextGig.contextType = AudioPlayerContext;

NextGig.propTypes = {
    gig: PropTypes.object,
    buttonState: PropTypes.bool
};

export default NextGig;
