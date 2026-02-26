import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Users, Wrench } from "lucide-react";

const AdminOverviewTab = ({ stats, userCounts }) => {
  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From completed orders</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">All time orders</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <Users className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCounts.customers + userCounts.technicians + userCounts.admins}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Technicians</CardTitle>
            <Wrench className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCounts.technicians}</div>
            <p className="text-xs text-muted-foreground">Service providers</p>
          </CardContent>
        </Card>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Orders Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pending</span>
              <span className="inline-flex items-center justify-center rounded-full bg-amber-100 text-amber-700 px-3 py-0.5 text-sm font-semibold dark:bg-amber-900/30 dark:text-amber-400">{stats.pendingOrders}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">In Progress</span>
              <span className="inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-700 px-3 py-0.5 text-sm font-semibold dark:bg-blue-900/30 dark:text-blue-400">{stats.inProgressOrders}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Completed</span>
              <span className="inline-flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700 px-3 py-0.5 text-sm font-semibold dark:bg-emerald-900/30 dark:text-emerald-400">{stats.completedOrders}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Users Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Customers</span>
              <span className="inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-700 px-3 py-0.5 text-sm font-semibold dark:bg-blue-900/30 dark:text-blue-400">{userCounts.customers}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Technicians</span>
              <span className="inline-flex items-center justify-center rounded-full bg-purple-100 text-purple-700 px-3 py-0.5 text-sm font-semibold dark:bg-purple-900/30 dark:text-purple-400">{userCounts.technicians}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Admins</span>
              <span className="inline-flex items-center justify-center rounded-full bg-amber-100 text-amber-700 px-3 py-0.5 text-sm font-semibold dark:bg-amber-900/30 dark:text-amber-400">{userCounts.admins}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverviewTab;