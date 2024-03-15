import React, { useState } from 'react';
import api from '../api/api'; // Import the API module
import 'bootstrap/dist/css/bootstrap.min.css';

function GenerateAddress() {
  const [generatedAddress, setGeneratedAddress] = useState('');

  const handleGenerateAddress = async () => {
    try {
      // Make a request to generate a new address
      const response = await api.generateNewAddress();
      // Set the generated address
      setGeneratedAddress(response.address);
    } catch (error) {
      console.error('Error generating address:', error);
      // Handle error state if needed
    }
  };

  return (
    <div className="container">
      <h2>Generate Address Component</h2>
      <div className="row">
        <div className="col">
          <button onClick={handleGenerateAddress} className="btn btn-primary">Generate Address</button>
          {generatedAddress && (
            <div className="mt-3">
              <h4>Generated Address:</h4>
              <p>{generatedAddress}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GenerateAddress;
