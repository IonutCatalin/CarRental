import React, { useState } from "react"
import firebase from "../firebase";
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory, Redirect } from "react-router-dom";
import {loadUser} from "../reducers/AuthReducer";

const Register = () => {
    const { currentUser, userDispatch } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [credentials, setCredentials] = useState({name: '', email: '', password: '', confirmPassword: '', type: 0, phone: '', address: ''});
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const {name, email, password, confirmPassword, type, phone, address} = credentials;

        if (!name || !email || !password || !confirmPassword || !type || !phone || !address) {
            return setError("Please fill all required fields.");
        }

        if (password !== confirmPassword) {
            return setError("Passwords do not match.");
        }

        try {
            setError("");
            setLoading(true);

            const payload = {
                displayName: credentials.name,
                email: credentials.email,
                type: +credentials.type,
                address: credentials.address,
                phone: credentials.phone
            };

            const userData = await firebase.auth().createUserWithEmailAndPassword(email, password);

            await firebase.firestore().collection('users').doc(userData.user.uid).set(payload);

            userDispatch(loadUser({...payload, uid: userData.user.uid}));

            history.push("/");

        } catch(e) {
            setError(e.message);
        }

        setLoading(false);
  }

  const handleTyping = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    }

    if (currentUser) {
        return <Redirect to="/"/>;
    }

    return (
		<>
    <main>
        <section className="breadcrumb_section text-center clearfix">
            <div className="page_title_area has_overlay d-flex align-items-center clearfix" data-bg-image="assets/images/breadcrumb/bg_09.jpg">
                <div className="overlay"></div>
                <div className="container" data-aos="fade-up" data-aos-delay="100">
                    <h1 className="page_title text-white mb-0">Register</h1>
                </div>
            </div>
        </section>
    <section className="register_section sec_ptb_100 clearfix">
    <div className="container">
        <div className="register_card mb-0" data-bg-color="##F2F2F2" data-aos="fade-up" data-aos-delay="100">
            <div className="section_title mb_30 text-center">
                <h2 className="title_text mb-0" data-aos="fade-up" data-aos-delay="300">
                    <span className="white">Register</span>
                </h2>
            </div>
            <form action="#" onSubmit={handleSubmit}>
                <div className="row justify-content-lg-between">
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12" data-aos="fade-up" data-aos-delay="500">
                        <div className="form_item">
                            <input type="text" name="name" placeholder="Your Name*" onChange={handleTyping}/>
                        </div>
                        <div className="form_item">
                            <input type="email" name="email" placeholder="Your Email*" onChange={handleTyping}/>
                        </div>
                        <div className="form_item">
                            <input type="password" name="password" placeholder="Password*" onChange={handleTyping}/>
                        </div>
                        <div className="form_item">
                            <input type="password" name="confirmPassword" placeholder="Confirm Password*" onChange={handleTyping}/>
                        </div>
                        <div className="form_item">
										<select style={{height: '60px'}} name="type" onChange={handleTyping}>
											<option value="0" defaultValue="0">User</option>
											<option value="1">Dealer</option>
										</select>
                            
                        </div>
            
                    </div>

                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        <div className="form_item">
                            <input type="text" name="phone" placeholder="Phone*" onChange={handleTyping}/>
                        </div>
                        <div className="form_item">
                            <input type="text" name="address" placeholder="Billing Address*" onChange={handleTyping}/>
                        </div>
                        <p className="white">
                            Your personal data will be used in mapping with the vehicles you added to the website and to manage access to your account.
                        </p>
                        <button type="submit" className="custom_btn bg_default_red text-uppercase mb-3 mt-5" disabled={loading}>Register</button>
                        <span className="new_account mb_15 white">Already registered?<Link to="/login" className="ml-2 text-red">Log in your account.</Link></span>
                        {error && <div className="alert alert-danger mt-2" role="alert">
                                {error}
                            </div>
                        }
                    </div>
                </div>
            </form>
        </div>
        </div>
        </section>
    
        </main>
        </>
    );
};

export default Register;
