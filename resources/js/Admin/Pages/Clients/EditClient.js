import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useParams } from "react-router-dom";
import Sidebar from "../../Layouts/Sidebar";
import { useNavigate } from "react-router-dom";
import {
    GoogleMap,
    LoadScript,
    InfoWindow,
    Marker,
    Autocomplete,
} from "@react-google-maps/api";
import Geocode from "react-geocode";

export default function EditClient() {

    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [invoiceName, setInvoiceName] = useState("");
    const [phone, setPhone] = useState("");

    const [city, setCity] = useState("");
    const [streetNumber, setStreetNumber] = useState("");
    const [floor, setFloor] = useState("");
    const [Apt, setApt] = useState("");
    const [enterance, setEnterance] = useState("");
    const [zip, setZip] = useState("");
    const [dob, setDob] = useState("");
    const [passcode, setPassCode] = useState("");
    const [lng, setLng] = useState("");
    const [color, setColor] = useState("");
    const [status, setStatus] = useState("");
    const [errors, setErrors] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [extra, setExtra] = useState([{ "email": "", "name": "", "phone": "" }]);
    let allPhones = [];
    const alert = useAlert();
    const params = useParams();
    const navigate = useNavigate();

    const [libraries] = useState(["places", "geometry"]);
    const [latitude, setLatitude] = useState(-33.865143);
    const [longitude, setLongitude] = useState(151.2099);
    const [address, setAddress] = useState("");
    const [place, setPlace] = useState();
    const [cjob, setCjob] = useState();
    Geocode.setApiKey("AIzaSyBva3Ymax7XLY17ytw_rqRHggZmqegMBuM");
    const containerStyle = {
        width: "100%",
        height: "300px",
    };
    const center = {
        lat: latitude,
        lng: longitude,
    };

    const handlePlaceChanged = () => {
        if (place) {

            setCity(place.getPlace().vicinity);
            setAddress(place.getPlace().formatted_address);
            setLatitude(place.getPlace().geometry.location.lat());
            setLongitude(place.getPlace().geometry.location.lng());

        }
    };

    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };

    const handleUpdate = (e) => {
       e.preventDefault();
        {/* Job Data*/ }
        let to = 0;
        let taxper = 17;
        if (cjob == 1) {

            for (let t in formValues) {

                if (formValues[t].service == '' || formValues[t].service == 0) {
                    alert.error("One of the service is not selected");
                    return false;
                }

                let ot = document.querySelector('#other_title' + t);

                if (formValues[t].service == '10' && ot != undefined) {
                    if (formValues[t].other_title == '') { alert.error('Other title cannot be blank'); return false; }
                    formValues[t].other_title = document.querySelector('#other_title' + t).value;
                }

                if (formValues[t].jobHours == '') {
                    alert.error("One of the job hours value is missing");
                    return false;
                }
                (!formValues[t].type) ? formValues[t].type = 'fixed' : '';
                if (formValues[t].type == "hourly") {

                    if (formValues[t].rateperhour == '') {
                        alert.error("One of the rate per hour value is missing");
                        return false;
                    }
                    formValues[t].totalamount = parseInt(formValues[t].jobHours * formValues[t].rateperhour);
                    to += parseInt(formValues[t].totalamount);


                } else {

                    if (formValues[t].fixed_price == '') {
                        alert.error("One of the job price is missing");
                        return false;
                    }
                    formValues[t].totalamount = parseInt(formValues[t].fixed_price);
                    to += parseInt(formValues[t].fixed_price);
                }

                if (formValues[t].frequency == '' || formValues[t].frequency == 0) {
                    alert.error("One of the frequency is not selected");
                    return false;
                }
                if (formValues[t].days.length > 0 && (formValues[t].days.length > formValues[t].cycle) && formValues[t].cycle != '0') {
                    alert.error("One of the frequency days are invalid");
                    return false;
                }

                if (!formValues[t].worker || formValues[t].worker == '' || formValues[t].worker == 0) {
                    alert.error("One of the worker is not selected");
                    return false;
                }
                if (!formValues[t].shift || formValues[t].shift == '') {
                    alert.error("One of the shift is not selected");
                    return false;
                }

            }
        }


        let tax = (taxper / 100) * to;
        const jobdata = {
            status: 'sent',
            subtotal: to,
            total: to + tax,
            services: JSON.stringify(formValues),
        }

        {/*Client data */ }
        var phoneClc = '';
        var phones = document.querySelectorAll('.pphone');
        phones.forEach((p, i) => {
            phoneClc += p.value + ',';
        });
        phoneClc = phoneClc.replace(/,\s*$/, "");
        const data = {
            firstname: firstname,
            lastname: lastname,
            invoicename: invoiceName,
            city: city,
            street_n_no: streetNumber,
            floor: floor,
            apt_no: Apt,
            entrence_code: enterance,
            zipcode: zip,
            lng: (lng) ? lng : 'heb',
            dob: dob,
            passcode: passcode,
            geo_address: address,
            latitude: latitude,
            longitude: longitude,
            color: (!color) ? '#fff' : color,
            email: email,
            phone: phoneClc,
            password: passcode,
            payment_method: paymentMethod,
            extra:JSON.stringify(extra),
            status: (!status) ? 0 : parseInt(status),
        };

        axios
            .put(`/api/admin/clients/${params.id}`, { data: data, jobdata: (cjob == 1) ? jobdata : {} }, { headers })
            .then((response) => {
                if (response.data.errors) {
                    setErrors(response.data.errors);
                } else {
                    alert.success("Client has been updated successfully");
                    setTimeout(() => {
                        navigate('/admin/clients');
                    }, 1000);
                }
            });
    };

    const getClient = () => {
        axios
            .get(`/api/admin/clients/${params.id}/edit`, { headers })
            .then((response) => {

                setFirstName(response.data.client.firstname);
                setLastName(response.data.client.lastname);
                setEmail(response.data.client.email);
                setPhone(response.data.client.phone);
                setPassCode(response.data.client.passcode);
                setCity(response.data.client.city);
                setFloor(response.data.client.floor);
                setApt(response.data.client.apt_no);
                setDob(response.data.client.dob);
                setEnterance(response.data.client.entrence_code);
                setLng(response.data.client.lng);
                handleServiceLng(response.data.client.lng);
                setColor(response.data.client.color);
                setInvoiceName(response.data.client.invoicename);
                setStreetNumber(response.data.client.street_n_no);
                setZip(response.data.client.zipcode);
                setStatus(response.data.client.status);
                setAddress(response.data.client.geo_address);
                setPaymentMethod(response.data.client.payment_method);
                (response.data.client.extra != null) ?
                setExtra(JSON.parse(response.data.client.extra)):
                setExtra([{"email":"","name":"","phone":""}]);
                if (response.data.client.color) {
                    let clr = document.querySelectorAll('input[name="swatch_demo"]');
                    clr.forEach((e, i) => {
                        e.getAttribute('color') == response.data.client.color
                            ? e.checked = true
                            : ''
                    })
                }

            });
    };
    useEffect(() => {
        getClient();

    }, []);

    const addPhone = (e) => {
        e.preventDefault();
        var cont = document.querySelectorAll('.phone')[0].firstChild.innerHTML;
        var htm = "<div class='form-group'>" + cont + "</div>"
        document.querySelector('.phone').innerHTML += (htm);
    }

    /*  Job Add */
    const [type, setType] = useState();
    const [formValues, setFormValues] = useState([{
        service: "",
        name: "",
        type: "",
        freq_name: "",
        frequency: "",
        fixed_price: "",
        jobHours: "",
        rateperhour: '',
        other_title: '',
        totalamount: '',
        template: '',
        cycle: '',
        period: '',

    }])
    const [AllClients, setAllClients] = useState([]);
    const [AllServices, setAllServices] = useState([]);
    const [AllFreq, setAllFreq] = useState([]);
    const [worker, setWorkers] = useState([]);
    let handleChange = (i, e) => {

        let newFormValues = [...formValues];

        var h = e.target.parentNode.parentNode.childNodes[1].childNodes[0].value;
        var rh = e.target.parentNode.parentNode.childNodes[2].childNodes[0].value;
        if (rh != '' && h != '')
            e.target.parentNode.parentNode.childNodes[3].childNodes[0].setAttribute('value', h * rh);

        newFormValues[i][e.target.name] = e.target.value;
        if (e.target.name == 'service') {
            newFormValues[i]['name'] = e.target.options[e.target.selectedIndex].getAttribute('name');
            newFormValues[i]['template'] = e.target.options[e.target.selectedIndex].getAttribute('template');
        }
        if (e.target.name == 'frequency') {
            newFormValues[i]['freq_name'] = e.target.options[e.target.selectedIndex].getAttribute('name');
            newFormValues[i]['cycle'] = e.target.options[e.target.selectedIndex].getAttribute('cycle');
            newFormValues[i]['period'] = e.target.options[e.target.selectedIndex].getAttribute('period');
        }
        if (e.target.name == 'worker') {
            newFormValues[i]['woker_name'] = e.target.options[e.target.selectedIndex].getAttribute('name');
        }
        if (e.target.name == 'days') {

            var result = [];
            var options = e.target.options;
            var opt;

            for (var k = 0, iLen = options.length; k < iLen; k++) {
                opt = options[k];

                if (opt.selected) {
                    result.push(opt.value);
                }
            }
            if (result.length > newFormValues[i]['cycle'] && newFormValues[i]['cycle'] != 0) {
                window.alert('You can select at most ' + newFormValues[i]['cycle'] + ' day(s) for this frequency');
            } else {
                newFormValues[i]['days'] = result;
            }

        }
        if (e.target.name == 'shift') {

            var result = '';
            var sAr = [];
            var options = e.target.options;
            var opt;

            for (var k = 0, iLen = options.length; k < iLen; k++) {
                opt = options[k];
                if (opt.selected) {
                    sAr.push(opt.value);
                    result += opt.value + ', '
                }
            }
            newFormValues[i]['shift_ar'] = sAr;
            newFormValues[i]['shift'] = (result.replace(/,\s*$/, ""));
        }

        setFormValues(newFormValues);
    }
    let addFormFields = () => {
        setFormValues([...formValues, {
            service: "",
            name: "",
            type: "",
            freq_name: "",
            frequency: "",
            fixed_price: "",
            jobHours: "",
            rateperhour: '',
            other_title: '',
            totalamount: '',
            template: '',
            cycle: '',
            period: '',
        }])
    }

    let removeFormFields = (i) => {
        let newFormValues = [...formValues];
        newFormValues.splice(i, 1);
        setFormValues(newFormValues)
    }

    const getClients = () => {
        axios
            .get('/api/admin/all-clients', { headers })
            .then((res) => {
                setAllClients(res.data.clients);
            })

    }
    const getServices = (lng) => {
        axios
            .post('/api/admin/all-services', { lng }, { headers })
            .then((res) => {
                setAllServices(res.data.services);
            })
    }
    const getFrequency = (lng) => {
        axios
            .post('/api/admin/all-service-schedule', { lng }, { headers })
            .then((res) => {
                setAllFreq(res.data.schedules);
            })
    }

    const handleServiceLng = (lng) => {
        getServices(lng);
        getFrequency(lng);
    }

    const getWorkers = () => {
        axios
            .get(`/api/admin/all-workers`, { headers })
            .then((res) => {
                if (res.data.workers.length > 0) {
                    setWorkers(res.data.workers);
                } else {
                    setWorkers([]);
                }
            });
    }

    useEffect(() => {
        getClients();
        handleServiceLng('heb');
        getWorkers();

    }, []);

    const cData = AllClients.map((c, i) => {
        return { value: c.id, label: (c.firstname + ' ' + c.lastname) };
    });

    const handleType = (e) => {

        let fixed_field = e.target.parentNode.nextSibling.nextElementSibling;
        let per_hour_field = e.target.parentNode.nextSibling.nextElementSibling.nextElementSibling;

        console.log(fixed_field);
        console.log(per_hour_field);

        if (e.target.value == 'hourly') {
            fixed_field.style.display = 'none';
            per_hour_field.style.display = 'block';
        } else {
            fixed_field.style.display = 'block';
            per_hour_field.style.display = 'none';

        }
    }
    const slot = [
        { value: 'full day- 8am-16pm', text: 'full day- 8am-16pm' },
        { value: 'morning1 - 8am-10am', text: 'morning1 - 8am-10am' },
        { value: 'morning 2 - 10am-12pm', text: 'morning 2 - 10am-12pm' },
        { value: 'morning- 08am-12pm', text: 'morning- 08am-12pm' },
        { value: 'noon1 -12pm-14pm', text: 'noon1 -12pm-14pm' },
        { value: 'noon2 14pm-16pm', text: 'noon2 14pm-16pm' },
        { value: 'noon 12pm-16pm', text: 'noon 12pm-16pm' },
        { value: 'af1 16pm-18pm', text: 'af1 16pm-18pm' },
        { value: 'af2 18pm-20pm', text: 'af2 18pm-20pm' },
        { value: 'afternoon 16pm-20pm', text: 'afternoon 16pm-20pm' },
        { value: 'ev1 20pm-22pm', text: 'ev1 20pm-22pm' },
        { value: 'ev2 22pm-24pm', text: 'ev2 22pm-24pm' },
        { value: 'evening 20pm-24am', text: 'evening 20pm-24am' }
    ];

    const handleOther = (e) => {

        let el = e.target.parentNode.lastChild;
        if (e.target.value == 10) {

            el.style.display = 'block'
            el.style.marginBlock = "8px";
            el.style.width = "150%";

        } else {

            el.style.display = 'none'
        }
    }

    const handleAlternate = (i, e) => {
        let extraValues = [...extra];
        extraValues[i][e.target.name] = e.target.value;
        setExtra(extraValues);

    }

    let addExtras = (e) => {
        e.preventDefault();
        setExtra([...extra, {
            email: "",
            name: "",
            phone: ""
        }])
    }

    let removeExtras = (e, i) => {
        e.preventDefault();
        let extraValues = [...extra];
        extraValues.splice(i, 1);
        setExtra(extraValues)
    }



    return (
        <div id="container">
            <Sidebar />
            <div id="content">
                <div className="edit-customer">
                    <h1 className="page-title addEmployer">Edit Client</h1>
                    <div className="card">
                        <div className="card-body">
                            <form>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="control-label">
                                                First Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={firstname}
                                                onChange={(e) =>
                                                    setFirstName(e.target.value)
                                                }
                                                className="form-control"
                                                required
                                                placeholder="Enter First Name"
                                            />
                                            {errors.firstname ? (
                                                <small className="text-danger mb-1">
                                                    {errors.firstname}
                                                </small>
                                            ) : (
                                                ""
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="control-label">
                                                Last Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={lastname}
                                                onChange={(e) =>
                                                    setLastName(e.target.value)
                                                }
                                                className="form-control"
                                                required
                                                placeholder="Enter Last Name"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="control-label">
                                                Invoice Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={invoiceName}
                                                onChange={(e) =>
                                                    setInvoiceName(e.target.value)
                                                }
                                                className="form-control"
                                                required
                                                placeholder="Enter Last Name"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="control-label">
                                                Primary Email *
                                            </label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) =>
                                                    setEmail(e.target.value)
                                                }
                                                className="form-control"
                                                required
                                                placeholder="Email"
                                            />
                                            {errors.email ? (
                                                <small className="text-danger mb-1">
                                                    {errors.email}
                                                </small>
                                            ) : (
                                                ""
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="control-label">
                                                Password *
                                            </label>
                                            <input
                                                type="password"
                                                onChange={(e) =>
                                                    setPassCode(e.target.value)
                                                }
                                                className="form-control"
                                                required
                                                placeholder="Password"
                                            />
                                            {errors.passcode ? (
                                                <small className="text-danger mb-1">
                                                    {errors.passcode}
                                                </small>
                                            ) : (
                                                ""
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-sm-6 phone">
                                        <div className="form-group">
                                            <label className="control-label">
                                                Primary Phone
                                            </label>
                                            <input
                                                type="tel"
                                                value={phone}
                                                name='phone'
                                                onChange={(e) =>
                                                    setPhone(e.target.value)
                                                }
                                                className="form-control pphone"
                                                placeholder="Phone"
                                            />
                                        </div>
                                    </div>


                                    {
                                        extra && extra.map((ex, i) => {

                                            return (
                                                <>
                                                    <div className="col-sm-4">
                                                        <div className="form-group">
                                                            <label className="control-label">
                                                                Alternate Email
                                                            </label>
                                                            <input
                                                                type="tel"
                                                                value={ex.email || ''}
                                                                name='email'
                                                                onChange={(e) =>
                                                                    handleAlternate(i, e)
                                                                }
                                                                className="form-control"
                                                                placeholder="email"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-4">
                                                        <div className="form-group">
                                                            <label className="control-label">
                                                                Person Name
                                                            </label>
                                                            <input
                                                                type="tel"
                                                                value={ex.name || ''}
                                                                name='name'
                                                                onChange={(e) =>
                                                                    handleAlternate(i, e)
                                                                }
                                                                className="form-control"
                                                                placeholder="person name"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-3">
                                                        <div className="form-group">
                                                            <label className="control-label">
                                                                Alternate phone
                                                            </label>
                                                            <input
                                                                type="tel"
                                                                value={ex.phone || ''}
                                                                name='phone'
                                                                onChange={(e) =>
                                                                    handleAlternate(i, e)
                                                                }
                                                                className="form-control"
                                                                placeholder="Phone"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-1">

                                                        {
                                                            (i == 0) ?
                                                                <>

                                                                    <button className="mt-25 btn btn-success" onClick={(e) => { addExtras(e) }}> + </button>

                                                                </>
                                                                : <>
                                                                    <button className="mt-25 btn bg-red" onClick={(e) => { removeExtras(e, i) }}> <i className="fa fa-minus"></i> </button>
                                                                </>
                                                        }
                                                    </div>

                                                </>
                                            )

                                        })
                                    }


                                </div>
                                <div className="form-group">
                                    <label className="control-label">Enter a location</label>
                                    <LoadScript
                                        googleMapsApiKey="AIzaSyBva3Ymax7XLY17ytw_rqRHggZmqegMBuM"
                                        libraries={libraries}
                                    >
                                        <GoogleMap
                                            mapContainerStyle={containerStyle}
                                            center={center}
                                            zoom={15}
                                        >
                                            <Marker
                                                draggable={true}
                                                onDragEnd={(e) => onMarkerDragEnd(e)}
                                                position={{
                                                    lat: latitude,
                                                    lng: longitude,
                                                }}
                                            />
                                            {address ? (
                                                <InfoWindow
                                                    onClose={(e) => onInfoWindowClose(e)}
                                                    position={{
                                                        lat: latitude + 0.0018,
                                                        lng: longitude,
                                                    }}
                                                >
                                                    <div>
                                                        <span style={{ padding: 0, margin: 0 }}>
                                                            {address}
                                                        </span>
                                                    </div>
                                                </InfoWindow>
                                            ) : (
                                                <></>
                                            )}
                                            <Marker />
                                        </GoogleMap>
                                        <Autocomplete
                                            onLoad={(e) => setPlace(e)}
                                            onPlaceChanged={handlePlaceChanged}
                                        >
                                            <input
                                                type="text"
                                                placeholder="Search Your Address"
                                                className="form-control mt-1"
                                            />
                                        </Autocomplete>
                                    </LoadScript>
                                </div>
                                <h4 className="mt-2 mb-3">Client Full Address</h4>

                                <div className="form-group">
                                    <label className="control-label">Full Address
                                        <small className="text-pink mb-1">
                                            &nbsp; (auto complete from google address)
                                        </small>
                                    </label>
                                    <input
                                        type="text"
                                        value={address}
                                        className="form-control"
                                        placeholder="Full Address"
                                    />

                                </div>

                                <div className="form-group">
                                    <label className="control-label">Floor</label>
                                    <input
                                        type="text"
                                        value={floor}
                                        onChange={(e) => setFloor(e.target.value)}
                                        className="form-control"
                                        placeholder="Enter floor"
                                    />
                                    {errors.floor ? (
                                        <small className="text-danger mb-1">
                                            {errors.floor}
                                        </small>
                                    ) : (
                                        ""
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="control-label">Apt number and Apt name</label>
                                    <input
                                        type="text"
                                        value={Apt}
                                        onChange={(e) => setApt(e.target.value)}
                                        className="form-control"
                                        placeholder="Enter Apt number"
                                    />
                                    {errors.Apt ? (
                                        <small className="text-danger mb-1">
                                            {errors.Apt}
                                        </small>
                                    ) : (
                                        ""
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="control-label">Enterance code</label>
                                    <input
                                        type="text"
                                        value={enterance}
                                        onChange={(e) => setEnterance(e.target.value)}
                                        className="form-control"
                                        placeholder="Enter enterance"
                                    />
                                    {errors.enterance ? (
                                        <small className="text-danger mb-1">
                                            {errors.enterance}
                                        </small>
                                    ) : (
                                        ""
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="control-label">Zip Code</label>
                                    <input
                                        type="text"
                                        value={zip}
                                        onChange={(e) => setZip(e.target.value)}
                                        className="form-control"
                                        placeholder="Enter zip code"
                                    />
                                    {errors.zip ? (
                                        <small className="text-danger mb-1">
                                            {errors.zip}
                                        </small>
                                    ) : (
                                        ""
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="control-label">Date of Birth</label>
                                    <input
                                        type="date"
                                        value={dob}
                                        onChange={(e) => setDob(e.target.value)}
                                        className="form-control"
                                        placeholder="Enter dob"
                                    />
                                    {errors.dob ? (
                                        <small className="text-danger mb-1">
                                            {errors.dob}
                                        </small>
                                    ) : (
                                        ""
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="control-label">Payment Method</label>

                                    <select
                                        className="form-control"
                                        value={paymentMethod}
                                        onChange={(e) => { setPaymentMethod(e.target.value); }}
                                    >
                                        <option value="cc" selected={paymentMethod == "cc"}>Credit Card</option>
                                        <option value="mt" selected={paymentMethod == "mt"}>Money Transfer</option>
                                        <option value="cheque" selected={paymentMethod == "cheque"}>By Cheque</option>
                                        <option value="cash" selected={paymentMethod == "cash"}>By Cash</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="control-label">Language</label>

                                    <select
                                        className="form-control"
                                        value={lng}
                                        onChange={(e) => { setLng(e.target.value); handleServiceLng(e.target.value); }}
                                    >
                                        <option value="heb" selected={lng == "heb"}>Hebrew</option>
                                        <option value="en" selected={lng == "en"}>English</option>
                                    </select>
                                </div>
                                <div className="form-group lcs">
                                    <div className="form-check form-check-inline1 pl-0" style={{ paddingLeft: "0" }}>
                                        <label class="form-check-label" for="title">Color</label>
                                    </div>
                                    <div className="swatch white">
                                        <input type="radio" name="swatch_demo" id="swatch_2" value="0" color="#fff" onChange={(e) => setColor('#fff')} />
                                        <label for="swatch_2"><i className="fa fa-check"></i></label>
                                        <span>white</span>
                                    </div>
                                    <div className="swatch green">
                                        <input type="radio" name="swatch_demo" id="swatch_2" value="2" color="#28a745" onChange={(e) => setColor('#28a745')} />
                                        <label for="swatch_2"><i className="fa fa-check"></i></label>
                                        <span>Green</span>
                                    </div>
                                    <div className="swatch blue">
                                        <input type="radio" name="swatch_demo" id="swatch_3" value="3" color="#007bff" onChange={(e) => setColor('#007bff')} />
                                        <label for="swatch_3"><i className="fa fa-check"></i></label>
                                        <span>Blue</span>
                                    </div>
                                    <div className="swatch purple">
                                        <input type="radio" name="swatch_demo" id="swatch_1" value="1" color="#6f42c1" onChange={(e) => setColor('#6f42c1')} />
                                        <label for="swatch_1"><i className="fa fa-check"></i></label>
                                        <span>Voilet</span>
                                    </div>
                                    <div className="swatch red">
                                        <input type="radio" name="swatch_demo" id="swatch_5" value="5" color="#dc3545" onChange={(e) => setColor('#dc3545')} />
                                        <label for="swatch_5"><i className="fa fa-check"></i></label>
                                        <span>Red</span>
                                    </div>
                                    <div className="swatch orange">
                                        <input type="radio" name="swatch_demo" id="swatch_4" value="4" color="#fd7e14" onChange={(e) => setColor('#fd7e14')} />
                                        <label for="swatch_4"><i className="fa fa-check"></i></label>
                                        <span>Orange</span>
                                    </div>
                                    <div className="swatch yellow">
                                        <input type="radio" name="swatch_demo" id="swatch_6" value="6" color="#ffc107" onChange={(e) => setColor('#ffc107')} />
                                        <label for="swatch_6"><i className="fa fa-check"></i></label>
                                        <span>Yellow</span>
                                    </div>

                                    {errors.color ? (
                                        <small className="text-danger mb-1">
                                            {errors.color}
                                        </small>
                                    ) : (
                                        ""
                                    )}
                                </div>



                                <div className="form-group mt-35">
                                    <label className="control-label">Status</label>
                                    <select
                                        className="form-control"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <option value="0" selected={status == 0}>Lead</option>
                                        <option value="1" selected={status == 1}>Potential Customer</option>
                                        <option value="2" selected={status == 2}>Customer</option>

                                    </select>
                                    {errors.status ? (
                                        <small className="text-danger mb-1">
                                            {errors.status}
                                        </small>
                                    ) : (
                                        ""
                                    )}
                                </div>

                                <div className="form-group mt-35">
                                    <label className="control-label">Create Job</label>
                                    <select
                                        className="form-control"
                                        value={cjob}
                                        onChange={(e) => { setCjob(e.target.value); (e.target.value == '1') ? document.querySelector('.ClientJobSection').style.display = 'block' : document.querySelector('.ClientJobSection').style.display = 'none'; }}
                                    >
                                        <option value="0">No</option>
                                        <option value="1">Yes</option>
                                    </select>
                                </div>



                                {/* Create Job */}
                                <div className="ClientJobSection" style={{ display: 'none' }}>
                                    <div className='row'>
                                        <div className='col-sm-12'>

                                            <div className="">

                                                <div className="card-body">
                                                    <div className="table-responsive">
                                                        <table class="table table-sm">
                                                            <thead>
                                                                <tr>
                                                                    <th style={{ width: "15%" }}>Service</th>
                                                                    <th style={{ width: "15%" }}>Type</th>
                                                                    <th style={{ width: "15%" }}>Job Hours</th>
                                                                    <th style={{ width: "15%" }}>Price</th>
                                                                    <th style={{ width: "15%", display: "none" }}>Rate Per Hour</th>
                                                                    <th style={{ width: "15%" }}>Frequency</th>
                                                                    <th style={{ width: "30%" }}>Worker</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {formValues.map((element, index) => {

                                                                    return (
                                                                        <tr key={index}>

                                                                            <td>
                                                                                <select name="service" className="form-control" value={element.service || ""} onChange={e => { handleChange(index, e); handleOther(e); }} >
                                                                                    <option selected value={0}> -- Please select --</option>
                                                                                    {AllServices && AllServices.map((s, i) => {
                                                                                        return (
                                                                                            <option name={s.name} template={s.template} value={s.id}> {s.name} </option>
                                                                                        )
                                                                                    })}
                                                                                </select>

                                                                                <textarea type="text" name="other_title" id={`other_title` + index} placeholder='Service Title' style={(element.other_title == '') ? { "display": "none" } : {}} className="form-control" value={element.other_title || ""} onChange={e => handleChange(index, e)} />
                                                                            </td>
                                                                            <td>
                                                                                <select name="type" className="form-control" value={element.type || ""} onChange={(e) => { handleChange(index, e); handleType(e); }} >
                                                                                    <option selected value="fixed">Fixed</option>
                                                                                    <option selected value="hourly">Hourly</option>
                                                                                </select>
                                                                            </td>

                                                                            <td>
                                                                                <input type="number" name="jobHours" value={element.jobHours || ""} onChange={e => handleChange(index, e)} className="form-control jobhr" required placeholder="Enter job Hrs" />
                                                                            </td>
                                                                            <td style={(type == 'hourly') ? { "display": "none" } : {}}>
                                                                                <input type="number" name="fixed_price" value={element.fixed_price || ""} onChange={e => handleChange(index, e)} className="form-control jobprice" required placeholder="Enter job price" />
                                                                            </td>
                                                                            <td style={(type != 'hourly') ? { "display": "none" } : {}}>
                                                                                <input type="text" name="rateperhour" value={element.rateperhour || ""} onChange={e => handleChange(index, e)} className="form-control jobrate" required placeholder="Enter rate P/Hr" />
                                                                            </td>

                                                                            <td>
                                                                                <select name="frequency" className="form-control mb-2" value={element.frequency || ""} onChange={e => handleChange(index, e)} >
                                                                                    <option selected value={0}> -- Please select --</option>
                                                                                    {AllFreq && AllFreq.map((s, i) => {
                                                                                        return (
                                                                                            <option cycle={s.cycle} period={s.period} name={s.name} value={s.id}> {s.name} </option>
                                                                                        )
                                                                                    })}
                                                                                </select>

                                                                                <select name='days' className="form-control choosen-select" multiple data-placeholder="Choose Days" onChange={(e) => { handleChange(index, e); }}>

                                                                                    <option value="sunday">Sunday</option>
                                                                                    <option value="monday">Monday</option>
                                                                                    <option value="tuesday">Tuesday</option>
                                                                                    <option value="wednesday">Wednesday</option>
                                                                                    <option value="thursday">Thrusday</option>
                                                                                    <option value="friday">Friday</option>
                                                                                    <option value="saturday">Saturday</option>
                                                                                    
                                                                                </select>

                                                                            </td>

                                                                            <td>
                                                                                <select name="worker" className="form-control  mb-2" value={element.worker || ""} onChange={(e) => { handleChange(index, e); }} >
                                                                                    <option selected value={0}>--Please select--</option>
                                                                                    {
                                                                                        worker && worker.map((w, i) => {
                                                                                            return (<option name={w.firstname + " " + w.lastname} value={w.id}>{w.firstname + " " + w.lastname}</option>)
                                                                                        })
                                                                                    }


                                                                                </select>

                                                                                <select name='shift' className="form-control choosen-select" multiple data-placeholder="Choose shift" onChange={(e) => { handleChange(index, e); }}>
                                                                                    {
                                                                                        slot && slot.map((s, i) => {
                                                                                            return (<option value={s.value}>{s.text}</option>)
                                                                                        })
                                                                                    }
                                                                                </select>

                                                                                {/* 
                                                                                </select>
                                                                                    <MultiSelect
                                                                                    options={slot}
                                                                                    value={(selected.index != undefined && selected.index == index)? selected.val : []}
                                                                                    onChange={(e)=>{ setSelected({index,val:[e[0]]}); console.log(selected.index)  }}
                                                                                    labelledBy="Select shift"
                                                                            />*/}
                                                                            </td>


                                                                            <td class="text-right"><button className="ml-2 btn bg-red" onClick={() => removeFormFields(index)}><i className="fa fa-minus"></i></button></td>
                                                                        </tr>
                                                                    )
                                                                })}

                                                            </tbody>

                                                            <tfoot>
                                                                <tr>
                                                                    <td class="text-right" colSpan="10">
                                                                        <button type="button" class="btn bg-green" onClick={() => addFormFields()}><i class="fa fa-plus"></i></button>
                                                                    </td>
                                                                </tr>
                                                            </tfoot>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className="form-group text-center">
                                    <input type="submit" value="SAVE" onClick={handleUpdate} className="btn btn-pink saveBtn" />
                                </div>

                            </form>
                        </div>
                    </div>

                </div>
            </div >
        </div >

    );
}
