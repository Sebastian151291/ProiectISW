import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; 
import './Styles/ProductsServices.css'; 
import api from './api';

const ProductsServices = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [userName, setUserName] = useState("");

    // Obiect pentru a ține descrierile pentru fiecare plan
    const planDescriptions = {
        plan1: "Acest pachet este recomandat persoanelor care vor să piardă greutate într-un timp foarte scurt. " + 
                "Acest pachet este compus din rețete delicioase caracterizate prin calorii reduse.",
        plan2: "Acest pachet este recomandat persoanelor începătoare care au nevoie de un ajutor pentru " +
                "executarea corectă a exercițiilor pentru antrenament.",
        plan3: "Acest pachet este recomandat persoanelor care au ca obiect creșterea în greutate prin " +
                "obținerea masei musculare stimulată prin exerciții și alimentație corespunzătoare."
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
          try {
            const response = await api.get("/users/me/");
            const username = response.data.username;
            setUserName(username);
          } catch (error) {
            console.error("Error fetching user information:", error);
          }
        };
    
        if (isAuthenticated) {
          fetchUserInfo();
        } 
      }, [isAuthenticated, navigate]);

    // Funcție pentru a afișa meniul detaliat al planului selectat
    const showPlanDetails = (plan) => {
        setSelectedPlan(plan);
    };

    // Funcție pentru a ascunde meniul detaliat
    const hidePlanDetails = () => {
        setSelectedPlan(null);
    };

    // Funcție pentru a efectua acțiunea de cumpărare
    const buyPlan = (plan) => {
        navigate(`/Pagina${plan}`);
    };

    return (
        <div id="productsservices-container">
            <div className="products-services-container">
                <h1>Hello, {userName}</h1>
                <div className={`plan-container ${selectedPlan === "plan1" ? 'selected' : ''}`} onClick={() => showPlanDetails("plan1")}>
                    <h2>Pachet 1</h2>
                    <p>Slăbire rapidă</p>
                </div>
                <div className={`plan-container1 ${selectedPlan === "plan2" ? 'selected' : ''}`} onClick={() => showPlanDetails("plan2")}>
                    <h2>Pachet 2</h2>
                    <p>Antrenor personal</p>
                </div>
                <div className={`plan-container2 ${selectedPlan === "plan3" ? 'selected' : ''}`} onClick={() => showPlanDetails("plan3")}>
                    <h2>Pachet 3</h2>
                    <p>Masă musculară</p>
                </div>

                {/* Meniu detaliat al planului */}
                {selectedPlan && (
                    <div className="plan-details">
                        <h2>{selectedPlan}</h2>
                        <p>{planDescriptions[selectedPlan]}</p>
                        <button onClick={() => buyPlan(selectedPlan)}>Acces</button>
                        <button onClick={hidePlanDetails}>Înapoi</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductsServices;
