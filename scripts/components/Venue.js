import React from 'react';
import PropTypes from 'prop-types';
import {
    getVenue,
    getVenueUpcomingGigs,
    unfollowVenue,
    followVenue,
    getVenueRelated
} from '../api';
import ItemHeader from './ItemHeader';
import NextGig from './NextGig';
import NotFound from './NotFound';
import UpcomingGigs from './UpcomingGigs';
import SidebarResult from './SidebarResult';
import { getTextNode, formatURL } from '../utilities';

class Venue extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            venue: {},
            loading: true,
            upcomingGigs: {},
            related: {},
            moreArtistsButton: true
        };

        this.showMoreArtists = this.showMoreArtists.bind(this);
    }

    componentWillMount() {
        this.getVenueData(this.props.id);
    }

    // Allows update of component if venue id changes
    componentDidUpdate(prevProps) {
        if (this.props.id !== prevProps.id) {
            this.getVenueData(this.props.id);
            document.getElementById('sidebar-nav').scrollIntoView();
        }
    }

    getVenueData(id) {
        const details = {
            limit: 10,
            context: 'venue'
        };

        getVenue(id)
            .then((res) => {
                this.setState({ venue: res }, () => {
                    getVenueUpcomingGigs(id, details)
                        .then((res) => {
                            this.setState({ upcomingGigs: res }, () => {
                                this.setState({ loading: false });
                            });
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                });
            })
            .catch((error) => {
                console.log(error);
                this.setState({ loading: false });
            });

        getVenueRelated(id)
            .then((res) => {
                this.setState({ related: res });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    checkVenueFollowerStatus(venue) {
        return venue.user_context.follower
            ? { class: 'button__follow-button button__follow-button--unfollow', function: () => { this.updateVenue(venue.venue_id, 'unfollow'); }, content: 'following' }
            : { class: 'button__follow-button button__follow-button--follow', function: () => { this.updateVenue(venue.venue_id, 'follow'); }, content: 'follow' };
    }

    updateVenue(id, type) {
        if (type === 'follow') {
            followVenue(id)
                .then(() => {
                    getVenue(this.state.venue.venue_id).then((res) => {
                        this.setState({ venue: res });
                    });
                    getVenueRelated(this.state.venue.venue_id).then((res) => {
                        this.setState({ related: res });
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            unfollowVenue(id)
                .then(() => {
                    getVenue(this.state.venue.venue_id).then((res) => {
                        this.setState({ venue: res });
                    });
                    getVenueRelated(this.state.venue.venue_id).then((res) => {
                        this.setState({ related: res });
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    showMoreArtists() {
        this.setState((prevState) => {
            return {
                moreArtistsButton: !prevState.moreArtistsButton
            };
        });
    }

    render() {
        if (this.state.loading) {
            return (
                <div className="loader" />
            );
        }

        if (!this.state.venue.venue_id) {
            return <NotFound />;
        }

        const followButton = this.checkVenueFollowerStatus(this.state.venue);

        let artistGigs = null;
        if (this.state.upcomingGigs.has_live_or_next_stream) {
            artistGigs = (
                <div className="sidebar-result__list">

                    <NextGig gig={this.state.upcomingGigs.live_or_next_stream} showMoreArtists={this.showMoreArtists} buttonState={this.state.moreArtistsButton} />

                    <UpcomingGigs upcomingGigs={this.state.upcomingGigs} />

                </div>
            );
        }

        // Create a list of related venues
        let relatedVenuesList = null;
        const relatedVenues = this.state.related.related_venues.map((venue) => {
            const followRelatedButton = this.checkVenueFollowerStatus(venue);
            return (
                <SidebarResult item={venue} button={followRelatedButton} key={venue.venue_id} />
            );
        });

        if (this.state.related.related_venues.length >= 1) {
            relatedVenuesList = (
                <div className="sidebar-result">
                    <div className="sidebar-result__list">
                        <h4 className="sidebar-result__title">{getTextNode('Venues you may also like')}</h4>
                        {relatedVenues}
                    </div>
                </div>
            );
        }

        const aboutVenue = (
            <div className="sidebar-result__list">
                <h4 className="sidebar-result__title">{getTextNode('About')}</h4>
                <p>{this.state.venue.about.description}</p>

                <a className="about-link" href={`https://www.google.com/maps/@${this.state.venue.geo.map.lat},${this.state.venue.geo.map.lng},14z`} target="_blank" rel="noopener noreferrer">
                    {this.state.venue.geo.map.address}
                </a>

                <a href={this.state.venue.about.website} target="_blank" rel="noopener noreferrer" className="about-link">{formatURL(this.state.venue.about.website)}</a>
            </div>
        );

        return (
            <div>
                <ItemHeader item={this.state.venue} button={followButton} />

                {artistGigs}

                {aboutVenue}

                {relatedVenuesList}

            </div>
        );
    }
}

Venue.propTypes = {
    id: PropTypes.string
};

export default Venue;
