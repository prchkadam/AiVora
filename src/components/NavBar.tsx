import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, Trophy, HelpCircle, LogIn, UserPlus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Category } from "@/pages/Index";

interface NavBarProps {
  onCategoryChange?: (category: Category) => void;
  selectedCategory?: Category;
}

const categories: { value: Category; label: string }[] = [
  { value: "science", label: "Science" },
  { value: "history", label: "History" },
  { value: "geography", label: "Geography" },
  { value: "sports", label: "Sports" },
  { value: "general", label: "General" },
  { value: "technology", label: "Technology" },
  { value: "space-astronomy", label: "Space & Astronomy" },
  { value: "arts-creativity", label: "Arts & Creativity" },
  { value: "logic-brain-games", label: "Logic & Brain Games" },
  { value: "business", label: "Business" },
  { value: "health", label: "Health" },
  { value: "literature", label: "Literature" },
  { value: "philosophy", label: "Philosophy" },
  { value: "environment", label: "Environment" },
  { value: "politics", label: "Politics" },
  { value: "food", label: "Food & Cuisine" },
  { value: "cinema", label: "Cinema" },
  { value: "mythology", label: "Mythology" },
  { value: "psychology", label: "Psychology" },
];

const leaderboardData = {
  overall: [
    { name: "Ava Chen", score: 986, meta: "Avg. 94% accuracy", streak: 9 },
    { name: "Liam Park", score: 958, meta: "Hard • Science", streak: 7 },
    { name: "Maya Patel", score: 942, meta: "Medium • Technology", streak: 6 },
  ],
  recent7: [
    { name: "Ethan Brooks", score: 910, meta: "+45 vs last week", streak: 5 },
    { name: "Sophia Reyes", score: 898, meta: "Perfect streak", streak: 7 },
    { name: "Noah Bennett", score: 884, meta: "Fastest completion", streak: 4 },
  ],
  recent30: [
    { name: "Ivy Turner", score: 970, meta: "30-day peak", streak: 12 },
    { name: "Caleb Morris", score: 954, meta: "+80 growth", streak: 10 },
    { name: "Zoe Hayes", score: 940, meta: "Consistent top 5", streak: 11 },
  ],
  categories: [
    { name: "Nate Rivers", category: "Science", difficulty: "Hard", score: 930 },
    { name: "Lola Kim", category: "Arts", difficulty: "Medium", score: 912 },
    { name: "Iris Stone", category: "Space", difficulty: "Hard", score: 905 },
    { name: "Ben Carter", category: "Logic", difficulty: "Easy", score: 898 },
  ],
  streaks: [
    { name: "Jackson Lee", days: 18, category: "Technology" },
    { name: "Priya Desai", days: 15, category: "History" },
    { name: "Oliver Watts", days: 12, category: "Sports" },
  ],
};

export function NavBar({ onCategoryChange, selectedCategory }: NavBarProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  const renderScoreList = (
    entries: { name: string; score?: number; meta?: string; streak?: number }[],
  ) => (
    <div className="space-y-3">
      {entries.map((entry, index) => (
        <div
          key={`${entry.name}-${index}`}
          className="flex items-center justify-between rounded-2xl border border-white/5 bg-background/50 px-4 py-3 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="text-sm font-semibold text-muted-foreground">#{index + 1}</div>
            <div>
              <p className="font-semibold text-white">{entry.name}</p>
              {entry.meta && (
                <p className="text-xs text-muted-foreground">{entry.meta}</p>
              )}
            </div>
          </div>
          <div className="text-right">
            {typeof entry.score !== "undefined" && (
              <p className="text-lg font-bold text-primary">{entry.score}</p>
            )}
            {entry.streak && (
              <p className="text-xs text-muted-foreground">{entry.streak} day streak</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-primary to-secondary backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <a href="/">
          <div className="flex items-center gap-2">
            <img src="/favicon.ico" alt="AiVora logo" className="w-7 h-7" />
            <span className="text-xl font-bold text-white">AiVora</span>
          </div>
        </a>

        {/* Center Nav Items */}
        <nav className="flex items-center gap-4">
          {/* Categories Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-1 hover:bg-background/10">
                Categories
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="bg-background/50">
              {categories.map((cat) => (
                <DropdownMenuItem
                  key={cat.value}
                  onClick={() => onCategoryChange?.(cat.value)}
                  className="hover:bg-background/10"
                >
                  {cat.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Leaderboard */}
          <Dialog open={isLeaderboardOpen} onOpenChange={setIsLeaderboardOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="gap-2 hover:bg-background/10">
                <Trophy className="w-4 h-4" />
                Leaderboard
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl bg-background/80 backdrop-blur border border-white/10">
              <DialogHeader>
                <DialogTitle>Global Leaderboards</DialogTitle>
                <p className="text-sm text-muted-foreground">
                  See who's leading overall, recently, and across categories.
                </p>
              </DialogHeader>
              <Tabs defaultValue="overall" className="w-full mt-4">
                <TabsList className="flex flex-wrap gap-2 bg-background/30 p-1 rounded-xl">
                  <TabsTrigger value="overall">Top Overall</TabsTrigger>
                  <TabsTrigger value="recent7">Last 7 Days</TabsTrigger>
                  <TabsTrigger value="recent30">Last 30 Days</TabsTrigger>
                  <TabsTrigger value="categories">Categories</TabsTrigger>
                  <TabsTrigger value="streaks">Streaks</TabsTrigger>
                </TabsList>
                <TabsContent value="overall" className="mt-6">
                  {renderScoreList(leaderboardData.overall)}
                </TabsContent>
                <TabsContent value="recent7" className="mt-6">
                  {renderScoreList(leaderboardData.recent7)}
                </TabsContent>
                <TabsContent value="recent30" className="mt-6">
                  {renderScoreList(leaderboardData.recent30)}
                </TabsContent>
                <TabsContent value="categories" className="mt-6 space-y-3">
                  {leaderboardData.categories.map((entry, index) => (
                    <div
                      key={`${entry.name}-${entry.category}`}
                      className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/5 bg-background/50 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-semibold text-muted-foreground">#{index + 1}</div>
                        <div>
                          <p className="font-semibold text-white">{entry.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {entry.category} · {entry.difficulty}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">{entry.score}</p>
                        {selectedCategory && selectedCategory === entry.category.toLowerCase() && (
                          <p className="text-xs text-emerald-400">Current pick</p>
                        )}
                      </div>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="streaks" className="mt-6 space-y-3">
                  {leaderboardData.streaks.map((entry, index) => (
                    <div
                      key={`${entry.name}-${entry.days}`}
                      className="flex items-center justify-between rounded-2xl border border-white/5 bg-background/50 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-semibold text-muted-foreground">#{index + 1}</div>
                        <div>
                          <p className="font-semibold text-white">{entry.name}</p>
                          <p className="text-xs text-muted-foreground">{entry.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-secondary">{entry.days} days</p>
                        <p className="text-xs text-muted-foreground">Active streak</p>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>

          {/* Contact Support */}
          <Button variant="ghost" className="gap-2 hover:bg-background/10">
            <HelpCircle className="w-4 h-4" />
            Contact Support
          </Button>
        </nav>

        {/* Right Side: Login/Signup */}
        <div className="flex items-center gap-2">
          {/* Login Dialog */}
          <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="gap-2 hover:bg-background/10">
                <LogIn className="w-4 h-4" />
                Login
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-background/50">
              <DialogHeader>
                <DialogTitle>Login to AiVora</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="login-email" className="text-white">
                    Email
                  </Label>
                  <Input id="login-email" type="email" placeholder="you@example.com" className="bg-background/10" />
                </div>
                <div>
                  <Label htmlFor="login-password" className="text-white">
                    Password
                  </Label>
                  <Input id="login-password" type="password" placeholder="••••••••" className="bg-background/10" />
                </div>
                <Button className="w-full bg-gradient-to-r from-primary to-secondary text-white">
                  Login
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Signup Dialog */}
          <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-primary to-secondary text-white">
                <UserPlus className="w-4 h-4" />
                Sign Up
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Sign Up for AiVora</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="signup-name">Name</Label>
                  <Input id="signup-name" placeholder="Your name" />
                </div>
                <div>
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" type="email" placeholder="you@example.com" />
                </div>
                <div>
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" type="password" placeholder="••••••••" />
                </div>
                <Button className="w-full bg-gradient-to-r from-primary to-secondary text-white">
                  Sign Up
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}