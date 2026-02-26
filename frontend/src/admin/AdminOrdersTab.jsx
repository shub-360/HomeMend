import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShoppingCart, Clock, CheckCircle, Loader, XCircle } from "lucide-react";
import { format } from "date-fns";

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'completed': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    case 'pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    case 'in_progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'confirmed': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
    case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getUserEmail = (userId, users) => {
  const user = users.find(u => u.id === userId);
  return user?.email || userId.substring(0, 8) + '...';
};

const AdminOrdersTab = ({ orders, users, stats, onUpdateStatus, onAssignTechnician }) => {
  const technicians = users.filter(u => u.roles.includes('technician'));

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <ShoppingCart className="h-3 w-3" /> Total
            </CardTitle>
          </CardHeader>
          <CardContent><div className="text-xl font-bold">{stats.totalOrders}</div></CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" /> Pending
            </CardTitle>
          </CardHeader>
          <CardContent><div className="text-xl font-bold">{stats.pendingOrders}</div></CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <CheckCircle className="h-3 w-3" /> Confirmed
            </CardTitle>
          </CardHeader>
          <CardContent><div className="text-xl font-bold">{stats.confirmedOrders}</div></CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-400">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Loader className="h-3 w-3" /> In Progress
            </CardTitle>
          </CardHeader>
          <CardContent><div className="text-xl font-bold">{stats.inProgressOrders}</div></CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <CheckCircle className="h-3 w-3" /> Completed
            </CardTitle>
          </CardHeader>
          <CardContent><div className="text-xl font-bold">{stats.completedOrders}</div></CardContent>
        </Card>
      </div>

      {/* Orders table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No orders found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Scheduled</TableHead>
                    <TableHead>Service Provider</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">{order.id.substring(0, 8)}...</TableCell>
                      <TableCell className="text-sm">{getUserEmail(order.user_id, users)}</TableCell>
                      <TableCell className="font-medium text-sm">{order.service_type}</TableCell>
                      <TableCell className="text-sm">${order.price?.toFixed(2) || '0.00'}</TableCell>
                      <TableCell className="text-sm">
                        {order.scheduled_date
                          ? format(new Date(order.scheduled_date), 'MMM dd, yyyy')
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.assigned_technician_id || "unassigned"}
                          onValueChange={(value) => onAssignTechnician(order.id, value)}
                        >
                          <SelectTrigger className="w-[150px] h-8 text-xs">
                            <SelectValue placeholder="Unassigned" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unassigned">Unassigned</SelectItem>
                            {technicians.map((tech) => (
                              <SelectItem key={tech.id} value={tech.id}>
                                🔧 {tech.email.split('@')[0]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`text-xs ${getStatusBadgeClass(order.status)}`}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(value) => onUpdateStatus(order.id, value)}
                        >
                          <SelectTrigger className="w-[120px] h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrdersTab;