import React from 'react';
import CreatableSelect from 'react-select/lib/Creatable';
import PropTypes from 'prop-types';
import { getTextNode } from '../../utilities';
import {
    addGig,
    search,
    inviteArtist
} from '../../api';

class VenueAddGig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gigName: '',
            description: '',
            openDate: '',
            openTime: '',
            closeDate: '',
            closeTime: '',
            doors: '',
            tickets: '',
            schedule: [{ artist_id: '', start_time: '' }],
            searchOptions: [],
            errors: {},
            artistEmail: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleAddArtist = this.handleAddArtist.bind(this);
        this.handleArtistChange = this.handleArtistChange.bind(this);
        this.sendInvite = this.sendInvite.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(evt) {
        const { state } = this;
        state[evt.target.name] = evt.target.value;
        this.setState(state);
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

    handleAddArtist() {
        this.setState((prevState) => {
            return {
                schedule: prevState.schedule.concat([{ artist_id: '', start_time: '' }])
            };
        });
    }

    handleArtistChange(index, evt) {
        if (evt) {
            this.setState((prevState) => {
                const newSchedule = prevState.schedule.map((artist, stateIndex) => {
                    if (index !== stateIndex) return artist;
                    return { ...artist, artist_id: evt.value };
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

    handleTimeChange(index, evt) {
        if (evt) {
            evt.persist();
            this.setState((prevState) => {
                const newSchedule = prevState.schedule.map((artist, stateIndex) => {
                    if (index !== stateIndex) return artist;
                    return { ...artist, start_time: `${this.state.openDate} ${evt.target.value}` };
                });
                return {
                    schedule: newSchedule
                };
            });
        }
    }

    sendInvite(artist) {
        const details = {
            artist_name: artist,
            email_address: this.state.artistEmail
        };

        inviteArtist(this.props.venue, details)
            .then((res) => {
                this.setState((prevState) => {
                    const newSchedule = prevState.schedule.map((stateArtist) => {
                        if (artist !== stateArtist.artist_id) return stateArtist;
                        return { ...stateArtist, artist_id: res.created_artist_id };
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

    handleSubmit(evt) {
        evt.preventDefault();

        const openDatetime = `${this.state.openDate} ${this.state.openTime}`;
        const closeDatetime = `${this.state.closeDate} ${this.state.closeTime}`;

        const details = {
            gig_name: this.state.gigName,
            doors_open_start_datetime: openDatetime,
            end_datetime: closeDatetime,
            description: this.state.description,
            buy_ticket_url: this.state.tickets,
            schedule: this.state.schedule
        };

        addGig(this.props.venue, details)
            .then(() => {
                this.setState({ errors: false });
            })
            .catch((error) => {
                this.setState({ errors: error.response.data.data.params });
            });
    }

    render() {
        if (!this.state.errors) {
            return <h2>{getTextNode('Your gig has been submitted')}</h2>;
        }

        const gigNameError = this.state.errors.gig_name ? <p className="form__error">{this.state.errors.gig_name}</p> : null;
        const descriptionError = this.state.errors.description ? <p className="form__error">{this.state.errors.description}</p> : null;
        const openError = this.state.errors.doors_open_start_datetime ? <p className="form__error">{this.state.errors.doors_open_start_datetime}</p> : null;
        const closeError = this.state.errors.end_datetime ? <p className="form__error">{this.state.errors.end_datetime}</p> : null;
        const scheduleError = this.state.errors.schedule ? <p className="form__error">{this.state.errors.schedule}</p> : null;

        const customStyles = {
            option: (provided) => {
                return {
                    ...provided,
                    borderBottom: '1px solid grey',
                    color: 'black',
                    padding: 15,
                    cursor: 'pointer'
                };
            },
            dropdownIndicator: (styles) => {
                return { ...styles, display: 'none' };
            },
            indicatorSeparator: (styles) => {
                return { ...styles, display: 'none' };
            },
            control: (styles) => {
                return {
                    ...styles,
                    '&:hover': { borderColor: '#a243f7' },
                    borderColor: 'transparent',
                    borderWidth: 2,
                    borderRadius: 'none',
                    boxShadow: 'none',
                    width: 250,
                    marginTop: 16,
                    marginBottom: 16,
                    outline: 'none',
                    cursor: 'auto',
                    height: 50
                };
            }
        };

        const options = this.state.searchOptions.map((option) => {
            return {
                value: option.id,
                label: option.title
            };
        });

        const lineup = this.state.schedule.map((artist, index) => {
            let emailInput = null;
            /* eslint-disable-next-line no-restricted-globals */
            if (isNaN(artist.artist_id)) {
                emailInput = (
                    <div className="form__input-group">
                        <label className="form__label">{getTextNode(`To add ${artist.artist_id} to this gig, invite them to Polynation`)}</label>
                        <div className="form__artist-email">
                            <input name="artistEmail" type="text" placeholder="artist email" required autoComplete="true" className="form__input" value={this.state.artistEmail} onChange={this.handleChange} />
                            <button type="button" onClick={() => { this.sendInvite(artist.artist_id); }}>{getTextNode('Send invite')}</button>
                        </div>
                    </div>
                );
            }

            return (
                <div>
                    <div key={artist} className="form__input-group--lineup">
                        <div>
                            <label className="form__label">{getTextNode('Artist *')}</label>
                            <CreatableSelect
                                /* eslint-disable-next-line react/jsx-no-bind */
                                onChange={this.handleArtistChange.bind(this, index)}
                                onInputChange={this.handleInputChange}
                                isClearable
                                options={options}
                                styles={customStyles}
                                backspaceRemovesValue={false}
                                placeholder={`Artist #${index + 1}`}
                                classNamePrefix="react-select"
                                noOptionsMessage={() => { return 'Type to search artists...'; }}
                            />
                        </div>
                        <div className="form__input-group--time">
                            <label className="form__label">{getTextNode('start time (24hr) *')}</label>
                            <input name="startTime" type="time" required autoComplete="true" className="form__input" value={this.state.startTime} onChange={this.handleTimeChange.bind(this, index)} />
                        </div>
                        <button type="button" className={this.state.schedule.length > 1 ? 'button__close--lineup' : 'button__close--lineup button__close--lineup--hidden'} onClick={this.handleRemoveArtist.bind(this, index)}>x</button>
                    </div>
                    {emailInput}
                </div>
            );
        });

        return (
            <form onSubmit={this.handleSubmit}>
                <h2 className="form__title">{getTextNode('Add gig')}</h2>

                <div className="form__input-group">
                    <label className="form__label">{getTextNode('Gig name *')}</label>
                    <input name="gigName" type="text" required autoComplete="true" className="form__input" value={this.state.gigName} onChange={this.handleChange} />
                </div>
                {gigNameError}

                <div className="form__input-group--full-name">
                    <div className="form__input-group form__input-group--name">
                        <label className="form__label">{getTextNode('Start Date *')}</label>
                        <input name="openDate" type="date" required className="form__input" value={this.state.openDate} onChange={this.handleChange} />
                    </div>

                    <div className="form__input-group form__input-group--name">
                        <label className="form__label">{getTextNode('Doors open (24hr) *')}</label>
                        <input name="openTime" type="time" required autoComplete="true" className="form__input" value={this.state.openTime} onChange={this.handleChange} />
                    </div>
                </div>
                {openError}

                <div className="form__input-group--full-name">
                    <div className="form__input-group form__input-group--name">
                        <label className="form__label">{getTextNode('End date *')}</label>
                        <input name="closeDate" type="date" required className="form__input" value={this.state.closeDate} onChange={this.handleChange} />
                    </div>

                    <div className="form__input-group form__input-group--name">
                        <label className="form__label">{getTextNode('End time (24hr) *')}</label>
                        <input name="closeTime" type="time" required autoComplete="true" className="form__input" value={this.state.closeTime} onChange={this.handleChange} />
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
                    <button type="submit" className="button__account-form--submit button__account-form--submit-long">{getTextNode('+ add gig to Polynation')}</button>
                </div>
            </form>
        );
    }
}

VenueAddGig.propTypes = {
    venue: PropTypes.number
};

export default VenueAddGig;
