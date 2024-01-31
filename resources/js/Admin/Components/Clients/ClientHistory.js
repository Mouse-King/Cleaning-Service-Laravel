import React from 'react'
import Contract from './Contract'
import Jobs from './Jobs'
import OfferedPrice from './OfferedPrice'
import ScheduledMeeting from './ScheduledMeeting'
import CardDetails from './CardDetails'
import Order from './Order'
import Invoice from './Invoice'
import Payment from './Payment'

export default function ClientHistory({ contracts ,setContracts, latestContract, client}) {
  
  return (
    <div className='ClientHistory'>
        <ul className="nav nav-tabs" role="tablist">
            <li className="nav-item" role="presentation"><a id="schedule-meeting" className="nav-link active" data-toggle="tab" href="#tab-schedule" aria-selected="true" role="tab">Scheduled Meeting</a></li>
            <li className="nav-item" role="presentation"><a id="offered-price" className="nav-link" data-toggle="tab" href="#tab-offered" aria-selected="false" role="tab">Offered Price</a></li>
            <li className="nav-item" role="presentation"><a id="contract" className="nav-link" data-toggle="tab" href="#tab-contract" aria-selected="false" role="tab">Contracts</a></li>
            <li className="nav-item" role="presentation"><a id="jobs-tab" className="nav-link" data-toggle="tab" href="#tab-jobs" aria-selected="false" role="tab">Jobs</a></li>
            
            <li className="nav-item" role="presentation"><a id="order-tab" className="nav-link" data-toggle="tab" href="#tab-order" onClick={e=>{$('.order_drop').show();}} aria-selected="false" role="tab">Orders </a></li>

            <li className="nav-item" role="presentation"><a id="invoice-tab" className="nav-link" data-toggle="tab" href="#tab-invoice" aria-selected="false" role="tab">Invoice</a></li>
            <li className="nav-item" role="presentation"><a id="payment-tab" className="nav-link" data-toggle="tab" href="#tab-payment" aria-selected="false" role="tab">Payment</a></li>
            <li className="nav-item" role="presentation"><a id="creditCard-tab" className="nav-link" data-toggle="tab" href="#tab-creditCard" aria-selected="false" role="tab">Card Details</a></li>
        </ul>
        <div className='tab-content'>
            <div id="tab-schedule" className="tab-pane active show" role="tab-panel" aria-labelledby="schedule-meeting"><ScheduledMeeting/></div>
            <div id="tab-offered" className="tab-pane" role="tab-panel" aria-labelledby="offered-price"><OfferedPrice/></div>
            <div id="tab-contract" className="tab-pane" role="tab-panel" aria-labelledby="rejected-tab"><Contract contracts={ contracts } setContracts={setContracts} /></div>
            <div id="tab-jobs" className="tab-pane" role="tab-panel" aria-labelledby="rejected-tab"><Jobs/></div>
            <div id="tab-order" className="tab-pane" role="tab-panel" aria-labelledby="order-tab"><Order/></div>
            <div id="tab-invoice" className="tab-pane" role="tab-panel" aria-labelledby="invoice-tab"><Invoice/></div>
            <div id="tab-payment" className="tab-pane" role="tab-panel" aria-labelledby="payment-tab"><Payment/></div>
            <div id="tab-creditCard" className="tab-pane" role="tab-panel" aria-labelledby="creditCard-tab"><CardDetails latestContract={latestContract} client={client}/></div>
        </div>
    </div>
  )
}
