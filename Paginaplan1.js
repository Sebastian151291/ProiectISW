import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // import the useAuth hook
import './Paginaplan1.css'; // Importăm fișierul CSS pentru stilizare

const Paginaplan1 = () => {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuth(); // presupunând că useAuth furnizează informații despre utilizator, cum ar fi autentificarea

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
        // Logic pentru achiziționare, poate redirecționa către o pagină de plată sau executa alte acțiuni relevante
        navigate('/pagina-de-plata');
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
