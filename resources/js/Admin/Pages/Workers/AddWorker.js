import React, { useState,useEffect } from 'react'
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";
import Sidebar from '../../Layouts/Sidebar'
import {
    GoogleMap,
    LoadScript,
    InfoWindow,
    Marker,
    Autocomplete,
} from "@react-google-maps/api";
import Geocode from "react-geocode";


export default function AddWorker() {
 
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [renewal_date, setRenewalDate] = useState('');
  const [gender, setGender] = useState('');
  const [payment_hour, setPaymentHour] = useState();
  const [worker_id, setWorkerId] = useState(Math.random().toString().concat("0".repeat(3)).substr(2,5));
  const [password, setPassword] = useState('');
  const [lng,setLng]     = useState("");
  const [address, setAddress] = useState('');
  const [skill,setSkill] = useState([]);
  const [itemStatus, setItemStatus] = useState('');
  const [country, setCountry] = useState('Israel');

   const [avl_skill,setAvlSkill] = useState([]);
   const [countries,setCountries] = useState([]);

  const [errors, setErrors] = useState([]);

  const alert = useAlert();
  const navigate = useNavigate();
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
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
        "firstname": firstname,
        "lastname": lastname,
        "email": email,
        "phone": phone,
        "address": address,
        "renewal_visa": renewal_date,
        "gender": gender,
        "payment_hour": payment_hour,
        "worker_id": worker_id,
        "lng":(!lng) ? 'en':lng,
        "password": password,
        "skill": skill,
        "status": (!itemStatus)? 1 : parseInt(itemStatus),
        "country":country,
        "latitude":latitude,
        "longitude":longitude
    }
    let sbtn = document.querySelector('.saveBtn');
    sbtn.setAttribute('disabled',true);
    sbtn.innerText = 'Saving..';
     axios
            .post(`/api/admin/workers`, data, { headers })
            .then((response) => {
                if (response.data.errors) {
                    setErrors(response.data.errors);
                    sbtn.removeAttribute('disabled');
                    sbtn.innerText = 'Save';
                } else {
                    alert.success("Worker has been created successfully");
                    setTimeout(() => {
                        navigate("/admin/workers");
                    }, 1000);
                }
            });
  }
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
        getAvailableSkill();
        getCountries();
    }, []);
  return (
    <div id='container'>
       <Sidebar/>
        <div id="content">
            <div className='edit-customer'>
                <h1 className="page-title addEmployer">Add Worker</h1>
                <div className='card'>
                    <div className='card-body'>
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
                                        <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} className='form-control' required placeholder='Password' />
                                    </div>
                                    {errors.password ? (
                                            <small className="text-danger mb-1">
                                                {errors.password}
                                            </small>
                                        ) : (
                                            ""
                                        )}
                                </div>
                                <div className='col-sm-6'>
                                        <div className="form-group">
                                        <label className="control-label">Language</label>
                                        
                                        <select
                                            className="form-control"
                                            value={lng}
                                            onChange={(e) => setLng(e.target.value)}
                                        >
                                            <option value="en">English</option>
                                            <option value="heb">Hebrew</option>
                                            <option value="ru">Russian</option>
                                            <option value="spa">Spanish</option>
                                            
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
                                        <label className='control-label'>Renewal of visa</label>
                                        <input type='date' selected={renewal_date} onChange={(e) => setRenewalDate(e.target.value)} className='form-control' placeholder='Email' />
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
                            <div className='form-group' >
                                <label className='control-label'>Full Address<small class="text-pink mb-1">&nbsp; (auto complete from google address)</small></label>
                                <input type='text' value={address} className='form-control' placeholder='Enter your address' />
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
                                    <input type="checkbox" className="form-check-input" name="skills" value={item.id} onChange={handleSkills} />{item.name}
                                </label>
                                </div>

                                    ))}
                            </div>
                        <div className='form-group mt-4'>
                            <label className='control-label'>Status</label>
                            <select className='form-control' value={itemStatus} onChange={(e) => setItemStatus(e.target.value)}>
                                <option value="1" >Enable</option>
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
                            <input type='submit' value='SAVE'  onClick={handleSubmit} className="btn btn-pink saveBtn"/>
                        </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}