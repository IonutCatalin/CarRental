import React, { useEffect, useState } from 'react';
import firebase from "../firebase";
import {Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
    const { currentUser } = useAuth();
	const [hide, setHide] = useState(false);
	const location = useLocation()

	useEffect(()=> {
		if (!currentUser && location.pathname !== '/') {
			setHide(true);
		} else {
			setHide(false);
		}
	}, [location]);

    if (hide) {
        return <></>;
    }

    return (
        <header className="header_section secondary_header sticky text-white clearfix">
			<div className="header_bottom clearfix">
				<div className="container">
					<div className="row align-items-center">

						<div className="col-lg-3 col-md-6 col-sm-6 col-6">
							<div className="brand_logo">
								<Link to="/" style={{fontSize: '22px'}}>
									<i className="fas fa-car-side text-grey mr-2"/><span className="text-red">Car rental</span>
								</Link>
							</div>
						</div>

						<div className="col-lg-3 col-md-6 col-sm-6 col-6 order-last">
							<ul className="header_action_btns ul_li_right clearfix">
								{currentUser &&
                                    <li className="dropdown">
                                        <div className="d-flex c-p" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="user_dropdown">
                                              <span className="mr-2">{currentUser.displayName}</span>
                                                <button type="button" className="user_btn">
                                                     <i className="fal fa-user"></i>
                                                </button>   
                                        </div>
                                    
                                        <div className="user_dropdown rotors_dropdown dropdown-menu clearfix" aria-labelledby="user_dropdown">
                                            <div className="profile_info clearfix pb-2">
                                            
                                                <div className="user_content">
                                                    <h4 className="user_name mb-1"><Link to="/profile">{currentUser.displayName}</Link></h4>
                                                    <span className="user_title font-weight-bold">{currentUser.type === 0 ? 'User' : 'Dealer'}</span>
                                                </div>
                                            </div>
                                            <ul className="ul_li_block clearfix">
                                                <li><Link to="/profile"><i className="fal fa-user-circle"></i> Profile</Link></li>
												{currentUser.type === 1 && <li><Link to="/manage"><i className="fas fa-unlock-alt"></i> Manage</Link></li>}
                                                <li onClick={() => firebase.auth().signOut()}><Link to="#"><i className="fal fa-sign-out"></i> Logout</Link></li>
                                            </ul>
                                        </div>
                                    </li>
                                }
							</ul>
						</div>

						<div className="col-lg-6 col-md-12">
							<nav className="main_menu clearfix">
								<ul className="ul_li_center clearfix">
									<li className="active">
										<Link to="/">Home</Link>
									</li>
									<li className="active">
										<Link to="/cars">Cars</Link>
									</li>
									{!currentUser && <li>
										<Link to="/login">Log in</Link>
									</li>
                                    }
								</ul>
							</nav>
						</div>

					</div>
				</div>
			</div>

			<div id="collapse_search_body" className="collapse_search_body collapse">
				<div className="search_body">
					<div className="container">
						<form action="#">
							<div className="form_item">
								<input type="search" name="search" placeholder="Type here..."/>
								<button type="submit"><i className="fal fa-search"></i></button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</header>
    )
}

export default Header;
