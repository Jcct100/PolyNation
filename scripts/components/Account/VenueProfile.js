import React from 'react';
import PropTypes from 'prop-types';
import EditVenue from './EditVenue';
import { getVenueOwner } from '../../api';
import {
    getTextNode,
    capitalizeString,
    truncateSocialProfile,
    formatURL
} from '../../utilities';

class VenueProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            venue: {},
            loading: true
        };
    }

    componentWillMount() {
        getVenueOwner(this.props.user.data.account_type.entity.entity_id)
            .then((res) => {
                this.setState({ venue: res }, () => {
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

        const hours = Object.entries(this.state.venue.full.opening_hours);
        const openingTimes = hours.map(([day, hours]) => {
            return (
                <tr key={day}>
                    <td className="hours-table__day">
                        {capitalizeString(day)}
                    </td>
                    <td>
                        {hours.open ? `${hours.open} - ${hours.close}` : 'Closed'}
                    </td>
                </tr>
            );
        });

        const socialMediaProfiles = this.state.venue.full.social_media_profiles.map((profile) => {
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
                    <label className="form__label">{getTextNode('Venue name')}</label>
                    <p>{this.state.venue.full.venue_name}</p>
                </div>

                <div className="profile__group">
                    <label className="form__label">{getTextNode('Email address')}</label>
                    <p>{this.state.venue.admin.email_address}</p>
                </div>

                <div className="profile__group">
                    <label className="form__label">{getTextNode('Telephone number')}</label>
                    <p>{this.state.venue.admin.phone_number}</p>
                </div>

                <div className="profile__group">
                    <label className="form__label">{getTextNode('Address')}</label>
                    <p>{this.state.venue.admin.address_text}</p>
                </div>

                <div className="profile__group">
                    <label className="form__label">{getTextNode('Website')}</label>
                    <p>{formatURL(this.state.venue.full.about.website)}</p>
                </div>

                <div className="profile__group">
                    <label className="form__label">{getTextNode('About')}</label>
                    <p>{this.state.venue.full.about.description}</p>
                </div>

                <div className="profile__group">
                    <label className="form__label">{getTextNode('Opening times')}</label>
                    <table className="hours-table">
                        <tbody>
                            {openingTimes}
                        </tbody>
                    </table>
                </div>

                {socialMediaProfiles}

                <h2 className="form__title form__title--padded">Venue spec</h2>
                <div className="profile__group">
                    <label className="form__label">{getTextNode('Capacity')}</label>
                    <p>{this.state.venue.admin.capacity}</p>
                </div>

                <div className="profile__group">
                    <label className="form__label">{getTextNode('Sound system description')}</label>
                    <p>{this.state.venue.admin.sound_system}</p>
                </div>

                <div className="profile__group">
                    <label className="form__label">{getTextNode('On site sound engineer')}</label>
                    <p>{this.state.venue.admin.sound_engineer ? 'Yes' : 'No'}</p>
                </div>

                <div className="profile__group">
                    <label className="form__label">{getTextNode('Additional information')}</label>
                    <p>{this.state.venue.admin.technical_notes}</p>
                </div>

                <div className="form__buttons form__buttons--padded">
                    <button type="button" onClick={() => { this.props.edit(<EditVenue user={this.state.venue} cancel={this.props.cancel} />); }} className="button__account-form--submit">Edit</button>
                </div>

            </div>
        );
    }
}

VenueProfile.propTypes = {
    user: PropTypes.object,
    edit: PropTypes.func,
    cancel: PropTypes.func
};

export default VenueProfile;
