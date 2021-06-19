import firebase from "../firebase";

export const getFirebaseTime = (seconds, milliseconds) => {
    const time = new firebase.firestore.Timestamp(seconds, milliseconds);

    return time.toDate();
}
