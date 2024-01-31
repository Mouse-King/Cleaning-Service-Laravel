import React from 'react'
import find from '../../Assets/image/Frontend/Icons/find.png'
import book from '../../Assets/image/Frontend/Icons/book.png'
import pay from '../../Assets/image/Frontend/Icons/pay.png'
import freedom from '../../Assets/image/Frontend/Icons/freedom.png'

export default function Reach() {
  return (
    <div className='container'>
        <div className='reach'>
            <h2>Une procédure simplifiée !</h2>
            <div className='row'>
                <div className='col-sm-3 col-xs-6'>
                    <img src={find} className='img-fluid' alt='Find' />
                    <h5>Rechercher un profil</h5>
                    <p>Rechercher et échanger directement avec une aide à domicile près de chez vous.</p>
                </div>
                <div className='col-sm-3 col-xs-6'>
                    <img src={book} className='img-fluid' alt='Find' />
                    <h5>Réserver</h5>
                    <p>Mettez vous daccord sur les tâches à effectuer et réserver vos créneaux.</p>
                </div>
                <div className='col-sm-3 col-xs-6'>
                    <img src={pay} className='img-fluid' alt='Find' />
                    <h5>Paiement sécurisé</h5>
                    <p>Payer directement sur Yeliko et validé le paiement une fois la mission terminée.</p>
                </div>
                <div className='col-sm-3 col-xs-6'>
                    <img src={freedom} className='img-fluid' alt='Find' />
                    <h5>Reposez vous</h5>
                    <p>Nous nous occupons des démarches administratives (Chèque CESU, APA..).</p>
                </div>
            </div>
        </div>
    </div>
  )
}
