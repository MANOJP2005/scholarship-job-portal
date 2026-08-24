import React from 'react';
import AdminModal from './AdminModal';

export default function AdminPage({ opportunities, onAddOpportunity, onEditOpportunity, onDeleteOpportunity, notifications, onAddNotification, onDeleteNotification, onAdminLogin, onAdminLogout }) {
  const returnToPortal = () => {
    window.location.href = '/';
  };

  return (
    <AdminModal
      isOpen
      pageMode
      onClose={returnToPortal}
      opportunities={opportunities}
      onAddOpportunity={onAddOpportunity}
      onEditOpportunity={onEditOpportunity}
      onDeleteOpportunity={onDeleteOpportunity}
      notifications={notifications}
      onAddNotification={onAddNotification}
      onDeleteNotification={onDeleteNotification}
      onAdminLogin={onAdminLogin}
      onAdminLogout={onAdminLogout}
    />
  );
}
