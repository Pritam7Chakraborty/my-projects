import { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile } from "@/api"; // <--- Removed unused 'api'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, MapPin, Phone, Loader2 } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    address: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUserProfile()
      .then((res) => setUser(res.data))
      .catch(console.error);
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateUserProfile(user);
      alert("Profile Updated Successfully! ✅");
    } catch (error) {
      console.error("Update failed:", error); // <--- Used the error variable
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-24 px-4 flex justify-center">
      <Card className="w-full max-w-lg bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <User className="text-purple-500" /> My Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-zinc-400 text-sm">Full Name</label>
            <Input
              value={user.fullName}
              onChange={(e) => setUser({ ...user, fullName: e.target.value })}
              className="bg-zinc-950 border-zinc-700"
            />
          </div>
          <div>
            <label className="text-zinc-400 text-sm">Email (Read Only)</label>
            <Input
              value={user.email}
              disabled
              className="bg-zinc-950/50 border-zinc-800 text-zinc-500"
            />
          </div>
          <div>
            <label className="text-zinc-400 text-sm flex gap-2">
              <MapPin size={14} /> Delivery Address
            </label>
            <Input
              value={user.address || ""}
              onChange={(e) => setUser({ ...user, address: e.target.value })}
              placeholder="e.g. 123 Park Street, Kolkata"
              className="bg-zinc-950 border-zinc-700"
            />
          </div>
          <div>
            <label className="text-zinc-400 text-sm flex gap-2">
              <Phone size={14} /> Phone
            </label>
            <Input
              value={user.phone || ""}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              placeholder="+91 98765..."
              className="bg-zinc-950 border-zinc-700"
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
