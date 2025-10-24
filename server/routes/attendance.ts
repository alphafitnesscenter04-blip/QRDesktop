import type { RequestHandler } from "express";

export const listAttendance: RequestHandler = async (_req, res) => {
  // Mock attendance data - in production this would query Supabase
  const mockData = [
    {
      id: "1",
      timestamp: new Date().toISOString(),
      member_name: "Member KEY-A466HMGO",
      key_code: "KEY-A466HMGO",
      status: "active" as const,
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 60000).toISOString(),
      member_name: "Unknown",
      key_code: "Unknown",
      status: "unknown" as const,
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 120000).toISOString(),
      member_name: "Member KEY-A466HMGO",
      key_code: "KEY-A466HMGO",
      status: "active" as const,
    },
  ];

  res.json({ items: mockData });
};
