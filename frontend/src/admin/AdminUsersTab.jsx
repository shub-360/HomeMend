import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Wrench, ShieldCheck } from "lucide-react";

const getRoleBadgeClass = (role) => {
  switch (role) {
    case 'admin': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    case 'technician': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
    case 'user': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
  }
};

const getInitials = (email) => {
  return email.substring(0, 2).toUpperCase();
};

const AdminUsersTab = ({ users, loading, userCounts, onAddRole, onRemoveRole }) => {
  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Customers</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCounts.customers}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Technicians</CardTitle>
            <Wrench className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCounts.technicians}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Admins</CardTitle>
            <ShieldCheck className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCounts.admins}</div>
          </CardContent>
        </Card>
      </div>

      {/* Users grid */}
      <div>
        <h3 className="text-lg font-semibold mb-4">All Users</h3>
        {loading ? (
          <p className="text-muted-foreground">Loading users...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
              <Card key={user.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                        {getInitials(user.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{user.email}</p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">ID: {user.id.substring(0, 8)}...</p>
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {user.roles.map((role) => (
                          <Badge
                            key={role}
                            variant="secondary"
                            className={`text-xs gap-1 ${getRoleBadgeClass(role)}`}
                          >
                            {role}
                            <button
                              onClick={() => onRemoveRole(user.id, role)}
                              className="ml-0.5 hover:opacity-70"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Select onValueChange={(value) => onAddRole(user.id, value)}>
                      <SelectTrigger className="w-full h-8 text-xs">
                        <SelectValue placeholder="Add role..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">👑 Admin</SelectItem>
                        <SelectItem value="technician">🔧 Technician</SelectItem>
                        <SelectItem value="user">👤 User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersTab;