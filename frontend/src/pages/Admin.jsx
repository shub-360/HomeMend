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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminOverviewTab from "@/admin/AdminOverviewTab";
import AdminUsersTab from "@/admin/AdminUsersTab";
import AdminOrdersTab from "@/admin/AdminOrdersTab";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
    fetchOrders();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-list-users`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch users');
      }

      const { users: usersWithRoles } = await response.json();
      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({ title: "Error", description: "Failed to load users.", variant: "destructive" });
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
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({ title: "Error", description: "Failed to load orders.", variant: "destructive" });
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
      if (error) throw error;
      toast({ title: "Success", description: `Order status updated to ${newStatus}.` });
      fetchOrders();
    } catch (error) {
      toast({ title: "Error", description: error.message || "Failed to update order status", variant: "destructive" });
    }
  };

  const assignTechnician = async (orderId, technicianId) => {
    try {
      const value = technicianId === 'unassigned' ? null : technicianId;
      const { error } = await supabase
        .from('orders')
        .update({ assigned_technician_id: value })
        .eq('id', orderId);
      if (error) throw error;
      toast({ title: "Success", description: value ? "Technician assigned." : "Technician unassigned." });
      fetchOrders();
    } catch (error) {
      toast({ title: "Error", description: error.message || "Failed to assign technician", variant: "destructive" });
    }
  };

  const addRole = async (userId, role) => {
    try {
      const { error } = await supabase.from('user_roles').insert({ user_id: userId, role });
      if (error) throw error;
      toast({ title: "Success", description: `Role ${role} added.` });
      fetchUsers();
    } catch (error) {
      toast({ title: "Error", description: error.message || "Failed to add role", variant: "destructive" });
    }
  };

  const removeRole = async (userId, role) => {
    try {
      const { error } = await supabase.from('user_roles').delete().eq('user_id', userId).eq('role', role);
      if (error) throw error;
      toast({ title: "Success", description: `Role ${role} removed.` });
      fetchUsers();
    } catch (error) {
      toast({ title: "Error", description: error.message || "Failed to remove role", variant: "destructive" });
    }
  };

  // Compute stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const confirmedOrders = orders.filter(o => o.status === 'confirmed').length;
  const inProgressOrders = orders.filter(o => o.status === 'in_progress').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const totalRevenue = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + (o.price || 0), 0);

  const userCounts = {
    customers: users.filter(u => u.roles.includes('user') && !u.roles.includes('admin') && !u.roles.includes('technician')).length,
    technicians: users.filter(u => u.roles.includes('technician')).length,
    admins: users.filter(u => u.roles.includes('admin')).length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              Admin Panel
              <Badge className="bg-primary text-primary-foreground text-xs">Admin</Badge>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Manage users and orders</p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AdminOverviewTab
              stats={{ totalRevenue, totalOrders, pendingOrders, inProgressOrders, completedOrders }}
              userCounts={userCounts}
            />
          </TabsContent>

          <TabsContent value="users">
            <AdminUsersTab
              users={users}
              loading={loading}
              userCounts={userCounts}
              onAddRole={addRole}
              onRemoveRole={removeRole}
            />
          </TabsContent>

          <TabsContent value="orders">
            <AdminOrdersTab
              orders={orders}
              users={users}
              stats={{ totalOrders, pendingOrders, confirmedOrders, inProgressOrders, completedOrders }}
              onUpdateStatus={updateOrderStatus}
              onAssignTechnician={assignTechnician}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;