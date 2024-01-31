import React from 'react'

export default function HomeBanner() {
  return (
    <div className='home-banner'>
        <div className='container'>
            <div className='row'>
                <div className='col-sm-6 hidden-xs'></div>
                <div className='col-sm-6'>
                    <div className='caption'>
                        <ul className="nav nav-tabs" role="tablist">
                            <li className="nav-item" role="presentation">
                                <a id="help-tab" className="nav-link active" data-toggle="tab" href="#tab-help" aria-selected="true" role="tab">Je recherche une aide</a>
                            </li>
                            <li className="nav-item" role="presentation">
                                <a id="job-tab" className="nav-link" data-toggle="tab" href="#tab-job" aria-selected="false" role="tab">Je cherche une mission</a>
                            </li>
                        </ul>
                        <div className="tab-content">
                            <div id="tab-help" className="tab-pane active show" role="tab-panel" aria-labelledby="help-tab">
                                <h1><strong>Trouver une aide à domicile </strong>près de chez vous</h1>
                                <p>Plus de 10 000 profils disponible partout en France.</p>
                                <div className="input-group mb-3">
                                    <div className='input-group-prepend'>
                                        <span className='input-group-text'>
                                            <i className="fas fa-map-marker-alt"></i>
                                        </span>
                                    </div>
                                    <input type="text" className="form-control" id="search-applicant" placeholder='Entrer le code postal'/>
                                    <div className="input-group-prepend">
                                        <button className='btn btn-primary' id='btn-search-applicant'>Rechercher</button>
                                    </div>
                                </div>
                            </div>
                            <div id="tab-job" className="tab-pane" role="tab-panel" aria-labelledby="job-tab">
                                <h1><strong>Trouver une mission en tant </strong>qu'aide à domicile</h1>
                                <p>Aider une personne dépendante</p>
                                <div className="input-group mb-3">
                                    <div className='input-group-prepend'>
                                        <span className='input-group-text'>
                                            <i className="fas fa-map-marker-alt"></i>
                                        </span>
                                    </div>
                                    <input type="text" className="form-control" id="search-employer" placeholder='Entrer le code postal'/>
                                    <div className="input-group-prepend">
                                        <button className='btn btn-primary' id='btn-search-employer'>Rechercher</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
