import React from 'react'
import seniorFAQ from '../../Assets/image/Frontend/senior-faq.jpg'
import { Link } from 'react-router-dom'

export default function HomeFAQ() {
  return (
    <div className='homeFAQ'>
        <div className='container'>
            <div className='row'>
                <div className='col-sm-6'>
                    <img src={seniorFAQ} className='img-fluid' alt='FAQ' />
                </div>
                <div className='col-sm-6'>
                    <h3>Frequently Asked Questions</h3>
                    <ul className='list-unstyled'>
                        <li className='list-group-item'>
                            <div id="fence" className='commonDropdown'>
                                <div className="card-header" id="fencehead1">
                                    <Link href="#" className="btn btn-header-link" data-toggle="collapse" data-target="#fence1"
                                    aria-expanded="true" aria-controls="fence1">
                                    Where can I get some? <i className="fa-solid fa-angle-down"></i>
                                    </Link>
                                </div>
                                <div id="fence1" className="collapse show" aria-labelledby="fencehead1" data-parent="#fence">
                                    <div className="card-body">
                                        <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.</p>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li className='list-group-item'>
                            <div id="fence" className='commonDropdown'>
                                <div className="card-header" id="fencehead2">
                                    <Link href="#" className="btn btn-header-link" data-toggle="collapse" data-target="#fence2"
                                    aria-expanded="true" aria-controls="fence2">
                                    Where does it come from? <i className="fa-solid fa-angle-down"></i>
                                    </Link>
                                </div>
                                <div id="fence2" className="collapse" aria-labelledby="fencehead2" data-parent="#fence">
                                    <div className="card-body">
                                        <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.</p>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li className='list-group-item'>
                            <div id="fence" className='commonDropdown'>
                                <div className="card-header" id="fencehead3">
                                    <Link href="#" className="btn btn-header-link" data-toggle="collapse" data-target="#fence3"
                                    aria-expanded="true" aria-controls="fence3">
                                    How do we use it? <i className="fa-solid fa-angle-down"></i>
                                    </Link>
                                </div>
                                <div id="fence3" className="collapse" aria-labelledby="fencehead3" data-parent="#fence">
                                    <div className="card-body">
                                        <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.</p>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li className='list-group-item'>
                            <div id="fence" className='commonDropdown'>
                                <div className="card-header" id="fencehead4">
                                    <Link href="#" className="btn btn-header-link" data-toggle="collapse" data-target="#fence4"
                                    aria-expanded="true" aria-controls="fence4">
                                    What is Lorem Ipsum? <i className="fa-solid fa-angle-down"></i>
                                    </Link>
                                </div>
                                <div id="fence4" className="collapse" aria-labelledby="fencehead1" data-parent="#fence">
                                    <div className="card-body">
                                        <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.</p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
  )
}
