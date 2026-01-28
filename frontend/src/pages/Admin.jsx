import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { ShieldCheck, Users, Wrench, User, CalendarCheck, DollarSign, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

const Admin = () => {
  const [users, setUsers] = useState([]);
   const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ totalBookings: 0, pendingOrders: 0, completedOrders: 0, totalRevenue: 0 });

  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
    fetchOrders();
  }, []);

  const fetchUsers = async () => {
    try {
      // Get session token
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      // Call Edge Function
      const { data, error } = await supabase.functions.invoke(
        "admin-list-users",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (error) throw error;

      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description:
          "Failed to load users. Make sure you have admin privileges.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const fetchOrders = async () => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    const ordersData = data || [];
    setOrders(ordersData);
    
    // Calculate stats
    const totalBookings = ordersData.length;
    const pendingOrders = ordersData.filter(o => o.status === 'pending').length;
    const completedOrders = ordersData.filter(o => o.status === 'completed').length;
    const totalRevenue = ordersData
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + (o.price || 0), 0);
    
    setStats({ totalBookings, pendingOrders, completedOrders, totalRevenue });
  } catch (error) {
    console.error('Error fetching orders:', error);
    toast({
      title: "Error",
      description: "Failed to load orders.",
      variant: "destructive",
    });
  }
};

const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);
    
    if (error) throw error;
    
    toast({
      title: "Success",
      description: `Order status updated to ${newStatus}.`,
    });
    
    fetchOrders();
  } catch (error) {
    toast({
      title: "Error",
      description: error.message || "Failed to update order status",
      variant: "destructive",
    });
  }
};

  const addRole = async (userId, role) => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Role ${role} added successfully.`,
      });

      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to add role",
        variant: "destructive",
      });
    }
  };

  const removeRole = async (userId, role) => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", role);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Role ${role} removed successfully.`,
      });

      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove role",
        variant: "destructive",
      });
    }
  };
   const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'in_progress': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <ShieldCheck className="w-10 h-10 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Manage bookings, sales, and users</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <CalendarCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground">All time bookings</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</div>
              <p className="text-xs text-muted-foreground">Awaiting action</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completedOrders}</div>
              <p className="text-xs text-muted-foreground">Successfully completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">${stats.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">From completed orders</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders/Sales Management Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">

              
              <CalendarCheck className="w-5 h-5" />
              Sales & Booking Management
            </CardTitle>
            <CardDescription>
              View and manage all bookings and orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No orders found.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Scheduled Date</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.service_type}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{order.description || '-'}</TableCell>
                        <TableCell>
                          {order.scheduled_date 
                            ? format(new Date(order.scheduled_date), 'MMM dd, yyyy')
                            : '-'}
                        </TableCell>
                        <TableCell>${order.price?.toFixed(2) || '0.00'}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={order.status}
                            onValueChange={(value) => updateOrderStatus(order.id, value)}
                          >
                            <SelectTrigger className="w-[130px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
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

        {/* User Management */}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              User Management
            </CardTitle>
            <CardDescription>
              View all users and manage their roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading users...</p>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{user.email}</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {user.roles.map((role) => (
                          <Badge
                            key={role}
                            variant="secondary"
                            className="gap-1"
                          >
                            {role === "admin" && "👑"}
                            {role === "technician" && "🔧"}
                            {role === "user" && "👤"}
                            {role}
                            <button
                              onClick={() => removeRole(user.id, role)}
                              className="ml-1 hover:text-destructive"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Select onValueChange={(value) => addRole(user.id, value)}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Add role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">👑 Admin</SelectItem>
                        <SelectItem value="technician">
                          🔧 Technician
                        </SelectItem>
                        <SelectItem value="user">👤 User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;
