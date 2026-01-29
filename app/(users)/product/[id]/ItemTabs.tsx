
"use client"
import { useState } from 'react';

type Tab = 'details' | 'reviews' | 'related';

export default function ItemTabs() {
  const [activeTab, setActiveTab] = useState<Tab>('details');

  return (
    <div className="tabs">
      <div className="tab-buttons">
        <button
          onClick={() => setActiveTab('details')}
          className={activeTab === 'details' ? 'active' : ''}
        >
          Details
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={activeTab === 'reviews' ? 'active' : ''}
        >
          Reviews
        </button>
        <button
          onClick={() => setActiveTab('related')}
          className={activeTab === 'related' ? 'active' : ''}
        >
          Related Items
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'details' && <p>Here are full specifications and detailed info about the item.</p>}
        {activeTab === 'reviews' && <p>User reviews will appear here.</p>}
        {activeTab === 'related' && <p>Related items from the same category will appear here.</p>}
      </div>

      <style jsx>{`
        .tab-buttons {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        button {
          padding: 10px 20px;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          background: none;
        }
        button.active {
          border-color: #0070f3;
          font-weight: bold;
        }
        .tab-content {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          background: #f9f9f9;
        }
      `}</style>
    </div>
  );
}
