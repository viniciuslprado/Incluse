import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminLayout from '../../components/admin/panel/AdminLayout';

export default function AdminPanelPage() {
  return <AdminLayout><Outlet /></AdminLayout>;
}
