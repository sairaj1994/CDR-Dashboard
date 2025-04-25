
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CDRSummary } from "@/types";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VisualizeDataProps {
  summary: CDRSummary | null;
  isLoading: boolean;
}

export const VisualizeData = ({ summary, isLoading }: VisualizeDataProps) => {
  const COLORS = ["#3498DB", "#2ECC71", "#E74C3C", "#F39C12", "#9B59B6", "#1ABC9C"];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-white">
            <CardHeader className="pb-2">
              <div className="h-5 bg-gray-200 rounded w-32 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
                <div className="h-20 w-20 bg-gray-200 rounded-full animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-500">No data available for visualization</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{summary.total_calls}</div>
              <div className="p-3 bg-blue-light/10 rounded-full">
                <div className="h-8 w-8 rounded-full bg-blue-light flex items-center justify-center text-white">
                  📞
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                {Math.floor(summary.total_duration / 60)}m {summary.total_duration % 60}s
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <div className="h-8 w-8 rounded-full bg-callSuccess flex items-center justify-center text-white">
                  ⏱️
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Average Call Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                {Math.floor(summary.avg_duration / 60)}m {summary.avg_duration % 60}s
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <div className="h-8 w-8 rounded-full bg-callOngoing flex items-center justify-center text-white">
                  📊
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="w-full mb-4 bg-white">
          <TabsTrigger value="timeline" className="flex-1">Call Timeline</TabsTrigger>
          <TabsTrigger value="users" className="flex-1">Top Users</TabsTrigger>
          <TabsTrigger value="duration" className="flex-1">Duration Distribution</TabsTrigger>
        </TabsList>
        
        <TabsContent value="timeline">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Call Volume Over Time</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={summary.calls_by_day} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#3498DB" name="Number of Calls" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Top Users by Call Count</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={summary.top_users} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <XAxis dataKey="username" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="call_count" name="Number of Calls" fill="#2C3E50">
                      {summary.top_users.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="duration">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Call Duration Distribution</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={summary.call_duration_distribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="range"
                      label={({ range, percent }) => `${range}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {summary.call_duration_distribution.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VisualizeData;
