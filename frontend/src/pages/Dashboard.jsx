import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  ShoppingCart,
  Package,
  User,
  Mail,
  Calendar,
  Trash2,
  Sparkles,
  Wrench,
  Home,
  MapPin,
  Phone,
  Edit,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("orders");
  const [userId, setUserId] = useState(null);

  // Single unified init
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (!session) {
          navigate("/auth");
          return;
        }

        const uid = session.user.id;
        setUserId(uid);

        // Fetch everything in parallel
        await Promise.all([
          fetchProfile(uid),
          fetchOrders(uid),
          fetchCartItems(uid),
        ]);

        if (mounted) setLoading(false);
      } catch (err) {
        console.error("Dashboard init error:", err);
        if (mounted) setLoading(false);
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  // Realtime updates for profile
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`dashboard-profile-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.new) {
            setProfile((prev) => ({
              ...prev,
              ...payload.new,
            }));
          }
        }
      )
      .subscribe();

    return () => {
      try {
        supabase.removeChannel(channel);
      } catch (e) {
        console.error("Error removing channel:", e);
      }
    };
  }, [userId]);

  const fetchOrders = async (uid) => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", uid || userId)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load orders");
      console.error(error);
      return;
    }

    setOrders(data || []);
  };

  const fetchProfile = async (uid) => {
    try {
      const { data: p, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", uid)
        .maybeSingle();

      if (error) {
        console.error("fetchProfile error:", error);
        return;
      }

      // Load auth info (email & created_at)
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setProfile({
        email: user?.email || null,
        created_at: user?.created_at || null,
        full_name: p?.full_name || "",
        avatar_url: p?.avatar_url || null,
        phone: p?.phone || "",
        address: p?.address || "",
        city: p?.city || "",
        state: p?.state || "",
      });
    } catch (err) {
      console.error("fetchProfile exception:", err);
    }
  };

  const fetchCartItems = async (uid) => {
    const { data, error } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", uid || userId)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load cart items");
      console.error(error);
      return;
    }

    setCartItems(data || []);
  };

  const deleteCartItem = async (cartId) => {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", cartId);

    if (error) {
      toast.error("Failed to remove item from cart");
      console.error(error);
      return;
    }

    toast.success("Item removed from cart");
    fetchCartItems();
  };

  const checkoutCart = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Convert cart items to orders
    const ordersToInsert = cartItems.map((item) => ({
      user_id: user.id,
      service_type: item.service_type,
      description: item.description,
      price: item.price,
      scheduled_date: item.scheduled_date,
      status: "pending",
    }));

    const { error: orderError } = await supabase
      .from("orders")
      .insert(ordersToInsert);

    if (orderError) {
      toast.error("Failed to process checkout");
      console.error(orderError);
      return;
    }

    // Clear cart after successful checkout
    const { error: deleteError } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id);

    if (deleteError) {
      console.error(deleteError);
    }

    toast.success("Orders placed successfully!");
    fetchCartItems();
    fetchOrders();
    setActiveTab("orders");
  };

  const deleteOrder = async (orderId) => {
    const { error } = await supabase.from("orders").delete().eq("id", orderId);

    if (error) {
      toast.error("Failed to delete order");
      return;
    }

    toast.success("Order deleted");
    fetchOrders();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">My Dashboard</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="orders" className="gap-2">
              <Package className="w-4 h-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="cart" className="gap-2">
              <ShoppingCart className="w-4 h-4" />
              Cart
              {cartItems.length > 0 && (
                <Badge className="ml-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {cartItems.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          {/* ORDERS TAB */}
          <TabsContent value="orders" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  My Orders
                </CardTitle>
                <CardDescription>
                  View and manage your service orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="relative inline-block mb-6">
                      <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl" />
                      <div className="relative bg-gradient-to-br from-primary/20 to-accent/20 p-6 rounded-full">
                        <Wrench className="w-12 h-12 text-primary" />
                      </div>
                      <Sparkles className="w-6 h-6 text-accent absolute -top-2 -right-2 animate-pulse" />
                    </div>

                    <h3 className="text-xl font-semibold mb-2">
                      You haven't booked any services yet
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Ready to make your home happy?
                    </p>

                    <Button
                      onClick={() => navigate("/")}
                      size="lg"
                      className="gap-2"
                    >
                      <Home className="w-4 h-4" />
                      Browse Services
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id} className="border-border/50">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-lg">
                                  {order.service_type}
                                </h3>
                                <Badge className={getStatusColor(order.status)}>
                                  {order.status}
                                </Badge>
                              </div>

                              {order.description && (
                                <p className="text-muted-foreground mb-3">
                                  {order.description}
                                </p>
                              )}

                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                {order.scheduled_date && (
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(
                                      order.scheduled_date
                                    ).toLocaleDateString()}
                                  </div>
                                )}
                                {order.price && (
                                  <div className="font-medium text-foreground">
                                    ₹{order.price.toFixed(2)}
                                  </div>
                                )}
                              </div>
                            </div>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteOrder(order.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* CART TAB */}
          <TabsContent value="cart" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Shopping Cart
                </CardTitle>
                <CardDescription>
                  Review your cart and proceed to checkout
                </CardDescription>
              </CardHeader>
              <CardContent>
                {cartItems.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="relative inline-block mb-6">
                      <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl" />
                      <div className="relative bg-gradient-to-br from-primary/20 to-accent/20 p-6 rounded-full">
                        <ShoppingCart className="w-12 h-12 text-primary" />
                      </div>
                      <Sparkles className="w-6 h-6 text-accent absolute -top-2 -right-2 animate-pulse" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
                    <p className="text-muted-foreground mb-6">
                      Add services to your cart to get started
                    </p>
                    <Button onClick={() => navigate("/")} size="lg" className="gap-2">
                      <Home className="w-4 h-4" />
                      Browse Services
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <Card key={item.id} className="border-border/50">
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-semibold text-lg">{item.service_type}</h3>
                                </div>
                                {item.customer_name && (
                                  <p className="text-sm text-muted-foreground mb-1">
                                    <User className="w-3 h-3 inline mr-1" />
                                    {item.customer_name}
                                  </p>
                                )}
                                {item.customer_phone && (
                                  <p className="text-sm text-muted-foreground mb-1">
                                    <Phone className="w-3 h-3 inline mr-1" />
                                    {item.customer_phone}
                                  </p>
                                )}
                                {item.customer_address && (
                                  <p className="text-sm text-muted-foreground mb-1">
                                    <MapPin className="w-3 h-3 inline mr-1" />
                                    {item.customer_address}
                                  </p>
                                )}
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-3">
                                  {item.scheduled_date && (
                                    <div className="flex items-center gap-1">
                                      <Calendar className="w-4 h-4" />
                                      {new Date(item.scheduled_date).toLocaleDateString()}
                                    </div>
                                  )}
                                  {item.preferred_time && (
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-4 h-4" />
                                      {item.preferred_time}
                                    </div>
                                  )}
                                  {item.price && (
                                    <div className="font-medium text-foreground">
                                      ₹{item.price.toFixed(2)}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteCartItem(item.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                       {/* Cart Summary */}
                    <Card className="mt-6 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
                      <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className="text-center sm:text-left">
                            <p className="text-sm text-muted-foreground mb-1">
                              {cartItems.length} {cartItems.length === 1 ? 'service' : 'services'} in cart
                            </p>
                            <div className="text-3xl font-bold text-primary">
                              ₹{cartItems.reduce((sum, item) => sum + (item.price || 0), 0).toFixed(2)}
                            </div>
                          </div>
                          <Button 
                            onClick={checkoutCart} 
                            size="lg" 
                            variant="prominent"
                            className="w-full sm:w-auto text-lg px-8 py-6"
                          >
                            <ShoppingCart className="w-5 h-5" />
                            Proceed to Checkout
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    </div>

                    {/* Checkout Section */}
                    <div className="mt-6 pt-6 border-t">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-semibold">Total Items:</span>
                        <span className="text-lg font-bold">{cartItems.length}</span>
                      </div>
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-xl font-semibold">Total Amount:</span>
                        <span className="text-xl font-bold text-primary">
                          ₹{cartItems.reduce((sum, item) => sum + (item.price || 0), 0).toFixed(2)}
                        </span>
                      </div>
                      <Button
                        onClick={checkoutCart}
                        size="lg"
                        className="w-full gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Proceed to Checkout
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* PROFILE TAB */}
          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Your account details and personal information
                </CardDescription>
              </CardHeader>

              <CardContent>
                {profile && (
                  <div className="space-y-6">
                    {/* PROFILE HEADER */}
                    <div className="flex items-center gap-4 pb-6 border-b">
                      <Avatar className="w-20 h-20">
                        <AvatarImage
                          src={profile.avatar_url || undefined}
                          alt={profile.full_name || "User"}
                        />
                        <AvatarFallback className="text-2xl">
                          {profile.full_name?.charAt(0)?.toUpperCase() ||
                            profile.email?.charAt(0)?.toUpperCase() ||
                            "U"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <h2 className="text-2xl font-semibold">
                          {profile.full_name || "Your Name"}
                        </h2>
                        <p className="text-muted-foreground">{profile.email}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Hey {profile.full_name?.split(" ")[0] || "there"},
                          here's your activity!
                        </p>
                      </div>

                      <Button
                        onClick={() => navigate("/edit-profile")}
                        variant="outline"
                        className="gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit Profile
                      </Button>
                    </div>

                    {/* CONTACT INFO */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{profile.email}</p>
                        </div>
                      </div>

                      {profile.phone && (
                        <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                          <Phone className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Phone
                            </p>
                            <p className="font-medium">{profile.phone}</p>
                          </div>
                        </div>
                      )}

                      {(profile.address || profile.city) && (
                        <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                          <MapPin className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Address
                            </p>
                            <p className="font-medium">
                              {profile.address}
                              {profile.city && `, ${profile.city}`}
                              {profile.state && `, ${profile.state}`}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Member Since
                          </p>
                          <p className="font-medium">
                            {profile.created_at
                              ? new Date(
                                  profile.created_at
                                ).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
