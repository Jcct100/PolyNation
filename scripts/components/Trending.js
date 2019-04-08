import React, { Component } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

import {
    getTrending,
    followArtist,
    followVenue,
    unfollowArtist,
    unfollowVenue
} from '../api';
import { getTextNode } from '../utilities';
import SidebarResult from './SidebarResult';

class Trending extends Component {
    constructor(props) {
        super(props);

        this.state = {
            venues: [],
            artists: [],
            moreArtistsButton: true,
            moreVenuesButton: true,
            loading: true
        };

        this.showMoreArtists = this.showMoreArtists.bind(this);
        this.showMoreVenues = this.showMoreVenues.bind(this);
    }

    componentWillMount() {
        getTrending()
            .then((res) => {
                this.setState({ venues: res.venues, artists: res.artists, loading: false });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    showMoreArtists() {
        this.setState((prevState) => { return { moreArtistsButton: !prevState.moreArtistsButton }; });
    }

    showMoreVenues() {
        this.setState((prevState) => { return { moreVenuesButton: !prevState.moreVenuesButton }; });
    }

    checkVenueFollowerStatus(venue) {
        return venue.user_context.follower
            ? { class: 'button__follow-button button__follow-button--unfollow', function: () => { this.updateVenues(venue.venue_id, 'unfollow'); }, content: getTextNode('following') }
            : { class: 'button__follow-button button__follow-button--follow', function: () => { this.updateVenues(venue.venue_id, 'follow'); }, content: getTextNode('follow') };
    }

    checkArtistFollowerStatus(artist) {
        return artist.user_context.follower
            ? { class: 'button__follow-button button__follow-button--unfollow', function: () => { this.updateArtists(artist.artist_id, 'unfollow'); }, content: getTextNode('following') }
            : { class: 'button__follow-button button__follow-button--follow', function: () => { this.updateArtists(artist.artist_id, 'follow'); }, content: getTextNode('follow') };
    }

    updateArtists(id, type) {
        if (type === 'follow') {
            followArtist(id)
                .then(getTrending)
                .then((res) => {
                    this.setState({ artists: res.artists });
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            unfollowArtist(id)
                .then(getTrending)
                .then((res) => {
                    this.setState({ artists: res.artists });
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    updateVenues(id, type) {
        if (type === 'follow') {
            followVenue(id)
                .then(getTrending)
                .then((res) => {
                    this.setState({ venues: res.venues });
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            unfollowVenue(id)
                .then(getTrending)
                .then((res) => {
                    this.setState({ venues: res.venues });
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    render() {
        if (this.state.loading) {
            return (
                <div className="loader" />
            );
        }

        const venuesToShow = this.state.moreVenuesButton ? 2 : this.state.venues.length;
        const artistsToShow = this.state.moreArtistsButton ? 2 : this.state.artists.length;

        const venueIcon = this.state.moreVenuesButton ? <FontAwesomeIcon icon={faChevronDown} /> : <FontAwesomeIcon icon={faChevronUp} />;
        const artistIcon = this.state.moreArtistsButton ? <FontAwesomeIcon icon={faChevronDown} /> : <FontAwesomeIcon icon={faChevronUp} />;

        // Create a list of trending venues from array
        const trendingVenues = this.state.venues.slice(0, venuesToShow).map((venue) => {
            const followButton = this.checkVenueFollowerStatus(venue);

            return (
                <SidebarResult item={venue} button={followButton} key={venue.venue_id} />
            );
        });

        // Create a list of trending artists from array
        const trendingArtists = this.state.artists.slice(0, artistsToShow).map((artist) => {
            const followButton = this.checkArtistFollowerStatus(artist);

            return (
                <SidebarResult item={artist} button={followButton} key={artist.artist_id} />
            );
        });

        return (
            <div className="sidebar-result">

                <div className="sidebar-result__list">

                    <h4 className="sidebar-result__title">{getTextNode('Trending Venues')}</h4>

                    {trendingVenues}

                    <button type="button" className="button__view-more" onClick={this.showMoreVenues}>
                        {this.state.moreVenuesButton ? getTextNode('view more') : getTextNode('view less')}
                        <span className="fa-icon">{venueIcon}</span>
                    </button>

                </div>

                <div className="sidebar-result__list">

                    <h4 className="sidebar-result__title">{getTextNode('Trending Artists')}</h4>

                    {trendingArtists}

                    <button type="button" className="button__view-more" onClick={this.showMoreArtists}>
                        {this.state.moreArtistsButton ? getTextNode('view more') : getTextNode('view less')}
                        <span className="fa-icon">{artistIcon}</span>
                    </button>

                </div>

            </div>
        );
    }
}

export default Trending;
