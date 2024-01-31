import React, { useState } from "react";
import { useAlert } from "react-alert";
import logo from "../../../Assets/image/sample.svg";

export default function AdminLogin() {
    const alert = useAlert();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);

    const HandleLogin = (e) => {
        e.preventDefault();

        const data = {
            email: email,
            password: password,
        };

        axios.post(`/api/admin/login`, data).then((result) => {
            if (result.data.errors) {
                setErrors(result.data.errors);
            } else {
                console.log(result.data);
                localStorage.setItem("admin-token", result.data.token);
                localStorage.setItem("admin-name",result.data.name);
                localStorage.setItem("admin-id", result.data.id);
                window.location = "/admin/dashboard";
            }
        });
    };

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
                    <h1 className="page-title">Admin Login</h1>
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
                                    placeholder="Username"
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
