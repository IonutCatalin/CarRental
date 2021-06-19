export function loadUser(data) {
    return {type: '[USER] Load User', user: data};
}

export const AuthReducer = (state, {type, user}) => {
    switch (type) {
        case '[USER] Load User':
            return user;

        default:
            return state;
    }
};