import React from 'react';
import PropTypes from 'prop-types';
import EditArtistAccount from './EditArtist';
import { getOwner } from '../../api';
import {
    decodeString,
    getTextNode,
    capitalizeString,
    truncateSocialProfile,
    formatURL
} from '../../utilities';

class ArtistProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            artist: {},
            loading: true
        };
    }

    componentWillMount() {
        getOwner(this.props.user.data.account_type.entity.entity_id)
            .then((res) => {
                this.setState({ artist: res }, () => {
                    this.setState({ loading: false });
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        if (this.state.loading) {
            return (
                <div className="loader" />
            );
        }

        const genres = this.state.artist.full.performing_genres.map((genre) => {
            return (
                <li key={genre.genre_id}>{decodeString(genre.title)}</li>
            );
        });

        const socialMediaProfiles = this.state.artist.full.social_media_profiles.map((profile) => {
            return (
                <div className="profile__group" key={profile.service}>
                    <label className="form__label">{capitalizeString(profile.service)}</label>
                    <p>{truncateSocialProfile(profile.profile_url)}</p>
                </div>
            );
        });

        return (
            <div>
                <h2 className="form__title form__title--padded">{getTextNode('Profile')}</h2>
                <div className="profile__group">
                    <label className="form__label">{getTextNode('Artist name')}</label>
                    <p>{this.state.artist.full.artist_name}</p>
                </div>

                <div className="profile__group">
                    <label className="form__label">{getTextNode('Email address')}</label>
                    <p>{this.props.user.data.user_email}</p>
                </div>

                <div className="profile__group">
                    <label className="form__label">{getTextNode('Website')}</label>
                    <p>{formatURL(this.state.artist.full.about.website)}</p>
                </div>

                <div className="profile__group">
                    <label className="form__label">{getTextNode('Main contact number')}</label>
                    <p>{this.state.artist.admin.phone_number}</p>
                </div>

                <div className="profile__group">
                    <label className="form__label">{getTextNode('Bio')}</label>
                    <p>{this.state.artist.full.about.description}</p>
                </div>

                <div className="profile__group">
                    <label className="form__label">{getTextNode('Genres')}</label>
                    <ul className="profile__genre-list">
                        {genres}
                    </ul>
                </div>

                {socialMediaProfiles}

                <div className="form__buttons form__buttons--padded">
                    <button type="button" onClick={() => { this.props.edit(<EditArtistAccount user={this.state.artist} cancel={this.props.cancel} />); }} className="button__account-form--submit">Edit</button>
                </div>

            </div>
        );
    }
}

ArtistProfile.propTypes = {
    user: PropTypes.object,
    edit: PropTypes.func,
    cancel: PropTypes.func
};

export default ArtistProfile;
