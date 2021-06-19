import React, {useEffect, useState} from 'react';
import firebase from "../firebase";
import isEqual from 'lodash/isEqual';
import {useAuth} from '../contexts/AuthContext';
import {loadUser} from "../reducers/AuthReducer";

const ProfileInfo = () => {
    const {currentUser, userDispatch} = useAuth();
    const [error, setError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [hasUpdatedUser, setHasUpdatedUser] = useState(false);
    const [updatedUser, setUpdatedUser] = useState({displayName: '', email: '', type: 0, phone: '', address: ''});
    const [updatedPassword, setUpdatedPassword] = useState({newPassword: '', confirmPassword: ''});

    const handleTyping = (e) => {
        setUpdatedUser({
            ...updatedUser,
            [e.target.name]: e.target.value
        })
    }

    const handlePasswordTyping = (e) => {
        setUpdatedPassword({
            ...updatedPassword,
            [e.target.name]: e.target.value
        })
    }

    const updatePassword = async (event) => {
        event.persist();
        event.preventDefault();

        const {newPassword, confirmPassword} = updatedPassword;

        if ((!newPassword || !confirmPassword) || newPassword !== confirmPassword) {
           return setPasswordError("Passwords do not match.");
        }

        try {
            setPasswordError("");

            await firebase.auth().currentUser.updatePassword(newPassword);

            event.target.reset();
        } catch(error) {
            setPasswordError(error.message);
        }
    }

    const updateDatabaseCredential = async (credential, value = null) => {
        await firebase
            .firestore()
            .collection('users')
            .doc(currentUser.uid)
            .set({
                [credential]: value ? value : updatedUser[credential]
            }, {merge: true});
    };

    const updateProfile = (e) => {
        e.persist();
        e.preventDefault();

        const {displayName, email, phone, address} = updatedUser;

        if (!displayName || !email || !phone ||!address) {
            return setError("Required credentials missing.")
        }

        if (displayName !== currentUser.displayName) {
            firebase.auth().currentUser.updateProfile({displayName})
                .then(() => updateDatabaseCredential('displayName'));
        }

        if (email !== currentUser.email) {
            firebase.auth().currentUser.updateEmail(email)
                .then(() => updateDatabaseCredential('email'));
        }

        if (phone !== currentUser.phone) {
            updateDatabaseCredential('phone');
        }

        if (address !== currentUser.address) {
            updateDatabaseCredential('address');
        }

        setHasUpdatedUser(true);
        setError("");
    };

    const isUpdateButtonDisabled = () => isEqual(currentUser, updatedUser);

    const isChangePasswordButtonDisabled = () => !updatedPassword.newPassword || !updatedPassword.confirmPassword;

    useEffect(() => setUpdatedUser(currentUser), [currentUser]);

    useEffect(() => {
        if (hasUpdatedUser) {
            userDispatch(loadUser(updatedUser))
            setHasUpdatedUser(false);
        }
    }, [hasUpdatedUser]);

    return (
        <>
            {currentUser && <div id="admin_tab" className="tab-pane active">
                <div className="account_info_list">
                    <h3 className="list_title mb_30" style={{color: "#EA001E"}}>Account:</h3>
                    <form action="#" onSubmit={updateProfile}>
                        <ul className="ul_li_block clearfix">
                            <li className="form_item">
                                <label htmlFor="name">Name:</label>
                                <input type="text" id="name" name="displayName" placeholder="Your Name"
                                       onChange={handleTyping}
                                       value={updatedUser.displayName}/>
                            </li>
                            <li className="form_item">
                                <label htmlFor="email">E-mail:</label>
                                <input type="text" id="email" name="email" placeholder="Your e-mail"
                                       onChange={handleTyping}
                                       value={updatedUser.email}/>
                            </li>
                            <li className="form_item">
                                <label htmlFor="type">Type:</label>
                                <select style={{height: '60px'}} name="type" value={currentUser.type} disabled className="disabled">
                                    <option defaultValue>{currentUser.type === 0 ? 'User' : 'Dealer'}</option>
                                </select>
                            </li>
                            <li className="form_item">
                                <label htmlFor="phone">Phone:</label>
                                <input type="text" id="phone" name="phone" placeholder="Your phone"
                                       onChange={handleTyping}
                                       value={updatedUser.phone}/>
                            </li>
                            <li className="form_item">
                                <label htmlFor="address">Address:</label>
                                <input type="text" id="address" name="address" placeholder="Your address"
                                       onChange={handleTyping}
                                       value={updatedUser.address}/>
                            </li>
                        </ul>
                        <button type="submit" className={`mt-2 custom_btn bg_default_red text-uppercase ${isUpdateButtonDisabled() ? 'disabled' : ''}`}>Update
                        </button>

                        {error && <div className="alert alert-danger mt-2" role="alert">
                            {error}
                        </div>
                        }
                    </form>
                </div>

                <div className="account_info_list">
                    <h3 className="list_title mb_30" style={{color: "#EA001E"}}>Change password:</h3>
                    <form action="#" onSubmit={updatePassword}>
                        <ul className="ul_li_block clearfix">
                            <li className="form_item">
                                <label htmlFor="newPassword">New password:</label>
                                <input type="password" id="newPassword" name="newPassword" placeholder="New password" onChange={handlePasswordTyping}/>
                            </li>
                            <li className="form_item">
                                <label htmlFor="confirmPassword">Confirm password:</label>
                                <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm password" onChange={handlePasswordTyping}/>
                            </li>
                            <button type="submit" className={`mt-2 custom_btn bg_default_red text-uppercase ${isChangePasswordButtonDisabled() ? 'disabled' : ''}`}>Change
                            </button>
                        </ul>

                        {passwordError && <div className="alert alert-danger mt-2" role="alert">
                            {passwordError}
                        </div>
                        }
                    </form>
                </div>
            </div>
            }
        </>
    );
}

export default ProfileInfo;
