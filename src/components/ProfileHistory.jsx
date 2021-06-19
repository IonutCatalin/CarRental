import React, {useEffect, useState} from 'react';
import firebase from "../firebase";
import HistoryCard from "./HistoryCard";
import {useAuth} from "../contexts/AuthContext";

const ProfileHistory = () => {
    const [reservations, setReservations] = useState([]);
    const {currentUser} = useAuth();

    const getReservations = async () => {
        const response = await firebase
            .firestore()
            .collection('reservations')
            .where('renterId', '==', String(currentUser.uid))
            .get();

        const list = response.docs.map(doc => {
            return {...doc.data(), uid: doc.id};
        });

        setReservations(list);
    };

    useEffect(() => {
        if (currentUser) {
            getReservations();
        }
    }, [currentUser]);

    return (
        <div id="profile_tab" className="tab-pane active">
            <h3 className="list_title mb_30" style={{color: "#EA001E"}}>Booking history:</h3>

            {!!reservations.length && reservations.map((reservation, key) => {
                return <HistoryCard data={reservation} key={key}/>
            })}
        </div>
    );
};

export default ProfileHistory;
