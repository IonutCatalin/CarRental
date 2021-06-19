import React, {useEffect, useState} from 'react';
import CarsFilters from "../components/CarsFilters";
import firebase from "../firebase";
import CarCard from "../components/CarCard";

const Cars = () => {
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);

    const fetchCars = async () => {
        const response = await firebase
            .firestore()
            .collection('cars')
            .get();

        const list = response.docs.map(doc => {
            return {...doc.data(), uid: doc.id};
        });

        setCars([...list]);
        setFilteredCars([...list]);
    };

    const onFilterApply = (filters) => {
        const results = cars.filter((car) => {
            let cond = true;

            if (filters.price) {
                cond = cond && car.price <= filters.price
            }

            if (filters.name) {
                cond = cond && car.name.toLowerCase().includes(filters.name);
            }

            if (filters.location) {
                cond = cond && car.locations.includes(filters.location.value);
            }

            if (filters.passengers) {
                cond = cond && car.passengers === filters.passengers;
            }

            if (filters.model) {
                cond = cond && car.model === filters.model;
            }

            if (filters.fuel) {
                cond = cond && car.fuel === filters.fuel;
            }

            if (filters.gearbox) {
                cond = cond && car.gearbox === filters.gearbox;
            }

            return cond;
        });

        setFilteredCars(results);
    };


    const onFiltersReset = () => {
        setFilteredCars(cars);
    };

    useEffect(() => {
        window.scrollTo(0, 0);

        return fetchCars();
    }, []);

    return (
        <main>
            <div className="sidebar-menu-wrapper">
                <div className="mobile_sidebar_menu">
                    <button type="button" className="close_btn"><i className="fal fa-times"></i></button>

                    <div className="about_content mb_60">
                        <div className="brand_logo mb_15">
                            <a href="index.html">
                                <img src="assets/images/logo/logo_01_1x.png"
                                     srcSet="assets/images/logo/logo_01_2x.png 2x" alt="logo_not_found"/>
                            </a>
                        </div>
                        <p className="mb-0">
                            Nullam id dolor auctor, dignissim magna eu, mattis ante. Pellentesque tincidunt, elit a
                            facilisis efficitur, nunc nisi scelerisque enim, rhoncus malesuada est velit a nulla. Cras
                            porta mi vitae dolor tristique euismod. Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit
                        </p>
                    </div>

                    <div className="menu_list mb_60 clearfix">
                        <h3 className="title_text text-white">Menu List</h3>
                        <ul className="ul_li_block clearfix">
                            <li className="active dropdown">
                                <a href="#!" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                                   className="dropdown-toggle">Home</a>
                                <ul className="dropdown-menu">
                                    <li><a href="index_1.html">Home Page V.1</a></li>
                                    <li><a href="index_2.html">Home Page V.2</a></li>
                                </ul>
                            </li>
                            <li><a href="gallery.html">Our Cars</a></li>
                            <li><a href="review.html">Reviews</a></li>
                            <li><a href="about.html">About</a></li>
                            <li className="dropdown">
                                <a href="#!" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                                   className="dropdown-toggle">Pages</a>
                                <ul className="dropdown-menu">
                                    <li><a href="service.html">Our Service</a></li>
                                    <li><a href="gallery.html">Car Gallery</a></li>
                                    <li><a href="account.html">My Account</a></li>
                                    <li><a href="reservation.html">Reservation</a></li>
                                    <li className="dropdown">
                                        <a href="#!" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                                           className="dropdown-toggle">Blogs</a>
                                        <ul className="dropdown-menu">
                                            <li><a href="blog.html">Blog</a></li>
                                            <li><a href="blog_details.html">Blog Details</a></li>
                                        </ul>
                                    </li>
                                    <li className="dropdown">
                                        <a href="#!" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                                           className="dropdown-toggle">Our Cars</a>
                                        <ul className="dropdown-menu">
                                            <li><a href="car.html">Cars</a></li>
                                            <li><a href="car_details.html">Car Details</a></li>
                                        </ul>
                                    </li>
                                    <li><a href="cart.html">Shopping Cart</a></li>
                                    <li><a href="faq.html">F.A.Q.</a></li>
                                    <li><a href="login.html">Login</a></li>
                                </ul>
                            </li>
                            <li className="dropdown">
                                <a href="#!" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                                   className="dropdown-toggle">Contact Us</a>
                                <ul className="dropdown-menu">
                                    <li><a href="contact.html">Contact Default</a></li>
                                    <li><a href="contact_wordwide.html">Contact Wordwide</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>

                    <div className="booking_car_form">
                        <h3 className="title_text text-white mb-2">Book A Car</h3>
                        <p className="mb_15">
                            Nullam id dolor auctor, dignissim magna eu, mattis ante. Pellentesque tincidunt, elit a
                            facilisis efficitur.
                        </p>
                        <form action="#">
                            <div className="form_item">
                                <h4 className="input_title text-white">Pick Up Location</h4>
                                <div className="position-relative">
                                    <input id="location_one" type="text" name="location"
                                           placeholder="City, State or Airport Code"/>
                                    <label htmlFor="location_one" className="input_icon"><i
                                        className="fas fa-map-marker-alt"></i></label>
                                </div>
                            </div>
                            <div className="form_item">
                                <h4 className="input_title text-white">Pick A Date</h4>
                                <input type="date" name="date"/>
                            </div>
                            <button type="submit" className="custom_btn bg_default_red btn_width text-uppercase">Book A
                                Car <img src="assets/images/icons/icon_01.png" alt="icon_not_found"/></button>
                        </form>
                    </div>

                </div>
                <div className="overlay"></div>
            </div>


            <section className="breadcrumb_section text-center clearfix">
                <div className="page_title_area has_overlay d-flex align-items-center clearfix"
                     data-bg-image="assets/images/breadcrumb/bg_01.jpg"
                     style={{backgroundImage: "url(&quot;assets/images/breadcrumb/bg_01.jpg&quot;)"}}>
                    <div className="overlay"></div>
                    <div className="container aos-init aos-animate" data-aos="fade-up" data-aos-delay="100">
                        <h1 className="page_title text-white mb-0">Our cars</h1>
                    </div>
                </div>

            </section>


            <div className="car_section sec_ptb_100 clearfix">
                <div className="container">
                    <div className="row justify-content-lg-between justify-content-md-center justify-content-sm-center">

                        <CarsFilters onApply={onFilterApply} onReset={onFiltersReset}/>

                        <div className="col-lg-8 col-md-10 col-sm-12 col-xs-12">
                            <div className="item_shorting clearfix aos-init aos-animate dark-bg" data-aos="fade-up"
                                 data-aos-delay="100">
                                <div className="row align-items-center justify-content-lg-between">
                                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                        <span
                                            className="item_available">Available offers - {filteredCars && filteredCars.length}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                {!!filteredCars.length ? filteredCars.map((car, index) => {
                                        return (
                                            <div className="col-lg-6 col-md-6" key={index}>
                                                <CarCard car={car}/>
                                            </div>
                                        )
                                    }) :
                                    <div className="mt-5 text-center w-100 text-white">No vehicles matching your criteria.</div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Cars;
