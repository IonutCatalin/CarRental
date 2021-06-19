import React, {useEffect, useState} from "react";
import {useAuth} from "../contexts/AuthContext";
import firebase from "../firebase";
import {Link} from "react-router-dom";

const Manage = () => {
    const {currentUser} = useAuth();
    const [cars, setCars] = useState([]);

    const getOwnedCars = async () => {
        const snapshot = await firebase.firestore()
            .collection('cars')
            .where('ownerId', '==', currentUser.uid)
            .get();

        const data = snapshot.docs.map(document => ({...document.data(), uid: document.id}));

        setCars(data);
    };

    const onCarDelete = async (carUid) => {
        const popup = window.confirm("Are you sure you want to delete this vehicle? It will also erase all reservation history connected to this car.");

        if (popup) {
            await firebase
                .firestore()
                .collection("cars")
                .doc(carUid)
                .delete();

           const reservationSnap = await firebase
                .firestore()
                .collection("reservations")
                .where("carId", "==", carUid)
                .get();

            reservationSnap.forEach((doc) => {
                doc.ref.delete().then();
            });

            const updatedCars = cars.filter((car) => car.uid !== carUid);
            setCars(updatedCars);
        }
    };

    useEffect(() => {
        if (currentUser) {
            getOwnedCars();
        }
    }, [currentUser]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <main>
            <div className="container pt-5 pb-lg-4 my-5">
                <div className="row">
                    <div className="col-lg-8 order-lg-2 mb-5">
                        <div className="d-sm-flex align-items-center justify-content-between pb-4 mb-sm-2">
                            <h1 className="h3 text-light mb-sm-0 me-sm-3">Your vehicles</h1>
                        </div>

                        {!!cars.length && cars.map((car, key) => {
                            return (
                                <div className="feature_vehicle_item" key={key}
                                     style={{maxWidth: '100%'}}>
                                    <h3 className="item_title d-flex justify-content-between mb-0 p-4">
                                        <Link to={`/manage/${car.uid}`}>{car.name}</Link>
                                        <i className="fas fa-trash text-red c-p" style={{fontSize: '20px'}} onClick={() => onCarDelete(car.uid)}/>
                                    </h3>
                                    <div className="item_image position-relative">
                                        <Link className="image_wrap" to={`/manage/${car.uid}`}><img
                                            src={car.thumbnail}
                                            alt="image_not_found"/>
                                        </Link><span className="item_price bg_default_blue">${car.price}/Day</span>
                                    </div>
                                    <ul className="info_list ul_li_center clearfix">
                                        <li>{car.model}</li>
                                        <li>{car.gearbox}</li>
                                        <li>{car.passengers} Passengers</li>
                                        <li>{car.fuel}</li>
                                    </ul>
                                </div>
                            )
                        })}


                    </div>

                    {currentUser && <aside className="col-lg-4 order-lg-1 pe-xl-4 mb-5">
                        <div className="d-flex align-items-start mb-4 flex-column">
                            <div className="ps-2">
                                <h2 className="h4 text-light mb-1">{currentUser.displayName}</h2>
                                <span className="text-light mb-1">{currentUser.email}</span>
                            </div>
                            <button className="custom_btn bg_default_red text-uppercase text-white mt-5">
                                <Link to="/manage/add" className="text-white">Add vehicle</Link>
                            </button>
                        </div>
                    </aside>}
                </div>


            </div>
        </main>
    )
};

export default Manage;
