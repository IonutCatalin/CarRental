import React, {useEffect, useState} from "react";
import CarCard from "../components/CarCard";
import Datetime from "react-datetime";
import firebase from "../firebase";
import {useReservation} from "../contexts/ReservationContext";
import {setReservationAction} from "../reducers/ReservationReducer";
import {Link, useHistory} from "react-router-dom";
import {useAuth} from "../contexts/AuthContext";
import Select from "react-select";
import * as moment from 'moment';
import {getFirebaseTime} from "../utilities/time";

const Rent = () => {
    const {reservation, reservationDispatch} = useReservation();
    const {currentUser} = useAuth();
    const [renter, setRenter] = useState({
        displayName: '',
        email: '',
        phone: '',
        uid: '',
        details: '',
        location: '',
        returnLocation: ''
    });
    const [perks, setPerks] = useState([]);
    const [hasConsented, setHasConsented] = useState(false);
    const [rendered, setRendered] = useState(false);
    const [locations, setLocations] = useState([]);
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [disabledCheckInDates, setDisabledCheckInDates] = useState([]);
    const [disabledCheckOutDates, setDisabledCheckOutDates] = useState([new Date()]);
    const minDate = new Date(2020, 0, 1);
    const maxDate = new Date(2021, 11, 31);
    const history = useHistory();

    const enumerateDaysBetweenDates = (startDate, endDate) => {
        const now = startDate.startOf('day');
        const dates = [];

        while (now.isBefore(endDate.startOf('day'))) {
            dates.push(new Date(now));
            now.add(1, 'days');
        }

        return dates;
    }

    const filterUniqueDates = (data) => {
        const lookup = new Set();

        return data.filter((date) => {
            const serialised = new Date(date).getTime();
            if (lookup.has(serialised)) {
                return false;
            } else {
                lookup.add(serialised);
                return true;
            }
        });
    }

    const isCheckInDateValid = (current) => {
        return !isInArray(disabledCheckInDates, current.toDate());
    }

    const isCheckOutDateValid = (current) => {
        return !isInArray(disabledCheckOutDates, current.toDate());
    }

    const onRenterChange = (e) => {
        setRenter({
            ...renter,
            [e.target.name]: e.target.value
        })
    };

    const onCheckInDateChange = (value) => {
        setCheckInDate(value);
        setDisabledCheckOutDates([]);

        setCheckOutDate('');

        let willBeDisabledAfterCheckIn;

        const rangeBeforeCheckIn = enumerateDaysBetweenDates(
            moment(new Date(2020, 0, 1)),
            moment(value)
        );

        const willBeDisabledInitially = filterUniqueDates([
            ...rangeBeforeCheckIn,
            ...disabledCheckInDates,
            
        ]);

        

        const foundFirstDateAfterCheckIn = disabledCheckInDates.find(
            (date) => new Date(date).getTime() > new Date(value).getTime()
        );

        if (foundFirstDateAfterCheckIn) {
            const disabledRange = enumerateDaysBetweenDates(
                moment(foundFirstDateAfterCheckIn),
                moment(maxDate)
            );

            willBeDisabledAfterCheckIn = filterUniqueDates([
                ...willBeDisabledInitially,
                ...disabledRange,
            ])
        }

        setDisabledCheckOutDates(foundFirstDateAfterCheckIn ? willBeDisabledAfterCheckIn : willBeDisabledInitially);
    }

    const getPerks = async () => {
        const snapshot = await firebase.firestore()
            .collection('perks')
            .get();

        const list = snapshot.docs.map(doc => {
            return {...doc.data(), uid: doc.id}
        });

        setPerks(list);
    };

    const getLocations = async () => {
        const result = await Promise.all(reservation.locations.map(async (location) => {
            const response = await firebase
                .firestore()
                .collection('locations')
                .doc(String(location))
                .get();

            return {
                value: location,
                label: response.data() && response.data().name
            }
        }));

        setLocations(result);
    };

    const parseFirebaseTime = (time) => {
        return moment(time).toDate();
    };

    const getDisabledReservationDates = async () => {
        setRendered(true);

        const disabledPeriod = [];

        const reservationsSnapshot = await firebase
            .firestore()
            .collection('reservations')
            .where('carId', '==', reservation.uid)
            .get();

        const reservationsData = reservationsSnapshot.docs.map(doc => {
            return {
                startDate: parseFirebaseTime(getFirebaseTime(doc.data().startDate.seconds, doc.data().startDate.nanoseconds)),
                endDate: parseFirebaseTime(getFirebaseTime(doc.data().endDate.seconds, doc.data().endDate.nanoseconds))
            }
        });

        const startOfYear = moment(minDate);
        const toDate = moment(new Date(Date.now()));
        const results = enumerateDaysBetweenDates(startOfYear, toDate);

        disabledPeriod.push(...results);

        reservationsData.forEach((booking) => {
            const startDate = moment(booking.startDate);
            const endDate = moment(booking.endDate);
            const bookedRange = enumerateDaysBetweenDates(startDate, endDate);

            disabledPeriod.push(...bookedRange);
            disabledPeriod.push(booking.endDate);
        });

        setDisabledCheckInDates([
            ...disabledCheckInDates,
            ...disabledPeriod
        ]);
    };

    const isInArray = (array, value) => {
        return !!array.find(item => item.getTime() === value.getTime());
    }

    const onRentSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            name: reservation.name,
            carId: reservation.uid,
            ownerId: reservation.ownerId,
            renterId: currentUser.uid,
            startDate: checkInDate,
            endDate: checkOutDate,
            passengers: reservation.passengers,
            notes: renter.details,
            rentLocation: renter.location.label,
            rentReturnLocation: renter.returnLocation.label,
            price: reservation.price,
            perks: reservation.perks
        };

        await firebase
            .firestore()
            .collection('reservations')
            .add(payload);

        history.push('/cars');
    };

    const onPageLeave = () => {
        reservationDispatch(setReservationAction(null));
    };

    const customStyles = {
        control: base => ({
            ...base,
            minHeight: 50,
            color: "#fff",
            backgroundColor: "rgba(255, 255, 255, 0.04)"
        }),
        option: styles => ({
            ...styles,
            color: "#1f1b2d"
        }),
        input: styles => ({ ...styles, color: "#fff" }),
        singleValue: (styles, { data }) => ({ ...styles, color: "#fff" })
    };

    useEffect(() => {
        if (reservation) {
            getLocations();

            if (!rendered) {
                getDisabledReservationDates();
            }
        }
    }, [reservation]);

    useEffect(() => {
        window.scrollTo(0, 0);
        
        getPerks();

        return onPageLeave;
    }, []);

    useEffect(() => {
        setRenter({
            ...renter,
            displayName: currentUser.displayName,
            uid: currentUser.uid,
            email: currentUser.email,
            phone: currentUser.phone,
        });
    }, [currentUser]);

    if (!reservation) {
        return (
            <main>
                <section>
                    <div className="container">
                        <div className="row d-flex justify-content-center">
                            <div className="confirm-icon"></div>
                        </div>
                    </div>
                </section>
                <section className="mt-5">
                    <div className="container text-center">
                        <h1 className="text-red">Oops.</h1>
                        <h1 className="mb-5 text-red">There is no reservation here.</h1>
                        <p className="mb-5 text-white">The page you have tried accessing has not detected any active reservation.
                            Navigate to our catalogue, select a car to fit your needs and click the "Rent Car"
                            button.</p>
                        <Link to="/cars" className="btn animated text-red"><b>Go back to our cars catalogue.</b></Link>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <>
            {reservation &&
            <main>
                <section className="breadcrumb_section text-center clearfix">
                    <div className="page_title_area has_overlay d-flex align-items-center clearfix"
                         data-bg-image="assets/images/breadcrumb/bg_03.jpg"
                         style={{backgroundImage: "url(&quot;assets/images/breadcrumb/bg_03.jpg&quot;)"}}>
                        <div className="overlay"></div>
                        <div className="container aos-init aos-animate" data-aos="fade-up" data-aos-delay="100">
                            <h1 className="page_title text-white mb-0">Reservation</h1>
                        </div>
                    </div>
                </section>

                <section className="reservation_section sec_ptb_100 clearfix">
                    <div className="container">
                        <div
                            className="row justify-content-lg-between justify-content-md-center justify-content-sm-center">

                            <div className="col-lg-4 col-md-8 col-sm-10 col-xs-12">
                                <CarCard car={reservation}/>
                            </div>

                            <div className="col-lg-8 col-md-8 col-sm-10 col-xs-12">
                                <div className="reservation_form">
                                    <form action="#">
                                        <div className="row">
                                            <div className="col-lg-5 col-md-12 col-sm-12 col-xs-12">
                                                <div className="aos-init aos-animate" data-aos="fade-up"
                                                     data-aos-delay="100">
                                                    <h4 className="input_title text-red">Pick-up Location</h4>
                                                    <Select
                                                        className="basic-single"
                                                        value={renter.location}
                                                        onChange={value => setRenter({...renter, location: value})}
                                                        options={locations}
                                                        isClearable={true}
                                                        styles={customStyles}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-4 col-md-12 col-sm-12 col-xs-12">
                                                <div className="form_item aos-init aos-animate" data-aos="fade-up"
                                                     data-aos-delay="200">
                                                    <h4 className="input_title text-red">Pick-up Date</h4>
                                                    <Datetime
                                                        closeOnSelect
                                                        value={checkInDate}
                                                        onChange={(value) => onCheckInDateChange(new Date(value))}
                                                        isValidDate={isCheckInDateValid}
                                                        timeFormat={false}
                                                        inputProps={{
                                                            placeholder: "Select a date"
                                                        }}
                                                        renderInput={(props) => {
                                                            return <input {...props}
                                                                          value={(checkInDate) ? props.value : ''}/>
                                                        }}
                                                    />
                                                </div>
                                            </div>


                                            {checkInDate && <>
                                                <div className="col-lg-5 col-md-12 col-sm-12 col-xs-12">
                                                    <div className="aos-init aos-animate" data-aos="fade-up"
                                                         data-aos-delay="400">
                                                        <h4 className="input_title text-red">Return Location</h4>
                                                        <Select
                                                            className="basic-single"
                                                            value={renter.returnLocation}
                                                            onChange={value => setRenter({
                                                                ...renter,
                                                                returnLocation: value
                                                            })}
                                                            options={locations}
                                                            isClearable={true}
                                                            styles={customStyles}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-4 col-md-12 col-sm-12 col-xs-12">
                                                    <div className="form_item aos-init aos-animate" data-aos="fade-up"
                                                         data-aos-delay="500">
                                                        <h4 className="input_title text-red">Return Date</h4>
                                                        <Datetime
                                                            closeOnSelect
                                                            value={checkOutDate}
                                                            onChange={(value) => setCheckOutDate(new Date(value))}
                                                            isValidDate={isCheckOutDateValid}
                                                            timeFormat={false}
                                                            inputProps={{
                                                                placeholder: "Select a date"
                                                            }}
                                                            renderInput={(props) => {
                                                                return <input {...props}
                                                                              value={(checkOutDate) ? props.value : ''}/>
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </>}

                                        </div>
                                    </form>

                                    <hr className="mt-0 aos-init aos-animate" data-aos="fade-up"
                                        data-aos-delay="700"/>

                                    <div className="reservation_offer_checkbox">
                                        <h4 className="input_title aos-init aos-animate mb-4 text-white" data-aos="fade-up"
                                            data-aos-delay="800">Your Offer Includes:</h4>
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="car-perks-list">
                                                    {!!reservation.perks.length ? reservation.perks.map((perk, index) => {
                                                            return (
                                                                <div className="mb-2 text-white" key={index}><i
                                                                    className="far fa-check-circle"></i> {perk.name}
                                                                </div>
                                                            )
                                                        })
                                                        :
                                                        <div className="text-white">No perks selected.</div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <hr className="mt-0 aos-init aos-animate" data-aos="fade-up"
                                        data-aos-delay="100"/>

                                    <div className="reservation_customer_details">
                                        <h4 className="input_title aos-init aos-animate mb-4 text-red" data-aos="fade-up"
                                            data-aos-delay="100">Customer Details:</h4>
                                        <form action="#" onSubmit={onRentSubmit}>
                                            <div className="row">
                                                <div className="col-lg-12 col-md-12 col-xs-12 col-xs-12">
                                                    <div className="form_item">
                                                        <input type="text"
                                                               name="displayName"
                                                               placeholder="Name"
                                                               readOnly
                                                               value={renter.displayName}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 col-md-12 col-xs-12 col-xs-12">
                                                    <div className="form_item aos-init aos-animate"
                                                         data-aos="fade-up" data-aos-delay="600">
                                                        <input type="text" name="email"
                                                               placeholder="E-mail address"
                                                               readOnly
                                                               value={renter.email}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 col-md-12 col-xs-12 col-xs-12">
                                                    <div className="form_item aos-init aos-animate"
                                                         data-aos="fade-up" data-aos-delay="700">
                                                        <input type="text" name="phone"
                                                               placeholder="Phone Number"
                                                               readOnly
                                                               value={renter.phone}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form_item">
                                                    <textarea name="details"
                                                              placeholder="Additional information (Optional)"
                                                              onChange={onRenterChange}
                                                              value={renter.details}
                                                    />
                                            </div>

                                            <hr className="aos-init aos-animate"/>

                                            <div className="row align-items-center justify-content-lg-between">
                                                <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                                                    <div className="checkbox_input mb-0">
                                                        <label htmlFor="accept" className="text-white">
                                                            <input type="checkbox"
                                                                   id="accept"
                                                                   onChange={(e) => setHasConsented(e.target.checked)}
                                                            />

                                                            I accept all
                                                            terms and conditions.</label>
                                                    </div>
                                                </div>
                                                <div
                                                    className="col-lg-6 col-md-12 col-sm-12 col-xs-12 aos-init aos-animate">
                                                    <button type="submit"
                                                            className={`custom_btn bg_default_red text-uppercase ${(!hasConsented || !renter.location || !checkInDate || !renter.returnLocation || !checkOutDate) ? 'disabled' : ''}`}>Rent
                                                        now
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </main>
            }
        </>
    );
}

export default Rent;
