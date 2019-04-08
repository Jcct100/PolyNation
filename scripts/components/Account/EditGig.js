import React from 'react';
import PropTypes from 'prop-types';
import {
    getGig,
    search,
    editGig,
    inviteArtist
} from '../../api';
import { getTextNode } from '../../utilities';
import SearchBar from '../SearchBar';

class EditGig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gigName: '',
            startDate: '',
            startTime: '',
            endDate: '',
            endTime: '',
            description: '',
            schedule: [],
            tickets: '',
            searchOptions: [],
            artistEmail: '',
            errors: {}
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
        this.handleAddArtist = this.handleAddArtist.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        getGig(this.props.gig.gig_id)
            .then((res) => {
                this.setState({
                    gigName: res.gig_title,
                    startDate: res.predicted_start_datetime.slice(0, 10),
                    startTime: res.predicted_start_datetime.slice(11, 16),
                    endDate: res.end_datetime.slice(0, 10),
                    endTime: res.end_datetime.slice(11, 16),
                    description: res.description,
                    schedule: res.artist_schedule,
                    tickets: res.tickets.link_url
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    handleInputChange(evt) {
        const details = {
            query_type: 'artist-only',
            query: evt,
            query_meta: 'nosplit'
        };
        if (evt.length >= 3) {
            search(details)
                .then((res) => {
                    this.setState({ searchOptions: res.data.results });
                });
        }
    }

    handleChange(evt) {
        const { state } = this;
        state[evt.target.name] = evt.target.value;
        this.setState(state);
    }

    handleArtistChange(index, evt) {
        if (evt) {
            this.setState((prevState) => {
                const newSchedule = prevState.schedule.map((stateArtist, stateIndex) => {
                    if (index !== stateIndex) return stateArtist;
                    /* eslint-disable-next-line no-restricted-globals */
                    const newId = isNaN(evt.value) ? 'noID' : parseInt(evt.value, 10);
                    return {
                        ...stateArtist,
                        artist: {
                            ...stateArtist.artist, artist_id: newId, artist_name: evt.label
                        }
                    };
                });
                return {
                    schedule: newSchedule
                };
            });
        }
    }

    handleRemoveArtist(index) {
        this.setState((prevState) => {
            return {
                schedule: prevState.schedule.filter((artist, stateIndex) => { return index !== stateIndex; })
            };
        });
    }

    handleAddArtist() {
        this.setState((prevState) => {
            return {
                schedule: prevState.schedule.concat([
                    {
                        artist: {
                            artist_id: '',
                            artist_name: ''
                        },
                        predicted_start_time: ''
                    }
                ])
            };
        });
    }

    handleTimeChange(index, evt) {
        if (evt) {
            evt.persist();
            this.setState((prevState) => {
                const newSchedule = prevState.schedule.map((stateArtist, stateIndex) => {
                    if (index !== stateIndex) return stateArtist;
                    return {
                        ...stateArtist,
                        predicted_start_time: `${this.state.startDate} ${evt.target.value}`
                    };
                });
                return {
                    schedule: newSchedule
                };
            });
        }
    }

    handleSubmit(evt) {
        evt.preventDefault();

        const newSchedule = this.state.schedule.map((artist) => {
            return {
                artist_id: artist.artist.artist_id,
                start_time: `${this.state.startDate} ${artist.predicted_start_time.slice(11, 16)}`
            };
        });

        const openDatetime = `${this.state.startDate} ${this.state.startTime}`;
        const endDatetime = `${this.state.endDate} ${this.state.endTime}`;

        const details = {
            gig_name: this.state.gigName,
            doors_open_start_datetime: openDatetime,
            end_datetime: endDatetime,
            description: this.state.description,
            buy_ticket_url: this.state.tickets,
            schedule: newSchedule
        };

        editGig(this.props.gig.venue.entity_id, this.props.gig.gig_id, details)
            .then(() => {
                this.setState({ errors: false });
            })
            .catch((error) => {
                this.setState({ errors: error.response.data.data.params });
            });
    }

    sendInvite(artist) {
        const details = {
            artist_name: artist,
            email_address: this.state.artistEmail
        };

        inviteArtist(this.props.gig.venue.entity_id, details)
            .then((res) => {
                this.setState((prevState) => {
                    const newSchedule = prevState.schedule.map((stateArtist) => {
                        if (artist !== stateArtist.artist.artist_name) return stateArtist;
                        return {
                            ...stateArtist,
                            artist: {
                                ...stateArtist.artist, artist_id: res.created_artist_id
                            }
                        };
                    });
                    return {
                        schedule: newSchedule,
                        artistEmail: ''
                    };
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        if (!this.state.errors) {
            return <h2>{getTextNode('Your gig has been updated')}</h2>;
        }

        const gigNameError = this.state.errors.gig_name ? <p className="form__error">{this.state.errors.gig_name}</p> : null;
        const descriptionError = this.state.errors.description ? <p className="form__error">{this.state.errors.description}</p> : null;
        const openError = this.state.errors.doors_open_start_datetime ? <p className="form__error">{this.state.errors.doors_open_start_datetime}</p> : null;
        const closeError = this.state.errors.end_datetime ? <p className="form__error">{this.state.errors.end_datetime}</p> : null;
        const scheduleError = this.state.errors.schedule ? <p className="form__error">{this.state.errors.schedule}</p> : null;

        const options = this.state.searchOptions.map((option) => {
            return {
                value: option.id,
                label: option.title
            };
        });

        const lineup = this.state.schedule.map((artist, index) => {
            let emailInput = null;
            if (artist.artist.artist_id === 'noID') {
                emailInput = (
                    <div className="form__input-group">
                        <label className="form__label">{getTextNode(`To add ${artist.artist.artist_name} to this gig, invite them to Polynation`)}</label>
                        <div className="form__artist-email">
                            <input name="artistEmail" type="text" placeholder="artist email" required autoComplete="true" className="form__input" value={this.state.artistEmail} onChange={this.handleChange} />
                            <button type="button" onClick={() => { this.sendInvite(artist.artist.artist_name); }}>{getTextNode('Send invite')}</button>
                        </div>
                    </div>
                );
            }

            return (
                <div>
                    <div key={artist.artist.artist_name} className="form__input-group--lineup">
                        <div>
                            <label className="form__label">{getTextNode('Artist *')}</label>

                            <SearchBar
                                /* eslint-disable-next-line react/jsx-no-bind */
                                handleSelector={this.handleArtistChange.bind(this, index)}
                                selectedOption={{ label: artist.artist.artist_name, value: artist.artist.artist_id.toString() }}
                                updateQuery={this.handleInputChange}
                                options={options}
                                placeholder={`Artist #${index + 1}`}
                                noOptionsMessage={() => { return 'Type to search artists...'; }}
                            />
                        </div>
                        <div className="form__input-group--time">
                            <label className="form__label">{getTextNode('start time (24hr) *')}</label>
                            <input name="startTime" type="time" required autoComplete="true" className="form__input" value={artist.predicted_start_time.slice(11, 16)} onChange={this.handleTimeChange.bind(this, index)} />
                        </div>
                        <button type="button" className={this.state.schedule.length > 1 ? 'button__close--lineup' : 'button__close--lineup button__close--lineup--hidden'} onClick={this.handleRemoveArtist.bind(this, index)}>x</button>
                    </div>
                    {emailInput}
                </div>

            );
        });

        return (
            <form onSubmit={this.handleSubmit}>
                <h2 className="form__title">{getTextNode('Edit gig')}</h2>

                <div className="form__input-group">
                    <label className="form__label">{getTextNode('Gig name *')}</label>
                    <input name="gigName" type="text" required autoComplete="true" className="form__input" value={this.state.gigName} onChange={this.handleChange} />
                </div>
                {gigNameError}

                <div className="form__input-group--full-name">
                    <div className="form__input-group form__input-group--name">
                        <label className="form__label">{getTextNode('Start Date *')}</label>
                        <input name="startDate" type="date" required className="form__input" value={this.state.startDate} onChange={this.handleChange} />
                    </div>

                    <div className="form__input-group form__input-group--name">
                        <label className="form__label">{getTextNode('Doors open (24hr) *')}</label>
                        <input name="startTime" type="time" required autoComplete="true" className="form__input" value={this.state.startTime} onChange={this.handleChange} />
                    </div>
                </div>
                {openError}

                <div className="form__input-group--full-name">
                    <div className="form__input-group form__input-group--name">
                        <label className="form__label">{getTextNode('End date *')}</label>
                        <input name="endDate" type="date" required className="form__input" value={this.state.endDate} onChange={this.handleChange} />
                    </div>

                    <div className="form__input-group form__input-group--name">
                        <label className="form__label">{getTextNode('End time (24hr) *')}</label>
                        <input name="endTime" type="time" required autoComplete="true" className="form__input" value={this.state.endTime} onChange={this.handleChange} />
                    </div>
                </div>
                {closeError}

                <div className="form__input-group">
                    <label className="form__label">
                        {getTextNode('Description *')}
                        <span>{getTextNode('200 words max')}</span>
                    </label>
                    <textarea name="description" required type="text" autoComplete="true" className="form__input--bio" value={this.state.description} onChange={this.handleChange} />
                </div>
                {descriptionError}

                <h2 className="form__title">{getTextNode('Lineup')}</h2>
                <div className="form__input-group">
                    {lineup}
                    <button type="button" className="button__account-form--cancel" onClick={this.handleAddArtist}>{getTextNode('add another artist')}</button>
                </div>
                {scheduleError}

                <h2 className="form__title">{getTextNode('Tickets')}</h2>
                <div className="form__input-group">
                    <label className="form__label">{getTextNode('Link to buy tickets')}</label>
                    <input name="tickets" type="url" autoComplete="true" className="form__input" value={this.state.tickets} onChange={this.handleChange} />
                </div>

                <div className="form__buttons">
                    <button type="button" className="button__account-form--cancel">{getTextNode('Cancel')}</button>
                    <button type="submit" className="button__account-form--submit">{getTextNode('save')}</button>
                </div>
            </form>
        );
    }
}

EditGig.propTypes = {
    gig: PropTypes.object
};

export default EditGig;
