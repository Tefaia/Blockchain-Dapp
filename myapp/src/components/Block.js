import React, { useState, useEffect } from 'react';
import api from '../api/api'; // Import the API module
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function Block() {
  const [blocks, setBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [blockIndexInput, setBlockIndexInput] = useState('');
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [blocksPerPage] = useState(5); // Number of blocks per page

  useEffect(() => {
    fetchAllBlocks();
  }, [currentPage]); // Fetch blocks whenever the current page changes

  const fetchAllBlocks = async () => {
    try {
      const startIndex = (currentPage - 1) * blocksPerPage;
      const endIndex = startIndex + blocksPerPage;
      const allBlocks = await api.getAllBlocks(startIndex, endIndex);
      setBlocks(allBlocks);
    } catch (error) {
      console.error('Error fetching blocks:', error);
      setError('Error fetching blocks. Please try again later.');
    }
  };

  const fetchBlockByIndex = async () => {
    try {
      const index = parseInt(blockIndexInput);
      if (!isNaN(index)) {
        const block = await api.getBlockDetails(index);
        setBlocks([block]);
        setSelectedBlock(index);
      }
    } catch (error) {
      console.error('Error fetching block:', error);
      setError('Error fetching block. Please try again later.');
    }
  };

  const handleInputChange = (event) => {
    setBlockIndexInput(event.target.value);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleNext = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrev = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <div className="container">
      <h2>Block Component</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          value={blockIndexInput}
          onChange={handleInputChange}
        />
        <button className="btn btn-primary mt-2" onClick={fetchBlockByIndex}>
          Fetch Block by Index
        </button>
      </div>
      <div>
        <h3>Blocks</h3>
        <ul className="list-group">
          {blocks.map((block) => (
            <li key={block.index} className="list-group-item">
              <p>Block Index: {block.index}</p>
              <p>Timestamp: {block.timestamp}</p>
            </li>
          ))}
        </ul>
        {selectedBlock && <p>Selected Block: {selectedBlock}</p>}
      </div>
      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {/* Bootstrap Pagination */}
      <nav aria-label="Page navigation example">
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={handlePrev}>Previous</button>
          </li>
          {Array.from({ length: Math.ceil(blocks.length / blocksPerPage) }).map((_, index) => (
            <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => paginate(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === Math.ceil(blocks.length / blocksPerPage) ? 'disabled' : ''}`}>
            <button className="page-link" onClick={handleNext}>Next</button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Block;
