import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { Briefcase, Calendar, MapPin, Phone } from "lucide-react";

const Technician = () => {
  // Mock data - in a real app, this would come from your database
  const jobs = [
    {
      id: 1,
      service: "TV Repair",
      customer: "John Doe",
      phone: "+1 234 567 8900",
      address: "123 Main St, City",
      date: "2025-11-20",
      time: "10:00 AM",
      status: "scheduled"
    },
    {
      id: 2,
      service: "Refrigerator Repair",
      customer: "Jane Smith",
      phone: "+1 234 567 8901",
      address: "456 Oak Ave, City",
      date: "2025-11-21",
      time: "2:00 PM",
      status: "scheduled"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Briefcase className="w-10 h-10 text-primary" />
            My Jobs
          </h1>
          <p className="text-muted-foreground">View and manage your assigned service requests</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{job.service}</CardTitle>
                  <Badge variant="secondary">{job.status}</Badge>
                </div>
                <CardDescription>{job.customer}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{job.date} at {job.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{job.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{job.phone}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {jobs.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No jobs assigned yet</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Technician;