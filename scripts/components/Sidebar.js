import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import {
    Route,
    Switch,
    NavLink
} from 'react-router-dom';
import { createBrowserHistory } from 'history';

import Trending from './Trending';
import Following from './Following';
import Artist from './Artist';
import Venue from './Venue';
import Gig from './Gig';
import FilterContainer from '../containers/FilterContainer';
import NotFound from './NotFound';

import { getUI } from '../api';
import { getTextNode } from '../utilities';
import Account from './Account/Account';

const history = createBrowserHistory();

class Sidebar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            logo: {}
        };
    }

    componentWillMount() {
        getUI()
            .then((res) => {
                this.setState({ logo: res.logo_image });
            });
    }

    render() {
        return (
            <div id="sidebar-nav">
                <div>
                    <ul className="sidebar-nav__list">

                        <li>
                            <NavLink to="/"><img src={this.state.logo.src} alt={this.state.logo.alt} /></NavLink>
                        </li>

                        <li className="sidebar-nav__link">
                            <NavLink to="/following" activeClassName="sidebar-nav__link--active">{getTextNode('Following')}</NavLink>
                        </li>

                        <li className="sidebar-nav__link">
                            <NavLink to="/filter" activeClassName="sidebar-nav__link--active">{getTextNode('Filter')}</NavLink>
                        </li>

                        <li className="sidebar-nav__link">
                            <NavLink exact to="/" activeClassName="sidebar-nav__link--active">{getTextNode('Trending')}</NavLink>
                        </li>

                        <div className="back-forward-nav">
                            <div onClick={history.goBack}><FontAwesomeIcon icon={faChevronLeft} /></div>
                            <div onClick={history.goForward}><FontAwesomeIcon icon={faChevronRight} /></div>
                        </div>

                    </ul>

                    <Switch>
                        <Route exact path="/" component={Trending} />
                        <Route exact path="/venue" component={Venue} />
                        <Route exact path="/filter" component={FilterContainer} />
                        <Route exact path="/following" component={Following} />
                        <Route path="/account" component={Account} />
                        <Route
                            exact
                            path="/artist/:id"
                            render={(props) => {
                                return (
                                    <Artist id={props.match.params.id} />
                                );
                            }}
                        />
                        <Route
                            exact
                            path="/venue/:id"
                            render={(props) => {
                                return (
                                    <Venue id={props.match.params.id} />
                                );
                            }}
                        />
                        <Route
                            exact
                            path="/gig/:id"
                            render={(props) => {
                                return (
                                    <Gig id={props.match.params.id} />
                                );
                            }}
                        />
                        <Route exact path="*" component={NotFound} />
                    </Switch>
                </div>
            </div>
        );
    }
}

export default Sidebar;
