import React, { useEffect, useState } from 'react';
import firebase from "../firebase";
import {Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Booking = ({data}) => {
    return (
        <div className="account_info_list aos-init aos-animate">
            <h3 className="list_title mb_30">Booking Profiles:</h3>
            <ul className="ul_li_block clearfix">
                <li><span>Profile ID:</span> 1234557jt</li>
                <li><span>Payment Method:</span> Visa Credit Card</li>
                <li><span>Phone Number:</span> +1-202-555-0104</li>
            </ul>
        </div>
    );
};

export default Booking;


