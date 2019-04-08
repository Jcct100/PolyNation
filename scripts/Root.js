import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
} from 'react-router-dom';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import rootReducer from './reducers/index';

import App from './containers/App';
import LandingContainer from './containers/LandingContainer';

const store = createStore(rootReducer, devToolsEnhancer());

// If the user is not logged in it will redirect to the login page
const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={(props) => {
                return store.getState().user.token ? (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: '/login',
                            state: { from: props.location }
                        }}
                    />
                );
            }}
        />
    );
};

const Root = () => {
    return (
        <Provider store={store}>
            <Router basename="/">
                <div className="content-area">
                    <div className="page">
                        <Switch>
                            <Route exact path="/login" component={LandingContainer} />
                            <PrivateRoute path="/" component={App} />
                            <Redirect to="/" />
                        </Switch>
                    </div>
                </div>
            </Router>
        </Provider>
    );
};

export default Root;
