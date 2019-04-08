import React from 'react';
import Modal from 'react-responsive-modal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser,
    faPencilAlt,
    faLock,
    faBell,
    faComment,
    faArrowLeft
} from '@fortawesome/free-solid-svg-icons';

import StandardProfile from './StandardProfile';
import ArtistProfile from './ArtistProfile';
import VenueProfile from './VenueProfile';
import ChangePassword from './ChangePassword';
import EditStandard from './EditStandard';
import Feedback from './Feedback';
import Notifications from './Notifications';
import EditArtist from './EditArtist';
import EditVenue from './EditVenue';
import ManageGigs from './ManageGigs';
import {
    logoutUser,
    getUser,
    getOwner,
    getVenueOwner,
    changeUserPicture,
    changeArtistPicture,
    changeVenuePicture
} from '../../api';
import { getTextNode } from '../../utilities';

class Account extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            artist: null,
            venue: null,
            open: true,
            content: null,
            loading: true
        };

        this.onModalOpen = this.onModalOpen.bind(this);
        this.onCloseModal = this.onCloseModal.bind(this);
        this.changeImage = this.changeImage.bind(this);
        this.getUserInfo = this.getUserInfo.bind(this);
    }

    componentDidMount() {
        this.getUserInfo();
    }

    onModalOpen(content) {
        this.setState({ content, open: true });
    }

    onCloseModal() {
        this.setState({ open: false });
    }

    getUserInfo() {
        getUser()
            .then((res) => {
                this.setState({ user: res }, () => {
                    if (res.data.account_type.user_type === 'poly_artist_user') {
                        getOwner(this.state.user.data.account_type.entity.entity_id)
                            .then((res) => {
                                this.setState({ artist: res });
                                this.onModalOpen(<ArtistProfile user={this.state.user} edit={this.onModalOpen} cancel={this.onCloseModal} />);
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    }
                    if (res.data.account_type.user_type === 'poly_venue_user') {
                        getVenueOwner(this.state.user.data.account_type.entity.entity_id)
                            .then((res) => {
                                this.setState({ venue: res });
                                this.onModalOpen(<VenueProfile user={this.state.user} edit={this.onModalOpen} cancel={this.onCloseModal} />);
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    }
                    this.setState({ loading: false });
                });
                this.onModalOpen(<StandardProfile user={this.state.user} edit={this.onModalOpen} cancel={this.onCloseModal} />);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    changeImage(evt) {
        const pictureForm = new FormData();
        pictureForm.append('filename', 'picture');
        pictureForm.append('picture', evt.target.files[0]);

        if (this.state.user.data.account_type.user_type === 'standard') {
            changeUserPicture(pictureForm)
                .then(this.getUserInfo);
        } else if (this.state.user.data.account_type.user_type === 'poly_artist_user') {
            changeArtistPicture(this.state.artist.full.artist_id, pictureForm)
                .then(this.getUserInfo);
        } else {
            changeVenuePicture(this.state.venue.full.venue_id, pictureForm)
                .then(this.getUserInfo);
        }
    }

    render() {
        if (this.state.loading) {
            return (
                <div className="loader" />
            );
        }

        // Add extra manage gigs option if user is artist or venue
        let manageGigs = null;
        if (this.state.user.data.account_type.user_type !== 'standard') {
            manageGigs = (
                <li className="account__list-item">
                    <div className="list-icon">
                        <FontAwesomeIcon icon={faPencilAlt} />
                    </div>
                    <button
                        type="button"
                        className="button__account"
                        onClick={() => {
                            this.onModalOpen(<ManageGigs user={this.state.user.data.account_type.user_type === 'poly_venue_user' ? this.state.venue : this.state.artist} openModal={this.onModalOpen} />);
                        }}
                    >
                        {getTextNode('Manage gigs')}
                    </button>
                </li>
            );
        }

        let profile = null;
        switch (this.state.user.data.account_type.user_type) {
            case 'poly_artist_user':
                profile = (
                    <>
                        <li className="account__list-item">
                            <div className="list-icon">
                                <FontAwesomeIcon icon={faUser} />
                            </div>
                            <button type="button" className="button__account" onClick={() => { this.onModalOpen(<ArtistProfile user={this.state.user} edit={this.onModalOpen} cancel={this.onCloseModal} />); }}>{getTextNode('Profile')}</button>
                        </li>
                        <li className="account__list-item">
                            <div className="list-icon">
                                <FontAwesomeIcon icon={faPencilAlt} />
                            </div>
                            <button type="button" className="button__account" onClick={() => { this.onModalOpen(<EditArtist user={this.state.artist} cancel={this.onCloseModal} />); }}>{getTextNode('Edit profile')}</button>
                        </li>
                    </>
                );
                break;

            case 'poly_venue_user':
                profile = (
                    <>
                        <li className="account__list-item">
                            <div className="list-icon">
                                <FontAwesomeIcon icon={faUser} />
                            </div>
                            <button type="button" className="button__account" onClick={() => { this.onModalOpen(<VenueProfile user={this.state.user} edit={this.onModalOpen} cancel={this.onCloseModal} />); }}>{getTextNode('Profile')}</button>
                        </li>
                        <li className="account__list-item">
                            <div className="list-icon">
                                <FontAwesomeIcon icon={faPencilAlt} />
                            </div>
                            <button type="button" className="button__account" onClick={() => { this.onModalOpen(<EditVenue user={this.state.venue} cancel={this.onCloseModal} />); }}>{getTextNode('Edit profile')}</button>
                        </li>
                    </>
                );
                break;

            default:
                profile = (
                    <>
                        <li className="account__list-item">
                            <div className="list-icon">
                                <FontAwesomeIcon icon={faUser} />
                            </div>
                            <button type="button" className="button__account" onClick={() => { this.onModalOpen(<StandardProfile user={this.state.user} edit={this.onModalOpen} cancel={this.onCloseModal} />); }}>{getTextNode('Profile')}</button>
                        </li>
                        <li className="account__list-item">
                            <div className="list-icon">
                                <FontAwesomeIcon icon={faPencilAlt} />
                            </div>
                            <button type="button" className="button__account" onClick={() => { this.onModalOpen(<EditStandard user={this.state.user} cancel={this.onCloseModal} />); }}>{getTextNode('Edit profile')}</button>
                        </li>
                    </>
                );
                break;
        }

        return (
            <div>
                <div className="single-item-info">
                    <div className="profile-picture">
                        <img className="single-item-info__image profile-picture__image" src={this.state.user.data.profile_image.src} alt={this.state.user.data.profile_image.alt} />
                        <div className="profile-picture__image--edit">
                            <input type="file" name="file" id="file" accept="image/*" className="profile-picture__input" onChange={this.changeImage} />
                            <label htmlFor="file">
                                <FontAwesomeIcon icon={faPencilAlt} className="edit-icon" />
                                {getTextNode('Edit')}
                            </label>
                        </div>
                    </div>
                    <p className="single-item-info__context">{getTextNode('Account')}</p>
                    <h4 className="single-item-info__title">
                        {this.state.user.data.account_type.entity ? this.state.user.data.account_type.entity.entity_title : this.state.user.data.display_name}
                    </h4>
                    <p className="single-item-info__subtitle">
                        {getTextNode('Account type: ')}
                        {this.state.user.data.account_type_verbose ? this.state.user.data.account_type_verbose : this.state.user.data.account_type.user_type}
                    </p>
                </div>

                <ul className="account__list">
                    {profile}

                    {manageGigs}

                    <li className="account__list-item">
                        <div className="list-icon">
                            <FontAwesomeIcon icon={faLock} />
                        </div>
                        <button type="button" className="button__account" onClick={() => { this.onModalOpen(<ChangePassword cancel={this.onCloseModal} />); }}>{getTextNode('Change password')}</button>
                    </li>

                    <li className="account__list-item">
                        <div className="list-icon">
                            <FontAwesomeIcon icon={faBell} />
                        </div>
                        <button type="button" className="button__account" onClick={() => { this.onModalOpen(<Notifications />); }}>{getTextNode('Notifications')}</button>
                    </li>

                    <li className="account__list-item">
                        <div className="list-icon">
                            <FontAwesomeIcon icon={faComment} />
                        </div>
                        <button type="button" className="button__account" onClick={() => { this.onModalOpen(<Feedback />); }}>{getTextNode('Feedback')}</button>
                    </li>

                    <li className="account__list-item">
                        <div className="list-icon">
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </div>
                        <button type="button" className="button__account" onClick={logoutUser}>{getTextNode('Sign out')}</button>
                    </li>
                </ul>

                <Modal
                    open={this.state.open}
                    onClose={this.onCloseModal}
                    center
                    closeOnOverlayClick={false}
                    classNames={{
                        modal: 'account-modal',
                        overlay: 'overlay',
                        closeButton: 'account-modal__close-button',
                        closeIcon: 'account-modal__close-icon'
                    }}
                >
                    {this.state.content}
                </Modal>

            </div>

        );
    }
}

export default Account;
