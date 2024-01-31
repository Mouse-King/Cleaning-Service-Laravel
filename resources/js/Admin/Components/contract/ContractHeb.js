import React, { useRef, useState, useEffect } from 'react'
import logo from "../../../Assets/image/sample.svg";
import Sidebar from '../../Layouts/Sidebar';
import star from "../../../Assets/image/icons/blue-star.png";
import SignatureCanvas from 'react-signature-canvas'
import companySign from "../../../Assets/image/company-sign.png";
import { Table, Tr, Td } from 'react-super-responsive-table'
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import swal from 'sweetalert';
import Moment from 'moment';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';

export default function WorkContractRHS() {

    const [contract, setContract] = useState([]);
    const [services, setServices] = useState([]);
    const [client, setClient] = useState([]);
    const param = useParams();
    const sigRef = useRef();
    const { t } = useTranslation();
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };

    const handleVerify = (e) => {
        e.preventDefault();
        axios
            .post(`/api/admin/verify-contract`, { id: param.id }, { headers })
            .then((res) => {
                swal(res.data.message, '', 'success')
                setTimeout(() => {
                    window.location.reload(true);
                }, 1000)
            })
    }

    const handleSignatureEnd = () => {
        setSignature(sigRef.current.toDataURL());
    }

    const getContract = () => {
        axios
            .post(`/api/admin/get-contract`, { id: param.id }, { headers })
            .then((res) => {
                setContract(res.data.contract);
                setClient(res.data.contract[0].client);
                setServices(JSON.parse(res.data.contract[0].offer.services));
            })
    }

    useEffect(() => {
        getContract();
        i18next.changeLanguage('heb');
    }, [])

    return (
        <>

            <div className='rhs-work'>

                <div className="container">
                    <Sidebar />
                    <div className="send-offer client-contract">
                        <div className="maxWidthControl dashBox mb-4">
                            <div className="row">
                                {contract && contract.map((c, i) => {

                                    if (c.status == "un-verified") {
                                        return (
                                            <>
                                                <div className='col-sm-6'>
                                                    <div className='mt-2 float-right'>
                                                        <input className='btn btn-warning' onClick={handleVerify} value='Verify' />
                                                    </div>
                                                </div>
                                            </>
                                        )
                                    } else if (c.status == 'verified') {
                                        return (
                                            <>
                                                <div className='col-sm-6'>
                                                    <div className='mt-2 float-right'>
                                                        <input className='btn btn-success' value='Verified' />
                                                    </div>
                                                </div>

                                                <div className='col-sm-6'>
                                                    <div className='mt-2 float-left'>
                                                        <Link to={`/admin/create-job/${c.id}`} className="btn btn-pink" >Create Job</Link>
                                                    </div>
                                                </div>

                                            </>
                                        )
                                    }

                                })}
                                <div className="col-sm-6">
                                    <div className='float-right'>
                                        <svg width="250" height="94" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                            <image xlinkHref={logo} width="250" height="94"></image>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <h4 className="inHead">{t('work-contract.inHead')}</h4>
                            <div className="signed">
                                <p>{t('work-contract.signed')}<span>{client.city ? client.city : 'NA'}</span> on <span>{Moment(contract.created_at).format('DD MMMM,Y')}</span></p>
                            </div>
                            <div className="between">
                                <p>{t('work-contract.between')}</p>
                                <p>{t('work-contract.broom_service')}</p>

                            </div>
                            <div className="first">
                                <h2 className="mb-4 text-right">{t('work-contract.first_party_title')}</h2>
                                <ul className="list-inline customRTL">
                                    <li className="list-inline-item ml-2">{t('work-contract.full_name')} <span>{client.firstname + " " + client.lastname}</span>
                                    </li>
                                    <li className="list-inline-item">{t('work-contract.city')} <span>{client.city ? client.city : 'NA'}</span>
                                    </li>
                                </ul>
                                <ul className="list-inline customRTL">
                                    <li className="list-inline-item ml-2">{t('work-contract.street_and_number')} <span>{client.geo_address ? client.geo_address : 'NA'}</span>
                                    </li>
                                    {/* <li className="list-inline-item">{t('work-contract.floor')} <span>{client.floor ? client.floor : 'NA'}</span>
                                    </li>*/}
                                </ul>
                                <ul className="list-inline customRTL">
                                    {/*<li className="list-inline-item ml-2">{t('work-contract.apt_number')} <span>{client.apt_no ? client.apt_no : 'NA'}</span>
                                    </li>
                                    <li className="list-inline-item">{t('work-contract.enterance_code')} <span>{client.entrence_code ? client.entrence_code : 'NA'}</span>
                                </li>*/}
                                </ul>
                                <ul className="list-inline customRTL">
                                    <li className="list-inline-item ml-2">{t('work-contract.telephone')} <span>{client.phone ? client.phone : 'NA'}</span>
                                    </li>
                                    <li className="list-inline-item">{t('work-contract.email')} <span>{client.email ? client.email : 'NA'}</span>
                                    </li>
                                </ul>
                                <h2 className="mb-4 text-right">{t('work-contract.second_party_title')}</h2>
                                <div className="whereas pushRTL whereasRTL">
                                    <div className="info-list">
                                        <div className="icons">
                                            <h4>{t('work-contract.whereas')}</h4>
                                        </div>
                                        <div className="info-text">
                                            <p>{t('work-contract.whereas_info_text')}</p>
                                        </div>
                                    </div>
                                    <div className="info-list">
                                        <div className="icons">
                                            <h4>{t('work-contract.and_whereas')}</h4>
                                        </div>
                                        <div className="info-text">
                                            <p>{t('work-contract.and_whereas_info_text')}</p>
                                        </div>
                                    </div>
                                    <div className="info-list">
                                        <div className="icons">
                                            <h4>{t('work-contract.and_whereas_2')}</h4>
                                        </div>
                                        <div className="info-text">
                                            <p>{t('work-contract.and_whereas_2_info_text')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h2 className="text-center mb-4">{t('work-contract.parties_hereby_title')}</h2>
                            <div className="shift-30">
                                <h6 className='text-right'>{t('work-contract.intro_subtitle')}</h6>
                                <div className="agg-list pushRTL">
                                    <div className="icons">
                                        <img src={star} alt='Star' />
                                    </div>
                                    <div className="agg-text">
                                        <p>{t('work-contract.intro_txt_1')}</p>
                                    </div>
                                </div>
                                <div className="agg-list pushRTL">
                                    <div className="icons">
                                        <img src={star} alt='Star' />
                                    </div>
                                    <div className="agg-text">
                                        <p>{t('work-contract.intro_txt_2')}</p>
                                    </div>
                                </div>
                                <div className="agg-list pushRTL">
                                    <div className="icons">
                                        <img src={star} alt='Star' />
                                    </div>
                                    <div className="agg-text">
                                        <p>{t('work-contract.intro_txt_3')}</p>
                                    </div>
                                </div>
                                <div className="agg-list pushRTL">
                                    <div className="icons">
                                        <img src={star} alt='Star' />
                                    </div>
                                    <div className="agg-text">
                                        <p>{t('work-contract.intro_txt_4')}</p>
                                    </div>
                                </div>
                                <h6 className="text-center text-underline">{t('work-contract.service_subtitle')}</h6>
                                <div className="service-table table-responsive pushRTL">
                                    <Table className="table table-bordered">
                                        <Tr>
                                            <Td style={{ width: "60%" }}>{t('work-contract.the_service_txt')}</Td>
                                            <Td>

                                                {services && services.map((s, i) => {
                                                    return (

                                                        <p>{(s.service != '10') ? s.name : s.other_title}</p>
                                                    )
                                                })}

                                            </Td>
                                        </Tr>
                                        <Tr>
                                            <Td style={{ width: "60%" }}>{t('work-contract.location_txt')}</Td>
                                            <Td>
                                                {contract && contract.map((c, i) => {

                                                    let address = (c.client.geo_address) ? (c.client.geo_address) + ", " : '';

                                                    if (c.additional_address) {
                                                        if (c.status == "not-signed") {
                                                            return (
                                                                <>
                                                                    <span>{address}</span>
                                                                    <span style={{ fontWeight: "600" }} className='d-block mt-2'>{t('work-contract.other_address_txt')}</span> <br />
                                                                    <input type='text' name="additional_address" onChange={(e) => setAaddress(e.target.value)} placeholder={t('work-contract.placeholder_address')} className='form-control' />
                                                                </>
                                                            )
                                                        } else {

                                                            return (
                                                                <>
                                                                    <span>{address}</span>
                                                                    <span style={{ fontWeight: "600" }} className='d-block mt-2'>Other address if any?</span> <br />
                                                                    <span className='form-control'>{c.additional_address}</span>
                                                                </>
                                                            )
                                                        }
                                                    }

                                                })}

                                                <span className="d-block mt-2" style={{ fontWeight: "600" }}>{t('work-contract.other_address_txt')}</span>
                                                <br />
                                                <input type="text" name="additional_address" placeholder={t('work-contract.other_address_txt')} className="form-control" />
                                            </Td>
                                        </Tr>
                                        <Tr>
                                            <Td style={{ width: "60%" }}>{t('work-contract.service_delivery_txt')}</Td>
                                            <Td>{t('work-contract.as_agreed_txt')}</Td>
                                        </Tr>
                                        <Tr>
                                            <Td style={{ width: "60%" }}>{t('work-contract.frequency_txt')}</Td>
                                            <Td>
                                                {services && services.map((s, i) => {
                                                    return (

                                                        <p> {s.freq_name}</p>

                                                    )
                                                })}
                                            </Td>
                                        </Tr>
                                        <Tr>
                                            <Td style={{ width: "60%" }}>{t('work-contract.consideration_txt')}</Td>
                                            <Td>
                                                {services && services.map((s, i) => {
                                                    return <p>{s.totalamount + t('work-contract.ils') + " + " + t('work-contract.vat') + " " + t('work-contract.for') + " " + ((s.service != '10') ? s.name : s.other_title) + ", " + s.freq_name}</p>
                                                })}
                                            </Td>
                                        </Tr>
                                        <Tr>
                                            <Td style={{ width: "60%" }}>{t('work-contract.payment_method')}</Td>
                                            <Td>&nbsp;</Td>
                                        </Tr>
                                        <Tr>
                                            <Td style={{ width: "60%" }}>{t('work-contract.hereby_permit_txt')}</Td>
                                            <Td>&nbsp;</Td>
                                        </Tr>
                                        {contract && contract.map((c, i) => {
                                            return (
                                                (c.status == "not-signed") ?
                                                    <>
                                                        {/*<Tr>
                                                            <Td style={{ width: "60%" }}>{t('work-contract.card_type')}</Td>
                                                            <Td>
                                                                <select className='form-control' onChange={(e) => setCtype(e.target.value)}>
                                                                    <option>Please Select</option>
                                                                    <option value='Visa'>Visa</option>
                                                                    <option value='Master Card'>Master Card</option>
                                                                    <option value='American Express'>American Express</option>
                                                                </select>
                                                            </Td>
                                                         </Tr>*/}
                                                        <Tr>
                                                            <Td style={{ width: "60%" }}>{t('work-contract.card_name')}</Td>
                                                            <Td><input type='text' name="name_on_card" onChange={(e) => setCname(e.target.value)} className='form-control' placeholder={t('work-contract.card_name')} /></Td>
                                                        </Tr>

                                                        {/*<Tr>
                                                            <Td style={{ width: "60%" }}>{t('work-contract.card_cvv')}</Td>
                                                            <Td><input type='text' name="cvv" onChange={(e) => setCvv(e.target.value)} onKeyUp={(e) => { if (e.target.value.length >= 3) e.target.value = e.target.value.slice(0, 3); }} className='form-control' placeholder={t('work-contract.card_cvv')} /></Td>
                                                        </Tr>*/}
                                                        <Tr>
                                                            <td>{t('work-contract.signature')}</td>
                                                            <td> <SignatureCanvas
                                                                penColor='black'
                                                                canvasProps={{ className: 'sigCanvas' }}
                                                                ref={sigRef}
                                                                onEnd={handleSignatureEnd}
                                                            />&nbsp;</td>
                                                        </Tr>

                                                    </>
                                                    :
                                                    <>
                                                        { c.card_type != null && <Tr>
                                                            <Td style={{ width: "60%" }}>{t('work-contract.card_type')}</Td>
                                                            <Td><span className='form-control'>{c.card_type}</span></Td>
                                                        </Tr>}
                                                        <Tr>
                                                            <Td style={{ width: "60%" }}>{t('work-contract.card_name')}</Td>
                                                            <Td><span className='form-control'>{c.name_on_card}</span></Td>
                                                        </Tr>
                                                       {c.cvv != null && <Tr>
                                                            <Td style={{ width: "60%" }}>{t('work-contract.card_cvv')}</Td>
                                                            <Td ><span className='form-control'>{c.cvv}</span></Td>
                                                        </Tr>}
                                                        <Tr>
                                                            <Td style={{ width: "60%" }}>{t('work-contract.card_cvv')}</Td>
                                                            <img src={c.card_sign} className='img-fluid' alt='Company' />
                                                        </Tr>
                                                    </>

                                            )
                                        })}

                                        <Tr>
                                            <Td style={{ width: "60%" }}>{t('work-contract.miscellaneous_txt')}</Td>
                                            <Td>{t('work-contract.employees_txt')}</Td>
                                        </Tr>
                                    </Table>
                                </div>
                                <h6 className="text-underline text-right">{t('work-contract.tenant_subtitle')}</h6>
                                <div className="agg-list pushRTL">
                                    <div className="icons">
                                        <img src={star} alt='Star' />
                                    </div>
                                    <div className="agg-text">
                                        <p>{t('work-contract.tenant_txt_1')}</p>
                                    </div>
                                </div>
                                <div className="agg-list pushRTL">
                                    <div className="icons">
                                        <img src={star} alt='Star' />
                                    </div>
                                    <div className="agg-text">
                                        <p>{t('work-contract.tenant_txt_2')}</p>
                                    </div>
                                </div>
                                <div className="agg-list pushRTL">
                                    <div className="icons">
                                        <img src={star} alt='Star' />
                                    </div>
                                    <div className="agg-text">
                                        <p>{t('work-contract.tenant_txt_3')}</p>
                                    </div>
                                </div>
                                <div className="agg-list pushRTL">
                                    <div className="icons">
                                        <img src={star} alt='Star' />
                                    </div>
                                    <div className="agg-text">
                                        <p>{t('work-contract.tenant_txt_4')}</p>
                                    </div>
                                </div>
                                <div className="agg-list pushRTL">
                                    <div className="icons">
                                        <img src={star} alt='Star' />
                                    </div>
                                    <div className="agg-text">
                                        <p>{t('work-contract.tenant_txt_5')}</p>
                                    </div>
                                </div>
                                <div className="agg-list pushRTL">
                                    <div className="icons">
                                        <img src={star} alt='Star' />
                                    </div>
                                    <div className="agg-text">
                                        <p>{t('work-contract.tenant_txt_6')}</p>
                                    </div>
                                </div>
                                <div className="agg-list pushRTL">
                                    <div className="icons">
                                        <img src={star} alt='Star' />
                                    </div>
                                    <div className="agg-text">
                                        <p>{t('work-contract.tenant_txt_7')}</p>
                                    </div>
                                </div>
                                <div className="agg-list pushRTL">
                                    <div className="icons">
                                        <img src={star} alt='Star' />
                                    </div>
                                    <div className="agg-text">
                                        <p>{t('work-contract.tenant_txt_8')}</p>
                                    </div>
                                </div>
                                <h6 className="text-underline text-right">{t('work-contract.company_subtitle')}</h6>
                                <div className="agg-list pushRTL">
                                    <div className="icons">
                                        <img src={star} alt='Star' />
                                    </div>
                                    <div className="agg-text">
                                        <p>{t('work-contract.company_txt_1')}</p>
                                    </div>
                                </div>
                                <div className="agg-list pushRTL">
                                    <div className="icons">
                                        <img src={star} alt='Star' />
                                    </div>
                                    <div className="agg-text">
                                        <p>{t('work-contract.company_txt_2')}</p>
                                    </div>
                                </div>
                                <div className="agg-list pushRTL">
                                    <div className="icons">
                                        <img src={star} alt='Star' />
                                    </div>
                                    <div className="agg-text">
                                        <p>{t('work-contract.company_txt_3')}</p>
                                    </div>
                                </div>
                                <div className="agg-list pushRTL">
                                    <div className="icons">
                                        <img src={star} alt='Star' />
                                    </div>
                                    <div className="agg-text">
                                        <p>{t('work-contract.company_txt_4')}</p>
                                    </div>
                                </div>
                                <div className="agg-list pushRTL">
                                    <div className="icons">
                                        <img src={star} alt='Star' />
                                    </div>
                                    <div className="agg-text">
                                        <p>{t('work-contract.company_txt_5')}</p>
                                    </div>
                                </div>
                                <div className="agg-list pushRTL">
                                    <div className="icons">
                                        <img src={star} alt='Star' />
                                    </div>
                                    <div className="agg-text">
                                        <p>{t('work-contract.company_txt_6')}</p>
                                    </div>
                                </div>
                                <div className="agg-list pushRTL">
                                    <div className="icons">
                                        <img src={star} alt='Star' />
                                    </div>
                                    <div className="agg-text">
                                        <p>{t('work-contract.company_txt_7')}</p>
                                    </div>
                                </div>
                                <h6 className="text-underline text-right">{t('work-contract.general_subtitle')}</h6>
                                <div className="agg-list pushRTL">
                                    <div className="icons">
                                        <img src={star} alt='Star' />
                                    </div>
                                    <div className="agg-text">
                                        <p>{t('work-contract.general_txt_1')}</p>
                                    </div>
                                </div>
                                <div className="agg-list pushRTL">
                                    <div className="icons">
                                        <img src={star} alt='Star' />
                                    </div>
                                    <div className="agg-text">
                                        <p>{t('work-contract.general_txt_2')}</p>
                                    </div>
                                </div>
                                <div className="agg-list pushRTL">
                                    <div className="icons">
                                        <img src={star} alt='Star' />
                                    </div>
                                    <div className="agg-text">
                                        <p>{t('work-contract.general_txt_3')}</p>
                                    </div>
                                </div>
                                <h6 className="text-center text-underline mt-3 mb-4">{t('work-contract.signed_title')}</h6>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <h5 className="mt-2 mb-4 text-right">{t('work-contract.the_tenant_subtitle')}</h5>
                                        {contract && contract.map((c, i) => {

                                            return (
                                                (c.status == "not-signed") ? (<>
                                                    <h6>{t('work-contract.draw_signature')}</h6>
                                                    <SignatureCanvas
                                                        penColor='black'
                                                        canvasProps={{ className: 'sigCanvas' }}
                                                        ref={sigRef}
                                                        onEnd={handleSignatureEnd}
                                                    />
                                                </>)
                                                    :
                                                    <img src={c.signature} className='img-fluid' alt='Company' />

                                            )

                                        })}

                                    </div>
                                    <div className="col-sm-6">
                                        <div className="float-right">
                                            <h5 className="mt-2 mb-4">{t('work-contract.the_company')}</h5>
                                        </div>
                                        <div className="float-right">
                                            <img src={companySign} className="img-fluid" alt="Company" />
                                        </div>
                                    </div>
                                    {contract && contract.map((c, i) => {

                                        if (c.status == "un-verified") {
                                            return (
                                                <>
                                                    <div className='col-sm-6'>
                                                        <div className='mt-2 '>
                                                            <input className='btn btn-warning' onClick={handleVerify} value='Verify' />
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        } else if (c.status == 'verified') {
                                            return (
                                                <>
                                                    <div className='col-sm-6'>
                                                        <div className='mt-2 '>
                                                            <input className='btn btn-success' value='Verified' />
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        }
                                    })}
                                </div>
                                <div className="mb-4">&nbsp;</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
