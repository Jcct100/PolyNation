import React from 'react';
import PropTypes from 'prop-types';
import { getTextNode } from '../../utilities';
import { editProfile } from '../../api';

class EditStandard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: props.user.data.display_name,
            lastName: props.user.data.display_name,
            email: props.user.data.user_email,
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
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            email_address: this.state.email,
            idempotent: true
        };

        editProfile(details)
            .then(() => {
                this.setState({ errors: false });
            })
            .catch((error) => {
                this.setState({ errors: error.response.data.data.params });
            });
    }

    render() {
        if (!this.state.errors) {
            return <h2>{getTextNode('Profile successfully changed')}</h2>;
        }
        const emailError = this.state.errors.email_address ? <p className="form__error">{this.state.errors.email_address}</p> : null;

        return (
            <form onSubmit={this.handleSubmit}>
                <h2 className="form__title">{getTextNode('Edit Profile')}</h2>
                <div className="form__input-group--full-name">
                    <div className="form__input-group form__input-group--name">
                        <label className="form__label">{getTextNode('First name')}</label>
                        <input name="firstName" type="text" required autoComplete="true" className="form__input" value={this.state.firstName} onChange={this.handleChange} />
                    </div>

                    <div className="form__input-group form__input-group--name">
                        <label className="form__label">{getTextNode('Last name')}</label>
                        <input name="lastName" type="text" required autoComplete="true" className="form__input" value={this.state.lastName} onChange={this.handleChange} />
                    </div>
                </div>

                <div className="form__input-group">
                    <label className="form__label">{getTextNode('Email address')}</label>
                    <input name="email" type="email" required autoComplete="true" className="form__input" value={this.state.email} onChange={this.handleChange} />
                </div>
                {emailError}

                <div className="form__buttons">
                    <button type="button" onClick={this.props.cancel} className="button__account-form--cancel">{getTextNode('Cancel')}</button>
                    <button type="submit" className="button__account-form--submit">{getTextNode('Save')}</button>
                </div>
            </form>
        );
    }
}

EditStandard.propTypes = {
    user: PropTypes.object,
    cancel: PropTypes.func
};

export default EditStandard;
