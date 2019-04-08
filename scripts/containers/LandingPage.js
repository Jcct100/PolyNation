import React from 'react';
import Modal from 'react-responsive-modal';
import {
    Tab,
    Tabs,
    TabList,
    TabPanel
} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import { Redirect } from 'react-router-dom';
import Login from './Login';
import SignUp from '../components/SignUp';
import { getTextNode } from '../utilities';
import logo from '../../assets/logo.svg';

class LandingPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        };

        this.onModalOpen = this.onModalOpen.bind(this);
        this.onCloseModal = this.onCloseModal.bind(this);
    }

    onModalOpen() {
        this.setState({ open: true });
    }

    onCloseModal() {
        this.setState({ open: false });
    }

    render() {
        if (Cookies.get('token')) {
            this.props.updateUser(Cookies.get('token'), {});
            return (
                <Redirect to={this.props.location.state ? this.props.location.state.from : '/'} />
            );
        }

        return (
            <div className="landing">
                <button type="button" onClick={this.onModalOpen}>{getTextNode('login')}</button>
                <Modal
                    open={this.state.open}
                    onClose={this.onCloseModal}
                    center
                    closeOnOverlayClick={false}
                    classNames={{
                        modal: 'login-modal',
                        closeIcon: 'login-modal__close-icon'
                    }}
                >
                    <img src={logo} alt={getTextNode('Polynation')} />
                    <h2>{getTextNode('Join Polynation today')}</h2>

                    <Tabs>
                        <TabList>
                            <Tab>{getTextNode('login')}</Tab>
                            <Tab>{getTextNode('sign up')}</Tab>
                        </TabList>

                        <TabPanel>
                            <Login location={this.props.location} />
                        </TabPanel>

                        <TabPanel>
                            <SignUp />
                        </TabPanel>
                    </Tabs>
                </Modal>
            </div>
        );
    }
}

LandingPage.propTypes = {
    location: PropTypes.object,
    updateUser: PropTypes.func.isRequired
};

export default LandingPage;
