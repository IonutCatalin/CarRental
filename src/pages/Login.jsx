import React, {useState} from "react";
import {useAuth} from "../contexts/AuthContext";
import {Link, useHistory, Redirect} from "react-router-dom";
import firebase from "../firebase";
import loginBanner from '../images/10751.svg';

const Login = () => {
    const {currentUser} = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [credentials, setCredentials] = useState({email: '', password: ''});
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setError("");
            setLoading(true);
            await firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password);

            history.push("/");

        } catch (error) {
            setError(error.message);
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
                    <div className="page_title_area has_overlay d-flex align-items-center clearfix"
                         data-bg-image="assets/images/breadcrumb/bg_09.jpg">
                        <div className="overlay"></div>
                        <div className="container" data-aos="fade-up" data-aos-delay="100">
                            <h1 className="page_title text-white mb-0">Login</h1>
                        </div>
                    </div>
                </section>

                <section className="register_section sec_ptb_100 clearfix">
                    <div className="container">
                        <div className="register_card mb_60" data-bg-color="##F2F2F2" data-aos="fade-up"
                             data-aos-delay="100">
                            <div className="row align-items-center">
                                <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                                    <div className="reg_image" data-aos="fade-up" data-aos-delay="300">
                                        <img src={loginBanner} alt="image_not_found"/>
                                    </div>
                                </div>

                                <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                                    <div className="reg_form" data-aos="fade-up" data-aos-delay="500">
                                        <div className="section_title mb_30 text-center">
                                            <h2 className="title_text mb-0" data-aos="fade-up" data-aos-delay="300">
                                                <span className="white">Log in</span>
                                            </h2>
                                        </div>
                                        <form action="#" onSubmit={handleSubmit}>
                                            <div className="form_item">
                                                <input type="email" name="email" placeholder="Your email"
                                                       onChange={handleTyping}/>
                                            </div>
                                            <div className="form_item">
                                                <input type="password" name="password" placeholder="Password"
                                                       onChange={handleTyping}/>
                                            </div>
                                            <button type="submit" className="custom_btn bg_default_red text-uppercase"
                                                    disabled={loading}>Login
                                            </button>

                                        </form>
                                        <span className="new_account mb_15 white">Not registered yet?<Link to="/register"
                                                                                                     className="ml-2 text-red">Create an Account.</Link></span>
                                        {error && <div className="alert alert-danger mt-2" role="alert">
                                            {error}
                                        </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


            </main>
        </>
    );
};

export default Login;
