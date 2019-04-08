import { connect } from 'react-redux';
import Map from '../components/Map';
import { setBounds } from '../actions';

const mapStateToProps = (state) => {
    return {
        markers: state.markers.markers.markers
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setBounds: (res) => {
            dispatch(setBounds(res));
        }
    };
};

const MapContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Map);

export default MapContainer;
