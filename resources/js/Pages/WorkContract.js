import React, { useRef, useState, useEffect } from 'react'
import logo from "../Assets/image/sample.svg";
import star from "../Assets/image/icons/blue-star.png";
import SignatureCanvas from 'react-signature-canvas'
import companySign from "../Assets/image/company-sign.png";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import swal from 'sweetalert';
import Moment from 'moment';
import { useTranslation } from "react-i18next";
import i18next from 'i18next';
import { useNavigate } from 'react-router-dom';


export default function WorkContract() {

    const { t } = useTranslation();
    const navigate = useNavigate();
    const [offer, setoffer] = useState([]);
    const [services, setServices] = useState([]);
    const [client, setClient] = useState([]);
    const [contract, setContract] = useState([]);
    const param = useParams();
    const sigRef = useRef();
    const sigRef2 = useRef();
    const [signature, setSignature] = useState(null);
    const [signature2, setSignature2] = useState(null);
    const [Aaddress, setAaddress] = useState(null);
    const [ctype, setCtype] = useState("");
    const [cname, setCname] = useState("");
    const [cvv, setCvv] = useState("");
    const [status, setStatus] = useState('');
    const [card, setCard] = useState('');
    const [exy, setExy] = useState('0');
    const [exm, setExm] = useState('0');
    const [submit, setSubmit] = useState(false);
    const [oc, setOc] = useState(null);
    const [gurl, setGurl] = useState('');
    const [sesid, setSesid] = useState(null);
    const [csdata, setCsdata] = useState(null);
    const [formatValid, setFormatvalid] = useState();

    const handleAccept = (e) => {

        if (!cname && csdata == null && oc == false) { swal(t('work-contract.messages.card_holder_err'), '', 'error'); return false; }
        
        if (oc == true) {
            if (!ctype) { window.alert(t('work-contract.messages.card_type_err')); return false; }
            if (!cvv) { window.alert(t('work-contract.messages.cvv_err')); return false; }

        }

        if (!signature2) { swal(t('work-contract.messages.sign_card_err'), '', 'error'); return false; }
        if (!signature) { swal(t('work-contract.messages.sign_err'), '', 'error'); return false; }
       
        const data = {
            unique_hash: param.id,
            offer_id: offer[0].id,
            client_id: offer[0].client.id,
            additional_address: Aaddress,
            name_on_card: cname,
            status: 'un-verified',
            signature: signature,
            card_sign: signature2,
            card_type:ctype,
            cvv:cvv.substring(0, 3)
        }
        if (submit == false && sesid == null) { window.alert(t('work-contract.messages.add_card_err')); return; }

        if (oc == true) {
            const cdata = {

                "cid": client.id,
                "card_type": ctype,
                "card_number": "",
                "valid": "",
                "cc_charge": 0,
                "card_token": "",
                "cvv": cvv.substring(0, 3),
            }

            // axios.
            //     post(`/api/client/save-card`, { cdata })
            //     .then((re) => {})
        }

        if (oc == false && submit == false && sesid == null) {

            window.alert(t('Something went work with adding card. Please try again')); return;


        } else if (csdata == null && oc == false) {

            axios
                .get(`/record-invoice/${sesid}/${client.id}/${cname}`)
                .then((res) => { });
        }

        axios
            .post(`/api/client/accept-contract`, data)
            .then((res) => {
                if (res.data.error) {

                    swal('', res.data.error, 'error');

                } else if (res.data.message == 0) {

                    window.alert(t('work-contract.messages.add_card_err'));
                }

                else {
                    setStatus('un-verified');
                    swal(t('work-contract.messages.success'), '', 'success');
                    setTimeout(() => {
                        window.location.reload(true);
                    }, 2000);
                }
            });

        

    }

    const handleSignatureEnd = () => {
        setSignature(sigRef.current.toDataURL());
    }
    const clearSignature = () => {
        sigRef.current.clear();
        setSignature(null);
    }

    const handleSignatureEnd2 = () => {
        setSignature2(sigRef2.current.toDataURL());
    }
    const clearSignature2 = () => {
        sigRef2.current.clear();
        setSignature2(null);
    }
    useEffect(() => {
        console.log(signature);
    }, [signature]);

    const getOffer = () => {
        axios
            .post(`/api/client/get-offer-token`, { token: param.id })
            .then((res) => {

                if (res.data.offer.length > 0) {
                    setoffer(res.data.offer);
                    setServices(JSON.parse(res.data.offer[0].services));
                    setClient(res.data.offer[0].client);
                    setContract(res.data.contract);
                    setStatus(res.data.contract.status);
                    setOc(res.data.old_contract);
                    if (res.data.contract.add_card == 0 || res.data.old_contract == true) { setSubmit(true); }

                    if (res.data.card != null) {
                       
                        setCsdata(res.data.card);
                        let s = (res.data.card.valid).split('-');
                        let fs = ( s[1]+" / "+s[0].substring(2,4) )
                        console.log(fs);
                        setFormatvalid(fs);
                    }
                    i18next.changeLanguage(res.data.offer[0].client.lng);

                    if (res.data.offer[0].client.lng == 'heb') {
                        import('../Assets/css/rtl.css')
                        document.querySelector('html').setAttribute('dir', 'rtl')
                    }
                    else
                        document.querySelector('html').removeAttribute('dir');

                    if (res.data.offer[0].client.lng == 'heb') {
                        document.querySelector('html').setAttribute('dir', 'rtl');
                    }
                } else {
                    setoffer([]);
                    setServices([]);
                    setClient([]);
                    setContract([]);
                };
            })
    }

    const RejectContract = (e, id) => {
        e.preventDefault();
        Swal.fire({
            title: t('work-contract.messages.reject_title'),
            text: t('work-contract.messages.reject_text'),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: t('work-contract.messages.cancel'),
            confirmButtonText: t('work-contract.messages.yes_reject'),
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .post(`/api/client/reject-contract`, { id: id })
                    .then((response) => {
                        Swal.fire(
                            t('work-contract.messages.reject'),
                            t('work-contract.messages.reject_msg'),
                            "success"
                        );

                    });
                setStatus('declined');
            }
        });
    }

    const handleCard = (e) => {

        axios
            .get(`/generate-payment/${client.id}`)
            .then((res) => {
                setGurl(res.data.url);
                setSesid(res.data.session_id);
                $("#exampleModal2").modal('show');
            });
        /*

        e.preventDefault();
        if (!ctype) { window.alert(t('work-contract.messages.card_type_err')); return false; }
        if (!card) { window.alert(t('work-contract.messages.card_msg')); return false; }
        if (card.length < 16) { window.alert(t('work-contract.messages.card_msg2')); return false; }
        if (exy == '0') { window.alert(t('work-contract.messages.card_year')); return false; }
        if (exm == '0') { window.alert(t('work-contract.messages.card_month')); return false; }
        if (!cvv) { window.alert(t('work-contract.messages.cvv_err')); return false; }
        if (cvv.length < 3) { window.alert(t('work-contract.messages.invalid_cvv')); return false; }

        const msbtn = document.querySelector('.msbtn');
        msbtn.setAttribute('disabled', true);
        msbtn.innerHTML = t('work-contract.messages.please_wait');

        const cardVal = {
            "TerminalNumber": "0882016016",
            "Password": "Z0882016016",
            "Track2": "",
            "CardNumber": card,
            "ExpDate_MMYY": exm + exy.substring(2, 4)
        }

        var config = {
            method: 'post',
            url: 'https://pci.zcredit.co.il/ZCreditWS/api/Transaction/ValidateCard',
            headers: {
                'Content-Type': 'application/json'
            },
            data: cardVal
        };
        axios(config)
            .then(function (response) {
                if (response.data.HasError == true) {
                    window.alert(response.data.ReturnMessage);
                    msbtn.removeAttribute('disabled');
                    msbtn.innerHTML = t('work-contract.model_submit');
                    return;
                }
                const vd = response.data;

                var txnData = JSON.stringify({
                    "TerminalNumber": "0882016016",
                    "Password": "Z0882016016",
                    "Track2": "",
                    "CardNumber": vd.Token,
                    "CVV": "",
                    "ExpDate_MMYY": "",
                    "TransactionSum": "1.00",
                    "NumberOfPayments": "1",
                    "FirstPaymentSum": "0",
                    "OtherPaymentsSum": "0",
                    "TransactionType": "01",
                    "CurrencyType": "1",
                    "CreditType": "1",
                    "J": "0",
                    "IsCustomerPresent": "false",
                    "AuthNum": "",
                    "HolderID": "",
                    "ExtraData": "",
                    "CustomerName": "",
                    "CustomerAddress": client.geo_address,
                    "CustomerEmail": client.email,
                    "PhoneNumber": "",
                    "ItemDescription": "",
                    "ObeligoAction": "",
                    "OriginalZCreditReferenceNumber": "",
                    "TransactionUniqueIdForQuery": "",
                    "TransactionUniqueID": "",
                    "UseAdvancedDuplicatesCheck": "",
                    "ZCreditInvoiceReceipt": {
                        "Type": "0",
                        "RecepientName": "",
                        "RecepientCompanyID": "",
                        "Address": "",
                        "City": "",
                        "ZipCode": "",
                        "PhoneNum": "",
                        "FaxNum": "",
                        "TaxRate": "0",
                        "Comment": "",
                        "ReceipientEmail": "",
                        "EmailDocumentToReceipient": "",
                        "ReturnDocumentInResponse": "",
                        "Items": [
                            {
                                "ItemDescription": "Authorize card",
                                "ItemQuantity": "1",
                                "ItemPrice": "1",
                                "IsTaxFree": "false"
                            }
                        ]
                    }
                });


                var txnConfig = {
                    method: 'post',
                    url: 'https://pci.zcredit.co.il/ZCreditWS/api/Transaction/CommitFullTransaction',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: txnData
                };

                axios(txnConfig)
                    .then(function (res) {
                        if (res.data.HasError == true) {
                            window.alert(res.data.ReturnMessage);
                            msbtn.removeAttribute('disabled');
                            msbtn.innerHTML = t('work-contract.model_submit');
                            return;
                        }

                        const cdata = {

                            "cid": client.id,
                            "card_type": ctype,
                            "card_number": card,
                            "valid": exy + "-" + exm,
                            "cc_charge": 1,
                            "card_token": res.data.Token,
                            "cvv": cvv.substring(0, 3),
                        }
                     
                      
                        axios.
                            post(`/api/client/save-card`, { cdata })
                            .then((re) => {
                                document.querySelector('.closeb').click();
                                swal(t('work-contract.messages.card_success'), '', 'success');
                                setSubmit(true);
                            })

                    })

            });
            */

    }

    useEffect(() => {
        getOffer();
        let dateDropdown = document.getElementById('date-dropdown');

        let currentYear = new Date().getFullYear();
        let earliestYear = 2080;
        while (currentYear <= earliestYear) {
            let dateOption = document.createElement('option');
            dateOption.text = currentYear;
            dateOption.value = currentYear;
            dateDropdown.appendChild(dateOption);
            currentYear += 1;
        }
        setTimeout(() => {
            document.querySelector('.parent').style.display = 'block';
            var c = document.querySelectorAll("canvas");
            c.forEach((e, i) => {
                e.setAttribute('width', '300px');
                e.setAttribute('height', '115px');
            })

        }, 500);



    }, []);
   
    return (

        <div className='container parent' style={{ display: "none" }}>
            <div className='send-offer client-contract sendOfferRtl'>
                <div className='maxWidthControl dashBox mb-4'>
                    <div className='row'>
                        <div className='col-sm-6'>
                            <svg width="190" height="77" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <image xlinkHref={logo} width="190" height="77"></image>
                            </svg>
                        </div>
                        <div className='col-sm-6'>
                            {

                                (status == 'not-signed') ?
                                    <div className='mt-2 float-right'>
                                        <input className='btn btn-pink' onClick={handleAccept} value={t('work-contract.accept_contract')} />
                                        <input className='btn btn-danger mt-2' onClick={(e) => RejectContract(e, contract.id)} value={t('work-contract.button_reject')} />
                                    </div>
                                    :
                                    <div className='mt-2 float-right headMsg'>
                                        {
                                            (status == 'un-verified' || status == 'verified') ?
                                                <h4 className='btn btn-success'>{t('global.accepted')}</h4>
                                                :
                                                <h4 className='btn btn-danger'>{t('global.rejected')}</h4>
                                        }
                                    </div>
                            }
                        </div>
                    </div>
                    <h4 className='inHead' style={{ whiteSpace: 'pre-wrap' }}>{t('work-contract.inHead')}</h4>
                    <div className='signed'>
                        <p>{t('work-contract.signed')} <span>{client.city ? client.city : 'NA'}</span> on <span>{Moment(contract.created_at).format('DD MMMM,Y')}</span></p>
                    </div>
                    <div className='between'>
                        <p>{t('work-contract.between')}</p>
                        <p>{t('work-contract.broom_service')}</p>

                    </div>
                    <div className='first'>
                        <h2 className='mb-4'>{t('work-contract.first_party_title')}</h2>
                        <p style={{ textAlign: 'center' }}>{t('work-contract.and')}</p>
                        {offer && offer.map((ofr, i) => {
                            let cl = ofr.client;

                            return (
                                <>
                                    <ul className='list-inline'>
                                        <li className='list-inline-item ml-2'>{t('work-contract.full_name')} <span>{cl.firstname + " " + cl.lastname}</span></li>
                                        <li className='list-inline-item'>{t('work-contract.city')} <span>{cl.city}</span></li>
                                    </ul>
                                    <ul className='list-inline'>
                                        <li className='list-inline-item ml-2'>{t('work-contract.street_and_number')} <span>{cl.geo_address}</span></li>
                                        {/* <li className='list-inline-item'>{t('work-contract.floor')} <span>{cl.floor}</span></li>*/}
                                    </ul>
                                    <ul className='list-inline'>
                                        {/*<li className='list-inline-item ml-2'>{t('work-contract.apt_number')} <span>{cl.apt_no}</span></li>
                                        <li className='list-inline-item'>{t('work-contract.enterance_code')} <span>{cl.entrence_code}</span></li>*/}
                                    </ul>
                                    <ul className='list-inline'>
                                        <li className='list-inline-item ml-2'>{t('work-contract.telephone')} <span>{cl.phone}</span></li>
                                        <li className='list-inline-item'>{t('work-contract.email')} <span>{cl.email}</span></li>
                                    </ul>

                                </>
                            )

                        })}
                        <h2 className='mb-4'>{t('work-contract.second_party_title')}</h2>
                        <div className='whereas'>
                            <div className='info-list'>
                                <div className='icons'>
                                    <h4>{t('work-contract.whereas')}</h4>
                                </div>
                                <div className='info-text'>
                                    <p>{t('work-contract.whereas_info_text')}</p>
                                </div>
                            </div>
                            <div className='info-list'>
                                <div className='icons'>
                                    <h4>{t('work-contract.and_whereas')}</h4>
                                </div>
                                <div className='info-text'>
                                    <p>{t('work-contract.and_whereas_info_text')}</p>
                                </div>
                            </div>
                            <div className='info-list'>
                                <div className='icons'>
                                    <h4>{t('work-contract.and_whereas_2')}</h4>
                                </div>
                                <div className='info-text'>
                                    <p>{t('work-contract.and_whereas_2_info_text')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h2 className='text-center mb-4'>{t('work-contract.parties_hereby_title')}</h2>
                    <div className='shift-30'>
                        <h6>{t('work-contract.intro_subtitle')}</h6>
                        <div className='agg-list'>
                            <div className='icons'><img src={star} /></div>
                            <div className='agg-text'>
                                <p>{t('work-contract.intro_txt_1')}</p>
                            </div>
                        </div>
                        <div className='agg-list'>
                            <div className='icons'><img src={star} /></div>
                            <div className='agg-text'>
                                <p>{t('work-contract.intro_txt_2')}</p>
                            </div>
                        </div>
                        <div className='agg-list'>
                            <div className='icons'><img src={star} /></div>
                            <div className='agg-text'>
                                <p>{t('work-contract.intro_txt_3')}</p>
                            </div>
                        </div>
                        <div className='agg-list'>
                            <div className='icons'><img src={star} /></div>
                            <div className='agg-text'>
                                <p>{t('work-contract.intro_txt_4')}</p>
                            </div>
                        </div>
                        <h6 className='text-center text-underline'>{t('work-contract.service_subtitle')}</h6>
                        <div className='service-table table-responsive'>
                            <table className='table table-bordered'>
                                <tr>
                                    <td style={{ width: "60%" }}>{t('work-contract.the_service_txt')}</td>
                                    <td>
                                        {services && services.map((s, i) => {

                                            return <p>{((s.service != '10') ? s.name : s.other_title)}</p>
                                        })}
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ width: "60%" }}>{t('work-contract.location_txt')}</td>
                                    <td>
                                        {offer && offer.map((ofr, i) => {
                                            let address = (ofr.client.geo_address) ? (ofr.client.geo_address) + ", " : '';
                                            return address;
                                        })}

                                        <br /> <span style={{ fontWeight: "600" }} className='d-block mt-2'>{t('work-contract.other_address_txt')}</span> <br />
                                        {contract && contract.additional_address != null ?
                                            <input type='text' value={contract.additional_address} readOnly className='form-control' />
                                            :
                                            <input type='text' name="additional_address" onChange={(e) => setAaddress(e.target.value)} placeholder={t('work-contract.placeholder_address')} className='form-control' />
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ width: "60%" }}>{t('work-contract.service_delivery_txt')}</td>
                                    <td>{t('work-contract.as_agreed_txt')} </td>
                                </tr>
                                <tr>
                                    <td style={{ width: "60%" }}>{t('work-contract.frequency_txt')}</td>
                                    <td>

                                        {services && services.map((s, i) => {
                                            return (
                                                <p> {s.freq_name}</p>
                                            )
                                        })}

                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ width: "60%" }}>{t('work-contract.consideration_txt')}</td>
                                    <td>
                                        {services && services.map((s, i) => {

                                            return <p>{s.totalamount + t('work-contract.ils') + " + " + t('work-contract.vat') + " " + t('work-contract.for') + " " + ((s.service != '10') ? s.name : s.other_title) + ", " + s.freq_name}</p>
                                        })}
                                    </td>
                                </tr>
                                <tr>
                                    {/* <td style={{width: "60%"}}>{t('work-contract.payment_method')}</td> */}
                                    <td colSpan="2">{t('work-contract.payment_method')}</td>
                                    {/* <td>&nbsp;</td> */}
                                </tr>
                                <tr>
                                    <td colSpan="2">{t('work-contract.hereby_permit_txt')}</td>
                                    {/* <td>&nbsp;</td> */}
                                </tr>


                                {/*<tr>
                                    <td style={{ width: "60%" }}>{t('work-contract.card_number')}</td>
                                    <td>
                                    { contract && contract.name_on_card != null ?
                                      <input type="text" value={contract.name_on_card} className="form-control" readOnly/>
                                      :
                                    <input type='text' name="name_on_card" onChange={(e) => setCname(e.target.value)} className='form-control' placeholder={t('work-contract.card_number')} />
                                    }
                                    </td>
                                </tr>

                                <tr>
                                    <td style={{ width: "60%" }}>{t('work-contract.card_expiry')}</td>
                                    <td>
                                    { contract && contract.name_on_card != null ?
                                      <input type="text" value={contract.name_on_card} className="form-control" readOnly/>
                                      :
                                    <input type='text' name="name_on_card" onChange={(e) => setCname(e.target.value)} className='form-control' placeholder={t('work-contract.card_expiry')} />
                                    }
                                    </td>
                                </tr>*/}

                                {
                                    oc != false &&
                                    <tr>
                                        <td><label className="control-label">
                                            {t('work-contract.card_type')}
                                        </label></td>
                                        <td>
                                            <select className='form-control' onChange={(e) => setCtype(e.target.value)}>
                                                <option> {t('work-contract.please_select')}</option>
                                                <option value='Visa' selected={contract.card_type == 'Visa'}>Visa</option>
                                                <option value='Master Card' selected={contract.card_type == 'Master Card'}>Master Card</option>
                                                <option value='American Express' selected={contract.card_type == 'American Express'}>American Express</option>
                                            </select>
                                        </td>
                                    </tr>
                                }

                                {(oc == true || csdata == null) && <tr>
                                    <td style={{ width: "60%" }}>{t('work-contract.card_name')}</td>
                                    <td>
                                        {contract && contract.name_on_card != null ?
                                            <input type="text" value={contract.name_on_card} className="form-control" readOnly />
                                            :
                                            <input type='text' name="name_on_card" onChange={(e) => setCname(e.target.value)} className='form-control' placeholder={t('work-contract.card_name')} />
                                        }
                                    </td>
                                </tr>}

                                {oc == false && csdata &&
                                    <>
                                        <tr>
                                            <td style={{ width: "60%" }}>{t('work-contract.card.four_digits')}</td>
                                            <td>
                                               <span className='form-control'>{ csdata.card_number}</span>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td style={{ width: "60%" }}>{t('work-contract.card.valid')}</td>
                                            <td>
                                               <span className='form-control'>{ formatValid }</span>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td style={{ width: "60%" }}>{t('work-contract.card.type')}</td>
                                            <td>
                                               <span className='form-control'>{ csdata.card_type}</span>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td style={{ width: "60%" }}>{t('work-contract.card.holder')}</td>
                                            <td>
                                               <span className='form-control'>{ csdata.card_holder}</span>
                                            </td>
                                        </tr>
                                    </>
                                }



                                {
                                    oc != false &&
                                    <tr>
                                        <td> <label className="control-label">
                                            {t('work-contract.card_cvv')}
                                        </label></td>
                                        <td>

                                        {contract && contract.name_on_card != null ?
                                            <input type="text" value={contract.cvv} className="form-control" readOnly />
                                            :
                                            <input type='text' name="cvv" onChange={(e) => setCvv(e.target.value)} onKeyUp={(e) => { if (e.target.value.length >= 3) e.target.value = e.target.value.slice(0, 3); }} className='form-control' placeholder={t('work-contract.card_cvv')} />
                                        }

                                          
                                        </td>
                                    </tr>
                                }

                                <tr>
                                    <td style={{ width: "60%" }}>{t('work-contract.signature')}</td>
                                    <td>
                                        {contract && contract.card_sign != null ?
                                            <img src={contract.card_sign} />
                                            :
                                            <>
                                                <SignatureCanvas
                                                    penColor="black"
                                                    canvasProps={{ className: 'sigCanvas', width: 300, height: 115 }}
                                                    ref={sigRef2}
                                                    onEnd={handleSignatureEnd2}
                                                />
                                                <button className='btn btn-warning' onClick={clearSignature2}>{t('work-contract.btn_warning_txt')}</button>
                                            </>
                                        }

                                    </td>
                                </tr>
                               

                                {oc == false && contract.add_card == 1 && <tr>
                                    <td style={{ width: "60%" }}>{t('work-contract.add_card_txt')}</td>
                                    <td>
                                        {
                                            (status == 'not-signed' && submit == false) && <button className='btn btn-success ac' onClick={e => handleCard(e)}>{t('work-contract.add_card_btn')}</button>
                                        }
                                        {
                                            (status != 'not-signed') && <span className='text text-success font-weight-bold' > Verified </span>
                                        }
                                    </td>
                                </tr>
                                }

                              

                                <tr>
                                    <td style={{ width: "60%" }}>{t('work-contract.miscellaneous_txt')}</td>
                                    <td>{t('work-contract.employees_txt')}</td>
                                </tr>
                            </table>
                        </div>
                        <h6 className='text-underline'>{t('work-contract.tenant_subtitle')}</h6>
                        <div className='agg-list'>
                            <div className='icons'><img src={star} /></div>
                            <div className='agg-text'>
                                <p>{t('work-contract.tenant_txt_1')}</p>
                            </div>
                        </div>
                        <div className='agg-list'>
                            <div className='icons'><img src={star} /></div>
                            <div className='agg-text'>
                                <p>{t('work-contract.tenant_txt_2')}</p>
                            </div>
                        </div>
                        <div className='agg-list'>
                            <div className='icons'><img src={star} /></div>
                            <div className='agg-text'>
                                <p>{t('work-contract.tenant_txt_3')}</p>
                            </div>
                        </div>
                        <div className='agg-list'>
                            <div className='icons'><img src={star} /></div>
                            <div className='agg-text'>
                                <p>{t('work-contract.tenant_txt_4')}</p>
                            </div>
                        </div>
                        <div className='agg-list'>
                            <div className='icons'><img src={star} /></div>
                            <div className='agg-text'>
                                <p style={{ whiteSpace: 'pre-wrap' }}>{t('work-contract.tenant_txt_5')}</p>
                            </div>
                        </div>
                        <div className='agg-list'>
                            <div className='icons'><img src={star} /></div>
                            <div className='agg-text'>
                                <p style={{ backgroundColor: 'yellow' }}>{t('work-contract.tenant_txt_6')}</p>
                            </div>
                        </div>
                        <div className='agg-list'>
                            <div className='icons'><img src={star} /></div>
                            <div className='agg-text'>
                                <p style={{ backgroundColor: 'yellow' }}>{t('work-contract.tenant_txt_7')}</p>
                            </div>
                        </div>
                        <div className='agg-list'>
                            <div className='icons'><img src={star} /></div>
                            <div className='agg-text'>
                                <p style={{ backgroundColor: 'yellow' }}>{t('work-contract.tenant_txt_8')}</p>
                            </div>
                        </div>
                        <h6 className='text-underline'>{t('work-contract.company_subtitle')}</h6>
                        <div className='agg-list'>
                            <div className='icons'><img src={star} /></div>
                            <div className='agg-text'>
                                <p style={{ whiteSpace: 'pre-wrap' }}>{t('work-contract.company_txt_1')}</p>
                            </div>
                        </div>
                        <div className='agg-list'>
                            <div className='icons'><img src={star} /></div>
                            <div className='agg-text'>
                                <p>{t('work-contract.company_txt_2')}</p>
                            </div>
                        </div>
                        <div className='agg-list'>
                            <div className='icons'><img src={star} /></div>
                            <div className='agg-text'>
                                <p>{t('work-contract.company_txt_3')} </p>
                            </div>
                        </div>
                        <div className='agg-list'>
                            <div className='icons'><img src={star} /></div>
                            <div className='agg-text'>
                                <p>{t('work-contract.company_txt_4')} </p>
                            </div>
                        </div>
                        <div className='agg-list'>
                            <div className='icons'><img src={star} /></div>
                            <div className='agg-text'>
                                <p>{t('work-contract.company_txt_5')} </p>
                            </div>
                        </div>
                        <div className='agg-list'>
                            <div className='icons'><img src={star} /></div>
                            <div className='agg-text'>
                                <p>{t('work-contract.company_txt_6')} </p>
                            </div>
                        </div>
                        <div className='agg-list'>
                            <div className='icons'><img src={star} /></div>
                            <div className='agg-text'>
                                <p>{t('work-contract.company_txt_7')}</p>
                            </div>
                        </div>
                        <h6 className='text-underline'>{t('work-contract.general_subtitle')}</h6>
                        <div className='agg-list'>
                            <div className='icons'><img src={star} /></div>
                            <div className='agg-text'>
                                <p>{t('work-contract.general_txt_1')}</p>
                            </div>
                        </div>
                        <div className='agg-list'>
                            <div className='icons'><img src={star} /></div>
                            <div className='agg-text'>
                                <p>{t('work-contract.general_txt_2')} </p>
                            </div>
                        </div>
                        <div className='agg-list'>
                            <div className='icons'><img src={star} /></div>
                            <div className='agg-text'>
                                <p>{t('work-contract.general_txt_3')}</p>
                            </div>
                        </div>
                        <h6 className='text-center text-underline mt-3 mb-4'>{t('work-contract.signed_title')}</h6>
                        <div className='row'>
                            <div className='col-sm-6'>
                                <h5 className='mt-2 mb-4'>{t('work-contract.the_tenant_subtitle')}</h5>
                                <h6>{t('work-contract.draw_signature')}</h6>
                                {contract && contract.signature != null ?
                                    <img src={contract.signature} />
                                    :
                                    <>
                                        <SignatureCanvas
                                            penColor="black"
                                            canvasProps={{ className: 'sigCanvas' }}
                                            ref={sigRef}
                                            onEnd={handleSignatureEnd}
                                        />
                                        <button className='btn btn-warning' onClick={clearSignature}>{t('work-contract.btn_warning_txt')}</button>
                                    </>
                                }
                            </div>
                            <div className='col-sm-6'>
                                <div className='float-right'>
                                    <h5 className='mt-2 mb-4'>{t('work-contract.the_company')}</h5>
                                </div>
                                <div className='float-right'>
                                    <img src={companySign} className='img-fluid' alt='Company' />
                                </div>
                            </div>
                            {

                                (status == 'not-signed') ?
                                    <div className=' col-sm-12 mt-2 float-right'>
                                        <input className='btn btn-pink' onClick={handleAccept} value={t('work-contract.accept_contract')} />
                                    </div>
                                    : ''
                            }

                        </div>

                        <div className='mb-4'>&nbsp;</div>
                        <div className="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel">Add credit card</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">

                                        <div className="row">


                                            <div className="col-sm-12">
                                                <div className="form-group">
                                                    <label className="control-label">
                                                        {t('work-contract.card_type')}
                                                    </label>
                                                    <select className='form-control' onChange={(e) => setCtype(e.target.value)}>
                                                        <option> {t('work-contract.please_select')}</option>
                                                        <option value='Visa'>Visa</option>
                                                        <option value='Master Card'>Master Card</option>
                                                        <option value='American Express'>American Express</option>
                                                    </select>


                                                </div>
                                            </div>

                                            <div className="col-sm-12">
                                                <div className="form-group">
                                                    <label className="control-label">
                                                        {t('work-contract.card_number')}
                                                    </label>
                                                    <input
                                                        type="number"
                                                        onChange={(e) => {
                                                            e.target.value = e.target.value.slice(0, 16)
                                                            setCard(e.target.value);

                                                        }
                                                        }

                                                        className="form-control"
                                                        required
                                                        placeholder={t('work-contract.card_number')}
                                                    />


                                                </div>
                                            </div>

                                            <div className="col-sm-12">
                                                <div className="form-group">
                                                    <label className="control-label">
                                                        {t('work-contract.card_ex_year')}
                                                    </label>
                                                    <select id='date-dropdown' className='form-control' onChange={e => setExy(e.target.value)}>
                                                        <option value="0">{t('work-contract.select_year')}</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="col-sm-12">
                                                <div className="form-group">
                                                    <label className="control-label">
                                                        {t('work-contract.card_ex_month')}
                                                    </label>
                                                    <select className='form-control' onChange={e => setExm(e.target.value)}>
                                                        <option value="0">{t('work-contract.select_month')}</option>
                                                        <option value="01" >01</option>
                                                        <option value="02" >02</option>
                                                        <option value="03" >03</option>
                                                        <option value="04" >04</option>
                                                        <option value="05" >05</option>
                                                        <option value="06" >06</option>
                                                        <option value="07" >07</option>
                                                        <option value="08" >08</option>
                                                        <option value="09" >09</option>
                                                        <option value="10" >10</option>
                                                        <option value="11" >11</option>
                                                        <option value="12" >12</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="col-sm-12">
                                                <div className="form-group">
                                                    <label className="control-label">
                                                        {t('work-contract.card_cvv')}
                                                    </label>
                                                    <input type='text' name="cvv" onChange={(e) => setCvv(e.target.value)} onKeyUp={(e) => { if (e.target.value.length >= 3) e.target.value = e.target.value.slice(0, 3); }} className='form-control' placeholder={t('work-contract.card_cvv')} />
                                                </div>
                                            </div>

                                        </div>


                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary closeb" data-dismiss="modal">{t('client.jobs.view.close')}</button>
                                        <button type="button" onClick={e => handleCard(e)} className="btn btn-primary msbtn">{t('work-contract.model_submit')}</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*Iframe*/}
                        <div className="modal fade" id="exampleModal2" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel2" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                                <div className="modal-content" >
                                    <div className="modal-header">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal" aria-label="Close">
                                            {t('work-contract.back_btn')}
                                        </button>
                                    </div>
                                    <div className="modal-body">

                                        <div className="row">


                                            <div className="col-sm-12">
                                                <div className="form-group">
                                                    <iframe src={gurl} title="Pay Card Transaction" width="100%" height="800"></iframe>
                                                </div>
                                            </div>



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
