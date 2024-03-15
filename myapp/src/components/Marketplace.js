import React, { useState, useEffect } from 'react';
import api from '../api/api'; // Import the API module
import 'bootstrap/dist/css/bootstrap.min.css';

const Marketplace = () => {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [addFundsAmount, setAddFundsAmount] = useState('');
    const [withdrawFundsAmount, setWithdrawFundsAmount] = useState('');
    const [buyer, setBuyer] = useState('');
    const [seller, setSeller] = useState('');
    const [productId, setProductId] = useState('');
    const [updateBuyer, setUpdateBuyer] = useState('');
    const [updateSeller, setUpdateSeller] = useState('');
    const [updateProductId, setUpdateProductId] = useState('');
    const [purchaseProductId, setPurchaseProductId] = useState('');
  
    const fetchProducts = async () => {
      try {
        const productsData = await api.listAllProducts();
        setProducts(productsData.products);
      } catch (error) {
        console.error(error);
        // Handle errors as needed
      }
    };
  
    const handleAddFunds = async () => {
      try {
        if (window.ethereum) {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          await api.addFunds(addFundsAmount);
          console.log('Funds added successfully');
        } else {
          console.error('MetaMask is not installed. Please install MetaMask to use this feature.');
        }
      } catch (error) {
        console.error('Error adding funds:', error);
      }
    };
  
    const handleWithdrawFunds = async () => {
      try {
        if (window.ethereum) {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          await api.withdrawFunds(withdrawFundsAmount);
          console.log('Funds withdrawn successfully');
        } else {
          console.error('MetaMask is not installed. Please install MetaMask to use this feature.');
        }
      } catch (error) {
        console.error('Error withdrawing funds:', error);
      }
    };
  
    const handleShipmentSubmit = async () => {
      try {
        const shipmentData = { buyer, seller, productId };
        await api.createShipment(shipmentData);
        console.log('Shipment created successfully');
        setBuyer('');
        setSeller('');
        setProductId('');
      } catch (error) {
        console.error('Error creating shipment:', error);
      }
    };
  
    const handleUpdateShipmentStatus = async () => {
      try {
        const shipmentStatusData = { buyer: updateBuyer, seller: updateSeller, productId: updateProductId };
        await api.updateShipmentStatus(shipmentStatusData);
        console.log('Shipment status updated successfully');
        setUpdateBuyer('');
        setUpdateSeller('');
        setUpdateProductId('');
      } catch (error) {
        console.error('Error updating shipment status:', error);
      }
    };
  
    const handlePurchaseProduct = async () => {
      try {
        if (window.ethereum) {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const response = await api.purchaseProduct(purchaseProductId);
          console.log('Product purchased successfully:', response);
          setPurchaseProductId('');
        } else {
          console.error('MetaMask is not installed. Please install MetaMask to use this feature.');
        }
      } catch (error) {
        console.error('Error purchasing product:', error);
      }
    };
    const handleUpdateProduct = async () => {
      try {
        await api.updateProduct(updateProductId, name, price);
        console.log('Product updated successfully');
        // You might want to fetch products again to update the list
        fetchProducts();
        setUpdateProductId('');
        setName('');
        setPrice('');
      } catch (error) {
        console.error('Error updating product:', error);
      }
    };
  
    const handleDeleteProduct = async () => {
      try {
        await api.deleteProduct(productId);
        console.log('Product deleted successfully');
        // You might want to fetch products again to update the list
        fetchProducts();
        setProductId('');
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    };
    useEffect(() => {
      fetchProducts();
    }, []); // Fetch products on component mount
  
    return (
        <div className="container">
            <h1 className="mt-4">Marketplace</h1>
            <div className="mt-4">
            <h2>Add Funds</h2>
            <input
                type="number"
                className="form-control"
                placeholder="Enter amount to add"
                value={addFundsAmount}
                onChange={(e) => setAddFundsAmount(e.target.value)}
            />
            <button className="btn btn-primary mt-2" onClick={handleAddFunds}>
                Add Funds
            </button>
        </div>

        {/* Withdraw Funds */}
        <div className="mt-4">
            <h2>Withdraw Funds</h2>
            <input
                type="number"
                className="form-control"
                placeholder="Enter amount to withdraw"
                value={withdrawFundsAmount}
                onChange={(e) => setWithdrawFundsAmount(e.target.value)}
            />
            <button className="btn btn-primary mt-2" onClick={handleWithdrawFunds}>
                Withdraw Funds
            </button>
        </div>
            <div className="mt-4">
                <h2>Product List</h2>
                {products.length === 0 ? (
                    <p>No products available.</p>
                ) : (
                    <ul className="list-group">
                        {products.map((product) => (
                            <li key={product.id} className="list-group-item">
                                {product.name} - ${product.price}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="mt-4">
                <h2>Add / Update / Delete Product</h2>
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    className="form-control"
                    placeholder="Enter product name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <label htmlFor="price">Price:</label>
                <input
                    type="number"
                    id="price"
                    className="form-control"
                    placeholder="Enter product price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
               <button className="btn btn-primary mt-2 me-2" onClick={handleAddFunds}>
  Add Product
</button>
<button className="btn btn-primary mt-2 me-2" onClick={handleUpdateProduct}>
  Update Product
</button>
<button className="btn btn-primary mt-2" onClick={handleDeleteProduct}>
  Delete Product
</button>

            </div>
            <div className="mt-4">
                <h2>Create Shipment</h2>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter buyer"
                    value={buyer}
                    onChange={(e) => setBuyer(e.target.value)}
                />
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter seller"
                    value={seller}
                    onChange={(e) => setSeller(e.target.value)}
                />
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter product ID"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                />
                <button className="btn btn-primary mt-2" onClick={handleShipmentSubmit}>
                    Create Shipment
                </button>
                <button className="btn btn-primary mt-2" onClick={handleUpdateShipmentStatus}>
                    Update Shipment Status
                </button>
            </div>
            <div className="mt-4">
  <h2>Purchase Product</h2>
  <div className="input-group mb-3">
    <input
      type="text"
      className="form-control"
      placeholder="Enter product ID to purchase"
      value={purchaseProductId}
      onChange={(e) => setPurchaseProductId(e.target.value)}
    />
    <button className="btn btn-primary" onClick={handlePurchaseProduct}>
      Purchase Product
    </button>
  </div>
</div>

        </div>
    );
};

export default Marketplace;
