import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import { useAuth } from './AuthContext'; 
import api from './api'; 
import './Styles/Paginaplan2.css';

const Paginaplan2 = () => {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const navigate = useNavigate();

    const plans = [
        { title: 'Marius Andrei', description: ' Cu o pasiune arzătoare pentru fitness și sănătate, Marius își dedică întreaga energie pentru a-i ajuta pe clienții săi să-și atingă obiectivele. Cu o abordare personalizată și un antrenament intens, el își asigură că fiecare persoană se simte motivată și inspirată să-și depășească limitele.', price: '80 lei / sedinta' },
        { title: 'Mircea Doru', description: 'Mircea Doru este cunoscut pentru abilitatea sa de a crea programe de antrenament inovatoare și eficiente. Cu o experiență vastă în fitness și nutriție, el lucrează cu clienții săi pentru a le oferi un stil de viață sănătos și echilibrat. Fiecare antrenament este personalizat pentru a se potrivi nevoilor individuale și obiectivelor', price: '99 lei / sedinta' },
        { title: 'Andreea Salcam', description: 'Energie, motivație și dedicare - acestea sunt caracteristicile definitorii pentru Andreea. Cu o abordare orientată către rezultate și un spirit de echipă puternic, el îi încurajează pe clienții săi să-și depășească limitele și să atingă performanțe remarcabile în cadrul antrenamentelor.', price: '90 lei / sedinta' },
        { title: 'Diana Mirela', description: 'Diana este cunoscuta pentru atenția sa deosebită la detalii și abordarea sa meticuloasă în antrenamente. Cu o pasiune pentru îmbunătățirea performanței și a sănătății generale, ea oferă clienților săi programe personalizate și sfaturi experte pentru a-i ajuta să-și atingă obiectivele în cel mai eficient mod posibil.', price: '75 lei / sedinta' }
    ];

    const handleSelectPlan = (index) => {
        setSelectedPlan(index);
    };

    const handleBuy = () => {
        // UTC+3 Time
        const currentDate = new Date();
        currentDate.setUTCHours(currentDate.getUTCHours() + 3);
        const plan = plans[selectedPlan];

        api.post('/users/me/transactions/', {
            amount: parseFloat(plan.price), 
            category: 'Diete',
            description: plan.title,
            is_income: false,
            date: currentDate 
        })
        .then(response => {
            console.log('Tranzacție adăugată cu succes:', response.data);
            navigate('/pagina-de-plata');
        })
        .catch(error => {
            console.error('Eroare la adăugarea tranzacției:', error);
            // Treat error for the UI
        });
    };
    

    return (
        <div className="wrapper1">
            <div className="paginaplan1-container">
                <h4>Antrenor personal</h4>
                <div className="planuri-container">
                    {plans.map((plan, index) => (
                        <div key={index} className={`plan ${selectedPlan === index ? 'selected' : ''}`} onClick={() => handleSelectPlan(index)}>
                            <h2>{plan.title}</h2>
                            <p>{plan.price}</p>
                        </div>
                    ))}
                </div>
                {selectedPlan !== null && (
                    <div className="descriere-container">
                        <h2>{plans[selectedPlan].title}</h2>
                        <p>{plans[selectedPlan].description}</p>
                        <button onClick={handleBuy}>Cumpără</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Paginaplan2;
