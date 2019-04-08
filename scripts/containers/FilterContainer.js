import { connect } from 'react-redux';
import Filter from '../components/Filter';
import { setMarkers } from '../actions';

const mapStateToProps = (state) => {
    return {
        markers: state.markers,
        bounds: state.bounds
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateMarkers: (res) => {
            dispatch(setMarkers(res));
        }
    };
};

const FilterContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Filter);

export default FilterContainer;
