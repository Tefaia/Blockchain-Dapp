import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Transaction = () => {
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [confirmedTransactions, setConfirmedTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(5); // Number of transactions per page
  const [transactionHash, setTransactionHash] = useState('');
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPendingTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:3002/blockchain/transactions/pending');
        setPendingTransactions(response.data);
      } catch (error) {
        console.error('Error fetching pending transactions:', error);
      }
    };

    const fetchConfirmedTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:3002/blockchain/transactions/confirmed');
        setConfirmedTransactions(response.data);
      } catch (error) {
        console.error('Error fetching confirmed transactions:', error);
      }
    };

    fetchPendingTransactions();
    fetchConfirmedTransactions();
  }, []);

  const fetchTransactionDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3002/blockchain/transactions/${transactionHash}`);
      setTransactionDetails(response.data);
      setError('');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('Transaction not found');
      } else {
        setError('Internal Server Error');
      }
      setTransactionDetails(null);
    }
  };

  const handleChange = event => {
    setTransactionHash(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    fetchTransactionDetails();
  };

  const indexOfLastPendingTransaction = currentPage * transactionsPerPage;
  const indexOfFirstPendingTransaction = indexOfLastPendingTransaction - transactionsPerPage;
  const currentPendingTransactions = pendingTransactions.slice(
    indexOfFirstPendingTransaction,
    indexOfLastPendingTransaction
  );

  const indexOfLastConfirmedTransaction = currentPage * transactionsPerPage;
  const indexOfFirstConfirmedTransaction = indexOfLastConfirmedTransaction - transactionsPerPage;
  const currentConfirmedTransactions = confirmedTransactions.slice(
    indexOfFirstConfirmedTransaction,
    indexOfLastConfirmedTransaction
  );

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="container mt-5">
      <h2 className="text-primary mb-4">Pending Transactions</h2>
      {currentPendingTransactions.length > 0 ? (
        <table className="table table-striped">
          <thead className="bg-primary text-white">
            <tr>
              <th className="bg-primary text-white border">Sender</th>
              <th className="bg-primary text-white border">Recipient</th>
              <th className="bg-primary text-white border">Amount</th>
              <th className="bg-primary text-white border">Status</th>
              <th className="bg-primary text-white border">Timestamp</th>
              <th className="bg-primary text-white border">Transaction ID</th>
            </tr>
          </thead>
          <tbody>
            {currentPendingTransactions.map(transaction => (
              <tr key={transaction.transactionId}>
                <td>{transaction.sender}</td>
                <td>{transaction.recipient}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.status}</td>
                <td>{transaction.timestamp}</td>
                <td>{transaction.transactionId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No pending transactions found.</p>
      )}
      {currentPendingTransactions.length > 0 && (
        <Pagination
          itemsPerPage={transactionsPerPage}
          totalItems={pendingTransactions.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      )}

      <h2 className="text-primary mb-4">Confirmed Transactions</h2>
      {currentConfirmedTransactions.length > 0 ? (
        <table className="table table-striped">
          <thead className="bg-primary text-white">
            <tr>
              <th className="bg-primary text-white border">Sender</th>
              <th className="bg-primary text-white border">Recipient</th>
              <th className="bg-primary text-white border">Amount</th>
              <th className="bg-primary text-white border">Status</th>
              <th className="bg-primary text-white border">Timestamp</th>
              <th className="bg-primary text-white border">Transaction ID</th>
            </tr>
          </thead>
          <tbody>
            {currentConfirmedTransactions.map(transaction => (
              <tr key={transaction.transactionId}>
                <td>{transaction.sender}</td>
                <td>{transaction.recipient}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.status}</td>
                <td>{transaction.timestamp}</td>
                <td>{transaction.transactionId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No confirmed transactions found.</p>
      )}
      {currentConfirmedTransactions.length > 0 && (
        <Pagination
          itemsPerPage={transactionsPerPage}
          totalItems={confirmedTransactions.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      )}

      <div className="mt-5">
        <h2 className="text-primary mb-4">Fetch Transaction by Hash</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="transactionHash">Transaction Hash:</label>
            <input
              type="text"
              className="form-control"
              id="transactionHash"
              value={transactionHash}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">Fetch Transaction</button>
        </form>
      </div>

      {transactionDetails ? (
        <div className="mt-3">
          <h3>Transaction Details</h3>
          <table className="table">
            <thead className="bg-primary text-white">
              <tr>
                <th>Field</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Sender</td>
                <td>{transactionDetails.sender}</td>
              </tr>
              <tr>
                <td>Recipient</td>
                <td>{transactionDetails.recipient}</td>
              </tr>
              <tr>
                <td>Amount</td>
                <td>{transactionDetails.amount}</td>
              </tr>
              <tr>
                <td>Status</td>
                <td>{transactionDetails.status}</td>
              </tr>
              <tr>
                <td>Timestamp</td>
                <td>{transactionDetails.timestamp}</td>
              </tr>
              <tr>
                <td>Transaction ID</td>
                <td>{transactionDetails.transactionId}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-3">
          {error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : (
            <p>No transaction details found for the provided hash.</p>
          )}
        </div>
      )}
    </div>
  );
};

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map(number => (
          <li key={number} className={currentPage === number ? 'page-item active' : 'page-item'}>
            <a onClick={() => paginate(number)} href="#" className="page-link">
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Transaction;
