import React from 'react';
import PropTypes from 'prop-types';
import EditStandard from './EditStandard';
import { getTextNode } from '../../utilities';

const StandardProfile = ({ user, edit, cancel }) => {
    if (!user) return null;

    return (
        <div>
            <h2 className="form__title form__title--padded">{getTextNode('Profile')}</h2>
            <div className="profile__group">
                <label className="form__label">{ getTextNode('Full name')}</label>
                <p>{user.data.display_name}</p>
            </div>

            <div className="profile__group">
                <label className="form__label">{getTextNode('Email address')}</label>
                <p>{user.data.user_email}</p>
            </div>

            <div className="form__buttons form__buttons--padded">
                <button
                    type="button"
                    className="button__account-form--submit"
                    onClick={() => { edit(<EditStandard user={user} cancel={cancel} />); }}
                >
                    {getTextNode('Edit')}
                </button>
            </div>
        </div>
    );
};

StandardProfile.propTypes = {
    user: PropTypes.object,
    edit: PropTypes.func,
    cancel: PropTypes.func
};

export default StandardProfile;
