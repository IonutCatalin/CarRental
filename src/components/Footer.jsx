import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import {Link, useHistory} from 'react-router-dom';

const Footer = () => {
	const { currentUser } = useAuth();

    const history = useHistory();

    if (!currentUser && history.location.pathname !== '/') {
        return <></>;
    }

    return (
		<footer className="footer_section clearfix mt-5">
			<div className="footer_widget_area sec_ptb_100 clearfix" data-bg-color="#F2F2F2">
				<div className="container">
					<div className="row justify-content-lg-between">
						<div className="col-lg-4 col-md-4 col-sm-12 col-sm-12">
							<div className="footer_about" data-aos="fade-up" data-aos-delay="100">
								<div className="brand_logo mb_30">
									<Link to="/" style={{fontSize: '22px'}}>
										<i className="fas fa-car-side text-grey mr-2"/><span className="text-red">Car rental</span>
									</Link>
								</div>
								<p className="mb_15">
									Cras sit amet mi non orci pretium consectetur. Donec iaculis ante ac sollicitudin luctus. Phasellus ut lacus lacus. Phasellus sagittis ex id tortor tincidunt luctus. Donec consectetur consequat bibendum
								</p>
								<div className="footer_useful_links mb_30">
									<ul className="ul_li_block clearfix">
										<li><a href="#!"><i className="fal fa-angle-right"></i> Rental Information</a></li>
										<li><a href="#!"><i className="fal fa-angle-right"></i> F.A.Q.</a></li>
									</ul>
								</div>
							</div>
						</div>

						<div className="col-lg-3 col-md-4 col-sm-12 col-sm-12">
							<div className="footer_contact_info" data-aos="fade-up" data-aos-delay="200">
								<h3 className="footer_widget_title">Contact Us:</h3>
								<ul className="ul_li_block clearfix">
									<li>
										<strong><i className="fas fa-map-marker-alt"></i> Main Office Address:</strong>
										<p className="mb-0">
											Unit 9, Manor Industrial Estate, Lower Wash Lane, Warrington, WA4
										</p>
									</li>
									<li><i className="fas fa-clock"></i> 8:00am-9:30pm</li>
									<li><i className="far fa-angle-right"></i> Other Office Locations</li>
									<li><i className="fas fa-phone"></i> <strong>+880 1680 6361 89</strong></li>
								</ul>
							</div>
						</div>

						<div className="col-lg-4 col-md-4 col-sm-12 col-sm-12">
							<div className="footer_useful_links" data-aos="fade-up" data-aos-delay="300">
								<h3 className="footer_widget_title">Information:</h3>
								<ul className="ul_li_block clearfix">
									<li><a href="#!"><i className="fal fa-angle-right"></i> Find a Car for Rent in the Nearest Location</a></li>
									<li><a href="#!"><i className="fal fa-angle-right"></i> Cars Catalog</a></li>
									<li><a href="#!"><i className="fal fa-angle-right"></i> F.A.Q.</a></li>
									<li><a href="#!"><i className="fal fa-angle-right"></i> About Us</a></li>
									<li><a href="#!"><i className="fal fa-angle-right"></i> Contact Us</a></li>
									<li><a href="#!"><i className="fal fa-angle-right"></i> Help Center</a></li>
									<li><a href="#!"><i className="fal fa-angle-right"></i> Privacy Police</a></li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
    );
};

export default Footer;
