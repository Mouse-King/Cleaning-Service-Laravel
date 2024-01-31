import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";

export default function Acc() {

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [file, setFile] = useState("");
    const [color,setColor] = useState("");
    const [phone,setPhone] = useState("");
    const [avatar, setAvatar] = useState("");
    const [errors, setErrors] = useState([]);
    const alert = useAlert();

    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };

    const handleChange = (e) => {
        setFile(URL.createObjectURL(e.target.files[0]));
        setAvatar(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("address", address);
        formData.append("color",color);
        formData.append("avatar", avatar);
        formData.append("phone",phone);
        axios
            .post(`/api/admin/my-account`, formData, { headers })
            .then((response) => {
                if (response.data.errors) {
                    setErrors(response.data.errors);
                } else {
                    alert.success(
                        "Account details has been updated successfully"
                    );
                }
            });
    };

    const getSetting = () => {
        axios.get("/api/admin/my-account", { headers }).then((response) => {
            setName(response.data.account.name);
            setColor(response.data.account.color);
            setEmail(response.data.account.email);
            setPhone(response.data.account.phone);
            setAddress(response.data.account.address);
            setFile(response.data.account.avatar);
        });
    };
    useEffect(() => {
        getSetting();
    }, []);
    return (
        <div className="card">
            <div className="card-body">
        <form>
            <div className="form-group">
                <label className="control-label">Your Name</label>
                <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                />
            </div>
            <div className="form-group">
                <label className="control-label">Email</label>
                <input
                    type="text"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />
                {errors.email ? (
                    <small className="text-danger mb-1">{errors.email}</small>
                ) : (
                    ""
                )}
            </div>
            
            <div className="form-group">
                <label className="control-label">Your Address</label>
                <textarea
                    className="form-control"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Your Address"
                />
                {errors.address ? (
                    <small className="text-danger mb-1">{errors.address}</small>
                ) : (
                    ""
                )}
            </div>
            <div className="form-group">
                <label className="control-label">Color</label>
                <input
                    type="color"
                    className="form-control"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label className="control-label">Phone</label>
                <input
                    type="text"
                    className="form-control"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Your Phone"
                />
            </div>
            <div className="form-group">
                <label className="control-label" style={{ display: "block" }}>
                    Upload Profile Image
                </label>
                <input
                    type="file"
                    onChange={handleChange}
                    style={{
                        display: "block",
                        height: "unset",
                        border: "none",
                    }}
                />
                <img
                    src={file}
                    className="img-fluid mt-2"
                    style={{ maxWidth: "200px" }}
                />
            </div>
            <div className="form-group text-center">
                <input
                    type="submit"
                    value="UPDATE"
                    onClick={handleSubmit}
                    className="btn btn-danger saveBtn"
                />
            </div>
        </form>
        </div>
    </div>
    );
}
