import React, { useEffect, useRef, useState } from 'react'
import logo from "../Assets/image/logo.png";
import check from "../Assets/image/icons/check-mark.png";
import SignatureCanvas from 'react-signature-canvas'
import { useParams, useNavigate } from 'react-router-dom';
import { Base64 } from "js-base64";
import { useAlert } from 'react-alert';
import axios from 'axios';
import i18next from 'i18next';
import { useTranslation } from "react-i18next";
import { Checkbox } from 'rsuite';
const data = {};
export default function Form101() {

  const { t } = useTranslation();
  const [formValues, setFormValues] = useState([]);
  const [salValues, setSalValues] = useState([{ name: "", address: "", dfid: "", typeIncome: "", mIncome: "", taxDeducted: "", copy_of_pay: "" }]);

  let handleChildChange = (i, e) => {
    let newFormValues = [...formValues];
    if ((e.target.name == 'custody' || e.target.name == 'childBenefit')) {
      (e.target.checked == true) ? e.target.value = 1 : e.target.value = '';
    }
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
  }
  let handleSalChange = (i, e) => {
    let newSalValues = [...salValues];
    if (e.target.name == "copy_of_pay") {
      const reader = new FileReader()
      reader.readAsDataURL(e.target.files[0])
      reader.onload = () => {
        newSalValues[i]['copy_of_pay'] = reader.result;
      }
    } else {
      newSalValues[i][e.target.name] = e.target.value;
    }
    setSalValues(newSalValues);
  }

  let addFormFields = () => {
    setFormValues([...formValues, { name: "", idnum: "", childDob: "", custody: "", childBenefit: "" }])
  }
  let addFormFields2 = () => {
    setSalValues([...salValues, { name: "", address: "", dfid: "", typeIncome: "", mIncome: "", taxDeducted: "", copy_of_pay: "" }])
  }

  let removeFormFields = (i) => {
    let newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues)
  }
  let removeFormFields2 = (i) => {
    let newSalValues = [...salValues];
    newSalValues.splice(i, 1);
    setSalValues(newSalValues)
  }

  let handleSave = (event) => {
    event.preventDefault();
    alert(JSON.stringify(formValues));
  }
  let handleSave2 = (event) => {
    event.preventDefault();
    alert(JSON.stringify(salValues));
  }

  const [selected, setSelected] = useState("");
  const param = useParams();
  const id = Base64.decode(param.id);
  const alert = useAlert();
  const [file, setFile] = useState();
  const [file2, setFile2] = useState();
  const [form, setForm] = useState([]);
  const sigRef = useRef();
  const [signature, setSignature] = useState(null);

  const [exIncome, setExIncome] = useState(false);
  const [cordination, setCordination] = useState(false);
  const [cord, setCord] = useState(null);

  const [cord0File, setFileCord0] = useState(null);
  const [cord2File, setFileCord2] = useState(null);

  const handleSignatureEnd = () => {
    setSignature(sigRef.current.toDataURL());
  }
  const clearSignature = () => {
    sigRef.current.clear();
    setSignature(null);
  }

  const handleSubmit = (e) => {

    let country = document.querySelector('select[name="p-country"]');
    let pset = document.querySelector('select[name="p-settlement"]');

    if (e.target.name == 'breakIncome') {

      const ikr = {};
      let bincm = document.querySelectorAll('input[name="breakIncome"]:checked');
      bincm.forEach((e, i) => {
        (i == 0) ?
          ikr['breakIncome'] = e.value + " | "
          : ikr['breakIncome'] += e.value + " | "

      })
      data['breakIncome'] = ikr;

    }
    else if (e.target.name == 'income') {
      const ik = {};
      let incm = document.querySelectorAll('input[name="income"]:checked');
      incm.forEach((e, i) => {
        (i == 0) ?
          ik['income'] = e.value + " | "
          : ik['income'] += e.value + " | "

      })
      data['income'] = ik;

    }
    else if (e.target.name == 'excertion') {

      const exr = {};
      let exa = document.querySelectorAll('input[name="excertion"]:checked');
      exa.forEach((e, i) => {
        (i == 0) ?
          exr['excertion'] = e.value + " | "
          : exr['excertion'] += e.value + " | "

      })
      data['excertion'] = exr;

    }
    else if (e.target.name == 'taxCredit') {
      const txc = {};
      let tx = document.querySelectorAll('input[name="taxCredit"]:checked');
      tx.forEach((e, i) => {
        (i == 0) ?
          txc['taxCredit'] = e.value + " | "
          : txc['taxCredit'] += e.value + " | "

      })
      data['taxCredit'] = txc;
    }

    else {

      data[e.target.name] = e.target.value;
    }
    if (country != null)
      data['country'] = country.options[country.selectedIndex].value;
    if (pset != null)
      data['p-settlement'] = pset.options[pset.selectedIndex].value;

    data['bid-sex'] = document.querySelector('input[name="bid-sex"]:checked').value;
    data['p-sex'] = document.querySelector('input[name="p-sex"]:checked').value;
    data['moreIncome'] = exIncome;
    if (exIncome == true) {
      let cp = document.querySelector('input[name="creditPoints"]:checked').value;
      data['creditPoints'] = cp;
    }
   

  }
  const finalSubmit = () => {
   
   
    data['cordination'] = cordination;
    data['cord'] = cord;
    data['bid-martial'] = document.querySelector('input[name="bid-martial"]:checked').value;
    data['bid-israeli'] = document.querySelector('input[name="bid-israeli"]:checked').value;
    data['bid-member'] = document.querySelector('input[name="bid-member"]:checked').value;
    data['bid-hmo'] = document.querySelector('input[name="bid-hmo"]:checked').value;
   
    data['p-martial'] = document.querySelector('input[name="p-martial"]:checked').value;
    data['p-hmo'] = document.querySelector('input[name="p-hmo"]:checked').value;

    const Data = {
      ...data,
      "identification":selected,
      "child_form": formValues,
      "salary_form": salValues,
      "photocopy_id_appendix": (file != undefined) ? file : '',
      "p-file": (file2 != undefined) ? file2 : '',
      "signature": signature,
      "cord0_file": cord0File,
      "cord2_file": cord2File
    }
    
    let success = true;

    if (!Data.name) { alert.error('Please enter name'); success = false; return false; }
    if (!Data.phone_number) { alert.error('Please enter phone number'); success = false; return false; }
    if (!Data.first_name) { alert.error('Please enter first name'); success = false; return false; }
    if (!Data.last_name) { alert.error('Please enter lastname'); success = false; return false; }

    if (!Data.identification) { alert.error('Please choose identification'); success = false; return false; }
    else if (Data.identification == 'byId') {
      let bid = document.querySelectorAll('.bid');
      let bidr = document.querySelectorAll('.bidr');
      bid.forEach((e, i) => {
        if (e.value == '') {
          let name = e.name.split('-')[1];
          if (name != undefined && name != 'date_of_immigration' && name != 'phone_number') {
            name = name.replace('_', ' ');
            alert.error('Please enter ' + name);
            success = false;
            return false;
          }
        }
      })
      
        if(formValues.length > 0){
        for(let sv in formValues){
  
          if(formValues[sv].name == ''){
            alert.error("One of the name in child details is missing");
            success = false;
            return false;
          }
          if(formValues[sv].idnum == ''){
            alert.error("One of the Id number in child details is missing");
            success = false;
            return false;
          }
          if(formValues[sv].childDob == ''){
            alert.error("One of date of birth in child details is missing");
            success = false;
            return false;
          }
          if(formValues[sv].custody == '' && formValues[sv].childBenefit == '' ){
            alert.error("One of the custody/child benifit selection is missing");
            success = false;
            return false;
          }

        }
      }
      

    } 

    else {

      let pid = document.querySelectorAll('.pid');
      let pidr = document.querySelectorAll('.pidr');
      pid.forEach((e, i) => {
        if (e.value == '') {
          let name = e.name.split('-')[1];
          if (name != undefined && name != 'postal_code' && name != 'phone_number' ) {
            name = name.replace('_', ' ');
            alert.error('Please enter ' + name);
            success = false;
            return false;
          }
        }
      })

    }
   
    if(exIncome == true){

      let ot = document.querySelectorAll('input[name="breakIncome"]:checked');
      if(ot.length == 0){
        alert.error("Please choose other income breakdown");
        success = false;
        return false;
      }
    }
    if(cordination == true && cord == null){
      alert.error('Please select the reason for the request in  cordination number');
      success = false;
      return false;
    }
    if(cordination == true && cord == '1'){
      for(let sv in salValues){
        let it = document.querySelector('input[name="typeIncome'+sv+'"]:checked');
        salValues[sv].typeIncome = (it != null) ? it.value:'';

        if(salValues[sv].name == ''){
          alert.error("One of the name in additional income is missing");
          success = false;
          return false;
        }

        if(salValues[sv].address == ''){
          alert.error("One of the address in additional income is missing");
          success = false;
          return false;
        }

        if(salValues[sv].dfid == ''){
          alert.error("One of the deduction ID in additional income is missing");
          success = false;
          return false;
        }
        if(salValues[sv].mIncome == ''){
          alert.error("One of the monthly income in additional income is missing");
          success = false;
          return false;
        }
        if(salValues[sv].taxDeducted == ''){
          alert.error("One of the tax deduction value in additional income is missing");
          success = false;
          return false;
        }
     
        if( salValues[sv].typeIncome == '' || salValues[sv].typeIncome == null ){
          alert.error("One of the type of income in additional income is not selected");
          success = false;
          return false;
        }

      }
    }
  

   
    if (!Data.income) { alert.error('Please choose income details'); success = false; return false; }
    if (!Data.taxDate) { alert.error('Please enter date of commencement '); success = false; return false; }
    if (!Data.signature || Data.signature == null) { alert.error('Please sign form'); success = false; return false; }
    
     
    
    if (success == true) {
      axios
        .post(`/api/form101`, { id: id, data: Data })
        .then((res) => {
          if (res.data.success_code == 200) {
            alert.success('Successfuly signed');
            setTimeout(() => {
              window.location.reload(true);
            }, 2000);
          } else {
            window.alert('something went wrong ! please try again')
          }
        })
    }
  }

  const getForm = () => {
    axios
      .get(`/api/get101/${id}`)
      .then((res) => {
        i18next.changeLanguage(res.data.lng);
        if (res.data.lng == 'heb') {
          import('../Assets/css/rtl.css')
          document.querySelector('html').setAttribute('dir', 'rtl')
        }
        else {
          document.querySelector('html').removeAttribute('dir');
        }

        if (res.data.form.length > 0) {
          if (res.data.form[0].form_101 != null) {
            let fm = JSON.parse(res.data.form[0].form_101).data;
            
            let ip = document.querySelectorAll('input');
            let sl = document.querySelectorAll('select');
            ip.forEach((e,i)=>{
             e.setAttribute('readonly',true);
            });
            sl.forEach((e,i)=>{
              e.setAttribute('disabled',true);
             });

            if (fm.child_form != undefined && fm.child_form.length != 0 && fm.child_form != ""  ) {
              setFormValues(fm.child_form);
            }
            if (fm.salary_form != undefined && fm.salary_form.length != 0 && fm.salary_form != "") {
              setSalValues(fm.salary_form);
            }
            setExIncome(fm.moreIncome);
            setCordination(fm.cordination);
            setCord(fm.cord);
            setForm(fm);

            for (let f in fm) {
              if (f != '' && f != null && f != undefined) {

                let el = document.querySelector('input[name="' + f + '"]');
                if (el != null && el.type != 'radio' && el.type != 'checkbox') {
                  el.value = fm[f];
                  el.setAttribute('readonly', true);
                }

              }

            }
          }

        } else {
          setForm([])
        }
      })

  }
  setTimeout(() => {
    if (form.length != 0) {
      setSelected(form.identification.toString());
    }
  }, 1000)

  useEffect(() => {
    getForm();
    if (form.length == 0){
      document.querySelector('#moreIncome1').checked = true;
      document.querySelector('#cordination1').checked = true;
      setSelected("byId");
      let io = document.querySelectorAll('#io_check');
      io.forEach((e,i)=>{
        e.checked = true;
      });
    } 

  }, []);

  const handleFile = (data) => {
    const reader = new FileReader()
    reader.readAsDataURL(data)
    reader.onload = () => {
      setFile(reader.result);
    }
  }
  const handleFile2 = (data) => {
    const reader = new FileReader()
    reader.readAsDataURL(data)
    reader.onload = () => {
      setFile2(reader.result);
    }
  }
  const handleFileCord0 = (data) => {
    const reader = new FileReader()
    reader.readAsDataURL(data)
    reader.onload = () => {
      setFileCord0(reader.result);
    }
  }

  const handleFileCord2 = (data) => {
    const reader = new FileReader()
    reader.readAsDataURL(data)
    reader.onload = () => {
      setFileCord2(reader.result);
    }
  }

  function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }
  
  const printPdf = (e) => {
    window.location.href=(`/pdf/${param.id}`);
   /*
    if(form && form.signature != null){
      let r = document.querySelector('#exampleModal');

      if(form['salary_form'] != "" && form['salary_form'] != undefined && form['salary_form'].length != 0){
        form['salary_form'].map((s,i)=>{
    
          let idpr = document.createElement("div");
          idpr.innerHTML = "<div class='m-2'><h3 style='text-align:center'>Copy of PaySlip " +(i+1)+"</h3><img src='"+s.copy_of_pay+"' style='width: -webkit-fill-available;'  class='m-4'></div>";
          console.log(idpr);
          insertAfter(r,idpr);

        });
      }

      if(form['cord'] != "" && form['cord'] == "0" && form['cord0_file'] != null){
        let idpr = document.createElement("div");
        idpr.innerHTML = "<div class='m-2'><h3 style='text-align:center'>Photocopy Of Income Lack Proof</h3><img src='"+form["cord0_file"]+"' style='width: -webkit-fill-available;'  class='m-4'></div>";
        insertAfter(r,idpr);

      }

      if(form['cord'] != "" && form['cord'] == "0" && form['cord2_file'] != null){
        let idpr = document.createElement("div");
        idpr.innerHTML = "<div class='m-2'><h3 style='text-align:center'>Tax Coordination Approval</h3><img src='"+form["cord2_file"]+"' style='width: -webkit-fill-available;'  class='m-4'></div>";
        insertAfter(r,idpr);

      }

      if(form['photocopy_id_appendix'] != "" && form['identification'] == "byId"){
        let idpr = document.createElement("div");
        idpr.innerHTML = "<div class='m-2'><h3 style='text-align:center'>Photocopy Of ID Proof</h3><img src='"+form["photocopy_id_appendix"]+"' style='width: -webkit-fill-available;' class='m-4'></div>";
        insertAfter(r,idpr);

      }
       
      if(form['p-file'] != "" && form['identification'] == "passport"){
        let idpr = document.createElement("div");
        idpr.innerHTML = "<div class='m-2'><h3 style='text-align:center'>Photocopy Of Passport</h3><img src='"+form["p-file"]+"' style='width: -webkit-fill-available;'  class='m-4'></div>";
        insertAfter(r,idpr);

      }
      document.querySelector('.pdfbtn').remove();
        setTimeout(()=>{
          window.print();
          window.location.reload(true);
        },200);
       
    }*/
    
  };


  return (
    <div className='container'>
      <div className='form101 p-4'>
        {
          (form && form.signature != null) ?
            <>
              <a style={{ color: 'white' }} className='btn btn-pink float-right m-3 pdfbtn' onClick={(e) =>  printPdf(e)}> Print Pdf </a>
              <span className='btn btn-success float-right m-3'>Signed</span>
            </>
            : ''
        }

        <img src={logo} className='img-fluid broom-logo' alt='Broom Services' />
        <h1 className='text-center'>{t('form101.title')}</h1>
        <p className='text-center max600'>{t('form101.employee_card')}</p>
        <p className='text-center max600'>{t('form101.declare_week')}</p>
        <hr />
        <div className='agg-list'>
          <div className='icons'><img src={check} /></div>
          <div className='agg-text'>
            <p>{t('form101.notes_1')}</p>
          </div>
        </div>
        <div className='agg-list'>
          <div className='icons'><img src={check} /></div>
          <div className='agg-text'>
            <p>{t('form101.notes_2')}</p>
          </div>
        </div>
        <div className='agg-list'>
          <div className='icons'><img src={check} /></div>
          <div className='agg-text'>
            <p>{t('form101.notes_3')}</p>
          </div>
        </div>
        <div className='agg-list'>
          <div className='icons'><img src={check} /></div>
          <div className='agg-text'>
            <p>{t('form101.notes_4')}</p>
          </div>
        </div>
        <div className='agg-list'>
          <div className='icons'><img src={check} /></div>
          <div className='agg-text'>
            <p>{t('form101.notes_5')}</p>
          </div>
        </div>
        <div className='agg-list'>
          <div className='icons'><img src={check} /></div>
          <div className='agg-text'>
            <p>{t('form101.notes_6')}</p>
          </div>
        </div>
        <div className='box-heading'>
          <h2>{t('form101.texYearTitle')}</h2>
          <p><strong>{t('form101.year_2023')}</strong> {t('form101.year_2023_details')}</p>
        </div>
        <div className='box-heading'>
          <h2>{t('form101.employer_details')}</h2>
          <div className='row'>
            <div className='col-sm-3 col-xs-6'>
              <div className='form-group'>
                <label className='control-label'>{t('form101.label_name')}*</label>
                <input type='text' className='form-control man' onChange={(e) => handleSubmit(e)} name="name" placeholder='Name' required />
              </div>
            </div>
            <div className='col-sm-3 col-xs-6'>
              <div className='form-group'>
                <label className='control-label'>{t('form101.label_address')}</label>
                <input type='text' className='form-control man' onChange={(e) => handleSubmit(e)} name="address" placeholder='Address' />
              </div>
            </div>
            <div className='col-sm-3 col-xs-6'>
              <div className='form-group'>
                <label className='control-label'>{t('form101.label_phNum')}*</label>
                <input type='tel' className='form-control man' onChange={(e) => handleSubmit(e)} placeholder='Phone Number' name="phone_number" required />
              </div>
            </div>
            <div className='col-sm-3 col-xs-6'>
              <div className='form-group'>
                <label className='control-label'>{t('form101.label_ddfileId')}</label>
                <input type='text' className='form-control man' onChange={(e) => handleSubmit(e)} name="deduction_fileId" placeholder='Deduction file ID' />
              </div>
            </div>
          </div>
        </div>
        <div className='box-heading'>
          <h2>{t('form101.employee_details')}</h2>
          <div className='row'>
            <div className='col-sm-4 col-xs-6'>
              <div className='form-group'>
                <label className='control-label d-block'>{t('form101.idBy')}*</label>
                {
                  (form.length != 0 && form['identification'] != null) ?
                    <span className='text-success font-weight-bold'>
                      {(form['identification'] == "byId" ? 'ID Proof' : 'Passport')}
                    </span>
                    :
                    <>
                      <input className='mr-1' type="radio" name="identification" value="byId" id="byId" checked={selected === "byId"} onChange={(e) => { handleSubmit(e); setSelected(e.target.value); }} />
                      <label className='mr-2' htmlFor="byId">{t('form101.label_id')}</label>

                      <input className='mr-1' type="radio" value="passport" id="passport" checked={selected === "passport"} name="identification" onChange={(e) => { handleSubmit(e); setSelected(e.target.value); }} />
                      <label className='mr-2' ohtmlFor="passport">{t('form101.passport_foreign')}</label>
                    </>
                }

              </div>
            </div>
            <div className='col-sm-4 col-xs-6'>
              <div className='form-group'>
                <label className='control-label'>{t('form101.label_firstName')}*</label>
                <input type='text' onChange={(e) => handleSubmit(e)} name="first_name" className='form-control man' placeholder='First name' required />
              </div>
            </div>
            <div className='col-sm-4 col-xs-6'>
              <div className='form-group'>
                <label className='control-label'>{t('form101.label_lastName')}*</label>
                <input type='text' onChange={(e) => handleSubmit(e)} name="last_name" className='form-control man' placeholder='Last name' required />
              </div>
            </div>

            <div className='col-sm-12'>
              <div aria-hidden={selected !== "byId" ? true : false}>
                <div className='row'>
                  <div className='col-sm-4 col-xs-6'>
                    <div className='form-group'>
                      <label className="control-label">{t('form101.id_num')}*</label>
                      <input type='text' onChange={(e) => handleSubmit(e)} name="bid-id_number" className="form-control bid" placeholder="" required />
                    </div>
                  </div>
                  <div className='col-sm-4 col-xs-6'>
                    <div className='form-group'>
                      <label className="control-label">{t('form101.id_photocopy')}</label>
                      <input type="file" name="photocopy_id_appendix" className='bid' onChange={(e) => { handleFile(e.target.files[0]) }} style={{ display: "block" }} />
                      <img src={(file)} className="img-fluid" style={{ maxWidth: "70px", marginTop: "10px" }} />
                      {
                        form && form.signature != null && form.photocopy_id_appendix != null && <button type="button" className="btn btn-pink m-2"
                          onClick={(e) => {
                            let sf = document.querySelector('.showfile');
                            sf.setAttribute('src', form['photocopy_id_appendix']);
                            sf.style.width = '100%';
                          }}
                          data-toggle="modal" data-target="#exampleModal">
                          {t('form101.view_uploaded_file')}
                        </button>
                      }
                    </div>
                  </div>
                  <div className='col-sm-4 col-xs-6'>
                    <div className='form-group'>
                      <label className="control-label">{t('form101.dob')}*</label>
                      <input type='date' onChange={(e) => handleSubmit(e)} name="bid-dob" className="form-control bid" placeholder="" required />
                    </div>
                  </div>
                  <div className='col-sm-4 col-xs-6'>
                    <div className='form-group'>
                      <label className="control-label">{t('form101.dom')}</label>
                      <input type='date' onChange={(e) => handleSubmit(e)} name="bid-date_of_immigration" className="form-control bid" placeholder="" />
                    </div>
                  </div>
                  <div className='col-sm-4 col-xs-6'>
                    <div className='form-group'>
                      <label className='control-label'>{t('form101.settlement')}*</label>
                      <select className='form-control pid'>
                        <option value='Jerusalem'>{t('form101.jerusalem')}</option>
                        <option value='Tel Aviv Jaffa'>{t('form101.tel_aviv')}</option>
                        <option value='Haifa'>{t('form101.haifa')}</option>
                        <option value='Petah Tikva'>{t('form101.petah_tikva')}</option>
                        <option value='Beer Sheva'>{t('form101.beer_sheva')}</option>
                        <option value='Shefram'>{t('form101.sheram')}</option>
                        <option value='Rishon Lezion'>{t('form101.rishon_lezion')}</option>
                        <option value='Netanya'>{t('form101.netanya')}</option>
                        <option value='Ashkelon'>{t('form101.ashkelon')}</option>
                        <option value='Ramat Gan'>{t('form101.ramat')}</option>
                      </select>
                    </div>
                  </div>
                  <div className='col-sm-4 col-xs-6'>
                    <div className='form-group'>
                      <label className="control-label">{t('form101.ho_num')}*</label>
                      <input type='text' name="bid-house_number" className="form-control bid" placeholder="House number" />
                    </div>
                  </div>
                  <div className='col-sm-4 col-xs-6'>
                    <div className='form-group'>
                      <label className="control-label">{t('form101.street')}*</label>
                      <input type='text' onChange={(e) => handleSubmit(e)} name="bid-address" className="form-control bid" placeholder="Address" />
                    </div>
                  </div>
                  <div className='col-sm-4 col-xs-6'>
                    <div className='form-group'>
                      <label className="control-label">{t('form101.postal_code')}</label>
                      <input type='text' name="bid-postal_code" className="form-control bid" placeholder="Postal Code" />
                    </div>
                  </div>
                  <div className='col-sm-4 col-xs-6'>
                    <div className='form-group'>
                      <label className="control-label">{t('form101.mob_num')}*</label>
                      <input type='tel' onChange={(e) => handleSubmit(e)} name="bid-mobile_number" className="form-control bid" placeholder="Mobile number" required />
                    </div>
                  </div>
                  <div className='col-sm-4 col-xs-6'>
                    <div className='form-group'>
                      <label className="control-label">{t('form101.label_phNum')}</label>
                      <input type='tel' onChange={(e) => handleSubmit(e)} name="bid-phone_number" className="form-control bid" placeholder="Phone number" />
                    </div>
                  </div>
                  <div className='col-sm-4 col-xs-6'>
                    <div className='form-group'>
                      <label className="control-label">{t('form101.label_email')}*</label>
                      <input type='email' onChange={(e) => handleSubmit(e)} name="bid-email" className="form-control bid" placeholder="Email" required />
                    </div>
                  </div>
                  <div className='col-sm-4 col-xs-6'>
                    <div className='form-group'>
                      {
                        (form.length != 0 && form['bid-sex'] != null) ?
                          <>
                            <label className="control-label d-block">{t('form101.label_sex')}*</label>
                            <span className='text-success font-weight-bold'>{form['bid-sex']}</span>
                          </>
                          :
                          <>
                            <label className="control-label d-block">{t('form101.label_sex')}*</label>
                            <input className='mr-1 bidr' onChange={(e) => handleSubmit(e)} name="bid-sex" type="radio" value="Male" id="Male" checked />
                            <label className='mr-2' htmlFor="Male">{t('form101.label_male')}</label>
                            <input className='mr-1 bidr' onChange={(e) => handleSubmit(e)} name="bid-sex" type="radio" value="Female" id="Female" />
                            <label className='mr-2' ohtmlFor="Female">{t('form101.label_female')}</label>
                          </>
                      }

                    </div>
                  </div>
                  <div className='col-sm-12'>
                    <div className='row'>
                      <div className='col-sm-3'>
                        <div className='form-group'>
                          <label className="control-label">{t('form101.martial_status')}</label>
                          {
                            (form.length != 0 && form['bid-martial'] != null) ?
                              <>
                                <div class="form-check">
                                  <span class="text-success font-weight-bold">{form['bid-martial']}</span>
                                </div>
                              </>
                              :
                              <>
                                <div class="form-check">
                                  <input class="form-check-input bidr" type="radio" id="io_check" onChange={(e) => handleSubmit(e)} name="bid-martial"  value="Single" />
                                  <label class="form-check-label" for="Single">{t('form101.status_single')}</label>
                                </div>
                                <div class="form-check">
                                  <input class="form-check-input bidr" type="radio" onChange={(e) => handleSubmit(e)} name="bid-martial" id="mstatus" value="Married" />
                                  <label class="form-check-label" for="Married">{t('form101.status_married')}</label>
                                </div>
                                <div class="form-check">
                                  <input class="form-check-input bidr" type="radio" onChange={(e) => handleSubmit(e)} name="bid-martial" id="mstatus" value="Divorcee" />
                                  <label class="form-check-label" for="Divorcee">{t('form101.status_divorcee')}</label>
                                </div>
                                <div class="form-check">
                                  <input class="form-check-input bidr" type="radio" onChange={(e) => handleSubmit(e)} name="bid-martial" id="mstatus" value="A widower" />
                                  <label class="form-check-label" for="widower">{t('form101.status_widower')}</label>
                                </div>
                                <div class="form-check">
                                  <input class="form-check-input bidr" type="radio" onChange={(e) => handleSubmit(e)} name="bid-martial" id="mstatus" value="Separated" />
                                  <label class="form-check-label" for="Separated">{t('form101.status_separated')}</label>
                                </div>
                              </>

                          }
                        </div>
                      </div>
                      <div className='col-sm-3'>
                        <div className='form-group'>
                          <label className="control-label">{t('form101.israeli_resident')}</label>
                          {
                            (form.length != 0 && form['bid-israeli'] != null) ?
                              <>
                                <div class="form-check">
                                  <span className='text-success font-weight-bold'>{form['bid-israeli']}</span>
                                </div>
                              </>

                              :
                              <>
                                <div class="form-check">
                                  <input class="form-check-input bidr" type="radio" onChange={(e) => handleSubmit(e)} name="bid-israeli" id="io_check" value="Yes" />
                                  <label class="form-check-label" for="Yes">{t('form101.label_yes')}</label>
                                </div>
                                <div class="form-check">
                                  <input class="form-check-input bidr" type="radio" onChange={(e) => handleSubmit(e)} name="bid-israeli" id="resident" value="No" />
                                  <label class="form-check-label" for="No">{t('form101.label_no')}</label>
                                </div>
                              </>
                          }


                        </div>
                      </div>
                      <div className='col-sm-3'>
                        <div className='form-group'>
                          <label className="control-label">{t('form101.cop_member')}</label>
                          {
                            (form.length != 0 && form['bid-member'] != null) ?
                              <>
                                <div class="form-check">
                                  <span className='text-success font-weight-bold'>{form['bid-member']}</span>
                                </div>
                              </>
                              :
                              <>
                                <div class="form-check">
                                  <input class="form-check-input bidr" type="radio" onChange={(e) => handleSubmit(e)} name="bid-member" id="io_check" value="Yes" />
                                  <label class="form-check-label" for="Yes">{t('form101.label_yes')}</label>
                                </div>
                                <div class="form-check">
                                  <input class="form-check-input" type="radio" name="bid-member" onChange={(e) => handleSubmit(e)} id="session" value="No" />
                                  <label class="form-check-label" for="No">{t('form101.label_no')}</label>
                                </div>

                              </>
                          }

                        </div>
                      </div>
                      <div className='col-sm-3'>
                        <div className='form-group'>
                          <label className="control-label">{t('form101.hmo_member')}</label>
                          {
                            (form.length != 0 && form['bid-hmo'] != null) ?
                              <>
                                <div class="form-check">
                                  <span className='text-success font-weight-bold'>{form['bid-hmo']}</span>
                                </div>
                              </>
                              :
                              <>
                                <div class="form-check">
                                  <input class="form-check-input bidr" type="radio" onChange={(e) => handleSubmit(e)} name="bid-hmo" id="member" value="Yes" />
                                  <label class="form-check-label" for="Yes">{t('form101.label_yes')}</label>
                                </div>
                                <div class="form-check">
                                  <input class="form-check-input bidr" type="radio" onChange={(e) => handleSubmit(e)} name="bid-hmo" id="io_check"  value="No" />
                                  <label class="form-check-label" for="No">{t('form101.label_no')}</label>
                                </div>
                              </>
                          }

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-sm-12'>
              <div aria-hidden={selected !== "passport" ? true : false}>
                <div className='row'>
                  <div className='col-sm-4'>
                    <div className='form-group'>
                      <label className='control-label'>{t('form101.country_passport')}</label>
                      {
                        (form.length != 0 && form['country'] != null) ?
                          <input type="text" className='form-control' value={form['country']} readOnly />
                          :
                          <select id="country" name="country" onChange={(e) => handleSubmit(e)} class="form-control">
                            <option value="Afghanistan">Afghanistan</option>
                            <option value="Åland Islands">Åland Islands</option>
                            <option value="Albania">Albania</option>
                            <option value="Algeria">Algeria</option>
                            <option value="American Samoa">American Samoa</option>
                            <option value="Andorra">Andorra</option>
                            <option value="Angola">Angola</option>
                            <option value="Anguilla">Anguilla</option>
                            <option value="Antarctica">Antarctica</option>
                            <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                            <option value="Argentina">Argentina</option>
                            <option value="Armenia">Armenia</option>
                            <option value="Aruba">Aruba</option>
                            <option value="Australia">Australia</option>
                            <option value="Austria">Austria</option>
                            <option value="Azerbaijan">Azerbaijan</option>
                            <option value="Bahamas">Bahamas</option>
                            <option value="Bahrain">Bahrain</option>
                            <option value="Bangladesh">Bangladesh</option>
                            <option value="Barbados">Barbados</option>
                            <option value="Belarus">Belarus</option>
                            <option value="Belgium">Belgium</option>
                            <option value="Belize">Belize</option>
                            <option value="Benin">Benin</option>
                            <option value="Bermuda">Bermuda</option>
                            <option value="Bhutan">Bhutan</option>
                            <option value="Bolivia">Bolivia</option>
                            <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                            <option value="Botswana">Botswana</option>
                            <option value="Bouvet Island">Bouvet Island</option>
                            <option value="Brazil">Brazil</option>
                            <option value="British Indian Ocean Territory">British Indian Ocean Territory</option>
                            <option value="Brunei Darussalam">Brunei Darussalam</option>
                            <option value="Bulgaria">Bulgaria</option>
                            <option value="Burkina Faso">Burkina Faso</option>
                            <option value="Burundi">Burundi</option>
                            <option value="Cambodia">Cambodia</option>
                            <option value="Cameroon">Cameroon</option>
                            <option value="Canada">Canada</option>
                            <option value="Cape Verde">Cape Verde</option>
                            <option value="Cayman Islands">Cayman Islands</option>
                            <option value="Central African Republic">Central African Republic</option>
                            <option value="Chad">Chad</option>
                            <option value="Chile">Chile</option>
                            <option value="China">China</option>
                            <option value="Christmas Island">Christmas Island</option>
                            <option value="Cocos (Keeling) Islands">Cocos (Keeling) Islands</option>
                            <option value="Colombia">Colombia</option>
                            <option value="Comoros">Comoros</option>
                            <option value="Congo">Congo</option>
                            <option value="Congo, The Democratic Republic of The">Congo, The Democratic Republic of The</option>
                            <option value="Cook Islands">Cook Islands</option>
                            <option value="Costa Rica">Costa Rica</option>
                            <option value="Cote D'ivoire">Cote D'ivoire</option>
                            <option value="Croatia">Croatia</option>
                            <option value="Cuba">Cuba</option>
                            <option value="Cyprus">Cyprus</option>
                            <option value="Czech Republic">Czech Republic</option>
                            <option value="Denmark">Denmark</option>
                            <option value="Djibouti">Djibouti</option>
                            <option value="Dominica">Dominica</option>
                            <option value="Dominican Republic">Dominican Republic</option>
                            <option value="Ecuador">Ecuador</option>
                            <option value="Egypt">Egypt</option>
                            <option value="El Salvador">El Salvador</option>
                            <option value="Equatorial Guinea">Equatorial Guinea</option>
                            <option value="Eritrea">Eritrea</option>
                            <option value="Estonia">Estonia</option>
                            <option value="Ethiopia">Ethiopia</option>
                            <option value="Falkland Islands (Malvinas)">Falkland Islands (Malvinas)</option>
                            <option value="Faroe Islands">Faroe Islands</option>
                            <option value="Fiji">Fiji</option>
                            <option value="Finland">Finland</option>
                            <option value="France">France</option>
                            <option value="French Guiana">French Guiana</option>
                            <option value="French Polynesia">French Polynesia</option>
                            <option value="French Southern Territories">French Southern Territories</option>
                            <option value="Gabon">Gabon</option>
                            <option value="Gambia">Gambia</option>
                            <option value="Georgia">Georgia</option>
                            <option value="Germany">Germany</option>
                            <option value="Ghana">Ghana</option>
                            <option value="Gibraltar">Gibraltar</option>
                            <option value="Greece">Greece</option>
                            <option value="Greenland">Greenland</option>
                            <option value="Grenada">Grenada</option>
                            <option value="Guadeloupe">Guadeloupe</option>
                            <option value="Guam">Guam</option>
                            <option value="Guatemala">Guatemala</option>
                            <option value="Guernsey">Guernsey</option>
                            <option value="Guinea">Guinea</option>
                            <option value="Guinea-bissau">Guinea-bissau</option>
                            <option value="Guyana">Guyana</option>
                            <option value="Haiti">Haiti</option>
                            <option value="Heard Island and Mcdonald Islands">Heard Island and Mcdonald Islands</option>
                            <option value="Holy See (Vatican City State)">Holy See (Vatican City State)</option>
                            <option value="Honduras">Honduras</option>
                            <option value="Hong Kong">Hong Kong</option>
                            <option value="Hungary">Hungary</option>
                            <option value="Iceland">Iceland</option>
                            <option value="India">India</option>
                            <option value="Indonesia">Indonesia</option>
                            <option value="Iran, Islamic Republic of">Iran, Islamic Republic of</option>
                            <option value="Iraq">Iraq</option>
                            <option value="Ireland">Ireland</option>
                            <option value="Isle of Man">Isle of Man</option>
                            <option value="Israel">Israel</option>
                            <option value="Italy">Italy</option>
                            <option value="Jamaica">Jamaica</option>
                            <option value="Japan">Japan</option>
                            <option value="Jersey">Jersey</option>
                            <option value="Jordan">Jordan</option>
                            <option value="Kazakhstan">Kazakhstan</option>
                            <option value="Kenya">Kenya</option>
                            <option value="Kiribati">Kiribati</option>
                            <option value="Korea, Democratic People's Republic of">Korea, Democratic People's Republic of</option>
                            <option value="Korea, Republic of">Korea, Republic of</option>
                            <option value="Kuwait">Kuwait</option>
                            <option value="Kyrgyzstan">Kyrgyzstan</option>
                            <option value="Lao People's Democratic Republic">Lao People's Democratic Republic</option>
                            <option value="Latvia">Latvia</option>
                            <option value="Lebanon">Lebanon</option>
                            <option value="Lesotho">Lesotho</option>
                            <option value="Liberia">Liberia</option>
                            <option value="Libyan Arab Jamahiriya">Libyan Arab Jamahiriya</option>
                            <option value="Liechtenstein">Liechtenstein</option>
                            <option value="Lithuania">Lithuania</option>
                            <option value="Luxembourg">Luxembourg</option>
                            <option value="Macao">Macao</option>
                            <option value="Macedonia, The Former Yugoslav Republic of">Macedonia, The Former Yugoslav Republic of</option>
                            <option value="Madagascar">Madagascar</option>
                            <option value="Malawi">Malawi</option>
                            <option value="Malaysia">Malaysia</option>
                            <option value="Maldives">Maldives</option>
                            <option value="Mali">Mali</option>
                            <option value="Malta">Malta</option>
                            <option value="Marshall Islands">Marshall Islands</option>
                            <option value="Martinique">Martinique</option>
                            <option value="Mauritania">Mauritania</option>
                            <option value="Mauritius">Mauritius</option>
                            <option value="Mayotte">Mayotte</option>
                            <option value="Mexico">Mexico</option>
                            <option value="Micronesia, Federated States of">Micronesia, Federated States of</option>
                            <option value="Moldova, Republic of">Moldova, Republic of</option>
                            <option value="Monaco">Monaco</option>
                            <option value="Mongolia">Mongolia</option>
                            <option value="Montenegro">Montenegro</option>
                            <option value="Montserrat">Montserrat</option>
                            <option value="Morocco">Morocco</option>
                            <option value="Mozambique">Mozambique</option>
                            <option value="Myanmar">Myanmar</option>
                            <option value="Namibia">Namibia</option>
                            <option value="Nauru">Nauru</option>
                            <option value="Nepal">Nepal</option>
                            <option value="Netherlands">Netherlands</option>
                            <option value="Netherlands Antilles">Netherlands Antilles</option>
                            <option value="New Caledonia">New Caledonia</option>
                            <option value="New Zealand">New Zealand</option>
                            <option value="Nicaragua">Nicaragua</option>
                            <option value="Niger">Niger</option>
                            <option value="Nigeria">Nigeria</option>
                            <option value="Niue">Niue</option>
                            <option value="Norfolk Island">Norfolk Island</option>
                            <option value="Northern Mariana Islands">Northern Mariana Islands</option>
                            <option value="Norway">Norway</option>
                            <option value="Oman">Oman</option>
                            <option value="Pakistan">Pakistan</option>
                            <option value="Palau">Palau</option>
                            <option value="Palestinian Territory, Occupied">Palestinian Territory, Occupied</option>
                            <option value="Panama">Panama</option>
                            <option value="Papua New Guinea">Papua New Guinea</option>
                            <option value="Paraguay">Paraguay</option>
                            <option value="Peru">Peru</option>
                            <option value="Philippines">Philippines</option>
                            <option value="Pitcairn">Pitcairn</option>
                            <option value="Poland">Poland</option>
                            <option value="Portugal">Portugal</option>
                            <option value="Puerto Rico">Puerto Rico</option>
                            <option value="Qatar">Qatar</option>
                            <option value="Reunion">Reunion</option>
                            <option value="Romania">Romania</option>
                            <option value="Russian Federation">Russian Federation</option>
                            <option value="Rwanda">Rwanda</option>
                            <option value="Saint Helena">Saint Helena</option>
                            <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                            <option value="Saint Lucia">Saint Lucia</option>
                            <option value="Saint Pierre and Miquelon">Saint Pierre and Miquelon</option>
                            <option value="Saint Vincent and The Grenadines">Saint Vincent and The Grenadines</option>
                            <option value="Samoa">Samoa</option>
                            <option value="San Marino">San Marino</option>
                            <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                            <option value="Saudi Arabia">Saudi Arabia</option>
                            <option value="Senegal">Senegal</option>
                            <option value="Serbia">Serbia</option>
                            <option value="Seychelles">Seychelles</option>
                            <option value="Sierra Leone">Sierra Leone</option>
                            <option value="Singapore">Singapore</option>
                            <option value="Slovakia">Slovakia</option>
                            <option value="Slovenia">Slovenia</option>
                            <option value="Solomon Islands">Solomon Islands</option>
                            <option value="Somalia">Somalia</option>
                            <option value="South Africa">South Africa</option>
                            <option value="South Georgia and The South Sandwich Islands">South Georgia and The South Sandwich Islands</option>
                            <option value="Spain">Spain</option>
                            <option value="Sri Lanka">Sri Lanka</option>
                            <option value="Sudan">Sudan</option>
                            <option value="Suriname">Suriname</option>
                            <option value="Svalbard and Jan Mayen">Svalbard and Jan Mayen</option>
                            <option value="Swaziland">Swaziland</option>
                            <option value="Sweden">Sweden</option>
                            <option value="Switzerland">Switzerland</option>
                            <option value="Syrian Arab Republic">Syrian Arab Republic</option>
                            <option value="Taiwan">Taiwan</option>
                            <option value="Tajikistan">Tajikistan</option>
                            <option value="Tanzania, United Republic of">Tanzania, United Republic of</option>
                            <option value="Thailand">Thailand</option>
                            <option value="Timor-leste">Timor-leste</option>
                            <option value="Togo">Togo</option>
                            <option value="Tokelau">Tokelau</option>
                            <option value="Tonga">Tonga</option>
                            <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                            <option value="Tunisia">Tunisia</option>
                            <option value="Turkey">Turkey</option>
                            <option value="Turkmenistan">Turkmenistan</option>
                            <option value="Turks and Caicos Islands">Turks and Caicos Islands</option>
                            <option value="Tuvalu">Tuvalu</option>
                            <option value="Uganda">Uganda</option>
                            <option value="Ukraine">Ukraine</option>
                            <option value="United Arab Emirates">United Arab Emirates</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="United States">United States</option>
                            <option value="United States Minor Outlying Islands">United States Minor Outlying Islands</option>
                            <option value="Uruguay">Uruguay</option>
                            <option value="Uzbekistan">Uzbekistan</option>
                            <option value="Vanuatu">Vanuatu</option>
                            <option value="Venezuela">Venezuela</option>
                            <option value="Viet Nam">Viet Nam</option>
                            <option value="Virgin Islands, British">Virgin Islands, British</option>
                            <option value="Virgin Islands, U.S.">Virgin Islands, U.S.</option>
                            <option value="Wallis and Futuna">Wallis and Futuna</option>
                            <option value="Western Sahara">Western Sahara</option>
                            <option value="Yemen">Yemen</option>
                            <option value="Zambia">Zambia</option>
                            <option value="Zimbabwe">Zimbabwe</option>
                          </select>
                      }
                    </div>
                  </div>
                  <div className='col-sm-4'>
                    <div className='form-group'>
                      <label className='control-label'>{t('form101.passport_num')}*</label>
                      <input type='text' className='form-control pid' onChange={(e) => handleSubmit(e)} name="p-passport_number" placeholder='Passport Number' />
                    </div>
                  </div>
                  <div className='col-sm-4'>
                    <div className='form-group'>
                      <label className='control-label'>{t('form101.passport_photo')}</label>
                      <input type="file" onChange={e => { handleFile2(e.target.files[0]) }} name="p-file" style={{ display: "block" }} />
                      <img src={(file2)} className="img-fluid pid" style={{ maxWidth: "70px", marginTop: "10px" }} />
                      {
                        form && form.signature != null && form['p-file'] !=null && <button type="button" className="btn btn-pink m-2"
                          onClick={(e) => {
                            let sf = document.querySelector('.showfile');
                            sf.setAttribute('src', form['p-file']);
                            sf.style.width = '100%';
                          }}
                          data-toggle="modal" data-target="#exampleModal">
                          {t('form101.view_uploaded_file')}
                        </button>
                      }
                    </div>
                  </div>
                  <div className='col-sm-4'>
                    <div className='form-group'>
                      <label className='control-label'>{t('form101.dob')}*</label>
                      <input type="date" onChange={(e) => handleSubmit(e)} name="p-dob" className='form-control pid' />
                    </div>
                  </div>
                  <div className='col-sm-4'>
                    <div className='form-group'>
                      <label className='control-label'>{t('form101.settlement')}*</label>
                      {
                        (form.length != 0 && form['p-settlement'] != null) ?
                          <input type="text" className='form-control' value={form['p-settlement']} readOnly />
                          :
                          <select className='form-control pid' onChange={(e) => handleSubmit(e)} name="p-settlement">
                            <option value='Jerusalem'>{t('form101.jerusalem')}</option>
                            <option value='Tel Aviv Jaffa'>{t('form101.tel_aviv')}</option>
                            <option value='Haifa'>{t('form101.haifa')}</option>
                            <option value='Petah Tikva'>{t('form101.petah_tikva')}</option>
                            <option value='Beer Sheva'>{t('form101.beer_sheva')}</option>
                            <option value='Shefram'>{t('form101.shefram')}</option>
                            <option value='Rishon Lezion'>{t('form101.rishon_lezion')}</option>
                            <option value='Netanya'>{t('form101.netanya')}</option>
                            <option value='Ashkelon'>{t('form101.ashkelon')}</option>
                            <option value='Ramat Gan'>{t('form101.ramat')}</option>
                          </select>
                      }
                    </div>
                  </div>
                  <div className='col-sm-4'>
                    <div className='form-group'>
                      <label className='control-label'>{t('form101.street')}*</label>
                      <input type="text" className='form-control pid' onChange={(e) => handleSubmit(e)} name="p-street" placeholder='Street' required />
                    </div>
                  </div>
                  <div className='col-sm-4'>
                    <div className='form-group'>
                      <label className='control-label'>{t('form101.ho_num')}*</label>
                      <input type="text" className='form-control pid' onChange={(e) => handleSubmit(e)} name="p-house_number" placeholder='House Number' required />
                    </div>
                  </div>
                  <div className='col-sm-4'>
                    <div className='form-group'>
                      <label className='control-label'>{t('form101.postal_code')}</label>
                      <input type="text" className='form-control pid' onChange={(e) => handleSubmit(e)} name="p-postal_code" placeholder='Postal Code' />
                    </div>
                  </div>
                  <div className='col-sm-4'>
                    <div className='form-group'>
                      <label className='control-label'>{t('form101.mob_num')}*</label>
                      <input type="text" className='form-control pid' onChange={(e) => handleSubmit(e)} name="p-mobile_number" placeholder='Mobile number' required />
                    </div>
                  </div>
                  <div className='col-sm-4'>
                    <div className='form-group'>
                      <label className='control-label'>{t('form101.label_phNum')}</label>
                      <input type="text" className='form-control pid' onChange={(e) => handleSubmit(e)} name="p-phone_number" placeholder='Phone number' />
                    </div>
                  </div>
                  <div className='col-sm-4'>
                    <div className='form-group'>
                      <label className='control-label'>{t('form101.label_email')}*</label>
                      <input type="email" className='form-control pid' onChange={(e) => handleSubmit(e)} name="p-email" placeholder='E-mail address' required />
                    </div>
                  </div>
                  <div className='col-sm-4'>
                    <div className='form-group'>
                      <label className="control-label">{t('form101.label_sex')}</label>
                      {
                        (form.length != 0 && form['p-sex'] != null) ?
                          <>
                            <div class="form-check">
                              <span className='text-success font-weight-bold'>{form['p-sex']}</span>
                            </div>
                          </> :
                          <>
                            <div class="form-check">
                              <input class="form-check-input pidr" type="radio" onChange={(e) => handleSubmit(e)} name="p-sex" id="sex" value="Male" checked />
                              <label class="form-check-label" for="Male">{t('form101.label_male')}</label>
                            </div>
                            <div class="form-check">
                              <input class="form-check-input pidr" type="radio" onChange={(e) => handleSubmit(e)} name="p-sex" id="sex" value="Female" />
                              <label class="form-check-label" for="Female">{t('form101.label_female')}</label>
                            </div>
                          </>
                      }

                    </div>
                  </div>
                  <div className='col-sm-4'>
                    <div className='form-group'>
                      <label className="control-label">{t('form101.martial_status')}</label>
                      {
                        (form.length != 0 && form['p-martial'] != null) ?
                          <>
                            <div class="form-check">
                              <span className='text-success font-weight-bold'>{form['p-martial']}</span>
                            </div>
                          </>
                          :
                          <>
                            <div class="form-check">
                              <input class="form-check-input pidr" type="radio" id="io_check" onChange={(e) => handleSubmit(e)} name="p-martial"  value="Single" />
                              <label class="form-check-label" for="Single">{t('form101.status_single')}</label>
                            </div>
                            <div class="form-check">
                              <input class="form-check-input pidr" type="radio" onChange={(e) => handleSubmit(e)} name="p-martial" id="mstatus2" value="Married" />
                              <label class="form-check-label" for="Married">{t('form101.status_married')}</label>
                            </div>
                            <div class="form-check">
                              <input class="form-check-input pidr" type="radio" onChange={(e) => handleSubmit(e)} name="p-martial" id="mstatus2" value="Divorcee" />
                              <label class="form-check-label" for="Divorcee">{t('form101.status_divorcee')}</label>
                            </div>
                            <div class="form-check">
                              <input class="form-check-input pidr" type="radio" onChange={(e) => handleSubmit(e)} name="p-martial" id="mstatus2" value="A widower" />
                              <label class="form-check-label" for="widower">{t('form101.status_widower')}</label>
                            </div>
                            <div class="form-check">
                              <input class="form-check-input pidr" type="radio" onChange={(e) => handleSubmit(e)} name="p-martial" id="mstatus2" value="Separated" />
                              <label class="form-check-label" for="Separated">{t('form101.status_separated')}</label>
                            </div>
                          </>
                      }

                    </div>
                  </div>
                  <div className='col-sm-4'>
                    <div className='form-group'>
                      <label className="control-label">{t('form101.hmo_member')}</label>
                      {
                        (form.length != 0 && form['p-hmo'] != null) ?
                          <>
                            <div class="form-check">
                              <span className='text-success font-weight-bold'>{form['p-hmo']}</span>
                            </div>
                          </> :
                          <>
                            <div class="form-check">
                              <input class="form-check-input pidr" type="radio" onChange={(e) => handleSubmit(e)} name="p-hmo" id="hmoMember" value="Yes" />
                              <label class="form-check-label" for="Yes">{t('form101.label_yes')}</label>
                            </div>
                            <div class="form-check">
                              <input class="form-check-input pidr" type="radio" onChange={(e) => handleSubmit(e)} name="p-hmo" id="io_check"  value="No" />
                              <label class="form-check-label" for="No">{t('form101.label_no')}</label>
                            </div>
                          </>

                      }

                    </div>
                  </div>
                </div>
              </div>
              <div className=''></div>
            </div>
          </div>
        </div>
        <div className='box-heading'>
          <h2>{t('form101.children_headline')}</h2>
          <form onSubmit={handleSave}>
            {formValues.map((element, index) => (
              <div className="slotForm" key={index}>
                <div className='row'>
                  <div className='col-sm-4'>
                    <div className='form-group'>
                      <label className='control-label'>{t('form101.label_name')}*</label>
                      <input type='text' className='form-control' readOnly={form && form.signature != null ? 'readonly' : ''} name='name' placeholder='Name' value={element.name || ""} onChange={(e) => { handleChildChange(index, e); }} />
                    </div>
                  </div>
                  <div className='col-sm-4'>
                    <div className='form-group'>
                      <label className='control-label'>{t('form101.id_num')}*</label>
                      <input type="text" name="idnum" readOnly={form && form.signature != null ? 'readonly' : ''} className='form-control' placeholder='ID Number' value={element.idnum || ""} onChange={(e) => { handleChildChange(index, e); }} />
                    </div>
                  </div>
                  <div className='col-sm-4'>
                    <div className='form-group'>
                      <label className='control-label'>{t('form101.dob')}*</label>
                      <input type="date" name="childDob" readOnly={form && form.signature != null ? 'readonly' : ''} className='form-control' placeholder='Date of Birth' value={element.childDob || ""} onChange={(e) => { handleChildChange(index, e); }} />
                    </div>
                  </div>
                  <div className='col-sm-4'>
                    <div className='form-group'>
                      {
                        (element.custody == '1') ?
                          <><input type="checkbox" checked name="custody" value={element.custody || ""} onChange={(e) => { handleChildChange(index, e); }} /> {t('form101.child_custody')}</> :
                          <><input type="checkbox" name="custody" value={element.custody || ""} onChange={(e) => { handleChildChange(index, e); }} /> {t('form101.child_custody')}</>
                      }

                    </div>
                  </div>
                  <div className='col-sm-4'>
                    <div className='form-group'>
                      {
                        element.childBenefit == '1' ?
                          <><input type="checkbox" checked name="childBenefit" value={element.childBenefit || ""} onChange={(e) => { handleChildChange(index, e);; }} /> {t('form101.child_insurance')}</> :
                          <><input type="checkbox" name="childBenefit" value={element.childBenefit || ""} onChange={(e) => { handleChildChange(index, e);; }} /> {t('form101.child_insurance')}</>
                      }

                    </div>
                  </div>
                  <div className='col-sm-2'>
                    <div className='form-group'>
                      <label className='control-label'>&nbsp;</label>
                      <button type="button" className="btn btn-danger remove saveBtn mt-4" onClick={() => removeFormFields(index)}>{t('form101.button_remove')}</button>
                      {/*
                        index && form.length == 0 ?
                          
                          : null
                    */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </form>
          {
            form.length == 0 &&
            <button className="btn btn-success button add slotBtn mb-3" type="button" onClick={() => addFormFields()}>{t('form101.button_addChild')}</button>
          }
        </div>
        <div className='box-heading'>
          <h2>{t('form101.employer_income_details')}</h2>
          <div className='form-group'>
            <label className='control-label'>{t('form101.text_accept')}*</label>
            {
              (form.length != 0 && form['income'] != null) ?
                <>
                  <div class="form-check">
                    <span className='text-success font-weight-bold'>{form['income'].income}</span>
                  </div>

                </>
                :
                <>
                  <div className='row'>
                    <div className='col-sm-4'>
                      <div className='form-group'>
                        <input type='checkbox' value='A month salary' onChange={(e) => handleSubmit(e)} name='income' /> {t('form101.month_salary')}
                      </div>
                    </div>
                    <div className='col-sm-4'>
                      <div className='form-group'>
                        <input type='checkbox' value='Salary for an additional position' onChange={(e) => handleSubmit(e)} name='income' /> {t('form101.salary_ap')}
                      </div>
                    </div>
                    <div className='col-sm-4'>
                      <div className='form-group'>
                        <input type='checkbox' value='Partial salary' onChange={(e) => handleSubmit(e)} name='income' /> {t('form101.partial_salary')}
                      </div>
                    </div>
                    <div className='col-sm-4'>
                      <div className='form-group'>
                        <input type='checkbox' value='Scholarship' onChange={(e) => handleSubmit(e)} name='income' /> {t('form101.scholarship')}
                      </div>
                    </div>
                    <div className='col-sm-4'>
                      <div className='form-group'>
                        <input type='checkbox' value='Allowance' onChange={(e) => handleSubmit(e)} name='income' /> {t('form101.allowance')}
                      </div>
                    </div>
                    <div className='col-sm-4'>
                      <div className='form-group'>
                        <input type='checkbox' value='Wages (Daily worker)' onChange={(e) => handleSubmit(e)} name='income' /> {t('form101.daily_wages')}
                      </div>
                    </div>
                  </div>
                </>
            }
            <div class="row mt-2">
              <div className='col-sm-6'>
                <div className='form-group'>
                  <label className='control-label'>{t('form101.do_commencement')}*</label>
                  <input type='date' className='form-control' onChange={(e) => handleSubmit(e)} name='taxDate' />
                </div>
              </div>
            </div>

          </div>
        </div>
        <div className='box-heading'>
          <h2>{t('form101.other_income_details')}</h2>
          <div className='form-group'>
            <label className='control-label'>{t('form101.if_other_income')}</label>
            <div className='row'>
              <div className='col-sm-6'>
                <div className='form-group'>
                  {
                    form && form.signature != null && form.moreIncome == false ?
                      <><input type='radio' checked name='moreIncome' id='moreIncome1' value="No" onClick={() => setExIncome(false)} /> {t('form101.if_income_no')}</> :
                      <><input type='radio' disabled={form && form.signature != null} name='moreIncome' id='moreIncome1' value="No" onClick={() => setExIncome(false)} /> {t('form101.if_income_no')}</>
                  }

                </div>
              </div>
              <div className='col-sm-6'>
                <div className='form-group'>
                  {
                    form && form.signature != null && form.moreIncome == true ?
                      <> <input type='radio' checked name='moreIncome' id='moreIncome2' value="Yes" onClick={() => { setExIncome(true); setTimeout(() => { document.querySelector('#cp1').checked = true; }, 200); }} /> {t('form101.if_income_yes')}</> :
                      <> <input type='radio' disabled={form && form.signature != null} name='moreIncome' id='moreIncome2' value="Yes" onClick={() => { setExIncome(true); setTimeout(() => { document.querySelector('#cp1').checked = true; }, 200); }} /> {t('form101.if_income_yes')}</>
                  }

                </div>
              </div>
            </div>
            {exIncome ?

              (form.length != 0 && form['breakIncome'] != null) ?
                <>
                  <div className='form-group'>
                    <label class="control-label">{t('form101.income_breakdown')}*</label>
                    <div class="form-check">
                      <span className='text-success font-weight-bold'>{form['breakIncome'].breakIncome}</span>
                    </div>
                  </div>

                </>
                :
                <>
                  <div className='form-group'>
                    <label class="control-label">{t('form101.income_breakdown')}*</label>
                    <div className='row'>
                      <div className='col-sm-4'>
                        <div class="form-group">
                          <input type="checkbox" name="breakIncome" value="A month's salary" onChange={e => handleSubmit(e)} /> {t('form101.month_salary')}
                        </div>
                      </div>
                      <div className='col-sm-4'>
                        <div class="form-group">
                          <input type="checkbox" name="breakIncome" value="Salary for an additional position" onChange={e => handleSubmit(e)} /> {t('form101.salary_ap')}
                        </div>
                      </div>
                      <div className='col-sm-4'>
                        <div class="form-group">
                          <input type="checkbox" name="breakIncome" value="Partial salary" onChange={e => handleSubmit(e)} /> {t('form101.partial_salary')}
                        </div>
                      </div>
                      <div className='col-sm-4'>
                        <div class="form-group">
                          <input type="checkbox" name="breakIncome" value="Scholarship" onChange={e => handleSubmit(e)} /> {t('form101.scholarship')}
                        </div>
                      </div>
                      <div className='col-sm-4'>
                        <div class="form-group">
                          <input type="checkbox" name="breakIncome" value="Allowance" onChange={e => handleSubmit(e)} /> {t('form101.allowance')}
                        </div>
                      </div>
                      <div className='col-sm-4'>
                        <div class="form-group">
                          <input type="checkbox" name="breakIncome" value="Wages (Daily worker)" onChange={e => handleSubmit(e)} /> {t('form101.daily_wages')}
                        </div>
                      </div>
                    </div>
                  </div>
                </> : ''
            }
            {exIncome ?
              <>
                <label class='control-label'>{t('form101.text_credits')}*</label>
                <div className='row'>
                  <div className='col-sm-6'>
                    <div className='form-group'>
                      {
                        form && form.signature != null && form.creditPoints == "donot" ?
                          <> <input type='radio' checked name='creditPoints' id="cp1" value="donot" onChange={e => handleSubmit(e)} /> {t('form101.text_credit1')}</> :
                          <><input type='radio' disabled={form && form.signature != null} name='creditPoints' id="cp1" value="donot" onChange={e => handleSubmit(e)} /> {t('form101.text_credit1')}</>
                      }

                    </div>
                  </div>
                  <div className='col-sm-6'>
                    <div className='form-group'>
                      {
                        form && form.signature != null && form.creditPoints == "receive" ?
                          <><input type='radio' checked name='creditPoints' value="receive" onChange={e => handleSubmit(e)} /> {t('form101.text_credit2')}</> :
                          <><input type='radio' disabled={form && form.signature != null} name='creditPoints' value="receive" onChange={e => handleSubmit(e)} /> {t('form101.text_credit2')}</>
                      }
                    </div>
                  </div>
                </div>
                <label class='control-label'>{t('form101.text_excretions')}</label>
                <div className='row'>
                  <div className='col-sm-6'>
                    <div className='form-group'>
                      {
                        form && form.signature != null && form.excertion != null && form['excertion'].excertion != undefined && form['excertion'].excertion.includes("excluded") ?
                          <><input type='checkbox' checked name='excertion' id='excertion1' value="excluded" onChange={e => handleSubmit(e)} /> {t('form101.text_excretion1')}</> :
                          <><input type='checkbox' disabled={form && form.signature != null} name='excertion' id='excertion1' value="excluded" onChange={e => handleSubmit(e)} /> {t('form101.text_excretion1')}</>
                      }
                    </div>
                  </div>
                  <div className='col-sm-6'>
                    <div className='form-group'>
                      {
                        form && form.signature != null && form.excertion != null &&  form['excertion'].excertion != undefined && form['excertion'].excertion.includes("included") ?
                          <><input type='checkbox' checked name='excertion' value="included" onChange={e => handleSubmit(e)} /> {t('form101.text_excretion2')}</> :
                          <><input type='checkbox' disabled={form && form.signature != null} name='excertion' value="included" onChange={e => handleSubmit(e)} /> {t('form101.text_excretion2')}</>
                      }
                    </div>
                  </div>
                </div>
              </> : ''
            }
          </div>
        </div>
        <div className='box-heading'>
          <h2>{t('form101.year_changes')}</h2>
          <p>{t('form101.year_changes_details1')}</p>
          <p>{t('form101.year_changes_details2')}</p>
        </div>
        <div className='box-heading'>
          <h2>{t('form101.exemption_headline')}</h2>
          <div className='row'>
            <div className='col-sm-12'>
              <div className='form-group'>
                {
                  form && form.signature != null && form.taxCredit != null && form['taxCredit'].taxCredit  != undefined  && form['taxCredit'].taxCredit.includes("resident") ?
                    <><input type='checkbox' checked name="taxCredit" value="resident" onChange={e => handleSubmit(e)} /> {t('form101.exm1')}</> :
                    <><input type='checkbox' disabled={form && form.signature != null} name="taxCredit" value="resident" onChange={e => handleSubmit(e)} /> {t('form101.exm1')}</>
                }

              </div>
            </div>
            <div className='col-sm-12'>
              <div className='form-group'>
                {
                  form && form.signature != null && form.taxCredit != null && form['taxCredit'].taxCredit  != undefined  && form['taxCredit'].taxCredit.includes("disabled") ?
                    <><input type='checkbox' checked name="taxCredit" value="disabled" onChange={e => handleSubmit(e)} /> {t('form101.exm2')}</> :
                    <><input type='checkbox' disabled={form && form.signature != null} name="taxCredit" value="disabled" onChange={e => handleSubmit(e)} /> {t('form101.exm2')}</>
                }
              </div>
            </div>
            <div className='col-sm-12'>
              <div className='form-group'>
                {
                  form && form.signature != null && form.taxCredit != null && form['taxCredit'].taxCredit  != undefined  && form['taxCredit'].taxCredit.includes("PermanentResident") ?
                    <><input type='checkbox' checked name="taxCredit" value="PermanentResident" onChange={e => handleSubmit(e)} /> {t('form101.exm3')}</> :
                    <><input type='checkbox' disabled={form && form.signature != null} name="taxCredit" value="PermanentResident" onChange={e => handleSubmit(e)} /> {t('form101.exm3')}</>
                }

              </div>
            </div>
            <div className='col-sm-12'>
              <div className='form-group'>
                {
                  form && form.signature != null && form.taxCredit != null && form['taxCredit'].taxCredit  != undefined  && form['taxCredit'].taxCredit.includes("immigrant") ?
                    <><input type='checkbox' checked name="taxCredit" value="immigrant" onChange={e => handleSubmit(e)} /> {t('form101.exm4')}</> :
                    <><input type='checkbox' disabled={form && form.signature != null} name="taxCredit" value="immigrant" onChange={e => handleSubmit(e)} /> {t('form101.exm4')}</>
                }

              </div>
            </div>
            <div className='col-sm-12'>
              <div className='form-group'>
                {
                  form && form.signature != null && form.taxCredit != null && form['taxCredit'].taxCredit  != undefined  && form['taxCredit'].taxCredit.includes("spouse") ?
                    <><input type='checkbox' checked name="taxCredit" value="spouse" onChange={e => handleSubmit(e)} /> {t('form101.exm5')}</> :
                    <><input type='checkbox' disabled={form && form.signature != null} name="taxCredit" value="spouse" onChange={e => handleSubmit(e)} /> {t('form101.exm5')}</>
                }

              </div>
            </div>
            <div className='col-sm-12'>
              <div className='form-group'>
                {
                  form && form.signature != null && form.taxCredit != null && form['taxCredit'].taxCredit  != undefined  && form['taxCredit'].taxCredit.includes("parent") ?
                    <><input type='checkbox' checked name="taxCredit" value="parent" onChange={e => handleSubmit(e)} /> {t('form101.exm6')}</> :
                    <><input type='checkbox' disabled={form && form.signature != null} name="taxCredit" value="parent" onChange={e => handleSubmit(e)} /> {t('form101.exm6')}</>
                }

              </div>
            </div>
            <div className='col-sm-12'>
              <div className='form-group'>
                {
                  form && form.signature != null && form.taxCredit != null && form['taxCredit'].taxCredit  != undefined  && form['taxCredit'].taxCredit.includes("children") ?
                    <><input type='checkbox' checked name="taxCredit" value="children" onChange={e => handleSubmit(e)} /> {t('form101.exm7')}</> :
                    <><input type='checkbox' disabled={form && form.signature != null} name="taxCredit" value="children" onChange={e => handleSubmit(e)} /> {t('form101.exm7')}</>
                }

              </div>
            </div>
            <div className='col-sm-12'>
              <div className='form-group'>
                {
                  form && form.signature != null && form.taxCredit != null && form['taxCredit'].taxCredit  != undefined  && form['taxCredit'].taxCredit.includes("forchild") ?
                    <><input type='checkbox' checked name="taxCredit" value="forchild" onChange={e => handleSubmit(e)} /> {t('form101.exm8')}</> :
                    <><input type='checkbox' disabled={form && form.signature != null} name="taxCredit" value="forchild" onChange={e => handleSubmit(e)} /> {t('form101.exm8')}</>
                }

              </div>
            </div>
            <div className='col-sm-12'>
              <div className='form-group'>
                {
                  form && form.signature != null && form.taxCredit != null && form['taxCredit'].taxCredit  != undefined  && form['taxCredit'].taxCredit.includes("singleparent") ?
                    <> <input type='checkbox' checked name="taxCredit" value="singleparent" onChange={e => handleSubmit(e)} /> {t('form101.exm9')}</> :
                    <> <input type='checkbox' disabled={form && form.signature != null} name="taxCredit" value="singleparent" onChange={e => handleSubmit(e)} /> {t('form101.exm9')}</>
                }

              </div>
            </div>
            <div className='col-sm-12'>
              <div className='form-group'>
                {
                  form && form.signature != null && form.taxCredit != null && form['taxCredit'].taxCredit  != undefined  && form['taxCredit'].taxCredit.includes("possessionChild") ?
                    <><input type='checkbox' checked name="taxCredit" value="possessionChild" onChange={e => handleSubmit(e)} /> {t('form101.exm10')}</> :
                    <><input type='checkbox' disabled={form && form.signature != null} name="taxCredit" value="possessionChild" onChange={e => handleSubmit(e)} /> {t('form101.exm10')}</>
                }

              </div>
            </div>
            <div className='col-sm-12'>
              <div className='form-group'>
                {
                  form && form.signature != null && form.taxCredit != null && form['taxCredit'].taxCredit  != undefined  && form['taxCredit'].taxCredit.includes("disabilites") ?
                    <> <input type='checkbox' name="taxCredit" value="disabilites" onChange={e => handleSubmit(e)} /> {t('form101.exm11')}</> :
                    <> <input type='checkbox' disabled={form && form.signature != null} name="taxCredit" value="disabilites" onChange={e => handleSubmit(e)} /> {t('form101.exm11')}</>
                }

              </div>
            </div>
            <div className='col-sm-12'>
              <div className='form-group'>
                {
                  form && form.signature != null && form.taxCredit != null && form['taxCredit'].taxCredit  != undefined  && form['taxCredit'].taxCredit.includes("formerspouse") ?
                    <> <input type='checkbox' checked name="taxCredit" value="formerspouse" onChange={e => handleSubmit(e)} /> {t('form101.exm12')}</> :
                    <> <input type='checkbox' disabled={form && form.signature != null} name="taxCredit" value="formerspouse" onChange={e => handleSubmit(e)} /> {t('form101.exm12')}</>
                }

              </div>
            </div>
            <div className='col-sm-12'>
              <div className='form-group'>
                {
                  form && form.signature != null && form.taxCredit != null && form['taxCredit'].taxCredit  != undefined  && form['taxCredit'].taxCredit.includes("partner") ?
                    <><input type='checkbox' checked name="taxCredit" value="partner" onChange={e => handleSubmit(e)} /> {t('form101.exm13')}</> :
                    <><input type='checkbox' disabled={form && form.signature != null} name="taxCredit" value="partner" onChange={e => handleSubmit(e)} /> {t('form101.exm13')}</>
                }

              </div>
            </div>
            <div className='col-sm-12'>
              <div className='form-group'>
                {
                  form && form.signature != null && form.taxCredit != null && form['taxCredit'].taxCredit  != undefined  && form['taxCredit'].taxCredit.includes("soldier") ?
                    <> <input type='checkbox' checked name="taxCredit" value="soldier" onChange={e => handleSubmit(e)} /> {t('form101.exm14')}</> :
                    <> <input type='checkbox' disabled={form && form.signature != null} name="taxCredit" value="soldier" onChange={e => handleSubmit(e)} /> {t('form101.exm14')}</>
                }

              </div>
            </div>
            <div className='col-sm-12'>
              <div className='form-group'>
                {
                  form && form.signature != null && form.taxCredit != null && form['taxCredit'].taxCredit  != undefined  && form['taxCredit'].taxCredit.includes("graduation") ?
                    <><input type='checkbox' checked name="taxCredit" value="graduation" onChange={e => handleSubmit(e)} /> {t('form101.exm15')}</> :
                    <><input type='checkbox' disabled={form && form.signature != null} name="taxCredit" value="graduation" onChange={e => handleSubmit(e)} /> {t('form101.exm15')}</>
                }

              </div>
            </div>
          </div>
        </div>
        <div className='box-heading'>
          <h2>{t('form101.coordination_number')}</h2>
          <div className='row'>
            <div className='col-sm-6'>
              <div className='form-group'>
                {
                  form && form.signature != null && form.cordination == false ?
                    <><input name='cordination' type='radio' checked id='cordination1' onClick={() => setCordination(false)} /> {t('form101.coordination_no')}</> :
                    <><input name='cordination' type='radio' disabled={form && form.signature != null} id='cordination1' onClick={() => setCordination(false)} /> {t('form101.coordination_no')}</>
                }

              </div>
            </div>
            <div className='col-sm-6'>
              <div className='form-group'>
                {
                  form && form.signature != null && form.cordination == true ?
                    <><input name='cordination' type='radio' checked id='cordination2' onClick={() => setCordination(true)} /> {t('form101.coordination_yes')}</> :
                    <><input name='cordination' type='radio' disabled={form && form.signature != null} id='cordination2' onClick={() => setCordination(true)} /> {t('form101.coordination_yes')}</>
                }

              </div>
            </div>
          </div>
          {cordination &&
            <>
              <label className='control-label'>{t('form101.text_reason_request')}*</label>
              <div>
                {
                  form && form.signature != null && form.cord == '0' ?
                    <><input name='cordRequest' checked type='radio' id='cordn1' onClick={() => setCord('0')} /> {t('form101.no_income_beginning')}</> :
                    <> <input name='cordRequest' disabled={form && form.signature != null} type='radio' id='cordn1' onClick={() => setCord('0')} /> {t('form101.no_income_beginning')}</>
                }

              </div>
              <div>
                {
                  form && form.signature != null && form.cord == '1' ?
                    <><input name='cordRequest' type='radio' checked id='cordn2' onClick={() => setCord('1')} /> {t('form101.additional_income_beginning')}</> :
                    <> <input name='cordRequest' type='radio' disabled={form && form.signature != null} id='cordn2' onClick={() => setCord('1')} /> {t('form101.additional_income_beginning')}</>
                }

              </div>
              <div>
                {
                  form && form.signature != null && form.cord == '2' ?
                    <><input name='cordRequest' type='radio' checked id='cordn3' onClick={() => setCord('2')} /> {t('form101.accessor_approved')}</> :
                    <><input name='cordRequest' type='radio' disabled={form && form.signature != null} id='cordn3' onClick={() => setCord('2')} /> {t('form101.accessor_approved')}</>
                }

              </div>
              {cord && cord == '0' &&
                <div className='borderBox mt-3'>
                  <label className='control-label d-block'>{t('form101.label_income_proof')}</label>
                  {
                    form && form.signature != null && form.cord0_file != null ?
                      <>
                        <button type="button" className="btn btn-pink m-2"
                          onClick={(e) => {
                            let sf = document.querySelector('.showfile');
                            sf.setAttribute('src', form.cord0_file);
                            sf.style.width = '100%';
                          }}
                          data-toggle="modal" data-target="#exampleModal">
                          {t('form101.view_uploaded_file')}
                        </button>
                      </> :
                      <>
                        <input type='file' name="cord0_file" onChange={e => { handleFileCord0(e.target.files[0]) }} />
                      </>
                  }

                  <p className='mt-2'>{t('form101.such_proof')}</p>
                </div>
              }
              {cord && cord == '1' &&
                <div className='borderBox mt-3'>
                  <label className='control-label'>{t('form101.additional_income_details')}</label>
                  <form onSubmit={handleSave2}>
                    {salValues.map((element, index) => (
                      <div className="slotForm" key={index}>
                        <div className='row'>
                          <div className='col-sm-4'>
                            <div className='form-group'>
                              <label className='control-label'>{t('form101.label_name')}*</label>
                              <input type='text' className='form-control' name='name' readOnly={form && form.signature != null ? 'readonly' : ''} placeholder='Name' value={element.name || ""} onChange={e => handleSalChange(index, e)} />
                            </div>
                          </div>
                          <div className='col-sm-4'>
                            <div className='form-group'>
                              <label className='control-label'>{t('form101.label_address')}*</label>
                              <input type="text" name="address" className='form-control' readOnly={form && form.signature != null ? 'readonly' : ''} placeholder='Address' value={element.address || ""} onChange={e => handleSalChange(index, e)} />
                            </div>
                          </div>
                          <div className='col-sm-4'>
                            <div className='form-group'>
                              <label className='control-label'>{t('form101.label_ddfileId')}*</label>
                              <input type="text" name="dfid" className='form-control' readOnly={form && form.signature != null ? 'readonly' : ''} placeholder='Deduction file ID' value={element.dfid || ""} onChange={e => handleSalChange(index, e)} />
                            </div>
                          </div>
                          <div className='col-sm-4'>
                            <div className='form-group'>
                              <label className='control-label'>{t('form101.income_to_slip')}*</label>
                              <input type="text" name="mIncome" className='form-control' readOnly={form && form.signature != null ? 'readonly' : ''} placeholder='Monthly Income' value={element.mIncome || ""} onChange={e => handleSalChange(index, e)} />
                            </div>
                          </div>
                          <div className='col-sm-4'>
                            <div className='form-group'>
                              <label className='control-label'>{t('form101.tax_to_slip')}*</label>
                              <input type="text" name="taxDeducted" className='form-control' readOnly={form && form.signature != null ? 'readonly' : ''} placeholder='The tax deducted' value={element.taxDeducted || ""} onChange={e => handleSalChange(index, e)} />
                            </div>
                          </div>
                          <div className='col-sm-4'>
                            <div className='form-group'>
                              <label className='control-label'>{t('form101.income_to_type')}*</label>
                              {
                                form && form.signature != null && form.salary_form[index].typeIncome == "working" ?
                                  <div className='form-group'><input type="radio" name={`typeIncome`+index} checked value={element.typeIncome || "working"} onChange={e => handleSalChange(index, e)} /> {t('form101.incomeType1')}</div> :
                                  <div className='form-group'><input type="radio" name={`typeIncome`+index} disabled={form && form.signature != null} value={element.typeIncome || "working"} onChange={e => handleSalChange(index, e)} /> {t('form101.incomeType1')}</div>
                              }
                              {
                                form && form.signature != null && form.salary_form[index].typeIncome == "allowance" ?
                                  <div className='form-group'><input type="radio" name={`typeIncome`+index} checked value={element.typeIncome || "allowance"} onChange={e => handleSalChange(index, e)} /> Allowance</div> :
                                  <div className='form-group'><input type="radio" name={`typeIncome`+index} disabled={form && form.signature != null} value={element.typeIncome || "allowance"} onChange={e => handleSalChange(index, e)} /> {t('form101.incomeType2')}</div>
                              }
                              {
                                form && form.signature != null && form.salary_form[index].typeIncome == "scholarship" ?
                                  <div className='form-group'><input type="radio" name={`typeIncome`+index} checked value={element.typeIncome || "scholarship"} onChange={e => handleSalChange(index, e)} /> Scholarship</div> :
                                  <div className='form-group'><input type="radio" name={`typeIncome`+index} disabled={form && form.signature != null} value={element.typeIncome || "scholarship"} onChange={e => handleSalChange(index, e)} /> {t('form101.incomeType3')}</div>
                              }
                              {
                                form && form.signature != null && form.salary_form[index].typeIncome == "other" ?
                                  <div className='form-group'><input type="radio" name={`typeIncome`+index} checked value={element.typeIncome || "other"} onChange={e => handleSalChange(index, e)} /> Other</div> :
                                  <div className='form-group'><input type="radio" name={`typeIncome`+index} disabled={form && form.signature != null} value={element.typeIncome || "other"} onChange={e => handleSalChange(index, e)} /> {t('form101.incomeType4')}</div>
                              }

                            </div>
                          </div>
                          <div className='col-sm-4'>
                            <div className='form-group'>
                             
                              {
                                form && form.signature != null && form.salary_form[index].copy_of_pay != "" ?
                                  <>
                                   <label className='control-label d-block'>{t('form101.copyPaySlip')}</label>
                                    <button type="button" className="btn btn-pink m-2"
                                      onClick={(e) => {
                                        let sf = document.querySelector('.showfile');
                                        sf.setAttribute('src', form.salary_form[index].copy_of_pay);
                                        sf.style.width = '100%';
                                      }}
                                      data-toggle="modal" data-target="#exampleModal">
                                      {t('form101.view_uploaded_file')}
                                    </button>
                                  </> :
                                  <>
                                   <label className='control-label d-block'>{t('form101.copyPaySlip')}</label>
                                  <input type="file" name="copy_of_pay" onChange={e => { handleSalChange(index, e) }} />
                                  </>
                              }

                            </div>
                          </div>
                          <div className='col-sm-2'>
                            <div className='form-group'>
                              <label className='control-label'>&nbsp;</label>
                              {
                                index && form.length == 0 ?
                                  <button type="button" className="btn btn-danger remove saveBtn mt-4" onClick={() => removeFormFields2(index)}>{t('form101.button_remove')}</button>
                                  : null
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </form>
                  {

                    form.length == 0 && <button className="btn btn-success button add slotBtn mb-3" type="button" onClick={() => addFormFields2()}>{t('form101.add_employer_player')}</button>
                  }
                </div>
              }
              {cord && cord == '2' &&
                <div className="borderBox mt-3">
                  <label className='control-label d-block'>{t('form101.taxCordination')}</label>
                  {
                    form && form.signature != null && form.cord2_file != null ?
                      <>
                        <button type="button" className="btn btn-pink m-2"
                          onClick={(e) => {
                            let sf = document.querySelector('.showfile');
                            sf.setAttribute('src', form.cord0_file);
                            sf.style.width = '100%';
                          }}
                          data-toggle="modal" data-target="#exampleModal">
                          {t('form101.view_uploaded_file')}
                        </button>
                      </>
                      :
                      <>
                        <input type='file' name="cord2_file" onChange={e => { handleFileCord2(e.target.files[0]) }} />
                      </>
                  }

                </div>
              }
            </>
          }
        </div>
        <div className='box-heading'>
          <h2>{t('form101.text_disclaimer')}</h2>
          <p>{t('form101.disclaimer_details1')}</p>
          <p>{t('form101.disclaimer_details2')}</p>
          <p>
            {
              (form && form.signature != null) ?
                <img src={form.signature} /> :
                <>
                  <SignatureCanvas
                    penColor="black"
                    canvasProps={{ className: 'sign101' }}
                    ref={sigRef}
                    onEnd={handleSignatureEnd}
                  />
                  <p><button className='btn btn-warning' onClick={clearSignature}>{t('form101.button_clear')}</button></p>
                  <div className='mt-4 text-center'>
                    <button className='btn btn-success' onClick={finalSubmit}>{t('form101.button_submit')}</button>
                  </div>
                </>
            }
          </p>
        </div>

      </div>
      <div className="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">

              <div className="row">
                <div className="col-sm-12">
                  <div className="form-group">
                    <img src="#" className='showfile' />

                  </div>
                </div>

              </div>

            </div>
            <div className="modal-footer">

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
