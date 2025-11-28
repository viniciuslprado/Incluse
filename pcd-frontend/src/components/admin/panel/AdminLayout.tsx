import React from 'react';

import AdminSidebar from './AdminSidebar';
import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar />
      <main className="flex-1 flex flex-col items-center px-4 py-8 md:px-8">
        <div className="w-full max-w-5xl">
          {/* Header removido para visual mais limpo */}
          <div className="">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
