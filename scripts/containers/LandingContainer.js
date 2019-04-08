import { connect } from 'react-redux';
import { setToken } from '../actions';

import LandingPage from './LandingPage';

const mapStateToProps = (state) => {
    return {
        user: state.user
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateUser: (token, details) => {
            dispatch(setToken(token, details));
        }
    };
};

const LandingContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(LandingPage);

export default LandingContainer;
