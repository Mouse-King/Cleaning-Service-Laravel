import React,{ useRef, useState,useEffect } from 'react'
import star from "../../Assets/image/icons/blue-star.png";
import SignatureCanvas from 'react-signature-canvas'
import companySign from "../../Assets/image/company-sign.png";
import { useParams } from 'react-router-dom';
import swal from 'sweetalert';
import { useTranslation } from "react-i18next";
import i18next from 'i18next';

export default function WorkerContract() {

    const { t } = useTranslation();
    const params  = useParams();
    const sigRef2 = useRef();
    const [signature2, setSignature2] = useState(null);


    const [worker_name,setWorkerName] = useState("");
    const [worker_id,setWorkerId] = useState(0);
    const [address,setAddress] = useState('');

    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("worker-token"),
    };

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
    }
    const getWorker = () =>{
        axios
        .get(`/api/details`,{ headers })
        .then((res)=>{

            if(res.data.success){
               let w = res.data.success;
               setWorkerName(w.firstname+' '+w.lastname);
               setWorkerId(w.worker_id);
               setAddress(w.address);
               setSignature2(w.worker_contract);
            }
        })
    }

    useEffect(()=>{
        getWorker();
    },[]);
  return (
    <div className='container'>
        {signature2 ? 
        <div className='send-offer worker-contract client-contract'>
            <div className='maxWidthControl dashBox mb-4'>
                <h4 className='inHead'>Broom Service L.M. Ltd., Private Company no. 515184208</h4>
                <h4 className='inHead'>Personal Employment Agreement</h4>
                <div className='signed'>
                    <p>Made and Signed in: <span>New Delhi</span> on <span>22-02-2023</span></p>
                </div>
                <div className='between'>
                    <p>Between:</p>
                    <p>Broom Service L.M. Ltd</p>
                    <p>Bnei Dan St, Tel Aviv-Yafo, Israel</p>
                    <p>(Hereinafter: <strong>“the Company”</strong>)</p>
                </div>
                <h2 className='mb-2 text-center'>And</h2>
                <div className='between'>
                    <p>&nbsp;</p>
                    <p>{ worker_name }, ID: #{ worker_id }</p>
                    <p>{ address }</p>
                    <p>(Hereinafter: <strong>“the Employee”</strong>)</p>
                </div>
                <div className='whereas mt-4'>
                    <div className='info-list'>
                        <div className='icons'>
                            <h4>Whereas:</h4>
                        </div>
                        <div className='info-text'>
                            <p>the Employee is interested in being employed by the Company, under the terms and stipulations set forth in this contract</p>
                        </div>
                    </div>
                    <div className='info-list'>
                        <div className='icons'>
                            <h4>And whereas:</h4>
                        </div>
                        <div className='info-text'>
                            <p>the Company is interested in employing the Employee, under the terms and stipulations set forth in this contract</p>
                        </div>
                    </div>
                    <div className='info-list'>
                        <div className='icons'>
                            <h4>And whereas:</h4>
                        </div>
                        <div className='info-text'>
                            <p>the parties wish to arrange the employment terms of the Employee with the Company, in a written personal employment contract, to which no terms of any collective agreement whatsoever shall apply</p>
                        </div>
                    </div>
                </div>
                <h2 className='text-center mb-4'>Therefore it was declared, stipulated and agreed between the parties as follows:</h2>
                <div className='shift-30'>
                    <h6 className='text-underline'>1. Preamble, appendixes and titles</h6>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>1.1	The preamble to this agreement and the appendixes thereto, whether attached to the agreement or not, constitute an inseparable part thereof and are as binding as its other terms.</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>1.2	The titles in this agreement are for orientation and convenience purposes only, are not fundamental stipulations and shall not serve in its interpretation.</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>1.3	This agreement replaces any previous agreement or memorandum, whether oral or written.</p>
                        </div>
                    </div>
                </div>
                <div className='shift-30'>
                    <h6 className='text-underline'>2. Personal work agreement</h6>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>2.1 The Employee undertakes towards the company to work in the Company as a foreman and maintenance manager, and the Company undertakes towards the Employee to employ him in the Company, all subject to the provisions of this personal employment contract</p>
                        </div>
                    </div>
                </div>
                <div className='shift-30'>
                    <h6 className='text-underline'>3. The employment term</h6>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>3.1.	The Employee’s employment term in accordance with this contract is as of <strong className='text-underline'>26-02-2023</strong></p>
                        </div>
                    </div>
                </div>
                <div className='shift-30'>
                    <h6 className='text-underline'>4. Advance notice</h6>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>4.1.	The termination of this employment contract, the expiry of its validity and the employment of the Employee in accordance therewith shall be done by giving notice by each party, in advance and in writing in accordance with the stated in the Advance Notice for Dismissal and Resignation Law, 5761-2001.</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>4.2.	Throughout the advance notice term, the Employee shall be paid his regular salary and all accompanying benefits in accordance with the contract</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>4.3.	If the Company has given the Employee an advance notice regarding the termination of his employment – it shall be entitled to instruct him to not show up at work during the advance notice term, and to pay him all amounts which would have been due to him had he worked during the advance notice term, subject to returning the car, telephone, laptop and any other equipment he has received from the Company.</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>4.4.	Despite the foregoing, the Company shall be entitled to terminate the term of this contract and the Employee’s employment in accordance therewith immediately, without giving severance pay and without any advance notice, in case of a founded suspicion that the Employee has performed and action and/or omission of a criminal nature and/or the Employee has breached the duty of care towards the Company and/or the Employee has been grossly negligent in performing his work for the Company, and/or if the Employee has refused to correct any breaching of the agreement after being given an extension of 14 days and/or a shorter extension, as the case may be, to do so, or if he has fundamentally breached the agreement. In this case, all of the Company’s undertaking towards the Employee in accordance with this contract and/or by any law shall terminate immediately</p>
                        </div>
                    </div>
                </div>
                <div className='shift-30'>
                    <h6 className='text-underline'>5. Role definition</h6>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>5.1.	The Company shall employ the Employee, and the Employee undertakes to work for the Company as a foreman and maintenance manager</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>5.2.	The description of the Employee’s roles, his fields of occupation and his authorities shall be determined from time to time by the Company management, throughout the agreement term, as it is defined hereinafter:</p>
                            <div className='shift-30'>
                                <div className='agg-list'>
                                    <div className='icons'><img src={star} /></div>
                                    <div className='agg-text'>
                                        <p>5.2.1 Housekeeping</p>
                                    </div>
                                </div>
                                <div className='agg-list'>
                                    <div className='icons'><img src={star} /></div>
                                    <div className='agg-text'>
                                        <p>5.2.2 Working to the satisfaction of the Company’s clients and at the Company’s standards.</p>
                                    </div>
                                </div>
                                <div className='agg-list'>
                                    <div className='icons'><img src={star} /></div>
                                    <div className='agg-text'>
                                        <p>5.2.3 Responsibility and keeping the Company’s equipment and the cleaning materials which the Company shall provide the Employee.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='shift-30'>
                    <h6 className='text-underline'>6 Work days and working hours</h6>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>6.1 The Employee’s work days and working house shall be as follows: at most: Sunday to Thursday, about 9 hours a day.</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>6.2 Fridays if necessary.</p>
                        </div>
                    </div>
                </div>
                <div className='shift-30'>
                    <h6 className='text-underline'>7. The Employee’s duties</h6>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>7.1 The Employee undertakes towards the Company as follows:</p>
                            <div className='shift-30'>
                                <div className='agg-list'>
                                    <div className='icons'><img src={star} /></div>
                                    <div className='agg-text'>
                                        <p>7.1.1 To fill his position diligently, skillfully and with dedication, for the effective and true performance of his work, for the benefit of the Company and for promoting its business, to use all of his skills, knowledge and experience for the Company’s benefit and to act in complete loyalty towards the Company.</p>
                                    </div>
                                </div>
                                <div className='agg-list'>
                                    <div className='icons'><img src={star} /></div>
                                    <div className='agg-text'>
                                        <p>7.1.2 To not place himself in any way whatsoever in a state of conflict of interests with the Company and/or with anyone on its behalf, and in any such situation, or when there is reasonable concern that such a situation might occur – to immediately report it to his superiors.</p>
                                    </div>
                                </div>
                                <div className='agg-list'>
                                    <div className='icons'><img src={star} /></div>
                                    <div className='agg-text'>
                                        <p>7.1.3.	To not make any use whatsoever in the Company’s knowledge for the benefit of his personal business, or for the benefit of others.</p>
                                    </div>
                                </div>
                                <div className='agg-list'>
                                    <div className='icons'><img src={star} /></div>
                                    <div className='agg-text'>
                                        <p>7.1.4.	To not receive from any other person or body, throughout his employment by the Company, any benefit, direct or indirect, pertaining to his work for the Company, directly or indirectly.</p>
                                    </div>
                                </div>
                                <div className='agg-list'>
                                    <div className='icons'><img src={star} /></div>
                                    <div className='agg-text'>
                                        <p>7.1.5.	The Employee irrevocable undertakes that throughout the agreement term and for 18 months after its termination, he shall not approach by himself and/or by anyone on his behalf, any of the tenants and/or managers of the sites and/or any of the suppliers and/or any of the previous and/or current and/or future Company clients in order to offer the service and/or work which is the subject of this agreement, and he hereby confirms that he is aware that the sites and/or tenants which shall be supplied to him for the purpose of providing the service by the Company are bound by an exclusive agreement with the Company, and that for breaching the stated in this clause he shall pay the Company a pre-agreed and pre-known compensation at a total of 1,000,000 ILS. The parties agree that the amount of the aforementioned pre-agreed compensation has been set by them in agreement, while taking into account the effort and work and/or expenses invested by the Company in order to achieve exclusivity pertaining to the performance of the service and/or work in the sites and/or with the tenants given to the Employee by the Company. The Employee declares and agrees to the foregoing and he hereby waives any argument and/or claim and/or complaint and/or request against the Company in this regard. This clause is a fundamental clause in the agreement. Breaching this clause shall constitute a fundamental breaching of the agreement, and shall grant the Company an unlimited right, at its sole discretion, to terminate the agreement immediately, without detracting from any other relief available to it in accordance with the agreement, including its right to a pre-agreed compensation and/or by any law.</p>
                                    </div>
                                </div>
                                <div className='agg-list'>
                                    <div className='icons'><img src={star} /></div>
                                    <div className='agg-text'>
                                        <p>7.1.6.	To keep in complete confidentiality the Company’s business, and avoid competing with it in any way whatsoever – as set forth in this contract hereinafter.</p>
                                    </div>
                                </div>
                                <div className='agg-list'>
                                    <div className='icons'><img src={star} /></div>
                                    <div className='agg-text'>
                                        <p>7.1.7.	The aforementioned provisions do not detract from the Employee’s duties of care towards the Company, by any binding law.</p>
                                    </div>
                                </div>
                                <div className='agg-list'>
                                    <div className='icons'><img src={star} /></div>
                                    <div className='agg-text'>
                                        <p>7.1.8.	The Employee hereby declares towards the Company that his engagement in this contract does not breach any contract, arrangement or understanding between the Employee and a third party, expressly or implicitly</p>
                                    </div>
                                </div>
                                <div className='agg-list'>
                                    <div className='icons'><img src={star} /></div>
                                    <div className='agg-text'>
                                        <p>7.1.9.	The Employee hereby declares that all details he has given the Company upon presenting his candidateship for working at the Company, including his professional experience and his health condition, are complete, true and accurate as of signing this contract. The Employee shall notify the Company regarding any change to his health, shall perform all medical tests which the Company shall require, and shall provide the Company with all medical documents which shall be required by it. In addition, the Employee undertakes to be insured throughout this contract term by one of the known HMOs.</p>
                                    </div>
                                </div>
                                <div className='agg-list'>
                                    <div className='icons'><img src={star} /></div>
                                    <div className='agg-text'>
                                        <p>7.1.10.	The Employee shall work only for the Company, and shall not perform, directly and/or indirectly, for pay and/or for any other consideration and/or for no consideration, any other and/or accompanying work, partial and/or full time, unless he has received the Company’s pre-written agreement.</p>
                                    </div>
                                </div>
                                <div className='agg-list'>
                                    <div className='icons'><img src={star} /></div>
                                    <div className='agg-text'>
                                        <p>7.1.11.	The Employee shall devote all of his working hours and the best of his knowledge and skills for the purpose of performing his work in accordance with this contract</p>
                                    </div>
                                </div>
                                <div className='agg-list'>
                                    <div className='icons'><img src={star} /></div>
                                    <div className='agg-text'>
                                        <p>7.1.12.	In light of the nature of the Employee’s work, and since it is impossible to supervise working house, the provisions of the Working and Resting Hours Law, 5711-1951, shall not apply, and the Employee shall work as required.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='shift-30'>
                    <h6 className='text-underline'>8. Scope of the position and salary</h6>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>8.1.	The Employee’s total daily salary (gross) (hereinafter: <strong>“the Salary”</strong>) shall be a total of 40 ILS per working hour, in addition to travel expenses.</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>8.2.	The Employee shall work full-time on a daily basis. For the purpose of this agreement, “full-time” means 5 days a week, at least 8 hours a day, and in total, 45 weekly working hours by law, as well as Fridays as necessary. The Employee undertakes to not work, throughout the agreement term and up to 18 months after having finished working for the Company, for a company and/or body competing with the Company’s business, and/or any service provider of any sort and type whatsoever, in sites and/or buildings and/or areas where the Company provides its services</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>8.3.	The salary payment shall be done every month, no later than nine days from the end of the calendar month for the Employee’s work during the previous month, to the Employee’s bank account and/or by a check which shall be given to him.</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>8.4.	The Company shall deduct from the Employee’s salary all mandatory payments it is required to deduct, including income tax, national insurance and health tax or any other payment which shall apply from time to time to the employer’s payment to the Employee, all as set by law and/or the relevant regulations.</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>8.5.	The Employee shall not be entitled to receive any additional consideration or payment, of any type whatsoever, beyond the aforementioned consideration, which summarizes all payments and benefits to which the Employee is entitled for his work in the Company, apart from bonuses to which the Employee is entitled</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>8.6.	The Employee shall not work overtime, as this term is defined in the Working and Resting Hours Law, 5711-1951, unless required to do so by the Company or if the Company has given him an express written permission to do so. If the Employee has not received such a permit, or alternatively, has acted contrary to the Company’s prohibition to work overtime, he shall not be entitled to any payment for it, even if he has actually worked those hours.</p>
                        </div>
                    </div>
                </div>
                <div className='shift-30'>
                    <h6 className='text-underline'>9. Annual leave</h6>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>9.1 The Employee shall be entitled to annual leave days in accordance with the Annual Leave Law, 5711-1951. The dates of the holiday shall be set by the Company, as much as possible with coordination with the Employee</p>
                        </div>
                    </div>
                </div>
                <div className='shift-30'>
                    <h6 className='text-underline'>10.	Sick pay</h6>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>10.1.	The Employee shall be entitled to sick leave as set forth in the Sick Pay Law, 5736-1976.</p>
                        </div>
                    </div>
                </div>
                <div className='shift-30'>
                    <h6 className='text-underline'>11.	Convalescence pay</h6>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>11.1.	The Employee shall be entitled for convalescence pay as set forth in the extension order regarding convalescence pay.</p>
                        </div>
                    </div>
                </div>
                <div className='shift-30'>
                    <h6 className='text-underline'>12.	Allowances for compensation and pension</h6>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>12.1.	The Company shall allocate to the Employee as an employer allocates for compensation and pension, amounts which shall be no less than the rate set by law</p>
                        </div>
                    </div>
                </div>
                <div className='shift-30'>
                    <h6 className='text-underline'>13.	Study fund</h6>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>At the end of the Employee’s second year of employment at the Company, the Employee shall join a study fund of his choice (hereinafter: “the Fund”). The Company shall transfer to the Fund 5% of the effective salary. The Company shall deduct from the Employee’s effective salary 2.5% and shall transfer it to the Fund. The allowances to the Fund shall be done by law and in accordance with the Fund’s rules. The Employee shall notify the Company in advance which Fund he has chosen. In case he shall fail to notify as stated, he shall be automatically joined, without a pension marketing proceeding, to a study fund with which the Company shall have a “multiple agreement” at the time, which enables the manages or the arrangement employed by the Company, to add employees without a pension marketing proceeding. The Employee shall be entitled, at any point thereafter, to choose to transfer monies allocated to the Fund, to any other fund of his choice.</p>
                        </div>
                    </div>
                </div>
                <div className='shift-30'>
                    <h6 className='text-underline'>14.	Transfer of job</h6>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>14.1.	The Employee hereby undertakes that in any case of terminating his employment by the Company, whether by dismissal or resignation, whether given an advance notice or not, he shall immediately deliver and/or return to the Company all property, documents, letters, records, reports and all other documents in his possession pertaining to the Company or its business or related thereto, which have arrived in his possession during his employment for the Company in accordance with this contract.</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>14.2.	The Employee undertakes that in any case of terminating his employment by the Company, for any reason whatsoever, he shall transfer his job to whomever the Company chooses, in an orderly manner and in accordance with procedures which shall be set and/or given to him, in a proper and thorough manner, so that anyone replacing the Employee shall be able to perform his job in an orderly manner and without causing the Company any damage.</p>
                        </div>
                    </div>
                </div>
                <div className='shift-30'>
                    <h6 className='text-underline'>15.	Confidentiality</h6>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>15.1.	The stated in this clause hereinafter does not detract from the duties of confidentiality applying to the Employee by any law.</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>15.2.	It is brought to the Employee’s knowledge, that keeping the Company’s business secret is a key condition for the Company’s success and its ability to compete</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>15.3.	In light of the stated, the Employee undertakes, that during his employment for the Company he shall keep in complete confidentiality any information, as it is defined hereinafter, which shall arrive in his knowledge or possession, during his employment for the Company, shall not deliver it to any other person or body, whether directly or indirectly, whether for consideration or for no consideration. In addition, the Employee undertakes to not make any use whatsoever of such information for his benefit and/or for the benefit of others, whether related to him or not.</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>15.4.	“Information” for the purpose of this contract, means – any information, whether oral or written or in any other form of recording (including magnetic film, computer records on optic discs and such) referring or pertaining to the Company, directly or indirectly, including its business, procedures and methods of production, research, development plans, sales marketing; and without detracting from the foregoing:</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>15.5.	Details about the Company’s clientele, its suppliers and/or employees, names of partners and their rights in the Company, distribution list, products, preparations, processes, systems, software, hardware, prices, knowledge, discoveries and such, which the Company has a right over their knowledge or which are in its possession and have been given to the Employee’s knowledge or have arrived to his knowledge randomly and/or due to and/or during his work for the Company.</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>15.6.	Details about suppliers and producers with whom the Company has ties, and their products and/or prices, details about the Company’s clients in Israel and abroad and all of the Company’s business with them and/or in general, details about the method of pricing, the prices of products and/or service and/or works provided by the Company and the services provided by it, methods of operation, organization structure and management of the Company’s actions, financial reports and financial data, Company bank accounts and its financial state as well as the scope of sales, the Company’s incomes and expenses, details about the Employee’s salary and his terms of employment at the Company (unless he is required to do so by an authority entitled to receive such information by law, or for his legitimate personal needs) as well as the salary and terms of employment of other employees at the Company, which have been given to him or have arrived at his knowledge in any way whatsoever.</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>15.7.	The Employee is aware the breaching his undertaking for confidentiality in accordance with this clause might cause the Company severe damage.</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>15.8.	The Employee undertakes to keep secret the terms of this contract. Both during his employment for the Company and after he stops working for the Company for any reason whatsoever.</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>15.9.	The Employee undertakes that both throughout his employment for the Company in accordance with this contract, and for a period of 18 months thereafter, beginning on the day of the termination of his employment for the Company for any reason whatsoever, he shall not do by himself, and shall not be a partner, owner, shareholder, manager, employee, consultant and/or hold any other position or any other part, in any business (whether in the framework of a corporation or not) competing with the Company, its activity and its business or any part thereof.</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>15.10.	“Competition” for the purpose of this contract, means – whether the competition exists upon signing this contract, or it shall exist at the time of performing the prohibited act by the Employee, including placing the Employee at a position of being interested in competing activity</p>
                        </div>
                    </div>
                </div>
                <div className='shift-30'>
                    <h6 className='text-underline'>16.	Special personal employment agreement</h6>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>It is hereby clarified that this agreement is a personal and special agreement which arranges the relationship between the Company and the Employee, and exclusively sets the terms of employment of the Employee by the Company. The parties agree that the general and/or special collective agreements including their appendixes, including other agreement which are made from time to time between the employers and the Histadrut and/or agreements between the Company and any of its employees, shall not apply to the Employee.</p>
                        </div>
                    </div>
                </div>
                <div className='shift-30'>
                    <h6 className='text-underline'>17.	The generality of the contract</h6>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>17.1.	This contract contains, embodies, merges and expresses all terms agreed upon between the parties, regarding the Employee’s employment by the Company. No promise, guarantee, written or oral agreement, undertaking or presentation regarding the subject of this contract, given or made by the parties prior to signing this contract and which have not been expressly set forth therein, shall not add to the undertakings and rights set forth in this contract or pursuant thereto, detract from them or change them</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>17.2.	A change of any provision in this contract or waive of any of the rights set forth and/or pursuant thereto shall be invalid unless done in writing and signed by the party towards which the change or waive is claimed.</p>
                        </div>
                    </div>
                </div>
                <div className='shift-30'>
                    <h6 className='text-underline'>18.	Unique jurisdiction</h6>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>18.1.	The unique and exclusive jurisdiction to discuss claims regarding this agreement, is given to the Labor Court in Tel-Aviv – Jaffa.</p>
                        </div>
                    </div>
                </div>
                <div className='shift-30'>
                    <h6 className='text-underline'>19.	Notices</h6>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>19.1.	Notices in accordance with this agreement or pertaining thereto shall be hand-delivered or sent via registered post.</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={star} /></div>
                        <div className='agg-text'>
                            <p>19.2.	The date of delivery of notices delivered by hand shall be the day of the hand delivery. The date of delivery of notices which shall be sent via post to the addresses at the top of this agreement, or other addresses which shall be notified, shall be the third day after they are handed to Israeli post. A notice which shall be sent by fax shall be binding upon its receipt by the addressee. In case of delivery by fax, the notice shall be considered to have been duly received only after a business day from the time on which a telephone confirmation was received regarding the receipt of the stated fax notice.</p>
                        </div>
                    </div>
                    <h5>The Company wishes the Employee success in his job, fulfillment and meeting all challenges awaiting him in his work for the Company.</h5>
                    <h6 className='text-center text-underline mt-3 mb-4'>In witness whereas the Parties have signed:</h6>
                    <div className='row'>
                        <div className='col-sm-6'>
                            <h5 className='mt-2'>The Company</h5>
                            <h6 style={{fontWeight: "600", fontSize: "14px"}}>Draw Signature with mouse or touch</h6>
                            <img src={companySign} className='img-fluid' alt='Company' />
                        </div>
                        <div className='col-sm-6'>
                            <h5 className='mt-2'>The Employee</h5>
                            <img src={signature2} className='img-fluid' alt='Company' />
                        </div>
                    </div>
                    <div className='mb-4'>&nbsp;</div>
                </div>
            </div>
        </div>
     :
       <p>Worker Not Signed/Accept The Contract Yet.</p>
       }
    </div>
  )
}
