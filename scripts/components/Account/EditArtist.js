import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import {
    getTextNode,
    decodeString,
    truncateSocialProfile
} from '../../utilities';
import {
    editArtistProfile,
    getGenres,
    addGenre,
    removeGenre
} from '../../api';

class EditArtist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            genres: [],
            artistName: props.user.full.artist_name,
            website: props.user.full.about.website,
            phoneNumber: props.user.admin.phone_number,
            bio: props.user.full.about.description,
            email: props.user.admin.email_address,
            selectedOption: [],
            filteredGenres: [],
            facebook: '',
            twitter: '',
            instagram: '',
            errors: {}
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleGenreChange = this.handleGenreChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        getGenres()
            .then((res) => {
                this.setState({ genres: res.data, loading: false });
            })
            .catch((error) => {
                console.log(error);
            });

        this.props.user.full.social_media_profiles.forEach((profile) => {
            if (profile.service) {
                const { state } = this;
                state[profile.service] = truncateSocialProfile(profile.profile_url);
                this.setState(state);
            }
        });

        // Add genre buttons for genres that have already been selected
        const artistGenres = this.props.user.full.performing_genres.map((genre) => {
            const decoded = decodeString(genre.title);
            return (
                { label: decoded, value: genre.genre_id }
            );
        });
        this.setState({ selectedOption: artistGenres });
    }

    handleGenreChange(selectedOption) {
        if (this.state.selectedOption.length < 8) {
            this.setState({ selectedOption }, () => {
                const genreToAdd = this.state.selectedOption.slice(-1)[0].value;
                addGenre(this.props.user.full.artist_id, genreToAdd);
            });
        }
    }

    clearGenre(genre) {
        this.setState((prevState) => {
            // Remove the genre from the list of selected genres
            const selectedOption = prevState.selectedOption.filter((item) => {
                return item !== genre;
            });
            removeGenre(this.props.user.full.artist_id, genre.value);

            return {
                selectedOption
            };
        });
    }

    handleChange(evt) {
        const { state } = this;
        state[evt.target.name] = evt.target.value;
        this.setState(state);
    }

    handleSubmit(evt) {
        evt.preventDefault();
        const details = {
            artist_name: this.state.artistName,
            description: this.state.bio,
            website: this.state.website,
            phone_number: this.state.phoneNumber,
            email_address: this.state.email,
            facebook_username: this.state.facebook,
            instagram_username: this.state.instagram,
            twitter_username: this.state.twitter,
            idempotent: true
        };

        editArtistProfile(this.props.user.full.artist_id, details)
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

        if (this.state.loading) {
            return (
                <div className="loader" />
            );
        }

        // Styling for genre input
        const customStyles = {
            option: (provided) => {
                if (this.state.selectedOption.length >= 8) {
                    return {
                        ...provided,
                        display: 'none',
                        padding: 0
                    };
                }
                return {
                    ...provided,
                    borderBottom: '1px solid grey',
                    color: 'black',
                    padding: 15,
                    cursor: 'pointer'
                };
            },
            menuList: (styles) => {
                if (this.state.selectedOption.length >= 8) {
                    return {
                        ...styles,
                        padding: 0
                    };
                }
                return { ...styles };
            },
            multiValue: (styles) => {
                return { ...styles, display: 'none' };
            },
            multiValueLabel: (styles) => {
                return { ...styles, display: 'none' };
            },
            multiValueRemove: (styles) => {
                return { ...styles, display: 'none' };
            },
            indicatorSeparator: (styles) => {
                return { ...styles, display: 'none' };
            },
            dropdownIndicator: (styles) => {
                return { ...styles, display: 'none' };
            },
            valueContainer: (styles) => {
                if (this.state.selectedOption.length >= 8) {
                    return { ...styles, cursor: 'not-allowed' };
                }
                return { ...styles, cursor: 'auto' };
            },
            clearIndicator: (styles) => {
                return { ...styles, display: 'none' };
            },
            control: (styles) => {
                if (this.state.selectedOption.length >= 8) {
                    return {
                        ...styles,
                        '&:hover': { borderColor: '#fff' },
                        borderColor: 'transparent',
                        borderWidth: 2,
                        boxShadow: 'none',
                        outline: 'none',
                        borderRadius: 25,
                        height: 45
                    };
                }
                return {
                    ...styles,
                    '&:hover': { borderColor: '#a243f7' },
                    borderColor: 'transparent',
                    borderWidth: 2,
                    boxShadow: 'none',
                    outline: 'none',
                    borderRadius: 25,
                    cursor: 'auto',
                    height: 45
                };
            }
        };

        const options = this.state.genres.map((genre) => {
            const decoded = decodeString(genre.name);

            return {
                value: genre.genre_id,
                label: decoded
            };
        });

        const genreButtons = this.state.selectedOption.map((genre) => {
            return (
                <div key={genre.value} className="genre-item">
                    <span className="genre-filter__label">{genre.label}</span>
                    <span className="genre-filter__label--close" onClick={this.clearGenre.bind(this, genre)}>x</span>
                </div>
            );
        });

        const nameError = this.state.errors.artist_name ? <p className="form__error">{this.state.errors.artist_name}</p> : null;
        const emailError = this.state.errors.email_address ? <p className="form__error">{this.state.errors.email_address}</p> : null;
        const bioError = this.state.errors.description ? <p className="form__error">{this.state.errors.description}</p> : null;
        const websiteError = this.state.errors.website ? <p className="form__error">{this.state.errors.website}</p> : null;
        const phoneError = this.state.errors.phone_number ? <p className="form__error">{this.state.errors.phone_number}</p> : null;
        const facebookError = this.state.errors.facebook_username ? <p className="form__error">{this.state.errors.facebook_username}</p> : null;
        const instagramError = this.state.errors.instagram_username ? <p className="form__error">{this.state.errors.instagram_username}</p> : null;
        const twitterError = this.state.errors.twitter_username ? <p className="form__error">{this.state.errors.twitter_username}</p> : null;

        return (
            <form onSubmit={this.handleSubmit}>
                <h2 className="form__title">{getTextNode('Edit Profile')}</h2>

                <div className="form__input-group">
                    <label className="form__label">{getTextNode('Artist name *')}</label>
                    <input name="artistName" type="text" required autoComplete="true" className="form__input" value={this.state.artistName} onChange={this.handleChange} />
                </div>
                {nameError}

                <div className="form__input-group">
                    <label className="form__label">{getTextNode('Email address *')}</label>
                    <input name="email" type="email" required autoComplete="true" className="form__input" value={this.state.email} onChange={this.handleChange} />
                </div>
                {emailError}

                <div className="form__input-group">
                    <label className="form__label">{getTextNode('Website')}</label>
                    <input name="website" type="url" autoComplete="true" className="form__input" value={this.state.website} onChange={this.handleChange} />
                </div>
                {websiteError}

                <div className="form__input-group">
                    <label className="form__label">{getTextNode('Main contact number (this will not be shared)')}</label>
                    <input name="phoneNumber" type="tel" required autoComplete="true" className="form__input" value={this.state.phoneNumber} onChange={this.handleChange} />
                </div>
                {phoneError}

                <div className="form__input-group">
                    <label className="form__label">
                        {getTextNode('Bio')}
                        <span>{getTextNode('200 words max')}</span>
                    </label>
                    <textarea name="bio" type="text" autoComplete="true" className="form__input--bio" value={this.state.bio} onChange={this.handleChange} />
                </div>
                {bioError}

                <div className="form__input-group genre-filter genre-filter--account">

                    <label className="form__label">
                        {getTextNode('What genre(s) do you play?')}
                        <span>{getTextNode('8 max')}</span>
                    </label>

                    <Select
                        value={this.state.selectedOption}
                        onChange={this.handleGenreChange}
                        options={options}
                        isMulti
                        styles={customStyles}
                        backspaceRemovesValue={false}
                        placeholder="Search for genre"
                        classNamePrefix="react-select"
                    />

                    <div className="genre-filter__label-list">
                        {genreButtons}
                    </div>

                </div>

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
                        <p className="brand">{getTextNode('instagram.com/')}</p>
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

                <div className="form__buttons">
                    <button type="button" className="button__account-form--cancel" onClick={this.props.cancel}>
                        {getTextNode('Cancel')}
                    </button>
                    <button type="submit" className="button__account-form--submit">{getTextNode('Save')}</button>
                </div>

            </form>
        );
    }
}

EditArtist.propTypes = {
    user: PropTypes.object,
    cancel: PropTypes.func
};

export default EditArtist;
