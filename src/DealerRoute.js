import React from "react";
import {Redirect, Route} from "react-router-dom";
import {useAuth} from "./contexts/AuthContext";

const DealerRoute = ({ component: RouteComponent, ...rest }) => {
    const {currentUser} = useAuth();

    return (
        <Route
            {...rest}
            render={routeProps =>
                !!currentUser
                    ?
                    currentUser.type === 1
                        ?
                        <RouteComponent {...routeProps} />
                        :
                        <Redirect to="/" />
                    :
                    <Redirect to="/login" />
            }
        />
    );
};

export default DealerRoute;
