import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import { useAuth } from './AuthContext'; 
import api from './api'; 
import './Styles/Paginaplan1.css';

const Paginaplan1 = () => {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const navigate = useNavigate();

    const plans = [
        { title: 'Dieta vegana', description: ' Dieta bazata doar pe plante bine alese pentru rezultate rapide', price: '50 lei' },
        { title: 'Dieta carnivora', description: 'Dieta bazata doar pe carne pentru rezultate fantastice', price: '75 lei' },
        { title: 'Intermitent Fasting', description: 'Proces de slabire menit persoanelor cu experienta', price: '55 lei' },
        { title: 'Dieta mixta', description: 'Dieta mixta cu combinatii alese atent pentru rezultate admirabile', price: '75 lei' }
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
        <div className="wrapper">
            <div className="paginaplan1-container">
                <h4>Slăbire Rapidă</h4>
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

export default Paginaplan1;
