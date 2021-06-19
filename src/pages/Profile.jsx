import React from 'react';
import {Link, NavLink, useRouteMatch, Switch, Route, useLocation} from 'react-router-dom';
import firebase from "../firebase";
import {useAuth} from '../contexts/AuthContext';
import ProfileInfo from '../components/ProfileInfo';
import ProfileHistory from '../components/ProfileHistory';
import ProfileRecommendations from "../components/ProfileRecommendations";


const Profile = () => {
    const {currentUser} = useAuth();
    const location = useLocation()
    let {path, url} = useRouteMatch();

    if (!currentUser) {
        return <></>;
    }

    return (
        <>
            <main style={{marginTop: '80px'}}>
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
                                facilisis efficitur, nunc nisi scelerisque enim, rhoncus malesuada est velit a nulla.
                                Cras porta mi vitae dolor tristique euismod. Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit
                            </p>
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
                                <button type="submit"
                                        className="custom_btn bg_default_red btn_width text-uppercase">Book A Car <img
                                    src="assets/images/icons/icon_01.png" alt="icon_not_found"/></button>
                            </form>
                        </div>

                    </div>
                    <div className="overlay"></div>
                </div>


                <section className="breadcrumb_section text-center clearfix">
                    <div className="page_title_area has_overlay d-flex align-items-center clearfix"
                         data-bg-image="assets/images/breadcrumb/bg_10.jpg">
                        <div className="overlay"></div>
                        <div className="container aos-init aos-animate" data-aos="fade-up" data-aos-delay="100">
                            <h1 className="page_title text-white mb-0">My Account</h1>
                        </div>
                    </div>
                </section>


                <section className="account_section sec_ptb_100 clearfix">
                    <div className="container">
                        <div
                            className="row justify-content-lg-between justify-content-md-center justify-content-sm-center">

                            <div className="col-lg-4 col-md-8 col-sm-10 col-xs-12">
                                <div className="account_tabs_menu clearfix aos-init aos-animate" data-bg-color="#F2F2F2"
                                     data-aos="fade-up" data-aos-delay="100"
                                     style={{backgroundColor: "rgb(242, 242, 242)"}}>
                                    <h3 className="list_title mb_15">Account Details:</h3>
                                    <ul className="ul_li_block nav" role="tablist">
                                        <li>
                                            <NavLink to={`${url}`} isActive={() => location.pathname === '/profile'}>
                                                <i className="fas fa-user"></i> {currentUser.displayName}
                                            </NavLink>
                                        </li>

                                        <li>
                                            <NavLink to={`${url}/history`}
                                                     isActive={() => location.pathname === '/profile/history'}>
                                                <i className="fas fa-file-alt"></i> Booking history
                                            </NavLink>
                                        </li>

                                        <li>
                                            <NavLink to={`${url}/recommendations`}
                                                     isActive={() => location.pathname === '/profile/recommendations'}>
                                                <i className="fas fa-car"></i> Recommendations
                                            </NavLink>
                                        </li>

                                        <li onClick={() => firebase.auth().signOut()}>
                                            <Link to="#"><i className="fas fa-sign-out-alt"></i> Log Out </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="col-lg-8 col-md-8 col-sm-10 col-xs-12">
                                <div className="account_tab_content tab-content">

                                    <Switch>
                                        <Route exact path={path}>
                                            <ProfileInfo/>
                                        </Route>
                                        <Route path={`${path}/history`}>
                                            <ProfileHistory/>
                                        </Route>
                                        <Route path={`${path}/recommendations`}>
                                            <ProfileRecommendations/>
                                        </Route>
                                    </Switch>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default Profile;
