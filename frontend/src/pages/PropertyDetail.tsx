import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, DollarSign, TrendingUp, Percent, Calendar, FileText, ExternalLink, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AnimatedSection from "@/components/AnimatedSection";
import OwnershipRing from "@/components/OwnershipRing";
import HealthBadge from "@/components/HealthBadge";
import InfoTooltip from "@/components/InfoTooltip";
import propertySample from "@/assets/property-sample.jpg";

const ownershipData = [
  { name: "Taylor", percentage: 30, color: "hsl(172, 66%, 30%)" },
  { name: "Owen", percentage: 25, color: "hsl(190, 90%, 50%)" },
  { name: "Rocky", percentage: 25, color: "hsl(38, 92%, 50%)" },
  { name: "Cole", percentage: 20, color: "hsl(280, 65%, 60%)" },
];

type DetailKey =
  | "current_salary_pool"
  | "deposit_goal"
  | "mortgage_rate"
  | "house_value";

const detailConfig = [
  { icon: DollarSign, label: "Current Salary Pool", key: "current_salary_pool" as DetailKey, health: "on-track" as const, tip: "Combined monthly income of all co-owners used to assess affordability.", format: (v: number) => `$${v.toLocaleString()}/mo`, parse: (s: string) => parseFloat(s.replace(/[^0-9.]/g, "")) || 0 },
  { icon: TrendingUp, label: "Deposit Goal", key: "deposit_goal" as DetailKey, health: "on-track" as const, tip: "Total deposit needed. Your team is at 68% — strong progress toward this target.", format: (v: number) => `$${v.toLocaleString()}`, parse: (s: string) => parseFloat(s.replace(/[^0-9.]/g, "")) || 0 },
  { icon: Percent, label: "Mortgage Rate", key: "mortgage_rate" as DetailKey, health: "caution" as const, tip: "Current estimated mortgage interest rate. Rates fluctuate — lock in when ready.", format: (v: number) => `${v}%`, parse: (s: string) => parseFloat(s.replace(/[^0-9.]/g, "")) || 0 },
  { icon: DollarSign, label: "House Value", key: "house_value" as DetailKey, health: "on-track" as const, tip: "Estimated property market value based on recent comparable sales.", format: (v: number) => `$${v.toLocaleString()}`, parse: (s: string) => parseFloat(s.replace(/[^0-9.]/g, "")) || 0 },
];

const milestones = [
  { date: "Jan 2026", event: "Partnership formed", done: true },
  { date: "Mar 2026", event: "Savings plan started", done: true },
  { date: "Jul 2026", event: "50% deposit reached", done: true },
  { date: "Nov 2026", event: "Pre-approval secured", done: false },
  { date: "Feb 2027", event: "Target closing date", done: false },
];

const HOUSE_ID = 1;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
const initialValues: Record<DetailKey, number> = {
  current_salary_pool: 0,
  deposit_goal: 0,
  mortgage_rate: 0,
  house_value: 0,
};

const PropertyDetail = () => {
  const [values, setValues] = useState(initialValues);
  const [hoveredDetailIndex, setHoveredDetailIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editInputValue, setEditInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const getValue = (key: DetailKey) => values[key];

  const startEditing = (i: number) => {
    const cfg = detailConfig[i];
    const raw = getValue(cfg.key);
    setEditInputValue(cfg.key === "mortgage_rate" ? String(raw) : String(Math.round(raw)));
    setEditingIndex(i);
  };

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/houses/${HOUSE_ID}/property-details`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch property details");
        }

        const data = await response.json();
        setValues({
          current_salary_pool: Number(data.current_salary_pool) || 0,
          deposit_goal: Number(data.deposit_goal) || 0,
          mortgage_rate: Number(data.mortgage_rate) || 0,
          house_value: Number(data.house_value) || 0,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPropertyDetails();
  }, []);

  const saveEdit = async () => {
    if (editingIndex === null) return;

    const cfg = detailConfig[editingIndex];
    const parsed = cfg.parse(editInputValue);

    if (!Number.isFinite(parsed) || parsed < 0) {
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/houses/${HOUSE_ID}/property-details`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [cfg.key]: parsed }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update property details");
      }

      const updated = await response.json();
      setValues({
        current_salary_pool: Number(updated.current_salary_pool) || 0,
        deposit_goal: Number(updated.deposit_goal) || 0,
        mortgage_rate: Number(updated.mortgage_rate) || 0,
        house_value: Number(updated.house_value) || 0,
      });
      setEditingIndex(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <AnimatedSection>
          <h1 className="text-3xl font-bold text-foreground">Property Details</h1>
          <p className="mt-1 text-muted-foreground">Edit property details & financials</p>
        </AnimatedSection>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Property Image & Info */}
          <AnimatedSection delay={0.1} className="lg:col-span-3">
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <motion.div
                className="relative aspect-video overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img
                  src={propertySample}
                  alt="Property"
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-card/90 backdrop-blur-sm px-4 py-2 text-sm font-medium text-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  1234 Oakwood Drive, Austin TX
                </div>
              </motion.div>

              <div className="grid grid-cols-2 gap-4 p-6">
                {detailConfig.map((d, i) => (
                  <motion.div
                    key={i}
                    className="relative rounded-xl bg-muted/50 p-4"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    onMouseEnter={() => setHoveredDetailIndex(i)}
                    onMouseLeave={() => setHoveredDetailIndex(null)}
                  >
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <d.icon className="h-4 w-4" />
                      <span className="text-xs">{d.label}</span>
                      <InfoTooltip content={d.tip} />
                    </div>
                    {editingIndex === i ? (
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <Input
                          type="text"
                          value={editInputValue}
                          onChange={(e) => setEditInputValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") void saveEdit();
                            if (e.key === "Escape") cancelEdit();
                          }}
                          className="h-9 w-full max-w-[140px] font-display text-lg"
                          autoFocus
                        />
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="h-8 px-2" onClick={() => void saveEdit()} disabled={isSaving}>
                            Save
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 px-2" onClick={cancelEdit}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-1 font-display text-xl font-bold text-foreground pr-10">{isLoading ? "..." : d.format(getValue(d.key))}</p>
                    )}
                    <div className="mt-1">
                      <HealthBadge status={d.health} />
                    </div>
                    {hoveredDetailIndex === i && editingIndex !== i && (
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg shadow-sm"
                        onClick={() => startEditing(i)}
                        aria-label={`Edit ${d.label}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-2">
            {/* Ownership */}
            <AnimatedSection delay={0.2}>
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-4 flex items-center gap-2">
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    Ownership Split
                  </h2>
                  <InfoTooltip content="Ownership shares are adjustable. Partners can renegotiate percentages as contributions change." />
                </div>
                <div className="flex justify-center">
                  <OwnershipRing shares={ownershipData} size={160} />
                </div>
                <div className="mt-4 space-y-2">
                  {ownershipData.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="text-foreground">{s.name}</span>
                      <span className="ml-auto font-medium text-muted-foreground">{s.percentage}%</span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Flexible ownership · Exit options available
                </p>
              </div>
            </AnimatedSection>

            {/* Timeline */}
            <AnimatedSection delay={0.3}>
              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-foreground">
                  <Calendar className="h-5 w-5 text-primary" />
                  Milestones
                </h2>
                <div className="relative space-y-4 pl-6">
                  <div className="absolute left-2.5 top-1 bottom-1 w-px bg-border" />
                  {milestones.map((m, i) => (
                    <motion.div
                      key={i}
                      className="relative flex items-start gap-3"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                    >
                      <div
                        className={`absolute -left-6 top-1 h-3 w-3 rounded-full border-2 ${
                          m.done
                            ? "border-primary bg-primary"
                            : "border-muted-foreground bg-card"
                        }`}
                      />
                      <div>
                        <p className={`text-sm font-medium ${m.done ? "text-foreground" : "text-muted-foreground"}`}>
                          {m.event}
                        </p>
                        <p className="text-xs text-muted-foreground">{m.date}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* Actions */}
            <AnimatedSection delay={0.4}>
              <div className="flex flex-col gap-3">
                <Button className="w-full gap-2 rounded-xl">
                  <FileText className="h-4 w-4" /> View Contract
                </Button>
                <p className="text-center text-xs text-muted-foreground">Review your co-ownership agreement and terms</p>
                <Button variant="outline" className="w-full gap-2 rounded-xl">
                  <ExternalLink className="h-4 w-4" /> Property Listing
                </Button>
                <p className="text-center text-xs text-muted-foreground">See the original listing with photos and specs</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
