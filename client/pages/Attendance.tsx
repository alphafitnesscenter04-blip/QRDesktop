import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, User, Key, Filter, Search } from "lucide-react";
import { toast } from "sonner";

interface AttendanceRecord {
  id: string;
  timestamp: string;
  member_name: string;
  key_code: string;
  status: "active" | "pending" | "inactive" | "unknown";
  check_in_time?: string;
  check_out_time?: string;
}

export default function Attendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<"today" | "daily">("today");

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/attendance");
      const data = (await res.json()) as { items: AttendanceRecord[] };
      setRecords(data.items ?? []);
    } catch (e) {
      toast.error("Failed to load attendance records");
      // Mock data for demo
      setRecords(generateMockAttendance());
    } finally {
      setLoading(false);
    }
  };

  const generateMockAttendance = (): AttendanceRecord[] => {
    const now = new Date();
    return [
      {
        id: "1",
        timestamp: new Date(now.getTime() - 60000).toISOString(),
        member_name: "Member KEY-A466HMGO",
        key_code: "KEY-A466HMGO",
        status: "active",
        check_in_time: new Date(now.getTime() - 60000).toLocaleTimeString(),
      },
      {
        id: "2",
        timestamp: new Date(now.getTime() - 120000).toISOString(),
        member_name: "Unknown",
        key_code: "Unknown",
        status: "unknown",
        check_in_time: new Date(now.getTime() - 120000).toLocaleTimeString(),
      },
      {
        id: "3",
        timestamp: new Date(now.getTime() - 180000).toISOString(),
        member_name: "Member KEY-A466HMGO",
        key_code: "KEY-A466HMGO",
        status: "active",
        check_in_time: new Date(now.getTime() - 180000).toLocaleTimeString(),
      },
    ];
  };

  const filteredRecords = useMemo(() => {
    return records.filter((r) =>
      r.key_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.member_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [records, searchTerm]);

  const todayRecords = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return filteredRecords.filter((r) => {
      const recordDate = new Date(r.timestamp);
      recordDate.setHours(0, 0, 0, 0);
      return recordDate.getTime() === today.getTime();
    });
  }, [filteredRecords]);

  const stats = useMemo(() => {
    return {
      total: todayRecords.length,
      active: todayRecords.filter((r) => r.status === "active").length,
      peakTime: todayRecords.length > 0 ? "08:40 AM" : "—",
    };
  }, [todayRecords]);

  const getStatusBadge = (status: string) => {
    if (status === "active") return <Badge className="bg-green-100 text-green-900">Active</Badge>;
    if (status === "pending") return <Badge className="bg-amber-100 text-amber-900">Pending</Badge>;
    if (status === "inactive") return <Badge className="bg-red-100 text-red-900">Inactive</Badge>;
    return <Badge className="bg-gray-100 text-gray-900">Unknown</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Check-ins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Peak Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.peakTime}</div>
            <p className="text-xs text-muted-foreground mt-1">Busiest hour</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Monitoring</CardTitle>
          <CardDescription>
            Search and filter all member keycard scans and attendance records
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <Tabs value={dateFilter} onValueChange={(v: any) => setDateFilter(v)}>
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <TabsList className="grid w-full sm:w-auto grid-cols-2">
                  <TabsTrigger value="today">Today</TabsTrigger>
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                </TabsList>

                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by KEY code or member name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <TabsContent value="today" className="space-y-4 mt-4">
                {todayRecords.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No attendance records for today</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                            <Clock className="h-4 w-4 inline mr-2" />
                            Timestamp
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                            <User className="h-4 w-4 inline mr-2" />
                            Member Name
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                            <Key className="h-4 w-4 inline mr-2" />
                            Key Code
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                            <Filter className="h-4 w-4 inline mr-2" />
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {todayRecords.map((record) => (
                          <tr key={record.id} className="border-b hover:bg-accent/50 transition">
                            <td className="py-3 px-4 text-xs">
                              {new Date(record.timestamp).toLocaleTimeString()}
                            </td>
                            <td className="py-3 px-4">{record.member_name}</td>
                            <td className="py-3 px-4 font-mono text-sm">{record.key_code}</td>
                            <td className="py-3 px-4">{getStatusBadge(record.status)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="daily" className="space-y-4 mt-4">
                <div className="grid gap-3">
                  {filteredRecords.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No attendance records found</p>
                    </div>
                  ) : (
                    filteredRecords.map((record) => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/30 transition"
                      >
                        <div className="space-y-1 flex-1">
                          <div className="font-medium">{record.member_name}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            {new Date(record.timestamp).toLocaleString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-sm font-mono text-right">{record.key_code}</div>
                          {getStatusBadge(record.status)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {loading && <div className="text-center py-4 text-muted-foreground">Loading...</div>}
        </CardContent>
      </Card>
    </div>
  );
}
