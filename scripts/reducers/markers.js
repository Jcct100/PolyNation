const markers = (state = {
    markers: {}
}, action) => {
    switch (action.type) {
        case 'SET_MARKERS':
            return {
                markers: action.markers
            };

        default:
            return state;
    }
};

export default markers;
