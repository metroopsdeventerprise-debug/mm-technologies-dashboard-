import React, { useState, useMemo } from "react";
import {
  LayoutDashboard,
  Users,
  Boxes,
  Route as RouteIcon,
  RefreshCcw,
  Truck,
  ChevronDown,
  CircleCheck,
  CircleAlert,
  CircleX,
  Wrench,
  DollarSign,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ---------- Design tokens ----------
const C = {
  bg: "#12161A",
  panel: "#1A2027",
  panelAlt: "#20272F",
  border: "#2B333B",
  borderLight: "#39424B",
  text: "#ECE8E1",
  muted: "#8B94A0",
  amber: "#C68A3D",
  amberSoft: "#3A2E1C",
  teal: "#5C9C8A",
  tealSoft: "#1D2E2A",
  red: "#C0594B",
  redSoft: "#332120",
  blue: "#6B93B5",
  blueSoft: "#1E2830",
};

// ---------- Mock seed data ----------
const initialRegions = [
  {
    id: "dc",
    name: "D.C. Area HQ",
    manager: "R. Coleman",
    machines: [
      { id: "DC-01", site: "Howard University — Student Center", status: "operational", stock: 88, lastService: "Sep 12", weeklyRevenue: 210, monthlyRevenue: 840 },
      { id: "DC-02", site: "Union Market Food Hall", status: "low-stock", stock: 22, lastService: "Sep 9", weeklyRevenue: 340, monthlyRevenue: 1310 },
      { id: "DC-03", site: "Anacostia Rec Center", status: "operational", stock: 71, lastService: "Sep 13", weeklyRevenue: 165, monthlyRevenue: 640 },
    ],
  },
  {
    id: "md",
    name: "Maryland Area HQ",
    manager: "T. Ibe",
    machines: [
      { id: "MD-01", site: "Prince George's Community College", status: "needs-service", stock: 40, lastService: "Sep 5", weeklyRevenue: 120, monthlyRevenue: 510 },
      { id: "MD-02", site: "National Harbor — Waterfront", status: "operational", stock: 95, lastService: "Sep 14", weeklyRevenue: 385, monthlyRevenue: 1490 },
      { id: "MD-03", site: "Silver Spring Transit Center", status: "operational", stock: 63, lastService: "Sep 11", weeklyRevenue: 245, monthlyRevenue: 960 },
    ],
  },
  {
    id: "va",
    name: "Virginia Area HQ",
    manager: "M. Okafor",
    machines: [
      { id: "VA-01", site: "Old Town Alexandria — Gym", status: "offline", stock: 0, lastService: "Sep 3", weeklyRevenue: 0, monthlyRevenue: 380 },
      { id: "VA-02", site: "Tysons Corner — Office Park", status: "operational", stock: 80, lastService: "Sep 13", weeklyRevenue: 410, monthlyRevenue: 1580 },
      { id: "VA-03", site: "George Mason University", status: "low-stock", stock: 18, lastService: "Sep 8", weeklyRevenue: 190, monthlyRevenue: 720 },
    ],
  },
];

const initialPersonnel = [
  { id: 1, name: "R. Coleman", region: "dc", role: "Regional Manager", status: "available", assigned: "All D.C. sites" },
  { id: 2, name: "J. Farley", region: "dc", role: "Route Technician", status: "on-route", assigned: "DC-01, DC-02" },
  { id: 3, name: "T. Ibe", region: "md", role: "Regional Manager", status: "available", assigned: "All MD sites" },
  { id: 4, name: "S. Nguyen", region: "md", role: "Route Technician", status: "needs-coverage", assigned: "MD-01, MD-03" },
  { id: 5, name: "M. Okafor", region: "va", role: "Regional Manager", status: "off", assigned: "All VA sites" },
  { id: 6, name: "D. Brackett", region: "va", role: "Route Technician", status: "on-route", assigned: "VA-01, VA-02, VA-03" },
];

const initialSupply = [
  { id: 1, region: "dc", product: "Eleven86 Water", onHand: 34, threshold: 40, status: "reorder" },
  { id: 2, region: "dc", product: "Protein Bars — Mixed", onHand: 58, threshold: 30, status: "ok" },
  { id: 3, region: "md", product: "Eleven86 Water", onHand: 61, threshold: 40, status: "ok" },
  { id: 4, region: "md", product: "Sparkling Water — Citrus", onHand: 12, threshold: 25, status: "ordered" },
  { id: 5, region: "va", product: "Eleven86 Water", onHand: 8, threshold: 40, status: "reorder" },
  { id: 6, region: "va", product: "Trail Mix — Wellness Blend", onHand: 45, threshold: 30, status: "ok" },
];

const vendors = [
  { id: 1, name: "Eleven86 Water", category: "Beverage — Flagship Partner", regions: "DC / MD / VA", status: "active" },
  { id: 2, name: "Greenline Wholesale Foods", category: "Snacks & Wellness Bars", regions: "DC / MD", status: "active" },
  { id: 3, name: "Piedmont Distribution Co.", category: "Cold Beverage — Backup Supplier", regions: "VA", status: "pending" },
  { id: 4, name: "Capital Vend Parts & Service", category: "Machine Maintenance / Parts", regions: "DC / MD / VA", status: "active" },
];

const routeForecast = [
  { region: "D.C.", daily: 92, weekly: 88, monthly: 95 },
  { region: "Maryland", daily: 78, weekly: 84, monthly: 90 },
  { region: "Virginia", daily: 61, weekly: 70, monthly: 82 },
];

// ---------- Small UI helpers ----------
function StatusPill({ status }) {
  const map = {
    operational: { label: "Operational", color: C.teal, bg: C.tealSoft, Icon: CircleCheck },
    "low-stock": { label: "Low Stock", color: C.amber, bg: C.amberSoft, Icon: CircleAlert },
    "needs-service": { label: "Needs Service", color: C.amber, bg: C.amberSoft, Icon: Wrench },
    offline: { label: "Offline", color: C.red, bg: C.redSoft, Icon: CircleX },
    available: { label: "Available", color: C.teal, bg: C.tealSoft, Icon: CircleCheck },
    "on-route": { label: "On Route", color: C.blue, bg: C.blueSoft, Icon: RouteIcon },
    "needs-coverage": { label: "Needs Coverage", color: C.red, bg: C.redSoft, Icon: CircleAlert },
    off: { label: "Off Shift", color: C.muted, bg: C.panelAlt, Icon: CircleX },
    ok: { label: "OK", color: C.teal, bg: C.tealSoft, Icon: CircleCheck },
    reorder: { label: "Reorder Needed", color: C.red, bg: C.redSoft, Icon: CircleAlert },
    ordered: { label: "Ordered", color: C.blue, bg: C.blueSoft, Icon: Truck },
    active: { label: "Active", color: C.teal, bg: C.tealSoft, Icon: CircleCheck },
    pending: { label: "Pending", color: C.amber, bg: C.amberSoft, Icon: CircleAlert },
  };
  const m = map[status] || map.ok;
  const { Icon } = m;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        color: m.color,
        background: m.bg,
        border: `1px solid ${m.color}33`,
        whiteSpace: "nowrap",
      }}
    >
      <Icon size={13} strokeWidth={2.5} />
      {m.label}
    </span>
  );
}

function Card({ children, style }) {
  return (
    <div
      style={{
        background: C.panel,
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        padding: 20,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children, sub }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 19, fontWeight: 600, color: C.text, margin: 0 }}>
        {children}
      </h2>
      {sub && <p style={{ fontSize: 13, color: C.muted, margin: "4px 0 0" }}>{sub}</p>}
    </div>
  );
}

function Select({ value, onChange, options }) {
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <select
        value={value}
        onChange={onChange}
        style={{
          appearance: "none",
          background: C.panelAlt,
          color: C.text,
          border: `1px solid ${C.borderLight}`,
          borderRadius: 6,
          padding: "5px 28px 5px 10px",
          fontSize: 12.5,
          fontFamily: "inherit",
          cursor: "pointer",
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o.replace("-", " ")}
          </option>
        ))}
      </select>
      <ChevronDown size={13} style={{ position: "absolute", right: 8, top: 7, color: C.muted, pointerEvents: "none" }} />
    </div>
  );
}

// ---------- Main App ----------
export default function MMTechnologiesDashboard() {
  const [tab, setTab] = useState("overview");
  const [regions, setRegions] = useState(initialRegions);
  const [personnel, setPersonnel] = useState(initialPersonnel);
  const [supply, setSupply] = useState(initialSupply);

  const allMachines = useMemo(() => regions.flatMap((r) => r.machines.map((m) => ({ ...m, region: r.name }))), [regions]);
  const flagged = allMachines.filter((m) => m.status !== "operational").length;
  const coverageGaps = personnel.filter((p) => p.status === "needs-coverage").length;
  const reorderCount = supply.filter((s) => s.status === "reorder").length;
  const totalWeeklyRevenue = allMachines.reduce((sum, m) => sum + m.weeklyRevenue, 0);
  const regionRevenue = useMemo(
    () =>
      regions.map((r) => ({
        region: r.name.replace(" Area HQ", ""),
        weekly: r.machines.reduce((s, m) => s + m.weeklyRevenue, 0),
        monthly: r.machines.reduce((s, m) => s + m.monthlyRevenue, 0),
      })),
    [regions]
  );
  const rankedMachines = useMemo(() => [...allMachines].sort((a, b) => b.weeklyRevenue - a.weeklyRevenue), [allMachines]);

  function serviceMachine(regionId, machineId) {
    setRegions((prev) =>
      prev.map((r) =>
        r.id !== regionId
          ? r
          : {
              ...r,
              machines: r.machines.map((m) =>
                m.id !== machineId ? m : { ...m, status: "operational", stock: 100, lastService: "Today" }
              ),
            }
      )
    );
  }

  function setPersonnelStatus(id, status) {
    setPersonnel((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  }

  function markOrdered(id) {
    setSupply((prev) => prev.map((s) => (s.id === id ? { ...s, status: "ordered" } : s)));
  }

  const navItems = [
    { id: "overview", label: "Overview", Icon: LayoutDashboard },
    { id: "revenue", label: "Revenue", Icon: DollarSign },
    { id: "personnel", label: "Personnel", Icon: Users },
    { id: "machines", label: "Machine Health", Icon: Boxes },
    { id: "routes", label: "Route Coverage", Icon: RouteIcon },
    { id: "supply", label: "Reorder & Supply", Icon: RefreshCcw },
    { id: "vendors", label: "Vendors", Icon: Truck },
  ];

  return (
    <div
      style={{
        display: "flex",
        minHeight: 640,
        background: C.bg,
        color: C.text,
        fontFamily: "'Inter', sans-serif",
        borderRadius: 12,
        overflow: "hidden",
        border: `1px solid ${C.border}`,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
      `}</style>

      {/* Sidebar */}
      <div style={{ width: 208, background: C.panelAlt, borderRight: `1px solid ${C.border}`, padding: "20px 14px", flexShrink: 0 }}>
        <div style={{ marginBottom: 26, paddingLeft: 4 }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: 0.2 }}>
            M&M <span style={{ color: C.amber }}>Technologies</span>
          </div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>DMV Pilot — 3 Regions</div>
        </div>
        {navItems.map(({ id, label, Icon }) => {
          const activeTab = tab === id;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "9px 10px",
                marginBottom: 3,
                borderRadius: 7,
                border: "none",
                background: activeTab ? C.panel : "transparent",
                color: activeTab ? C.amber : C.muted,
                fontSize: 13.5,
                fontWeight: 500,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <Icon size={16} strokeWidth={2} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: 26, overflowY: "auto" }}>
        {tab === "overview" && (
          <>
            <SectionTitle sub="D.C. / Maryland / Virginia — 9 machines across 3 regional HQs">Beta Pilot Overview</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 22 }}>
              {[
                { label: "Weekly Revenue", value: `$${totalWeeklyRevenue.toLocaleString()}`, note: "fleet-wide, 9 machines", color: C.amber },
                { label: "Regions Live", value: "3", note: "DC · MD · VA" },
                { label: "Machines Flagged", value: flagged, note: "needs attention", color: flagged ? C.red : C.teal },
                { label: "Reorders Pending", value: reorderCount, note: "below threshold", color: reorderCount ? C.amber : C.teal },
              ].map((k) => (
                <Card key={k.label}>
                  <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>{k.label}</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, color: k.color || C.text }}>
                    {k.value}
                  </div>
                  <div style={{ fontSize: 11.5, color: C.muted, marginTop: 4 }}>{k.note}</div>
                </Card>
              ))}
            </div>

            <Card style={{ marginBottom: 22 }}>
              <SectionTitle sub="Percent of scheduled visits completed on time, by cadence">Route Coverage by Region</SectionTitle>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={routeForecast} barGap={6}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                  <XAxis dataKey="region" tick={{ fill: C.muted, fontSize: 12 }} axisLine={{ stroke: C.border }} tickLine={false} />
                  <YAxis tick={{ fill: C.muted, fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={{ background: C.panelAlt, border: `1px solid ${C.borderLight}`, borderRadius: 8, fontSize: 12.5 }} />
                  <Bar dataKey="daily" name="Daily" fill={C.blue} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="weekly" name="Weekly" fill={C.teal} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="monthly" name="Monthly" fill={C.amber} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <SectionTitle>Needs Attention</SectionTitle>
              {allMachines.filter((m) => m.status !== "operational").map((m) => (
                <div
                  key={m.id}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: `1px solid ${C.border}` }}
                >
                  <div>
                    <span style={{ fontWeight: 600, fontSize: 13.5 }}>{m.id}</span>
                    <span style={{ color: C.muted, fontSize: 13, marginLeft: 8 }}>{m.site} — {m.region}</span>
                  </div>
                  <StatusPill status={m.status} />
                </div>
              ))}
            </Card>
          </>
        )}

        {tab === "revenue" && (
          <>
            <SectionTitle sub="Weekly and monthly revenue by region, and by machine">Revenue Tracking</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 18 }}>
              {regionRevenue.map((r) => (
                <Card key={r.region}>
                  <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>{r.region}</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700 }}>
                    ${r.weekly.toLocaleString()}<span style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}> /wk</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: C.muted, marginTop: 4 }}>${r.monthly.toLocaleString()} this month</div>
                </Card>
              ))}
            </div>
            <Card style={{ marginBottom: 16 }}>
              <SectionTitle>Weekly Revenue by Region</SectionTitle>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={regionRevenue} barGap={6}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                  <XAxis dataKey="region" tick={{ fill: C.muted, fontSize: 12 }} axisLine={{ stroke: C.border }} tickLine={false} />
                  <YAxis tick={{ fill: C.muted, fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    contentStyle={{ background: C.panelAlt, border: `1px solid ${C.borderLight}`, borderRadius: 8, fontSize: 12.5 }}
                    formatter={(v) => [`$${v}`, "Weekly Revenue"]}
                  />
                  <Bar dataKey="weekly" name="Weekly Revenue" fill={C.amber} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card>
              <SectionTitle>Machines Ranked by Weekly Revenue</SectionTitle>
              {rankedMachines.map((m, i) => (
                <div key={m.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderTop: i === 0 ? "none" : `1px solid ${C.border}` }}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: 13.5 }}>{m.id}</span>
                    <span style={{ color: C.muted, fontSize: 13, marginLeft: 8 }}>{m.site} — {m.region}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{ fontSize: 13, color: C.muted }}>${m.monthlyRevenue.toLocaleString()}/mo</span>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: m.weeklyRevenue === 0 ? C.red : C.amber }}>
                      ${m.weeklyRevenue.toLocaleString()}/wk
                    </span>
                  </div>
                </div>
              ))}
            </Card>
          </>
        )}

        {tab === "personnel" && (
          <>
            <SectionTitle sub="Availability, readiness, scheduling, and tasking across all regions">Personnel Management</SectionTitle>
            <Card>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
                <thead>
                  <tr style={{ textAlign: "left", color: C.muted, fontSize: 11.5, textTransform: "uppercase" }}>
                    <th style={{ padding: "0 0 10px" }}>Name</th>
                    <th>Region</th>
                    <th>Role</th>
                    <th>Assignment</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {personnel.map((p) => (
                    <tr key={p.id} style={{ borderTop: `1px solid ${C.border}` }}>
                      <td style={{ padding: "10px 0", fontWeight: 600 }}>{p.name}</td>
                      <td style={{ color: C.muted }}>{p.region.toUpperCase()}</td>
                      <td style={{ color: C.muted }}>{p.role}</td>
                      <td style={{ color: C.muted }}>{p.assigned}</td>
                      <td><StatusPill status={p.status} /></td>
                      <td>
                        <Select
                          value={p.status}
                          onChange={(e) => setPersonnelStatus(p.id, e.target.value)}
                          options={["available", "on-route", "needs-coverage", "off"]}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </>
        )}

        {tab === "machines" && (
          <>
            <SectionTitle sub="Live status, stock level, and last service date for every machine">Machine Health & Supply</SectionTitle>
            {regions.map((r) => (
              <Card key={r.id} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ fontWeight: 600 }}>{r.name}</div>
                  <div style={{ color: C.muted, fontSize: 12.5 }}>Manager: {r.manager}</div>
                </div>
                {r.machines.map((m) => (
                  <div key={m.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderTop: `1px solid ${C.border}` }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13.5 }}>{m.id} <span style={{ color: C.muted, fontWeight: 400 }}>— {m.site}</span></div>
                      <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>Last serviced: {m.lastService}</div>
                    </div>
                    <div style={{ width: 120, marginRight: 16 }}>
                      <div style={{ height: 6, background: C.panelAlt, borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${m.stock}%`, height: "100%", background: m.stock < 30 ? C.red : m.stock < 60 ? C.amber : C.teal }} />
                      </div>
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{m.stock}% stocked</div>
                    </div>
                    <div style={{ width: 78, marginRight: 16, textAlign: "right" }}>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14, color: m.weeklyRevenue === 0 ? C.red : C.text }}>
                        ${m.weeklyRevenue}
                      </div>
                      <div style={{ fontSize: 10.5, color: C.muted }}>this week</div>
                    </div>
                    <div style={{ marginRight: 16 }}>
                      <StatusPill status={m.status} />
                    </div>
                    <button
                      onClick={() => serviceMachine(r.id, m.id)}
                      style={{
                        background: "transparent",
                        border: `1px solid ${C.borderLight}`,
                        color: C.text,
                        borderRadius: 6,
                        padding: "5px 10px",
                        fontSize: 12,
                        cursor: "pointer",
                      }}
                    >
                      Mark Serviced
                    </button>
                  </div>
                ))}
              </Card>
            ))}
          </>
        )}

        {tab === "routes" && (
          <>
            <SectionTitle sub="Daily, weekly, and monthly visit completion, with next-due forecast">Route Coverage & Forecast</SectionTitle>
            <Card style={{ marginBottom: 16 }}>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={routeForecast} barGap={6}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                  <XAxis dataKey="region" tick={{ fill: C.muted, fontSize: 12 }} axisLine={{ stroke: C.border }} tickLine={false} />
                  <YAxis tick={{ fill: C.muted, fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={{ background: C.panelAlt, border: `1px solid ${C.borderLight}`, borderRadius: 8, fontSize: 12.5 }} />
                  <Bar dataKey="daily" name="Daily %" fill={C.blue} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="weekly" name="Weekly %" fill={C.teal} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="monthly" name="Monthly %" fill={C.amber} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card>
              <SectionTitle>Next Visit Due</SectionTitle>
              {allMachines.map((m) => (
                <div key={m.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: `1px solid ${C.border}`, fontSize: 13.5 }}>
                  <span style={{ fontWeight: 600 }}>{m.id}</span>
                  <span style={{ color: C.muted }}>{m.site}</span>
                  <span style={{ color: m.stock < 30 ? C.red : C.muted }}>
                    {m.stock < 30 ? "Due now — low stock" : m.stock < 60 ? "Due within 3 days" : "On schedule"}
                  </span>
                </div>
              ))}
            </Card>
          </>
        )}

        {tab === "supply" && (
          <>
            <SectionTitle sub="Product stock levels vs. reorder threshold, by region">Reordering & Supply Operations</SectionTitle>
            <Card>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
                <thead>
                  <tr style={{ textAlign: "left", color: C.muted, fontSize: 11.5, textTransform: "uppercase" }}>
                    <th style={{ padding: "0 0 10px" }}>Product</th>
                    <th>Region</th>
                    <th>On Hand</th>
                    <th>Threshold</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {supply.map((s) => (
                    <tr key={s.id} style={{ borderTop: `1px solid ${C.border}` }}>
                      <td style={{ padding: "10px 0", fontWeight: 600 }}>{s.product}</td>
                      <td style={{ color: C.muted }}>{s.region.toUpperCase()}</td>
                      <td style={{ color: C.muted }}>{s.onHand} units</td>
                      <td style={{ color: C.muted }}>{s.threshold} units</td>
                      <td><StatusPill status={s.status} /></td>
                      <td>
                        {s.status === "reorder" && (
                          <button
                            onClick={() => markOrdered(s.id)}
                            style={{ background: "transparent", border: `1px solid ${C.borderLight}`, color: C.text, borderRadius: 6, padding: "5px 10px", fontSize: 12, cursor: "pointer" }}
                          >
                            Place Order
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </>
        )}

        {tab === "vendors" && (
          <>
            <SectionTitle sub="Suppliers and service partners by category and region">Vendor / Product / Supplier List</SectionTitle>
            <Card>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
                <thead>
                  <tr style={{ textAlign: "left", color: C.muted, fontSize: 11.5, textTransform: "uppercase" }}>
                    <th style={{ padding: "0 0 10px" }}>Vendor</th>
                    <th>Category</th>
                    <th>Regions Served</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((v) => (
                    <tr key={v.id} style={{ borderTop: `1px solid ${C.border}` }}>
                      <td style={{ padding: "10px 0", fontWeight: 600 }}>{v.name}</td>
                      <td style={{ color: C.muted }}>{v.category}</td>
                      <td style={{ color: C.muted }}>{v.regions}</td>
                      <td><StatusPill status={v.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
