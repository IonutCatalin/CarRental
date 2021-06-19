import './App.css';
import "./css/animate.css";
import "./css/fontawesome.css";
import "./css/bootstrap.min.css";
import "./css/style.css";
import "./scss/style.scss";
import 'react-input-range/lib/css/index.css';
import "react-datetime/css/react-datetime.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from "./PrivateRoute";
import {AuthProvider} from "./contexts/AuthContext";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Profile from './pages/Profile';
import Manage from './pages/Manage';
import ManageCar from './pages/ManageCar';
import ManageAddCar from './pages/ManageAddCar';
import Cars from './pages/Cars';
import CarSingle from './pages/CarSingle';
import Rent from './pages/Rent';
import RentHistory from './pages/RentHistory';
import Header from './components/Header';
import Footer from './components/Footer';
import {ReservationProvider} from "./contexts/ReservationContext";
import DealerRoute from "./DealerRoute";

function App() {
    return (
        <Router>
            <AuthProvider>
                <Header/>
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route path="/register" component={Register}/>
                    <Route path="/login" component={Login}/>
                    <PrivateRoute path="/profile" component={Profile} />
                    <DealerRoute path="/manage/add" component={ManageAddCar} />
                    <DealerRoute path="/manage/:carId" component={ManageCar} />
                    <DealerRoute path="/manage" component={Manage} />
                    <PrivateRoute path="/history/:historyId" component={RentHistory}/>
                    <Route exact path="/cars" component={Cars}/>
                    <ReservationProvider>
                        <Route exact path="/rent" component={Rent}/>
                        <Route exact path="/car/:carId" component={CarSingle}/>
                    </ReservationProvider>
                </Switch>
                <Footer/>
            </AuthProvider>
        </Router>
    );
}

export default App;
