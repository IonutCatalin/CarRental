import React from 'react';
import {Link} from "react-router-dom";

const CardCard = ({car}) => {
    return (
        <div className="feature_vehicle_item aos-init aos-animate"><h3 className="item_title mb-0">
            <Link to={`/car/${car.uid}`}>{car.name}</Link>
        </h3>
            <div className="item_image position-relative">
                <Link className="image_wrap" to={`/car/${car.uid}`}>
                    <img src={car.thumbnail} alt="image_not_found"/>
                </Link><span
                className="item_price bg_default_blue">${car.price}/Day</span></div>
            <ul className="info_list ul_li_center clearfix">
                <li>{car.model}</li>
                <li>{car.gearbox}</li>
                <li>{car.passengers} Passengers</li>
                <li>{car.fuel}</li>
            </ul>
        </div>
    )
};

export default CardCard;
