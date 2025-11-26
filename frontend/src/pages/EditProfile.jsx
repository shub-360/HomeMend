import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Loader2,
  Upload,
  User,
  Phone,
  MapPin,
  Save,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

const EditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    avatar_url: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    country: "United States",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/auth");
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error(error);
      toast.error("Failed to load profile");
    }

    if (data) {
      setProfile({
        full_name: data.full_name || "",
        avatar_url: data.avatar_url || "",
        phone: data.phone || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        zip_code: data.zip_code || "",
        country: data.country || "United States",
      });
    }

    setLoading(false);
  };

    
const handleAvatarUpload = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setUploading(true);

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not found");

    // CLEAN user ID
    const cleanUserId = user.id.trim();

    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}.${ext}`;

    // CORRECT path for RLS
    const filePath = `${cleanUserId}/${fileName}`;

    console.log("UPLOAD PATH =", JSON.stringify(filePath));
    console.log("USER ID     =", JSON.stringify(cleanUserId));

    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get URL
    const { data: { publicUrl } } = supabase
      .storage
      .from("avatars")
      .getPublicUrl(filePath);

    // Update profile
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("user_id", cleanUserId);

    if (profileError) throw profileError;

    setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
    toast.success("Avatar updated!");
  } catch (err) {
    console.error("UPLOAD ERROR:", err.message, err);
    toast.error("Failed to upload avatar");
  } finally {
    setUploading(false);
  }
};


  const handleSave = async () => {
    setSaving(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase.from("profiles").upsert({
        user_id: user.id,
        ...profile,
      });

      if (error) throw error;

      toast.success("Profile updated successfully");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
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
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Edit Profile
            </CardTitle>
            <CardDescription>
              Update your personal information and contact details
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-4 pb-6 border-b">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                <AvatarFallback className="text-2xl">
                  {profile.full_name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="text-center">
                <Label htmlFor="avatar" className="cursor-pointer">
                  <div className="flex items-center gap-2 text-sm text-primary hover:underline">
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading…
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Upload Photo
                      </>
                    )}
                  </div>

                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={uploading}
                  />
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG up to 2MB
                </p>
              </div>
            </div>

            {/* Personal Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={profile.full_name}
                  onChange={(e) =>
                    setProfile({ ...profile, full_name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4 pt-6 border-t">
              <div className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="w-4 h-4" />
                Address Information
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  value={profile.address}
                  onChange={(e) =>
                    setProfile({ ...profile, address: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={profile.city}
                    onChange={(e) =>
                      setProfile({ ...profile, city: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={profile.state}
                    onChange={(e) =>
                      setProfile({ ...profile, state: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zip_code">ZIP Code</Label>
                  <Input
                    id="zip_code"
                    value={profile.zip_code}
                    onChange={(e) =>
                      setProfile({ ...profile, zip_code: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={profile.country}
                    onChange={(e) =>
                      setProfile({ ...profile, country: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Save */}
            <div className="pt-6">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full"
                size="lg"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default EditProfile;
