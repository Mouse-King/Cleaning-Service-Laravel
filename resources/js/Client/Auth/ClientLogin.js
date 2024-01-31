import React, { useEffect, useState } from "react";
import logo from "../../Assets/image/sample.svg";
import i18next from "i18next";
export default function ClientLogin() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const [dir,setDir] = useState([]);

    const HandleLogin = (e) => {
        e.preventDefault();
        const data = {
            email: email,
            password: password,
        };
        axios.post(`/api/client/login`, data).then((result) => {
            if (result.data.errors) {
                setErrors(result.data.errors);
            } else {
                localStorage.setItem("client-token", result.data.token);
                i18next.changeLanguage(result.data.lng);
                localStorage.setItem(
                    "client-name",
                    result.data.firstname + " " + result.data.lastname
                );
                localStorage.setItem("client-id", result.data.id);

                    window.location = "/client/dashboard";
            }
        });
    };

    useEffect(()=>{
        let d = document.querySelector('html').getAttribute('dir');
        (d == 'rtl') ? setDir('heb'): setDir('en');
    },[]);

    return (
           <div id="loginPage">
            <div className="container adminLogin">
                <div className="formSide"> 
                    <div className="hidden-xs ifRTL">
                        <svg width="333" height="135" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">       
                            <image xlinkHref={logo} width="333" height="135"></image>
                        </svg>
                    </div>
                    <div className="hidden-xl ifRTL">
                        <svg width="250" height="94" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">       
                            <image xlinkHref={logo} width="250" height="94"></image>
                        </svg>
                    </div>
                    <h1 className="page-title">{dir == 'heb' ? 'לקוחות רשומים' : 'Client Login' }</h1>
                    <form>
                        <div className="form-group">
                            <div className="input-group mt-2">
                                <div className="input-group-prepend">
                                    <span
                                        className="input-group-text"
                                        id="basic-addon1"
                                    >
                                        <i className="fa-solid fa-user"></i>
                                    </span>
                                </div>
                                <input
                                    type="email"
                                    className="form-control"
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    placeholder="Email"
                                    name="username"
                                    aria-label="Username"
                                />
                            </div>
                            {errors.email ? (
                                <small className="text-danger mb-1">
                                    {errors.email}
                                </small>
                            ) : (
                                ""
                            )}
                        </div>
                        <div className="form-group">
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span
                                        className="input-group-text"
                                        id="basic-addon1"
                                    >
                                        <i className="fa-solid fa-key"></i>
                                    </span>
                                </div>
                                <input
                                    type="password"
                                    className="form-control"
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Password"
                                    name="password"
                                    aria-label="Password"
                                />
                            </div>
                            {errors.password ? (
                                <small className="text-danger mb-1">
                                    {errors.password}
                                </small>
                            ) : (
                                ""
                            )}
                        </div>
                       
                        <div className="form-group mt-4">
                            <button
                                type="button"
                                className="btn btn-danger btn-block"
                                onClick={HandleLogin}
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
