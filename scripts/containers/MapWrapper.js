import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBars,
    faMapMarker
} from '@fortawesome/free-solid-svg-icons';

import GetMarkers from './MapContainer';
import List from '../components/List';

class MapWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mapView: true
        };

        this.showMap = this.showMap.bind(this);
        this.hideMap = this.hideMap.bind(this);
    }

    showMap() {
        this.setState({
            mapView: true
        });
    }

    hideMap() {
        this.setState({
            mapView: false
        });
    }

    render() {
        let currentDisplay = null;

        if (this.state.mapView) {
            currentDisplay = <GetMarkers />;
        } else {
            currentDisplay = <List />;
        }

        return (
            <div className="map-container">
                <div className="top-nav">
                    <button className="map-toggle" onClick={this.showMap} type="button"><FontAwesomeIcon icon={faMapMarker} color="white" /></button>
                    <button className="map-toggle" onClick={this.hideMap} type="button"><FontAwesomeIcon icon={faBars} color="white" /></button>
                </div>
                {currentDisplay}
            </div>
        );
    }
}

export default MapWrapper;

