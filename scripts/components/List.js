import React from 'react';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { getGigsTable } from '../api';
import { getTextNode } from '../utilities';

class List extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hasMore: '',
            daysWorth: '',
            startDate: '',
            list: []
        };
    }

    componentDidMount() {
        this.getGigsData(moment().format('YYYY-MM-DD'), 10);
    }

    getGigsData(startDate, days) {
        getGigsTable(startDate, days)
            .then((res) => {
                this.setState(() => {
                    return {
                        hasMore: res.pagination.hasMore,
                        list: res.markers,
                        startDate: res.pagination.actual_next_page_start_date,
                        daysWorth: res.pagination.suggested_days_worth
                    };
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        let tableHeaders;
        if (this.state.list.length > 0) {
            tableHeaders = (
                <tr>
                    <th>{getTextNode('Gig')}</th>
                    <th>{getTextNode('Venue')}</th>
                    <th>{getTextNode('Genre')}</th>
                    <th>{getTextNode('Location')}</th>
                    <th>{getTextNode('Date')}</th>
                    <th>{getTextNode('Time')}</th>
                    <th colSpan="2">{getTextNode('Live')}</th>
                    <th>
                        <div className="list-table-pagination" onClick={() => { this.getGigsData(this.state.startDate, this.state.daysWorth); }}>
                            {this.state.hasMore
                                ? <FontAwesomeIcon icon={faAngleDown} />
                                : ''}
                        </div>
                    </th>
                </tr>
            );
        } else {
            tableHeaders = <tr><th>{getTextNode('You have no gigs')}</th></tr>;
        }

        const tableList = (
            this.state.list.map((data) => {
                return (
                    <tr key={data.gig.gig_id}>
                        <td className="list-gigs-title">
                            <Link to={`/gigs/${data.gig.gig_id}`}><div className="gig-list" title={data.gig.gig_title}>{data.gig.gig_title}</div></Link>
                        </td>
                        <td className="list-gigs-venue">
                            <Link to={`/venue/${data.venue.entity_id}`}><div className="gig-list" title={data.gig.gig_venue_name}>{data.gig.gig_venue_name}</div></Link>
                        </td>
                        <td>
                            <div className="gig-list" title={data.gig.genre_string}>{data.gig.genre_string}</div>
                        </td>
                        <td>
                            <div className="gig-list" title={data.gig.location_text}>{data.gig.location_text}</div>
                        </td>
                        <td>{moment(data.gig.start_time).format('ddd Do MMM YY')}</td>
                        <td>{moment(data.gig.start_time).format('LT')}</td>
                        <td>
                            <div className={`listTable-dot listTable-dot-${data.gig.gig_status_slug}`} />
                        </td>
                        <td className="list-gig-status">{data.gig.gig_status_slug}</td>
                    </tr>
                );
            })
        );

        return (
            <div className="list-table">

                <table className="table">
                    <tbody>
                        {tableHeaders}
                        {tableList}
                    </tbody>
                </table>
            </div>

        );
    }
}

export default List;

