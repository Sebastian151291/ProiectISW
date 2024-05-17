import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import { useAuth } from './AuthContext'; 
import api from './api'; 
import './Styles/Paginaplan3.css';

const Paginaplan3 = () => {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const navigate = useNavigate();

    const plans = [
        { title: ' Dieta creste in greutate', description: 'O abordare alimentară concepută pentru a stimula creșterea musculară și câștigul în greutate prin consumul strategic de calorii și proteine în combinație cu antrenamente de forță.', price: '50 lei' },
        { title: ' Dieta crestere+definire ', description: 'O combinație inteligentă de alimentație și antrenament care vizează simultan câștigul de masă musculară și reducerea grăsimii corporale, obținând astfel un aspect muscular definit și tonifiat.', price: '75 lei' },
        { title: ' Dieta vegana de crestere', description: 'Un regim alimentar bazat exclusiv pe produse vegane, conceput pentru a asigura cantități adecvate de proteine, carbohidrați și grăsimi sănătoase pentru a susține creșterea musculară și performanța fizică.', price: '55 lei' },
        { title: ' Dirty Diet & cut ', description: 'O abordare neconvențională care combină perioade de alimentație mai liberă (dirty diet) cu perioade de restricție calorică (cut), în scopul de a stimula metabolismul și de a obține pierderea în greutate într-un mod eficient și sustenabil.', price: '75 lei' }
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
        <div className="wrapper2">
            <div className="paginaplan1-container">
                <h4>Masa Musculara</h4>
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

export default Paginaplan3;
