import React from 'react';
import { render } from 'react-dom';
import MyRoutes from './MyRoutes';
import swal from 'sweetalert2';
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

window.Swal = swal;

i18n
  .use(initReactI18next) 
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    supportedLngs: ['en','heb','ru','spa'],
    fallbackLng: "en",
    detection:{
      order: ['htmlTag','querystring','path','cookie', 'localStorage', 'sessionStorage',
               'navigator', 'subdomain'],
      lookupQuerystring: 'lng'
    },
    backend:{
      loadPath: '/localization/{{lng}}/locale.json',
    },
    react: {useSuspense:false},
  
});


const lng = localStorage.getItem('i18nextLng');
const url = window.location.href;
if(lng == 'heb' 
    && !url.includes('admin')
    && !url.includes('price-offer')
    && !url.includes('work-contract')
    && !url.includes('meeting-status')
    && !url.includes('thankyou')
    && !url.includes('form101')
    && !url.includes('worker-contract')
    
  )
    
{ 
   import ('./Assets/css/rtl.css');
   document.querySelector('html').setAttribute('dir','rtl');
} else {
   document.querySelector('html').removeAttribute('dir');
}

const root = document.getElementById('root');
render(
  <React.StrictMode> 
    <MyRoutes />
  </React.StrictMode>
, root);