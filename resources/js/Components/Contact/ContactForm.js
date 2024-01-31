import React, { useState } from 'react'

export default function ContactForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState();
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const HandleSaveData = (e) => {
        e.preventDefault();
    }
  return (
    <div className='container'>
        <div className='touch'>
            <h2>Get in touch with us</h2>
            <form>
                <div className='form-group'>
                    <label className='control-label'>Name</label>
                    <input type="text" value={name} onChange = { (e) => setName(e.target.value)} className='form-control' placeholder='Your name'/>
                </div>
                <div className='form-group'>
                    <label className='control-label'>Email</label>
                    <input type="email" value={email} onChange = { (e) => setEmail(e.target.value)} className='form-control' placeholder='Email'/>
                </div>
                <div className='form-group'>
                    <label className='control-label'>Phone</label>
                    <input type="tel" value={phone} onChange = { (e) => setPhone(e.target.value)} className='form-control' placeholder='Phone'/>
                </div>
                <div className='form-group'>
                    <label className='control-label'>Your message</label>
                    <textarea rows="3" value={message} onChange = { (e) => setMessage(e.target.value)} className='form-control' placeholder='Your message'></textarea>
                </div>
                <div className='form-group text-center'>
                    <button className='btn btn-danger' onClick = {HandleSaveData}>Submit</button>
                </div>
            </form>
        </div>
    </div>
  )
}
