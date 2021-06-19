import React, { useEffect, useState } from 'react';
import firebase from "../firebase";
import {Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HistoryCard = ({data}) => {
    return (
        <div className="account_info_list aos-init aos-animate">
            <ul className="ul_li_block clearfix">
                <li><span>Booking ID:</span> {data.uid}</li>
                <li><span>Vehicle:</span> {data.name}</li>
                {/*<li><span>Start date:</span>{data.startDate}</li>*/}
                {/*<li><span>Return date:</span>{data.endDate}</li>*/}
            </ul>
            <Link className="text_btn text-uppercase" to={`/history/${data.uid}`}><span>View details</span> </Link>
        </div>
    );
};

export default HistoryCard;


