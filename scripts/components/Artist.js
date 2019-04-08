import React from 'react';
import PropTypes from 'prop-types';
import {
    getArtist,
    getUpcomingGigs,
    followArtist,
    unfollowArtist,
    getArtistRelated
} from '../api';
import ItemHeader from './ItemHeader';
import NextGig from './NextGig';
import UpcomingGigs from './UpcomingGigs';
import SidebarResult from './SidebarResult';
import { getTextNode } from '../utilities';
import NotFound from './NotFound';

class Artist extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            artist: {},
            loading: true,
            upcomingGigs: {},
            related: {},
            moreGigsButton: true,
            moreArtistsButton: true
        };

        this.showMoreArtists = this.showMoreArtists.bind(this);
        this.showMoreGigs = this.showMoreGigs.bind(this);
    }

    componentWillMount() {
        this.getArtistData(this.props.id);
    }

    // Allows update of component if artist id changes
    componentDidUpdate(prevProps) {
        if (this.props.id !== prevProps.id) {
            this.getArtistData(this.props.id);
            document.getElementById('sidebar-nav').scrollIntoView();
        }
    }

    getArtistData(id) {
        const details = {
            limit: 10,
            context: 'artist'
        };

        getArtist(id)
            .then((res) => {
                this.setState({ loading: true });
                this.setState({ artist: res }, () => {
                    getUpcomingGigs(id, details)
                        .then((res) => {
                            this.setState({ upcomingGigs: res, loading: false });
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

        getArtistRelated(id)
            .then((res) => {
                this.setState({ related: res });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    checkArtistFollowerStatus(artist) {
        return artist.user_context.follower
            ? { class: 'button__follow-button button__follow-button--unfollow', function: () => { this.updateArtist(artist.artist_id, 'unfollow'); }, content: 'following' }
            : { class: 'button__follow-button button__follow-button--follow', function: () => { this.updateArtist(artist.artist_id, 'follow'); }, content: 'follow' };
    }

    updateArtist(id, type) {
        if (type === 'follow') {
            followArtist(id)
                .then(() => {
                    getArtist(this.state.artist.artist_id).then((res) => {
                        this.setState({ artist: res });
                    });
                    getArtistRelated(this.state.artist.artist_id).then((res) => {
                        this.setState({ related: res });
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            unfollowArtist(id)
                .then(() => {
                    getArtist(this.state.artist.artist_id).then((res) => {
                        this.setState({ artist: res });
                    });
                    getArtistRelated(this.state.artist.artist_id).then((res) => {
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

    showMoreGigs() {
        this.setState((prevState) => {
            return {
                moreGigsButton: !prevState.moreGigsButton
            };
        });
    }

    render() {
        if (this.state.loading) {
            return (
                <div className="loader" />
            );
        }

        if (!this.state.artist.artist_id) {
            return <NotFound />;
        }

        let artistGigs = null;
        if (this.state.upcomingGigs.has_live_or_next_stream) {
            artistGigs = (
                <div className="sidebar-result__list">

                    <NextGig gig={this.state.upcomingGigs.live_or_next_stream} showMoreArtists={this.showMoreArtists} buttonState={this.state.moreArtistsButton} />

                    <UpcomingGigs upcomingGigs={this.state.upcomingGigs} showMoreGigs={this.showMoreGigs} buttonState={this.state.moreGigsButton} />

                </div>
            );
        }

        // Create a list of related artists
        let relatedArtistsList = null;
        const relatedArtists = this.state.related.related_artists.map((artist) => {
            const followRelatedButton = this.checkArtistFollowerStatus(artist);
            return (
                <SidebarResult item={artist} button={followRelatedButton} key={artist.artist_id} />
            );
        });

        if (this.state.related.related_artists.length >= 1) {
            relatedArtistsList = (
                <div className="sidebar-result">
                    <div className="sidebar-result__list">
                        <h4 className="sidebar-result__title">{getTextNode('Artists you may also like')}</h4>
                        {relatedArtists}
                    </div>
                </div>
            );
        }

        const followButton = this.checkArtistFollowerStatus(this.state.artist);

        return (
            <div>

                <ItemHeader item={this.state.artist} button={followButton} />

                {artistGigs}

                <div className="sidebar-result__list">
                    <h4 className="sidebar-result__title">{getTextNode('About')}</h4>
                    <p>{this.state.artist.about.description}</p>
                    <a href={this.state.artist.about.website} target="_blank" rel="noopener noreferrer" className="about-link">{this.state.artist.about.website}</a>
                </div>

                {relatedArtistsList}

            </div>
        );
    }
}

Artist.propTypes = {
    id: PropTypes.string
};

export default Artist;
