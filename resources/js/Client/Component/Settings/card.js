import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import Moment from 'moment';
import { useTranslation } from "react-i18next";
import axios from "axios";
import { daDK } from "rsuite/esm/locales";

export default function card() {

    const { t }            = useTranslation();
    const [card, setCard]  = useState([]);
    const [ctype,setCtype] = useState('');
    const [ncard,setNCard] = useState('');
    const [exy,setExy] = useState('0');
    const [exm,setExm] = useState('0');
    const [cvv,setCvv] = useState('');
    const [client,setClient] = useState([]);
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("client-token"),
    };
    const getCard = () => {
        axios
            .get(`/api/client/get-card`, { headers })
            .then((res) => {
                setCard(res.data.res);
            
            })
    }

    const getClient = () => {
        axios.get("/api/client/my-account", { headers }).then((response) => {
            setClient(response.data.account);
        });
    };

    const handleCard = (e) =>{
      e.preventDefault();
      if (!ctype) { window.alert(t('work-contract.messages.card_type_err')); return false; }
      if (!ncard) { window.alert(t('work-contract.messages.card_msg')); return false; }
      if (ncard.length < 16) { window.alert(t('work-contract.messages.card_msg2')); return false; }
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
          "CardNumber": ncard,
          "ExpDate_MMYY": exm + exy.substring(2, 4)
      }
      //console.log(cardVal);
      //return
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

                          "cid": (card.length > 0) ?  card[0].id: '',
                          "card_type": ctype,
                          "card_number": ncard,
                          "cc_charge": 1,
                          "valid": exy + "-" + exm,
                          "card_token": res.data.Token,
                          "cvv": cvv.substring(0, 3),
                      }
                     
                      axios.
                          post(`/api/client/update-card`, { cdata },{ headers })
                          .then((re) => {
                              document.querySelector('.closeb').click();
                              swal(t('work-contract.messages.card_success_panel'), '', 'success');
                              getCard();
                          })

                  })

          });
    }
    useEffect(() => {
        getCard();
        getClient();
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
    }, []);

 
    let exp = '';
    if (card.length > 0) {
        let vl = card[0].valid.split('-');
        exp = " " + vl[1] + " / " + vl[0].substring(2, 4);
    }
    return (
        <div className='card'>
            
            <div className='card-body'>
                {  <button className="btn btn-pink float-right"  data-toggle="modal" data-target="#exampleModal"> {t('work-contract.edit_btn')}</button>}
               {
                card.length > 0 ? (
        
                <form>
                    <div className='form-group'>
                        <label className='control-label'>{t('work-contract.card_type')} : </label>
                        <span>{card[0].card_type }</span>
                    </div>
                    <div className='form-group'>
                        <label className='control-label'>{t('work-contract.card_number')} : </label>
                        <span> {card[0].card_number }</span>
                    </div>
                    <div className='form-group'>
                        <label className='control-label'> {t('work-contract.card_expiry')} : </label>
                        <span>{exp }</span>
                    </div>
                  

                </form>)
                :(
                    <div>No card added</div>
                )
                }
            </div>
            <div className="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">{t('work-contract.model_title')}</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                       <center> <p style={{"color":"red"}}>{t('work-contract.add_card_txt')}</p></center>

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
                                                setNCard(e.target.value);

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
                                            {t('work-contract.card_ex_month')}
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
        </div>
    )
}