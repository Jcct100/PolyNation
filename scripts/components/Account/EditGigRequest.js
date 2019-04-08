import React from 'react';
import PropTypes from 'prop-types';

import { editGigRequest } from '../../api';
import { getTextNode } from '../../utilities';

class EditGigRequest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            request: '',
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
            text_content: this.state.request
        };

        editGigRequest(this.props.artist, this.props.gig.gig_id, details)
            .then(() => {
                this.setState({ errors: false });
            })
            .catch((error) => {
                this.setState({ errors: error.response.data.data.params });
            });
    }

    render() {
        if (!this.state.errors) {
            return <h2>Thanks, your request has been sent!</h2>;
        }

        const wordsError = this.state.errors.text_content ? <p className="form__error">{this.state.errors.text_content}</p> : null;

        return (
            <form onSubmit={this.handleSubmit}>
                <h2 className="form__title">{getTextNode('Request a change to your gig')}</h2>
                <div className="form__input-group">
                    <label className="form__label">
                        {getTextNode('Please provide details to the venue')}
                        <span>{getTextNode('Min 10 characters')}</span>
                    </label>
                    <textarea name="request" type="text" required autoComplete="true" className="form__input--feedback" value={this.state.request} onChange={this.handleChange} />
                </div>
                {wordsError}

                <div className="form__buttons">
                    <button type="submit" className="button__account-form--submit">{getTextNode('Send')}</button>
                </div>
            </form>
        );
    }
}

EditGigRequest.propTypes = {
    gig: PropTypes.object,
    artist: PropTypes.number
};

export default EditGigRequest;
