import React, {useEffect, useState} from "react";
import firebase from "../firebase";
import Select from "react-select";
import DropzoneComponent from "../components/Dropzone";
import LoaderComponent from "../components/LoaderComponent";
import {useHistory} from "react-router-dom";
import {useAuth} from "../contexts/AuthContext";

const defaultCar = {
    price: 1,
    name: '',
    passengers: '',
    locations: [],
    fuel: '',
    gearbox: '',
    model: '',
    gallery: [],
    thumbnail: '',
    description: ''
}

const ManageAddCar = () => {
    const [car, setCar] = useState(defaultCar);
    const [loading, setLoading] = useState(false);
    const [locations, setLocations] = useState([]);
    const [uploadedGallery, setUploadedGallery] = useState([]);
    const [uploadedThumbnail, setUploadedThumbnail] = useState(null);
    const {currentUser} = useAuth();
    const history = useHistory();

    const customStyles = {
        control: base => ({
            ...base,
            minHeight: 70,
            color: "#1f1b2d",
            backgroundColor: "rgba(255, 255, 255, 0.04)"
        }),
        option: styles => ({
            ...styles,
            color: "#1f1b2d"
        })
    };

    const getLocations = async () => {
        const response = await firebase
            .firestore()
            .collection('locations')
            .get();

        const list = response.docs.map(doc => {
            return {
                value: doc.id,
                label: doc.data() && doc.data().name
            }
        });

        setLocations(list);
    };

    const onCarChange = (e) => {
        setCar({
            ...car,
            [e.target.name]: e.target.value
        })
    }

    const onLocationChange = (values) => {
        setCar({
            ...car,
            locations: values
        })
    };

    const onThumbnailFileDrop = (files) => {
        setCar({
            ...car,
            thumbnail: files[0]
        });
        setUploadedThumbnail(files[0]);
    }

    const onThumbnailFileRemove = (file) => {
        setCar({
            ...car,
            thumbnail: ''
        });
        setUploadedThumbnail(null);
    }

    const onGalleryFilesDrop = (files) => {
        if (!files[0] instanceof File) {
            return alert('Upload a valid file!');
        }

        const previews = files.map(file => file.preview);

        setCar({
            ...car,
            gallery: [...car.gallery, ...previews]
        })

        setUploadedGallery([...uploadedGallery, ...files]);
    }

    const onGalleryFileRemove = (file) => {
        const files = [...car.gallery];
        const uploadedFiles = [...uploadedGallery];

        const fileIndex = files.findIndex(single => single === file);
        const uploadedFileIndex = uploadedFiles.findIndex(single => single.preview === file);

        files.splice(fileIndex, 1);

        setCar({
            ...car,
            gallery: files
        })

        if (uploadedFileIndex !== -1) {
            uploadedFiles.splice(uploadedFileIndex, 1);
            setUploadedGallery(uploadedFiles);
        }
    }

    async function uploadImageAsPromise(imageFile) {
        return new Promise(function (resolve, reject) {
            const storageRef = firebase.storage().ref(`images/${imageFile.name}`);
            const task = storageRef.put(imageFile);

            task.then((snapshot) => {
                snapshot.ref.getDownloadURL().then(url => {
                    resolve(url);
                });
            });
        });
    }

    const uploadThumbnailAndGetUrl = async () => {
        return await uploadImageAsPromise(uploadedThumbnail);
    }

    const uploadGalleryAndGetUrls = async () => {
        return await Promise.all(uploadedGallery.map(file => uploadImageAsPromise(file)));
    };

    const getGalleryWithoutBlobPreviews = () => {
        return car.gallery.filter((image) => !image.startsWith('blob'));
    };

    const onCarCreate = async () => {
        setLoading(true);

        const galleryUrls = await uploadGalleryAndGetUrls();
        const thumbnailUrl = uploadedThumbnail ? await uploadThumbnailAndGetUrl() : car.thumbnail;
        const initialGallery = getGalleryWithoutBlobPreviews();
        const formattedLocations = car.locations.map((location) => location.value);

        const payload = {
            ...car,
            locations: formattedLocations,
            thumbnail: thumbnailUrl,
            gallery: [...initialGallery, ...galleryUrls],
            ownerId: currentUser.uid,
            rating: "5"
        };

        await firebase
            .firestore()
            .collection('cars')
            .add(payload);

        setUploadedThumbnail(null);
        setUploadedGallery([]);
        setLoading(false);

        history.push('/manage');
    };

    const isSubmitButtonDisabled = () => {
        return !car.name || !car.locations.length || !car.fuel
            || !car.model || !car.gearbox || !car.passengers
            || !car.thumbnail || !car.gallery.length
            || !car.price || !car.description
            || loading;
    }

    useEffect(() => {
        window.scrollTo(0, 0);

        getLocations();
    }, []);

    return (
        <>
            <div className="container mt-5 mb-md-4 py-5">
                <div className="row">
                    <div className="col-lg-8">
                        <div className="mb-4">
                            <h1 className="h2 text-light mb-0">Add vehicle</h1>
                            <div className="progress progress-light d-lg-none mb-4" style={{height: ".25rem"}}>
                                <div className="progress-bar bg-success" role="progressbar" style={{width: "80%"}}
                                     aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        </div>

                        <section className="card card-light card-body border-0 shadow-sm p-4 mb-4" id="basic-info">
                            <h2 className="h4 text-light mb-4"><i
                                className="fi-info-circle text-primary fs-5 mt-n1 me-2"></i>Basic info</h2>
                            <div className="mb-3 form_item">
                                <label className="form-label text-light" htmlFor="sc-title">Title <span
                                    className="text-danger">*</span></label>
                                <input className="" type="text" id="sc-title"
                                       name="name"
                                       placeholder="Title for your vehicle" value={car.name}
                                       onChange={onCarChange}
                                       required=""/>
                            </div>
                            <div className="mb-3 form_item">
                                <label className="form-label text-light" htmlFor="sc-title">Locations <span
                                    className="text-danger">*</span></label>
                                <Select
                                    value={car.locations}
                                    isMulti
                                    name="locations"
                                    onChange={onLocationChange}
                                    options={locations}
                                    isClearable={true}
                                    styles={customStyles}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                />
                            </div>
                        </section>

                        <section className="card card-light card-body border-0 shadow-sm p-4 mb-4" id="price">
                            <h2 className="h4 text-light mb-4"><i className="fi-cash text-primary fs-5 mt-n1 me-2"></i>Price
                            </h2>
                            <label className="form-label text-light" htmlFor="sc-price">Price <span
                                className="text-danger">*</span></label>
                            <div className="d-sm-flex mb-2 form_item">
                                <select className="w-25 me-2 mb-2" defaultValue="usd">
                                    <option disabled defaultValue value="usd"> $</option>
                                </select>
                                <input className="w-100 me-2 mb-2" type="number" name="price"
                                       id="sc-price" min="1" max="2000" step="50" value={car.price} required=""
                                       onChange={onCarChange}/>
                            </div>

                        </section>

                        <section className="card card-light card-body border-0 shadow-sm p-4 mb-4" id="vehicle-info">
                            <h2 className="h4 text-light mb-4"><i className="fi-car text-primary fs-5 mt-n1 me-2"></i>Vehicle
                                information</h2>
                            <div className="row pb-2">
                                <div className="col-sm-6 mb-3 form_item">
                                    <label className="form-label text-light" htmlFor="sc-make">Model<span
                                        className="text-danger">*</span></label>
                                    <select className="" name="model" id="sc-make" value={car.model}
                                            onChange={onCarChange}>
                                        <option disabled defaultValue value=""> Select an option</option>
                                        <option value="Sports">Sports</option>
                                        <option value="SUV">SUV</option>
                                        <option value="Minivan">Minivan</option>
                                        <option value="Truck">Truck</option>
                                        <option value="Sedan">Sedan</option>
                                        <option value="Coupe">Coupe</option>
                                        <option value="Hatchback">Hatchback</option>
                                        <option value="Convertible">Convertible</option>
                                    </select>
                                </div>
                                <div className="col-sm-6 mb-3 form_item">
                                    <label className="form-label text-light" htmlFor="sc-model">Gearbox <span
                                        className="text-danger">*</span></label>
                                    <select className="" id="sc-model" name="gearbox" value={car.gearbox}
                                            onChange={onCarChange}>
                                        <option disabled defaultValue value=""> Select an option</option>
                                        <option value="Auto">Auto</option>
                                        <option value="Manual">Manual</option>
                                    </select>
                                </div>
                                <div className="col-sm-6 mb-3 form_item">
                                    <label className="form-label text-light" htmlFor="sc-year">Fuel <span
                                        className="text-danger">*</span></label>
                                    <select className="" id="sc-year" name="fuel" value={car.fuel}
                                            onChange={onCarChange}>
                                        <option disabled defaultValue value=""> Select an option</option>
                                        <option value="Gasoline">Gasoline</option>
                                        <option value="Electro">Electro</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>
                                </div>

                                <div className="col-sm-6 mb-3 form_item">
                                    <label className="form-label text-light" htmlFor="sc-condition">Passengers: <span
                                        className="text-danger">*</span></label>
                                    <select className="" id="sc-condition" name="passengers" required=""
                                            value={car.passengers} onChange={onCarChange}>
                                        <option disabled defaultValue value=""> Select an option</option>
                                        <option value="2">2</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="7">7 or more</option>
                                    </select>
                                </div>
                            </div>
                            <div className="border-top border-light mt-2 pt-4 form_item">
                                <label className="form-label text-light" htmlFor="sc-description">Description </label>
                                <textarea className="" id="sc-description" rows="5" name="description"
                                          placeholder="Describe your vehicle" value={car.description}
                                          onChange={onCarChange}/>
                            </div>
                        </section>

                        <section className="card card-light card-body shadow-sm p-4 mb-4" id="photos">
                            <h2 className="h4 text-light mb-4"><i className="fi-image text-primary fs-5 mt-n1 me-2"></i>Thumbnail
                            </h2>
                            <DropzoneComponent files={[car.thumbnail]} onDropped={onThumbnailFileDrop}
                                               onRemoved={onThumbnailFileRemove}/>
                        </section>

                        <section className="card card-light card-body shadow-sm p-4 mb-4" id="photos">
                            <h2 className="h4 text-light mb-4"><i className="fi-image text-primary fs-5 mt-n1 me-2"></i>Gallery
                            </h2>
                            <DropzoneComponent files={car.gallery} isMultiple={true} onDropped={onGalleryFilesDrop}
                                               onRemoved={onGalleryFileRemove}/>
                        </section>


                        <div className="d-sm-flex justify-content-between pt-2">
                            <div className={`custom_btn bg_default_red text-uppercase c-p ${isSubmitButtonDisabled() ? 'disabled' : ''}`}
                                 onClick={onCarCreate}>Create {loading && <LoaderComponent/>}</div>
                        </div>
                    </div>


                </div>
            </div>
        </>
    )
};

export default ManageAddCar;
