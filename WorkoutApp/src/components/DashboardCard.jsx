// src/components/DashboardCard.jsx

import React from 'react';
import './DashboardCard.css';

export default function DashboardCard({ title, text, link, linkText, icon }) {
  return (
    <div className="dashboard-card">
      <div className="card-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
      {link && <a href={link} className="card-link">{linkText}</a>}
    </div>
  );
}