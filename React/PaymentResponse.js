import React from 'react';

const PaymentResponse = () => {
    const containerStyle = {
        margin: 0,
        padding: 0,
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: 'url(/images/ThankYou.gif)', // Adjusted path
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
    };

    return (
        <div style={containerStyle}>
            <h1 style={{ color: 'white', fontSize: '3em', textAlign: 'center' }}>Thank You!</h1>
        </div>
    );
};

export default PaymentResponse;
