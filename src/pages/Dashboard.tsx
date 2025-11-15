import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, BarChart, PieChart } from "lucide-react";

export default function Dashboard() {
  // Mock data for the dashboard
  const stats = [
    { name: 'Total Quizzes', value: '24', change: '+12%', changeType: 'positive' },
    { name: 'Average Score', value: '84%', change: '+5%', changeType: 'positive' },
    { name: 'Streak', value: '7 days', change: '+2', changeType: 'positive' },
    { name: 'Time Spent', value: '12h 45m', change: '-30m', changeType: 'negative' },
  ];

  const recentQuizzes = [
    { id: 1, category: 'Science', score: 92, date: '2023-11-15' },
    { id: 2, category: 'History', score: 78, date: '2023-11-14' },
    { id: 3, category: 'Technology', score: 85, date: '2023-11-13' },
  ];

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening with your learning.</p>
          </div>
          <Button className="w-full md:w-auto">Start New Quiz</Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 mt-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.name}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                  <span className={`text-sm ${
                    stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="mt-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="quizzes">My Quizzes</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Performance</CardTitle>
                  <CardDescription>Your quiz performance over time</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <LineChart className="mx-auto h-12 w-12 mb-2" />
                    <p>Performance chart will appear here</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Categories</CardTitle>
                  <CardDescription>Your performance by category</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <PieChart className="mx-auto h-12 w-12 mb-2" />
                    <p>Category distribution will appear here</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your most recent quiz attempts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentQuizzes.map((quiz) => (
                    <div key={quiz.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <p className="font-medium">{quiz.category} Quiz</p>
                        <p className="text-sm text-muted-foreground">
                          Completed on {new Date(quiz.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{quiz.score}%</p>
                        <p className="text-sm text-muted-foreground">Score</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="quizzes" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>My Quiz History</CardTitle>
                <CardDescription>View and manage your quiz attempts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <BarChart className="mx-auto h-12 w-12 mb-2" />
                    <p>Your quiz history will appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="achievements" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
                <CardDescription>Your learning milestones and badges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">Your achievements will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
