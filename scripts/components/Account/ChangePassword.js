import React from 'react';
import PropTypes from 'prop-types';
import { getTextNode } from '../../utilities';
import { changePassword } from '../../api';

class ChangePassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: '',
            new: '',
            confirm: '',
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
            current_password: this.state.current,
            new_password: this.state.new,
            confirm_password: this.state.confirm,
            idempotent: true
        };

        changePassword(details)
            .then(() => {
                this.setState({ errors: false });
            })
            .catch((error) => {
                this.setState({ errors: error.response.data.data.params });
            });
    }

    render() {
        const currentError = this.state.errors.current_password ? <p className="form__error">{this.state.errors.current_password}</p> : null;
        const newError = this.state.errors.new_password ? <p className="form__error">{this.state.errors.new_password}</p> : null;
        const confirmError = this.state.errors.confirm_password ? <p className="form__error">{this.state.errors.confirm_password}</p> : null;
        const success = !this.state.errors ? <p className="form__success">Password successfully updated</p> : null;

        return (
            <div>
                <h2 className="form__title">{getTextNode('Change password')}</h2>
                <form onSubmit={this.handleSubmit}>
                    <div className="form__input-group">
                        <label className="form__label">{getTextNode('Current password *')}</label>
                        <input name="current" type="password" required autoComplete="true" className="form__input" value={this.state.current} onChange={this.handleChange} />
                    </div>
                    {currentError}

                    <div className="form__input-group">
                        <label className="form__label">{getTextNode('New password *')}</label>
                        <input name="new" type="password" required autoComplete="true" className="form__input" value={this.state.new} onChange={this.handleChange} />
                    </div>
                    {newError}

                    <div className="form__input-group">
                        <label className="form__label">{getTextNode('Reenter password *')}</label>
                        <input name="confirm" type="password" required autoComplete="true" className="form__input" value={this.state.confirm} onChange={this.handleChange} />
                    </div>
                    {confirmError}
                    {success}

                    <div className="form__buttons">
                        <button type="button" onClick={this.props.cancel} className="button__account-form--cancel">{getTextNode('Cancel')}</button>
                        <button type="submit" className="button__account-form--submit">{getTextNode('Save')}</button>
                    </div>
                </form>
            </div>
        );
    }
}

ChangePassword.propTypes = {
    cancel: PropTypes.func
};

export default ChangePassword;
