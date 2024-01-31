import React, { useState } from "react";
import Sidebar from "../../Layouts/Sidebar";
import { Link } from "react-router-dom";

export default function Templates() {

    return (
        <div id="container">
            <Sidebar />
            <div id="content">
                <div className="edit-customer">
                    <h1 className="page-title addEmployer">Service Templates</h1>
                    <div className="card">
                        <div className="card-body">
                        <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th scope="col" >Template</th>
                                <th scope="col" >View</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Regular Services</td>
                                <td>
                                <Link
                                    to="/admin/template/regular-service"
                                    className="btn bg-yellow">
                                    <i className="fa fa-eye"></i>
                                </Link>
                                </td>
                            </tr>
                            <tr>
                                <td>Office Cleaning</td>
                                <td>
                                <Link
                                    to="/admin/template/office-cleaning"
                                    className="btn bg-yellow">
                                    <i className="fa fa-eye"></i>
                                </Link>
                                </td>
                            </tr>
                            <tr>
                                <td>Cleaning after renovation</td>
                                <td>
                                <Link
                                    to="/admin/template/after-renovation"
                                    className="btn bg-yellow">
                                    <i className="fa fa-eye"></i>
                                </Link>
                                </td>
                            </tr>
                            <tr>
                                <td>Thorough Cleaning</td>
                                <td>
                                <Link
                                    to="/admin/template/thorough-cleaning"
                                    className="btn bg-yellow">
                                    <i className="fa fa-eye"></i>
                                </Link>
                                </td>
                            </tr>
                            <tr>
                                <td>Window Cleaning</td>
                                <td>
                                <Link
                                    to="/admin/template/window-cleaning"
                                    className="btn bg-yellow">
                                    <i className="fa fa-eye"></i>
                                </Link>
                                </td>
                            </tr>
                            <tr>
                                <td>Others</td>
                                <td>
                                <Link
                                    to="/admin/template/others"
                                    className="btn bg-yellow">
                                    <i className="fa fa-eye"></i>
                                </Link>
                                </td>
                            </tr>
                        </tbody>
                        
                        </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}