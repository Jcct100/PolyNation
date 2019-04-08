// User

/* eslint-disable-next-line import/prefer-default-export */
export const setToken = (token = null, details = {}) => {
    return {
        type: 'SET_TOKEN',
        token,
        details
    };
};

export const setMarkers = (markers = {}) => {
    return {
        type: 'SET_MARKERS',
        markers
    };
};

// boundaries
export const setBounds = (coords = {}) => {
    return {
        type: 'SET_BOUNDS',
        coords
    };
};
