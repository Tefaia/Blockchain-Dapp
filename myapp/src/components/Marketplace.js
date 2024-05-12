import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../api/api';
import axios from 'axios';

function Marketplace() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('new');
  const [purchased, setPurchased] = useState('false');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchCondition, setSearchCondition] = useState('new');
  const [errorMessage, setErrorMessage] = useState('');
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState('');
  const [mybalance, setMyBal] = useState('');

  const [error, setError] = useState('');
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.listAllProducts({ purchased: 'false' });
        setProducts(response);
      } catch (error) {
        console.error('Error fetching products:', error);
        setErrorMessage('Error fetching products.');
      }
    };
    const fetchBalance = async () => {
      if (address) {
        try {
          const url = `http://localhost:3002/faucet/balance/${address}`;
          const response = await axios.get(url);
          setBalance(response.data.balance);
          setError('');
        } catch (error) {
          setBalance('');
          setError(`Error: ${error.response.data.error}`);
        }
      }
    };
    fetchProducts();

    fetchBalance();
  }, [address]);
  

  useEffect(() => {
    // Fetch connected account when the component mounts
    const fetchConnectedAccount = async () => {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          setAddress(accounts[0]);
        } else {
          setAddress(null);
        }
      } catch (error) {
        console.error('Error fetching connected account:', error);
        setAddress(null);
      }
    };

    fetchConnectedAccount();
  }, []);
  const handlePurchase = async (productId, price, seller) => {
    const mybalance = balance - price; // Calculate mybalance
    try {
      if (price > balance) {
        throw new Error('You do not have enough tokens to purchase this product.');
      }
      
      if (seller === address) {
        throw new Error("You can't purchase your own product.");
      }
  
      // Make a POST request to add the transaction
      await axios.post('http://localhost:3002/blockchain/transactions/add', { productId, price, seller, address, mybalance });
  
      // Refresh the product list after purchasing the product
      const updatedProducts = await api.listAllProducts({ purchased: 'false' });
      setProducts(updatedProducts);
  
      setSuccessMessage('Product purchased successfully');
    } catch (error) {
      console.error('Error purchasing product:', error);
      setErrorMessage(error.message);
    }
  };
  
  
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentProducts = products.slice(firstIndex, lastIndex);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const handleSearchByCondition = async () => {
    try {
      const response = await api.listAllProducts({ purchased: 'false' });
      const filteredProducts = response.filter(product => product.condition === searchCondition);
      setProducts(filteredProducts);
    } catch (error) {
      console.error('Error searching for products by condition:', error);
    }
  };

  const handleAddProduct = async () => {
    try {
      if (!address) {
        throw new Error('No connected account found.');
      }

      const productData = {
        name,
        price,
        description,
        condition,
        purchased,
        seller: address
      };

      // Make a request to add the product
      await api.addProduct(productData);

      // Refresh the product list after adding the product
      const updatedProducts = await api.listAllProducts({ purchased: 'false' });
      setProducts(updatedProducts);

      // Clear the form fields after adding the product
      setName('');
      setPrice('');
      setDescription('');
      setCondition('new');
      setPurchased('false');

      // Set the success message
      setSuccessMessage('Product added successfully');
    } catch (error) {
      console.error('Error adding product:', error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="container">
      
            <div className="card-body">
              <p className="text-center">My Address: {address}</p>
              {balance && <p className="text-center">My Balance: {balance}</p>}
              {error && <p className="mt-3 text-danger">{error}</p>}
            </div>
         
      
      {/* Search Form */}
      <div className="mt-4">
        <h2 className="text-primary mb-4">Search Products by Condition</h2>
        <div className="mb-3">
          <label htmlFor="searchCondition" className="form-label text-primary">Condition:</label>
          <select
            id="searchCondition"
            className="form-select"
            value={searchCondition}
            onChange={(e) => {
              setSearchCondition(e.target.value);
              handleSearchByCondition();
            }}
          >
            <option value="new">New</option>
            <option value="refurbished">Refurbished</option>
          </select>
        </div>
      </div>

      <h2 className="text-primary mb-4">Product List</h2>
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
      <div className="row">
        <div className="col">
          <table className="table table-striped">
            <thead>
              <tr>
                <th className="bg-primary text-white border">Name</th>
                <th className="bg-primary text-white border">Price</th>
                <th className="bg-primary text-white border">Description</th>
                <th className="bg-primary text-white border">Condition</th>
                <th className="bg-primary text-white border">Seller</th>
                <th className="bg-primary text-white border">Purchased</th>
                <th className="bg-primary text-white border">Actions</th>
              </tr>
            </thead>
            <tbody>
            {currentProducts.map(product => (
  <tr key={product.id}>
    <td>{product.name}</td>
    <td>${product.price}</td>
    <td>{product.description}</td>
    <td>{product.condition}</td>
    <td>{product.seller}</td>
    <td>{product.purchased}</td>
    <td>
      <button
        className="btn btn-primary"
        onClick={() => handlePurchase(product.id, product.price, product.seller)}
        disabled={product.purchased === 'true'} // Disable button if product is purchased
      >
        Purchase
      </button>
    </td>
  </tr>
))}

            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <nav>
        <ul className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
              <button onClick={() => paginate(index + 1)} className="page-link">{index + 1}</button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Add Product Form */}
      <div className="mt-4">
        <h2 className="text-primary mb-4">Add Product</h2>
        <form>
          <div className="mb-3">
            <label htmlFor="name" className="form-label text-primary">Name:</label>
            <input
              type="text"
              id="name"
              className="form-control"
              placeholder="Enter product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="price" className="form-label text-primary">Price:</label>
            <input
              type="number"
              id="price"
              className="form-control"
              placeholder="Enter product price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label text-primary">Description:</label>
            <textarea
              id="description"
              className="form-control"
              placeholder="Enter product description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="condition" className="form-label text-primary">Condition:</label>
            <select
              id="condition"
              className="form-select"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            >
              <option value="new">New</option>
              <option value="refurbished">Refurbished</option>
            </select>
          </div>
          <button type="button" className="btn btn-primary" onClick={handleAddProduct}>
            Add Product
          </button>
        </form>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="alert alert-success mt-4" role="alert">
          {successMessage}
        </div>
      )}
    </div>
  );
}

export default Marketplace;
