import React, {useState} from "react";
import {useAuth} from "../contexts/AuthContext";

const initialReview = {body: '', stars: 5};

const CarAddReview = ({onAdd}) => {
    const {currentUser} = useAuth();
    const [newReview, setNewReview] = useState(initialReview);

    const onNewReviewChange = (e) => {
        setNewReview({
            ...newReview,
            [e.target.name]: e.target.value
        });
    };

    const onReviewSubmit = (e) => {
        e.preventDefault();

        const payload = {
            author: currentUser.displayName,
            authorId: currentUser.uid,
            body: newReview.body,
            rating: newReview.stars
        };

        onAdd(payload);
        setNewReview(initialReview);
    };

    return (
        <div className="mb-5">
            <div className="d-flex justify-content-between mb-4">
                <h4 className="text-white">Add review</h4>

                <div className="form_item">
                    <select name="stars" onChange={onNewReviewChange} value={newReview.stars} style={{height: '40px'}}>
                        <option value="5">5 stars</option>
                        <option value="4">4 stars</option>
                        <option value="3">3 stars</option>
                        <option value="2">2 stars</option>
                        <option value="1">1 star</option>
                    </select>
                </div>

            </div>

            <form action="#" onSubmit={onReviewSubmit}>
                <div className="form_item">
                    <textarea placeholder="Add your review..." name="body" onChange={onNewReviewChange} value={newReview.body}/>
                </div>

                <button type="submit" className={`custom_btn bg_default_red text-uppercase ${!newReview.body ? 'disabled' : ''}`}>Submit</button>
            </form>

        </div>
    )
};

export default CarAddReview;
