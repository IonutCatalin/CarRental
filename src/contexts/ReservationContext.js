import React, {useContext, useReducer} from "react";
import {ReservationReducer} from "../reducers/ReservationReducer";

export const ReservationContext = React.createContext();

export function useReservation() {
    return useContext(ReservationContext)
}

export const ReservationProvider = ({children}) => {
    const [reservation, reservationDispatch] = useReducer(ReservationReducer, null);

    return (
        <ReservationContext.Provider value={{reservation, reservationDispatch}}>
            {children}
        </ReservationContext.Provider>
    );
}
