import { combineReducers } from 'redux';

import user from './user';
import markers from './markers';
import bounds from './bounds';

// Combines all reducers to be used for store creation
export default combineReducers({
    user,
    markers,
    bounds
});

