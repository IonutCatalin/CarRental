import React from 'react';
import CarFiltersSidebar from "./CarFiltersSidebar";


const CarsFilters = ({onApply, onReset}) => {
    const onReceivedFilters = (filters) => {
      onApply(filters);
    };

    const onReceivedReset = () => {
        onReset();
    };

    return (
        <div className="col-lg-4 col-md-6 col-sm-8 col-xs-12">
            <CarFiltersSidebar onApply={onReceivedFilters} onReset={onReceivedReset}/>
        </div>
    )
};

export default CarsFilters;
