import React from 'react';
import PropTypes from 'prop-types';
import Toggle from 'react-toggle';
import {
    getTextNode,
    truncateSocialProfile,
    capitalizeString
} from '../../utilities';
import { editVenueProfile } from '../../api';

class EditVenue extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            venueName: props.user.full.venue_name,
            website: props.user.full.about.website,
            phoneNumber: props.user.admin.phone_number,
            addressOne: '',
            addressTwo: '',
            addressThree: '',
            postcode: props.user.admin.postcode,
            bio: props.user.full.about.description,
            email: props.user.admin.email_address,
            facebook: '',
            twitter: '',
            instagram: '',
            capacity: props.user.admin.capacity,
            soundSystem: props.user.admin.sound_system,
            soundEngineer: props.user.admin.sound_engineer,
            technicalNotes: props.user.admin.technical_notes,
            openingHours: props.user.full.opening_hours,
            errors: {}
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        this.props.user.full.social_media_profiles.forEach((profile) => {
            if (profile.service) {
                const { state } = this;
                state[profile.service] = truncateSocialProfile(profile.profile_url);
                this.setState(state);
            }
        });

        const address = this.props.user.admin.address_text.split(',');
        this.setState({
            addressOne: address[0],
            addressTwo: address[1],
            addressThree: address[2]
        });
    }

    handleToggle(evt) {
        this.setState({ soundEngineer: evt.target.checked });
    }

    handleChange(evt) {
        const { state } = this;
        state[evt.target.name] = evt.target.value;
        this.setState(state);
    }

    handleTimeChange(evt) {
        const { openingHours } = this.state;
        openingHours[evt.target.name][evt.target.id] = evt.target.value;
        this.setState({ openingHours });
    }

    handleSubmit(evt) {
        evt.preventDefault();

        const address = `${this.state.addressOne}, ${this.state.addressTwo}, ${this.state.addressThree}, ${this.state.postcode}`;

        const details = {
            venue_name: this.state.venueName,
            description: this.state.bio,
            website: this.state.website,
            phone_number: this.state.phoneNumber,
            email_address: this.state.email,
            address_text: address,
            postcode: this.state.postcode,
            facebook_username: this.state.facebook,
            instagram_username: this.state.instagram,
            twitter_username: this.state.twitter,
            capacity: this.state.capacity,
            sound_system: this.state.soundSystem,
            sound_engineer: this.state.soundEngineer,
            technical_notes: this.state.technicalNotes,
            opening_hours: this.state.openingHours,
            idempotent: true
        };

        editVenueProfile(this.props.user.full.venue_id, details)
            .then(() => {
                this.setState({ errors: false });
            })
            .catch((error) => {
                console.log(error);
                this.setState({ errors: error.response.data.data.params });
            });
    }

    render() {
        if (!this.state.errors) {
            return <h2>{getTextNode('Profile successfully changed')}</h2>;
        }

        const nameError = this.state.errors.venue_name ? <p className="form__error">{this.state.errors.venue_name}</p> : null;
        const emailError = this.state.errors.email_address ? <p className="form__error">{this.state.errors.email_address}</p> : null;
        const bioError = this.state.errors.description ? <p className="form__error">{this.state.errors.description}</p> : null;
        const websiteError = this.state.errors.website ? <p className="form__error">{this.state.errors.website}</p> : null;
        const phoneError = this.state.errors.phone_number ? <p className="form__error">{this.state.errors.phone_number}</p> : null;
        const facebookError = this.state.errors.facebook_username ? <p className="form__error">{this.state.errors.facebook_username}</p> : null;
        const instagramError = this.state.errors.instagram_username ? <p className="form__error">{this.state.errors.instagram_username}</p> : null;
        const twitterError = this.state.errors.twitter_username ? <p className="form__error">{this.state.errors.twitter_username}</p> : null;
        const dayError = this.state.errors.opening_hours ? <p className="form__error">{this.state.errors.opening_hours}</p> : null;
        const soundSystemError = this.state.errors.sound_system ? <p className="form__error">{this.state.errors.sound_system}</p> : null;
        const notesError = this.state.errors.technical_notes ? <p className="form__error">{this.state.errors.technical_notes}</p> : null;

        const days = Object.keys(this.props.user.full.opening_hours);
        const openingHoursForm = days.map((day) => {
            return (
                <div className="form__input-group--day" key={day}>
                    <label className="form__label">{capitalizeString(day)}</label>
                    <input name={day} id="open" type="time" className="form__input form__input--time" value={this.state.openingHours[day] ? this.state.openingHours[day].open : ''} onChange={this.handleTimeChange} />
                    <span>-</span>
                    <input name={day} id="close" type="time" className="form__input form__input--time" value={this.state.openingHours[day] ? this.state.openingHours[day].close : ''} onChange={this.handleTimeChange} />
                </div>
            );
        });

        return (
            <form onSubmit={this.handleSubmit}>
                <h2 className="form__title">{getTextNode('Edit Profile')}</h2>

                <div className="form__input-group">
                    <label className="form__label">{getTextNode('Venue name *')}</label>
                    <input name="venueName" type="text" required autoComplete="true" className="form__input" value={this.state.venueName} onChange={this.handleChange} />
                </div>
                {nameError}

                <div className="form__input-group">
                    <label className="form__label">{getTextNode('Email address *')}</label>
                    <input name="email" type="email" required autoComplete="true" className="form__input" value={this.state.email} onChange={this.handleChange} />
                </div>
                {emailError}

                <div className="form__input-group">
                    <label className="form__label">{getTextNode('Main contact number (this will not be shared)')}</label>
                    <input name="phoneNumber" type="tel" autoComplete="true" className="form__input" value={this.state.phoneNumber} onChange={this.handleChange} />
                </div>
                {phoneError}

                <div className="form__input-group">
                    <label className="form__label">{getTextNode('Address')}</label>
                    <input name="addressOne" type="text" required autoComplete="true" placeholder="Address line 1" className="form__input" value={this.state.addressOne} onChange={this.handleChange} />
                </div>

                <div className="form__input-group">
                    <input name="addressTwo" type="text" required autoComplete="true" placeholder="Address line 2" className="form__input--address" value={this.state.addressTwo} onChange={this.handleChange} />
                </div>

                <div className="form__input-group">
                    <input name="addressThree" type="text" required autoComplete="true" placeholder="Town/city" className="form__input--address" value={this.state.addressThree} onChange={this.handleChange} />
                </div>

                <div className="form__input-group">
                    <input name="postcode" type="text" required autoComplete="true" placeholder="Postcode" className="form__input--address" value={this.state.postcode} onChange={this.handleChange} />
                </div>

                <div className="form__input-group">
                    <label className="form__label">{getTextNode('Website')}</label>
                    <input name="website" type="url" autoComplete="true" className="form__input" value={this.state.website} onChange={this.handleChange} />
                </div>
                {websiteError}

                <div className="form__input-group">
                    <label className="form__label">
                        {getTextNode('Bio')}
                        <span>{getTextNode('200 words max')}</span>
                    </label>
                    <textarea name="bio" type="text" autoComplete="true" className="form__input--bio" value={this.state.bio} onChange={this.handleChange} />
                </div>
                {bioError}

                <div className="form__input-group">
                    <label className="form__label">{getTextNode('Opening times (24hr)')}</label>
                    {openingHoursForm}
                </div>
                {dayError}

                <h2 className="form__title">{getTextNode('Social')}</h2>

                <div className="form__input-group">
                    <label className="form__label">{getTextNode('Facebook')}</label>
                    <div className="form__input-group--social">
                        <p className="brand">{getTextNode('facebook.com/')}</p>
                        <input name="facebook" type="text" autoComplete="true" className="form__input" value={this.state.facebook} onChange={this.handleChange} />
                    </div>
                </div>
                {facebookError}

                <div className="form__input-group">
                    <label className="form__label">{getTextNode('Instagram')}</label>
                    <div className="form__input-group--social">
                        <p className="brand">
                            {getTextNode('instagram.com')}
/
                        </p>
                        <input name="instagram" type="text" autoComplete="true" className="form__input" value={this.state.instagram} onChange={this.handleChange} />
                    </div>
                </div>
                {instagramError}

                <div className="form__input-group">
                    <label className="form__label">{getTextNode('Twitter')}</label>
                    <div className="form__input-group--social">
                        <p className="brand">{getTextNode('twitter.com/')}</p>
                        <input name="twitter" type="text" autoComplete="true" className="form__input" value={this.state.twitter} onChange={this.handleChange} />
                    </div>
                </div>
                {twitterError}

                <h2 className="form__title">{getTextNode('Venue Spec')}</h2>
                <div className="form__input-group">
                    <label className="form__label">{getTextNode('Capacity')}</label>
                    <input name="capacity" type="number" autoComplete="true" className="form__input" value={this.state.capacity} onChange={this.handleChange} />
                </div>

                <div className="form__input-group">
                    <label className="form__label">
                        {getTextNode('Sound system description')}
                        <span>{getTextNode('200 words max')}</span>
                    </label>
                    <textarea name="soundSystem" type="text" autoComplete="true" className="form__input--bio" value={this.state.soundSystem} onChange={this.handleChange} />
                </div>
                {soundSystemError}

                <div className="form__input-group">
                    <label className="form__label">{getTextNode('Onsite sound engineer')}</label>
                    <div className="form__toggle">
                        <Toggle
                            defaultChecked={this.state.soundEngineer}
                            onChange={this.handleToggle}
                            icons={{
                                checked: 'yes',
                                unchecked: 'no'
                            }}
                        />
                    </div>
                </div>

                <div className="form__input-group">
                    <label className="form__label">
                        {getTextNode('Additional information')}
                        <span>{getTextNode('200 words max')}</span>
                    </label>
                    <textarea name="technicalNotes" type="text" autoComplete="true" className="form__input--bio" value={this.state.technicalNotes} onChange={this.handleChange} />
                </div>
                {notesError}

                <div className="form__buttons">
                    <button type="button" onClick={this.props.cancel} className="button__account-form--cancel">{getTextNode('Cancel')}</button>
                    <button type="submit" className="button__account-form--submit">{getTextNode('Save')}</button>
                </div>

            </form>
        );
    }
}

EditVenue.propTypes = {
    user: PropTypes.object,
    cancel: PropTypes.func
};

export default EditVenue;
