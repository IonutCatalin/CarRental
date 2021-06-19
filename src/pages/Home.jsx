import React, {useEffect, useState} from 'react';
import {useAuth} from '../contexts/AuthContext';
import banner from '../images/banner.svg';
import {Link} from "react-router-dom";
import firebase from "../firebase";
import CarCard from "../components/CarCard";
import LoaderComponent from "../components/LoaderComponent";


const Home = () => {
    const [topCars, setTopCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const {currentUser} = useAuth();
    
    console.log(currentUser);

    const getMostCommented = async () => {
        const carsWithReviews = [];

        const carsSnapshot = await firebase
            .firestore()
            .collection('cars')
            .get();

        for (const doc of carsSnapshot.docs) {
            const reviewsSnap = await firebase
                .firestore()
                .collection("cars")
                .doc(doc.id)
                .collection("reviews")
                .get();

            const reviews = reviewsSnap.docs.map((snap) => snap.data());

            carsWithReviews.push({...doc.data(), uid: doc.id, reviews: reviews.length})
        }

        const carsWithMostReviews = carsWithReviews.sort((a, b) => b.reviews - a.reviews);

        const topSixCars = carsWithMostReviews.splice(0, 6);

        setTopCars(topSixCars);
        setLoading(false);
    };

    useEffect(() => {
        getMostCommented();
    }, []);

    return (
        <>
            <main className="mt-0">
                <section className="bg-top-center bg-repeat-0 pt-5">
                    <div className="container-fluid pt-5">
                        <div className="row justify-content-center">
                            <div
                                className="col-lg-4 col-md-5 pt-3 pt-md-4 pt-lg-5 d-flex justify-content-center flex-column pl-5 pr-5">
                                <h1 className="display-4 text-light pb-2 mb-4 me-md-n5">Easy way to find the right car
                                    to <span className="text-red">rent</span></h1>
                                <p className="fs-lg text-light opacity-70">Car rental is a digital platform for
                                    the automotive industry that connects car renters across the country with their
                                    favorite vehicles. </p>
                            </div>
                            <div className="col-lg-6 col-md-7 pt-md-5">
                                <img className="d-block mt-4 ms-auto"
                                     src={banner}
                                     width="800" alt="Car"/>
                            </div>
                        </div>
                    </div>

                </section>

                <section className="container pt-4 pt-md-5">
                    <div className="d-sm-flex align-items-center justify-content-center">
                        <h2 className="h1 text-light mb-5 mb-sm-0">Advantages for working with us</h2>
                    </div>
                    <hr/>
                    <div className="row justify-content-between d-flex">
                        <div className="col-md-5 col-lg-4 offset-lg-1 pt-4 mt-2 pt-md-5 mt-md-3">
                            <div className="d-flex pb-4 pb-md-5 mb-2"><i
                                className="fi-file lead text-primary mt-1 order-md-2"></i>
                                <div className="text-md-end ps-3 ps-md-0 pe-md-3 order-md-1">
                                    <h3 className="h3 text-light mb-1">Over 1 Million Listings</h3>
                                    <p className="fs-sm text-light opacity-70 mb-0">That’s more than you’ll find on any
                                        other major online automotive marketplace in the USA.</p>
                                </div>
                            </div>
                            <div className="d-flex pb-4 pb-md-5 mb-2"><i
                                className="fi-search lead text-primary mt-1 order-md-2"></i>
                                <div className="text-md-end ps-3 ps-md-0 pe-md-3 order-md-1">
                                    <h3 className="h3 text-light mb-1">Personalized Search</h3>
                                    <p className="fs-sm text-light opacity-70 mb-0">Our powerful search makes it easy to
                                        personalize your results so you only see the cars and features you care
                                        about.</p>
                                </div>
                            </div>
                            <div className="d-flex pb-4 pb-md-5 mb-2"><i
                                className="fi-settings lead text-primary mt-1 order-md-2"></i>
                                <div className="text-md-end ps-3 ps-md-0 pe-md-3 order-md-1">
                                    <h3 className="h3 text-light mb-1">Non-Stop Innovation</h3>
                                    <p className="fs-sm text-light opacity-70 mb-0">Our team is constantly developing
                                        new features that make the process of buying and selling a car simpler.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-5 col-lg-4 pt-md-5 mt-md-3">
                            <div className="d-flex pb-4 pb-md-5 mb-2"><i
                                className="fi-info-circle lead text-primary mt-1"></i>
                                <div className="ps-3">
                                    <h3 className="h3 text-light mb-1">Valuable Insights</h3>
                                    <p className="fs-sm text-light opacity-70 mb-0">We provide free access to key info
                                        like dealer reviews, market value, price drops.</p>
                                </div>
                            </div>
                            <div className="d-flex pb-4 pb-md-5 mb-2"><i
                                className="fi-users lead text-primary mt-1"></i>
                                <div className="ps-3">
                                    <h3 className="h3 text-light mb-1">Consumer-First Mentality</h3>
                                    <p className="fs-sm text-light opacity-70 mb-0">We focus on building the most
                                        transparent, trustworthy experience for our users, and we’ve proven that works
                                        for dealers, too.</p>
                                </div>
                            </div>
                            <div className="d-flex pb-4 pb-md-5 mb-2"><i
                                className="fi-calculator lead text-primary mt-1"></i>
                                <div className="ps-3">
                                    <h3 className="h3 text-light mb-1">Online Car Appraisal</h3>
                                    <p className="fs-sm text-light opacity-70 mb-0">Specify the parameters of your car
                                        to form its market value on the basis of similar cars on Finder.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                <section className="feature_section clearfix mt-5">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-6 col-md-8 col-sm-12 col-xs-12">
                                <div className="section_title mb-2 text-center">
                                    <h2 className="h1 text-light mb-sm-0">Most appreciated</h2>
                                </div>
                                <hr/>
                            </div>
                        </div>


                        {loading ?
                            <div className="d-flex justify-content-center w-100 text-red">
                                <LoaderComponent/>
                            </div>
                            :
                            <div className="top-cars-container">
                                {!!topCars.length && topCars.map((car, index) => {
                                    return <CarCard car={car} key={index}/>
                                })}
                            </div>
                        }

                        <div className="abtn_wrap text-center clearfix mt-5">
                            <Link className="custom_btn bg_default_red btn_width text-uppercase" to="/cars">View
                                all
                            </Link>
                        </div>

                    </div>
                </section>
            </main>
        </>
    )
}

export default Home;
