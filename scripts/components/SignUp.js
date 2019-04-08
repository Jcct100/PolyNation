import React from 'react';
import { signUpListener } from '../api';
import { getTextNode } from '../utilities';

class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            account: '',
            firstName: '',
            lastName: '',
            email: '',
            password: '',
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
            email_address: this.state.email,
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            password: this.state.password,
            idempotent: true
        };

        signUpListener(details)
            .then(() => {
                this.setState({ errors: false });
            })
            .catch((error) => {
                this.setState({ errors: error.response.data.data.params });
            });
    }

    render() {
        if (!this.state.errors) {
            return <p>Thanks for signing up to Polynation. Please verify your email to sign in.</p>;
        }
        const emailError = this.state.errors.email_address ? <p className="form__error">{this.state.errors.email_address}</p> : null;
        const passwordError = this.state.errors.password ? <p className="form__error">{this.state.errors.password}</p> : null;

        return (
            <div>
                <form onSubmit={this.handleSubmit} className="sign-up form">
                    <div className="form__input-group">
                        <label className="form__label">
                            {getTextNode('Account type *')}
                            <span className="label-link">{getTextNode('What is this?')}</span>
                        </label>
                        <select className="form__input" name="account" value={this.state.account} onChange={this.handleChange}>
                            <option value="listener">{getTextNode('Listener')}</option>
                            <option value="venue">{getTextNode('Venue')}</option>
                            <option value="artist">{getTextNode('Artist')}</option>
                        </select>
                    </div>

                    <div className="form__input-group--full-name">
                        <div className="form__input-group form__input-group--name">
                            <label className="form__label">{getTextNode('First name *')}</label>
                            <input name="firstName" type="text" required autoComplete="true" className="form__input" value={this.state.firstName} onChange={this.handleChange} />
                        </div>

                        <div className="form__input-group form__input-group--name">
                            <label className="form__label">{getTextNode('Last name *')}</label>
                            <input name="lastName" type="text" required autoComplete="true" className="form__input" value={this.state.lastName} onChange={this.handleChange} />
                        </div>
                    </div>

                    <div className="form__input-group">
                        <label className="form__label">{getTextNode('Email address *')}</label>
                        <input name="email" type="email" required autoComplete="true" className="form__input" value={this.state.email} onChange={this.handleChange} />
                    </div>
                    {emailError}

                    <div className="form__input-group">
                        <label htmlFor="password" className="form__label">{getTextNode('Create password *')}</label>
                        <input name="password" type="password" required autoComplete="true" className="form__input" value={this.state.password} onChange={this.handleChange} />
                    </div>
                    {passwordError}

                    <button type="submit" className="button__form--submit">{getTextNode('sign up')}</button>
                </form>
            </div>
        );
    }
}

export default SignUp;
