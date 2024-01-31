import React,{ useRef } from 'react'
import SignatureCanvas from 'react-signature-canvas';
import logo from "../../Assets/image/sample.svg";
import insurancelogo from "../../Assets/image/insurance-logo.png";

export default function InsuranceEng() {
    const sigRef2 = useRef();
    const sigRef3 = useRef();
    const sigRef4 = useRef();
    const sigRef5 = useRef();
    const sigRef6 = useRef();

    const handleSignatureEnd2 = () => {
        setSignature2(sigRef2.current.toDataURL());
    }
    const clearSignature2 = () => {
        sigRef2.current.clear();
        setSignature2(null);
    }
    const handleSignatureEnd3 = () => {
        setSignature2(sigRef3.current.toDataURL());
    }
    const clearSignature3 = () => {
        sigRef3.current.clear();
        setSignature2(null);
    }
    const handleSignatureEnd4 = () => {
        setSignature2(sigRef4.current.toDataURL());
    }
    const clearSignature4 = () => {
        sigRef4.current.clear();
        setSignature2(null);
    }
    const handleSignatureEnd5 = () => {
        setSignature2(sigRef5.current.toDataURL());
    }
    const clearSignature5 = () => {
        sigRef5.current.clear();
        setSignature2(null);
    }
    const handleSignatureEnd6 = () => {
        setSignature2(sigRef6.current.toDataURL());
    }
    const clearSignature6 = () => {
        sigRef6.current.clear();
        setSignature2(null);
    }
  return (
    <div>
      <div className='container'>
        <div className='send-offer insurance-eng'>
            <div className='maxWidthControl dashBox mb-4'>
            <div className='row'>
            <div className='col-sm-6'>
                    <svg width="250" height="94" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                        <image xlinkHref={logo} width="250" height="94"></image>
                    </svg>
                </div>
                <div className='col-sm-6'>
                    <img src={insurancelogo} className='img-fluid' alt='Insurance Logo' />
                </div>

            </div>
                <h1>Meno Medic Top - Insurance Health for Proposal</h1>
                <p>All questions must be answered clearly and fully. Do not use lines or symbols instead of words.
                The form is for both men and women.</p>
                <p>You must provide full and honest answers to every essential matter you are asked about' and not doing so may have an impact on the payment of insurance benefits</p>

                <div className='please-select'>
                <h4>please select accordingly:</h4>
                <ul className='list-unstyled'>
                    <li><span>a new candidate</span></li>
                    <li><span>renewal/exctension</span></li>
                </ul>
                </div>
                <div className='insuranceform'>
                    <p>(in this case there is no need to fulfill a Health declaration)</p>
                    <div className='insurancetable table-responsive'>
                        <table className='table table-bordered'>
                            <tr>
                                <td colSpan={2}>
                                    <label for="label" className="form-label">Name of agent.</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">Agent no.</label>
                                    <input type="text" className="form-control" />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label for="label" className="form-label">Name Company/collective.</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">Private company no.</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">agreement no in collective policy </label>
                                    <input type="text" className="form-control" placeholder='payment per day' />
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div className='insurancetable table-responsive'>
                        <table className='table table-bordered'>
                            <thead>
                                <th colSpan={4}>A. Details of policyholder / present employer</th>
                            </thead>
                            <tr>
                                <td colSpan={2}>
                                    <label for="label" className="form-label">ID Number</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">First Name</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">Last Name</label>
                                    <input type="text" className="form-control" />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label for="label" className="form-label">Zip code</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">Town</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">House no</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">Street</label>
                                    <input type="text" className="form-control" />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <label for="label" className="form-label">Email for recepit of notices, information and mailings</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">Cellphone no.</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">Telephone no.</label>
                                    <input type="text" className="form-control" />
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div className='insurancetable table-responsive'>
                        <table className='table table-bordered'>
                            <thead>
                                <th colSpan={4}>B. Insurance Candidate details</th>
                            </thead>
                            <tr>
                                <td colSpan={2}>
                                    <label for="label" className="form-label">First name</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">Last name</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">Passport no.</label>
                                    <input type="text" className="form-control" />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label for="label" className="form-label">Country of ongin</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">Date of Birth</label>
                                    <input type="date" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">First date of insurance</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">Gender</label>
                                    <div className='gender'>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1" />
                                        <label className="form-check-label" for="inlineRadio1">Male</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2" />
                                        <label className="form-check-label" for="inlineRadio2">Female</label>
                                    </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label for="label" className="form-label">Zip code</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">Town</label>
                                    <input type="date" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">House no</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">Street</label>
                                    <input type="text" className="form-control" />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <label for="label" className="form-label">Email for recepit of notices, information and mailings</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">Cellphone no.</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">Telephone no.</label>
                                    <input type="text" className="form-control" />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={4}>
                                    <p>* I am aware and I agree that if I do not fill in an</p>
                                    <p>* address, the address of the employer will serve the Company for sending notices and/or documents in any matter related to insurance.</p>
                                </td>

                            </tr>
                        </table>
                    </div>
                    <div className='insurancetable table-responsive'>
                        <table className='table table-bordered'>
                            <thead>
                                <th colSpan={2}>C. Insurance period requested</th>
                            </thead>
                            <tr>
                                <td>
                                    <label for="label" className="form-label">To</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">From</label>
                                    <input type="text" className="form-control" />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <p>* Note: The requested date does not bind the Company; the effective starting date of the insurance is as noted on the Insurance Details Page.</p>
                                </td>
                            </tr>

                        </table>
                    </div>
                    <div className='insurancetable table-responsive'>
                        <table className='table table-bordered'>
                            <thead>
                                <th colSpan={4}>D. Please select The Insurance candidate's occupation</th>
                            </thead>
                            <tr>
                                <td>
                                <div className="form-check form-check-inline">
                                    <label className="form-check-label" for="inlineRadio1">Other industry</label>
                                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="option3" />
                                </div>
                                </td>
                                <td>
                                <div className="form-check form-check-inline">
                                    <label className="form-check-label" for="inlineRadio1">Construction</label>
                                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio4" value="option4" />
                                </div>
                                </td>
                                <td>
                                <div className="form-check form-check-inline">
                                    <label className="form-check-label" for="inlineRadio1">Agriculture</label>
                                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio5" value="option5" />
                                </div>
                                </td>
                                <td>
                                <div className="form-check form-check-inline">
                                    <label className="form-check-label" for="inlineRadio1">Nursing care</label>
                                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio6" value="option6" />
                                </div>
                                </td>
                            </tr>

                        </table>
                    </div>
                    <div className='insurancetable table-responsive'>
                        <table className='table table-bordered'>
                            <thead>
                                <th colSpan={4}>E. Details of previous insurance policies</th>
                            </thead>
                            <tr>
                                <td colSpan={4}>
                                    <p>
                                        Have you ever been insured by Menora Mivtahim company or any other company?
                                        <div className="form-check form-check-inline ml-2">
                                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio7" value="option7" />
                                            <label className="form-check-label" for="inlineRadio1">No</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio8" value="option8" />
                                            <label className="form-check-label" for="inlineRadio1">Yes</label>
                                        </div>
                                    </p>
                                    <p>If yes, indicate company and the policy number/health care provider membership number:</p>
                                </td>
                            </tr>
                            <tr>
                                <td style={{ padding: '0' }}>
                                    <label for="label" className="form-label" style={{ paddingRight: '10px', paddingTop: '10px' }}>Insurance period</label>
                                    <tr>
                                        <td>
                                            {/* <label for="label" className="form-label">To</label> */}
                                            <input type="text" className="form-control" placeholder='To' />
                                        </td>
                                        <td>
                                            {/* <label for="label" className="form-label">From</label> */}
                                            <input type="text" className="form-control" placeholder='From' />
                                        </td>
                                    </tr>
                                </td>
                                <td>
                                    <label for="label" className="form-label">Company name.</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">Policy no.</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">Member ship no.</label>
                                    <input type="text" className="form-control" />
                                </td>
                            </tr>

                        </table>
                    </div>
                    <div className='insurancetable table-responsive'>
                        <table className='table table-bordered'>
                            <thead>
                                <th colSpan={4}>F. Payment by credit card</th>
                            </thead>
                            <tr>
                                <td colSpan={4}>
                                    <p>
                                        You can pay in several installments according to the insurance period
                                    </p>
                                    <p>6 month up -to 4. Payment No.___________________</p>
                                    <p>12 month up -to 10. Payment No.___________________</p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={4}>
                                    <p><b>Insurance applicant personal details</b></p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <label for="label" className="form-label">First Name</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">Last Name</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">Passport No.</label>
                                    <input type="text" className="form-control" />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={4}>
                                    <p><b>Provision of credit card holder</b></p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <label for="label" className="form-label">ID number</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">First Name</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">Last Name</label>
                                    <input type="text" className="form-control" />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label for="label" className="form-label">Zip code</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">Town</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">House no</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">Street</label>
                                    <input type="text" className="form-control" />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label for="label" className="form-label">Exp date</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td colSpan={3}>
                                    <label for="label" className="form-label">Card no.</label>
                                    <input type="text" className="form-control" />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <label for="label" className="form-label">Email</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">Cellphone No.</label>
                                    <input type="text" className="form-control" />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={4}>
                                    <p>For your information, the means of payment will be used to pay the insurance fees for all those insured under the policy. The amounts and dates of charges will be according to the Company's determination, according to the terms of payment of the insurance policy and the changes made to them from time to time.
This Authorization also be valid for charging a card that will be issued and will carry another number, as an alternative to a card whose number is indicated on this form.
</p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                <label for="label" className="form-label">Signature of the credit card holder</label>

                                <SignatureCanvas
                                    penColor="black"
                                    canvasProps={{className: 'sigCanvas'}}
                                    ref={sigRef2}
                                    onEnd={handleSignatureEnd2}
                                />
                                <button className='btn btn-warning' onClick={clearSignature2}>Clear</button>
                                </td>
                                <td>
                                    <label for="label" className="form-label">Date</label>
                                    <input type="date" className="form-control" />
                                </td>
                            </tr>

                        </table>
                    </div>
                    <div className='insurancetable table-responsive'>
                        <table className='table table-bordered'>
                            <thead>
                                <th colSpan={4}>Signature of the employer</th>
                            </thead>
                            <tr>
                                <td colSpan={4}>
                                    <p>
                                        The insured signed this Proposal Form after its content had been explained to him in a language he understands.
                                    </p>

                                </td>
                            </tr>
                            <tr>

                                <td>
                                    <label for="label" className="form-label">Stamp & signature of the employer</label>
                                    <SignatureCanvas
                                    penColor="black"
                                    canvasProps={{className: 'sigCanvas'}}
                                    ref={sigRef3}
                                    onEnd={handleSignatureEnd3}
                                />
                                <button className='btn btn-warning' onClick={clearSignature3}>Clear</button>
                                </td>
                                <td>
                                    <label for="label" className="form-label">Name of the employer</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">Date</label>
                                    <input type="date" className="form-control" />
                                </td>
                            </tr>

                        </table>
                    </div>
                    <div className='insurancetable table-responsive'>
                        <table className='table table-bordered'>
                            <thead>
                                <th colSpan={3}>G. Health declaration  </th>
                            </thead>
                            <tr>
                                <td colSpan={3}>
                                    <p>
                                    for the sake of convenience this declaration is written in the masculine form, but it is intended for both sexesץ Please answer all the following questions.
in the "Yes" or "No" column For each question place a check mark " and if the finding is positive, note the question number and the details in the "Details of positive findings" line.

                                    </p>

                                </td>
                            </tr>
                            <tr>

                                <td>
                                    <label for="label" className="form-label">First name</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">Last name</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">Passport no.</label>
                                    <input type="text" className="form-control" />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <p><b>General questions on the medical state</b></p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <p>1. Height_________meters  Weight_________kg</p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <p>2. Has there been any change in your weight 5 kg and more( in the course of the last twelve months )not as a result of a diet?</p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <p>3. Do you now, or did you in the past, consume alcohol – more than one glass a day of beer/ wine or another alcoholic beverage?</p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <p>4. Do you smoke or have you smoked in the past? ○ Today ○ In the past, When did you stop?_______________</p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <p>5. Do you now, or have you in the past, consumed Drugs?</p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <p>6. Did you undergo surgery in the course of the last 10 years or was surgery recommended to you?</p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <p>7. Were you hospitalized in the course of the last 10 years at a hospital or a medical institution? Which one, when, the reason__________________________________<span>Enclose medical summary and updated information</span></p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <p>8. Do you regularly take medication for a chronic condition? <span>Detail the name of the medication and the reason for taking it</span></p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <p>9. <span>Diagnostic tests:</span></p>
                                    <p>Have you undergone in the course of the last 10 years or have you been given a recommendation to undergo one or more of the following tests: catheterization, a cardiac scan, echocardiogram, MRI, CT, endoscopy, tests for detection of a cancerous tumor, biopsy and occult blood?</p>
                                    <p><span>If yes, please state the type of test, time, results of the test and the reason for performing it</span></p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}><p><b>Questions about diseases</b> Were you ever diagnosed with the diseases and/or disorders and/or medical problems listed below?</p></td>
                            </tr>
                            <tr>
                                <td colSpan={3}><p>10. <span>Heart and blood</span> Heart disease, angina pectoris, myocardial infarction, arrhythmias, heart valve problems, congenital heart disease, cardiomyopathy or pericardial disorders. High blood pressure, blood vessel, blood clots, varicose roses, circulation problems, narrowing of the arteries.</p></td>
                            </tr>
                            <tr>
                                <td colSpan={3}><p>11. <span>The nervous system and the brain</span> Multiple sclerosis, muscular dystrophy, paralysis, spasms epilepsy (, T.I.A, stroke, brain hemorrhage) c.v.a, tremor, ataxia, Parkinson.</p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}><p>12. Diagnosed mental disorders and attempted suicide</p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}><p>13. <span>Respiratory system </span> Asthma, chronic bronchitis, emphysema, tuberculosis, hemoptysis, repeat respiratory tract infections.</p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}><p>14. <span>Gastrointestinal tract and liver</span> Ulcer gastric or duodenal ulcers (, heartburn, chronic inflammatory intestinal infection, gastrointestinal bleeding, hemorrhoids, rectal problems, chronic liver disease, hepatitis, gallstones, pancreatitis, hepatitis ) viral or otherwise.</p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}><p>15. <span>Kidneys and urinary tract</span> Kidney stones, kidney infections, urinary tract defects, blood or protein in the urine, renal cysts, renal dysfunction, Prostate.</p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}><p>16. <span>Metabolic and endocrine diseases</span> Diabetes, thyroid disorder, adrenal disorder, kidney cysts, pituitary and other glands, high blood lipids (cholesterol, triglycerides).</p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}><p>17. <span>Dermatology and Venereology </span> Syphilis, herpes, skin tumors, moles, warts and/or infertility and/or fertility problems.</p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}><p>18. Malignant diseases, malignant or precancerous tumor/s, polyps <span>Detail the type and method of treatment____________________________Enclose reports and pathology</span></p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}><p>19. Infectious diseases, autoimmune diseases, polio, venereal diseases and AIDS/ HIV. <span>Enclose medical documents</span></p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}><p>20. <span>Joints and bones -</span> arthritis, rheumatism (Galt), neck or back pain, herniated disc, dislocation of shoulder, knee, bone disease.</p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}><p>21. <span>Eyes -</span> cataract, glaucoma, strabismus, blindness, retinal disease, cornea disease, visual disturbances, diopter number</p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}><p>22. <span>Otolaryngology (nose/ ear/ throat) -</span> ear recurrent or throat infections, sinusitis, hearing disorders, sleep apnea syndrome.</p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}><p>23. <span>Hernia (hernia break) -</span> of the abdominal wall, groin, surgical scars, navel and solar plexus. <span>Medical documents must be enclosed</span></p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <p>24. For women only: Do you suffer or have you suffered from any women’s illnesses: irregular menstruation, fertility problems, bleeding and breast cysts, problems in the uterus and ovaries, irregular findings in a gynecological exam such as PAP ?</p>
                                    <p>Are you pregnant? What is the number of fetuses?___________________Have you suffered from any problems in previous pregnancies or in the current pregnancy? Have you given birth by a Caesarean Section?</p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}><p><b>Details of positive findings </b></p></td>
                            </tr>
                            <tr>

                                <td>
                                    <label for="label" className="form-label">Signature of the Insurance Candidate</label>
                                    <SignatureCanvas
                                    penColor="black"
                                    canvasProps={{className: 'sigCanvas'}}
                                    ref={sigRef4}
                                    onEnd={handleSignatureEnd4}
                                />
                                <button className='btn btn-warning' onClick={clearSignature4}>Clear</button>
                                </td>
                                <td>
                                    <label for="label" className="form-label">Insurance Candidate name</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">Date</label>
                                    <input type="date" className="form-control" />
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div className='insurancetable table-responsive'>
                        <table className='table table-bordered'>
                            <thead>
                                <th>H. Receipt of all the information in the Policy</th>
                            </thead>
                            <tr>
                                <td>
                                    <p>
                                    I hereby permit my insurance agent for the Policy,
Mr/Ms___________________________, to handle on my behalf and for me all matters related to this claim, including submitting to Menora and receiving from Menora on my behalf and for me all correspondence and/or documents. related to a claim, and to serve as my representative for all intents and purposes related to this claim.

                                    </p>
                                    <p>
                                    <label for="label" className="form-label">Signature of the Insured</label>
                                    <SignatureCanvas
                                    penColor="black"
                                    canvasProps={{className: 'sigCanvas'}}
                                    ref={sigRef5}
                                    onEnd={handleSignatureEnd5}
                                />
                                <button className='btn btn-warning' onClick={clearSignature5}>Clear</button>
                                    </p>

                                </td>
                            </tr>


                        </table>
                    </div>
                    <div className='insurancetable table-responsive'>
                        <table className='table table-bordered'>
                            <thead>
                                <th>I. Applicant / insurance candidate declaration</th>
                            </thead>
                            <tr>
                                <td>
                                    <p>
                                    I the undersigned, the insurance candidate, hereby request the insurer to insured the insurance candidate pursuant to the details in this form (hereinafter: “the Proposal”).
                                    </p>
                                    <p>
                                    <span>I hereby represent, agree and undertake that:</span>
                                    </p>
                                    <p>1.	All of the answers specified in the proposal and/or in the health declaration are correct and complete, and I did not conceal from the insurer anything that may affect the insurer's decision to accept the insurance proposal.</p>
                                    <p>2.	The answers specified in the proposal and any other information in writing to be given to the insurer by me, as well as the insurer's customary terms in this matter, shall serve as the terms of the insurance contract between me and the insurer and shall constitute an integral part thereof.</p>
                                    <p>3.	I hereby confirm and agree that the acceptance or rejection of my proposal is at the sole discretion of the insurer and it is entitled to decide whether to accept or reject the proposal subject to the law.</p>
                                    <p>4.	I agree that the insurance policy of the insurance plans requested in this proposal be delivered to me by means of the agent whose details appear at the beginning of this proposal.</p>
                                    <p>5.	If you wish to receive the policy and/or the information in the framework. of the underwriting procedure and the procedure of joining this policy directly, as well, you may contact menora at any time by phoning menora 03-7107460.</p>

                                </td>
                            </tr>


                        </table>
                    </div>
                    <div className='insurancetable table-responsive'>
                        <table className='table table-bordered'>
                            <thead>
                                <th>J. Waiver of medical confidentiality</th>
                            </thead>
                            <tr>
                                <td>
                                    <p>
                                    I, the undersigned, hereby permit the medical institution and/or your employees and/or any person working on your behalf or as your agent, to provide Menora Mivtachim Insurance Ltd. )hereinafter: the "Requester"( with all details, with no exception, regarding my medical condition and/or any disease from which I suffered in the past and/or from which I suffer at present, including information on psychiatric or other mental therapy that I underwent, in the manner requested by the Requester, and I hereby release you and/or your employees and/or any person working on your behalf or as your agent from the duty of medical confidentiality on all matters related to my medical condition and/or diseases as foregoing, and I waive such confidentiality with respect to the Requester, and shall have no claim or demand against you in connection to the foregoing, including claims by virtue of the Privacy Protection Law and/or the Patient's Rights Law regarding medical confidentiality and/or any other law.
                                    </p>
                                </td>
                            </tr>


                        </table>
                    </div>
                    <div className='insurancetable table-responsive'>
                        <table className='table table-bordered'>
                            <thead>
                                <th>K. Information for the Insurance Candidate</th>
                            </thead>
                            <tr>
                                <td>
                                    <p>
                                        1.  According to the terms of the Policy, in the period of 90 days from the date of termination of the insurance period, it is possible to extend the insurance period continuously, subject to payment of insurance fees for the period between the end of the insurance period and extension of the insurance, provided that you continue to work as a foreign worker. After the passage of 90 days from the date of termination of the insurance period, new inclusion in the Policy will involve an underwriting procedure.
                                    </p>
                                    <p>
                                        2.	Insofar as you are a person with disabilities, as defined in the Equal Rights for Persons with Disabilities Law, 5748 - 1998, that is, "a person with a physical, mental or intellectual, including cognitive impairment, whether permanent or temporary, which significantly limits his functioning in one or more of the central spheres of life," please notify us of this through your insurance agent, whose details appear at the beginning of this proposal.
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p><span>I confirm that I have read and understood the contents of this proposal, including the representations therein.</span></p>
                                </td>
                            </tr>


                        </table>
                    </div>
                    <div className='insurancetable table-responsive'>
                        <table className='table table-bordered'>
                            <thead>
                                <th colSpan={4}>Signature for the Insurance Candidate</th>
                            </thead>
                            <tr>

                                <td>
                                    <label for="label" className="form-label">Signature </label>
                                    <SignatureCanvas
                                    penColor="black"
                                    canvasProps={{className: 'sigCanvas'}}
                                    ref={sigRef6}
                                    onEnd={handleSignatureEnd6}
                                />
                                <button className='btn btn-warning' onClick={clearSignature6}>Clear</button>
                                </td>
                                <td>
                                    <label for="label" className="form-label">Passport no.</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">Insurance Candidate name</label>
                                    <input type="text" className="form-control" />
                                </td>
                                <td>
                                    <label for="label" className="form-label">Date</label>
                                    <input type="date" className="form-control" />
                                </td>
                            </tr>


                        </table>
                    </div>
                    <div className='button mt-4 text-center'>
                        <input class="btn btn-pink" value="Submit" />
                    </div>
                </div>
            </div>
            </div>
            </div>
    </div>
  )
}
