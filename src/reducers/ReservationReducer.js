export function setReservationAction(reservation) {
    return {type: 'SET_RESERVATION', data: reservation};
}

export const ReservationReducer = (state, {type, data}) => {
    switch (type) {
        case 'SET_RESERVATION':
            return data;

        default:
            return state;
    }
};
