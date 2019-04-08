import React from 'react';
import SidebarResult from './SidebarResult';
import {
    getFollowedArtists,
    getFollowedVenues,
    followArtist, followVenue,
    unfollowArtist,
    unfollowVenue
} from '../api';
import { getTextNode } from '../utilities';

class Following extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            artists: [],
            venues: [],
            loading: true
        };
    }

    componentWillMount() {
        getFollowedArtists()
            .then((res) => {
                this.setState({ artists: res.following_artists });
            })
            .catch((error) => {
                console.log(error);
            });

        getFollowedVenues()
            .then((res) => {
                this.setState({ venues: res.following_venues, loading: false });
            })
            .catch((error) => {
                console.log(error);
            });
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
                .then(getFollowedArtists)
                .then((res) => {
                    this.setState({ artists: res.following_artists });
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            unfollowArtist(id)
                .then(getFollowedArtists)
                .then((res) => {
                    this.setState({ artists: res.following_artists });
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    updateVenues(id, type) {
        if (type === 'follow') {
            followVenue(id)
                .then(getFollowedVenues)
                .then((res) => {
                    this.setState({ venues: res.following_venues });
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            unfollowVenue(id)
                .then(getFollowedVenues)
                .then((res) => {
                    this.setState({ venues: res.following_venues });
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

        const followedArtists = this.state.artists.map((artist) => {
            const followButton = this.checkArtistFollowerStatus(artist);
            return (
                <SidebarResult item={artist} button={followButton} key={artist.artist_id} />
            );
        });

        const followedVenues = this.state.venues.map((venue) => {
            const followButton = this.checkVenueFollowerStatus(venue);
            return (
                <SidebarResult item={venue} button={followButton} key={venue.venue_id} />
            );
        });

        return (
            <div className="sidebar-result">

                <div className="sidebar-result__list">
                    <h4 className="sidebar-result__title">{getTextNode('Followed venues')}</h4>

                    {followedVenues}

                </div>

                <div className="sidebar-result__list">
                    <h4 className="sidebar-result__title">{getTextNode('Followed artists')}</h4>

                    {followedArtists}

                </div>

            </div>
        );
    }
}

export default Following;
