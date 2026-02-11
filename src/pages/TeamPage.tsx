import { motion } from "framer-motion";
import { Plus, Star, Building2, Mail, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";

const members = [
  { name: "Taylor", role: "Lead Partner", initials: "TA", color: "hsl(172, 66%, 30%)", contribution: "$24,000" },
  { name: "Owen", role: "Co-Owner", initials: "OW", color: "hsl(190, 90%, 50%)", contribution: "$18,500" },
  { name: "Rocky", role: "Co-Owner", initials: "RO", color: "hsl(38, 92%, 50%)", contribution: "$16,200" },
  { name: "Cole", role: "Co-Owner", initials: "CO", color: "hsl(280, 65%, 60%)", contribution: "$12,800" },
];

const TeamPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <AnimatedSection>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Team</h1>
              <p className="mt-1 text-muted-foreground">Manage your co-ownership group</p>
            </div>
            <Button className="gap-2 rounded-xl">
              <Plus className="h-4 w-4" /> Add Member
            </Button>
          </div>
        </AnimatedSection>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <motion.div
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 text-center hover-lift"
                whileHover={{ borderColor: member.color }}
              >
                <button className="absolute right-3 top-3 rounded-lg p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100">
                  <MoreHorizontal className="h-4 w-4" />
                </button>

                <motion.div
                  className="mx-auto flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold"
                  style={{ backgroundColor: member.color, color: "white" }}
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {member.initials}
                </motion.div>

                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>

                <div className="mt-4 rounded-xl bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Total Contributed</p>
                  <p className="font-display text-lg font-bold text-foreground">{member.contribution}</p>
                </div>

                <div className="mt-4 flex items-center justify-center gap-2">
                  <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                    <Mail className="h-3.5 w-3.5" /> Message
                  </Button>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        {/* Actions */}
        <AnimatedSection delay={0.5} className="mt-8">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="gap-2 rounded-xl">
              <Star className="h-4 w-4" /> Manage Partnership
            </Button>
            <Button variant="outline" className="gap-2 rounded-xl">
              <Building2 className="h-4 w-4" /> Propose House
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default TeamPage;
