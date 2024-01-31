import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useParams,useNavigate } from "react-router-dom";
import Sidebar from "../../Layouts/Sidebar";
import {
    GoogleMap,
    LoadScript,
    InfoWindow,
    Marker,
    Autocomplete,
} from "@react-google-maps/api";
import Geocode from "react-geocode";

export default function EditWorker() {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [renewal_date, setRenewalDate] = useState('');
  const [gender, setGender] = useState('male');
  const [payment_hour, setPaymentHour] = useState(0);
  const [worker_id, setWorkerId] = useState(Math.random().toString().concat("0".repeat(3)).substr(2,5));
  const [password, setPassword] = useState('');
  const [lng,setLng]     = useState("");
  const [address, setAddress] = useState('');
  const [skill,setSkill] = useState([]);
  const [itemStatus, setItemStatus] = useState('');
  const [country, setCountry] = useState('Israel');

  const [countries,setCountries] = useState([]);
  const [avl_skill,setAvlSkill] = useState([]);

  const [errors, setErrors] = useState([]);
  const params = useParams();
  const navigate = useNavigate();
  const alert = useAlert();
  const [libraries] = useState(["places", "geometry"]);
    const [latitude, setLatitude] = useState(-33.865143);
    const [longitude, setLongitude] = useState(151.2099);
    const [place, setPlace] = useState();
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
            console.log(place)
            // setCity(place.getPlace().vicinity);
            setAddress(place.getPlace().formatted_address);
            setLatitude(place.getPlace().geometry.location.lat());
            setLongitude(place.getPlace().geometry.location.lng());
        }
    };

  const handleSkills = (e) => {
        const value = e.target.value;
        const checked = e.target.checked;
        if(checked){
          setSkill([...skill,value]);
        }else{
           setSkill(skill.filter( (e) => ( e !== value ) ));
        }
  }
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        
        let skr = [];
        let ski = document.querySelectorAll('.ski:checked');
        ski.forEach((s,i)=>{
            skr.push(s.value);
        });
       
        const data = {
        "firstname": firstname,
        "lastname": lastname,
        "phone": phone,
        "email":email,
        "address": address,
        "renewal_visa": renewal_date,
        "gender": gender,
        "payment_hour": payment_hour,
        "lng":(!lng) ? 'en' : lng,
        "worker_id": worker_id,
        "password": password,
        "skill": skr,
        "status": (!itemStatus) ? 1 : parseInt(itemStatus),
        "country":country,
        "latitude":latitude,
        "longitude":longitude
    }
   

        axios
            .put(`/api/admin/workers/${params.id}`, data ,{ headers })
            .then((response) => {
                if (response.data.errors) {
                    setErrors(response.data.errors);
                } else {
                    alert.success("Worker has been updated successfully");
                    setTimeout(() => {
                        navigate("/admin/workers");
                    }, 1000);
                }
            });
    };


    const getWorker = () => {
        axios
            .get(`/api/admin/workers/${params.id}/edit`, { headers })
            .then((response) => {
                setFirstName(response.data.worker.firstname);
                setLastName(response.data.worker.lastname);
                setEmail(response.data.worker.email);
                setPhone(response.data.worker.phone);
                setRenewalDate(response.data.worker.renewal_visa);
                setGender(response.data.worker.gender);
                setPaymentHour(response.data.worker.payment_per_hour);
                setWorkerId(response.data.worker.worker_id);
                setPassword(response.data.worker.passcode);
                setSkill(response.data.worker.skill);
                setAddress(response.data.worker.address);
                setItemStatus(response.data.worker.status);
                setLng(response.data.worker.lng);
                setCountry(response.data.worker.country);
                setLatitude(response.data.worker.latitude);
                setLongitude(response.data.worker.longitude);
                setTimeout(()=>{

              
                let skl = response.data.worker.skill.length > 0 ? JSON.parse(response.data.worker.skill) : [];
                let el = document.querySelectorAll('.ski');
                
                el.forEach((e,i)=>{
                    skl.includes(e.value) &&
                    e.setAttribute('checked',true)
                   
                    });
                },1000);
               
            });
    };
     const getAvailableSkill = () => {
        axios
            .get(`/api/admin/services/create`, { headers })
            .then((response) => {
                setAvlSkill(response.data.services);
            });
    };
    const getCountries = () => {
        axios
            .get(`/api/admin/countries`, { headers })
            .then((response) => {
                setCountries(response.data.countries);
            });
    };
    useEffect(() => {
        getWorker();
        getCountries();
        getAvailableSkill();
        
    }, []);
    return (
        <div id="container">
            <Sidebar />
            <div id="content">
                <div className="edit-customer">
                    <h1 className="page-title editEmployer">Edit Worker</h1>
                    <div className="dashBox p-4">
                        <form>
                            <div className='row'>
                                <div className='col-sm-6'>
                                    <div className='form-group'>
                                        <label className='control-label'>First Name *</label>
                                        <input type='text' value={firstname} onChange={(e) => setFirstName(e.target.value)} className='form-control' required placeholder='Enter First Name' />
                                        {errors.firstname ? (
                                            <small className="text-danger mb-1">
                                                {errors.firstname}
                                            </small>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                </div>
                                <div className='col-sm-6'>
                                    <div className='form-group'>
                                        <label className='control-label'>Last Name</label>
                                        <input type='text' value={lastname} onChange={(e) => setLastName(e.target.value)} className='form-control' placeholder='Enter Last Name' />
                                    </div>
                                </div>
                                 <div className='col-sm-6'>
                                    <div className='form-group'>
                                        <label className='control-label'>Email</label>
                                        <input type='tyoe' value={email} onChange={(e) => setEmail(e.target.value)} className='form-control' placeholder='Email' />
                                        {errors.email ? (
                                            <small className="text-danger mb-1">
                                                {errors.email}
                                            </small>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                </div>
                                <div className='col-sm-6'>
                                    <div className='form-group'>
                                        <label className='control-label'>Phone</label>
                                        <input type='tel' value={phone} onChange={(e) => setPhone(e.target.value)} className='form-control' placeholder='Phone' />
                                        {errors.phone ? (
                                            <small className="text-danger mb-1">
                                                {errors.phone}
                                            </small>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                </div>
                                <div className='col-sm-6'>
                                    <div className='form-group'>
                                        <label className='control-label'>Gender</label>
                                    </div>
                                    <div className="form-check-inline">
                                    <label className="form-check-label">
                                        <input type="radio" className="form-check-input" value="male" onChange={(e) => setGender(e.target.value)} checked={gender === 'male'} />Male
                                    </label>
                                    </div>
                                    <div className="form-check-inline">
                                    <label className="form-check-label">
                                        <input type="radio" className="form-check-input" value="female" onChange={(e) => setGender(e.target.value)} checked={gender === 'female'} />Female
                                    </label>
                                    </div>
                                </div>
                                <div className='col-sm-6'>
                                    <div className='form-group'>
                                        <label className='control-label'>Payment Per Hour (NIS)</label>
                                        <input type='text' value={payment_hour} onChange={(e) => setPaymentHour(e.target.value)} className='form-control' placeholder='Payment Per Hour' />
                                    </div>
                                    
                                </div>
                                <div className='col-sm-6'>
                                    <div className='form-group'>
                                        <label className='control-label'>Worker Id</label>
                                        <input type='text' value={worker_id} onChange={(e) => setWorkerId(e.target.value)} className='form-control' placeholder='Payment Per Hour' />
                                    {errors.worker_id ? (
                                            <small className="text-danger mb-1">
                                                {errors.worker_id}
                                            </small>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                    
                                </div>
                                <div className='col-sm-6'>
                                    <div className='form-group'>
                                        <label className='control-label'>Password *</label>
                                        <input type='password'  onChange={(e) => setPassword(e.target.value)} className='form-control' required placeholder='Password' />
                                    </div>
                                </div>
                                <div className='col-sm-6'>
                                    <div className="form-group">
                                    <label className="control-label">Language</label>
                                    
                                    <select
                                        className="form-control"
                                        value={lng}
                                        onChange={(e) => setLng(e.target.value)}
                                    >
                                        <option value="heb" selected={lng == "heb"}>Hebrew</option>
                                        <option value="en" selected={lng == "en"}>English</option>
                                        <option value="ru" selected={lng == "ru"}>Russian</option>
                                        <option value="spa" selected={lng == "spa"}>Spanish</option>

                                    </select>
                                    </div>
                                </div>
                                 <div className='col-sm-6'>
                                        <div className="form-group">
                                        <label className="control-label">Country</label>
                                        
                                        <select
                                            className="form-control"
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                        >
                                        {countries && countries.map((item,index)=>(

                                            <option value={item.name} selected={(country==item.name)?true:false}>{item.name}</option>
                                        ))}
                                        </select>
                                    </div>
                               </div>
                               {country != 'Israel' &&
                                 <div className='col-sm-6'>
                                    <div className='form-group'>
                                        <label className='control-label'>Renewal of visa </label>
                                        <input type='date' selected={renewal_date} value={renewal_date} onChange={(e) => setRenewalDate(e.target.value)} className='form-control' placeholder='Email' />
                                    </div>
                                    
                                </div>
                                }
                            </div>
                            <div className="form-group">
                                    <label className="control-label">Enter a location</label>
                                    <LoadScript
                                        googleMapsApiKey="AIzaSyBva3Ymax7XLY17ytw_rqRHggZmqegMBuM"
                                        libraries={libraries}
                                    >
                                       {/* <GoogleMap
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
                                        </GoogleMap>*/}
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
                            <div className='form-group'>
                                <label className='control-label'>Full Address <small class="text-pink mb-1">&nbsp; (auto complete from google address)</small></label>
                                <input type='text' value={address}  className='form-control' placeholder='Full Address' />
                                {errors.address ? (
                                            <small className="text-danger mb-1">
                                                {errors.address}
                                            </small>
                                        ) : (
                                            ""
                                        )}
                            </div>
                            <div className='col-sm-12'>
                                    <div className='form-group'>
                                        <label className='control-label'>Skills</label>
                                    </div>
                                {avl_skill && avl_skill.map((item,index)=>(
                                    <div className="form-check" key={index}>
                                <label className="form-check-label">
                                    {/* CHECKED FROM API ABOVE*/}
                                    <input type="checkbox" className="form-check-input ski" name="skills" value={item.id}   />{item.name}
                                </label>
                                </div>

                                    ))}
                            </div>
                            <div className='form-group mt-4'>
                                <label className='control-label'>Status</label>
                                <select className='form-control' value={itemStatus} onChange={(e) => setItemStatus(e.target.value)}>
                                    <option value="1">Enable</option>
                                    <option value="0">Disable</option>
                                </select>
                                {errors.status ? (
                                            <small className="text-danger mb-1">
                                                {errors.status}
                                            </small>
                                        ) : (
                                            ""
                                        )}
                            </div>
                            <div className="form-group text-center">
                                <input type='submit' value='Update'  onClick={handleUpdate} className="btn btn-danger saveBtn"/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
