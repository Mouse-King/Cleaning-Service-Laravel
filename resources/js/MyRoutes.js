import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { positions, Provider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'

import './Assets/css/admin.css';
// import './Assets/css/rtl.css';
import './Assets/css/responsive.css';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'

// Protected Routes
import AdminProtectedRoutes from './Components/Auth/PrivateAdmin';
import ClientProtectedRoutes from './Components/Auth/PrivateClient';
import WorkerProtectedRoutes from './Components/Auth/PrivateWorker';

// Client Routes
import Client from './Client/Client';
import ClientDashboard from './Client/ClientDashboard';
import ClientSchedules from './Client/Pages/Schedule/Schedule';
import ClientOffers from './Client/Pages/OfferPrice/OfferPrice';
import ClientViewOffer from './Client/Pages/OfferPrice/ViewOffer';
import ClientContracts from './Client/Pages/Contract/Contract';
import ClientViewContract from './Client/Pages/Contract/ViewContract';
import ClientFiles from './Client/Pages/Schedule/Files';
import ClientJobs  from './Client/Pages/Jobs/TotalJobs';
import ClientJobView  from './Client/Pages/Jobs/ViewJob';
import ClientSetting from './Client/Pages/Settings/Setting';
// Worker Routes

import Worker from './Worker/Worker';
import WorkerMyAccount  from './Worker/Pages/MyAccount/MyAccount';
import WorkerDashboard from './Worker/WorkerDashboard';
import WorkerTotalJobs from './Worker/Pages/Job/WorkerTotalJobs';
import WorkerViewJob    from './Worker/Pages/Job/WorkerViewJob';
import Availability    from './Worker/Pages/Availability/Availability';
import NotAvailability    from './Worker/Pages/Availability/NotAvailability';


// Admin Routes
import Admin from './Admin/Admin';
import AdminDashboard from './Admin/Dashboard';
import TotalJobs from './Admin/Pages/Jobs/TotalJobs';
import CreateJob from './Admin/Pages/Jobs/CreateJob';
import CreateClientJob from './Admin/Pages/Jobs/CreateClientJob';
import AddJob from './Admin/Pages/Jobs/AddJob';
import ViewJob from './Admin/Pages/Jobs/ViewJob';
import EditJob from './Admin/Pages/Jobs/EditJob'
import Leads from './Admin/Pages/Lead/Lead';
import AddLead from './Admin/Pages/Lead/AddLead';
import EditLead from './Admin/Pages/Lead/EditLead';
import ViewLead from './Admin/Pages/Lead/ViewLead';
import Clients from './Admin/Pages/Clients/Client';
import AddClient from './Admin/Pages/Clients/AddClient';
import AddLeadClient from './Admin/Pages/Clients/AddLeadClient';
import EditClient from './Admin/Pages/Clients/EditClient';
import ViewClient from './Admin/Pages/Clients/ViewClient';
import AllWorkers from './Admin/Pages/Workers/AllWorkers';
import AddWorker from './Admin/Pages/Workers/AddWorker';
import EditWorker from './Admin/Pages/Workers/EditWorker';
import ViewWorker from './Admin/Pages/Workers/ViewWorker';
import ViewWorkerContract from './Admin/Pages/Workers/WorkerContract';
import AdminLogin from './Admin/Pages/Auth/AdminLogin';
import Setting from './Admin/Pages/Setting/Setting';
import ManageTeam from './Admin/Pages/Setting/ManageTeam';
import AddTeam from './Admin/Pages/Setting/AddTeam';
import EditTeam from './Admin/Pages/Setting/EditTeam';
import Services from './Admin/Pages/Services/Services';
import AddService from './Admin/Pages/Services/AddService';
import EditService from './Admin/Pages/Services/EditService';
import ServiceSchedule from './Admin/Pages/Services/ServiceSchedule';
import AddServiceSchedule from './Admin/Pages/Services/AddServiceSchedule';
import EditServiceSchedule from './Admin/Pages/Services/EditServiceSchedule';
import OfferPrice from './Admin/Pages/OfferPrice/OfferPrice';
import AddOffer from './Admin/Pages/OfferPrice/AddOffer';
import EditOffer from './Admin/Pages/OfferPrice/EditOffer';
import ViewOffer from './Admin/Pages/OfferPrice/ViewOffer';
import Contract from './Admin/Pages/Contract/Contract';
import AddContract from './Admin/Pages/Contract/AddContract';
import EditContract from './Admin/Pages/Contract/EditContract';
import ViewContract from './Admin/Pages/Contract/ViewContract';
import Error404 from './Error404';
import WorkerLogin from './Worker/Auth/WorkerLogin';
import ClientLogin from './Client/Auth/ClientLogin';
import Schedule from './Admin/Pages/Schedule/Schedule';
import ViewSchedule from './Admin/Pages/Schedule/ViewSchedule';
import CreateContract from './Admin/Pages/Contract/CreateContract';
import PriceOffer from './Pages/PriceOffer';
import InsuranceEng from './Pages/Insurance/InsuranceEng';
import InsuranceHeb from './Pages/Insurance/InsuranceHeb';
import WorkContract from './Pages/WorkContract';
import MeetingStatus from './Pages/MeetingStatus';
import CalendarTeam from './Pages/CalendarTeam';
import Thankyou from './Pages/Thankyou';
import ManageTime from './Admin/Pages/Setting/Time/ManageTime';
import AddTime from './Admin/Pages/Setting/Time/AddTime';
import EditTime from './Admin/Pages/Setting/Time/EditTime';
import ServiceTemplate from './Admin/Pages/Services/Templates';
import RegularServiceTemplate from './Pages/offertemplates/template_regular';
import OfficeCleaningTemplate from './Pages/offertemplates/template_officeCleaning';
import AfterRenovationTemplate from './Pages/offertemplates/template_cleaningAfterRenovation';
import ThoroughCleaningTemplate from './Pages/offertemplates/template_throughoutCleaning';
import TemplateWindowCleaning from './Pages/offertemplates/template_windowCleaning';
import TemplateOthers from './Pages/offertemplates/template_others';
import WorkerContract from './Pages/WorkerContract';
import WorkContractRHS from './Pages/WorkContractRHS';
import Form101 from './Pages/Form101';
import Languages from './Admin/Pages/Languages/language';
import EditLanguages from './Admin/Pages/Languages/EditLanguage';
import Notification from './Admin/Pages/Notification/Notification';
import Income from './Admin/Pages/Income'
import Invoices from './Admin/Pages/Sales/Invoices/Invoices';
import AddInvoice from './Admin/Pages/Sales/Invoices/AddInvoice';
import Orders from './Admin/Pages/Sales/Orders/Orders';
import AddOrder from './Admin/Pages/Sales/Orders/AddOrder';
import Payments from './Admin/Pages/Sales/Payments/payments';
import ScheduleMeet from './Pages/ScheduleMeet';
import Chat from './Admin/Pages/Chat/chat';
import Responses from './Admin/Pages/Chat/responses';
import Messenger from './Admin/Pages/Chat/messenger';

TimeAgo.addDefaultLocale(en)
const options = {
   timeout: 2000,
   position: positions.TOP_RIGHT
};

export default function MyRoutes() {
   return (
      <Provider template={AlertTemplate} {...options}>
         <Router>
            <Routes>
               {/* Home route  */}
               <Route exact path="/" element={<ClientLogin />} />
               <Route exact path="client/login" element={<ClientLogin />} />
               <Route exact path="worker/login" element={<WorkerLogin />} />
               <Route exact path="meeting-status/:id/:response" element={<MeetingStatus />} />
               <Route exact path="price-offer/:id" element={<PriceOffer />} />
               <Route exact path="insurance-eng" element={<InsuranceEng />} />
               <Route exact path="insurance-heb" element={<InsuranceHeb />} />
               <Route exact path="work-contract/:id" element={<WorkContract />} />
               <Route exact path="work-contract2" element={<WorkContractRHS />} />
               <Route exact path="form101/:id" element={<Form101 />} />
               <Route exact path="worker-contract/:id" element={<WorkerContract />} />
               <Route exact path="calendar" element={<CalendarTeam />} />
               <Route exact path="thankyou/:id/:response" element={<Thankyou />} />
               <Route exact path="schedule-meet/:id" element={<ScheduleMeet />} />

               {/* Client Routes Start  */}

               <Route element={<ClientProtectedRoutes />}>
                  <Route path="client" element={<Client />} >
                     <Route exact path="dashboard" element={<ClientDashboard/>} />
                     <Route exact path="schedule" element={<ClientSchedules/>} />
                     <Route exact path="/client/offered-price" element={<ClientOffers/>} />
                     <Route exact path="/client/view-offer/:id" element={<ClientViewOffer/>} />
                     <Route exact path="/client/contracts" element={<ClientContracts/>} />
                     <Route exact path="/client/view-contract/:id/:hash" element={<ClientViewContract/>} />
                     <Route exact path="/client/files/:meetId" element={<ClientFiles/>}/>
                     <Route exact path="/client/jobs" element={<ClientJobs/>}/>
                     <Route exact path="/client/view-job/:id" element={<ClientJobView/>}/>

                     <Route exact path="/client/settings" element={<ClientSetting />} />

                  </Route>
               </Route>
               {/* Client Routes End  */}


               {/* Worker Routes Start  */}
               <Route exact path="worker/login" element={<WorkerLogin />} />

               <Route path="worker" element={<Worker/>} >

               </Route>
               <Route element={<WorkerProtectedRoutes />}>
                  <Route path="worker" element={<Worker/>} >
                     <Route exact path="my-account" element={<WorkerMyAccount/>} />
                     <Route exact path="dashboard" element={<WorkerDashboard />} />
                     <Route exact path="jobs" element={<WorkerTotalJobs />} />
                     <Route exact path="view-job/:id" element={<WorkerViewJob />} />
                     <Route exact path="schedule" element={<Availability />} />
                     <Route exact path="not-available" element={<NotAvailability />} />
                  </Route>
               </Route>
               {/* Worker Routes End  */}


               {/* Admin Routes Start  */}
               <Route exact path="/admin/login" element={<AdminLogin />} />
               <Route exact path="create-contract" element={<CreateContract />} />
               <Route element={<AdminProtectedRoutes />}>
                  <Route path="admin" element={<Admin />} >
                     <Route exact path="dashboard" element={<AdminDashboard />} />
                     <Route exact path="jobs" element={<TotalJobs />} />
                     <Route exact path="create-job/:id" element={<CreateJob />} />
                     <Route exact path="create-client-job/:id" element={<CreateClientJob />} />
                     <Route exact path="add-job" element={<AddJob />} />
                     <Route exact path="view-job/:id" element={<ViewJob />} />
                     <Route exact path="add-job" element={<AddJob />} />
                     <Route exact path="edit-job/:id" element={<EditJob />} />
                     <Route exact path="leads" element={<Leads />} />
                     <Route exact path="add-lead" element={<AddLead />} />
                     <Route exact path="edit-lead/:id" element={<EditLead />} />
                     <Route exact path="view-lead/:id" element={<ViewLead />} />
                     <Route exact path="clients" element={<Clients />} />
                     <Route exact path="add-client" element={<AddClient />} />
                     <Route exact path="add-lead-client/:id" element={<AddLeadClient />} />
                     <Route exact path="edit-client/:id" element={<EditClient />} />
                     <Route exact path="view-client/:id" element={<ViewClient />} />
                     <Route exact path="workers" element={<AllWorkers />} />
                     <Route exact path="add-worker" element={<AddWorker />} />
                     <Route exact path="edit-worker/:id" element={<EditWorker />} />
                     <Route exact path="view-worker/:id" element={<ViewWorker />} />
                     <Route exact path="worker-contract/:id" element={<ViewWorkerContract />} />
                     <Route exact path="settings" element={<Setting />} />
                     <Route exact path="manage-team" element={<ManageTeam />} />
                     <Route exact path="add-team" element={<AddTeam />} />
                     <Route exact path="edit-team/:id" element={<EditTeam />} />
                     <Route exact path="services" element={<Services />} />
                     <Route exact path="add-service" element={<AddService />} />
                     <Route exact path="edit-service/:id" element={<EditService />} />
                     <Route exact path="service-schedule" element={<ServiceSchedule />} />
                     <Route exact path="add-service-schedule" element={<AddServiceSchedule />} />
                     <Route exact path="edit-service-schedule/:id" element={<EditServiceSchedule />} />
                     <Route exact path="templates" element={<ServiceTemplate />} />
                     <Route exact path="template/regular-service" element={<RegularServiceTemplate />} />
                     <Route exact path="template/office-cleaning" element={<OfficeCleaningTemplate />} />
                     <Route exact path="template/after-renovation" element={<AfterRenovationTemplate />} />
                     <Route exact path="template/thorough-cleaning" element={<ThoroughCleaningTemplate />} />
                     <Route exact path="template/window-cleaning" element={<TemplateWindowCleaning />} />
                     <Route exact path="template/others" element={<TemplateOthers />} />
                     <Route exact path="offered-price" element={<OfferPrice />} />
                     <Route exact path="add-offer" element={<AddOffer />} />
                     <Route exact path="edit-offer/:id" element={<EditOffer />} />
                     <Route exact path="view-offer/:id" element={<ViewOffer />} />
                     <Route exact path="contracts" element={<Contract />} />
                     <Route exact path="add-contract" element={<AddContract />} />
                     <Route exact path="edit-contract" element={<EditContract />} />
                     <Route exact path="view-contract/:id" element={<ViewContract />} />
                     <Route exact path="schedule" element={<Schedule />} />
                     <Route exact path="view-schedule/:id" element={<ViewSchedule />} />
                     <Route exact path="manage-time" element={<ManageTime />} />
                     <Route exact path="add-time" element={<AddTime />} />
                     <Route exact path="edit-time/:id" element={<EditTime />} />
                     <Route exact path="notifications" element={<Notification />} />
                     <Route exact path="Languages" element={<Languages />} />
                     <Route exact path="edit-language/:id" element={<EditLanguages />} />
                     <Route exact path="income" element={<Income />} />
                     <Route exact path="invoices" element={<Invoices />} />
                     <Route exact path="add-invoice" element={<AddInvoice />} />
                     <Route exact path="add-order" element={<AddOrder />} />
                     <Route exact path="orders" element={<Orders />} />
                     <Route exact path="payments" element={<Payments />} />
                     <Route exact path="chat" element={<Chat />}/>
                     <Route exact path="responses" element={<Responses />}/>
                     <Route exact path="messenger" element={<Messenger/>}/>
                  </Route>
               </Route>
               {/* Admin Routes End  */}

               {/* Error 404 Page / Not Found */}

               <Route path="*" element={<Error404 />} />

            </Routes>

         </Router>
      </Provider>


   );
}
