const bounds = (state = {
    coords: {}
}, action) => {
    switch (action.type) {
        case 'SET_BOUNDS':
            return {
                coords: action.coords
            };

        default:
            return state;
    }
};

export default bounds;
