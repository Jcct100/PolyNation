import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import ArtistAddGig from './ArtistAddGig';
import VenueAddGig from './VenueAddGig';
import EditGig from './EditGig';
import EditGigRequest from './EditGigRequest';

import {
    manageVenueUpcomingGigs,
    manageVenuePastGigs,
    manageArtistUpcomingGigs,
    manageArtistPastGigs
} from '../../api';
import {
    formatDate,
    formatTime,
    getCityFromAddress,
    getTextNode,
    decodeString,
    truncateSubtitle
} from '../../utilities';

class ManageGigs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            upcoming: [],
            past: []
        };
    }

    componentDidMount() {
        if (this.props.user.full.venue_id) {
            this.getVenueGigs(this.props.user.full.venue_id);
        } else {
            this.getArtistGigs(this.props.user.full.artist_id);
        }
    }

    getVenueGigs(id) {
        manageVenueUpcomingGigs(id)
            .then((res) => {
                this.setState({ upcoming: res });
            })
            .catch((error) => {
                console.log(error);
            });

        manageVenuePastGigs(id)
            .then((res) => {
                this.setState({ past: res });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    getArtistGigs(id) {
        manageArtistUpcomingGigs(id)
            .then((res) => {
                this.setState({ upcoming: res });
            })
            .catch((error) => {
                console.log(error);
            });

        manageArtistPastGigs(id)
            .then((res) => {
                this.setState({ past: res });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        const tableHeaders = (
            <>
                <th>{getTextNode('Gig')}</th>
                <th>{getTextNode('Venue')}</th>
                <th>{getTextNode('Genre')}</th>
                <th>{getTextNode('Location')}</th>
                <th>{getTextNode('Date')}</th>
                <th>{getTextNode('Time')}</th>
            </>
        );

        const upcomingData = this.state.upcoming.map((gig) => {
            return (
                <tr key={gig.gig_id}>
                    <td>{gig.gig_title}</td>
                    <td>{gig.venue.entity_title}</td>
                    <td>{truncateSubtitle(decodeString(gig.genre_string))}</td>
                    <td>{getCityFromAddress(gig.location_text)}</td>
                    <td>{formatDate(gig.start_time)}</td>
                    <td>{formatTime(gig.start_time)}</td>
                    <td>
                        <button
                            type="button"
                            onClick={this.props.user.full.venue_id
                                ? () => { this.props.openModal(<EditGig gig={gig} />); }
                                : () => { this.props.openModal(<EditGigRequest gig={gig} artist={this.props.user.full.artist_id} />); }}
                        >
                            <FontAwesomeIcon icon={faPencilAlt} />
                        </button>
                    </td>
                    <td>{gig.approval_status ? 'Approved' : 'Pending'}</td>
                </tr>
            );
        });

        const pastdata = this.state.past.map((gig) => {
            return (
                <tr key={gig.gig_id}>
                    <td>{gig.gig_title}</td>
                    <td>{gig.venue.entity_title}</td>
                    <td>{truncateSubtitle(decodeString(gig.genre_string))}</td>
                    <td>{getCityFromAddress(gig.location_text)}</td>
                    <td>{formatDate(gig.start_time)}</td>
                    <td>{formatTime(gig.start_time)}</td>
                </tr>
            );
        });

        const upcomingTable = this.state.upcoming.length >= 1 ? (
            <table className="gigs-table">
                <thead>
                    <tr>
                        {tableHeaders}
                        <th>{getTextNode('Edit')}</th>
                        <th>{getTextNode('Approved?')}</th>
                    </tr>
                </thead>
                <tbody>
                    {upcomingData}
                </tbody>
            </table>
        ) : <p className="form__title--padded">{getTextNode('You have no upcoming gigs')}</p>;

        const pastTable = this.state.past.length >= 1 ? (
            <table className="gigs-table">
                <thead>
                    <tr>
                        {tableHeaders}
                    </tr>
                </thead>
                <tbody>
                    {pastdata}
                </tbody>
            </table>
        ) : <p className="form__title--padded">{getTextNode('You have no past gigs')}</p>;

        return (
            <div>
                <div className="form__buttons">
                    <h2 className="form__title form__title--padded">{getTextNode('Upcoming gigs')}</h2>
                    <button
                        type="button"
                        className="button__account-form--submit"
                        onClick={this.props.user.full.venue_id
                            ? () => { this.props.openModal(<VenueAddGig venue={this.props.user.full.venue_id} />); }
                            : () => { this.props.openModal(<ArtistAddGig artist={this.props.user.full.artist_id} />); }}
                    >
                        {getTextNode('+ add gig')}
                    </button>
                </div>
                {upcomingTable}

                <h2 className="form__title form__title--padded">{getTextNode('Past gigs')}</h2>
                {pastTable}
            </div>
        );
    }
}

ManageGigs.propTypes = {
    user: PropTypes.object,
    openModal: PropTypes.func
};

export default ManageGigs;
