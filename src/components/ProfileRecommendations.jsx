import React, {useEffect, useState} from "react";
import firebase from "../firebase";
import {useAuth} from "../contexts/AuthContext";
import {Link} from "react-router-dom";

const ProfileRecommendations = () => {
    const [reservations, setReservations] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [mostFrequentPassengers, setMostFrequentPassengers] = useState('');
    const [mostFrequentModel, setMostFrequentModel] = useState('');
    const [mostFrequentFuel, setMostFrequentFuel] = useState('');
    const [mostFrequentGearbox, setMostFrequentGearbox] = useState('');
    const {currentUser} = useAuth();

    const getMostFrequent = (arr) =>
        Object.entries(
            arr.reduce((a, v) => {
                a[v] = a[v] ? a[v] + 1 : 1;
                return a;
            }, {})
        ).reduce((a, v) => (v[1] >= a[1] ? v : a), [null, 0])[0];

    const getData = async () => {
        const passengerSeats = [];
        const models = [];
        const fuels = [];
        const gearboxes = [];

        const response = await firebase
            .firestore()
            .collection('reservations')
            .where('renterId', '==', String(currentUser.uid))
            .get();

        const carIds = response.docs.map(doc => doc.data() && doc.data().carId);

        const carsSnap = await firebase
            .firestore()
            .collection('cars')
            .where(firebase.firestore.FieldPath.documentId(), "in", carIds)
            .get();

        const cars = carsSnap.docs.map(doc => doc.data());

        cars.forEach((car) => {
            passengerSeats.push(+car.passengers);
            models.push(car.model);
            fuels.push(car.fuel);
            gearboxes.push(car.gearbox);
        });

        const passengerData = getMostFrequent(passengerSeats);
        const modelData = getMostFrequent(models);
        const fuelData = getMostFrequent(fuels);
        const gearboxData = getMostFrequent(gearboxes);

        getRecommended({
            passengers: passengerData,
            model: modelData,
            fuel: fuelData,
            gearbox: gearboxData
        });

        setMostFrequentPassengers(passengerData);
        setMostFrequentModel(modelData);
        setMostFrequentFuel(fuelData);
        setMostFrequentGearbox(gearboxData);
    };

    const getRecommended = async (carData) => {
        const snapshot = await firebase.firestore()
            .collection('cars')
            .where('gearbox', '==', carData.gearbox)
            .where('passengers', '==', carData.passengers)
            .where('model', '==', carData.model)
            .where('fuel', '==', carData.fuel)
            .get();

        const data = snapshot.docs.map(document => ({...document.data(), uid: document.id}));

        setRecommendations(data);
    };

    useEffect(() => {
        if (currentUser) {
            getData();
        }
    }, [currentUser]);

    console.log(recommendations);

    return (
        <>
            <div className="user-info-container">
                <h3 className="list_title mb_30 text-red">Most frequent preferences:</h3>

                {(mostFrequentModel && mostFrequentFuel && mostFrequentGearbox && mostFrequentPassengers) ? <ul className="cart_info_list2 ul_li_block clearfix aos-init aos-animate" data-aos="fade-up"
                    data-aos-delay="100">
                    <li><strong className="text-red">Model:</strong> <span
                        className="text-white">{mostFrequentModel}</span></li>
                    <li><strong className="text-red">Fuel:</strong> <span
                        className="text-white">{mostFrequentFuel}</span></li>
                    <li><strong className="text-red">Gearbox:</strong> <span
                        className="text-white">{mostFrequentGearbox}</span></li>
                    <li><strong className="text-red">Passenger seats:</strong> <span
                        className="text-white">{mostFrequentPassengers}</span>
                    </li>
                </ul>
                    :
                    <div className="text-white">No preferences. Please make a reservation first.</div>
                }

                <hr className=""/>

            </div>
            <div className="d-flex align-items-center justify-content-between mb-4 pb-2">
                <h2 className="h3 mb-0 text-red">Recommendations</h2>
            </div>
            <div className="row">
                {!!recommendations.length ?
                    <div className="profile-recommendations">
                        {recommendations.map((recommendation, index) => {
                            return (
                                <div className="d-flex align-items-start position-relative mb-4 profile-recommendation"
                                     key={index}>
                                    <Link className="text-white" to={`/car/${recommendation.uid}`}>
                                        <img className="flex-shrink-0 me-3 rounded-3" src={recommendation.thumbnail}
                                             alt="Brand logo"/>
                                    </Link>
                                    <div className="pl-3">
                                        <h3 className="mb-2 fs-lg">
                                            <Link className="text-white"
                                                  to={`/car/${recommendation.uid}`}>{recommendation.name}</Link>
                                        </h3>
                                        <ul className="list-unstyled mb-0 fs-xs">
                                            <li><i className="fas fa-star text-red mr-1"/><b
                                                className="text-grey mr-2">{recommendation.rating}</b></li>
                                            <li><i className="fas fa-dollar-sign mr-1 ml-1 text-red"/><b
                                                className="text-grey">{recommendation.price} / Day</b>
                                            </li>
                                        </ul>
                                    </div>
                                </div>)
                        })}
                    </div>
                    :
                    <div className="text-white">No recommendations available.</div>
                }
            </div>
        </>
    )
}
;

export default ProfileRecommendations;
