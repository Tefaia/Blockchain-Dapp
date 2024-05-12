import React, { useState, useEffect } from 'react';
import api from '../api/api'; // Import the api.js file
import 'bootstrap/dist/css/bootstrap.min.css';

function Block() {
  const [Index, setBlockIndex] = useState('');
  const [blockData, setBlockData] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState('');

  const handleInputChange = (event) => {
    setBlockIndex(event.target.value);
  };

  const handleGetBlock = async (event) => {
    event.preventDefault();
    try {
      const block = await api.getBlockDetails(Index);
      setBlockData(block);
      setError('');
    } catch (error) {
      setError(error);
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const response = await api.getAllBlocks(currentPage);
        setBlocks(response.blocks || []);
        setTotalPages(response.totalPages || 0);
        setError('');
      } catch (error) {
        setError(error);
      }
    };

    fetchBlocks();
  }, [currentPage]);

  return (
    <div className="container">
      <h2 className="text-primary mb-4">Get Block By Index</h2>
      <form onSubmit={handleGetBlock}>
        <div className="mb-3">
          <label htmlFor="blockIndex" className="form-label">Block Index</label>
          <input
            type="number"
            className="form-control"
            id="blockIndex"
            placeholder="Enter block index"
            value={Index}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Get Block</button>
      </form>
      {error && <p className="text-danger mt-3">Error: {error}</p>}
      {blockData && (
        <div className="mt-3">
          <p>Index: {blockData.index}</p>
          <p>Data: {JSON.stringify(blockData.data)}</p>
          <p>Timestamp: {blockData.timestamp}</p>
        </div>
      )}

      <h2 className="text-primary mb-4">All Blocks</h2>
      <div className="mt-3">
        {blocks.map((block, index) => (
          <div key={index}>
            <p>Index: {block.index}</p>
            <p>Data: {block.data ? JSON.stringify(block.data) : 'No data available'}</p>
            <p>Timestamp: {block.timestamp}</p>
          </div>
        ))}
      </div>
      <div className="mt-3">
        <button
          className="btn btn-secondary me-2"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous Page
        </button>
        <button
          className="btn btn-secondary"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next Page
        </button>
      </div>
    </div>
  );
}

export default Block;
