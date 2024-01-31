import React,{ useRef, useState,useEffect } from 'react'
import star from "../Assets/image/icons/blue-star.png";
import SignatureCanvas from 'react-signature-canvas'
import companySign from "../Assets/image/company-sign.png";
import { useParams } from 'react-router-dom';
import { Base64 } from "js-base64";
import swal from 'sweetalert';
import i18next from 'i18next';
import { useTranslation } from "react-i18next";

export default function WorkerContract() {

    const { t } = useTranslation();
    const param = useParams();
    const sigRef2 = useRef();
    const [signature2, setSignature2] = useState(null);


    const [worker_name,setWorkerName] = useState("");
    const [worker_id,setWorkerId] = useState(0);
    const [address,setAddress] = useState('');

    const handleSignatureEnd2 = () => {
        setSignature2(sigRef2.current.toDataURL());
    }
    const clearSignature2 = () => {
        sigRef2.current.clear();
        setSignature2(null);
    }
    const handleAccept = (e) =>{
        if(!signature2){ swal('Please sign digital signature on the contract','','error'); return false;}

        const data = {
            worker_id:worker_id,
            worker_contract:signature2
        }

        axios
        .post(`/api/work-contract`,data)
        .then((res)=>{
            if(res.data.error){
                swal('',res.data.error,'error');
            } else{
            swal(res.data.message,'','success')
            setTimeout(()=>{
                window.location.href="/worker/login";
            },1000)
        }
        })
    }
    const getWorker = () =>{
        axios
        .post(`/api/worker-detail`,{'worker_id':Base64.decode(param.id)})
        .then((res)=>{

            if(res.data.worker){
               let w = res.data.worker;
               setWorkerName(w.firstname+' '+w.lastname);
               setWorkerId(w.worker_id);
               setAddress(w.address);
               setSignature2(w.worker_contract);
               i18next.changeLanguage(w.lng);
               if(w.lng == 'heb'){
                import('../Assets/css/rtl.css');
                document.querySelector('html').setAttribute('dir','rtl');
               } else{
                document.querySelector('html').removeAttribute('dir');
               }
            }
        })
    }

    useEffect(()=>{
        getWorker();
    },[]);
  return (
    <div className='container'>
        <div className='send-offer worker-contract client-contract'>
            <div className='maxWidthControl dashBox mb-4'>
                <h4 className='inHead'>{ t('worker_contract.company') }</h4>
                <h4 className='inHead'>{ t('worker_contract.p_e_a') }</h4>
                <div className='signed'>
                    <p>{ t('worker_contract.made_in') } <span>{ t('worker_contract.state') }</span>  <span>22-02-2023</span></p>
                </div>
                <div className='between'>
                    <p>{ t('worker_contract.between') }</p>
                    <p>{ t('worker_contract.company_name') }</p>
                    <p>{ t('worker_contract.company_address') }</p>
                    <p>({ t('worker_contract.hereinafter') } <strong>{ t('worker_contract.the_company') }</strong>)</p>
                </div>
                <h2 className='mb-2 text-center'>{ t('worker_contract.and') }</h2>
                <div className='between'>
                    <p>&nbsp;</p>
                    <p>{ worker_name }, ID: #{ worker_id }</p>
                    <p>{ address }</p>
                    <p>({ t('worker_contract.hereinafter') } <strong>{ t('worker_contract.the_employee') }</strong>)</p>
                </div>
                <div className='whereas mt-4'>
                    <div className='info-list'>
                        <div className='icons'>
                            <h4>{ t('worker_contract.whereas') }</h4>
                        </div>
                        <div className='info-text'>
                            <p>{ t('worker_contract.employee_text') }</p>
                        </div>
                    </div>
                    <div className='info-list'>
                        <div className='icons'>
                            <h4>{ t('worker_contract.and') } { t('worker_contract.whereas') }</h4>
                        </div>
                        <div className='info-text'>
                            <p>{ t('worker_contract.compant_text') }</p>
                        </div>
                    </div>
                    <div className='info-list'>
                        <div className='icons'>
                            <h4>{ t('worker_contract.and') } { t('worker_contract.whereas') }</h4>
                        </div>
                        <div className='info-text'>
                            <p>{ t('worker_contract.both_party_text') }</p>
                        </div>
                    </div>
                </div>
                <h2 className='text-center mb-4'>{ t('worker_contract.term_condition') }</h2>
                <div className='shift-30'>
                    <h6 className='text-underline'>{ t('worker_contract.heading_1') }</h6>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>{ t('worker_contract.heading_1_1') }</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>{ t('worker_contract.heading_1_2') }</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>{ t('worker_contract.heading_1_3') }</p>
                        </div>
                    </div>
                </div>
                <div className='shift-30'>
                    <h6 className='text-underline'>{ t('worker_contract.heading_2') }</h6>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>{ t('worker_contract.heading_2_1') }</p>
                        </div>
                    </div>
                </div>
                <div className='shift-30'>
                    <h6 className='text-underline'>{ t('worker_contract.heading_3') }</h6>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>{ t('worker_contract.heading_3_1') }</p>
                        </div>
                    </div>
                </div>
                <div className='shift-30'>
                    <h6 className='text-underline'>{ t('worker_contract.heading_4') }</h6>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>{ t('worker_contract.heading_4_1') }</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>{ t('worker_contract.heading_4_2') }</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>{ t('worker_contract.heading_4_3') }</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>{ t('worker_contract.heading_4_4') }</p>
                        </div>
                    </div>
                </div>
                <div className='shift-30'>
                    <h6 className='text-underline'>{ t('worker_contract.heading_5') }</h6>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>{ t('worker_contract.heading_5_1') }</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>{ t('worker_contract.heading_5_2') }</p>
                            <div className='shift-30'>
                                <div className='agg-list'>
                                    <div className='icons'><img src={star} /></div>
                                    <div className='agg-text'>
                                        <p>{ t('worker_contract.heading_5_2_1') }</p>
                                    </div>
                                </div>
                                <div className='agg-list'>
                                    <div className='icons'><img src={star} /></div>
                                    <div className='agg-text'>
                                        <p>{ t('worker_contract.heading_5_2_2') }</p>
                                    </div>
                                </div>
                                <div className='agg-list'>
                                    <div className='icons'><img src={star} /></div>
                                    <div className='agg-text'>
                                        <p>{ t('worker_contract.heading_5_2_3') }</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='shift-30'>
                    <h6 className='text-underline'>{ t('worker_contract.heading_6') }</h6>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>{ t('worker_contract.heading_6_1') }</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>{ t('worker_contract.heading_6_2') }</p>
                        </div>
                    </div>
                </div>
                <div className='shift-30'>
                    <h6 className='text-underline'>7. { t('worker_contract.heading_7') }</h6>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>{ t('worker_contract.heading_7_1') }</p>
                            <div className='shift-30'>
                                <div className='agg-list'>
                                    <div className='icons'><img src={star} /></div>
                                    <div className='agg-text'>
                                        <p>{ t('worker_contract.heading_7_1_1') }</p>
                                    </div>
                                </div>
                                <div className='agg-list'>
                                    <div className='icons'><img src={star} /></div>
                                    <div className='agg-text'>
                                        <p>{ t('worker_contract.heading_7_1_2') }</p>
                                    </div>
                                </div>
                                <div className='agg-list'>
                                    <div className='icons'><img src={star} /></div>
                                    <div className='agg-text'>
                                        <p>{ t('worker_contract.heading_7_1_3') }</p>
                                    </div>
                                </div>
                                <div className='agg-list'>
                                    <div className='icons'><img src={star} /></div>
                                    <div className='agg-text'>
                                        <p>{ t('worker_contract.heading_7_1_4') }</p>
                                    </div>
                                </div>
                                <div className='agg-list'>
                                    <div className='icons'><img src={star} /></div>
                                    <div className='agg-text'>
                                        <p>{ t('worker_contract.heading_7_1_5') }</p>
                                    </div>
                                </div>
                                <div className='agg-list'>
                                    <div className='icons'><img src={star} /></div>
                                    <div className='agg-text'>
                                        <p>{ t('worker_contract.heading_7_1_6') }</p>
                                    </div>
                                </div>
                                <div className='agg-list'>
                                    <div className='icons'><img src={star} /></div>
                                    <div className='agg-text'>
                                        <p>{ t('worker_contract.heading_7_1_7') }</p>
                                    </div>
                                </div>
                                <div className='agg-list'>
                                    <div className='icons'><img src={star} /></div>
                                    <div className='agg-text'>
                                        <p>{ t('worker_contract.heading_7_1_8') }</p>
                                    </div>
                                </div>
                                <div className='agg-list'>
                                    <div className='icons'><img src={star} /></div>
                                    <div className='agg-text'>
                                        <p>{ t('worker_contract.heading_7_1_9') }</p>
                                    </div>
                                </div>
                                <div className='agg-list'>
                                    <div className='icons'><img src={star} /></div>
                                    <div className='agg-text'>
                                        <p>{ t('worker_contract.heading_7_1_10') }</p>
                                    </div>
                                </div>
                                <div className='agg-list'>
                                    <div className='icons'><img src={star} /></div>
                                    <div className='agg-text'>
                                        <p>{ t('worker_contract.heading_7_1_11') }</p>
                                    </div>
                                </div>
                                <div className='agg-list'>
                                    <div className='icons'><img src={star} /></div>
                                    <div className='agg-text'>
                                        <p>{ t('worker_contract.heading_7_1_12') }</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='shift-30'>
                    <h6 className='text-underline'>{ t('worker_contract.heading_8') }</h6>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>{ t('worker_contract.heading_8_1') }</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>{ t('worker_contract.heading_8_2') }</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>{ t('worker_contract.heading_8_3') }</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>{ t('worker_contract.heading_8_4') }</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>{ t('worker_contract.heading_8_5') }</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>{ t('worker_contract.heading_8_6') }</p>
                        </div>
                    </div>
                </div>
                <div className='shift-30'>
                    <h6 className='text-underline'>{ t('worker_contract.heading_9') }</h6>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>{ t('worker_contract.heading_9_1') }</p>
                        </div>
                    </div>
                </div>
                <div className='shift-30'>
                    <h6 className='text-underline'>{ t('worker_contract.heading_10') }</h6>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>{ t('worker_contract.heading_10_1') }</p>
                        </div>
                    </div>
                </div>
                <div className='shift-30'>
                    <h6 className='text-underline'>{ t('worker_contract.heading_11') }</h6>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>{ t('worker_contract.heading_11_1') }</p>
                        </div>
                    </div>
                </div>
                <div className='shift-30'>
                    <h6 className='text-underline'>{ t('worker_contract.heading_12') }</h6>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>{ t('worker_contract.heading_12_1') }</p>
                        </div>
                    </div>
                </div>
                <div className='shift-30'>
                    <h6 className='text-underline'>{ t('worker_contract.heading_13') }</h6>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>{ t('worker_contract.heading_13_1') }</p>
                        </div>
                    </div>
                </div>
                <div className='shift-30'>
                    <h6 className='text-underline'>{ t('worker_contract.heading_14') }</h6>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>{ t('worker_contract.heading_14_1') }</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>{ t('worker_contract.heading_14_2') }</p>
                        </div>
                    </div>
                </div>
                <div className='shift-30'>
                    <h6 className='text-underline'>{ t('worker_contract.heading_15') }</h6>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>{ t('worker_contract.heading_15_1') }</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>{ t('worker_contract.heading_15_2') }</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>{ t('worker_contract.heading_15_3') }</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>{ t('worker_contract.heading_15_4') }</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>{ t('worker_contract.heading_15_5') }</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>{ t('worker_contract.heading_15_6') }</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>{ t('worker_contract.heading_15_7') }</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>{ t('worker_contract.heading_15_8') }</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>{ t('worker_contract.heading_15_9') }</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>{ t('worker_contract.heading_15_10') }</p>
                        </div>
                    </div>
                </div>
                <div className='shift-30'>
                    <h6 className='text-underline'>{ t('worker_contract.heading_16') }</h6>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>{ t('worker_contract.heading_16_1') }</p>
                        </div>
                    </div>
                </div>
                <div className='shift-30'>
                    <h6 className='text-underline'>{ t('worker_contract.heading_17') }</h6>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>{ t('worker_contract.heading_17_1') }</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>{ t('worker_contract.heading_17_2') }</p>
                        </div>
                    </div>
                </div>
                <div className='shift-30'>
                    <h6 className='text-underline'>{ t('worker_contract.heading_18') }</h6>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>{ t('worker_contract.heading_18_1') }</p>
                        </div>
                    </div>
                </div>
                <div className='shift-30'>
                    <h6 className='text-underline'>{ t('worker_contract.heading_19') }</h6>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>{ t('worker_contract.heading_19_1') }</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>{ t('worker_contract.heading_19_2') }</p>
                        </div>
                    </div>
                    <h5>{ t('worker_contract.company_greet') }</h5>
                    <h6 className='text-center text-underline mt-3 mb-4'>{ t('worker_contract.in_witness') }</h6>
                    <div className='row'>
                        <div className='col-sm-6'>
                            <h5 className='mt-2'>{ t('worker_contract.the_company') }</h5>
                            <h6 style={{fontWeight: "600", fontSize: "14px"}}>{ t('worker_contract.draw_signature') }</h6>
                            <img src={companySign} className='img-fluid' alt='Company' />
                        </div>
                        <div className='col-sm-6'>
                            <h5 className='mt-2'>{ t('worker_contract.the_employee') }</h5>
                            <h6 style={{fontWeight: "600", fontSize: "14px"}}>{ t('worker_contract.draw_signature') }</h6>
                            <SignatureCanvas
                                penColor="black"
                                canvasProps={{className: 'sigCanvas'}}
                                ref={sigRef2}
                                onEnd={handleSignatureEnd2}
                            />
                            <button className='btn btn-warning' onClick={clearSignature2}>{ t('worker_contract.clear_btn') }</button>
                        </div>
                        <div className=' col-sm-12 mt-2 float-right'>
                            <input className='btn btn-pink' onClick={handleAccept} value={t('work-contract.accept_contract')} />
                        </div>
                    </div>
                    <div className='mb-4'>&nbsp;</div>
                </div>
            </div>
        </div>
    </div>
  )
}
