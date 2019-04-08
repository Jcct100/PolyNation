import React from 'react';
import Toggle from 'react-toggle';
import { getTextNode } from '../../utilities';
import { getNotificationSettings, updateNotification } from '../../api';

class Notifications extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notifications: {},
            loading: true
        };

        this.handleNotificationChange = this.handleNotificationChange.bind(this);
    }

    componentWillMount() {
        getNotificationSettings()
            .then((res) => {
                this.setState({ notifications: res, loading: false });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    handleNotificationChange(evt) {
        const data = {
            notification: evt.target.value,
            method: 'email'
        };

        const change = {
            is_subscribed: evt.target.checked
        };

        updateNotification(data, change)
            .then((res) => {
                this.setState({ notifications: res });
            });
    }

    render() {
        if (this.state.loading) {
            return (
                <div className="loader" />
            );
        }

        const pageTitle = this.state.notifications.cms.page_title;

        const enabledNotifications = this.state.notifications.notifications.filter((notification) => {
            return !notification.channels.email.disabled;
        });

        const notificationsTable = enabledNotifications.map((notification) => {
            return (
                <tr key={notification.subscription_slug}>
                    <td>{notification.display_name}</td>
                    <td>
                        <div className="filter-toggle">
                            <Toggle
                                defaultChecked={notification.channels.email.on}
                                onChange={this.handleNotificationChange}
                                icons={{
                                    checked: 'on',
                                    unchecked: 'off'
                                }}
                                value={notification.subscription_slug}
                            />
                        </div>
                    </td>
                </tr>
            );
        });

        return (
            <div>
                <h2 className="form__title form__title--padded">{pageTitle}</h2>
                <table className="notifications-table">
                    <thead>
                        <tr>
                            <th>{getTextNode('Updates')}</th>
                            <th>{getTextNode('Email')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        { notificationsTable }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Notifications;
