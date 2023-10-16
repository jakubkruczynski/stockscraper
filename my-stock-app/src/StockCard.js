import React from 'react';

const StockCard = ({ stock }) => {
  return (
    <div className="stock-card">
      <h3>{stock.companyName}</h3>
      <p>Stock Price: ${stock.price}</p>
      <p>Yahoo Finance: <a href={stock.yahooFinanceLink} target="_blank" rel="noopener noreferrer">Link</a></p>
      {/* Add more details here */}
    </div>
  );
};

export default StockCard;
