import React, {useEffect, useState} from "react";
import firebase from "../firebase";
import {useParams} from "react-router-dom";
import {getFirebaseTime} from "../utilities/time";
import * as moment from 'moment';

const RentHistory = () => {
    const [rent, setRent] = useState(null);
    const [car, setCar] = useState(null);
    const {historyId} = useParams();

    const getData = async () => {
        const snapshot = await firebase.firestore()
            .collection('reservations')
            .doc(historyId)
            .get();

        const rentData = snapshot.data();
        setRent(rentData);

        const carSnapshot = await firebase.firestore()
            .collection('cars')
            .doc(rentData.carId)
            .get();

        const carData = carSnapshot.data();
        setCar(carData);
    };

    const calculateRentDuration = () => {
        const start = getFirebaseTime(rent.startDate.seconds, rent.startDate.nanoseconds);
        const end = getFirebaseTime(rent.endDate.seconds, rent.endDate.nanoseconds);
        
        return moment(end).diff(moment(start), 'days') + 1;
    };

    const calculateRentPrice = () => {
        const period = calculateRentDuration();

        return parseInt(rent.price) * parseInt(period);
    }

    const parseFirebaseTime = (time) => {
        return moment(time).format('dddd, Do MMMM YYYY')
    };


    useEffect(() => {
        window.scrollTo(0, 0);
        getData();
    }, []);

    useEffect(() => {
        if (rent) {
            calculateRentDuration();
        }
    }, [rent])

    return (
        <>
            {car && rent &&
            <main>
                <section className="breadcrumb_section text-center clearfix">
                    <div className="page_title_area has_overlay d-flex align-items-center clearfix"
                         data-bg-image="assets/images/breadcrumb/bg_03.jpg"
                         style={{backgroundImage: "url(&quot;assets/images/breadcrumb/bg_03.jpg&quot;)"}}>
                        <div className="overlay"></div>
                        <div className="container aos-init aos-animate" data-aos="fade-up" data-aos-delay="100">
                            <h1 className="page_title text-white mb-0">Rent history</h1>
                        </div>
                    </div>
                </section>

                <section className="reservation_section sec_ptb_100 clearfix">
                    <div className="container">
                        <div
                            className="row justify-content-lg-between justify-content-md-center justify-content-sm-center">

                            <div className="offset-lg-3 offset-md-2 offset-sm-1 col-lg-8 col-md-9 col-sm-10 col-xs-12">
                                <div className="cart_info_content">

                                    <ul className="cart_info_list2 ul_li_block clearfix aos-init aos-animate">
                                        <li><strong className="text-red">Car:</strong> <span className="text-white">{car.name}</span></li>
                                        <li><strong className="text-red">Passengers:</strong> <span className="text-white">{car.passengers}</span></li>
                                        {rent && rent.details && <li><strong>Notes:</strong> <span className="text-white">{rent.details}</span></li> }
                                    </ul>

                                    <hr data-aos="fade-up" data-aos-delay="100" className="aos-init aos-animate"/>


                                    <div className="row mt__30">
                                        <div className="col-lg-5 col-md-4 col-sm-12 col-xs-12">
                                            <div className="cart_address_item aos-init aos-animate" data-aos="fade-up"
                                                 data-aos-delay="100">
                                                <h4 className="text-red">Pick Up Location:</h4>
                                                <p className="mb-0 text-white"><i className="fas fa-map-marker-alt"></i> {rent.rentLocation}</p>
                                            </div>
                                        </div>

                                        <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                            <div className="cart_address_item aos-init aos-animate" data-aos="fade-up"
                                                 data-aos-delay="200">
                                                <h4 className="text-red">Pick Up Date:</h4>
                                                <p className="mb-0 text-white"><i className="fas fa-calendar-alt"></i> {parseFirebaseTime(getFirebaseTime(rent.startDate.seconds, rent.startDate.nanoseconds))}</p>
                                            </div>
                                        </div>


                                        <div className="col-lg-5 col-md-4 col-sm-12 col-xs-12">
                                            <div className="cart_address_item aos-init aos-animate" data-aos="fade-up"
                                                 data-aos-delay="400">
                                                <h4 className="text-red">Return Car Location:</h4>
                                                <p className="mb-0 text-white"><i className="fas fa-map-marker-alt"></i> {rent.rentReturnLocation}</p>
                                            </div>
                                        </div>

                                        <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                            <div className="cart_address_item aos-init aos-animate" data-aos="fade-up"
                                                 data-aos-delay="500">
                                                <h4 className="text-red">Return Date:</h4>
                                                <p className="mb-0 text-white"><i className="fas fa-calendar-alt"></i> {parseFirebaseTime(getFirebaseTime(rent.endDate.seconds, rent.endDate.nanoseconds))}</p>
                                            </div>
                                        </div>


                                    </div>

                                    <hr data-aos="fade-up" data-aos-delay="100" className="aos-init aos-animate"/>

                                    <div className="cart_offers_include">
                                        <h4 className="title_text mb-0 aos-init aos-animate text-red" data-aos="fade-up"
                                            data-aos-delay="100">Your Offer Includes:</h4>
                                        <div className="row">
                                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                                <ul className="cart_info_list ul_li_block clearfix aos-init aos-animate"
                                                    data-aos="fade-up" data-aos-delay="300">
                                                    {!!rent.perks.length ? rent.perks.map((perk, index) => {
                                                        return (<li key={index} className="text-white"><i className="far fa-check-circle"></i> {perk.name}
                                                        </li>)
                                                    }) :
                                                        <li className="pl-0 text-white">No perks selected.</li>
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <hr data-aos="fade-up" data-aos-delay="100" className="aos-init aos-animate"/>

                                    <ul className="cart_info_list2 ul_li_block clearfix aos-init aos-animate"
                                        data-aos="fade-up" data-aos-delay="100">
                                        <li><strong className="text-red">Car rental duration:</strong> <span className="text-white">{calculateRentDuration()} day(s)</span></li>
                                        <li><strong className="text-red">Rental Price:</strong> <span className="text-white">{rent.price}$/day</span></li>
                                        <li><strong className="text-red">Total:</strong> <span className="text-white">{calculateRentPrice()}$</span></li>
                                    </ul>

                                    <hr data-aos="fade-up" data-aos-delay="100" className="aos-init aos-animate"/>

                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            }
        </>
    );
};

export default RentHistory;
