import React, {useState, useEffect} from 'react';
import {Link} from "react-router-dom";
import {useHistory, useParams} from 'react-router-dom'
import firebase from "../firebase";
import CarFiltersSidebar from "../components/CarFiltersSidebar";
import Slider from "react-slick";
import {useReservation} from "../contexts/ReservationContext";
import {setReservationAction} from "../reducers/ReservationReducer";
import {useAuth} from "../contexts/AuthContext";
import CarReview from "../components/CarReview";
import CarAddReview from "../components/CarAddReview";

const CarSingle = () => {
    const [car, setCar] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [recommended, setRecommended] = useState([]);
    const [initialPrice, setInitialPrice] = useState(0);
    const [perks, setPerks] = useState([]);
    const [selectedPerks, setSelectedPerks] = useState([]);
    const {reservation, reservationDispatch} = useReservation();
    const {currentUser} = useAuth();

    const {carId} = useParams();
    const history = useHistory();

    const thumbnailSettings = {
        dots: false,
        speed: 1000,
        infinite: true,
        autoplay: true,
        arrows: false,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    const thumbnailNavSettings = {
        speed: 1000,
        dots: false,
        arrows: true,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        focusOnSelect: true,
        autoplay: true,
        responsive: [
            {
                breakpoint: 0,
                settings: {
                    slidesToShow: 1
                }
            },
            {
                breakpoint: 415,
                settings: {
                    slidesToShow: 1
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 1920,
                settings: {
                    slidesToShow: 4
                }
            }
        ]
    };

    const getCar = async () => {
        const snapshot = await firebase.firestore()
            .collection('cars')
            .doc(carId)
            .get();

        setCar(snapshot.data());
        setInitialPrice(+snapshot.data().price);

        await getRecommended(snapshot.data());
    };

    const getRecommended = async (carData) => {
        const snapshot = await firebase.firestore()
            .collection('cars')
            .where(firebase.firestore.FieldPath.documentId(), '!=', carId)
            .where('gearbox', '==', carData.gearbox)
            .where('passengers', '==', carData.passengers)
            .where('model', '==', carData.model)
            .where('fuel', '==', carData.fuel)
            .limit(4)
            .get();

        const data = snapshot.docs.map(document => ({...document.data(), uid: document.id}));

        setRecommended(data);
    };

    const getReviews = async () => {
        const snap = await firebase.firestore()
            .collection('cars')
            .doc(carId)
            .collection('reviews')
            .get();

        const data = snap.docs.map(review => review.data());

        setReviews(data);
    };

    const getPerks = async () => {
        const snapshot = await firebase.firestore()
            .collection('perks')
            .get();

        const list = snapshot.docs.map(doc => {
            return {...doc.data(), uid: doc.id}
        });

        setPerks(list);
    };

    const onPerksChange = (perk) => {
        const {uid: value} = perk;
        const list = [...selectedPerks];

        if (!list.find((item) => item.uid === value)) {
            const newPrice = +car.price + 1 / 10 * initialPrice;

            list.push(perk);
            setCar({
                ...car,
                price: Math.ceil(newPrice)
            })
        } else {
            const index = list.findIndex(item => item === value);
            const newPrice = +car.price - 1 / 10 * initialPrice;

            list.splice(index, 1);
            setCar({
                ...car,
                price: Math.ceil(newPrice)
            })
        }

        setSelectedPerks(list);
    };

    const onRentRedirect = (e) => {
        e.preventDefault();

        const carToRent = {
            ...car,
            uid: carId,
            perks: selectedPerks
        };

        reservationDispatch(setReservationAction(carToRent));

        history.push("/rent");
    };

    const onReviewAdd = (review) => {
        firebase.firestore()
            .collection('cars')
            .doc(carId)
            .collection('reviews')
            .add(review)
            .then(() => {
                const updatedReviews = [...reviews, review];
                const updatedAverageRating = calculateAverageRating(updatedReviews);

                updateRating(updatedAverageRating);
                setReviews(updatedReviews);
            });
    };

    const updateRating = (rating) => {
        firebase.firestore()
            .collection('cars')
            .doc(carId)
            .set({
                rating
            }, {merge: true})
            .then(() => {
                setCar({...car, rating});
            });
    }

    const calculateAverageRating = (reviews) => {
        const ratings = reviews.map(({rating}) => Number(rating));
        const ratingsSum = ratings.reduce((acc, current) => acc + current, 0);

        return (ratingsSum / ratings.length).toFixed(2) || 0;
    };

    useEffect(() => {
        window.scrollTo(0, 0);

        getCar();
        getPerks();
        getReviews();
    }, [carId]);

    return (
        <main>
            <section className="breadcrumb_section text-center clearfix">
                <div className="page_title_area has_overlay d-flex align-items-center clearfix"
                     data-bg-image="assets/images/breadcrumb/bg_02.jpg"
                     style={{backgroundImage: "url(&quot;assets/images/breadcrumb/bg_02.jpg&quot;)"}}>
                    <div className="overlay"></div>
                    <div className="container aos-init aos-animate" data-aos="fade-up" data-aos-delay="100">
                        <h1 className="page_title text-white mb-0">View car and choose perks</h1>
                    </div>
                </div>
            </section>


            {car && <div className="details_section sec_ptb_100 pb-0 clearfix">
                <div className="container">
                    <div className="row justify-content-lg-between justify-content-md-center justify-content-sm-center">

                        <div className="col-lg-4 col-md-8 col-sm-10 col-xs-12">
                            <CarFiltersSidebar readOnly={true} car={car}/>
                        </div>

                        <div className="col-lg-8 col-md-8 col-sm-10 col-xs-12">
                            <div className="car_choose_carousel mb_30 clearfix">
                                <div className="thumbnail_carousel">
                                    <div className="item">
                                        <div className="item_head">
                                            <h4 className="item_title mb-0">{car.name}</h4>
                                            <ul className="review_text ul_li_right clearfix">
                                                <li className="text-right">
                                                    <small>{reviews.length} Review(s)</small>
                                                </li>
                                                <li><span className="bg_default_blue">{car.rating}</span></li>
                                            </ul>
                                        </div>
                                        <img
                                            src={car.thumbnail}
                                            alt="image_not_found"/>
                                        <ul className="btns_group ul_li_center clearfix">
                                            <li>
                                                <span
                                                    className="custom_btn btn_width bg_default_blue">${car.price}/Day</span>
                                            </li>
                                            <li>
                                                <Link to="#"
                                                      className="custom_btn btn_width bg_default_red text-uppercase"
                                                      onClick={onRentRedirect}>Rent car </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <Slider {...thumbnailNavSettings} className="thumbnail_carousel_nav">
                                    {car.gallery.map((picture, key) => {
                                        return (
                                            <div className="item" key={key}>
                                                <img
                                                    src={picture}
                                                    alt="image_not_found"/>
                                            </div>
                                        )
                                    })}
                                </Slider>

                            </div>

                            <div className="car_choose_content">
                                <div className="text-white">{car.description}</div>

                                <hr data-aos="fade-up" data-aos-delay="300" className="aos-init aos-animate"/>

                                <div className="rent_details_info">
                                    <h4 className="list_title text-red" data-aos="fade-up"
                                        data-aos-delay="100">Additional perks (+10% price per each):</h4>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="car-perks-list">
                                                {perks && perks.map((perk, index) => {
                                                    return (
                                                        <div className="checkbox_input text-white" key={index}>
                                                            <label htmlFor={`perk-${index}`}>
                                                                <input type="checkbox"
                                                                       id={`perk-${index}`}
                                                                       onChange={() => onPerksChange(perk)}
                                                                       value={perk.uid}
                                                                /> {perk.name}
                                                            </label>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <hr data-aos="fade-up" data-aos-delay="100" className="aos-init aos-animate"/>

                                <div className="testimonial_contants_wrap mb-5">
                                    <h3 className="item_title mb_30 text-red">Recent Reviews:</h3>

                                    {currentUser ? <div>
                                            <CarAddReview onAdd={onReviewAdd}/>
                                        </div> :
                                        <div className="text-white">Log in to add review.</div>
                                    }

                                    {!!reviews.length ? reviews.map((review, index) => {
                                            return <CarReview key={index} review={review}/>
                                        }) :
                                        <div className="text-white">No reviews yet.</div>
                                    }

                                </div>

                            </div>

                        </div>

                    </div>
                </div>

                <div className="container-fluid p-0">
                    <h1 className="page_title text-white text-center mb-0 mt-5">Recommendations</h1>
                    <div className="row mt-5">
                        {!!recommended.length && recommended.map((recommendation, index) => {
                            return (
                                <div className={`col-12 col-sm-${12 / recommended.length} c-p`} key={index}>
                                    <Link to={`/car/${recommendation.uid}`}>
                                        <div className="gallery_fullimage_2">
                                            <img
                                                src={recommendation.thumbnail}
                                                alt="image_not_found"/>
                                            <div className="item_content text-white">
                                                <span className="item_price bg_default_blue">${recommendation.price}/Day</span>
                                                <h3 className="item_title text-white">{recommendation.name}</h3>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            )
                        })
                      }
                    </div>
                </div>
            </div>
            }
        </main>
    );
}

export default CarSingle;
