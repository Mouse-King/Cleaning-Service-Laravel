import React from 'react'
import Acc from '../../Components/Settings/Acc'
import ChangePass from '../../Components/Settings/ChangePass'
import Sidebar from '../../Layouts/Sidebar'

export default function Setting() {
  return (
    <div id='container'>
        <Sidebar/>
        <div id='content'>
            <div className='settings-page'>
                <h1 className="page-title revTitle">Settings</h1>
                <ul className="nav nav-tabs mb-2" role="tablist">
                    <li className="nav-item" role="presentation">
                        <a id="account-tab" className="nav-link active" data-toggle="tab" href="#tab-account" aria-selected="false" role="tab">My Account</a>
                    </li>
                    <li className="nav-item" role="presentation">
                        <a id="password-tab" className="nav-link" data-toggle="tab" href="#tab-password" aria-selected="false" role="tab">Change Password</a>
                    </li>
                </ul>
                <div className="tab-content">
                    <div id="tab-account" className="tab-pane active show" role="tab-panel" aria-labelledby="account-tab">
                        <Acc/>
                    </div>
                    <div id="tab-password" className="tab-pane" role="tab-panel" aria-labelledby="password-tab">
                        <ChangePass/>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
