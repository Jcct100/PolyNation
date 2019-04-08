import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { loginUser } from '../api';
import { getTextNode } from '../utilities';

class LoginForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            errors: {}
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(evt) {
        const { state } = this;
        state[evt.target.name] = evt.target.value;

        this.setState(state);
    }

    handleSubmit(evt) {
        evt.preventDefault();

        const data = {
            username: this.state.email,
            password: this.state.password
        };

        this.login(data);
    }

    login(data) {
        // Posts to API for authentication
        loginUser(data)
            .then((res) => {
                const { token } = res;
                const details = {
                    displayName: res.user_display_name,
                    email: res.user_email,
                    niceName: res.user_nicename
                };
                this.props.updateUser(token, details);
            })
            .catch((error) => {
                this.setState({ errors: error.response.data });
            });
    }

    render() {
        // Redirect to the previous page if a token is found
        if (this.props.user.token) {
            return (
                <Redirect to={this.props.location.state ? this.props.location.state.from : '/'} />
            );
        }

        const invalidUsername = this.state.errors.code === '[jwt_auth] invalid_username' ? <p className="form__error">{this.state.errors.message}</p> : null;
        const incorrectPassword = this.state.errors.code === '[jwt_auth] incorrect_password' ? <p className="form__error">{this.state.errors.message}</p> : null;
        const invalidPassword = this.state.errors.code === '[jwt_auth] invalid_password' ? <p className="form__error">{this.state.errors.message}</p> : null;

        return (
            <div className="login">
                <form onSubmit={this.handleSubmit} className="login__form form">
                    <div className="form__input-group">
                        <label htmlFor="email" className="form__label">{getTextNode('Email address')}</label>
                        <input name="email" type="text" required autoComplete="true" className="form__input" value={this.state.email} onChange={this.handleChange} />
                    </div>
                    {invalidUsername}

                    <div className="form__input-group">
                        <label htmlFor="password" className="form__label">{getTextNode('Password')}</label>
                        <input name="password" type="password" required autoComplete="true" className="form__input" value={this.state.password} onChange={this.handleChange} />
                    </div>
                    {incorrectPassword}
                    {invalidPassword}

                    <button type="submit" className="button__form--submit">{getTextNode('login')}</button>
                </form>
            </div>
        );
    }
}

LoginForm.propTypes = {
    user: PropTypes.object,
    updateUser: PropTypes.func.isRequired,
    location: PropTypes.object
};

export default LoginForm;
