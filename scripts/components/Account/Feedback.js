import React from 'react';
import { getTextNode } from '../../utilities';
import { feedback } from '../../api';

class Feedback extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            feedback: '',
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
            text_content: this.state.feedback,
            idempotent: true
        };

        feedback(details)
            .then(() => {
                this.setState({ errors: false });
            })
            .catch((error) => {
                this.setState({ errors: error.response.data.data.params });
            });
    }

    render() {
        if (!this.state.errors) {
            return (
                <div>
                    <h2>{getTextNode('Thanks, your feedback has been sent!')}</h2>
                    <button type="button" className="button__account-form--submit">{getTextNode('Back to app')}</button>
                </div>
            );
        }

        const wordsError = this.state.errors.text_content ? <p className="form__error">{this.state.errors.text_content}</p> : null;

        return (
            <form onSubmit={this.handleSubmit}>
                <h2 className="form__title">{getTextNode('Feedback')}</h2>
                <div className="form__input-group">
                    <label className="form__label">
                        {getTextNode('We really appreciate your feedback, we are constantly looking to improve ad update polynation to give musicians, venues and music lovers an amazing experince')}
                    </label>
                    <textarea name="feedback" type="text" required autoComplete="true" className="form__input--feedback" value={this.state.feedback} onChange={this.handleChange} />
                </div>
                {wordsError}

                <div className="form__buttons">
                    <button type="submit" className="button__account-form--submit">{getTextNode('Send feedback')}</button>
                </div>
            </form>
        );
    }
}

export default Feedback;
