import React from 'react'
import Acc from '../../../Client/Component/Settings/Acc'
import ChangePass from '../../../Client/Component/Settings/ChangePass'
import Card from '../../../Client/Component/Settings/card'
import Sidebar from '../../Layouts/ClientSidebar'
import { useTranslation } from 'react-i18next'

export default function Setting() {
    const {t} = useTranslation();
  return (
    <div id='container'>
         <Sidebar/>
        <div id='content'>
            <div className='settings-page'>
                <h1 className="page-title revTitle">{t('client.settings.title')}</h1>
                <ul className="nav nav-tabs mb-2" role="tablist">
                    <li className="nav-item" role="presentation">
                        <a id="account-tab" className="nav-link active" data-toggle="tab" href="#tab-account" aria-selected="false" role="tab">{t('client.settings.my_account')}</a>
                    </li>
                    <li className="nav-item" role="presentation">
                        <a id="password-tab" className="nav-link" data-toggle="tab" href="#tab-password" aria-selected="false" role="tab">{t('client.settings.change_pass')}</a>
                    </li>
                    <li className="nav-item" role="presentation">
                        <a id="card-tab" className="nav-link" data-toggle="tab" href="#tab-card" aria-selected="false" role="tab">{t('client.settings.card_tab')}</a>
                    </li>
                </ul>
                <div className="tab-content">
                    <div id="tab-account" className="tab-pane active show" role="tab-panel" aria-labelledby="account-tab">
                        <Acc/>
                    </div>
                    <div id="tab-password" className="tab-pane" role="tab-panel" aria-labelledby="password-tab">
                        <ChangePass/>
                    </div>
                    <div id="tab-card" className="tab-pane" role="tab-panel" aria-labelledby="card-tab">
                        <Card/>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
