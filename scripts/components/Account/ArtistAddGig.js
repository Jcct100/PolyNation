import React from 'react';
import PropTypes from 'prop-types';
import { requestGig } from '../../api';
import { getTextNode } from '../../utilities';

class ArtistAddGig extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            venueName: '',
            venueEmail: '',
            venueWebsite: '',
            message: '',
            errors: {}
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(evt) {
        const { state } = this;
        state[evt.target.name] = evt.target.value;
        this.setState(state);
    }

    handleSubmit(evt) {
        evt.preventDefault();
        const details = {
            venue_name: this.state.venueName,
            venue_email_address: this.state.venueEmail,
            venue_website: this.state.venueWebsite,
            message: this.state.message
        };

        requestGig(this.props.artist, details)
            .then(() => {
                this.setState({ errors: false });
            })
            .catch((error) => {
                this.setState({ errors: error.response.data.data.params });
            });
    }

    render() {
        if (!this.state.errors) {
            return <h2>{getTextNode('Thanks. Your gig has been submitted')}</h2>;
        }

        const nameError = this.state.errors.venue_name ? <p className="form__error">{this.state.errors.venue_name}</p> : null;
        const messageError = this.state.errors.message ? <p className="form__error">{this.state.errors.message}</p> : null;

        return (
            <form onSubmit={this.handleSubmit}>
                <h2 className="form__title">{getTextNode('Add gig')}</h2>
                <p className="form__subtitle">
                    {getTextNode('Currently only venues can add gigs, please contact the venue to add your gig onto polynation.')}
                </p>

                <div className="form__input-group">
                    <label className="form__label">{getTextNode('Venue name *')}</label>
                    <input name="venueName" type="text" required autoComplete="true" className="form__input" value={this.state.venueName} onChange={this.handleChange} />
                </div>
                {nameError}

                <div className="form__input-group">
                    <label className="form__label">{getTextNode('Venue email address *')}</label>
                    <input name="venueEmail" type="email" required autoComplete="true" className="form__input" value={this.state.venueEmail} onChange={this.handleChange} />
                </div>

                <div className="form__input-group">
                    <label className="form__label">{getTextNode('Venue website *')}</label>
                    <input name="venueWebsite" type="url" required autoComplete="true" className="form__input" value={this.state.venueWebsite} onChange={this.handleChange} />
                </div>

                <div className="form__input-group">
                    <label className="form__label">{getTextNode('Message *')}</label>
                    <textarea name="message" type="text" required autoComplete="true" className="form__input--bio" value={this.state.message} onChange={this.handleChange} />
                </div>
                {messageError}

                <div className="form__buttons">
                    <button type="submit" className="button__account-form--submit">{getTextNode('Send')}</button>
                </div>
            </form>
        );
    }
}

ArtistAddGig.propTypes = {
    artist: PropTypes.number
};

export default ArtistAddGig;
