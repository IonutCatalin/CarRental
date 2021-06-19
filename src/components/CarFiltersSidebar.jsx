import React, {useEffect, useState} from 'react';
import InputRange from "react-input-range";
import firebase from "../firebase";
import Select from 'react-select';

const defaultCar = {
    price: 2000,
    name: '',
    passengers: '',
    location: '',
    fuel: '',
    gearbox: '',
    model: '',
}

const CarFiltersSidebar = ({readOnly = false, car = defaultCar, onApply, onReset}) => {
    const [filters, setFilters] = useState(defaultCar);
    const [locations, setLocations] = useState([]);

    const onFilterChange = (event) => {
        setFilters({
            ...filters,
            [event.target.name]: event.target.value
        })
    };

    const onFilterSubmit = (e) => {
        e.preventDefault();

        const validFilters = {};

        for(const [key, value] of Object.entries(filters)) {
            if (value) {
                validFilters[key] = value;
            }
        }

        onApply(filters);
    };

    const onFiltersReset = () => {
        setFilters(defaultCar);
        onReset();
    }

    const onPriceChange = (value) => {
        setFilters({
                ...filters,
                price: value
            }
        );
    }

    const getLocations = async () => {
        const response = await firebase
            .firestore()
            .collection('locations')
            .get();

        const list = response.docs.map(doc => {
            return {
                value: doc.id,
                label: doc.data().name
            }});

        setLocations(list);
    };

    const customStyles = {
        control: base => ({
            ...base,
            minHeight: 50,
            color: "#fff",
            backgroundColor: "rgba(255, 255, 255, 0.04)"
        }),
        option: styles => ({
            ...styles,
            color: "#1f1b2d"
        }),
        input: styles => ({ ...styles, color: "#fff" }),
        singleValue: (styles, { data }) => ({ ...styles, color: "#fff" }),
    };

    useEffect(() => {
        if (!readOnly) {
            return getLocations();
        }
    }, [])


    return (
        <aside className="filter_sidebar sidebar_section">
            <div className="sidebar_header"
                 data-bg-gradient="linear-gradient(90deg, #0C0C0F, #292D45)"
                 style={{backgroundImage: "linear-gradient(90deg, rgb(12, 12, 15), rgb(41, 45, 69))"}}>
                <h3 className="text-white mb-0">{readOnly ? "Details" : "Filters"}</h3>
            </div>
            <div className="sb_widget">
                <form action="#">
                    <div className="mb-5">
                        <h4 className="input_title mb-4">Price</h4>
                        <InputRange
                            maxValue={2000}
                            minValue={1}
                            value={readOnly ? (car && +car.price) : filters && +filters.price}
                            onChange={value => onPriceChange(value)}
                            onChangeComplete={value => console.log(value)}
                        />
                    </div>

                    {!readOnly && <div className="form_item">
                        <h4 className="input_title">Vehicle Name</h4>
                        <input type="text" name="name" placeholder="Search..." autoComplete="off" onChange={onFilterChange} value={filters.name}/>
                    </div>}

                    {!readOnly &&
                    <div className="sb_widget car_picking aos-init aos-animate" data-aos="fade-up" data-aos-delay="100">
                        <div className="mb-4">
                            <h4 className="input_title">Pick Up Location</h4>
                            <Select
                                className="basic-single"
                                value={filters.location}
                                onChange={(value) => setFilters({...filters, location: value})}
                                options={locations}
                                isClearable={true}
                                styles={customStyles}
                            />
                        </div>
                    </div>}

                    <div className="sb_widget aos-init aos-animate" data-aos="fade-up"
                         data-aos-delay="100">
                        <h4 className="input_title">Number of passengers:</h4>
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="checkbox_input">
                                    <label htmlFor="passengers_radio1">
                                        <input type="radio"
                                               checked={readOnly ? (car && car.passengers === "2") : filters && filters.passengers === "2"}
                                               id="passengers_radio1"
                                               name="passengers"
                                               value="2"
                                               onChange={onFilterChange}
                                        /> 2
                                    </label>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="checkbox_input">
                                    <label htmlFor="passengers_radio2">
                                        <input type="radio"
                                               checked={readOnly ? (car && car.passengers === "5") : filters && filters.passengers === "5"}
                                               id="passengers_radio2"
                                               name="passengers"
                                               value="5"
                                               onChange={onFilterChange}
                                        /> 5</label>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="checkbox_input">
                                    <label htmlFor="passengers_radio3">
                                        <input type="radio"
                                               checked={readOnly ? (car && car.passengers === "4") : filters && filters.passengers === "4"}
                                               id="passengers_radio3"
                                               name="passengers"
                                               value="4"
                                               onChange={onFilterChange}
                                        /> 4</label>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="checkbox_input">
                                    <label htmlFor="passengers_radio4">
                                        <input type="radio"
                                               checked={readOnly ? (car && car.passengers === "7") : filters && filters.passengers === "7"}
                                               id="passengers_radio4"
                                               name="passengers"
                                               value="7"
                                               onChange={onFilterChange}
                                        /> 7
                                        or more</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="sb_widget aos-init aos-animate">
                        <div className="form_item">
                            <h4 className="input_title">Model type:</h4>
                            {!readOnly ? <select name="model" onChange={onFilterChange} value={filters.model}>
                                    <option disabled defaultValue value=""> Select an option </option>
                                    <option value="Sports">Sports</option>
                                    <option value="SUV">SUV</option>
                                    <option value="Minivan">Minivan</option>
                                    <option value="Truck">Truck</option>
                                    <option value="Sedan">Sedan</option>
                                    <option value="Coupe">Coupe</option>
                                    <option value="Hatchback">Hatchback</option>
                                    <option value="Convertible">Convertible</option>
                                </select>
                                :
                                <div className="text-white">{car && car.model}</div>
                            }
                        </div>

                        <div className="form_item">
                            <h4 className="input_title">Gearbox type:</h4>
                            {!readOnly ? <select name="gearbox" onChange={onFilterChange} value={filters.gearbox}>
                                    <option disabled defaultValue value=""> Select an option </option>
                                    <option value="Auto">Auto</option>
                                    <option value="Manual">Manual</option>
                                </select>
                                :
                                <div className="text-white">{car && car.gearbox}</div>
                            }
                        </div>

                        <div className="form_item">
                            <h4 className="input_title">Fuel type:</h4>
                            {!readOnly ? <select name="fuel" onChange={onFilterChange} value={filters.fuel}>
                                    <option disabled defaultValue value=""> Select an option </option>
                                    <option value="Gasoline">Gasoline</option>
                                    <option value="Electro">Electro</option>
                                    <option value="Hybrid">Hybrid</option>
                                </select>
                                :
                                <div className="text-white">{car && car.fuel}</div>
                            }
                        </div>
                    </div>

                    {!readOnly && <div className="aos-init aos-animate">
                        <button type="submit" className="custom_btn bg_default_red text-uppercase" onClick={onFilterSubmit}>Apply</button>
                        <div className="account_info_list text-center">
                            <div className="text_btn text-uppercase c-p" onClick={onFiltersReset}><span>Reset</span></div>
                        </div>
                    </div>
                    }
                </form>
            </div>
        </aside>
    )
};

export default CarFiltersSidebar;
