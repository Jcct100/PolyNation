import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
    getGig,
    getGigRelated,
    followArtist,
    unfollowArtist
} from '../api';
import NextGig from './NextGig';
import { getTextNode } from '../utilities';
import SidebarResult from './SidebarResult';

class Gig extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            gig: {},
            loading: true,
            related: {},
            moreArtistsButton: true
        };

        this.showMoreArtists = this.showMoreArtists.bind(this);
    }

    componentWillMount() {
        this.getGigData(this.props.id);
    }

    // Allows update of component if gig id changes
    componentDidUpdate(prevProps) {
        if (this.props.id !== prevProps.id) {
            this.getGigData(this.props.id);
            document.getElementById('sidebar-nav').scrollIntoView();
        }
    }

    getGigData(id) {
        getGig(id)
            .then((res) => {
                this.setState({ gig: res }, () => {
                    getGigRelated(id)
                        .then((res) => {
                            this.setState({ related: res, loading: false });
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                });
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
                    getGigRelated(this.state.gig.gig_id).then((res) => {
                        this.setState({ related: res });
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            unfollowArtist(id)
                .then(() => {
                    getGigRelated(this.state.gig.gig_id).then((res) => {
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

        return (
            <div>
                <div className="sidebar-result__list">
                    <NextGig gig={this.state.gig} showMoreArtists={this.showMoreArtists} buttonState={this.state.moreArtistsButton} />
                </div>

                <div className="sidebar-result">
                    <div className="sidebar-result__list">
                        <h4 className="sidebar-result__title">{getTextNode('Venue')}</h4>
                        <div className="sidebar-result__item">
                            <Link to={`/venue/${this.state.gig.venue.venue_id}`}><img className="sidebar-result__image" src={this.state.gig.venue.profile_image.src} alt={this.state.gig.venue.profile_image.alt} /></Link>
                            <div className="sidebar-result__info">
                                <h4>
                                    <Link to={`/venue/${this.state.gig.venue.venue_id}`}>{this.state.gig.venue.venue_name}</Link>
                                </h4>
                                <p>{this.state.gig.venue.subtitle}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="sidebar-result__list">
                    <h4 className="sidebar-result__title">{getTextNode('About')}</h4>
                    <p>{this.state.gig.description}</p>
                </div>

                {relatedArtistsList}

            </div>
        );
    }
}

Gig.propTypes = {
    id: PropTypes.string
};

export default Gig;
