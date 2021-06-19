import React from "react";

const CarReview = ({review}) => {
    return (
        <div className="testimonial_item clearfix">
            <div className="admin_info_wrap clearfix">
                <div className="admin_content">
                    <h4 className="admin_name text-white">{review.author}</h4>
                    <ul className="rating_star ul_li clearfix">
                        {[...Array(parseInt(review.rating))].map((_, index) => <li key={index} className="active"><i className="fas fa-star"></i></li>)}
                    </ul>
                </div>
            </div>
            <p className="mb-0 aos-init aos-animate text-white">
                {review.body}
            </p>
        </div>
    )
};

export default CarReview;
