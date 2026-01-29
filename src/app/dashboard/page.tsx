import { MainLayout } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent, Table } from '@/components/common';
import { TableColumn } from '@/types/common.types';
import { getDashboardData, DashboardData } from './actions';
import { DeleteButton } from '@/components/modules/dashboard/DeleteButton';
import { AddRouteButton } from '@/components/modules/dashboard/AddRouteButton';
import { Suspense } from 'react';

/**
 * Dashboard Page - Server Component with SSR
 * Fetches data server-side and renders on the server
 * Optimized with proper keys, streaming, and efficient reconciliation
 */

export default async function DashboardPage() {
  // Server-side data fetching
  const dashboardData = await getDashboardData();

  // Pre-calculate stats on server (more efficient than client-side)
  const stats = {
    totalRoutes: dashboardData.length,
    activeVehicles: dashboardData.reduce((sum, item) => sum + item.vehicles, 0),
    activeRoutes: dashboardData.filter((item) => item.status === 'Active').length,
    delayedRoutes: dashboardData.filter((item) => item.status === 'Delayed').length,
  };

  const columns: TableColumn<DashboardData>[] = [
    { key: 'route', label: 'Route' },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === 'Active'
              ? 'bg-green-100 text-green-800'
              : value === 'Delayed'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {value}
        </span>
      ),
    },
    { key: 'vehicles', label: 'Vehicles' },
    {
      key: 'lastUpdate',
      label: 'Last Update',
      render: (value: string) => new Date(value).toLocaleTimeString(),
    },
    {
      key: 'id',
      label: 'Actions',
      render: (value: string) => <DeleteButton routeId={value} />,
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Overview of operations and real-time status
            </p>
          </div>
          <AddRouteButton />
        </div>

        {/* Stats Cards - Pre-calculated on server */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card variant="elevated" padding="md">
            <div className="text-sm text-gray-600">Total Routes</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">
              {stats.totalRoutes}
            </div>
          </Card>
          <Card variant="elevated" padding="md">
            <div className="text-sm text-gray-600">Active Vehicles</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">
              {stats.activeVehicles}
            </div>
          </Card>
          <Card variant="elevated" padding="md">
            <div className="text-sm text-gray-600">Active Routes</div>
            <div className="text-3xl font-bold text-green-600 mt-2">
              {stats.activeRoutes}
            </div>
          </Card>
          <Card variant="elevated" padding="md">
            <div className="text-sm text-gray-600">Delayed</div>
            <div className="text-3xl font-bold text-yellow-600 mt-2">
              {stats.delayedRoutes}
            </div>
          </Card>
        </div>

        {/* Data Table */}
        <Card variant="bordered" padding="none">
          <CardHeader className="px-6 pt-6">
            <CardTitle>Routes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table data={dashboardData} columns={columns} />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
