import { motion } from "framer-motion";
import { Home, TrendingUp, Wallet, Target, ArrowUpRight, BarChart3 } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import OwnershipRing from "@/components/OwnershipRing";
import ActivityFeed from "@/components/ActivityFeed";
import ProgressBar from "@/components/ProgressBar";

const ownershipData = [
  { name: "Taylor", percentage: 30, color: "hsl(172, 66%, 30%)" },
  { name: "Owen", percentage: 25, color: "hsl(190, 90%, 50%)" },
  { name: "Rocky", percentage: 25, color: "hsl(38, 92%, 50%)" },
  { name: "Cole", percentage: 20, color: "hsl(280, 65%, 60%)" },
];

const metrics = [
  { label: "Property Value", value: "$485,000", change: "+2.3%", icon: Home, positive: true },
  { label: "Your Equity", value: "$36,750", change: "+$2,400", icon: TrendingUp, positive: true },
  { label: "Monthly Payment", value: "$1,240", change: "Due in 12d", icon: Wallet, positive: false },
  { label: "Deposit Goal", value: "68%", change: "$32,400 left", icon: Target, positive: true },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <AnimatedSection>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="mt-1 text-muted-foreground">Track your co-ownership progress</p>
          </div>
        </AnimatedSection>

        {/* Metrics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m, i) => (
            <AnimatedSection key={i} delay={i * 0.08}>
              <motion.div
                className="rounded-2xl border border-border bg-card p-5 hover-lift"
                whileHover={{ borderColor: "hsl(172, 66%, 30%)" }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <m.icon className="h-5 w-5" />
                  </div>
                  {m.positive && (
                    <span className="flex items-center gap-0.5 text-xs font-medium text-success">
                      <ArrowUpRight className="h-3 w-3" /> {m.change}
                    </span>
                  )}
                  {!m.positive && (
                    <span className="text-xs text-muted-foreground">{m.change}</span>
                  )}
                </div>
                <p className="mt-4 font-display text-2xl font-bold text-foreground">{m.value}</p>
                <p className="text-sm text-muted-foreground">{m.label}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Ownership Ring */}
          <AnimatedSection delay={0.1} className="lg:col-span-1">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-6 flex items-center gap-2 font-display text-lg font-semibold text-foreground">
                <BarChart3 className="h-5 w-5 text-primary" />
                Ownership Breakdown
              </h2>
              <div className="flex flex-col items-center gap-6">
                <OwnershipRing shares={ownershipData} size={180} />
                <div className="grid w-full grid-cols-2 gap-3">
                  {ownershipData.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="text-sm text-foreground">{s.name}</span>
                      <span className="ml-auto text-sm font-medium text-muted-foreground">{s.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Activity Feed */}
          <AnimatedSection delay={0.2} className="lg:col-span-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
                Recent Activity
              </h2>
              <ActivityFeed />
            </div>
          </AnimatedSection>
        </div>

        {/* Progress */}
        <AnimatedSection delay={0.3} className="mt-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-6 font-display text-lg font-semibold text-foreground">
              Savings Progress
            </h2>
            <div className="space-y-6">
              <ProgressBar label="Deposit Goal" current={65600} goal={97000} color="bg-primary" />
              <ProgressBar label="Legal & Closing Costs" current={4200} goal={8500} color="bg-accent" />
              <ProgressBar label="Emergency Fund" current={3100} goal={10000} color="bg-warning" />
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Dashboard;
