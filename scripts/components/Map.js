import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import MarkerClusterer from '@google/markerclusterer';
import liveNow from '../../assets/images/liveNow.svg';
import liveInNextHour from '../../assets/images/liveInNextHour.svg';
import liveIn24HrsPlus from '../../assets/images/liveIn24hrsPlus.svg';
import liveIn24Hrs from '../../assets/images/liveIn24hrs.svg';
import { getUI, searchAll } from '../api';
import SearchBar from './SearchBar';
import { arrayEquals } from '../utilities';

class Map extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            location: {
                lat: 51.521543,
                lng: -0.0711944
            },
            googleMap: '',
            redirectPath: null,
            shouldRedirect: false,
            mapStyle: [],
            setZoom: 0,
            options: [],
            selectedOption: [],
            currentMarkers: [],
            markerClustererZoomLevel: 0,
            markerClustererSize: 0,
            markerClusterer: {}
        };

        this.updateQuery = this.updateQuery.bind(this);
        this.handleSelector = this.handleSelector.bind(this);
    }

    componentWillMount() {
        getUI()
            .then((res) => {
                const style = res.map_themes.find((data) => { return data.theme_name === 'poly'; });
                this.setState({
                    mapStyle: style.theme_data,
                    setZoom: parseInt(res.map_defaults.zoom_level, 10),
                    markerClustererZoomLevel: parseInt(res.map_defaults.gmaps_max_zoom, 10),
                    markerClustererSize: parseInt(res.map_defaults.gmaps_cluster_size, 10),
                    location: {
                        lat: parseFloat(res.map_defaults.origin.lat),
                        lng: parseFloat(res.map_defaults.origin.lng)
                    }
                }, this.getMap);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    componentDidMount() {
        navigator.geolocation.getCurrentPosition((position) => {
            this.setState({
                location: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
            }, this.getMap);
        });
    }

    componentDidUpdate(prevProps) {
        const newIds = this.props.markers ? this.props.markers.map((marker) => { return marker.gig.gig_id; }) : [];
        const oldIds = prevProps.markers ? prevProps.markers.map((marker) => { return marker.gig.gig_id; }) : [];

        // 1) compare the newIDs with the oldIDs
        if (!arrayEquals(newIds, oldIds)) {
        // 2) filter the newIDs with the oldID to get the markers don't exists in the oldIDs.
            const newMarkers = this.props.markers.filter((marker) => {
                return (!oldIds.includes(marker.gig.gig_id));
            });

            // 3) create new google objects and push that in the array before set State
            this.getMarkers(newMarkers)
                .then(() => {
                    const markersDontExist = this.state.currentMarkers.filter((marker) => { return !newIds.includes(marker.id); });

                    const markersOnMap = this.state.currentMarkers.filter((marker) => { return !markersDontExist.includes(marker.id); });

                    markersDontExist.forEach((marker) => {
                        this.state.markerClusterer.removeMarker(marker);
                        return marker.setMap(null);
                    });

                    this.updateMarkers(markersOnMap);
                });
        }
    }

    getMarkers(arrayOfMarkers) {
        const markers = arrayOfMarkers.map((marker) => {
            let markerIcon;
            const gigStatus = marker.gig.gig_status_slug;
            const gigID = marker.gig.gig_id;

            switch (gigStatus) {
                case 'live':
                    markerIcon = liveNow;
                    break;

                case 'upcoming':
                    markerIcon = liveIn24Hrs;
                    break;

                case 'future':
                    markerIcon = liveIn24HrsPlus;
                    break;

                case 'imminent':
                    markerIcon = liveInNextHour;
                    break;

                default:
                    return null;
            }

            const gigsMarker = new window.google.maps.Marker({
                position: {
                    lat: parseFloat(marker.marker_location.lat),
                    lng: parseFloat(marker.marker_location.lng)
                },
                icon: {
                    url: markerIcon,
                    scaledSize: new window.google.maps.Size(40, 40)
                }
            });

            this.state.markerClusterer.addMarker(gigsMarker);
            gigsMarker.setMap(this.state.googleMap);

            gigsMarker.set('id', gigID);
            gigsMarker.set('iconURL', markerIcon);

            const self = this;
            gigsMarker.addListener('click', function updateId() {
                const id = this.get('id');

                self.state.currentMarkers.map((marker) => {
                    marker.setIcon({
                        url: gigsMarker.get('iconURL'),
                        scaledSize: marker === gigsMarker ? new window.google.maps.Size(60, 60) : new window.google.maps.Size(40, 40)
                    });
                    return marker;
                });

                self.setState({
                    redirectPath: `/gig/${id}`,
                    shouldRedirect: true
                }, () => {
                    self.setState({
                        redirectPath: null,
                        shouldRedirect: false
                    });
                });
            });

            return gigsMarker;
        });

        this.setState((prevState) => {
            return {
                currentMarkers: [
                    ...prevState.currentMarkers,
                    ...markers
                ]
            };
        });

        return Promise.resolve(markers);
    }

    getMap = () => {
        this.setState((prevState) => {
            const styledMapType = new window.google.maps.StyledMapType(prevState.mapStyle, { name: 'Style Map' });

            const map = new window.google.maps.Map(document.getElementById('map'), {
                center: { lat: prevState.location.lat, lng: prevState.location.lng },
                zoom: prevState.setZoom,
                mapTypeControlOptions: {
                    mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain', 'styled_map']
                }
            });

            map.mapTypes.set('styled_map', styledMapType);
            map.setMapTypeId('styled_map');

            map.addListener('idle', (() => {
                const bounds = map.getBounds();
                const ne = bounds.getNorthEast();
                const sw = bounds.getSouthWest();

                const coords = {
                    latMin: sw.lat(),
                    latMax: ne.lat(),
                    lngMin: sw.lng(),
                    lngMax: ne.lng()
                };

                this.props.setBounds(coords);
            }));

            // eslint-disable-next-line no-new
            new window.google.maps.Marker({
                position: { lat: prevState.location.lat, lng: prevState.location.lng },
                map
            });

            return {
                googleMap: map
            };
        }, this.getClusterMarkers);
    }

    getClusterMarkers() {
        const mc = new MarkerClusterer(this.state.googleMap, [], {
            gridSize: this.state.markerClustererSize, maxZoom: this.state.markerClustererZoomLevel, imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
        });

        this.setState((prevState) => {
            return {
                markerClusterer: mc,
                prevState
            };
        });
    }

    centerMap = () => {
        this.state.googleMap.setCenter({ lat: parseFloat(this.state.selectedOption.lat), lng: parseFloat(this.state.selectedOption.lng) });
    }

    updateMarkers(markersOnMap) {
        this.setState({
            currentMarkers: markersOnMap
        });
    }

    updateQuery(e) {
        if (e.length > 2) {
            searchAll(e)
                .then((res) => {

                    const optionsInSearchBar = res.data.results.map((data) => {
                        let options;

                        if (data.type === 'geo') {
                            options = {
                                value: data.title,
                                label: data.title,
                                lat: data.lat,
                                lng: data.lng,
                                id: data.id,
                                type: data.type
                            };
                        } else if (data.type === 'poly_venue') {
                            options = {
                                value: data.title,
                                label: data.title,
                                id: data.id,
                                type: data.type
                            };
                        } else if (data.type === 'poly_artist') {
                            options = {
                                value: data.title,
                                label: data.title,
                                id: data.id,
                                type: data.type
                            };
                        } else {
                            options = {};
                        }
                        return options;
                    });

                    this.setState({
                        options: optionsInSearchBar
                    });
                });
        }
    }

    handleSelector(selectedOption) {
        if (selectedOption.type === 'poly_venue' || selectedOption.type === 'poly_artist') {
            const type = selectedOption.type === 'poly_venue' ? 'venue' : 'artist';

            this.setState({
                redirectPath: `/${type}/${selectedOption.id}`,
                shouldRedirect: true
            });
        } else {
            this.setState({
                selectedOption
            }, this.centerMap);
        }
    }

    render() {
        return (
            <div className="map-wrapper">
                {this.state.shouldRedirect ? <Redirect to={this.state.redirectPath} /> : ''}
                <div className="genre-filter search-bar">
                    <SearchBar
                        selectedOption={this.state.selectedOption}
                        options={this.state.options}
                        handleSelector={this.handleSelector}
                        updateQuery={this.updateQuery}
                        placeholder="Artist, location, venue"
                        isMulti={false}
                        type="searchBar"
                        noOptionsMessage={() => { return 'Start typing to search'; }}
                    />
                </div>
                <div id="map" className="map" />
            </div>
        );
    }
}

Map.propTypes = {
    markers: PropTypes.arrayOf(PropTypes.object),
    setBounds: PropTypes.func.isRequired
};

export default Map;

