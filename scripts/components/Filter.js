import React from 'react';
import Toggle from 'react-toggle';

import PropTypes from 'prop-types';
import {
    filter, getGenres, sendUserLocation, getUI
} from '../api';
import { getTextNode, decodeString } from '../utilities';

import SearchBar from './SearchBar';

class Filter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userLat: 0,
            userLng: 0,
            gigActivities: ['live', 'imminent'],
            filteredGenres: [],
            genres: [],
            selectedOption: [],
            loading: true,
            location: {
                lat: 51.521543,
                lng: -0.0711944
            }
        };

        this.handleGigChange = this.handleGigChange.bind(this);
        this.handleGenreChange = this.handleGenreChange.bind(this);
        this.refreshFilters = this.refreshFilters.bind(this);
    }

    componentWillMount() {
        getGenres()
            .then((res) => {
                this.setState({ genres: res.data, loading: false });
            })
            .then(this.refreshFilters)
            .then(
                getUI()
                    .then((res) => {
                        this.setState({
                            location: {
                                lat: parseFloat(res.map_defaults.origin.lat),
                                lng: parseFloat(res.map_defaults.origin.lng)
                            }
                        });
                    })
            )
            .catch((error) => {
                console.log(error);
            });
    }

    componentDidMount() {
        return new Promise((resolve, reject) => {
            return (navigator.permissions
                // Permission API is implemented
                ? navigator.permissions.query({
                    name: 'geolocation'
                }).then((permission) => {
                    return (permission.state === 'granted'
                        ? navigator.geolocation.getCurrentPosition((pos) => { return resolve(pos.coords); })
                        : resolve({
                            lat: this.state.location.lat,
                            lng: this.state.location.lng
                        }));
                })
                // Permission API was not implemented
                : reject(new Error('Permission API is not supported')));
        }).then((coords) => {
            this.setState({
                userLat: coords.latitude,
                userLng: coords.longitude
            });
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.bounds.coords.latMax !== this.props.bounds.coords.latMax) {
            this.refreshFilters();
        }
    }

    refreshFilters() {
        const details = {
            lat_min: this.props.bounds.coords.latMin,
            lat_max: this.props.bounds.coords.latMax,
            lng_min: this.props.bounds.coords.lngMin,
            lng_max: this.props.bounds.coords.lngMax,
            gig_activities: this.state.gigActivities,
            genres: this.state.filteredGenres
        };

        filter(details)
            .then((res) => {
                this.props.updateMarkers(res.data);
            })
            .catch((error) => {
                if (error.response.data.data === 'self_report_location') {
                    sendUserLocation(this.state.userLat, this.state.userLng)
                        .then(this.refreshFilters);
                }
            });
    }

    handleGigChange(evt) {
        const status = evt.target;

        this.setState((prevState) => {
            const gigActivities = prevState.gigActivities.filter((activity) => { return activity !== status.value; });

            if (status.checked) {
                gigActivities.push(status.value);
            }

            return {
                gigActivities
            };
        }, this.refreshFilters);
    }

    handleGenreChange(selectedOption) {
        const filteredGenres = selectedOption.map((genre) => { return genre.value; });

        this.setState({
            selectedOption,
            filteredGenres
        }, this.refreshFilters);
    }

    clearGenre(genre) {
        this.setState((prevState) => {
            // Remove the genre from the list of selected genres
            const selectedOption = prevState.selectedOption.filter((item) => { return item !== genre; });

            // Remove the genre from the array of genre ids sent to the API
            const filteredGenres = prevState.filteredGenres.filter((item) => { return item !== genre.value; });

            return {
                selectedOption,
                filteredGenres
            };
        }, this.refreshFilters);
    }

    render() {
        if (this.state.loading) {
            return (
                <div className="loader" />
            );
        }

        const options = this.state.genres.map((genre) => {
            const decoded = decodeString(genre.name);

            return {
                value: genre.genre_id,
                label: decoded
            };
        });

        // Render selected genre filter labels
        const genreButtons = this.state.selectedOption.map((genre) => {
            return (
                <div key={genre.value} className="genre-item">
                    <span className="genre-filter__label">{genre.label}</span>
                    <span className="genre-filter__label--close" onClick={this.clearGenre.bind(this, genre)}>x</span>
                </div>
            );
        });

        return (
            <div>

                <div className="filter">
                    <h4>{getTextNode('Filter by live gigs')}</h4>
                    <form>

                        <div className="filter__item">
                            <label>
                                <span className="dot dot--live" />
                                {getTextNode('Live now')}
                            </label>
                            <div className="filter-toggle">
                                <Toggle
                                    defaultChecked
                                    onChange={this.handleGigChange}
                                    icons={{
                                        checked: 'on',
                                        unchecked: 'off'
                                    }}
                                    value="live"
                                />
                            </div>
                        </div>

                        <div className="filter__item">
                            <label>
                                <span className="dot dot--imminent" />
                                {getTextNode('Live in 1 hour')}
                            </label>
                            <div className="filter-toggle">
                                <Toggle
                                    defaultChecked
                                    onChange={this.handleGigChange}
                                    icons={{
                                        checked: 'on',
                                        unchecked: 'off'
                                    }}
                                    value="imminent"
                                />
                            </div>
                        </div>

                        <div className="filter__item">
                            <label>
                                <span className="dot dot--upcoming" />
                                {getTextNode('Live in 24 hours')}
                            </label>
                            <div className="filter-toggle">
                                <Toggle
                                    onChange={this.handleGigChange}
                                    icons={{
                                        checked: 'on',
                                        unchecked: 'off'
                                    }}
                                    value="upcoming"
                                />
                            </div>
                        </div>

                        <div className="filter__item">
                            <label>
                                <span className="dot dot--future" />
                                {getTextNode('Live in 24 hours +')}
                            </label>
                            <div className="filter-toggle">
                                <Toggle
                                    onChange={this.handleGigChange}
                                    icons={{
                                        checked: 'on',
                                        unchecked: 'off'
                                    }}
                                    value="future"
                                />
                            </div>
                        </div>

                    </form>
                </div>

                <div className="genre-filter">

                    <h4>{getTextNode('Filter by genre')}</h4>

                    <SearchBar
                        selectedOption={this.state.selectedOption}
                        handleSelector={this.handleGenreChange}
                        options={options}
                        placeholder="Search for genre"
                        isMulti
                        type="searchBar"
                    />

                    <div className="genre-filter__label-list">
                        {genreButtons}
                    </div>

                </div>

            </div>
        );
    }
}

Filter.propTypes = {
    bounds: PropTypes.object.isRequired,
    updateMarkers: PropTypes.func.isRequired
};

export default Filter;

