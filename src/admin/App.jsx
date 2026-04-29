import React, { useEffect, useMemo, useState } from "react";
import saran from "./assets/my-avatar.jpg";
import logo from "./assets/JCI Madurai Central.png";
import qrImage from "./assets/membership-qr.png";

import {
  Lock,
  Mail,
  Grid2x2,
  ArrowRight,
  BarChart3,
  Bell,
  Search,
  LayoutDashboard,
  Users,
  FolderKanban,
  Settings,
  HelpCircle,
  UserPlus,
  TrendingUp,
  Zap,
  MoreHorizontal,
  X,
  Briefcase,
  SlidersHorizontal,
  LayoutGrid,
  CreditCard,
  ShieldCheck,
  Sparkles,
  CalendarDays,
  ChevronDown,
  Calendar,
  Upload,
  ExternalLink,
  MapPin,
  Pencil,
  MoreVertical,
  Phone,
  Heart,
  User,
  ImagePlus,
  Link as LinkIcon,
  AlertCircle,
  Save,
  Menu,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Camera,
  Edit3,
  Plus,
  Eye,
  EyeOff,
  ClipboardCheck,
} from "lucide-react";

const ADMIN_ALLOWED_ROLES = ["Admin", "SuperAdmin"];
const MEMBER_SEGMENT_OPTIONS = ["Business", "Salaried", "Student"];
const MEMBER_FILTER_TAGS = [
  "All",
  ...MEMBER_SEGMENT_OPTIONS,
  "Member",
  "Appointee",
  "Coordinator",
  "Director",
  "Vice President",
  "Secretary",
  "Treasurer",
  "President",
];
const SEGMENT_GRADIENTS = {
  Business: "from-[#4e3ae9] via-[#6a42f5] to-[#8b5cf6]",
  Salaried: "from-[#06b6d4] via-[#3b82f6] to-[#7c3aed]",
  Student: "from-[#f59e0b] via-[#f97316] to-[#ef4444]",
};
const SEGMENT_CLASSIFICATION_META = {
  Business: {
    bar: "bg-[#06B6D4]",
    iconWrap: "bg-[#ecfeff] text-[#06B6D4]",
    icon: <CreditCard className="h-4 w-4" />,
  },
  Salaried: {
    bar: "bg-[#10B981]",
    iconWrap: "bg-[#ecfdf5] text-[#10B981]",
    icon: <Briefcase className="h-4 w-4" />,
  },
  Student: {
    bar: "bg-[#F59E0B]",
    iconWrap: "bg-[#fff7ed] text-[#F59E0B]",
    icon: <User className="h-4 w-4" />,
  },
};

const isAdminRole = (role) => ADMIN_ALLOWED_ROLES.includes(role);
const buildEmptySegmentCounts = () =>
  MEMBER_SEGMENT_OPTIONS.reduce((accumulator, segment) => {
    accumulator[segment] = 0;
    return accumulator;
  }, {});
const buildSegmentStats = (counts = {}) =>
  MEMBER_SEGMENT_OPTIONS.map((name) => ({
    name,
    value: counts[name] || 0,
    color: SEGMENT_GRADIENTS[name] || SEGMENT_GRADIENTS.Business,
  }));

const activityData = [
  {
    id: 1,
    name: "Marcus Thorne",
    action: "joined the Premium Tier",
    time: "2 mins ago",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    dot: "bg-green-500",
  },
  {
    id: 2,
    name: "Elena Rodriguez",
    action: "updated her Portfolio",
    time: "14 mins ago",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    dot: "bg-indigo-500",
  },
  {
    id: 3,
    name: "Arthur Pendragon",
    action: "published a new Listing",
    time: "1 hour ago",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
    dot: "bg-amber-500",
  },
  {
    id: 4,
    name: "Sasha K.",
    action: "joined Technology Category",
    time: "3 hours ago",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
    dot: "bg-green-500",
  },
];

const categoryData = [
  { name: "Technology & SaaS", value: 42, color: "from-indigo-600 to-violet-500" },
  { name: "Creative Arts", value: 28, color: "from-violet-600 to-purple-500" },
  { name: "Healthcare", value: 15, color: "from-fuchsia-500 to-pink-500" },
  { name: "Financial Services", value: 15, color: "from-slate-700 to-slate-800" },
];

const stats = [
  {
    title: "Total Members",
    value: "12,842",
    icon: Users,
    badge: "+ 12%",
    badgeClass: "bg-green-100 text-green-700",
    iconWrap: "bg-indigo-100 text-indigo-600",
  },
  {
    title: "Active Members",
    value: "10,790",
    icon: Zap,
    badge: "84% Engagement",
    badgeClass: "bg-indigo-100 text-indigo-700",
    iconWrap: "bg-indigo-100 text-indigo-600",
  },
  {
    title: "Weekly New Joins",
    value: "+428",
    icon: UserPlus,
    badge: "",
    badgeClass: "",
    iconWrap: "bg-pink-100 text-pink-600",
  },
  {
    title: "Top Category Growth",
    value: "LGB",
    icon: TrendingUp,
    badge: "",
    badgeClass: "",
    iconWrap: "bg-amber-100 text-amber-600",
  },
];

const chartData = {
  "this-year": {
    label: "This Year",
    subtitle: "Last 12 months performance",
    points: [
      { x: 0, y: 76 },
      { x: 14, y: 62 },
      { x: 28, y: 48 },
      { x: 42, y: 56 },
      { x: 56, y: 34 },
      { x: 70, y: 26 },
      { x: 84, y: 18 },
      { x: 100, y: 10 },
    ],
    labels: ["JAN", "MAR", "MAY", "JUL", "SEP", "DEC"],
    markerIndex: 6,
  },
  "last-2-years": {
    label: "Last 2 Years",
    subtitle: "Performance across last 24 months",
    points: [
      { x: 0, y: 82 },
      { x: 14, y: 70 },
      { x: 28, y: 60 },
      { x: 42, y: 66 },
      { x: 56, y: 44 },
      { x: 70, y: 36 },
      { x: 84, y: 28 },
      { x: 100, y: 16 },
    ],
    labels: ["2024", "Q2", "Q3", "2025", "Q2", "NOW"],
    markerIndex: 5,
  },
  "last-3-years": {
    label: "Last 3 Years",
    subtitle: "Performance across last 36 months",
    points: [
      { x: 0, y: 88 },
      { x: 14, y: 74 },
      { x: 28, y: 68 },
      { x: 42, y: 58 },
      { x: 56, y: 48 },
      { x: 70, y: 34 },
      { x: 84, y: 24 },
      { x: 100, y: 14 },
    ],
    labels: ["2023", "2024", "MID", "2025", "MID", "TODAY"],
    markerIndex: 6,
  },
};

function buildSmoothPath(points, width = 1000, height = 260) {
  const scaled = points.map((p) => ({ x: (p.x / 100) * width, y: (p.y / 100) * height }));
  if (scaled.length < 2) return "";
  let d = `M ${scaled[0].x} ${scaled[0].y}`;
  for (let i = 0; i < scaled.length - 1; i++) {
    const p0 = scaled[i === 0 ? i : i - 1];
    const p1 = scaled[i];
    const p2 = scaled[i + 1];
    const p3 = scaled[i + 2] || p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

const FILE_LIMITS_MB = {
  profileImage: 2,
  visitingCard: 3,
  businessGallery: 5,
};

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function isFileSizeValid(file, limitMb) {
  return file && file.size <= limitMb * 1024 * 1024;
}

function getMissingProfileFields(profile) {
  const missing = [];

  if (!profile?.phone) missing.push("Phone");
  if (!profile?.email) missing.push("Email");
  if (!profile?.dob) missing.push("Date of Birth");
  if (!profile?.bloodGroup) missing.push("Blood Group");

  if (!profile?.business?.name) missing.push("Business Name");
  if (!profile?.business?.contactNo) missing.push("Business Contact No");
  if (!profile?.business?.address) missing.push("Business Address");
  if (!profile?.business?.email) missing.push("Business Email");
  if (profile?.business?.type === "Business") {
    if (!profile?.business?.name) missing.push("Business Name");
    if (!profile?.business?.contactNo) missing.push("Business Phone");
    if (!profile?.business?.address) missing.push("Business Address");
  }

  if (profile?.business?.type === "Salaried") {
    if (!profile?.business?.name) missing.push("Company Name");
    if (!profile?.business?.address) missing.push("Company Address");
  }

  const social = profile?.socialLinks || {};
  if (!social.facebook && !social.instagram && !social.youtube && !social.linkedin && !social.pinterest) {
    missing.push("Social Media Links");
  }

  if (profile?.family?.maritalStatus === "Married") {
    if (!profile?.family?.spouse?.name) missing.push("Spouse Name");
    if (!profile?.family?.spouse?.dob) missing.push("Spouse DOB");
    if (!profile?.family?.spouse?.bloodGroup) missing.push("Spouse Blood Group");
    if (!profile?.family?.anniversary) missing.push("Anniversary Date");
  }

  return missing;
}

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    if (!username || !password) { setError("Username and password are required."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId: username, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Login failed"); return; }
      if (!isAdminRole(data.member.role)) {
        clearAdminSessionStorage();
        setError("Access denied. Admin accounts only."); return;
      }
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.member));
      onLogin(data.member);
    } catch (e) {
      setError("Connection error. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left side: Logo / Branding */}
      <div className="hidden w-1/2 flex-col items-center justify-center bg-[#f8f9ff] p-12 lg:flex">
        <div className="max-w-[400px] text-center">
          <img src={logo} alt="JCI Madurai Central Logo" className="mx-auto mb-8 w-64 object-contain" />
          <h2 className="text-[2.5rem] font-bold tracking-tight text-[#1f2430]">
            JCI Madurai Central
          </h2>
          <p className="mt-4 text-[1.1rem] text-[#6b7280]">
            Empowering young leaders to create positive change in our community.
          </p>
        </div>
      </div>

      {/* Right side: Login form */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <section className="w-full max-w-[460px] rounded-[30px] border border-[#e5e8f0] bg-[#fbfbfd] px-5 py-8 shadow-[0_20px_60px_rgba(25,30,60,0.08)] sm:px-7 sm:py-10 md:px-12">
          <div className="mb-7 lg:hidden">
            <img src={logo} alt="JCI Logo" className="h-16 object-contain" />
          </div>
          
          <h1 className="text-[2rem] font-bold tracking-[-0.04em] text-[#1f2430] sm:text-[2.4rem]">
            Admin Portal
          </h1>

          <p className="mt-3 text-[15px] leading-7 text-[#8c90a0] sm:text-[16px]">
            Please sign in to access the JCI Madurai Central management dashboard.
          </p>

          {error && (
            <div className="mt-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-medium text-red-600">{error}</div>
          )}

          <div className="mt-8 space-y-6 sm:mt-10">
            <div>
              <label className="mb-3 block text-[13px] font-semibold text-[#7c8191]">
                Username
              </label>

              <div className="flex h-[54px] items-center gap-3 rounded-[14px] border border-[#ebedf4] bg-white px-4 shadow-sm transition focus-within:border-[#cec6ff] focus-within:ring-4 focus-within:ring-[#ece9ff] sm:h-[58px]">
                <User className="h-5 w-5 text-[#a8acb8]" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
                  className="w-full bg-transparent text-[14px] text-[#4d5364] outline-none placeholder:text-[#b5b9c6] sm:text-[15px]"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <label className="block text-[13px] font-semibold text-[#7c8191]">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[13px] font-semibold text-[#6b57f5] transition hover:opacity-80"
                >
                  Forgot password?
                </button>
              </div>

              <div className="flex h-[54px] items-center gap-3 rounded-[14px] border border-[#ebedf4] bg-white px-4 shadow-sm transition focus-within:border-[#cec6ff] focus-within:ring-4 focus-within:ring-[#ece9ff] sm:h-[58px]">
                <Lock className="h-5 w-5 text-[#a8acb8]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
                  className="w-full bg-transparent text-[14px] text-[#4d5364] outline-none placeholder:text-[#b5b9c6] sm:text-[15px]"
                  placeholder="Enter password"
                />
              </div>
            </div>
          </div>

          <label className="mt-6 flex items-center gap-3 text-[14px] text-[#9499a8] sm:mt-7">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-[#d7dbe7] text-[#5b3df5]"
            />
            Keep me signed in
          </label>

          <button
            onClick={handleSignIn}
            disabled={loading}
            className="mt-6 flex h-[54px] w-full items-center justify-center rounded-full bg-gradient-to-r from-[#5b3df5] to-[#6c40f6] text-[14px] font-semibold text-white shadow-[0_18px_30px_rgba(91,61,245,0.30)] transition hover:-translate-y-0.5 disabled:opacity-60 sm:mt-7 sm:h-[58px] sm:text-[15px]"
          >
            {loading ? "Signing in..." : "Sign in to Portal"}
          </button>

          <div className="my-6 flex items-center gap-4 text-[13px] text-[#b0b4c0] sm:my-8">
            <div className="h-px flex-1 bg-[#eceef4]" />
            <span>Authorized personnel only</span>
            <div className="h-px flex-1 bg-[#eceef4]" />
          </div>
        </section>
      </div>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left transition sm:px-4 sm:py-3 ${
        active ? "text-[#5442ef]" : "text-[#697386] hover:text-[#1e2430]"
      }`}
    >
      <span className="flex items-center gap-3 text-[14px] font-medium sm:text-[15px]">
        <Icon className="h-[16px] w-[16px] sm:h-[18px] sm:w-[18px]" />
        {label}
      </span>
      {active ? <span className="h-6 w-1 rounded-full bg-[#5b3df5]" /> : null}
    </button>
  );
}

const MEMBER_CLASSIFICATION_LABEL = "Member Classification";

function SidebarBrand() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-[0_12px_26px_rgba(31,36,48,0.08)] sm:h-11 sm:w-11">
        <img
          src={logo}
          alt="JCI Madurai Central Logo"
          className="h-7 w-7 object-contain sm:h-8 sm:w-8"
        />
      </div>
      <div>
        <p className="text-[14px] font-semibold text-[#1f2430] sm:text-[15px]">
          JCI Madurai Central
        </p>
        <p className="text-[11px] text-[#8c90a0] sm:text-[12px]">Admin Portal</p>
      </div>
    </div>
  );
}

function SettingsToggleBlock({
  activePage,
  onNavigate,
  showSettingsPage,
  setShowSettingsPage,
}) {
  return (
    <div className="mt-2 rounded-2xl border border-[#e7eaf2] bg-white px-3 py-3 sm:px-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Settings className="h-[16px] w-[16px] text-[#697386] sm:h-[18px] sm:w-[18px]" />
          <span className="text-[14px] font-medium text-[#697386] sm:text-[15px]">Settings</span>
        </div>

        <button
          type="button"
          onClick={() => {
            const nextValue = !showSettingsPage;
            setShowSettingsPage(nextValue);

            if (!nextValue && activePage === "settings") {
              onNavigate("dashboard");
            }
          }}
          className={`relative h-7 w-14 rounded-full transition ${
            showSettingsPage ? "bg-[#5b3df5]" : "bg-[#d7dbe7]"
          }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
              showSettingsPage ? "left-8" : "left-1"
            }`}
          />
        </button>
      </div>

      {showSettingsPage && (
        <button
          type="button"
          onClick={() => onNavigate("settings")}
          className={`mt-3 flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left transition sm:px-4 sm:py-3 ${
            activePage === "settings"
              ? "text-[#5442ef]"
              : "text-[#697386] hover:text-[#1e2430]"
          }`}
        >
          <span className="flex items-center gap-3 text-[14px] font-medium sm:text-[15px]">
            <Settings className="h-[16px] w-[16px] sm:h-[18px] sm:w-[18px]" />
            Settings Page
          </span>
          {activePage === "settings" ? (
            <span className="h-6 w-1 rounded-full bg-[#5b3df5]" />
          ) : null}
        </button>
      )}
    </div>
  );
}

const initialMembers = [
  {
    name: "Sarankumar R",
    role: "Member Contribution",
    avatar: saran,
    dot: "bg-emerald-500",
    tags: ["LGB", "Business"],
    about: "",
    profile: {
      profileImage: saran,
      memberId: "MBR-1001",
      businessName: "faithandlifetech",
      businessRole: "IT Professional",
      phone: "+91 98765 43210",
      email: "sarankumar@faithandlifetech.com",
      dob: "1998-06-14",
      bloodGroup: "O+",
      business: {
        name: "Faith and Life Tech",
        contactNo: "+91 98765 43210",
        address: "Anna Nagar, Chennai, Tamil Nadu, India",
        email: "business@faithandlifetech.com",
        mapLocation: "https://maps.google.com/?q=Anna+Nagar+Chennai",
        visitingCardImage: "",
      },
      family: {
        maritalStatus: "Married",
        spouse: {
          name: "Samantha S",
          dob: "1999-02-10",
          bloodGroup: "A+",
        },
        anniversary: "2014-08-21",
        childrenCount: 2,
        children: [
          { name: "Swetha", dob: "2016-04-18" },
          { name: "Santhosh", dob: "2019-09-05" },
        ],
      },
      socialLinks: {
        facebook: "",
        instagram: "",
        youtube: "",
        linkedin: "",
        pinterest: "",
      },
      businessGallery: [
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
      ],
    }
  },
  {
    name: "Sarah Lindholm",
    role: "Member",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    dot: "bg-emerald-500",
    tags: ["LGB", "Business"],
    about: "",
    profile: {
      profileImage:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
      businessName: "Vespera Tech",
      businessRole: "Global Head of Strategic Operations",
      phone: "+91 98765 43210",
      email: "elena@vespera.tech",
      address: "Anna Nagar, Chennai, Tamil Nadu, India",
      family: {
        maritalStatus: "Married",
        spouseName: "David Rodriguez",
        spouseRole: "Entrepreneur",
        anniversary: "21 Aug 2014",
        children: [
          { name: "Sophia Rodriguez", relation: "Daughter", dob: "18 Apr 2016" },
          { name: "Ethan Rodriguez", relation: "Son", dob: "05 Sep 2019" },
        ],
      },
      businessGallery: [
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80",
      ],
    },
  },
  {
    name: "Sarah Lindholm",
    role: "Member Contribution",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    dot: "bg-sky-500",
    tags: ["JAC", "Salaried"],
    about: "",
    profile: {
      profileImage:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
      businessName: "Northgrid Labs",
      businessRole: "Frontend Architecture Lead",
      phone: "+91 98765 43210",
      email: "sarah@northgrid.io",
      address: "T. Nagar, Chennai, Tamil Nadu, India",
      family: {
        maritalStatus: "Single",
        spouseName: "",
        spouseRole: "",
        anniversary: "",
        children: [],
      },
      businessGallery: [
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80",
      ],
    },
  },
];

const ADMIN_TOKEN_STORAGE_KEY = "adminToken";
const ADMIN_USER_STORAGE_KEY = "adminUser";
const ADMIN_MEMBER_AVATAR =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80";

function clearAdminSessionStorage() {
  localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
  localStorage.removeItem(ADMIN_USER_STORAGE_KEY);
  localStorage.removeItem("members_cache");
}

function getAdminUser() {
  try {
    return JSON.parse(localStorage.getItem(ADMIN_USER_STORAGE_KEY) || 'null');
  } catch {
    return null;
  }
}

function getAdminHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) || ""}`,
  };
}

async function fetchAuthenticatedAdmin() {
  const token = localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);

  if (!token) {
    return { ok: false, message: "Admin session not found." };
  }

  try {
    const response = await fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok || !isAdminRole(data.member?.role)) {
      return {
        ok: false,
        message: data.message || "Access denied. Admin accounts only.",
      };
    }

    return { ok: true, member: data.member };
  } catch (error) {
    return {
      ok: false,
      message: "Unable to validate the admin session right now.",
    };
  }
}

function buildChildrenPayload(form) {
  const children = [];
  const totalChildren = Number.parseInt(form.childrenCount || "0", 10);

  for (let index = 1; index <= totalChildren; index += 1) {
    const child = {
      name: form[`child${index}Name`]?.trim() || "",
      dob: form[`child${index}Dob`] || "",
      bloodGroup: form[`child${index}BloodGroup`] || "",
      gender: form[`child${index}Gender`] || "",
    };

    if (child.name || child.dob || child.bloodGroup || child.gender) {
      children.push(child);
    }
  }

  return children;
}

function cleanPhone(val) {
  // Strip all whitespace to avoid regex edge cases, then re-validate
  return (val || "").trim().replace(/\s+/g, " ");
}

function buildMemberCreatePayload(form, businessGallery) {
  const isBusinessProfile = form.businessProfile === "Business";
  const isStudentProfile = form.businessProfile === "Student";
  const primaryBusinessName = isBusinessProfile ? form.businessName : (isStudentProfile ? form.institute : form.companyName);
  const primaryRole = isBusinessProfile ? form.businessDesignation : (isStudentProfile ? form.department : form.salariedDesignation);
  const primaryEmail = isBusinessProfile ? form.businessEmail : form.officialEmail;
  const primaryAddress = isBusinessProfile ? form.businessAddress : form.companyAddress;
  const primaryPhone = cleanPhone(isBusinessProfile ? form.businessPhone : form.phone);
  const children = buildChildrenPayload(form);

  return {
    name: form.name.trim(),
    email: form.email.trim(),
    phone: cleanPhone(form.phone),
    gender: form.gender || "",
    membershipCategory: form.tagValue || "Member",
    memberContribution: form.role || "",
    memberSegment: form.businessProfile || "",
    profession: primaryRole?.trim() || primaryBusinessName?.trim() || "",
    address: primaryAddress?.trim() || "",
    profile: {
      dob: form.dob || "",
      bloodGroup: form.bloodGroup || "",
      phone: cleanPhone(form.phone),
      email: form.email.trim(),
      profession: primaryRole?.trim() || "",
      businessRole: primaryRole?.trim() || "",
      profileImage: form.profileImage || "",
      business: {
        name: primaryBusinessName?.trim() || "",
        address: primaryAddress?.trim() || "",
        email: primaryEmail?.trim() || "",
        contactNo: primaryPhone?.trim() || "",
        website: form.businessWebsite?.trim() || "",
        mapLocation: "",
        visitingCardImage: form.visitingCardImage || form.businessCardImage || "",
        portfolioImages: businessGallery || [],
        institute: isStudentProfile ? form.institute?.trim() : "",
        department: isStudentProfile ? form.department?.trim() : "",
        year: isStudentProfile ? form.year?.trim() : "",
        idNumber: isStudentProfile ? form.idNumber?.trim() : "",
      },
      social: {
        website: form.businessWebsite?.trim() || "",
        linkedin: form.linkedin?.trim() || "",
        instagram: form.instagram?.trim() || "",
        facebook: form.facebook?.trim() || "",
        youtube: form.youtube?.trim() || "",
      },
      family: {
        maritalStatus: form.maritalStatus || "Single",
        anniversary: form.anniversary || "",
        spouse:
          form.maritalStatus === "Married"
            ? {
                name: form.spouseName?.trim() || "",
                dob: form.spouseDob || "",
                bloodGroup: form.spouseBloodGroup || "",
              }
            : {},
        children,
      },
    },
  };
}

function mapApiMemberToUi(member) {
  if (!member) return null;

  const profile = member.profile || {};
  const business = profile.business || {};
  const family = profile.family || {};
  const socialLinks = profile.socialLinks || profile.social || {};
  const tags = [member.membershipCategory, member.memberSegment].filter(Boolean);

  return {
    ...member,
    id: member.id || member._id,
    systemRole: member.role,
    role: member.membershipCategory || member.memberContribution || member.role,
    avatar: profile.profileImage || ADMIN_MEMBER_AVATAR,
    dot: member.isTempPassword ? "bg-amber-500" : "bg-emerald-500",
    tags,
    about: profile.about || member.about || "",
    profile: {
      ...profile,
      memberId: member.memberId,
      phone: profile.phone || member.phone || "",
      email: profile.email || member.email || "",
      address: profile.address || member.address || "",
      city: profile.city || member.city || "",
      state: profile.state || member.state || "",
      pincode: profile.pincode || member.pincode || "",
      profession: profile.profession || member.profession || "",
      businessRole: profile.businessRole || member.memberContribution || "",
      businessName: business.name || "",
      business: {
        ...business,
        name: business.name || "",
        address: business.address || "",
        email: business.email || "",
        contactNo: business.contactNo || "",
        mapLocation: business.mapLocation || "",
        visitingCardImage: business.visitingCardImage || "",
        institute: business.institute || "",
        department: business.department || "",
        year: business.year || "",
        idNumber: business.idNumber || "",
      },
      family: {
        maritalStatus: family.maritalStatus || "Single",
        anniversary: family.anniversary || "",
        spouse: family.spouse || {},
        children: family.children || [],
      },
      socialLinks: {
        website: socialLinks.website || "",
        linkedin: socialLinks.linkedin || "",
        instagram: socialLinks.instagram || "",
        facebook: socialLinks.facebook || "",
        youtube: socialLinks.youtube || "",
        pinterest: socialLinks.pinterest || socialLinks.twitter || "",
      },
      businessGallery: profile.businessGallery || business.portfolioImages || [],
    },
  };
}

function buildMemberUpdatePayload(member) {
  const tags = member.tags || [];
  const segment =
    member.memberSegment ||
    MEMBER_SEGMENT_OPTIONS.find((item) => tags.includes(item)) ||
    "";

  return {
    name: member.name || "",
    email: member.profile?.email || member.email || "",
    phone: member.profile?.phone || member.phone || "",
    address: member.profile?.address || member.address || "",
    city: member.profile?.city || member.city || "",
    state: member.profile?.state || member.state || "",
    pincode: member.profile?.pincode || member.pincode || "",
    profession: member.profile?.profession || member.profession || "",
    membershipCategory: member.membershipCategory || member.role || "",
    memberContribution: member.memberContribution || member.profile?.businessRole || "",
    memberSegment: segment,
    profile: {
      about: member.about || member.profile?.about || "",
      dob: member.profile?.dob || "",
      bloodGroup: member.profile?.bloodGroup || "",
      phone: member.profile?.phone || member.phone || "",
      email: member.profile?.email || member.email || "",
      address: member.profile?.address || member.address || "",
      city: member.profile?.city || member.city || "",
      state: member.profile?.state || member.state || "",
      pincode: member.profile?.pincode || member.pincode || "",
      profession: member.profile?.profession || member.profession || "",
      businessRole: member.profile?.businessRole || member.memberContribution || "",
      profileImage: member.profile?.profileImage || member.avatar || "",
      business: {
        name: member.profile?.business?.name || member.profile?.businessName || "",
        address: member.profile?.business?.address || "",
        email: member.profile?.business?.email || "",
        contactNo: member.profile?.business?.contactNo || "",
        mapLocation: member.profile?.business?.mapLocation || "",
        visitingCardImage: member.profile?.business?.visitingCardImage || "",
        portfolioImages: member.profile?.businessGallery || [],
        institute: member.profile?.business?.institute || "",
        department: member.profile?.business?.department || "",
        year: member.profile?.business?.year || "",
        idNumber: member.profile?.business?.idNumber || "",
      },
      social: {
        website: member.profile?.socialLinks?.website || "",
        linkedin: member.profile?.socialLinks?.linkedin || "",
        instagram: member.profile?.socialLinks?.instagram || "",
        facebook: member.profile?.socialLinks?.facebook || "",
        youtube: member.profile?.socialLinks?.youtube || "",
        pinterest: member.profile?.socialLinks?.pinterest || "",
      },
      family: {
        maritalStatus: member.profile?.family?.maritalStatus || "Single",
        anniversary: member.profile?.family?.anniversary || "",
        spouse: member.profile?.family?.spouse || {},
        children: member.profile?.family?.children || [],
      },
    },
  };
}

function MemberCard({ member, onViewProfile, onDelete }) {
  return (
    <div className="rounded-[22px] bg-white px-4 py-5 shadow-[0_8px_24px_rgba(25,30,60,0.04)] ring-1 ring-[#efeff3] sm:px-5 sm:py-6">
      <div className="relative mx-auto h-[70px] w-[70px] sm:h-[78px] sm:w-[78px]">
        <img
          src={
            member.avatar ||
            member.profile?.profileImage ||
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
          }
          alt={member.name}
          className="h-full w-full rounded-full object-cover"
        />
        <span
          className={`absolute bottom-1 right-1 h-3 w-3 rounded-full border-2 border-white sm:h-3.5 sm:w-3.5 ${member.dot}`}
        />
      </div>

      <h3 className="mt-4 text-center text-[1.4rem] font-bold leading-[1.05] tracking-[-0.04em] text-[#1f2430] sm:mt-5 sm:text-[1.7rem]">
        {member.name.split(" ")[0]}
        <span className="block">{member.name.split(" ").slice(1).join(" ")}</span>
      </h3>

      <p className="mt-2 text-center text-[12px] text-[#6e76a0] sm:text-[13px] font-medium text-emerald-600 uppercase tracking-widest">{member.role}</p>

      {member.memberId && (
        <p className="mt-1 text-center text-[10px] font-bold text-[#8f96a4] sm:text-[11px] uppercase tracking-widest">
          {member.memberId}
        </p>
      )}

      <div className="mt-3 flex flex-wrap justify-center gap-2 sm:mt-4">
        {(member.tags || []).map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-[#f4f5f8] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#7c8393] sm:text-[10px]"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Removed about text as requested */}

      <div className="mt-5 flex flex-col gap-3 sm:mt-6">
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onViewProfile(member)}
            className="rounded-full border border-[#d7dbe4] bg-white py-2 text-[11px] font-semibold text-[#666f80] sm:py-2.5 sm:text-[12px] hover:bg-gray-50"
          >
            View Profile
          </button>
        </div>

        <button
          onClick={() => onDelete(member)}
          className="w-full rounded-full border border-red-200 bg-red-50 py-2 text-[11px] font-semibold text-red-600 hover:bg-red-100 sm:py-2.5 sm:text-[12px]"
        >
          Delete Member
        </button>
      </div>
    </div>
  );
}

function AddMemberModal({ onClose, onAdd }) {
  const TAG_TYPE_OPTIONS = ["Category", "Segment"];
  const CATEGORY_OPTIONS = [ "Member",
  "Appointee",
  "Coordinator",
  "Director",
  "Vice President",
  "Secretary",
  "Treasurer",
  "President",];
  const SEGMENT_OPTIONS = MEMBER_SEGMENT_OPTIONS;
 const ROLE_OPTIONS = [
  "HGF - Henry Giessenbier Fellow",
  "JFM - Jaycee Foundation Member",
  "JFD - Jaycee Foundation Donor",
  "JFA - Jaycee Foundation Achiever",
  "JFP - Jaycee Foundation Patron",
  "JFF - Jaycee Foundation Fellow",
  "JFS - Jaycee Foundation Star",
  "JFG - Jaycee Foundation Gem",
  "RPP - Rajendranath Pai Patron",
  "JFR - Jaycee Foundation Ruby",
  "JFJ - Jaycee Foundation Jewel",
  "JFE - Jaycee Foundation Emerald",
  "JFK - Jaycee Foundation Kohinoor",
  "JFI - Jaycee Foundation Icon",
  "JFC - Jaycee Foundation Crown",
];
  const BLOOD_GROUP_OPTIONS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const BUSINESS_PROFILE_OPTIONS = ["Business", "Salaried", "Student"];
  const TRAINER_OPTIONS = ["Zone Trainer", "National Trainer", "Author", "Others", "NA"];
  const MARITAL_STATUS_OPTIONS = ["Single", "Married"];
  const CHILD_GENDER_OPTIONS = ["M", "F"];

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    role: "",
    profileImage: "",
    dob: "",
    phone: "",
    email: "",
    bloodGroup: "",
    businessProfile: "",
    tagType: "",
    tagValue: "",
    trainerDetails: "",
    maritalStatus: "Single",
    spouseName: "",
    spouseDob: "",
    spouseBloodGroup: "",
    anniversary: "",
    childrenCount: "0",
    child1Name: "",
    child1Dob: "",
    child1BloodGroup: "",
    child1Gender: "",
    child2Name: "",
    child2Dob: "",
    child2BloodGroup: "",
    child2Gender: "",
    businessName: "",
    businessDesignation: "",
    businessEmail: "",
    businessAddress: "",
    businessPhone: "",
    businessWebsite: "",
    companyName: "",
    salariedDesignation: "",
    companyAddress: "",
    officialEmail: "",
    businessCardImage: "",
    visitingCardImage: "",
    facebook: "",
    instagram: "",
    youtube: "",
    linkedin: "",
    gender: "",
    institute: "",
    department: "",
    year: "",
    idNumber: "",
   otherSocials: [{ name: "", link: "" }],
  });

  const today = new Date().toISOString().split("T")[0];

  const [businessGallery, setBusinessGallery] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const inputClass = (hasError = false) =>
    `w-full rounded-2xl border px-3 py-2.5 text-[13px] outline-none transition sm:px-4 sm:py-3 sm:text-[14px] ${
      hasError
        ? "border-red-300 bg-red-50"
        : "border-[#e8ebf2] bg-white focus:border-[#5b3df5]"
    }`;

  const labelClass = "mb-2 block text-[12px] font-semibold text-[#6b7280] sm:text-[13px]";

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setField(name, value);
  };


  const handleOtherSocialChange = (index, field, value) => {
  setForm((prev) => ({
    ...prev,
    otherSocials: prev.otherSocials.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ),
  }));
};

const addOtherSocialField = () => {
  setForm((prev) => ({
    ...prev,
    otherSocials: [...prev.otherSocials, { name: "", link: "" }],
  }));
};

const removeOtherSocialField = (index) => {
  setForm((prev) => ({
    ...prev,
    otherSocials:
      prev.otherSocials.length === 1
        ? [{ name: "", link: "" }]
        : prev.otherSocials.filter((_, i) => i !== index),
  }));
};


  const fileToBase64Local = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleProfileImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Profile image must be less than 2MB");
      e.target.value = "";
      return;
    }

    const base64 = await fileToBase64Local(file);
    setField("profileImage", base64);
  };

  const handleSingleFile = async (e, fieldName, maxMb = 3) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxMb * 1024 * 1024) {
      alert(`File must be less than ${maxMb}MB`);
      e.target.value = "";
      return;
    }

    const base64 = await fileToBase64Local(file);
    setField(fieldName, base64);
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const converted = await Promise.all(
      files.slice(0, 4).map(async (file) => {
        if (file.size > 5 * 1024 * 1024) {
          throw new Error("Each business image must be less than 5MB");
        }
        return await fileToBase64Local(file);
      })
    ).catch((err) => {
      alert(err.message);
      return null;
    });

    if (converted) {
      setBusinessGallery(converted);
    }
  };

 const validateStep = () => {
  return true;
};

  const goNext = () => {
    if (!validateStep()) return;
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const goBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    // Basic validation for mandatory fields
    if (!form.name || !form.phone || !form.email || !form.role || !form.tagValue) {
      alert("Please fill in Name, Phone, Email, JCI - Contribution, and Membership Categories.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/admin/members/create', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(buildMemberCreatePayload(form, businessGallery)),
      });

      const data = await response.json();

      if (response.ok) {
        const createdMember = mapApiMemberToUi(data.member);
        alert(
          `Member created successfully.\nUsername: ${data.credentials?.username || createdMember?.memberId}\nCredential email: ${data.credentials?.emailSent ? "Sent" : "Pending"}`
        );
        onAdd(createdMember);
        onClose();
      } else {
        alert(data.message || "Failed to create member");
      }
    } catch (err) {
      console.error("Error creating member:", err);
      alert("Connection error. Please check if the backend is running.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderUploadBox = (title, subtitle, onChange, preview) => (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-[22px] border border-dashed border-[#d7dbe4] bg-[#fafbff] px-3 py-3 transition hover:border-[#5b3df5] sm:gap-4 sm:px-4 sm:py-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f1edff] text-[#5b3df5] sm:h-12 sm:w-12">
          <Upload className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <div>
          <p className="text-[13px] font-semibold text-[#1f2430] sm:text-[14px]">{title}</p>
          <p className="text-[11px] text-[#7b8494] sm:text-[12px]">{subtitle}</p>
        </div>
      </div>
      <input type="file" className="hidden" onChange={onChange} />
      <span className="rounded-full bg-[#5b3df5] px-3 py-1.5 text-[11px] font-semibold text-white sm:px-4 sm:py-2 sm:text-[12px]">
        Upload
      </span>
      {preview ? (
        <img
          src={preview}
          alt={title}
          className="h-10 w-10 rounded-xl object-cover ring-1 ring-[#e8ebf2] sm:h-12 sm:w-12"
        />
      ) : null}
    </label>
  );

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-[rgba(15,23,42,0.45)] backdrop-blur-[6px] px-3 py-4 sm:px-4 sm:py-6">
      <div className="relative max-h-[94vh] w-full max-w-[95%] overflow-y-auto rounded-[30px] bg-white p-4 shadow-[0_40px_100px_rgba(37,34,79,0.28)] ring-1 ring-[#e8ebf2] sm:max-w-[980px] sm:p-6 md:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[1.6rem] font-bold tracking-[-0.04em] text-[#1f2430] sm:text-[2rem]">
              Add New Member
            </h2>
            <p className="mt-1 text-[13px] text-[#7c8393] sm:text-[14px]">
              Step {step} of 4
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f4f5f8] text-[#5f6778] ring-1 ring-[#eceff5] sm:h-11 sm:w-11"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2 sm:mt-6 sm:gap-3">
          {["Personal Profile", "Family Profile", "Business Profile", "Social Profile"].map((label, index) => {
            const item = index + 1;

            return (
            <div
              key={item}
              className={`rounded-2xl px-2 py-2 text-center text-[11px] font-semibold sm:px-4 sm:py-3 sm:text-[13px] ${
                step === item
                  ? "bg-[#5b3df5] text-white"
                  : "bg-[#f5f6fa] text-[#7b8494]"
              }`}
            >
              {label}
            </div>
            );
          })}
        </div>

        {step === 1 && (
          <div className="mt-6 sm:mt-8">
            <div className="mt-4 grid gap-4 sm:mt-6 sm:gap-5 md:grid-cols-2">
              <div>
                <label className={labelClass}>1. Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={inputClass(errors.name)}
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className={labelClass}>2. JCI - Contribution</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className={inputClass(errors.role)}
                >
                  <option value="">Select Contribution</option>
                  {ROLE_OPTIONS.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>3. Profile Picture</label>
                {renderUploadBox(
                  "Upload Profile Picture",
                  "JPG / PNG, max 2MB",
                  handleProfileImage,
                  form.profileImage
                )}
              </div>

              <div>
                <label className={labelClass}>4. Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  max={today}
                  onChange={handleChange}
                  className={inputClass(errors.dob)}
                />
              </div>

              <div>
                <label className={labelClass}>5. Gender</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className={inputClass(errors.gender)}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>6. Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={inputClass(errors.phone)}
                  placeholder="+91 9876543210"
                />
              </div>

              <div>
                <label className={labelClass}>7. Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={inputClass(errors.email)}
                  placeholder="Enter Email"
                />
              </div>

              <div>
                <label className={labelClass}>8. Member Blood Group</label>
                <select
                  name="bloodGroup"
                  value={form.bloodGroup}
                  onChange={handleChange}
                  className={inputClass(errors.bloodGroup)}
                >
                  <option value="">Select Blood Group</option>
                  {BLOOD_GROUP_OPTIONS.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>9. Business Profile</label>
                <select
                  name="businessProfile"
                  value={form.businessProfile}
                  onChange={handleChange}
                  className={inputClass(errors.businessProfile)}
                >
                  <option value="">Select Profile</option>
                  {BUSINESS_PROFILE_OPTIONS.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              {/* Removed Tag Type field as requested */}

              <div>
                <label className={labelClass}>10. Membership Categories</label>
                <select
                  name="tagValue"
                  value={form.tagValue}
                  onChange={handleChange}
                  className={inputClass(errors.tagValue)}
                >
                  <option value="">Select Category</option>
                  {CATEGORY_OPTIONS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>11. Trainership Details </label>
                <select
                  name="trainerDetails"
                  value={form.trainerDetails}
                  onChange={handleChange}
                  className={inputClass()}
                >
                  <option value="">Select Trainership Detail</option>
                  {TRAINER_OPTIONS.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="mt-6 sm:mt-8">
            <h3 className="text-[1.1rem] font-bold text-[#1f2430] sm:text-[1.25rem]">Family Profile</h3>

            <div className="mt-4 grid gap-4 sm:mt-6 sm:gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className={labelClass}>Marital Status</label>
                <select
                  name="maritalStatus"
                  value={form.maritalStatus}
                  onChange={handleChange}
                  className={inputClass()}
                >
                  {MARITAL_STATUS_OPTIONS.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              {form.maritalStatus === "Married" && (
                <>
                  <div>
                    <label className={labelClass}>1. Spouse Name</label>
                    <input
                      name="spouseName"
                      value={form.spouseName}
                      onChange={handleChange}
                      className={inputClass(errors.spouseName)}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>2. Spouse DOB</label>
                    <input
                      type="date"
                      name="spouseDob"
                      value={form.spouseDob}
                      max={today}
                      onChange={handleChange}
                      className={inputClass(errors.spouseDob)}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>3. Spouse Blood Group</label>
                    <select
                      name="spouseBloodGroup"
                      value={form.spouseBloodGroup}
                      onChange={handleChange}
                      className={inputClass(errors.spouseBloodGroup)}
                    >
                      <option value="">Select Blood Group</option>
                      {BLOOD_GROUP_OPTIONS.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>4. Date of Anniversary</label>
                    <input
                      type="date"
                      name="anniversary"
                      value={form.anniversary}
                      max={today}
                      onChange={handleChange}
                      className={inputClass(errors.anniversary)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className={labelClass}>Children Count</label>
                    <select
                      name="childrenCount"
                      value={form.childrenCount}
                      onChange={handleChange}
                      className={inputClass()}
                    >
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                    </select>
                  </div>

                  {(form.childrenCount === "1" || form.childrenCount === "2") && (
                    <>
                      <div>
                        <label className={labelClass}>Child 1 Name</label>
                        <input
                          name="child1Name"
                          value={form.child1Name}
                          onChange={handleChange}
                          className={inputClass(errors.child1Name)}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Child 1 DOB</label>
                        <input
                          type="date"
                          name="child1Dob"
                          value={form.child1Dob}
                          max={today}
                          onChange={handleChange}
                          className={inputClass(errors.child1Dob)}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Child 1 Blood Group</label>
                        <select
                          name="child1BloodGroup"
                          value={form.child1BloodGroup}
                          onChange={handleChange}
                          className={inputClass(errors.child1BloodGroup)}
                        >
                          <option value="">Select Blood Group</option>
                          {BLOOD_GROUP_OPTIONS.map((item) => (
                            <option key={item} value={item}>{item}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className={labelClass}>Child 1 Gender</label>
                        <select
                          name="child1Gender"
                          value={form.child1Gender}
                          onChange={handleChange}
                          className={inputClass(errors.child1Gender)}
                        >
                          <option value="">Select Gender</option>
                          {CHILD_GENDER_OPTIONS.map((item) => (
                            <option key={item} value={item}>{item}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  {form.childrenCount === "2" && (
                    <>
                      <div>
                        <label className={labelClass}>Child 2 Name</label>
                        <input
                          name="child2Name"
                          value={form.child2Name}
                          onChange={handleChange}
                          className={inputClass(errors.child2Name)}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Child 2 DOB</label>
                        <input
                          type="date"
                          name="child2Dob"
                          value={form.child2Dob}
                          max={today}
                          onChange={handleChange}
                          className={inputClass(errors.child2Dob)}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Child 2 Blood Group</label>
                        <select
                          name="child2BloodGroup"
                          value={form.child2BloodGroup}
                          onChange={handleChange}
                          className={inputClass(errors.child2BloodGroup)}
                        >
                          <option value="">Select Blood Group</option>
                          {BLOOD_GROUP_OPTIONS.map((item) => (
                            <option key={item} value={item}>{item}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className={labelClass}>Child 2 Gender</label>
                        <select
                          name="child2Gender"
                          value={form.child2Gender}
                          onChange={handleChange}
                          className={inputClass(errors.child2Gender)}
                        >
                          <option value="">Select Gender</option>
                          {CHILD_GENDER_OPTIONS.map((item) => (
                            <option key={item} value={item}>{item}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                </>
              )}

              {form.maritalStatus === "Single" && (
                <div className="md:col-span-2 rounded-2xl bg-[#f7f8fc] px-3 py-3 text-[13px] text-[#6b7280] sm:px-4 sm:py-4 sm:text-[14px]">
                  Single selected. Click Next to continue.
                </div>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="mt-6 sm:mt-8">

            <div className="mt-4 sm:mt-6">
              {form.businessProfile === "Business" && (
                <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
                  <div>
                    <label className={labelClass}>1. Business Name</label>
                    <input
                      name="businessName"
                      value={form.businessName}
                      onChange={handleChange}
                      className={inputClass(errors.businessName)}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>2. Designation</label>
                    <input
                      name="businessDesignation"
                      value={form.businessDesignation}
                      onChange={handleChange}
                      className={inputClass(errors.businessDesignation)}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>3. Email</label>
                    <input
                      name="businessEmail"
                      value={form.businessEmail}
                      onChange={handleChange}
                      className={inputClass(errors.businessEmail)}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>4. Address</label>
                    <input
                      name="businessAddress"
                      value={form.businessAddress}
                      onChange={handleChange}
                      className={inputClass(errors.businessAddress)}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>5. Business Phone</label>
                    <input
                      name="businessPhone"
                      value={form.businessPhone}
                      onChange={handleChange}
                      className={inputClass(errors.businessPhone)}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>6. Business Website</label>
                    <input
                      name="businessWebsite"
                      value={form.businessWebsite}
                      onChange={handleChange}
                      className={inputClass()}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className={labelClass}>7. Business Name Card</label>
                    {renderUploadBox(
                      "Upload Business Name Card",
                      "JPG / PNG / PDF",
                      (e) => handleSingleFile(e, "businessCardImage", 3),
                      form.businessCardImage
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className={labelClass}>8. Business Images</label>
                    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-[22px] border border-dashed border-[#d7dbe4] bg-[#fafbff] px-3 py-3 transition hover:border-[#5b3df5] sm:gap-4 sm:px-4 sm:py-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f1edff] text-[#5b3df5] sm:h-12 sm:w-12">
                          <ImagePlus className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-[#1f2430] sm:text-[14px]">Upload Business Images</p>
                          <p className="text-[11px] text-[#7b8494] sm:text-[12px]">Maximum 4 images</p>
                        </div>
                      </div>
                      <input type="file" multiple className="hidden" onChange={handleGalleryUpload} />
                      <span className="rounded-full bg-[#5b3df5] px-3 py-1.5 text-[11px] font-semibold text-white sm:px-4 sm:py-2 sm:text-[12px]">
                        Upload
                      </span>
                    </label>

                    {businessGallery.length > 0 && (
                      <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:gap-3 md:grid-cols-4">
                        {businessGallery.map((img, index) => (
                          <img
                            key={index}
                            src={img}
                            alt={`Business ${index + 1}`}
                            className="h-20 w-full rounded-2xl object-cover ring-1 ring-[#e8ebf2] sm:h-24"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {form.businessProfile === "Salaried" && (
                <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
                  <div>
                    <label className={labelClass}>1. Company Name</label>
                    <input
                      name="companyName"
                      value={form.companyName}
                      onChange={handleChange}
                      className={inputClass(errors.companyName)}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>2. Designation</label>
                    <input
                      name="salariedDesignation"
                      value={form.salariedDesignation}
                      onChange={handleChange}
                      className={inputClass(errors.salariedDesignation)}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>3. Location / Address</label>
                    <input
                      name="companyAddress"
                      value={form.companyAddress}
                      onChange={handleChange}
                      className={inputClass(errors.companyAddress)}
                    />
                  </div>
                </div>
              )}

              {form.businessProfile === "Student" && (
                <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
                  <div>
                    <label className={labelClass}>1. Institute</label>
                    <input
                      name="institute"
                      value={form.institute}
                      onChange={handleChange}
                      className={inputClass(errors.institute)}
                      placeholder="e.g. Madurai Medical College"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>2. Department</label>
                    <input
                      name="department"
                      value={form.department}
                      onChange={handleChange}
                      className={inputClass(errors.department)}
                      placeholder="e.g. Cardiology"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>3. Year</label>
                    <input
                      name="year"
                      value={form.year}
                      onChange={handleChange}
                      className={inputClass(errors.year)}
                      placeholder="e.g. 3rd Year"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>4. ID Number</label>
                    <input
                      name="idNumber"
                      value={form.idNumber}
                      onChange={handleChange}
                      className={inputClass(errors.idNumber)}
                      placeholder="Enter Student ID"
                    />
                  </div>
                </div>
              )}

              {(form.businessProfile === "Business" || form.businessProfile === "Salaried") && (
                <div className="grid gap-4 sm:gap-5 md:grid-cols-2 mt-5">
                  <div>
                    <label className={labelClass}>4. Official Email (Optional)</label>
                    <input
                      name="officialEmail"
                      value={form.officialEmail}
                      onChange={handleChange}
                      className={inputClass()}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className={labelClass}>5. Visiting Card Image (Optional)</label>
                    {renderUploadBox(
                      "Upload Visiting Card",
                      "Optional",
                      (e) => handleSingleFile(e, "visitingCardImage", 3),
                      form.visitingCardImage
                    )}
                  </div>
                </div>
              )}

              {!form.businessProfile && (
                <div className="rounded-2xl bg-[#f7f8fc] px-3 py-3 text-[13px] text-[#6b7280] sm:px-4 sm:py-4 sm:text-[14px]">
                  First choose "Business Profile" in Section 1.
                </div>
              )}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="mt-6 sm:mt-8">
            <div className="mt-4 grid gap-4 sm:mt-6 sm:gap-5 md:grid-cols-2">
              <div>
                <label className={labelClass}>1. Facebook</label>
                <input
                  name="facebook"
                  value={form.facebook}
                  onChange={handleChange}
                  className={inputClass()}
                  placeholder="Facebook URL"
                />
              </div>

              <div>
                <label className={labelClass}>2. Insta</label>
                <input
                  name="instagram"
                  value={form.instagram}
                  onChange={handleChange}
                  className={inputClass()}
                  placeholder="Instagram URL"
                />
              </div>

              <div>
                <label className={labelClass}>3. Youtube</label>
                <input
                  name="youtube"
                  value={form.youtube}
                  onChange={handleChange}
                  className={inputClass()}
                  placeholder="YouTube URL"
                />
              </div>

              <div>
                <label className={labelClass}>4. LinkedIn</label>
                <input
                  name="linkedin"
                  value={form.linkedin}
                  onChange={handleChange}
                  className={inputClass()}
                  placeholder="LinkedIn URL"
                />
              </div>

             <div className="md:col-span-2">
  <div className="mb-3 flex items-center justify-between">
    <label className={labelClass}>5. Other Social Links</label>
    <button
      type="button"
      onClick={addOtherSocialField}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-[#5b3df5] text-white shadow-[0_10px_20px_rgba(91,61,245,0.25)]"
    >
      +
    </button>
  </div>

  <div className="space-y-3">
    {form.otherSocials.map((item, index) => (
      <div
        key={index}
        className="grid gap-3 rounded-2xl border border-[#e8ebf2] bg-[#fafbff] p-3 md:grid-cols-[1fr_1fr_auto]"
      >
        <input
          type="text"
          value={item.name}
          onChange={(e) =>
            handleOtherSocialChange(index, "name", e.target.value)
          }
          className={inputClass()}
          placeholder="Eg: Twitter"
        />

        <input
          type="text"
          value={item.link}
          onChange={(e) =>
            handleOtherSocialChange(index, "link", e.target.value)
          }
          className={inputClass()}
          placeholder="Paste URL"
        />

        <button
          type="button"
          onClick={() => removeOtherSocialField(index)}
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-[13px] font-semibold text-red-600 hover:bg-red-100"
        >
          Remove
        </button>
      </div>
    ))}
  </div>
</div>



            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#eef1f6] pt-5 sm:mt-8 sm:pt-6">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 1}
            className={`rounded-full px-4 py-2 text-[13px] font-semibold sm:px-5 sm:py-3 sm:text-[14px] ${
              step === 1
                ? "cursor-not-allowed bg-[#f1f3f7] text-[#a3aab8]"
                : "bg-[#eef1ff] text-[#4e3ae9]"
            }`}
          >
            Back
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            {step < 4 ? (
              <button
                type="button"
                onClick={goNext}
                className="rounded-full bg-gradient-to-r from-[#4e3ae9] to-[#6a42f5] px-5 py-2 text-[13px] font-semibold text-white shadow-[0_14px_22px_rgba(78,58,233,0.22)] sm:px-6 sm:py-3 sm:text-[14px]"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-full bg-gradient-to-r from-[#4e3ae9] to-[#6a42f5] px-5 py-2 text-[13px] font-semibold text-white shadow-[0_14px_22px_rgba(78,58,233,0.22)] disabled:opacity-60 sm:px-6 sm:py-3 sm:text-[14px]"
              >
                {submitting ? "Saving..." : "Save Member"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MemberProfileModal({ member, onClose, onSave }) {
  const [activeImage, setActiveImage] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(member);

  useEffect(() => {
    setDraft(member);
  }, [member]);

  if (!member || !draft) return null;

  const gallery = draft.profile?.businessGallery || [];
  const missingFields = getMissingProfileFields(draft.profile);

  const nextImage = () => {
    if (!gallery.length) return;
    setActiveImage((prev) => (prev + 1) % gallery.length);
  };

  const prevImage = () => {
    if (!gallery.length) return;
    setActiveImage((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const updateDraft = (path, value) => {
    setDraft((prev) => {
      const clone = structuredClone(prev);
      const keys = path.split(".");
      let ref = clone;
      for (let i = 0; i < keys.length - 1; i++) ref = ref[keys[i]];
      ref[keys[keys.length - 1]] = value;
      return clone;
    });
  };

  const renderValue = (value, fallback = "Not added") => {
    return value ? value : <span className="text-red-500">{fallback}</span>;
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[rgba(15,23,42,0.35)] backdrop-blur-[6px] px-3 py-4 sm:px-4 sm:py-6">
      <div className="relative max-h-[94vh] w-full max-w-[95%] overflow-y-auto rounded-[34px] bg-[#f6f7fb] p-4 shadow-[0_40px_100px_rgba(37,34,79,0.28)] ring-1 ring-[#e8ebf2] sm:max-w-[1180px] sm:p-6 md:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#697386] shadow-sm ring-1 ring-[#eceff5] sm:h-12 sm:w-12"
          >
            ✕
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                if (isEditing) {
                  onSave(draft);
                }
                setIsEditing((prev) => !prev);
              }}
              className="rounded-full bg-white px-4 py-2 text-[11px] font-semibold text-[#5d6575] shadow-sm ring-1 ring-[#eceff5] sm:px-5 sm:py-3 sm:text-[12px]"
            >
              {isEditing ? "SAVE" : "EDIT"}
            </button>

            <button className="rounded-full bg-gradient-to-r from-[#5b3df5] to-[#6a42f5] px-4 py-2 text-[11px] font-semibold text-white shadow-[0_16px_26px_rgba(91,61,245,0.25)] sm:px-6 sm:py-3 sm:text-[12px]">
              ADMIN ACTIONS
            </button>
          </div>
        </div>

        {missingFields.length > 0 && (
          <div className="mt-4 rounded-[24px] border border-amber-200 bg-amber-50 px-4 py-3 sm:mt-6 sm:px-5 sm:py-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <AlertCircle className="mt-0.5 h-4 w-4 text-amber-500 sm:h-5 sm:w-5" />
              <div>
                <p className="text-[13px] font-semibold text-amber-700 sm:text-[14px]">
                  Missing Details
                </p>
                <p className="mt-1 text-[12px] text-amber-700 sm:text-[13px]">
                  {missingFields.join(", ")}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 grid gap-6 sm:mt-8 sm:grid-cols-1 lg:grid-cols-[320px_1fr]">
          <div className="rounded-[28px] bg-white p-5 shadow-[0_8px_24px_rgba(25,30,60,0.04)] ring-1 ring-[#efeff3] sm:p-6">
            <div className="mx-auto relative h-[140px] w-[140px] overflow-hidden rounded-[28px] ring-4 ring-white shadow-lg sm:h-[170px] sm:w-[170px]">
              <img
                src={draft.profile?.profileImage || draft.avatar}
                alt={draft.name}
                className="h-full w-full object-cover"
              />

              {isEditing && (
                <>
                  <label className="absolute bottom-2 left-1/2 -translate-x-1/2 cursor-pointer rounded-full bg-[#5b3df5] px-2 py-0.5 text-[10px] font-semibold text-white shadow sm:px-3 sm:py-1 sm:text-[11px]">
                    Change
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const base64 = await fileToBase64(file);
                        updateDraft("profile.profileImage", base64);
                      }}
                      className="hidden"
                    />
                  </label>

                  {draft.profile?.profileImage && (
                    <button
                      onClick={() => updateDraft("profile.profileImage", "")}
                      className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-[10px] sm:top-2 sm:right-2 sm:h-7 sm:w-7 sm:text-[12px]"
                    >
                      ✕
                    </button>
                  )}
                </>
              )}
            </div>

            <div className="mt-5 text-center space-y-2 sm:mt-6">
              {isEditing ? (
                <>
                  <input
                    value={draft.name || ""}
                    onChange={(e) => updateDraft("name", e.target.value)}
                    placeholder="Enter Name"
                    className="w-full text-center text-[1.5rem] font-bold rounded-2xl border border-[#e8ebf2] px-2 py-1.5 outline-none focus:border-[#5b3df5] sm:px-3 sm:py-2 sm:text-[2rem]"
                  />
                  <input
                    value={draft.profile?.businessRole || ""}
                    onChange={(e) => updateDraft("profile.businessRole", e.target.value)}
                    placeholder="Enter Role"
                    className="w-full text-center text-[13px] font-medium text-[#6a42f5] rounded-2xl border border-[#e8ebf2] px-2 py-1.5 outline-none focus:border-[#5b3df5] sm:px-3 sm:py-2 sm:text-[15px]"
                  />
                  <input
                    value={draft.profile?.businessName || ""}
                    onChange={(e) => updateDraft("profile.businessName", e.target.value)}
                    placeholder="Enter Business Name"
                    className="w-full text-center text-[13px] text-[#7d8595] rounded-2xl border border-[#e8ebf2] px-2 py-1.5 outline-none focus:border-[#5b3df5] sm:px-3 sm:py-2 sm:text-[15px]"
                  />
                </>
              ) : (
                <>
                  <h2 className="text-[1.8rem] font-bold leading-[1.02] tracking-[-0.05em] text-[#161c31] sm:text-[2.3rem]">
                    {draft.name}
                  </h2>
                  <p className="mt-2 text-[13px] font-medium text-[#6a42f5] sm:text-[15px]">
                    {draft.profile?.businessRole}
                  </p>
                  <p className="mt-1 text-[13px] text-[#7d8595] sm:text-[15px]">
                    {draft.profile?.businessName}
                  </p>
                </>
              )}
            </div>

            <div className="mt-6 space-y-4 border-t border-[#edf0f5] pt-5 sm:mt-8 sm:space-y-5 sm:pt-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9aa2b0] sm:text-[11px]">Phone</p>
                {isEditing ? (
                  <input
                    value={draft.profile?.phone || ""}
                    onChange={(e) => updateDraft("profile.phone", e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-[#e8ebf2] px-2 py-1.5 text-[13px] outline-none focus:border-[#5b3df5] sm:px-3 sm:py-2 sm:text-[15px]"
                  />
                ) : (
                  <p className="mt-1 text-[13px] text-[#4f5666] sm:text-[15px]">{renderValue(draft.profile?.phone)}</p>
                )}
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9aa2b0] sm:text-[11px]">Email</p>
                {isEditing ? (
                  <input
                    value={draft.profile?.email || ""}
                    onChange={(e) => updateDraft("profile.email", e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-[#e8ebf2] px-2 py-1.5 text-[13px] outline-none focus:border-[#5b3df5] sm:px-3 sm:py-2 sm:text-[15px]"
                  />
                ) : (
                  <p className="mt-1 text-[13px] text-[#4f5666] sm:text-[15px]">{renderValue(draft.profile?.email)}</p>
                )}
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9aa2b0] sm:text-[11px]">Member ID</p>
                {isEditing ? (
                  <input
                    value={draft.memberId || draft.profile?.memberId || ""}
                    readOnly
                    className="mt-1 w-full rounded-2xl border border-[#e8ebf2] bg-slate-50 px-2 py-1.5 text-[13px] outline-none sm:px-3 sm:py-2 sm:text-[15px]"
                  />
                ) : (
                  <p className="mt-1 text-[13px] text-[#4f5666] sm:text-[15px]">{renderValue(draft.memberId || draft.profile?.memberId)}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-5 sm:space-y-6">
            <div className="rounded-[28px] bg-white p-5 shadow-[0_8px_24px_rgba(25,30,60,0.04)] ring-1 ring-[#efeff3] sm:p-7">
              <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#6a42f5] sm:mb-4 sm:text-[12px]">
                Business Overview
              </div>

              {isEditing ? (
                <textarea
                  value={draft.about || ""}
                  onChange={(e) => updateDraft("about", e.target.value)}
                  className="min-h-[100px] w-full rounded-2xl border border-[#e8ebf2] px-3 py-2 text-[14px] outline-none focus:border-[#5b3df5] sm:min-h-[110px] sm:px-4 sm:py-3 sm:text-[16px]"
                />
              ) : (
                <p className="text-[14px] leading-7 text-[#616979] sm:text-[16px] sm:leading-8">{renderValue(draft.about)}</p>
              )}
            </div>

            <div className="grid gap-5 sm:gap-6 lg:grid-cols-2">
              <div className="rounded-[28px] bg-white p-5 shadow-[0_8px_24px_rgba(25,30,60,0.04)] ring-1 ring-[#efeff3] sm:p-7">
                <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#6a42f5] sm:mb-5 sm:text-[12px]">
                  Family Details
                </div>

                <div className="space-y-4 sm:space-y-5">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9aa2b0] sm:text-[11px]">Marital Status</p>
                    {isEditing ? (
                      <select
                        value={draft.profile?.family?.maritalStatus || "Single"}
                        onChange={(e) => updateDraft("profile.family.maritalStatus", e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-[#e8ebf2] px-2 py-2 text-[13px] outline-none focus:border-[#5b3df5] sm:mt-2 sm:px-4 sm:py-3 sm:text-[15px]"
                      >
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                      </select>
                    ) : (
                      <p className="mt-1 text-[13px] text-[#4f5666] sm:text-[15px]">{renderValue(draft.profile?.family?.maritalStatus)}</p>
                    )}
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9aa2b0] sm:text-[11px]">Member DOB</p>
                    {isEditing ? (
                      <input
                        type="date"
                        value={draft.profile?.dob || ""}
                        onChange={(e) => updateDraft("profile.dob", e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-[#e8ebf2] px-2 py-2 text-[13px] outline-none focus:border-[#5b3df5] sm:px-3 sm:py-2"
                      />
                    ) : (
                      <p className="mt-1 text-[13px] text-[#4f5666] sm:text-[15px]">{renderValue(draft.profile?.dob)}</p>
                    )}
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9aa2b0] sm:text-[11px]">Blood Group</p>
                    {isEditing ? (
                      <select
                        value={draft.profile?.bloodGroup || ""}
                        onChange={(e) => updateDraft("profile.bloodGroup", e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-[#e8ebf2] bg-white px-2 py-2 text-[13px] outline-none focus:border-[#5b3df5] sm:px-3 sm:py-2"
                      >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    ) : (
                      <p className="mt-1 text-[13px] text-[#4f5666] sm:text-[15px]">{renderValue(draft.profile?.bloodGroup)}</p>
                    )}
                  </div>

                  {draft.profile?.family?.maritalStatus === "Married" && (
                    <>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9aa2b0] sm:text-[11px]">Spouse Name</p>
                        {isEditing ? (
                          <input
                            value={draft.profile?.family?.spouse?.name || ""}
                            onChange={(e) => updateDraft("profile.family.spouse.name", e.target.value)}
                            className="mt-1 w-full rounded-2xl border border-[#e8ebf2] px-2 py-2 text-[13px] outline-none focus:border-[#5b3df5] sm:px-3 sm:py-2"
                          />
                        ) : (
                          <p className="mt-1 text-[13px] text-[#4f5666] sm:text-[15px]">{renderValue(draft.profile?.family?.spouse?.name)}</p>
                        )}
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9aa2b0] sm:text-[11px]">Spouse DOB</p>
                        {isEditing ? (
                          <input
                            type="date"
                            value={draft.profile?.family?.spouse?.dob || ""}
                            onChange={(e) => updateDraft("profile.family.spouse.dob", e.target.value)}
                            className="mt-1 w-full rounded-2xl border border-[#e8ebf2] px-2 py-2 text-[13px] outline-none focus:border-[#5b3df5] sm:px-3 sm:py-2"
                          />
                        ) : (
                          <p className="mt-1 text-[13px] text-[#4f5666] sm:text-[15px]">{renderValue(draft.profile?.family?.spouse?.dob)}</p>
                        )}
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9aa2b0] sm:text-[11px]">Spouse Blood Group</p>
                        {isEditing ? (
                          <select
                            value={draft.profile?.family?.spouse?.bloodGroup || ""}
                            onChange={(e) => updateDraft("profile.family.spouse.bloodGroup", e.target.value)}
                            className="mt-1 w-full rounded-2xl border border-[#e8ebf2] bg-white px-2 py-2 text-[13px] outline-none focus:border-[#5b3df5] sm:px-3 sm:py-2"
                          >
                            <option value="">Select Blood Group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                          </select>
                        ) : (
                          <p className="mt-1 text-[13px] text-[#4f5666] sm:text-[15px]">{renderValue(draft.profile?.family?.spouse?.bloodGroup)}</p>
                        )}
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9aa2b0] sm:text-[11px]">Anniversary</p>
                        {isEditing ? (
                          <input
                            type="date"
                            value={draft.profile?.family?.anniversary || ""}
                            onChange={(e) => updateDraft("profile.family.anniversary", e.target.value)}
                            className="mt-1 w-full rounded-2xl border border-[#e8ebf2] px-2 py-2 text-[13px] outline-none focus:border-[#5b3df5] sm:px-3 sm:py-2"
                          />
                        ) : (
                          <p className="mt-1 text-[13px] text-[#4f5666] sm:text-[15px]">{renderValue(draft.profile?.family?.anniversary)}</p>
                        )}
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9aa2b0] sm:text-[11px]">Children</p>
                        {isEditing ? (
                          <div className="mt-1 space-y-3 sm:mt-2">
                            <select
                              value={String(
                                draft.profile?.family?.childrenCount ??
                                  (draft.profile?.family?.children?.length ?? 0)
                              )}
                              onChange={(e) => {
                                const count = Number(e.target.value);
                                const currentChildren = draft.profile?.family?.children || [];
                                let nextChildren = [...currentChildren];

                                if (count === 0) nextChildren = [];
                                if (count === 1) nextChildren = [nextChildren[0] || { name: "", dob: "" }];
                                if (count === 2)
                                  nextChildren = [
                                    nextChildren[0] || { name: "", dob: "" },
                                    nextChildren[1] || { name: "", dob: "" },
                                  ];

                                updateDraft("profile.family.childrenCount", count);
                                updateDraft("profile.family.children", nextChildren);
                              }}
                              className="w-full rounded-2xl border border-[#e8ebf2] bg-white px-2 py-2 text-[13px] outline-none focus:border-[#5b3df5] sm:px-3 sm:py-2"
                            >
                              <option value="0">No Child</option>
                              <option value="1">1 Child</option>
                              <option value="2">2 Children</option>
                            </select>

                            {(draft.profile?.family?.children || []).map((child, index) => (
                              <div key={index} className="rounded-2xl bg-[#f5f6fa] px-3 py-3 sm:px-4 sm:py-4">
                                <p className="mb-2 text-[12px] font-semibold text-[#1f2430] sm:mb-3 sm:text-[13px]">
                                  Child {index + 1}
                                </p>

                                <div className="grid gap-2 sm:gap-3 md:grid-cols-2">
                                  <input
                                    value={child.name || ""}
                                    onChange={(e) => {
                                      const nextChildren = [...(draft.profile?.family?.children || [])];
                                      nextChildren[index] = {
                                        ...nextChildren[index],
                                        name: e.target.value,
                                      };
                                      updateDraft("profile.family.children", nextChildren);
                                    }}
                                    placeholder={`Child ${index + 1} Name`}
                                    className="w-full rounded-2xl border border-[#e8ebf2] bg-white px-2 py-2 text-[12px] outline-none focus:border-[#5b3df5] sm:px-3 sm:py-2 sm:text-[13px]"
                                  />

                                  <input
                                    type="date"
                                    value={child.dob || ""}
                                    onChange={(e) => {
                                      const nextChildren = [...(draft.profile?.family?.children || [])];
                                      nextChildren[index] = {
                                        ...nextChildren[index],
                                        dob: e.target.value,
                                      };
                                      updateDraft("profile.family.children", nextChildren);
                                    }}
                                    className="w-full rounded-2xl border border-[#e8ebf2] bg-white px-2 py-2 text-[12px] outline-none focus:border-[#5b3df5] sm:px-3 sm:py-2 sm:text-[13px]"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="mt-1 space-y-2 sm:mt-2">
                            {(draft.profile?.family?.children || []).length > 0 ? (
                              (draft.profile?.family?.children || []).map((child, index) => (
                                <div key={index} className="rounded-2xl bg-[#f5f6fa] px-3 py-2 sm:px-4 sm:py-3">
                                  <p className="text-[13px] font-semibold text-[#1f2430] sm:text-[14px]">{child.name}</p>
                                  <p className="mt-1 text-[12px] text-[#7c8393] sm:text-[13px]">DOB: {child.dob}</p>
                                </div>
                              ))
                            ) : (
                              <p className="text-[13px] text-red-500 sm:text-[14px]">Child details not added</p>
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="rounded-[28px] bg-white p-5 shadow-[0_8px_24px_rgba(25,30,60,0.04)] ring-1 ring-[#efeff3] sm:p-7">
                <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#6a42f5] sm:mb-5 sm:text-[12px]">
                  Business Details
                </div>

                <div className="space-y-4 sm:space-y-5">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9aa2b0] sm:text-[11px]">Business Name</p>
                    {isEditing ? (
                      <input
                        value={draft.profile?.business?.name || ""}
                        onChange={(e) => updateDraft("profile.business.name", e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-[#e8ebf2] px-2 py-2 text-[13px] outline-none focus:border-[#5b3df5] sm:px-3 sm:py-2"
                      />
                    ) : (
                      <p className="mt-1 text-[13px] text-[#4f5666] sm:text-[15px]">{renderValue(draft.profile?.business?.name)}</p>
                    )}
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9aa2b0] sm:text-[11px]">Business Contact No</p>
                    {isEditing ? (
                      <input
                        value={draft.profile?.business?.contactNo || ""}
                        onChange={(e) => updateDraft("profile.business.contactNo", e.target.value)}
                        placeholder="Enter business contact number"
                        className="mt-1 w-full rounded-2xl border border-[#e8ebf2] px-2 py-2 text-[13px] outline-none focus:border-[#5b3df5] sm:px-3 sm:py-2"
                      />
                    ) : (
                      <p className="mt-1 text-[13px] text-[#4f5666] sm:text-[15px]">{renderValue(draft.profile?.business?.contactNo)}</p>
                    )}
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9aa2b0] sm:text-[11px]">Business Address</p>
                    {isEditing ? (
                      <textarea
                        value={draft.profile?.business?.address || ""}
                        onChange={(e) => updateDraft("profile.business.address", e.target.value)}
                        placeholder="Enter business address"
                        rows={2}
                        className="mt-1 w-full rounded-2xl border border-[#e8ebf2] px-2 py-2 text-[13px] outline-none focus:border-[#5b3df5] sm:px-3 sm:py-2 sm:text-[15px]"
                      />
                    ) : (
                      <p className="mt-1 text-[13px] leading-6 text-[#4f5666] sm:text-[15px] sm:leading-7">
                        {renderValue(draft.profile?.business?.address)}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9aa2b0] sm:text-[11px]">Business Email</p>
                    {isEditing ? (
                      <input
                        type="email"
                        value={draft.profile?.business?.email || ""}
                        onChange={(e) => updateDraft("profile.business.email", e.target.value)}
                        placeholder="Enter business email"
                        className="mt-1 w-full rounded-2xl border border-[#e8ebf2] px-2 py-2 text-[13px] outline-none focus:border-[#5b3df5] sm:px-3 sm:py-2"
                      />
                    ) : (
                      <p className="mt-1 text-[13px] text-[#4f5666] sm:text-[15px]">{renderValue(draft.profile?.business?.email)}</p>
                    )}
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9aa2b0] sm:text-[11px]">Google Map Location</p>
                    {isEditing ? (
                      <input
                        value={draft.profile?.business?.mapLocation || ""}
                        onChange={(e) => updateDraft("profile.business.mapLocation", e.target.value)}
                        placeholder="Paste Google Maps URL"
                        className="mt-1 w-full rounded-2xl border border-[#e8ebf2] px-2 py-2 text-[13px] outline-none focus:border-[#5b3df5] sm:px-3 sm:py-2"
                      />
                    ) : draft.profile?.business?.mapLocation ? (
                      <a
                        href={draft.profile.business.mapLocation}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-flex items-center gap-1 text-[13px] font-medium text-[#5b3df5] sm:gap-2 sm:text-[15px]"
                      >
                        Open Location <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                      </a>
                    ) : (
                      <p className="mt-1 text-[13px] text-red-500 sm:text-[15px]">Map location not added</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] bg-white p-5 shadow-[0_8px_24px_rgba(25,30,60,0.04)] ring-1 ring-[#efeff3] sm:p-7">
              <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#6a42f5] sm:mb-5 sm:text-[12px]">
                Visiting Card
              </div>

              {isEditing ? (
                <div className="space-y-3 sm:space-y-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const base64 = await fileToBase64(file);
                      updateDraft("profile.business.visitingCardImage", base64);
                    }}
                    className="block w-full text-[12px] sm:text-[14px]"
                  />

                  {draft.profile?.business?.visitingCardImage ? (
                    <div className="relative overflow-hidden rounded-[24px]">
                      <img
                        src={draft.profile.business.visitingCardImage}
                        className="max-h-[280px] w-full object-contain bg-[#f8f9fc] sm:max-h-[320px]"
                      />
                      <button
                        onClick={() => updateDraft("profile.business.visitingCardImage", "")}
                        className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-[10px] sm:right-3 sm:top-3 sm:h-7 sm:w-7 sm:text-[12px]"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <p className="text-[13px] text-[#7c8393] sm:text-[14px]">Upload visiting card image</p>
                  )}
                </div>
              ) : draft.profile?.business?.visitingCardImage ? (
                <div className="overflow-hidden rounded-[24px]">
                  <img
                    src={draft.profile.business.visitingCardImage}
                    alt="Visiting Card"
                    className="max-h-[280px] w-full object-contain bg-[#f8f9fc] sm:max-h-[320px]"
                  />
                </div>
              ) : (
                <div className="rounded-2xl bg-[#f7f8fb] px-3 py-6 text-center text-[13px] text-red-500 sm:px-4 sm:py-10 sm:text-[14px]">
                  Visiting card not uploaded.
                </div>
              )}
            </div>

            <div className="rounded-[28px] bg-white p-5 shadow-[0_8px_24px_rgba(25,30,60,0.04)] ring-1 ring-[#efeff3] sm:p-7">
              <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6a42f5] sm:text-[12px]">
                  Business Gallery
                </div>

                {!isEditing && (
                  <div className="flex items-center gap-1 sm:gap-2">
                    <button onClick={prevImage} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f6f7fb] text-[#5f6778] ring-1 ring-[#eceff5] sm:h-10 sm:w-10">‹</button>
                    <button onClick={nextImage} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f6f7fb] text-[#5f6778] ring-1 ring-[#eceff5] sm:h-10 sm:w-10">›</button>
                  </div>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-3 sm:space-y-4">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || []);
                      if (!files.length) return;
                      const base64Images = await Promise.all(files.slice(0, 4).map(fileToBase64));
                      updateDraft("profile.businessGallery", base64Images);
                    }}
                    className="block w-full text-[12px] sm:text-[14px]"
                  />

                  {(draft.profile?.businessGallery || []).length > 0 ? (
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3">
                      {(draft.profile.businessGallery || []).map((img, index) => (
                        <div key={index} className="relative">
                          <img src={img} className="h-16 w-full rounded-xl object-cover sm:h-20" />
                          <button
                            onClick={() => {
                              const updated = [...draft.profile.businessGallery];
                              updated.splice(index, 1);
                              updateDraft("profile.businessGallery", updated);
                            }}
                            className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[8px] sm:h-5 sm:w-5 sm:text-[10px]"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[13px] text-[#7c8393] sm:text-[14px]">Upload up to 4 images</p>
                  )}
                </div>
              ) : gallery.length > 0 ? (
                <>
                  <div className="overflow-hidden rounded-[24px]">
                    <img src={gallery[activeImage]} alt="Business" className="h-[240px] w-full object-cover sm:h-[320px]" />
                  </div>

                  <div className="mt-3 grid grid-cols-4 gap-2 sm:mt-4 sm:gap-3">
                    {gallery.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImage(index)}
                        className={`overflow-hidden rounded-2xl ring-2 ${
                          activeImage === index ? "ring-[#5b3df5]" : "ring-transparent"
                        }`}
                      >
                        <img src={image} alt={`thumb-${index}`} className="h-14 w-full object-cover sm:h-20" />
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="rounded-2xl bg-[#f7f8fb] px-3 py-6 text-center text-[13px] text-red-500 sm:px-4 sm:py-10 sm:text-[14px]">
                  No gallery images uploaded.
                </div>
              )}
            </div>

            <div className="rounded-[28px] bg-white p-5 shadow-[0_8px_24px_rgba(25,30,60,0.04)] ring-1 ring-[#efeff3] sm:p-7">
              <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#6a42f5] sm:mb-5 sm:text-[12px]">
                Social Media Links
              </div>

              {isEditing ? (
                <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                  {[
                    ["facebook", "Facebook"],
                    ["instagram", "Instagram"],
                    ["youtube", "YouTube"],
                    ["linkedin", "LinkedIn"],
                    ["pinterest", "Pinterest"],
                  ].map(([key, label]) => (
                    <div key={key}>
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#9aa2b0] sm:text-[11px]">
                        {label}
                      </p>
                      <input
                        value={draft.profile?.socialLinks?.[key] || ""}
                        onChange={(e) => updateDraft(`profile.socialLinks.${key}`, e.target.value)}
                        placeholder={`Enter ${label} URL`}
                        className="w-full rounded-2xl border border-[#e8ebf2] px-2 py-2 text-[12px] outline-none focus:border-[#5b3df5] sm:px-3 sm:py-2 sm:text-[14px]"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {[
                    ["Facebook", draft.profile?.socialLinks?.facebook],
                    ["Instagram", draft.profile?.socialLinks?.instagram],
                    ["YouTube", draft.profile?.socialLinks?.youtube],
                    ["LinkedIn", draft.profile?.socialLinks?.linkedin],
                    ["Pinterest", draft.profile?.socialLinks?.pinterest],
                  ].map(([label, link]) =>
                    link ? (
                      <a
                        key={label}
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-[#f3f4f8] px-3 py-1.5 text-[12px] font-semibold text-[#4f5666] sm:px-4 sm:py-2 sm:text-[13px]"
                      >
                        {label}
                      </a>
                    ) : (
                      <span
                        key={label}
                        className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-[12px] font-semibold text-red-500 sm:px-4 sm:py-2 sm:text-[13px]"
                      >
                        {label} not added
                      </span>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Monthly Progress Reports — ADMIN READ ONLY */}
            <div className="rounded-[28px] bg-white p-5 shadow-[0_8px_24px_rgba(25,30,60,0.04)] ring-1 ring-[#efeff3] sm:p-7">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f2efff] text-[#5b3df5]">
                    <ClipboardCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-[1.25rem] font-bold tracking-[-0.04em] text-[#1f2430]">Monthly Progress Reports</h3>
                    <p className="text-[12px] text-[#8b93a3]">Historical monthly data submitted by the member</p>
                  </div>
                </div>
              </div>

              {(draft.monthlyReports && draft.monthlyReports.length > 0) ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {[...draft.monthlyReports].reverse().map((report, idx) => {
                    const [year, month] = report.month.split('-');
                    const dateObj = new Date(year, month - 1);
                    return (
                      <div key={idx} className="group relative overflow-hidden rounded-[24px] border border-[#f0f2f5] bg-[#fbfcfe] p-5 transition hover:border-[#5b3df5]/30 hover:bg-white hover:shadow-md">
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-[#5b3df5]" />
                            <span className="text-[13px] font-bold text-[#1f2430]">
                              {dateObj.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </span>
                          </div>
                          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-emerald-600 ring-1 ring-emerald-100">
                            Verified
                          </span>
                        </div>
                        <div className="text-[13px] leading-relaxed text-[#4f5666] whitespace-pre-wrap">
                          {report.content}
                        </div>
                        <div className="mt-4 pt-3 border-t border-[#f0f2f5] text-[10px] font-medium text-[#9ca3af] italic">
                          Submitted on: {new Date(report.submittedAt).toLocaleDateString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-[24px] bg-[#f8f9fb] py-12 text-center ring-1 ring-[#f0f2f5]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#d1d5db] shadow-sm mb-3">
                    <ClipboardCheck className="h-6 w-6" />
                  </div>
                  <p className="text-[14px] font-medium text-[#6b7280]">No monthly reports submitted yet.</p>
                  <p className="mt-1 text-[12px] text-[#9ca3af]">Monthly data will appear here once the member submits it.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminHeader({ adminUser }) {
  const name = adminUser?.name || "Admin";
  const avatar = adminUser?.avatar;
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  
  return (
    <div className="flex items-center gap-3 rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-[#eceef4] sm:px-5 sm:py-2">
      {avatar && avatar !== ADMIN_MEMBER_AVATAR ? (
        <img src={avatar} alt={name} className="h-8 w-8 rounded-full border border-[#f0f2f5] object-cover sm:h-10 sm:w-10" />
      ) : (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5b3df5] text-white text-xs font-bold sm:h-10 sm:w-10">
          {initials}
        </div>
      )}
      <span className="text-[14px] font-bold text-[#1f2430] sm:text-[16px]">{name}</span>
    </div>
  );
}

let membersPageCache = null;
let membersPageCacheTime = 0;

function MembersPage({
  onLogout,
  onNavigate,
  activePage,
  showSettingsPage,
  setShowSettingsPage,
  defaultFilter,
  adminUser,
}) {
  const [selectedMember, setSelectedMember] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState(defaultFilter || "All");
  const [membersLoading, setMembersLoading] = useState(true);
  const [membersError, setMembersError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [globalWelcomeMessage, setGlobalWelcomeMessage] = useState("");
  const [globalBannerImage, setGlobalBannerImage] = useState("");
  const [isUpdatingWelcome, setIsUpdatingWelcome] = useState(false);

  useEffect(() => {
    const fetchWelcome = async () => {
      try {
        const headers = getAdminHeaders();
        const [welcomeRes, bannerRes] = await Promise.all([
          fetch("/api/settings/dashboard_welcome_message", { headers }),
          fetch("/api/settings/dashboard_banner_image", { headers })
        ]);
        
        if (welcomeRes.status === 401 || welcomeRes.status === 403 || bannerRes.status === 401 || bannerRes.status === 403) {
          clearAdminSessionStorage();
          onLogout();
          return;
        }

        if (welcomeRes.ok) {
          const welcomeData = await welcomeRes.json();
          setGlobalWelcomeMessage(welcomeData.value || "");
        }
        if (bannerRes.ok) {
          const bannerData = await bannerRes.json();
          setGlobalBannerImage(bannerData.value || "");
        }
      } catch (err) {
        console.error("Failed to fetch portal settings", err);
      }
    };
    fetchWelcome();
  }, [onLogout]);

  const handleUpdateWelcome = async () => {
    setIsUpdatingWelcome(true);
    try {
      const headers = getAdminHeaders();
      const [welcomeRes, bannerRes] = await Promise.all([
        fetch("/api/admin/settings/dashboard_welcome_message", {
          method: "PUT",
          headers,
          body: JSON.stringify({ value: globalWelcomeMessage })
        }),
        fetch("/api/admin/settings/dashboard_banner_image", {
          method: "PUT",
          headers,
          body: JSON.stringify({ value: globalBannerImage })
        })
      ]);

      if (welcomeRes.status === 401 || welcomeRes.status === 403 || bannerRes.status === 401 || bannerRes.status === 403) {
        clearAdminSessionStorage();
        onLogout();
        return;
      }

      if (welcomeRes.ok && bannerRes.ok) {
        alert("Portal settings updated for all members!");
      } else {
        alert("Failed to update some settings.");
      }
    } catch (err) {
      console.error("Update error", err);
      alert("Error updating portal settings.");
    } finally {
      setIsUpdatingWelcome(false);
    }
  };

  useEffect(() => {
    if (defaultFilter) {
      setSelectedTag(defaultFilter);
      setCurrentPage(1);
    }
  }, [defaultFilter]);

  useEffect(() => {
    const fetchMembers = async () => {
      if (membersPageCache && Date.now() - membersPageCacheTime < 60000) {
        setMembers(membersPageCache);
        setMembersLoading(false);
        return;
      }
      setMembersLoading(true);
      setMembersError("");

      try {
        const response = await fetch("/api/admin/members?limit=5000", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) || ""}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setMembersError(data.message || "Failed to fetch members.");
          if (response.status === 401 || response.status === 403) {
            clearAdminSessionStorage();
            onLogout();
          }
          return;
        }

        const uiMembers = (data.members || []).map(mapApiMemberToUi);
        setMembers(uiMembers);
        membersPageCache = uiMembers;
        membersPageCacheTime = Date.now();
      } catch (error) {
        console.error("Error fetching members:", error);
        setMembersError("Unable to load members right now.");
      } finally {
        setMembersLoading(false);
      }
    };

    fetchMembers();
  }, [onLogout]);

  const filteredMembers = useMemo(() => {
    let result = members;

    if (selectedTag !== "All") {
      result = result.filter((member) => (member.tags || []).includes(selectedTag));
    }

    const value = searchTerm.trim().toLowerCase();
    if (!value) return result;

    return result.filter((member) => {
      const text = [
        member.name,
        member.memberId,
        member.role,
        member.memberContribution,
        member.about,
        ...(member.tags || []),
        member.profile?.businessName,
        member.profile?.businessRole,
        member.profile?.email,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(value);
    });
  }, [members, searchTerm, selectedTag]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTag]);

  const itemsPerPage = 19;
  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / itemsPerPage));
  const paginatedMembers = filteredMembers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAddMember = (newMember) => {
    setMembers((prev) => {
      const nextMembers = [newMember, ...prev];
      membersPageCache = nextMembers;
      membersPageCacheTime = Date.now();
      return nextMembers;
    });
  };

  const handleDeleteMember = async (memberToDelete) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${memberToDelete.name}?`
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/admin/members/${memberToDelete.id || memberToDelete._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) || ""}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          clearAdminSessionStorage();
          onLogout();
          return;
        }
        alert(data.message || "Failed to delete member.");
        return;
      }

      setMembers((prev) => {
        const nextMembers = prev.filter(
          (member) => (member.id || member._id) !== (memberToDelete.id || memberToDelete._id)
        );
        membersPageCache = nextMembers;
        membersPageCacheTime = Date.now();
        return nextMembers;
      });

      if ((selectedMember?.id || selectedMember?._id) === (memberToDelete.id || memberToDelete._id)) {
        setSelectedMember(null);
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      alert("Unable to delete the member right now.");
    }
  };

  const handleSaveMember = async (updatedMember) => {
    try {
      const response = await fetch(`/api/admin/members/${updatedMember.id || updatedMember._id}`, {
        method: "PUT",
        headers: getAdminHeaders(),
        body: JSON.stringify(buildMemberUpdatePayload(updatedMember)),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          clearAdminSessionStorage();
          onLogout();
          return;
        }
        alert(data.message || "Failed to update member.");
        return;
      }

      const nextMember = mapApiMemberToUi(data.member);
      setMembers((prev) => {
        const nextMembers = prev.map((member) =>
          (member.id || member._id) === (nextMember.id || nextMember._id) ? nextMember : member
        );
        membersPageCache = nextMembers;
        membersPageCacheTime = Date.now();
        return nextMembers;
      });
      setSelectedMember(nextMember);
      alert("Member updated successfully.");
    } catch (error) {
      console.error("Error updating member:", error);
      alert("Unable to update the member right now.");
    }
  };

  return (
    <div className="bg-[#f4f5f7] text-[#1f2430]">
      <div className="flex">
        {/* Mobile menu button - moved to top-right */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="fixed top-4 right-4 z-50 rounded-full bg-[#5b3df5] p-3 text-white shadow-lg lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Sidebar - responsive */}
        <aside className={`fixed inset-y-0 left-0 z-40 w-[260px] transform border-r border-[#edf0f5] bg-[#f7f9fc] px-4 py-5 transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} sm:px-5 sm:py-6`}>
          <div className="flex h-full flex-col">
            <div>
              <SidebarBrand />

              <nav className="mt-8 space-y-1 sm:mt-10 sm:space-y-2">
                <SidebarItem
                  icon={LayoutDashboard}
                  label="Dashboard"
                  active={activePage === "dashboard"}
                  onClick={() => {
                    onNavigate("dashboard");
                    setMobileMenuOpen(false);
                  }}
                />
                <SidebarItem
                  icon={Users}
                  label="Members"
                  active={activePage === "members"}
                  onClick={() => {
                    onNavigate("members");
                    setMobileMenuOpen(false);
                  }}
                />
                <SidebarItem
                  icon={FolderKanban}
                  label={MEMBER_CLASSIFICATION_LABEL}
                  active={activePage === "Memberclassification"}
                  onClick={() => {
                    onNavigate("Memberclassification");
                    setMobileMenuOpen(false);
                  }}
                />
                <SidebarItem
                  icon={CalendarDays}
                  label="Events"
                  active={activePage === "events"}
                  onClick={() => {
                    onNavigate("events");
                    setMobileMenuOpen(false);
                  }}
                />
                <SidebarItem
                  icon={BarChart3}
                  label="Analytics"
                  active={activePage === "analytics"}
                  onClick={() => {
                    onNavigate("analytics");
                    setMobileMenuOpen(false);
                  }}
                />
                <SettingsToggleBlock
                  activePage={activePage}
                  onNavigate={(page) => {
                    onNavigate(page);
                    setMobileMenuOpen(false);
                  }}
                  showSettingsPage={showSettingsPage}
                  setShowSettingsPage={setShowSettingsPage}
                />
              </nav>
            </div>

            <button
              onClick={() => {
                onLogout();
                setMobileMenuOpen(false);
              }}
              className="mt-auto flex h-[50px] w-full items-center justify-center rounded-full bg-[#ff1a12] text-[14px] font-semibold text-white shadow-[0_20px_30px_rgba(255,26,18,0.22)] sm:h-[56px] sm:text-[16px]"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="relative z-10 flex-1 px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-7 xl:px-10">
          <section className="mb-8 rounded-[22px] bg-white p-6 shadow-sm ring-1 ring-[#eceef4]">
             <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-[#A0813D]" />
                <h2 className="text-lg font-bold text-[#1f2430]">Member Dashboard Global Message</h2>
             </div>
             <p className="text-sm text-[#6f7787] mb-4">Customize the welcome banner (text and background) for ALL members on their portal dashboard.</p>
             <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#9aa2b0]">Welcome Message</p>
                    <textarea 
                      className="w-full min-h-[120px] rounded-2xl border border-[#edf0f6] bg-[#f8f9fb] p-4 text-sm text-[#48505f] outline-none focus:border-[#5b3df5] transition-all"
                      value={globalWelcomeMessage}
                      onChange={(e) => setGlobalWelcomeMessage(e.target.value)}
                      placeholder="Enter the welcome message for all members..."
                    />
                </div>
                <div className="space-y-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#9aa2b0]">Banner Image URL</p>
                    <div className="flex flex-col gap-3">
                        <input 
                          type="text"
                          className="w-full rounded-full border border-[#edf0f6] bg-[#f8f9fb] px-5 py-3 text-sm text-[#48505f] outline-none focus:border-[#5b3df5] transition-all"
                          value={globalBannerImage}
                          onChange={(e) => setGlobalBannerImage(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                        />
                        {globalBannerImage && (
                          <div className="h-20 w-full overflow-hidden rounded-2xl border border-[#edf0f6] shadow-sm">
                            <img src={globalBannerImage} alt="Preview" className="h-full w-full object-cover" />
                          </div>
                        )}
                    </div>
                </div>
             </div>
             <div className="mt-6 flex justify-end">
                <button 
                  onClick={handleUpdateWelcome}
                  disabled={isUpdatingWelcome}
                  className="rounded-full bg-gradient-to-r from-[#A0813D] to-[#8B6D31] px-8 py-3 text-[14px] font-bold text-white shadow-[0_18px_30px_rgba(160,129,61,0.25)] hover:-translate-y-0.5 transition-all disabled:opacity-50"
                >
                  {isUpdatingWelcome ? "Saving Changes..." : "Update Portal Banner"}
                </button>
             </div>
          </section>

          <section className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-[1.6rem] font-bold tracking-[-0.05em] leading-none text-[#1f2430] sm:text-[1.8rem] lg:text-[2.2rem]">
                Members Directory
              </h1>
              <p className="mt-2 text-[13px] text-[#6f7787] sm:mt-3 sm:text-[14px] lg:text-[1rem]">
                Manage your directory members and add new profiles easily.
              </p>
              
              <div className="mt-5 flex h-[44px] w-full max-w-[320px] items-center gap-3 rounded-full bg-white px-4 shadow-sm ring-1 ring-[#eceef4] sm:mt-6 sm:h-[50px]">
                <Search className="h-3.5 w-3.5 text-[#9aa2b0] sm:h-4 sm:w-4" />
                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-[13px] text-[#4d5364] outline-none placeholder:text-[#b5b9c6] sm:text-[14px]"
                />
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 sm:items-end">
              <div className="flex items-center gap-3 sm:gap-4">
                <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#636b7b] shadow-sm ring-1 ring-[#eceef4] transition hover:bg-[#fafbff] sm:h-12 sm:w-12">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#5b3df5] sm:top-3.5 sm:right-3.5"></span>
                </button>
                <AdminHeader adminUser={adminUser} />
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#4e3ae9] to-[#6a42f5] px-6 py-2.5 text-[14px] font-semibold text-white shadow-[0_14px_22px_rgba(78,58,233,0.22)] transition hover:-translate-y-0.5 sm:w-auto sm:px-8 sm:py-3.5"
              >
                <span className="text-xl">+</span> Add Member
              </button>
            </div>
          </section>

          <div className="mt-4 flex flex-wrap gap-2 sm:mt-5 sm:gap-3">
            {MEMBER_FILTER_TAGS.map((tag) => (
  <button
    key={tag}
    type="button"
    onClick={() => setSelectedTag(tag)}
    className={`rounded-full px-4 py-2 text-[13px] font-semibold transition ${
      selectedTag === tag
        ? "bg-[#5b3df5] text-white shadow-[0_12px_24px_rgba(91,61,245,0.22)]"
        : "bg-white text-[#7b8494] ring-1 ring-[#e8ebf2] hover:text-[#1f2430]"
    }`}
  >
    {tag}
  </button>
))}
          </div>

          {membersError && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {membersError}
            </div>
          )}

          <section className="mt-5 grid gap-4 sm:mt-6 sm:gap-5 md:grid-cols-2 xl:grid-cols-4">
            {membersLoading ? (
              <div className="col-span-full rounded-[22px] bg-white px-6 py-10 text-center text-sm font-semibold text-[#6f7787] shadow-[0_8px_24px_rgba(25,30,60,0.04)] ring-1 ring-[#efeff3]">
                Loading members from the database...
              </div>
            ) : (
              paginatedMembers.map((member, index) => (
                <MemberCard
                  key={member.id || member._id || `${member.name}-${index}`}
                  member={member}
                  onViewProfile={setSelectedMember}
                  onDelete={handleDeleteMember}
                />
              ))
            )}

            {!membersLoading && filteredMembers.length === 0 && (
              <div className="col-span-full rounded-[22px] bg-white px-6 py-10 text-center text-sm font-semibold text-[#6f7787] shadow-[0_8px_24px_rgba(25,30,60,0.04)] ring-1 ring-[#efeff3]">
                No members matched the current filters.
              </div>
            )}

            <button
              onClick={() => setShowAddModal(true)}
              className="flex min-h-[340px] flex-col items-center justify-center rounded-[22px] border-2 border-dashed border-[#d7dbe4] bg-white px-4 py-5 text-center shadow-[0_8px_24px_rgba(25,30,60,0.04)] ring-1 ring-[#efeff3] transition hover:-translate-y-1 hover:border-[#5b3df5] sm:min-h-[370px] sm:px-5 sm:py-6"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f1edff] text-[1.8rem] font-bold text-[#5b3df5] sm:h-16 sm:w-16 sm:text-[2rem]">
                +
              </span>
              <h3 className="mt-3 text-[1.1rem] font-bold text-[#1f2430] sm:mt-4 sm:text-[1.2rem]">Add Member</h3>
              <p className="mt-2 max-w-[160px] text-[12px] leading-6 text-[#707785] sm:max-w-[180px] sm:text-[13px]">
                Click here to add a new member card dynamically.
              </p>
            </button>
          </section>

          <div className="mt-8 flex items-center justify-center gap-3 text-[14px] text-[#6f7787] sm:mt-10 sm:gap-4 sm:text-[16px]">
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#666f80] shadow-sm ring-1 ring-[#eceef4] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`flex h-8 w-8 items-center justify-center rounded-full shadow-md sm:h-9 sm:w-9 ${currentPage === i + 1 ? 'bg-[#4e3ae9] text-white' : 'bg-white text-[#666f80] ring-1 ring-[#eceef4] hover:bg-gray-50'}`}
              >
                {i + 1}
              </button>
            ))}

            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#666f80] shadow-sm ring-1 ring-[#eceef4] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </main>

        {selectedMember && (
          <MemberProfileModal
            member={selectedMember}
            onClose={() => setSelectedMember(null)}
            onSave={handleSaveMember}
          />
        )}

        {showAddModal && (
          <AddMemberModal
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddMember}
          />
        )}
      </div>
    </div>
  );
}

function StatCard({ item }) {
  const Icon = item.icon;
  return (
    <div className="rounded-[26px] bg-white px-4 py-4 shadow-[0_8px_24px_rgba(25,30,60,0.04)] ring-1 ring-[#efeff3] sm:px-5 sm:py-5 md:px-6">
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${item.iconWrap} sm:h-11 sm:w-11`}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        {item.badge ? (
          <div className={`rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none sm:px-3 sm:py-1 sm:text-[11px] ${item.badgeClass}`}>
            {item.badge}
          </div>
        ) : null}
      </div>
      <p className="mt-4 text-[13px] text-[#575d6b] sm:mt-5 sm:text-[15px]">{item.title}</p>
      <h3 className="mt-1 text-[1.8rem] font-bold tracking-[-0.04em] text-[#1f2430] sm:text-[2rem] md:text-[2.25rem]">{item.value}</h3>
    </div>
  );
}

function GrowthChart({ members = [] }) {
  const [selectedRange, setSelectedRange] = useState("this-year");
  
  const currentChart = useMemo(() => {
    if (!members || members.length === 0) {
      // Return a flat real chart if no members, to show true data (0) 
      // or we can just proceed, the logic below handles 0 members gracefully!
    }

    const now = new Date();
    let monthsToLookBack = 12;
    if (selectedRange === "last-2-years") monthsToLookBack = 24;
    if (selectedRange === "last-3-years") monthsToLookBack = 36;

    const monthlyCounts = {};
    members.forEach(m => {
      const d = m.createdAt ? new Date(m.createdAt) : new Date();
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      monthlyCounts[key] = (monthlyCounts[key] || 0) + 1;
    });

    let runningTotal = 0;
    const windowStart = new Date(now.getFullYear(), now.getMonth() - monthsToLookBack + 1, 1);
    members.forEach(m => {
      const d = m.createdAt ? new Date(m.createdAt) : new Date();
      if (d < windowStart) runningTotal++;
    });

    const rawPoints = [];
    const generatedLabels = [];
    
    const labelInterval = Math.floor(monthsToLookBack / 5);

    for (let i = monthsToLookBack - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      runningTotal += (monthlyCounts[key] || 0);
      rawPoints.push(runningTotal);

      if (i % labelInterval === 0 || i === 0) {
        if (i === 0) {
          generatedLabels.push("NOW");
        } else {
          generatedLabels.push(monthsToLookBack === 12 ? d.toLocaleString('en-US', { month: 'short' }).toUpperCase() : `${d.getFullYear()} ${d.toLocaleString('en-US', { month: 'short' }).toUpperCase()}`);
        }
      }
    }

    const maxVal = Math.max(...rawPoints, 10);
    const points = rawPoints.map((val, i) => ({
      x: (i / (rawPoints.length - 1)) * 100,
      y: 100 - ((val / maxVal) * 80)
    }));

    return {
      label: selectedRange,
      subtitle: `Real-time member growth (${members.length} total)`,
      points,
      labels: generatedLabels.slice(0, 6),
      markerIndex: points.length - 1
    };
  }, [members, selectedRange]);

  const path = useMemo(() => buildSmoothPath(currentChart.points, 1000, 260), [currentChart]);
  const markerPoint = currentChart.points[currentChart.markerIndex] || currentChart.points[0];
  const markerX = (markerPoint.x / 100) * 1000;
  const markerY = (markerPoint.y / 100) * 260;
  const ranges = [
    { key: "this-year", label: "This Year" },
    { key: "last-2-years", label: "Last 2 Years" },
    { key: "last-3-years", label: "Last 3 Years" },
  ];

  return (
    <div className="rounded-[30px] bg-white p-4 shadow-[0_8px_24px_rgba(25,30,60,0.04)] ring-1 ring-[#efeff3] sm:p-5 md:p-6 lg:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-[1.5rem] font-bold tracking-[-0.04em] text-[#1f2430] sm:text-[1.8rem] md:text-[2rem]">
            Member Growth
          </h3>
          <p className="mt-1 text-[13px] text-[#7d8493] sm:text-[14px] md:text-[15px]">
            {currentChart.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1 rounded-full bg-[#f1f2f6] p-1 text-[10px] font-semibold sm:text-[11px] md:text-[12px]">
          {ranges.map((range) => (
            <button
              key={range.key}
              type="button"
              onClick={() => setSelectedRange(range.key)}
              className={`rounded-full px-2 py-1 transition sm:px-3 sm:py-1.5 md:px-4 ${
                selectedRange === range.key
                  ? "bg-[#4c39ea] text-white shadow"
                  : "text-[#6f7787]"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-[18px] sm:mt-6 md:mt-7">
        <svg viewBox="0 0 1000 320" className="w-full overflow-visible">
          <defs>
            <linearGradient id="areaFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5b3df5" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#5b3df5" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path d={`${path} L 1000 290 L 0 290 Z`} fill="url(#areaFade)" />
          <path d={path} fill="none" stroke="#4f35ec" strokeWidth="5" strokeLinecap="round" />
          <circle cx={markerX} cy={markerY} r="6" fill="#4f35ec" />
          <line x1="0" y1="290" x2="1000" y2="290" stroke="#eceef4" strokeWidth="2" />
        </svg>

        <div className="mt-1 grid grid-cols-6 text-center text-[9px] font-bold tracking-[0.18em] text-[#8d93a2] sm:text-[10px] md:text-[11px]">
          {currentChart.labels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryDistribution() {
  return (
    <div className="rounded-[30px] bg-white p-4 shadow-[0_8px_24px_rgba(25,30,60,0.04)] ring-1 ring-[#efeff3] sm:p-5 md:p-6 lg:p-8">
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        <h3 className="text-[1.5rem] font-bold tracking-[-0.04em] text-[#1f2430] sm:text-[1.8rem] md:text-[2rem]">Category Distribution</h3>
        <button className="rounded-full p-1 text-[#737b8a] hover:bg-[#f4f5f8] sm:p-2">
          <MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>

      <div className="mt-5 space-y-4 sm:mt-6 sm:space-y-5 md:mt-8 md:space-y-6">
        {categoryData.map((item) => (
          <div key={item.name}>
            <div className="mb-2 flex items-center justify-between gap-2 text-[13px] font-medium text-[#363c48] sm:gap-3 sm:text-[14px] md:text-[15px]">
              <span>{item.name}</span>
              <span>{item.value}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#e5e8ef] sm:h-2.5">
              <div className={`h-full rounded-full bg-gradient-to-r ${item.color}`} style={{ width: `${item.value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentActivity({ members = [] }) {
  const logs = React.useMemo(() => {
    if (members && members.length > 0) {
      const latestMembers = [...members]
        .filter(m => m.createdAt)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4);

      return latestMembers.map((m, i) => {
        const timeDiff = Math.floor((new Date() - new Date(m.createdAt)) / 60000);
        let timeStr = timeDiff < 60 ? `${timeDiff} mins ago` : timeDiff < 1440 ? `${Math.floor(timeDiff/60)} hours ago` : `${Math.floor(timeDiff/1440)} days ago`;
        if (timeDiff === 0) timeStr = "Just now";

        return {
          id: m.id || m._id || i,
          name: m.name,
          action: "joined the directory as " + (m.membershipCategory || "Member"),
          time: timeStr,
          avatar: m.profile?.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(m.name) + "&background=random",
          dot: "bg-green-500"
        };
      });
    }
    return activityData;
  }, [members]);

  return (
    <div className="rounded-[30px] bg-[#f3f6f9] p-4 shadow-[0_8px_24px_rgba(25,30,60,0.03)] ring-1 ring-[#edf0f5] sm:p-5 md:p-6 lg:p-8">
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        <h3 className="text-[1.5rem] font-bold tracking-[-0.04em] text-[#1f2430] sm:text-[1.8rem] md:text-[2rem]">Recent Activity</h3>
        <button className="text-[12px] font-semibold text-[#4f35ec] sm:text-[13px]">View all</button>
      </div>

      <div className="mt-5 space-y-4 sm:mt-6 sm:space-y-5 md:mt-8">
        {logs.map((item) => (
          <div key={item.id} className="flex items-center gap-3 sm:gap-4">
            <div className="relative">
              <img src={item.avatar} alt={item.name} className="h-10 w-10 rounded-full object-cover sm:h-12 sm:w-12" />
              <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white sm:h-3.5 sm:w-3.5 ${item.dot}`} />
            </div>
            <div>
              <p className="text-[13px] text-[#505664] sm:text-[14px] md:text-[16px]">
                <span className="font-semibold text-[#1f2430]">{item.name}</span> {item.action}
              </p>
              <p className="mt-1 text-[11px] text-[#8b92a1] sm:text-[12px] md:text-[13px]">{item.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Hide Member Audit Needed section as requested */}
      {/* <div className="mt-6 rounded-[24px] border border-[#ddd9ff] bg-[linear-gradient(135deg,rgba(114,91,255,0.08),rgba(166,142,255,0.12))] p-4 sm:mt-8 sm:p-5">
        <h4 className="text-[1rem] font-bold text-[#4c39ea] sm:text-[1.1rem] md:text-[1.15rem]">Member Audit Needed</h4>
        <p className="mt-2 text-[12px] text-[#7a70dd] sm:text-[13px] md:text-[14px]">
          14 new members are pending verification to maintain directory quality.
        </p>
        <button className="mt-4 h-10 w-full rounded-xl bg-gradient-to-r from-[#4e3ae9] to-[#5f44f4] text-[12px] font-semibold text-white shadow-[0_16px_28px_rgba(78,58,233,0.25)] sm:mt-5 sm:h-12 sm:text-[13px] md:text-[14px]">
          Start Verification
        </button>
      </div> */}
    </div>
  );
}

function AnalyticsPage({ onLogout, onNavigate, activePage, showSettingsPage, setShowSettingsPage, adminUser }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [analytics, setAnalytics] = useState({
    categoryStats: [],
    segmentStats: [],
    revenue: 0,
    totalMembers: 0,
    loading: true
  });
  const [verticalCounts, setVerticalCounts] = useState({});

  useEffect(() => {
    fetchAnalytics();
    fetchVerticalCounts();
  }, []);

  const fetchVerticalCounts = async () => {
    try {
      const res = await fetch('/api/admin/events/vertical-counts', { headers: getAdminHeaders() });
      if (res.ok) {
        const data = await res.json();
        setVerticalCounts(data.counts || {});
      }
    } catch (e) { console.error('Vertical counts fetch error:', e); }
  };

  const fetchAnalytics = async () => {
    try {
      const authHeader = getAdminHeaders();
      const res = await fetch("/api/admin/analytics-complex", { headers: authHeader });
      const statsRes = await fetch("/api/admin/stats", { headers: authHeader });

      if (
        res.status === 401 ||
        res.status === 403 ||
        statsRes.status === 401 ||
        statsRes.status === 403
      ) {
        clearAdminSessionStorage();
        onLogout();
        return;
      }
      
      const data = await res.json();
      const statsData = await statsRes.json();
      
      if (res.ok && statsRes.ok) {
        setAnalytics({
          categoryStats: data.categoryStats || [],
          segmentStats: data.segmentStats || [],
          engagement: data.engagement || {
            metrics: [75, 82, 65, 45, 90], // fallback
            participationRate: 78
          },
          revenue: data.revenue || 0,
          totalMembers: statsData.totalMembers || 0,
          loading: false
        });
      }
    } catch (err) {
      console.error("Fetch analytics error:", err);
      setAnalytics(prev => ({ ...prev, loading: false }));
    }
  };
  return (
    <div className="min-h-screen bg-[#f4f5f7] text-[#1f2430]">
      <div className="flex min-h-screen">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="fixed top-4 right-4 z-50 rounded-full bg-[#5b3df5] p-3 text-white shadow-lg lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>

        <aside className={`fixed inset-y-0 left-0 z-40 w-[260px] transform border-r border-[#edf0f5] bg-[#f7f9fc] px-4 py-5 transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} sm:px-5 sm:py-6`}>
          <div className="flex h-full flex-col">
            <div>
              <SidebarBrand />

              <nav className="mt-8 space-y-1 sm:mt-10 sm:space-y-2">
                <SidebarItem
                  icon={LayoutDashboard}
                  label="Dashboard"
                  active={activePage === "dashboard"}
                  onClick={() => {
                    onNavigate("dashboard");
                    setMobileMenuOpen(false);
                  }}
                />
                <SidebarItem
                  icon={Users}
                  label="Members"
                  active={activePage === "members"}
                  onClick={() => {
                    onNavigate("members");
                    setMobileMenuOpen(false);
                  }}
                />
                <SidebarItem
                  icon={FolderKanban}
                  label={MEMBER_CLASSIFICATION_LABEL}
                  active={activePage === "Memberclassification"}
                  onClick={() => {
                    onNavigate("Memberclassification");
                    setMobileMenuOpen(false);
                  }}
                />
                <SidebarItem
                  icon={CalendarDays}
                  label="Events"
                  active={activePage === "events"}
                  onClick={() => {
                    onNavigate("events");
                    setMobileMenuOpen(false);
                  }}
                />
                <SidebarItem
                  icon={BarChart3}
                  label="Analytics"
                  active={activePage === "analytics"}
                  onClick={() => {
                    onNavigate("analytics");
                    setMobileMenuOpen(false);
                  }}
                />
                <SettingsToggleBlock
                  activePage={activePage}
                  onNavigate={(page) => {
                    onNavigate(page);
                    setMobileMenuOpen(false);
                  }}
                  showSettingsPage={showSettingsPage}
                  setShowSettingsPage={setShowSettingsPage}
                />
              </nav>
            </div>

            <button
              onClick={() => {
                onLogout();
                setMobileMenuOpen(false);
              }}
              className="mt-auto flex h-[50px] w-full items-center justify-center rounded-full bg-[#ff1a12] text-[14px] font-semibold text-white shadow-[0_20px_30px_rgba(255,26,18,0.22)] sm:h-[56px] sm:text-[16px]"
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="relative z-10 flex-1 px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-7 xl:px-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-[1.8rem] font-bold tracking-[-0.05em] leading-none sm:text-[2rem] md:text-[2.2rem] lg:text-[2.5rem]">
                Directory Analytics
              </h1>
              <p className="mt-1 text-[12px] text-[#8e95a3] sm:mt-2 sm:text-[13px] md:text-[14px]">
                Real-time ecosystem performance data
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4">
              <div className="flex h-[44px] flex-1 max-w-[320px] items-center gap-2 rounded-full bg-[#f1f3f7] px-3 ring-1 ring-[#eceff4] sm:h-[48px] sm:gap-3 sm:px-4 md:h-[52px]">
                <Search className="h-3.5 w-3.5 text-[#a3a9b6] sm:h-4 sm:w-4" />
                <input
                  placeholder="Search reports..."
                  className="w-full bg-transparent text-[12px] outline-none placeholder:text-[#b5bbc7] sm:text-[13px] md:text-[14px]"
                />
              </div>

              <div className="flex items-center gap-3 sm:gap-4">
                <button className="flex items-center gap-1 rounded-full bg-[#0f1739] px-3 py-2 text-[11px] font-semibold text-white shadow-[0_12px_20px_rgba(15,23,57,0.18)] transition hover:scale-105 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-[12px] md:px-5 md:py-3 md:text-[13px]">
                  <span>↓</span> Export
                </button>
                
                <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#636b7b] shadow-sm ring-1 ring-[#eceef4] transition hover:bg-[#fafbff] sm:h-12 sm:w-12">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#5b3df5] sm:top-3.5 sm:right-3.5"></span>
                </button>
                
                <AdminHeader adminUser={adminUser} />
              </div>
            </div>
          </div>

          <section className="mt-5 grid gap-4 sm:mt-6 sm:gap-5 md:grid-cols-3">
            <div className="rounded-[26px] bg-white px-4 py-4 shadow-[0_8px_24px_rgba(25,30,60,0.04)] ring-1 ring-[#efeff3] sm:px-5 sm:py-5 md:px-6 md:py-6">
              <div className="flex items-start justify-between gap-2 sm:gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8f96a4] sm:text-[11px] md:text-[12px]">
                    Total Membership
                  </p>
                  <div className="mt-3 sm:mt-4 md:mt-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a0a7b4] sm:text-[11px]">Active Base</p>
                    <h3 className="mt-1 text-[2.2rem] font-bold tracking-[-0.05em] text-[#141a2d] leading-none sm:mt-2 sm:text-[2.5rem] md:text-[3rem]">
                      {analytics.loading ? '...' : analytics.totalMembers.toLocaleString()}
                    </h3>
                  </div>
                  <div className="mt-3 flex items-end justify-between gap-3 sm:mt-4 sm:gap-4 md:mt-6">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a0a7b4] sm:text-[11px]">Growth</p>
                      <p className="mt-1 text-[1.5rem] font-bold tracking-[-0.04em] text-[#1f2430] leading-none sm:mt-2 sm:text-[1.8rem] md:text-[2rem]">
                        Portal Live
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#f1edff] text-[#5b3df5] sm:h-10 sm:w-10 md:h-11 md:w-11">
                  <Users className="h-4 w-4 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5" />
                </div>
              </div>
            </div>

            <div className="rounded-[26px] bg-white px-4 py-4 shadow-[0_8px_24px_rgba(25,30,60,0.04)] ring-1 ring-[#efeff3] sm:px-5 sm:py-5 md:px-6 md:py-6">
              <div className="flex items-start justify-between gap-2 sm:gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8f96a4] sm:text-[11px] md:text-[12px]">
                    Active Categories
                  </p>
                  <h3 className="mt-4 text-[2.2rem] font-bold tracking-[-0.05em] text-[#141a2d] sm:mt-5 sm:text-[2.5rem] md:mt-6 md:text-[3rem]">
                    {analytics.loading ? '...' : analytics.categoryStats.length}
                  </h3>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#f1edff] text-[#5b3df5] sm:h-10 sm:w-10 md:h-11 md:w-11">
                  <Zap className="h-4 w-4 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5" />
                </div>
              </div>
              <div className="mt-4 inline-flex rounded-full bg-[#f3edff] px-2 py-1 text-[10px] font-semibold text-[#6a42f5] sm:mt-5 sm:px-3 sm:py-1.5 sm:text-[11px] md:mt-6 md:text-[12px]">
                ● Diversity focus
              </div>
            </div>

            <div className="rounded-[26px] bg-white px-4 py-4 shadow-[0_8px_24px_rgba(25,30,60,0.04)] ring-1 ring-[#efeff3] sm:px-5 sm:py-5 md:px-6 md:py-6">
              <div className="flex items-start justify-between gap-2 sm:gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8f96a4] sm:text-[11px] md:text-[12px]">
                    Estimated Dues
                  </p>
                  <h3 className="mt-4 text-[2.2rem] font-bold tracking-[-0.05em] text-[#141a2d] sm:mt-5 sm:text-[2.5rem] md:mt-6 md:text-[3rem]">
                    ₹{analytics.loading ? '...' : analytics.revenue.toLocaleString()}
                  </h3>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#f1edff] text-[#5b3df5] sm:h-10 sm:w-10 md:h-11 md:w-11">
                  <TrendingUp className="h-4 w-4 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5" />
                </div>
              </div>
              <div className="mt-4 inline-flex rounded-full bg-[#f3edff] px-2 py-1 text-[10px] font-semibold text-[#6a42f5] sm:mt-5 sm:px-3 sm:py-1.5 sm:text-[11px] md:mt-6 md:text-[12px]">
                ↗ Based on standard fee
              </div>
            </div>
          </section>

          <section className="mt-5 grid gap-4 sm:mt-6 sm:gap-5 lg:grid-cols-2">
          <div className="rounded-[32px] bg-[linear-gradient(135deg,#ffffff_0%,#f7f4ff_52%,#eef4ff_100%)] p-5 shadow-[0_24px_60px_rgba(91,61,245,0.10)] ring-1 ring-[#ebe7ff] sm:p-6 md:p-7 lg:p-8">
              <div className="flex items-center justify-between">
                <h3 className="text-[1.3rem] font-bold tracking-[-0.04em] text-[#1f2430] sm:text-[1.5rem] md:text-[1.7rem] lg:text-[1.9rem]">
                  Categories of Members
                </h3>
              </div>
              <div className="mt-6 space-y-4">
                {analytics.categoryStats.length === 0 ? (
                  <p className="text-center text-[#8e95a3]">No data available</p>
                ) : analytics.categoryStats.map((item) => {
                  const perc = Math.round((item.value / analytics.totalMembers) * 100) || 0;
                  return (
                    <div key={item.name} className="group rounded-[24px] bg-white p-4 ring-1 ring-[#f0f2f7] transition hover:shadow-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r ${item.color}`} />
                          <span className="text-[15px] font-bold text-[#1f2430]">{item.name}</span>
                        </div>
                        <span className="text-[14px] font-bold text-[#5b3df5]">{item.value}</span>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#f1f3f7]">
                        <div className={`h-full bg-gradient-to-r ${item.color}`} style={{ width: `${perc}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[32px] bg-[linear-gradient(135deg,#ffffff_0%,#f7f5ff_55%,#eef4ff_100%)] p-5 shadow-[0_20px_50px_rgba(91,61,245,0.08)] ring-1 ring-[#ebe7ff] sm:p-6 md:p-7 lg:p-8">
              <div className="flex items-center justify-between">
                <h3 className="text-[1.3rem] font-bold tracking-[-0.04em] text-[#1f2430] sm:text-[1.5rem] md:text-[1.6rem] lg:text-[1.7rem]">
                  Member Segments
                </h3>
              </div>
              <div className="mt-6 space-y-4">
                {analytics.segmentStats.length === 0 ? (
                  <p className="text-center text-[#8e95a3]">No data available</p>
                ) : analytics.segmentStats.map((item) => {
                  const perc = Math.round((item.value / analytics.totalMembers) * 100) || 0;
                  return (
                    <div key={item.name} className="group rounded-[24px] bg-white p-4 ring-1 ring-[#f0f2f7] transition hover:shadow-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r ${item.color}`} />
                          <span className="text-[15px] font-bold text-[#1f2430]">{item.name}</span>
                        </div>
                        <span className="text-[14px] font-bold text-[#5b3df5]">{item.value}</span>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#f1f3f7]">
                        <div className={`h-full bg-gradient-to-r ${item.color}`} style={{ width: `${perc}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>


          <section className="mt-5 grid gap-4 sm:mt-6 sm:gap-5 lg:grid-cols-2">
            <div className="rounded-[30px] bg-white p-4 shadow-[0_8px_24px_rgba(25,30,60,0.04)] ring-1 ring-[#efeff3] sm:p-5 md:p-6 lg:p-7">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                <h3 className="text-[1.35rem] font-bold tracking-[-0.04em] text-[#1f2430] sm:text-[1.55rem] md:text-[1.7rem] lg:text-[1.9rem]">
                    User Engagement
                  </h3>
                 <p className="mt-1 text-[12px] text-[#7f8798] sm:text-[13px] md:text-[14px] lg:text-[15px]">
                    Multi-vector activity metrics
                  </p>
                </div>

              <div className="flex items-center rounded-full bg-white/80 p-1 text-[10px] font-bold text-[#7a8190] shadow-[0_8px_20px_rgba(91,61,245,0.08)] ring-1 ring-[#ece8ff] backdrop-blur sm:text-[11px] md:text-[12px]">
                  <button className="rounded-full px-3 py-1.5 transition-all hover:text-[#1f2430] sm:px-4">7D</button>
               <button className="rounded-full bg-gradient-to-r from-[#5b3df5] to-[#6f49f6] px-3 py-1.5 text-white shadow-[0_8px_20px_rgba(91,61,245,0.24)] sm:px-4">
                    30D
                  </button>
                </div>
              </div>

          <div className="mt-6 flex justify-center sm:mt-7 md:mt-8">
  <div className="rounded-[28px] bg-white/75 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_12px_30px_rgba(91,61,245,0.08)] ring-1 ring-[#ece8ff] backdrop-blur">
    <svg
      viewBox="0 0 220 220"
      className="h-[160px] w-[160px] sm:h-[180px] sm:w-[180px] md:h-[200px] md:w-[200px] lg:h-[210px] lg:w-[210px]"
    >
      <circle cx="110" cy="110" r="76" fill="none" stroke="#eceef4" />
      <circle cx="110" cy="110" r="48" fill="none" stroke="#eceef4" />
      {(() => {
        const metrics = analytics.engagement?.metrics || [75, 82, 65, 45, 90];
        const angles = [
          -Math.PI / 2,
          -Math.PI / 2 + (2 * Math.PI) / 5,
          -Math.PI / 2 + (4 * Math.PI) / 5,
          -Math.PI / 2 + (6 * Math.PI) / 5,
          -Math.PI / 2 + (8 * Math.PI) / 5,
        ];
        const pts = metrics.map((val, i) => {
          const r = (val / 100) * 76;
          return `${110 + r * Math.cos(angles[i])},${110 + r * Math.sin(angles[i])}`;
        });
        return (
          <>
            <polygon
              points={pts.join(" ")}
              fill="rgba(91,61,245,0.14)"
              stroke="#4f35ec"
              strokeWidth="3"
            />
            {pts.map((pt, i) => {
              const [cx, cy] = pt.split(",");
              return <circle key={i} cx={cx} cy={cy} r="4" fill="#4f35ec" />;
            })}
          </>
        );
      })()}
      <text x="95" y="22" fontSize="10" fill="#98a0ae">REVENUE</text>
      <text x="178" y="100" fontSize="10" fill="#98a0ae">POSTS</text>
      <text x="145" y="196" fontSize="10" fill="#98a0ae">REFERRALS</text>
      <text x="27" y="196" fontSize="10" fill="#98a0ae">UPGRADES</text>
      <text x="10" y="103" fontSize="10" fill="#98a0ae">LOGIN</text>
    </svg>
  </div>
</div>

              <div className="mt-5 flex items-end justify-between text-[12px] font-semibold text-[#565e6d] sm:mt-6 sm:text-[13px] md:mt-7 md:text-[14px]">
                <span>Overall Participation Rate</span>
                <span className="text-[1.5rem] font-bold tracking-[-0.04em] text-[#4f35ec] sm:text-[1.8rem] md:text-[2rem]">
                  {analytics.engagement?.participationRate || 78}%
                </span>
              </div>
                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/80 ring-1 ring-[#ece8ff] sm:mt-4">
  <div 
    className="h-full rounded-full bg-gradient-to-r from-[#4e3ae9] via-[#6a42f5] to-[#8b5cf6] shadow-[0_6px_16px_rgba(91,61,245,0.28)] transition-all duration-1000"
    style={{ width: `${analytics.engagement?.participationRate || 78}%` }}
  />
</div>

            </div>

            <div className="rounded-[32px] bg-[linear-gradient(135deg,#ffffff_0%,#f8f5ff_48%,#f2f7ff_100%)] p-5 shadow-[0_24px_60px_rgba(91,61,245,0.08)] ring-1 ring-[#ebe7ff] sm:p-6 md:p-7 lg:p-8">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
               <h3 className="text-[1.35rem] font-bold tracking-[-0.04em] text-[#1f2430] sm:text-[1.55rem] md:text-[1.7rem] lg:text-[1.85rem]">
                  Events Vertical
                </h3>
              <button
                onClick={() => onNavigate('events', 'All')}
                className="rounded-full bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#4f35ec] shadow-[0_8px_20px_rgba(91,61,245,0.10)] ring-1 ring-[#ece8ff] transition hover:-translate-y-0.5 sm:text-[11px] md:text-[12px]"
              >
                Detailed Report →
              </button>
              </div>

             <div className="mt-5 flex items-center justify-between rounded-[18px] bg-white/80 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#98a0ae] shadow-[0_8px_20px_rgba(25,30,60,0.04)] ring-1 ring-[#ece8ff] sm:mt-6 sm:text-[11px] md:mt-7 md:text-[12px]">
                <span>Vertical</span>
                <span className="text-right">Count</span>
              </div>

              <div className="mt-4 space-y-2 text-[13px] text-[#3c4350] sm:mt-5 sm:text-[14px] md:mt-6 md:text-[15px]">
                {[
                  "Management",
                  "Training",
                  "Business",
                  "Community Development",
                  "Public Relationship & Marketing",
                  "Growth & Development",
                  "Internationalism",
                  "Junior Jaycee",
                  "Lady Jaycee"
                ].map((verticalName) => {
                  const count = verticalCounts[verticalName] || 0;
                  const isClickable = count > 0;
                  return (
                    <div
                      key={verticalName}
                      onClick={() => isClickable && onNavigate('events', verticalName)}
                      className={`grid grid-cols-[1.6fr_0.5fr] items-center rounded-[20px] bg-white/70 px-4 py-3 shadow-[0_8px_20px_rgba(25,30,60,0.04)] ring-1 ring-transparent transition-all group ${
                        isClickable
                          ? 'hover:-translate-y-0.5 hover:bg-white hover:ring-[#e9e4ff] cursor-pointer'
                          : 'opacity-60'
                      }`}
                    >
                      <span className={`font-semibold text-[#2b3140] ${isClickable ? 'group-hover:text-[#5b3df5]' : ''}`}>
                        {verticalName}
                      </span>
                      <span className={`inline-flex min-w-[44px] items-center justify-center rounded-full px-3 py-1 font-bold ${
                        isClickable
                          ? 'bg-[#f4f0ff] text-[#5b3df5] group-hover:bg-[#ede7ff]'
                          : 'bg-[#f5f6f8] text-[#b0b8c8]'
                      }`}>
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="mt-5 rounded-[34px] bg-[linear-gradient(135deg,#0f153d_0%,#1d1d66_55%,#262669_100%)] p-5 text-white shadow-[0_24px_50px_rgba(15,21,61,0.24)] sm:mt-6 sm:p-6 md:p-7 lg:p-8 xl:p-10">
            <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-white/85 sm:gap-3 sm:px-4 sm:py-2 sm:text-[10px]">
                  AI Insights
                  <span className="h-px w-6 bg-white/20 sm:w-8 md:w-10" />
                </div>

                <h3 className="mt-5 text-[2rem] font-bold leading-[0.94] tracking-[-0.06em] sm:mt-6 sm:text-[2.5rem] md:mt-7 md:text-[3rem] lg:text-[3.5rem] xl:text-[4rem]">
                  Strategic Growth Opportunity
                </h3>

                <p className="mt-4 max-w-[520px] text-[14px] leading-7 text-white/82 sm:mt-5 sm:text-[15px] sm:leading-8 md:mt-6 md:text-[16px] md:leading-9 lg:text-[17px]">
                  Member retention in <span className="font-semibold text-white">Software Engineering</span> has peaked at 94%. We recommend deploying aggressive referral incentives for Q3.
                </p>

                <button className="mt-5 rounded-full bg-white px-5 py-2.5 text-[12px] font-semibold text-[#141a42] shadow-lg sm:mt-6 sm:px-6 sm:py-3 sm:text-[13px] md:mt-7 md:px-7 md:py-3.5 md:text-[14px] lg:mt-8 lg:px-8 lg:py-4">
                  Launch Campaign
                </button>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/8 p-5 backdrop-blur-sm sm:p-6 md:p-7">
                <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/70 sm:text-[11px] md:text-[12px]">
                  Predictive Model
                </div>

                <div className="mt-4 space-y-3 sm:mt-5 sm:space-y-3.5 md:mt-6 md:space-y-4">
                  <div className="h-2.5 rounded-full bg-white/10 sm:h-3">
                    <div className="h-full w-[72%] rounded-full bg-[#4f35ec]" />
                  </div>
                  <div className="h-2.5 rounded-full bg-white/10 sm:h-3">
                    <div className="h-full w-[56%] rounded-full bg-[#7d57ff]" />
                  </div>
                  <div className="h-2.5 rounded-full bg-white/10 sm:h-3">
                    <div className="h-full w-[36%] rounded-full bg-white/90" />
                  </div>
                </div>

                <div className="mt-6 text-[3rem] font-bold leading-none tracking-[-0.06em] sm:mt-7 sm:text-[3.5rem] md:mt-8 md:text-[3.8rem] lg:text-[4.2rem]">
                  94.2%
                </div>
                <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/62 sm:mt-2.5 sm:text-[11px] md:mt-3 md:text-[12px]">
                  Confidence Score
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function ChangePasswordModal({ onClose }) {
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch("/api/member/password", {
        method: "PUT",
        headers: getAdminHeaders(),
        body: JSON.stringify({
          currentPassword: passwords.oldPassword,
          newPassword: passwords.newPassword
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update password");
      
      alert(data.message || "Password updated successfully! An email notification has been sent.");
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm bg-black/40">
      <div className="w-full max-w-md overflow-hidden rounded-[32px] bg-white p-6 shadow-[0_24px_48px_rgba(0,0,0,0.15)] ring-1 ring-[#eef1f6] sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f2efff] text-[#5b3df5]">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="text-[1.3rem] font-bold tracking-[-0.04em] text-[#1f2430]">Change Password</h3>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-[#f4f6f9] transition">
            <X className="h-5 w-5 text-[#697386]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-[#9aa2b0]">Old Password</label>
            <input
              type="password"
              required
              value={passwords.oldPassword}
              onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
              className="w-full rounded-2xl border border-[#edf0f5] bg-[#f8faff] px-4 py-3.5 text-[14px] font-medium text-[#1f2430] outline-none transition focus:border-[#5b3df5] focus:ring-2 focus:ring-[#5b3df5]/10"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-[#9aa2b0]">New Password</label>
            <input
              type="password"
              required
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              className="w-full rounded-2xl border border-[#edf0f5] bg-[#f8faff] px-4 py-3.5 text-[14px] font-medium text-[#1f2430] outline-none transition focus:border-[#5b3df5] focus:ring-2 focus:ring-[#5b3df5]/10"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-[#9aa2b0]">Confirm New Password</label>
            <input
              type="password"
              required
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              className="w-full rounded-2xl border border-[#edf0f5] bg-[#f8faff] px-4 py-3.5 text-[14px] font-medium text-[#1f2430] outline-none transition focus:border-[#5b3df5] focus:ring-2 focus:ring-[#5b3df5]/10"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="mt-4 w-full rounded-full bg-[#5b3df5] py-3.5 text-[14px] font-bold text-white shadow-[0_12px_24px_rgba(91,61,245,0.22)] transition hover:bg-[#4e3ae9]"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}

function SettingsPage({ onLogout, onNavigate, activePage, showSettingsPage, setShowSettingsPage, adminUser, onAdminUpdate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    fullName: adminUser?.name || "",
    email: adminUser?.email || "",
    avatar: adminUser?.avatar || saran
  });
  const [portalConfig, setPortalConfig] = useState({
    welcomeMessage: "",
    bannerImage: ""
  });
  const [configLoading, setConfigLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchPortalConfig();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/member/profile", { headers: getAdminHeaders() });
      const data = await res.json();
      if (res.ok) {
        const uiMember = mapApiMemberToUi(data.member);
        setProfile({
          fullName: uiMember.name,
          email: uiMember.email || '',
          avatar: uiMember.avatar
        });
      }
    } catch (err) {
      console.error("Fetch profile error:", err);
    }
  };
  const fetchPortalConfig = async () => {
    try {
      const headers = getAdminHeaders();
      const [welcomeRes, bannerRes] = await Promise.all([
        fetch("/api/settings/dashboard_welcome_message", { headers }),
        fetch("/api/settings/dashboard_banner_image", { headers })
      ]);
      
      const welcome = welcomeRes.ok ? await welcomeRes.json() : { value: "" };
      const banner = bannerRes.ok ? await bannerRes.json() : { value: "" };
      
      setPortalConfig({
        welcomeMessage: welcome.value || "",
        bannerImage: banner.value || ""
      });
    } catch (err) {
      console.error("Fetch portal config error:", err);
    }
  };

  const handleSavePortalConfig = async () => {
    setConfigLoading(true);
    try {
      const headers = getAdminHeaders();
      const responses = await Promise.all([
        fetch("/api/admin/settings/dashboard_welcome_message", {
          method: "PUT",
          headers,
          body: JSON.stringify({ value: portalConfig.welcomeMessage })
        }),
        fetch("/api/admin/settings/dashboard_banner_image", {
          method: "PUT",
          headers,
          body: JSON.stringify({ value: portalConfig.bannerImage })
        })
      ]);
      
      if (responses.every(r => r.ok)) {
        alert("Portal configuration saved successfully!");
      } else {
        alert("Some settings failed to save.");
      }
    } catch (err) {
      alert("Connection error while saving settings.");
    } finally {
      setConfigLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const base64 = await fileToBase64(file);
      await saveProfile({ profile: { profileImage: base64 } });
    } catch (err) {
      alert("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!window.confirm("Remove profile picture?")) return;
    setLoading(true);
    try {
      await saveProfile({ profile: { profileImage: ADMIN_MEMBER_AVATAR } });
    } catch (err) {
      alert("Failed to remove image");
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (updates) => {
    setLoading(true);
    try {
      const res = await fetch("/api/member/profile", {
        method: "PUT",
        headers: getAdminHeaders(),
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (res.ok) {
        const updatedUser = mapApiMemberToUi(data.member);
        onAdminUpdate(updatedUser);
        localStorage.setItem("adminUser", JSON.stringify(updatedUser));
        setProfile({
          fullName: updatedUser.name,
          email: updatedUser.email || '',
          avatar: updatedUser.avatar
        });
        return true;
      } else {
        alert(data.message || "Failed to update profile");
        return false;
      }
    } catch (err) {
      alert("Connection error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleMembershipPayment = () => {
    alert("Redirecting to membership payment portal...");
  };

  const membershipPlans = [
    {
      title: "Member",
      amount: "₹1,500",
      note: "Standard annual membership",
    },
    {
      title: "LGB Member",
      amount: "₹3,000",
      note: "Leadership growth board membership",
    },
    {
      title: "JAC",
      amount: "₹2,000",
      note: "Junior chamber membership",
    },
  ];

  const [loginLogs, setLoginLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 30000); // 30s refresh
    return () => clearInterval(interval);
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/admin/login-logs", { headers: getAdminHeaders() });
      const data = await res.json();
      if (res.ok) {
        setLoginLogs(data.logs.map(log => ({
          user: log.name,
          event: "Portal Access",
          time: new Date(log.lastLogin).toLocaleString(),
          status: "Logged In"
        })));
      }
    } catch (err) {
      console.error("Fetch logs error:", err);
    }
  };

  const handleSaveProfile = async () => {
    if (profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      alert('Please enter a valid email address.');
      return;
    }
    const success = await saveProfile({ 
      name: profile.fullName, 
      email: profile.email,
      profile: { email: profile.email }
    });
    if (success) {
      alert("Changes saved successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-[#eef2f8] text-[#1f2430]">
      <div className="flex min-h-screen">
        {isChangePasswordModalOpen && <ChangePasswordModal onClose={() => setIsChangePasswordModalOpen(false)} />}
        
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="fixed right-4 top-4 z-50 rounded-full bg-[#5b3df5] p-3 text-white shadow-[0_18px_30px_rgba(91,61,245,0.30)] lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>

        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/30 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-40 w-[270px] transform border-r border-[#edf0f5] bg-[#f7f9fc] px-4 py-5 transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 sm:px-5 sm:py-6 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">
            <div>
              <SidebarBrand />

              <nav className="mt-8 space-y-1 sm:mt-10 sm:space-y-2">
                <SidebarItem
                  icon={LayoutDashboard}
                  label="Dashboard"
                  active={activePage === "dashboard"}
                  onClick={() => {
                    onNavigate("dashboard");
                    setMobileMenuOpen(false);
                  }}
                />
                <SidebarItem
                  icon={Users}
                  label="Members"
                  active={activePage === "members"}
                  onClick={() => {
                    onNavigate("members");
                    setMobileMenuOpen(false);
                  }}
                />
                <SidebarItem
                  icon={FolderKanban}
                  label={MEMBER_CLASSIFICATION_LABEL}
                  active={activePage === "Memberclassification"}
                  onClick={() => {
                    onNavigate("Memberclassification");
                    setMobileMenuOpen(false);
                  }}
                />
                <SidebarItem
                  icon={CalendarDays}
                  label="Events"
                  active={activePage === "events"}
                  onClick={() => {
                    onNavigate("events");
                    setMobileMenuOpen(false);
                  }}
                />
                <SidebarItem
                  icon={BarChart3}
                  label="Analytics"
                  active={activePage === "analytics"}
                  onClick={() => {
                    onNavigate("analytics");
                    setMobileMenuOpen(false);
                  }}
                />

                <div className="mt-3 overflow-hidden rounded-[24px] border border-[#e8ebf3] bg-white shadow-[0_10px_24px_rgba(25,30,60,0.04)]">
                  <div className="flex items-center justify-between px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#f2efff] text-[#5b3df5]">
                        <Settings className="h-[18px] w-[18px]" />
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold text-[#1f2430] sm:text-[15px]">
                          Settings
                        </p>
                        <p className="text-[11px] text-[#8b93a3] sm:text-[12px]">
                          Page visibility
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const nextValue = !showSettingsPage;
                        setShowSettingsPage(nextValue);
                        if (!nextValue && activePage === "settings") {
                          onNavigate("dashboard");
                        }
                      }}
                      className={`relative h-7 w-14 rounded-full transition ${
                        showSettingsPage ? "bg-[#5b3df5]" : "bg-[#d7dbe7]"
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                          showSettingsPage ? "left-8" : "left-1"
                        }`}
                      />
                    </button>
                  </div>

                  {showSettingsPage && (
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate("settings");
                        setMobileMenuOpen(false);
                      }}
                      className={`flex w-full items-center justify-between border-t border-[#eef1f6] px-4 py-3 text-left transition ${
                        activePage === "settings"
                          ? "bg-[#f6f3ff] text-[#5442ef]"
                          : "text-[#697386] hover:bg-[#fafbff] hover:text-[#1e2430]"
                      }`}
                    >
                      <span className="flex items-center gap-3 text-[14px] font-medium sm:text-[15px]">
                        <Settings className="h-[18px] w-[18px]" />
                        Settings Page
                      </span>
                      {activePage === "settings" ? (
                        <span className="h-6 w-1 rounded-full bg-[#5b3df5]" />
                      ) : null}
                    </button>
                  )}
                </div>
              </nav>
            </div>

            <button
              onClick={() => {
                onLogout();
                setMobileMenuOpen(false);
              }}
              className="mt-auto flex h-[52px] w-full items-center justify-center rounded-full bg-[#ff1a12] text-[14px] font-semibold text-white shadow-[0_20px_30px_rgba(255,26,18,0.22)] sm:h-[56px] sm:text-[16px]"
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="relative z-10 flex-1 bg-[#eef2f8] px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-7 xl:px-10">
          <div className="mx-auto w-full max-w-[1450px]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-4 text-[13px] font-medium text-[#6f7787] sm:text-[14px] md:text-[15px]">
                <button className="font-semibold text-[#5b3df5]">Directory</button>
                <button>Analytics</button>
                <button>Resources</button>
                <button>Support</button>
              </div>

              <div className="flex items-center gap-3 sm:gap-4">
                <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#636b7b] shadow-[0_10px_24px_rgba(25,30,60,0.06)] ring-1 ring-[#eceef4] transition hover:bg-[#fafbff] sm:h-12 sm:w-12">
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#5b3df5] sm:right-3.5 sm:top-3.5"></span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate("settings")}
                  className="flex items-center gap-3 rounded-full bg-white px-3 py-1.5 shadow-[0_10px_24px_rgba(25,30,60,0.06)] ring-1 ring-[#eceef4] transition hover:bg-[#fafbff] sm:px-5 sm:py-2"
                >
                  <AdminHeader adminUser={adminUser} />
                </button>
              </div>
            </div>

            <section className="mt-6 rounded-[32px] bg-gradient-to-br from-[#ffffff] via-[#f9faff] to-[#f3f5ff] px-5 py-6 shadow-[0_20px_50px_rgba(25,30,60,0.08)] ring-1 ring-[#e9edf6] sm:px-6 sm:py-7 lg:px-8 lg:py-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="inline-flex rounded-full bg-[#ede9ff] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#5b3df5] sm:text-[11px]">
                    Settings Workspace
                  </div>

                  <h1 className="mt-4 text-[2rem] font-bold leading-none tracking-[-0.05em] text-[#1f2430] sm:text-[2.5rem] md:text-[2.8rem] lg:text-[3rem]">
                    Profile Settings
                  </h1>

                  <p className="mt-2.5 max-w-[760px] text-[13px] text-[#6f7787] sm:text-[14px] md:text-[15px] lg:text-[16px]">
                    Manage your public presence and personal information across the Lumina Directory network.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[430px]">
                  <div className="rounded-[24px] bg-white/85 px-4 py-4 shadow-[0_10px_25px_rgba(25,30,60,0.05)] ring-1 ring-[#edf0f5] backdrop-blur">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#9aa2b0]">
                      Profile
                    </p>
                    <p className="mt-2 text-[1.35rem] font-bold tracking-[-0.04em] text-[#1f2430]">
                      Active
                    </p>
                  </div>

                  <div className="rounded-[24px] bg-white/85 px-4 py-4 shadow-[0_10px_25px_rgba(25,30,60,0.05)] ring-1 ring-[#edf0f5] backdrop-blur">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#9aa2b0]">
                      Security
                    </p>
                    <p className="mt-2 text-[1.35rem] font-bold tracking-[-0.04em] text-[#1f2430]">
                      Enabled
                    </p>
                  </div>

                  <div className="rounded-[24px] bg-white/85 px-4 py-4 shadow-[0_10px_25px_rgba(25,30,60,0.05)] ring-1 ring-[#edf0f5] backdrop-blur">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#9aa2b0]">
                      Membership
                    </p>
                    <p className="mt-2 text-[1.35rem] font-bold tracking-[-0.04em] text-[#1f2430]">
                      Renew
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-5 grid gap-5 lg:grid-cols-[1.12fr_0.88fr]">
              <div className="rounded-[30px] bg-white p-5 shadow-[0_18px_45px_rgba(25,30,60,0.07)] ring-1 ring-[#e9edf6] sm:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f2efff] text-[#5b3df5]">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-[1.25rem] font-bold tracking-[-0.04em] text-[#1f2430] sm:text-[1.4rem]">
                      Personal Profile
                    </h3>
                    <p className="text-[12px] text-[#8b93a3] sm:text-[13px]">
                      Public profile and account details
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                  <div className="flex flex-col items-center sm:items-start gap-4">
                    <div className="h-24 w-24 rounded-full border-4 border-[#f2efff] overflow-hidden shadow-md">
                       {profile.avatar && profile.avatar !== ADMIN_MEMBER_AVATAR ? (
                        <img src={profile.avatar} alt="Admin" className="h-full w-full object-cover" />
                       ) : (
                        <div className="h-full w-full flex items-center justify-center bg-[#5b3df5] text-white text-2xl font-bold">
                          {(profile.fullName || "A")[0].toUpperCase()}
                        </div>
                       )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <label className="cursor-pointer rounded-full bg-[#5b3df5] px-4 py-2 text-[12px] font-bold text-white shadow-[0_12px_24px_rgba(91,61,245,0.22)] transition hover:bg-[#4e3ae9] sm:px-5 sm:text-[13px]">
                          Change Picture
                          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                        <button 
                          onClick={handleRemoveImage}
                          className="rounded-full bg-white px-4 py-2 text-[12px] font-bold text-[#f11a12] shadow-sm ring-1 ring-[#fdebeb] transition hover:bg-[#fff9f9] sm:px-5 sm:text-[13px]"
                        >
                          Remove
                        </button>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4 w-full">
                    <div>
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9aa2b0] sm:text-[11px]">
                        Full Name
                      </p>
                      <input
                        type="text"
                        value={profile.fullName}
                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                        className="w-full rounded-[20px] border border-[#edf0f5] bg-[#f8faff] px-4 py-3 text-[14px] font-semibold text-[#414958] outline-none transition focus:border-[#5b3df5] sm:px-5 sm:py-4 sm:text-[15px] md:text-[16px]"
                      />
                    </div>

                    <div>
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9aa2b0] sm:text-[11px]">
                        Email Address
                      </p>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        placeholder="Enter your email address"
                        className="w-full rounded-[20px] border border-[#edf0f5] bg-[#f8faff] px-4 py-3 text-[14px] font-semibold text-[#414958] outline-none transition focus:border-[#5b3df5] sm:px-5 sm:py-4 sm:text-[15px] md:text-[16px]"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSaveProfile}
                    className="rounded-full bg-gradient-to-r from-[#4e3ae9] to-[#6a42f5] px-6 py-3 text-[13px] font-semibold text-white shadow-[0_18px_30px_rgba(78,58,233,0.25)] sm:px-7 sm:py-3.5 sm:text-[14px]"
                  >
                    Save Profile Changes
                  </button>
                </div>
              </div>

              <div className="rounded-[30px] bg-gradient-to-br from-[#5b3df5] via-[#6848fb] to-[#7d56ff] p-5 text-white shadow-[0_24px_50px_rgba(91,61,245,0.28)] ring-1 ring-white/10 sm:p-6">
                <div className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] sm:text-[11px]">
                  Membership Payment
                </div>

                <h3 className="mt-5 text-[1.7rem] font-bold tracking-[-0.04em] sm:text-[1.9rem] md:text-[2.1rem]">
                  Pay your Membership
                </h3>

                <p className="mt-2 text-[13px] text-white/80 sm:text-[14px] md:text-[15px]">
                  Scan the QR or click pay to continue membership payment.
                </p>

                <div className="mt-5 flex justify-center rounded-[24px] bg-white/10 p-4 ring-1 ring-white/10 backdrop-blur">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=membership-payment"
                    alt="Membership Payment QR"
                    className="h-[130px] w-[130px] rounded-[22px] bg-white p-2 object-contain shadow-[0_14px_24px_rgba(0,0,0,0.18)] sm:h-[145px] sm:w-[145px]"
                  />
                </div>

                <button
                  onClick={handleMembershipPayment}
                  className="mt-6 w-full rounded-full bg-white px-5 py-3.5 text-[13px] font-semibold text-[#5b3df5] shadow-[0_14px_24px_rgba(255,255,255,0.16)] sm:text-[14px]"
                >
                  Pay
                </button>
              </div>
            </section>

            <section className="mt-5 grid gap-4 md:grid-cols-3">
              {membershipPlans.map((plan) => (
                <div
                  key={plan.title}
                  className="rounded-[28px] bg-white p-5 shadow-[0_16px_35px_rgba(25,30,60,0.06)] ring-1 ring-[#e9edf6] sm:p-6"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#9aa2b0]">
                        Membership Type
                      </p>
                      <h4 className="mt-3 text-[1.4rem] font-bold tracking-[-0.04em] text-[#1f2430] sm:text-[1.55rem]">
                        {plan.title}
                      </h4>
                    </div>
                    <div className="rounded-2xl bg-[#f2efff] px-3 py-2 text-[11px] font-bold text-[#5b3df5]">
                      Active
                    </div>
                  </div>

                  <p className="mt-4 text-[2rem] font-bold leading-none tracking-[-0.06em] text-[#5b3df5] sm:text-[2.25rem]">
                    {plan.amount}
                  </p>

                  <p className="mt-4 text-[13px] leading-6 text-[#7a8190] sm:text-[14px]">
                    {plan.note}
                  </p>
                </div>
              ))}
            </section>

            <section className="mt-5 grid gap-5 lg:grid-cols-[1.08fr_1fr]">
              <div className="rounded-[30px] bg-white p-5 shadow-[0_18px_45px_rgba(25,30,60,0.07)] ring-1 ring-[#e9edf6] sm:p-6 lg:p-7">
                <div className="flex items-center gap-3 text-[#5b3df5]">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f2efff]">
                    <Lock className="h-5 w-5" />
                  </div>
                  <h3 className="text-[1.35rem] font-bold tracking-[-0.04em] text-[#1f2430] sm:text-[1.55rem] lg:text-[1.7rem]">
                    Security & Authentication
                  </h3>
                </div>

                <div className="mt-5 rounded-[24px] border border-[#edf0f5] bg-[#f8faff] px-4 py-4 sm:px-5 sm:py-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[14px] font-semibold text-[#2a3140] sm:text-[15px] md:text-[16px]">
                        Two-Factor Authentication
                      </p>
                      <p className="mt-1 text-[12px] text-[#7a8190] sm:text-[13px] md:text-[14px]">
                        Add an extra layer of security to your account.
                      </p>
                    </div>

                    <div className="relative h-8 w-14 rounded-full bg-[#5b3df5] shadow-inner">
                      <span className="absolute right-1 top-1 h-6 w-6 rounded-full bg-white shadow" />
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <button
                    onClick={() => setIsChangePasswordModalOpen(true)}
                    className="rounded-[22px] border border-[#eceff5] bg-[#fafbff] px-5 py-4 text-[13px] font-semibold text-[#5f6778] transition hover:bg-white sm:text-[14px] md:text-[15px]"
                  >
                    Change Password
                  </button>
                  <button className="rounded-[22px] border border-[#eceff5] bg-[#fafbff] px-5 py-4 text-[13px] font-semibold text-[#5f6778] transition hover:bg-white sm:text-[14px] md:text-[15px]">
                    Logout All Devices
                  </button>
                </div>

                <div className="mt-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9aa2b0] sm:text-[11px]">
                    Event Login Logs
                  </p>

                  <div className="mt-4 space-y-4">
                    {loginLogs.map((log, index) => (
                      <div
                        key={`${log.user}-${index}`}
                        className="flex flex-col gap-3 rounded-[22px] border border-[#eef1f6] bg-[#fafbff] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
                      >
                        <div>
                          <p className="text-[13px] font-semibold text-[#303746] sm:text-[14px] md:text-[15px]">
                            {log.user}
                          </p>
                          <p className="mt-1 text-[11px] text-[#5f6778] sm:text-[12px] md:text-[13px]">
                            {log.event}
                          </p>
                          <p className="mt-1 text-[11px] text-[#8b92a1] sm:text-[12px]">
                            {log.time}
                          </p>
                        </div>

                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ${
                            log.status === "Logged In"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-rose-50 text-rose-600"
                          }`}
                        >
                          {log.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-[30px] bg-white p-5 shadow-[0_18px_45px_rgba(25,30,60,0.07)] ring-1 ring-[#e9edf6] sm:p-6 lg:p-7">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f2efff] text-[#5b3df5]">
                      <Bell className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-[1.3rem] font-bold tracking-[-0.04em] text-[#1f2430] sm:text-[1.45rem] md:text-[1.55rem]">
                        Alert Preferences
                      </h3>
                      <p className="text-[12px] text-[#8b93a3] sm:text-[13px]">
                        Choose how updates reach you
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 text-[13px] text-[#4f5666] sm:text-[14px] md:text-[15px]">
                    {[
                      { label: "Email Digest", active: true },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between rounded-[18px] border border-[#eef1f6] bg-[#fafbff] px-4 py-3"
                      >
                        <span>{item.label}</span>
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-md text-[10px] ${
                            item.active
                              ? "bg-[#5b3df5] text-white"
                              : "border border-[#dfe3ec] text-[#a0a7b5]"
                          }`}
                        >
                          {item.active ? "✓" : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[30px] bg-white p-5 shadow-[0_18px_45px_rgba(25,30,60,0.07)] ring-1 ring-[#e9edf6] sm:p-6 lg:p-7">
                  <div className="flex items-center gap-3 text-[#A0813D]">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F5F2EA]">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-[1.35rem] font-bold tracking-[-0.04em] text-[#1f2430] sm:text-[1.55rem] lg:text-[1.7rem]">
                        Portal Appearance
                      </h3>
                      <p className="text-[12px] text-[#8b93a3] sm:text-[13px]">
                        Customize the user portal dashboard
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-6">
                    <div>
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9aa2b0] sm:text-[11px]">
                        Dashboard Welcome Message
                      </p>
                      <textarea
                        value={portalConfig.welcomeMessage}
                        onChange={(e) => setPortalConfig({ ...portalConfig, welcomeMessage: e.target.value })}
                        rows={3}
                        className="w-full rounded-[20px] border border-[#edf0f5] bg-[#f8faff] px-4 py-3 text-[14px] font-semibold text-[#414958] outline-none transition focus:border-[#5b3df5] sm:px-5 sm:py-4 sm:text-[15px]"
                        placeholder="Enter the welcome message for members..."
                      />
                    </div>

                    <div>
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9aa2b0] sm:text-[11px]">
                        Dashboard Banner Image URL
                      </p>
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <input
                          type="text"
                          value={portalConfig.bannerImage}
                          onChange={(e) => setPortalConfig({ ...portalConfig, bannerImage: e.target.value })}
                          className="flex-1 rounded-[20px] border border-[#edf0f5] bg-[#f8faff] px-4 py-3 text-[14px] font-semibold text-[#414958] outline-none transition focus:border-[#5b3df5] sm:px-5 sm:py-4 sm:text-[15px]"
                          placeholder="https://images.unsplash.com/..."
                        />
                        {portalConfig.bannerImage && (
                          <div className="h-16 w-32 shrink-0 overflow-hidden rounded-xl border border-[#edf0f5]">
                            <img src={portalConfig.bannerImage} alt="Preview" className="h-full w-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleSavePortalConfig}
                        disabled={configLoading}
                        className="rounded-full bg-gradient-to-r from-[#A0813D] to-[#8B6D31] px-6 py-3 text-[13px] font-semibold text-white shadow-[0_18px_30px_rgba(160,129,61,0.25)] transition hover:-translate-y-0.5 disabled:opacity-50 sm:px-8 sm:text-[14px]"
                      >
                        {configLoading ? "Saving..." : "Update Portal Settings"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function EventsPage({
  onLogout,
  onNavigate,
  activePage,
  showSettingsPage,
  setShowSettingsPage,
  eventCategoryFilter = "All",
  setEventCategoryFilter,
  adminUser,
}) {
  const [eventStep, setEventStep] = useState(1);

    const [eventForm, setEventForm] = useState({
    eventName: "",
    vertical: "Management",
    idType: "",
    date: "",
    time: "",
    program: "",
    venue: "",
    chiefGuest: "",
    guestOfHonor: "",
    facultySpeaker: "",
    banner: "",
    invitation: "",

    agendaItems: [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ],

    chiefGuestId: "",
    guestOfHonorId: "",
    facultySpeakerId: "",
    zoneNationalPerson: "",
    eventOverview: "",
    eventGallery: [],
    secretaryName: "",
    secretarySignature: "",
    secretaryPerson: "Secretary",

    managementAgenda: {
  officeSecretary: "",
  officeRecipient: "",
  noticeMeetingName: "",
  noticeDateTime: "",
  noticeVenue: "",
  hostInfo: "",

  item1: "",
  item2: "",
  item3: "",
  item4: "",
  item5: "",
  item6: "",
  item7Main: "",
  item7MovedBy: "",
  item7SecondedBy: "",
  item8Main: "",
  item8MovedBy: "",
  item8SecondedBy: "",
  item9: "",
  item10: "",
  item11: "",
  item12: "",
  item13: "",
  item14: "",
  item15: "",
  item16: "",
 otherSubjects: [],
  item17: "",
  item18: "",
  item19: "",
  item20: "",
  item21: "",
},
  });

  const [bannerPreview, setBannerPreview] = useState("");
  const [invitationPreview, setInvitationPreview] = useState("");
  const [signaturePreview, setSignaturePreview] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [eventsSaving, setEventsSaving] = useState(false);
  const [liveEvents, setLiveEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);

  const resetEventForm = () => {
    setEventForm({
      eventName: '', vertical: 'Management', idType: '', date: '', time: '',
      program: '', venue: '', chiefGuest: '', guestOfHonor: '', facultySpeaker: '',
      banner: '', invitation: '', agendaItems: Array(14).fill(''),
      chiefGuestId: '', guestOfHonorId: '', facultySpeakerId: '',
      zoneNationalPerson: '', eventOverview: '', eventGallery: [],
      secretaryName: '', secretarySignature: '', secretaryPerson: 'Secretary',
      isPublic: false,
      managementAgenda: {
        officeSecretary: '', officeRecipient: '', noticeMeetingName: '',
        noticeDateTime: '', noticeVenue: '', hostInfo: '',
        item1:'',item2:'',item3:'',item4:'',item5:'',item6:'',
        item7Main:'',item7MovedBy:'',item7SecondedBy:'',
        item8Main:'',item8MovedBy:'',item8SecondedBy:'',
        item9:'',item10:'',item11:'',item12:'',item13:'',item14:'',item15:'',item16:'',
        otherSubjects:[],item17:'',item18:'',item19:'',item20:'',item21:'',
      },
    });
    setBannerPreview('');
    setInvitationPreview('');
    setSignaturePreview('');
    setEventStep(1);
    setIsEditing(false);
    setEditingEventId(null);
  };

  const handleEditClick = (event) => {
    setEventForm({
      eventName: event.eventName || '',
      vertical: event.vertical || 'Management',
      idType: event.idType || '',
      date: event.date || '',
      time: event.time || '',
      program: event.program || '',
      venue: event.venue || '',
      chiefGuest: event.chiefGuest || '',
      guestOfHonor: event.guestOfHonor || '',
      facultySpeaker: event.facultySpeaker || '',
      banner: event.banner || '',
      invitation: event.invitation || '',
      agendaItems: Array.isArray(event.agendaItems) ? [...event.agendaItems] : Array(14).fill(''),
      chiefGuestId: event.chiefGuestId || '',
      guestOfHonorId: event.guestOfHonorId || '',
      facultySpeakerId: event.facultySpeakerId || '',
      zoneNationalPerson: event.zoneNationalPerson || '',
      eventOverview: event.eventOverview || '',
      eventGallery: Array.isArray(event.eventGallery) ? [...event.eventGallery] : [],
      secretaryName: event.secretaryName || '',
      secretarySignature: event.secretarySignature || '',
      secretaryPerson: event.secretaryPerson || 'Secretary',
      isPublic: event.isPublic || false,
      managementAgenda: { ...event.managementAgenda } || {},
    });
    setBannerPreview(event.banner || '');
    setInvitationPreview(event.invitation || '');
    setSignaturePreview(event.secretarySignature || '');
    setIsEditing(true);
    setEditingEventId(event._id || event.id);
    setEventStep(1);
    setShowEventForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteEvent = async (id) => {
    if (!id) {
      alert('Event ID missing.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        alert('Event deleted successfully!');
        fetchEvents(eventCategoryFilter);
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete event.');
      }
    } catch (err) {
      console.error(err);
      alert('Connection error.');
    }
  };

  const handleTogglePublic = async (event) => {
    const id = event._id || event.id;
    const newStatus = !event.isPublic;
    
    try {
      let res = await fetch(`/api/admin/events/${id}/visibility`, {
        method: 'PATCH',
        headers: getAdminHeaders(),
        body: JSON.stringify({ isPublic: newStatus }),
      });

      if (res.status === 404) {
        res = await fetch(`/api/admin/events/${id}`, {
          method: 'PUT',
          headers: getAdminHeaders(),
          body: JSON.stringify({ ...event, isPublic: newStatus }),
        });
      }
      
      if (res.ok) {
        // Optimistic update or just refetch
        fetchEvents(eventCategoryFilter);
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to update event status.');
      }
    } catch (err) {
      console.error(err);
      alert('Connection error.');
    }
  };

  // Fetch events from backend (filtered by eventCategoryFilter)
  const fetchEvents = async (verticalFilter) => {
    setEventsLoading(true);
    try {
      const url = verticalFilter && verticalFilter !== 'All'
        ? `/api/admin/events?vertical=${encodeURIComponent(verticalFilter)}`
        : '/api/admin/events';
      const res = await fetch(url, { headers: getAdminHeaders() });
      if (res.status === 401 || res.status === 403) { onLogout(); return; }
      const data = await res.json();
      if (res.ok) setLiveEvents(data.events || []);
    } catch (e) { console.error('Fetch events error:', e); }
    finally { setEventsLoading(false); }
  };

  useEffect(() => { fetchEvents(eventCategoryFilter); }, [eventCategoryFilter]);

  // Auto-fill Management Agenda from Section 1 when user opens Step 2
  useEffect(() => {
    if (eventStep === 2 && eventForm.vertical === 'Management') {
      setEventForm(prev => ({
        ...prev,
        managementAgenda: {
          ...prev.managementAgenda,
          // Always auto-fill from section 1 to ensure updates propagate
          noticeDateTime: (prev.date && prev.time ? `${prev.date} at ${prev.time}` : prev.managementAgenda?.noticeDateTime),
          noticeVenue: prev.venue || '',
          hostInfo: prev.chiefGuest || prev.facultySpeaker || '',
          officeRecipient: prev.guestOfHonor || '',
        },
      }));
    }
  }, [eventStep]);

  const verticalOptions = [
    "Management",
    "Training",
    "Business",
    "Community Development",
    "Public Relationship & Marketing",
    "Growth & Development",
    "Internationalism",
    "Junior Jaycee",
    "Lady Jaycee",
  ];

  const agendaLabels = [
    "Meeting call to order",
    "JCI Creed",
    "Welcome Address",
    "Recognition",
    "Event chairman",
    "Introduction of Faculty",
    "Chief Guest Introduction",
    "Chief Guest address",
    "Floor Handed over to Faculty",
    "Floor Handed over to the Chair",
    "Feedback",
    "Pleasantries",
    "Announcements & Vote of Thanks",
    "Adjournment",
  ];

    const managementIdTypeOptions = ["LGB", "GB", "AGB"];

  const handleManagementAgendaChange = (key, value) => {
    setEventForm((prev) => ({
      ...prev,
      managementAgenda: {
        ...prev.managementAgenda,
        [key]: value,
      },
    }));
  };

  const addOtherSubjectField = () => {
  setEventForm((prev) => ({
    ...prev,
    managementAgenda: {
      ...prev.managementAgenda,
      otherSubjects: [
        ...(prev.managementAgenda.otherSubjects || []),
        "",
      ],
    },
  }));
};

const updateOtherSubjectField = (index, value) => {
  setEventForm((prev) => ({
    ...prev,
    managementAgenda: {
      ...prev.managementAgenda,
      otherSubjects: (prev.managementAgenda.otherSubjects || []).map((item, i) =>
        i === index ? value : item
      ),
    },
  }));
};

const removeOtherSubjectField = (index) => {
  setEventForm((prev) => ({
    ...prev,
    managementAgenda: {
      ...prev.managementAgenda,
      otherSubjects: (prev.managementAgenda.otherSubjects || []).filter(
        (_, i) => i !== index
      ),
    },
  }));
};

  const isEventCompleted = (event) => {
  if (!event?.date || !event?.time) return false;
  const eventDateTime = new Date(`${event.date}T${event.time}`);
  return new Date() > eventDateTime;
};

  const handleEventChange = (key, value) => {
    setEventForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleAgendaChange = (index, value) => {
    setEventForm((prev) => ({
      ...prev,
      agendaItems: prev.agendaItems.map((item, i) =>
        i === index ? value : item
      ),
    }));
  };

  const goToEventStep2 = () => {
    if (
      !eventForm.eventName.trim() ||
      !eventForm.vertical.trim() ||
      !eventForm.date.trim() ||
      !eventForm.time.trim() ||
      !eventForm.program.trim() ||
      !eventForm.venue.trim()
    ) {
      alert("Please fill all Event Details.");
      return;
    }

    if (eventForm.vertical === "Management" && !eventForm.idType.trim()) {
      alert("Please select ID Type.");
      return;
    }

    setEventStep(2);
  };


  const backToEventStep1 = () => {
    setEventStep(1);
  };

  const goToEventStep3 = () => {
    if (!eventForm.secretaryName.trim()) {
      alert("Please enter secretary name.");
      return;
    }
    setEventStep(3);
  };

  const backToEventStep2 = () => {
    setEventStep(2);
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setEventForm((prev) => ({ ...prev, banner: reader.result }));
      setBannerPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleInvitationUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setEventForm((prev) => ({ ...prev, invitation: reader.result }));
      setInvitationPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setEventForm((prev) => ({ ...prev, secretarySignature: reader.result }));
      setSignaturePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateEvent = async () => {
    setEventsSaving(true);
    try {
      const url = isEditing ? `/api/admin/events/${editingEventId}` : '/api/admin/events';
      const method = isEditing ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method: method,
        headers: getAdminHeaders(),
        body: JSON.stringify(eventForm),
      });
      const data = await res.json();
      if (res.ok) {
        alert(isEditing ? 'Event updated successfully!' : 'Event created successfully!');
        resetEventForm();
        setShowEventForm(false);
        // Refresh Active Schedule
        await fetchEvents(eventCategoryFilter);
      } else {
        alert(data.message || 'Failed to process event.');
      }
    } catch (err) {
      console.error(err);
      alert('Connection error. Is the server running?');
    } finally {
      setEventsSaving(false);
    }
  };

  const handleEventGalleryUpload = async (e) => {
  const files = Array.from(e.target.files || []);
  if (!files.length) return;

  const converted = await Promise.all(
    files.slice(0, 6).map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    )
  );

  setEventForm((prev) => ({
    ...prev,
    eventGallery: converted,
  }));
};

   const eventCards = [
    {
      id: 1,
      title: "Annual Strategy Session",
      eventName: "Annual Strategy Session",
      image:
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
      status: "Completed",
      statusClass: "bg-emerald-100 text-emerald-700",
      tag: "Management",
      tagClass: "bg-[#eef2ff] text-[#5b3df5]",
      meta: "Madurai • 10:00 AM • Apr 10, 2026",
      vertical: "Management",
      date: "2026-04-10",
      time: "10:00",
      program: "Annual Strategy Session",
      venue: "Madurai",
      chiefGuest: "Mr. Senthil Kumar",
      guestOfHonor: "Mr. Rajesh Babu",
      chiefGuestId: "CG-1001",
      guestOfHonorId: "GH-1002",
      facultySpeaker: "Mr. Arun Prakash",
      facultySpeakerId: "FS-1003",
      zoneNationalPerson: "Zone President",
      eventOverview:
        "A strategic leadership meeting focused on annual goals, membership planning, chapter growth, and executive alignment for the upcoming cycle.",
      eventGallery: [
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
      ],
    },
 {
  id: 2,
  title: "Leadership Excellence Program",
  eventName: "Leadership Excellence Program",
  image:
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80",
  status: "Completed",
  statusClass: "bg-emerald-100 text-emerald-700",
  tag: "Training",
  tagClass: "bg-[#eef2ff] text-[#5b3df5]",
  meta: "Chennai • 02:30 PM • Apr 05, 2026",
  vertical: "Training",
  date: "2026-04-05",
  time: "14:30",
  program: "Leadership Excellence Program",
  venue: "Chennai",
  chiefGuest: "Dr. Karthik Raman",
  guestOfHonor: "Ms. Priya Devi",
  chiefGuestId: "CG-2001",
  guestOfHonorId: "GH-2002",
  facultySpeaker: "Dr. Elena Vance",
  facultySpeakerId: "FS-2003",
  zoneNationalPerson: "National Trainer",
  eventOverview:
    "An intensive workshop designed to build leadership confidence, public speaking, decision-making, and team management skills among members.",
  eventGallery: [
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80",
  ],
},
    {
      id: 3,
      title: "MSME Connect Program",
      eventName: "MSME Connect Program",
      image:
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",
      status: "Upcoming",
      statusClass: "bg-sky-100 text-sky-700",
      tag: "Business",
      tagClass: "bg-[#eef2ff] text-[#5b3df5]",
      meta: "Coimbatore • 11:30 AM • May 06, 2026",
      vertical: "Business",
      date: "2026-05-06",
      time: "11:30",
      program: "MSME Connect Program",
      venue: "Coimbatore",
      chiefGuest: "Mr. Mohan Raj",
      guestOfHonor: "Mrs. Keerthana",
      chiefGuestId: "CG-3001",
      guestOfHonorId: "GH-3002",
      facultySpeaker: "Ms. Priya Raman",
      facultySpeakerId: "FS-3003",
      zoneNationalPerson: "National Business Chairman",
      eventOverview:
        "A business networking summit connecting entrepreneurs, startups, and industry leaders to explore partnerships and local enterprise growth.",
      eventGallery: [
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
      ],
    },
  ];
  const filteredCards = liveEvents.map((ev) => ({
    id: ev._id,
    _id: ev._id,
    title: ev.eventName,
    eventName: ev.eventName,
    image: ev.banner ||
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80',
    status: (() => {
      const dt = new Date(`${ev.date}T${ev.time}`);
      return new Date() > dt ? 'Completed' : 'Upcoming';
    })(),
    statusClass: (() => {
      const dt = new Date(`${ev.date}T${ev.time}`);
      return new Date() > dt ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-100 text-sky-700';
    })(),
    tag: ev.vertical,
    tagClass: 'bg-[#eef2ff] text-[#5b3df5]',
    meta: `${ev.venue || 'TBD'} \u2022 ${ev.time} \u2022 ${ev.date}`,
    vertical: ev.vertical,
    date: ev.date,
    time: ev.time,
    program: ev.program,
    venue: ev.venue,
    chiefGuest: ev.chiefGuest,
    guestOfHonor: ev.guestOfHonor,
    chiefGuestId: ev.chiefGuestId,
    guestOfHonorId: ev.guestOfHonorId,
    facultySpeaker: ev.facultySpeaker,
    facultySpeakerId: ev.facultySpeakerId,
    zoneNationalPerson: ev.zoneNationalPerson,
    eventOverview: ev.eventOverview,
    eventGallery: ev.eventGallery || [],
    managementAgenda: ev.managementAgenda || {},
    agendaItems: ev.agendaItems || [],
    idType: ev.idType,
    secretaryName: ev.secretaryName,
    secretaryPerson: ev.secretaryPerson,
  }));

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-[#1f2430]">
      <div className="flex min-h-screen">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="fixed right-4 top-4 z-50 rounded-full bg-[#5b3df5] p-3 text-white shadow-lg lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>

        <aside
          className={`fixed inset-y-0 left-0 z-40 w-[260px] transform border-r border-[#edf0f5] bg-[#f7f9fc] px-4 py-5 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } sm:px-5 sm:py-6`}
        >
          <div className="flex h-full flex-col">
            <div>
              <SidebarBrand />

              <nav className="mt-8 space-y-1 sm:mt-10 sm:space-y-2">
                <SidebarItem
                  icon={LayoutDashboard}
                  label="Dashboard"
                  active={activePage === "dashboard"}
                  onClick={() => {
                    onNavigate("dashboard");
                    setMobileMenuOpen(false);
                  }}
                />
                <SidebarItem
                  icon={Users}
                  label="Members"
                  active={activePage === "members"}
                  onClick={() => {
                    onNavigate("members");
                    setMobileMenuOpen(false);
                  }}
                />
                <SidebarItem
                  icon={FolderKanban}
                  label={MEMBER_CLASSIFICATION_LABEL}
                  active={activePage === "Memberclassification"}
                  onClick={() => {
                    onNavigate("Memberclassification");
                    setMobileMenuOpen(false);
                  }}
                />
                <SidebarItem
                  icon={CalendarDays}
                  label="Events"
                  active={activePage === "events"}
                  onClick={() => {
                    onNavigate("events");
                    setMobileMenuOpen(false);
                  }}
                />
                <SidebarItem
                  icon={BarChart3}
                  label="Analytics"
                  active={activePage === "analytics"}
                  onClick={() => {
                    onNavigate("analytics");
                    setMobileMenuOpen(false);
                  }}
                />
                <SettingsToggleBlock
                  activePage={activePage}
                  onNavigate={(page) => {
                    onNavigate(page);
                    setMobileMenuOpen(false);
                  }}
                  showSettingsPage={showSettingsPage}
                  setShowSettingsPage={setShowSettingsPage}
                />
              </nav>
            </div>

            <button
              onClick={() => {
                onLogout();
                setMobileMenuOpen(false);
              }}
              className="mt-auto flex h-[50px] w-full items-center justify-center rounded-full bg-[#ff1a12] text-[14px] font-semibold text-white shadow-[0_20px_30px_rgba(255,26,18,0.22)] sm:h-[56px] sm:text-[16px]"
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="relative z-10 flex-1 px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-7 xl:px-8">
          <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-[1.8rem] font-bold tracking-[-0.05em] text-[#1f2430] sm:text-[2rem] md:text-[2.25rem]">
                  Event Planning
                </h1>
                <button
                  onClick={() => {
                    resetEventForm();
                    setShowEventForm(!showEventForm);
                  }}
                  className="mt-2 flex items-center gap-2 rounded-full bg-[#5b3df5] px-6 py-2.5 text-[14px] font-bold text-white shadow-lg transition-transform hover:scale-105"
                >
                  <Plus className="h-4 w-4" />
                  {showEventForm ? "Close Form" : "Add New Event"}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="flex h-[44px] min-w-[240px] flex-1 items-center gap-2 rounded-full bg-[#f4f5f8] px-3 ring-1 ring-[#eceff4] sm:h-[48px] sm:gap-3 sm:px-4">
                  <Search className="h-3.5 w-3.5 text-[#9aa2b0] sm:h-4 sm:w-4" />
                  <input
                    className="w-full bg-transparent text-[12px] text-[#48505f] outline-none placeholder:text-[#b0b6c2] sm:text-[13px] md:text-[14px]"
                    placeholder="Search events or guests..."
                  />
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                  <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#636b7b] shadow-sm ring-1 ring-[#eceef4] transition hover:bg-[#fafbff] sm:h-12 sm:w-12">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#5b3df5] sm:right-3.5 sm:top-3.5"></span>
                  </button>

                <AdminHeader adminUser={adminUser} />

                  
                </div>
              </div>
            </div>

            {showEventForm && eventStep === 1 && (
              <>
                <div className="mt-6 rounded-[30px] bg-white p-5 shadow-[0_10px_30px_rgba(25,30,60,0.04)] ring-1 ring-[#eceff5] sm:p-6 md:p-8">
                  <div className="mb-6">
                    <h2 className="text-[1.15rem] font-bold tracking-[-0.03em] text-[#1f2430] sm:text-[1.3rem]">
                      1. Event Details
                    </h2>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
                        Event Name
                      </label>
                      <input
                        type="text"
                        value={eventForm.eventName}
                        onChange={(e) =>
                          handleEventChange("eventName", e.target.value)
                        }
                        placeholder="Enter event name"
                        className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
                        Vertical
                      </label>
                      <select
                        value={eventForm.vertical}
                        onChange={(e) =>
                          handleEventChange("vertical", e.target.value)
                        }
                        className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
                      >
                        {verticalOptions.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>


{eventForm.vertical === "Management" && (
  <div>
    <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
      ID Type
    </label>
    <select
      value={eventForm.idType}
      onChange={(e) => handleEventChange("idType", e.target.value)}
      className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
    >
      <option value="">Select ID Type</option>
      {managementIdTypeOptions.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
  </div>
)}



                    <div>
                      <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
                        Date
                      </label>
                      <input
                        type="date"
                        value={eventForm.date}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) =>
                          handleEventChange("date", e.target.value)
                        }
                        className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
                        Time
                      </label>
                      <input
                        type="time"
                        value={eventForm.time}
                        onChange={(e) =>
                          handleEventChange("time", e.target.value)
                        }
                        className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
                        Program
                      </label>
                      <input
                        type="text"
                        value={eventForm.program}
                        onChange={(e) =>
                          handleEventChange("program", e.target.value)
                        }
                        placeholder="Enter program name"
                        className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
                        Venue
                      </label>
                      <input
                        type="text"
                        value={eventForm.venue}
                        onChange={(e) =>
                          handleEventChange("venue", e.target.value)
                        }
                        placeholder="Grand Hyatt or Zoom Link"
                        className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
                        Chief Guest
                      </label>
                      <input
                        type="text"
                        value={eventForm.chiefGuest}
                        onChange={(e) =>
                          handleEventChange("chiefGuest", e.target.value)
                        }
                        placeholder="Enter chief guest name"
                        className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
                        Guest of Honor
                      </label>
                      <input
                        type="text"
                        value={eventForm.guestOfHonor}
                        onChange={(e) =>
                          handleEventChange("guestOfHonor", e.target.value)
                        }
                        placeholder="Enter guest of honor name"
                        className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
                        Faculty / Keynote Speaker
                      </label>
                      <input
                        type="text"
                        value={eventForm.facultySpeaker}
                        onChange={(e) =>
                          handleEventChange("facultySpeaker", e.target.value)
                        }
                        placeholder="Enter faculty or keynote speaker"
                        className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
                      />
                    </div>

                    <div className="md:col-span-2 flex items-center justify-between p-4 rounded-2xl border border-[#e6eaf2] bg-[#f8fafc]">
                      <div>
                        <p className="text-[14px] font-bold text-[#1f2430]">Public Event</p>
                        <p className="text-[12px] text-[#64748b]">If enabled, this event will be visible to all users in the mobile app.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleEventChange("isPublic", !eventForm.isPublic)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                          eventForm.isPublic ? "bg-[#5b3df5]" : "bg-[#cbd5e1]"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            eventForm.isPublic ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>





<div>
  <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
    Chief Guest ID
  </label>
  <input
    type="text"
    value={eventForm.chiefGuestId}
    onChange={(e) => handleEventChange("chiefGuestId", e.target.value)}
    placeholder="Enter chief guest ID number"
    className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
  />
</div>

<div>
  <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
    Guest of Honor ID
  </label>
  <input
    type="text"
    value={eventForm.guestOfHonorId}
    onChange={(e) => handleEventChange("guestOfHonorId", e.target.value)}
    placeholder="Enter guest of honor ID number"
    className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
  />
</div>


<div>
  <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
    Zone / National Person
  </label>
  <input
    type="text"
    value={eventForm.zoneNationalPerson}
    onChange={(e) => handleEventChange("zoneNationalPerson", e.target.value)}
    placeholder="Enter zone or national person"
    className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
  />
</div>

<div className="md:col-span-2">
  <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
    Event Overview
  </label>
  <textarea
    value={eventForm.eventOverview}
    onChange={(e) => handleEventChange("eventOverview", e.target.value)}
    placeholder="Enter event overview"
    rows={4}
    className="w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 py-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
  />
</div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
                        Event Banner
                      </label>

                      <label className="flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-[28px] border border-dashed border-[#d8dde8] bg-[#fbfcfe] px-6 py-8 text-center transition hover:border-[#5b3df5]">
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg"
                          className="hidden"
                          onChange={handleBannerUpload}
                        />

                        {bannerPreview ? (
                          <img
                            src={bannerPreview}
                            alt="Event Banner Preview"
                            className="max-h-[260px] w-full rounded-[20px] object-cover"
                          />
                        ) : (
                          <>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f2f4f8] text-[#5f6778]">
                              <Upload className="h-5 w-5" />
                            </div>
                            <p className="mt-3 text-[14px] font-semibold text-[#1f2430]">
                              Upload Event Banner
                            </p>
                            <p className="mt-1 text-[12px] text-[#6b7280]">
                              Exactly 1920 × 1080 px
                            </p>
                          </>
                        )}
                      </label>
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
                        Event Invitation
                      </label>

                      <label className="flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-[28px] border border-dashed border-[#d8dde8] bg-[#fbfcfe] px-6 py-8 text-center transition hover:border-[#5b3df5]">
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,application/pdf"
                          className="hidden"
                          onChange={handleInvitationUpload}
                        />

                        {invitationPreview ? (
                          <img
                            src={invitationPreview}
                            alt="Event Invitation Preview"
                            className="max-h-[260px] w-full rounded-[20px] object-contain"
                          />
                        ) : (
                          <>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f2f4f8] text-[#5f6778]">
                              <Upload className="h-5 w-5" />
                            </div>
                            <p className="mt-3 text-[14px] font-semibold text-[#1f2430]">
                              Upload Event Invitation
                            </p>
                            <p className="mt-1 text-[12px] text-[#6b7280]">
                              Portrait format
                            </p>
                          </>
                        )}
                      </label>
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
                        Event Gallery (Max 6)
                      </label>

                      <label className="flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-[28px] border border-dashed border-[#d8dde8] bg-[#fbfcfe] px-6 py-8 text-center transition hover:border-[#5b3df5]">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={handleEventGalleryUpload}
                        />

                        {eventForm.eventGallery && eventForm.eventGallery.length > 0 ? (
                          <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3">
                            {eventForm.eventGallery.map((img, idx) => (
                              <div key={idx} className="relative aspect-video w-full overflow-hidden rounded-xl border border-[#eceff5]">
                                <img
                                  src={img}
                                  alt={`Gallery ${idx + 1}`}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f2f4f8] text-[#5f6778]">
                              <ImagePlus className="h-5 w-5" />
                            </div>
                            <p className="mt-3 text-[14px] font-semibold text-[#1f2430]">
                              Upload Gallery Images
                            </p>
                            <p className="mt-1 text-[12px] text-[#6b7280]">
                              Up to 6 action photos
                            </p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={goToEventStep2}
                    className="rounded-full bg-gradient-to-r from-[#4e3ae9] to-[#6a42f5] px-8 py-3 text-[14px] font-semibold text-white shadow-[0_14px_22px_rgba(78,58,233,0.22)]"
                  >
                    Next
                  </button>
                </div>

              </>
            )}

            {showEventForm && eventStep === 2 && (
              <div className="mt-6 rounded-[30px] bg-white p-5 shadow-[0_10px_30px_rgba(25,30,60,0.04)] ring-1 ring-[#eceff5] sm:p-6 md:p-8">
                <div className="mb-6">
                  <h2 className="text-[1.15rem] font-bold tracking-[-0.03em] text-[#1f2430] sm:text-[1.3rem]">
                    2. Agenda Details
                  </h2>
                </div>

                <p className="mt-2 text-[13px] text-[#6b7280] sm:text-[14px]">
  {eventForm.vertical === "Management"
    ? `Management Agenda • ID Type: ${eventForm.idType || "Not selected"}`
    : "Fill agenda details for the selected event."}
</p>

               <div className="grid gap-5 md:grid-cols-2">
  {eventForm.vertical === "Management" ? (
    <>


      <div className="md:col-span-2 rounded-[24px] border border-[#eceff5] bg-[#fafbff] p-6 sm:p-8">
  <h3 className="text-[1.6rem] font-bold tracking-[-0.03em] text-[#111827]">
    {eventForm.idType || "LGB"} AGENDA
  </h3>

  <div className="mt-8 space-y-3 text-[15px] leading-8 text-[#111827] sm:text-[16px]">
    <div className="flex flex-wrap items-center gap-2">
      <span>LO Governing Board Meeting Information from the office of the Secretary :</span>
      <input
        type="text"
        value={eventForm.managementAgenda.officeSecretary || ""}
        onChange={(e) =>
          handleManagementAgendaChange("officeSecretary", e.target.value)
        }
        placeholder="Enter secretary name"
        className="min-w-[220px] flex-1 border-b-2 border-red-400 bg-transparent px-1 py-1 font-semibold text-red-600 outline-none"
      />
    </div>

    <div className="flex flex-wrap items-center gap-2">
      <span>To JFS/ JCI PPP/ JCI.Sen/ JFP/ JFM/ Jc.HGF./</span>
      <input
        type="text"
        value={eventForm.managementAgenda.officeRecipient || ""}
        onChange={(e) =>
          handleManagementAgendaChange("officeRecipient", e.target.value)
        }
        placeholder="Enter recipient name"
        className="min-w-[220px] flex-1 border-b-2 border-red-400 bg-transparent px-1 py-1 font-semibold text-red-600 outline-none"
      />
    </div>

    <div className="flex flex-wrap items-center gap-2">
      <span>Notice is hereby given that</span>
      <input
        type="text"
        value={eventForm.managementAgenda.noticeMeetingName || ""}
        onChange={(e) =>
          handleManagementAgendaChange("noticeMeetingName", e.target.value)
        }
        placeholder="Enter meeting title"
        className="min-w-[260px] flex-1 border-b-2 border-red-400 bg-transparent px-1 py-1 font-semibold text-red-600 outline-none"
      />
    </div>

    <div className="flex flex-wrap items-center gap-2">
      <span>will be on</span>
      <input
        type="text"
        value={eventForm.managementAgenda.noticeDateTime || ""}
        onChange={(e) =>
          handleManagementAgendaChange("noticeDateTime", e.target.value)
        }
        placeholder="Enter date & time"
        className="min-w-[260px] flex-1 border-b-2 border-red-400 bg-transparent px-1 py-1 font-semibold text-red-600 outline-none"
      />
      <span>at</span>
      <input
        type="text"
        value={eventForm.managementAgenda.noticeVenue || ""}
        onChange={(e) =>
          handleManagementAgendaChange("noticeVenue", e.target.value)
        }
        placeholder="Enter venue"
        className="min-w-[260px] flex-1 border-b-2 border-red-400 bg-transparent px-1 py-1 font-semibold text-red-600 outline-none"
      />
    </div>

    <div className="flex flex-wrap items-center gap-2">
      <span>Host :</span>
      <input
        type="text"
        value={eventForm.managementAgenda.hostInfo || ""}
        onChange={(e) =>
          handleManagementAgendaChange("hostInfo", e.target.value)
        }
        placeholder="Enter host details"
        className="min-w-[320px] flex-1 border-b-2 border-red-400 bg-transparent px-1 py-1 font-semibold text-red-600 outline-none"
      />
    </div>
  </div>
</div>


      {[
  ["item1", "1. Meeting Call to Order [1 Min]"],
  ["item2", "2. JCI Creed [1 Min]"],
  ["item3", "3. Welcome Address [2 Min]"],
  ["item4", "4. Recognitions [2 Min]"],
  ["item5", "5. Roll Call [2 Min]"],
  ["item6", "6. Establishment of Quorum [1 Min]"],
].map(([key, label]) => (
  <div key={key}>
    <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
      {label}
    </label>
    <input
      type="text"
      value={eventForm.managementAgenda[key]}
      onChange={(e) => handleManagementAgendaChange(key, e.target.value)}
      placeholder="Enter details"
      className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
    />
  </div>
))}


      <div className="md:col-span-2">
        <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
          7. Adoption of Agenda [5 Min]
        </label>
        <textarea
          value={eventForm.managementAgenda.item7Main}
          onChange={(e) =>
            handleManagementAgendaChange("item7Main", e.target.value)
          }
          placeholder="Text Box Big"
          rows={4}
          className="w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 py-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
        />
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <input
            type="text"
            value={eventForm.managementAgenda.item7MovedBy}
            onChange={(e) =>
              handleManagementAgendaChange("item7MovedBy", e.target.value)
            }
            placeholder="Moved By"
            className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
          />
          <input
            type="text"
            value={eventForm.managementAgenda.item7SecondedBy}
            onChange={(e) =>
              handleManagementAgendaChange("item7SecondedBy", e.target.value)
            }
            placeholder="Seconded By"
            className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
          />
        </div>
      </div>

      <div className="md:col-span-2">
        <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
          8. Minutes of Previous Meeting [5 Min]
        </label>
        <textarea
          value={eventForm.managementAgenda.item8Main}
          onChange={(e) =>
            handleManagementAgendaChange("item8Main", e.target.value)
          }
          placeholder="Text Box Big"
          rows={4}
          className="w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 py-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
        />
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <input
            type="text"
            value={eventForm.managementAgenda.item8MovedBy}
            onChange={(e) =>
              handleManagementAgendaChange("item8MovedBy", e.target.value)
            }
            placeholder="Moved By"
            className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
          />
          <input
            type="text"
            value={eventForm.managementAgenda.item8SecondedBy}
            onChange={(e) =>
              handleManagementAgendaChange("item8SecondedBy", e.target.value)
            }
            placeholder="Seconded By"
            className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
          />
        </div>
      </div>


       {[
  ["item9", "9. Matters arising out of Minutes [8 Min]"],
  ["item10", "10. Zone & National Correspondence [2 Min]"],
  ["item11", "11. Reports of VP's Secretary"],
  ["item12", "12. Approval of New Application [5 Min]"],
  ["item13", "13. JCI India Subscription [2 Min]"],
  ["item14", "14. House Bulletin TALENT [5 Min]"],
  ["item15", "15. Vision 50 [2 Min]"],
].map(([key, label]) => (
  <div key={key}>
    <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
      {label}
    </label>
    <input
      type="text"
      value={eventForm.managementAgenda[key]}
      onChange={(e) => handleManagementAgendaChange(key, e.target.value)}
      placeholder="Enter details"
      className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
    />
  </div>
))}

     <div className="md:col-span-2">
  <div className="mb-3 flex items-center justify-between">
    <label className="block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
      16. Other Subjects for Discussion [30 Min]
    </label>

    <button
      type="button"
      onClick={addOtherSubjectField}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5b3df5] text-white shadow-[0_10px_20px_rgba(91,61,245,0.25)]"
    >
      +
    </button>
  </div>

 


  {(eventForm.managementAgenda.otherSubjects || []).length === 0 ? (
    <div className="rounded-2xl border border-dashed border-[#d7dbe4] bg-[#fafbff] px-4 py-6 text-[14px] text-[#7b8494]">
      No subjects added yet. Click + to add.
    </div>
  ) : (
    <div className="grid gap-4 md:grid-cols-2">
      {(eventForm.managementAgenda.otherSubjects || []).map((item, index) => (
        <div key={index} className="relative">
          <textarea
            value={item}
            onChange={(e) => updateOtherSubjectField(index, e.target.value)}
            placeholder={`Subject ${index + 1}`}
            rows={3}
            className="w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 py-4 pr-14 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
          />

          <button
            type="button"
            onClick={() => removeOtherSubjectField(index)}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )}
</div>
{[
  ["item17", "17. IPP's Address [2 Min]"],
  ["item18", "18. Programs for ensuring month [1 Min]"],
  ["item19", "19. Next LGB Meeting [1 Min]"],
  ["item20", "20. Announcements & Vote of Thanks [2 Min]"],
  ["item21", "21. Adjournment [1 Min]"],
].map(([key, label]) => (
  <div key={key}>
    <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
      {label}
    </label>
    <input
      type="text"
      value={eventForm.managementAgenda[key]}
      onChange={(e) => handleManagementAgendaChange(key, e.target.value)}
      placeholder="Enter details"
      className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
    />
  </div>
))}

      <div>
        <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
          Name of the Secretary
        </label>
        <input
          type="text"
          value={eventForm.secretaryName}
          onChange={(e) =>
            handleEventChange("secretaryName", e.target.value)
          }
          placeholder="Enter secretary name"
          className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
        />
      </div>

      <div>
        <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
          Person : Secretary / Acting Secretary
        </label>
        <select
          value={eventForm.secretaryPerson}
          onChange={(e) =>
            handleEventChange("secretaryPerson", e.target.value)
          }
          className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
        >
          <option value="Secretary">Secretary</option>
          <option value="Acting Secretary">Acting Secretary</option>
        </select>
      </div>

      <div className="md:col-span-2">
        <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
          Signature
        </label>

        <label className="flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed border-[#d8dde8] bg-[#fbfcfe] px-6 py-6 text-center transition hover:border-[#5b3df5]">
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            className="hidden"
            onChange={handleSignatureUpload}
          />

          {signaturePreview ? (
            <img
              src={signaturePreview}
              alt="Signature Preview"
              className="max-h-[100px] w-full rounded-[16px] object-contain"
            />
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f2f4f8] text-[#5f6778]">
                <Upload className="h-5 w-5" />
              </div>
              <p className="mt-3 text-[14px] font-semibold text-[#1f2430]">
                Upload Signature
              </p>
            </>
          )}
        </label>
      </div>
    </>
  ) : (
    <>
      {eventForm.agendaItems.map((item, index) => (
        <div key={index}>
          <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
            {index + 1}. {agendaLabels[index]}
          </label>

          <input
            type="text"
            value={item}
            onChange={(e) => handleAgendaChange(index, e.target.value)}
            placeholder="Enter details"
            className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none placeholder:text-[#b0b6c2] focus:border-[#5b3df5]"
          />
        </div>
      ))}

      <div>
        <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
          15. Name of the Secretary
        </label>
        <input
          type="text"
          value={eventForm.secretaryName}
          onChange={(e) =>
            handleEventChange("secretaryName", e.target.value)
          }
          placeholder="Enter secretary name"
          className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
        />
      </div>

      <div>
        <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
          16. Signature
        </label>

        <label className="flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed border-[#d8dde8] bg-[#fbfcfe] px-6 py-6 text-center transition hover:border-[#5b3df5]">
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            className="hidden"
            onChange={handleSignatureUpload}
          />

          {signaturePreview ? (
            <img
              src={signaturePreview}
              alt="Signature Preview"
              className="max-h-[100px] w-full rounded-[16px] object-contain"
            />
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f2f4f8] text-[#5f6778]">
                <Upload className="h-5 w-5" />
              </div>
              <p className="mt-3 text-[14px] font-semibold text-[#1f2430]">
                Upload Signature
              </p>
            </>
          )}
        </label>
      </div>

      <div className="md:col-span-2">
        <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
          17. Person : Secretary / Acting Secretary
        </label>
        <select
          value={eventForm.secretaryPerson}
          onChange={(e) =>
            handleEventChange("secretaryPerson", e.target.value)
          }
          className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
        >
          <option value="Secretary">Secretary</option>
          <option value="Acting Secretary">Acting Secretary</option>
        </select>
      </div>
    </>
  )}
</div>



              <div className="mt-8 flex items-center justify-between gap-3">
  <button
    type="button"
    onClick={backToEventStep1}
    className="rounded-full border border-[#d9deea] bg-white px-8 py-3 text-[14px] font-semibold text-[#4b5563]"
  >
    Back
  </button>

  <div className="flex items-center gap-3">
    <button
      type="button"
      onClick={goToEventStep3}
      className="rounded-full border border-[#5b3df5] bg-white px-8 py-3 text-[14px] font-semibold text-[#5b3df5]"
    >
      Preview
    </button>

    <button
      type="button"
      onClick={handleCreateEvent}
      disabled={eventsSaving}
      className="rounded-full bg-gradient-to-r from-[#4e3ae9] to-[#6a42f5] px-8 py-3 text-[14px] font-semibold text-white shadow-[0_14px_22px_rgba(78,58,233,0.22)] disabled:opacity-60"
    >
      {eventsSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Event'}
    </button>
  </div>
</div>

              </div>
            )}

       {showEventForm && eventStep === 3 && (
  <div className="mt-6 rounded-[30px] bg-white p-5 shadow-[0_10px_30px_rgba(25,30,60,0.04)] ring-1 ring-[#eceff5] sm:p-6 md:p-8">
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-[1.15rem] font-bold tracking-[-0.03em] text-[#1f2430] sm:text-[1.3rem]">
          3. Preview Details
        </h2>
        <p className="mt-2 text-[13px] text-[#6b7280] sm:text-[14px]">
          Review all event details before creating the event.
        </p>
      </div>
    </div>

    <div className="rounded-[28px] border border-[#e6eaf2] bg-[#fafbff] p-5 sm:p-6 md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#7b8494]">
            Event Name
          </p>
          <div className="mt-2 rounded-2xl border border-[#e6eaf2] bg-white px-4 py-4 text-[15px] font-semibold text-[#1f2430]">
            {eventForm.eventName || "Not added"}
          </div>
        </div>

        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#7b8494]">
            Vertical
          </p>
          <div className="mt-2 rounded-2xl border border-[#e6eaf2] bg-white px-4 py-4 text-[15px] font-semibold text-[#1f2430]">
            {eventForm.vertical || "Not added"}
          </div>
        </div>

        {eventForm.vertical === "Management" && (
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#7b8494]">
              ID Type
            </p>
            <div className="mt-2 rounded-2xl border border-[#e6eaf2] bg-white px-4 py-4 text-[15px] font-semibold text-[#1f2430]">
              {eventForm.idType || "Not added"}
            </div>
          </div>
        )}

        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#7b8494]">
            Date
          </p>
          <div className="mt-2 rounded-2xl border border-[#e6eaf2] bg-white px-4 py-4 text-[15px] font-semibold text-[#1f2430]">
            {eventForm.date || "Not added"}
          </div>
        </div>

        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#7b8494]">
            Time
          </p>
          <div className="mt-2 rounded-2xl border border-[#e6eaf2] bg-white px-4 py-4 text-[15px] font-semibold text-[#1f2430]">
            {eventForm.time || "Not added"}
          </div>
        </div>

        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#7b8494]">
            Program
          </p>
          <div className="mt-2 rounded-2xl border border-[#e6eaf2] bg-white px-4 py-4 text-[15px] font-semibold text-[#1f2430]">
            {eventForm.program || "Not added"}
          </div>
        </div>

        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#7b8494]">
            Venue
          </p>
          <div className="mt-2 rounded-2xl border border-[#e6eaf2] bg-white px-4 py-4 text-[15px] font-semibold text-[#1f2430]">
            {eventForm.venue || "Not added"}
          </div>
        </div>

        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#7b8494]">
            Chief Guest
          </p>
          <div className="mt-2 rounded-2xl border border-[#e6eaf2] bg-white px-4 py-4 text-[15px] font-semibold text-[#1f2430]">
            {eventForm.chiefGuest || "Optional / Not added"}
          </div>
        </div>

        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#7b8494]">
            Guest of Honor
          </p>
          <div className="mt-2 rounded-2xl border border-[#e6eaf2] bg-white px-4 py-4 text-[15px] font-semibold text-[#1f2430]">
            {eventForm.guestOfHonor || "Optional / Not added"}
          </div>
        </div>

        <div className="md:col-span-2">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#7b8494]">
            Faculty / Keynote Speaker
          </p>
          <div className="mt-2 rounded-2xl border border-[#e6eaf2] bg-white px-4 py-4 text-[15px] font-semibold text-[#1f2430]">
            {eventForm.facultySpeaker || "Optional / Not added"}
          </div>
        </div>

        <div className="md:col-span-2">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#7b8494]">
            Event Overview
          </p>
          <div className="mt-2 min-h-[120px] rounded-2xl border border-[#e6eaf2] bg-white px-4 py-4 text-[15px] leading-7 text-[#1f2430]">
            {eventForm.eventOverview || "Not added"}
          </div>
        </div>

        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#7b8494]">
            Secretary Name
          </p>
          <div className="mt-2 rounded-2xl border border-[#e6eaf2] bg-white px-4 py-4 text-[15px] font-semibold text-[#1f2430]">
            {eventForm.secretaryName || "Not added"}
          </div>
        </div>

        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#7b8494]">
            Secretary Type
          </p>
          <div className="mt-2 rounded-2xl border border-[#e6eaf2] bg-white px-4 py-4 text-[15px] font-semibold text-[#1f2430]">
            {eventForm.secretaryPerson || "Not added"}
          </div>
        </div>

        {eventForm.vertical === "Management" ? (
          <div className="md:col-span-2">
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#7b8494]">
              Management Agenda Preview
            </p>
            <div className="mt-2 rounded-2xl border border-[#e6eaf2] bg-white px-4 py-5 text-[15px] leading-8 text-[#1f2430]">
              <p><span className="font-semibold">Agenda Type:</span> {eventForm.idType || "Not added"}</p>
              <p><span className="font-semibold">Office Secretary:</span> {eventForm.managementAgenda.officeSecretary || "Not added"}</p>
              <p><span className="font-semibold">Office Recipient:</span> {eventForm.managementAgenda.officeRecipient || "Not added"}</p>
              <p><span className="font-semibold">Meeting Name:</span> {eventForm.managementAgenda.noticeMeetingName || "Not added"}</p>
              <p><span className="font-semibold">Date & Time Text:</span> {eventForm.managementAgenda.noticeDateTime || "Not added"}</p>
              <p><span className="font-semibold">Venue Text:</span> {eventForm.managementAgenda.noticeVenue || "Not added"}</p>
              <p><span className="font-semibold">Host:</span> {eventForm.managementAgenda.hostInfo || "Not added"}</p>
            </div>
          </div>
        ) : (
          <div className="md:col-span-2">
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#7b8494]">
              Agenda Preview
            </p>
            <div className="mt-2 rounded-2xl border border-[#e6eaf2] bg-white px-4 py-5 text-[15px] leading-8 text-[#1f2430]">
              {eventForm.agendaItems.some((item) => item.trim()) ? (
                <ul className="space-y-2">
                  {eventForm.agendaItems.map((item, index) => (
                    <li key={index}>
                      <span className="font-semibold">{index + 1}. {agendaLabels[index]}:</span>{" "}
                      {item || "Not added"}
                    </li>
                  ))}
                </ul>
              ) : (
                "No agenda details added"
              )}
            </div>
          </div>
        )}

        <div className="md:col-span-2">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#7b8494]">
            Media Preview
          </p>
          <div className="mt-3 grid gap-6 sm:grid-cols-2">
            {bannerPreview && (
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-[#6b7280]">EVENT BANNER</p>
                <img src={bannerPreview} alt="Banner" className="h-[200px] w-full rounded-2xl object-cover ring-1 ring-[#e6eaf2]" />
              </div>
            )}
            {invitationPreview && (
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-[#6b7280]">EVENT INVITATION</p>
                <img src={invitationPreview} alt="Invitation" className="h-[200px] w-full rounded-2xl object-contain ring-1 ring-[#e6eaf2]" />
              </div>
            )}
          </div>
          
          {eventForm.eventGallery && eventForm.eventGallery.length > 0 && (
            <div className="mt-6 space-y-2">
              <p className="text-[11px] font-bold text-[#6b7280]">EVENT GALLERY</p>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                {eventForm.eventGallery.map((img, idx) => (
                  <img key={idx} src={img} alt="Gallery" className="aspect-square w-full rounded-xl object-cover ring-1 ring-[#e6eaf2]" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

    <div className="mt-8 flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={backToEventStep2}
        className="rounded-full border border-[#d9deea] bg-white px-8 py-3 text-[14px] font-semibold text-[#4b5563]"
      >
        Back
      </button>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setEventStep(2)}
          className="rounded-full border border-[#5b3df5] bg-white px-8 py-3 text-[14px] font-semibold text-[#5b3df5]"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={handleCreateEvent}
          disabled={eventsSaving}
          className="rounded-full bg-gradient-to-r from-[#4e3ae9] to-[#6a42f5] px-8 py-3 text-[14px] font-semibold text-white shadow-[0_14px_22px_rgba(78,58,233,0.22)] disabled:opacity-60"
        >
          {eventsSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Event'}
        </button>
      </div>
    </div>
  </div>
)}
            
          </div>

            <section className="mt-6 sm:mt-7 md:mt-8">
              <div className="flex items-center justify-between">
                <h2 className="text-[1.25rem] font-bold tracking-[-0.04em] text-[#1f2430] sm:text-[1.4rem] md:text-[1.55rem]">
                  Active Schedule
                </h2>
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]"></span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6b7280]">
                    Live Events
                  </span>
                </div>
              </div>

              {eventsLoading ? (
                <div className="mt-6 flex flex-col items-center justify-center rounded-[30px] border border-[#e6eaf2] bg-white py-12 text-center shadow-[0_10px_30px_rgba(25,30,60,0.04)] sm:py-16">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#5b3df5] border-t-transparent"></div>
                  <p className="mt-4 font-semibold text-[#1f2430]">Loading events...</p>
                </div>
              ) : liveEvents.length === 0 ? (
                <div className="mt-6 rounded-[30px] border border-dashed border-[#d8dde8] bg-[#f8faff] py-12 text-center sm:py-16">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#8b92a1] shadow-sm">
                    <CalendarDays className="h-7 w-7" />
                  </div>
                  <h3 className="mt-5 text-[1.1rem] font-bold text-[#1f2430]">
                    No events found
                  </h3>
                  <p className="mt-1 text-[13px] text-[#6b7280]">
                    There are no upcoming events in this category yet.
                  </p>
                </div>
              ) : (
                <div className="mt-6 grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {liveEvents.map((event) => (
                    <div
                      key={event._id}
                      className="group relative flex flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_10px_30px_rgba(25,30,60,0.04)] ring-1 ring-[#eceff5] transition-all hover:shadow-[0_20px_45px_rgba(25,30,60,0.08)]"
                    >
                      <div className="relative h-[160px] w-full overflow-hidden sm:h-[180px]">
                        <img
                          src={event.banner || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000&auto=format&fit=crop"}
                          alt={event.eventName}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#00000088] to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                            {event.vertical}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col p-5 sm:p-6">
                        <div className="flex-1">
                          <h3 className="text-[1.05rem] font-bold leading-tight tracking-[-0.02em] text-[#1f2430] sm:text-[1.15rem]">
                            {event.eventName}
                          </h3>
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center gap-2 text-[12px] text-[#6b7280]">
                              <CalendarDays className="h-3.5 w-3.5 text-[#5b3df5]" />
                              <span>{event.date} • {event.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[12px] text-[#6b7280]">
                              <Users className="h-3.5 w-3.5 text-[#5b3df5]" />
                              <span className="truncate">{event.chiefGuest || "No chief guest"}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-2">
                          <button 
                            onClick={() => onNavigate("eventDetails", "All", event)}
                            className="flex-1 rounded-full bg-[#f4f5f8] py-2.5 text-[12px] font-bold text-[#1f2430] transition hover:bg-[#edf0f5]"
                          >
                            View
                          </button>
                          <button 
                             onClick={() => onNavigate("eventReport", "All", event)}
                             className="flex-1 rounded-full bg-emerald-50 py-2.5 text-[12px] font-bold text-emerald-600 transition hover:bg-emerald-100"
                          >
                            event report
                          </button>
                        </div>
                        <div className="mt-6 flex items-center justify-between border-t border-[#f1f3f9] pt-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleTogglePublic(event)}
                              role="switch"
                              aria-checked={Boolean(event.isPublic)}
                              className={`flex h-9 items-center gap-2 rounded-full px-3 text-[11px] font-bold transition-all ${
                                event.isPublic
                                  ? "bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200"
                                  : "bg-slate-50 text-slate-400 ring-1 ring-slate-200"
                              }`}
                            >
                              <span className={`relative h-4 w-8 rounded-full transition-colors ${event.isPublic ? "bg-indigo-500" : "bg-slate-300"}`}>
                                <span className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow-sm transition-transform ${event.isPublic ? "translate-x-4" : "translate-x-0.5"}`} />
                              </span>
                              {event.isPublic ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                              {event.isPublic ? "LIVE IN PORTAL" : "HIDDEN"}
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                               onClick={() => handleEditClick(event)}
                               className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f2efff] text-[#5b3df5] transition hover:bg-[#5b3df5] hover:text-white shadow-sm"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button 
                               onClick={(e) => { e.stopPropagation(); handleDeleteEvent(event._id || event.id); }}
                               className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-500 transition hover:bg-red-500 hover:text-white shadow-sm"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
        </main>
      </div>
    </div>
  );
}

function EventDetailsPage({
  event,
  onNavigate,
  onLogout,
  activePage,
  showSettingsPage,
  setShowSettingsPage,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f5f7]">
        <button
          onClick={() => onNavigate("events")}
          className="rounded-full bg-[#5b3df5] px-6 py-3 text-white"
        >
          Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-[#1f2430]">
      <div className="flex min-h-screen">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="fixed right-4 top-4 z-50 rounded-full bg-[#5b3df5] p-3 text-white shadow-lg lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>

        <aside
          className={`fixed inset-y-0 left-0 z-40 w-[260px] transform border-r border-[#edf0f5] bg-[#f7f9fc] px-4 py-5 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } sm:px-5 sm:py-6`}
        >
          <div className="flex h-full flex-col">
            <div>
              <SidebarBrand />

              <nav className="mt-8 space-y-1 sm:mt-10 sm:space-y-2">
                <SidebarItem
                  icon={LayoutDashboard}
                  label="Dashboard"
                  active={activePage === "dashboard"}
                  onClick={() => onNavigate("dashboard")}
                />
                <SidebarItem
                  icon={Users}
                  label="Members"
                  active={activePage === "members"}
                  onClick={() => onNavigate("members")}
                />
                <SidebarItem
                  icon={FolderKanban}
                  label={MEMBER_CLASSIFICATION_LABEL}
                  active={activePage === "Memberclassification"}
                  onClick={() => onNavigate("Memberclassification")}
                />
                <SidebarItem
                  icon={CalendarDays}
                  label="Events"
                 active={
  activePage === "events" ||
  activePage === "eventDetails" ||
  activePage === "eventReport"
}
                  onClick={() => onNavigate("events")}
                />
                <SidebarItem
                  icon={BarChart3}
                  label="Analytics"
                  active={activePage === "analytics"}
                  onClick={() => onNavigate("analytics")}
                />
              </nav>

              <SettingsToggleBlock
                activePage={activePage}
                onNavigate={onNavigate}
                showSettingsPage={showSettingsPage}
                setShowSettingsPage={setShowSettingsPage}
              />
            </div>

            <button
              onClick={onLogout}
              className="mt-auto rounded-full bg-red-500 px-4 py-3 text-[14px] font-semibold text-white shadow-[0_15px_30px_rgba(239,68,68,0.28)]"
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="relative z-10 flex-1 bg-[#f5f7fb] px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6 lg:px-8 lg:py-7">
          <div className="mx-auto max-w-[1400px]">
            <button
              onClick={() => onNavigate("events")}
              className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-[#5b3df5] shadow-sm ring-1 ring-[#eceff5]"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Events
            </button>

            <section className="overflow-hidden rounded-[34px] bg-white shadow-[0_20px_60px_rgba(25,30,60,0.08)] ring-1 ring-[#ebedf3]">
              <div className="relative h-[260px] w-full sm:h-[320px] lg:h-[420px]">
                <img
                  src={event.image || event.banner}
                  alt={event.title || event.eventName}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172acc] via-[#0f172a66] to-transparent" />

                <div className="absolute bottom-8 left-6 right-6 flex items-end justify-between">
                  <h1 className="text-[2rem] font-bold tracking-[-0.05em] text-white sm:text-[2.5rem] lg:text-[3.25rem]">
                    {event.eventName || event.title}
                  </h1>
                  <button
                    onClick={() => onNavigate("eventReport", "All", event)}
                    className="rounded-full bg-[#5b3df5] px-6 py-3 text-[14px] font-bold text-white shadow-lg transition hover:scale-105 active:scale-95"
                  >
                    {event.report ? "Edit Event Report" : "Create Event Report"}
                  </button>
                </div>
              </div>

              <div className="p-6 sm:p-7 lg:p-8">
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  <div className="rounded-[24px] border border-[#eceff5] bg-[#fafbff] p-5">
                    <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#8b92a1]">
                      Event Name
                    </p>
                    <p className="mt-2 text-[18px] font-semibold text-[#1f2430]">
                      {event.eventName || event.title || "Not added"}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-[#eceff5] bg-[#fafbff] p-5">
                    <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#8b92a1]">
                      Vertical
                    </p>
                    <p className="mt-2 text-[18px] font-semibold text-[#1f2430]">
                      {event.vertical || event.tag || "Not added"}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-[#eceff5] bg-[#fafbff] p-5">
                    <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#8b92a1]">
                      Date
                    </p>
                    <p className="mt-2 text-[18px] font-semibold text-[#1f2430]">
                      {event.date || "Not added"}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-[#eceff5] bg-[#fafbff] p-5">
                    <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#8b92a1]">
                      Time
                    </p>
                    <p className="mt-2 text-[18px] font-semibold text-[#1f2430]">
                      {event.time || "Not added"}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-[#eceff5] bg-[#fafbff] p-5">
                    <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#8b92a1]">
                      Program
                    </p>
                    <p className="mt-2 text-[18px] font-semibold text-[#1f2430]">
                      {event.program || "Not added"}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-[#eceff5] bg-[#fafbff] p-5">
                    <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#8b92a1]">
                      Venue
                    </p>
                    <p className="mt-2 text-[18px] font-semibold text-[#1f2430]">
                      {event.venue || "Not added"}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-[#eceff5] bg-[#fafbff] p-5">
                    <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#8b92a1]">
                      Chief Guest
                    </p>
                    <p className="mt-2 text-[16px] font-semibold text-[#1f2430]">
                      {event.chiefGuest || "Not added"}
                    </p>
                    <p className="mt-1 text-[13px] text-[#6b7280]">
                      ID: {event.chiefGuestId || "Not added"}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-[#eceff5] bg-[#fafbff] p-5">
                    <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#8b92a1]">
                      Guest of Honor
                    </p>
                    <p className="mt-2 text-[16px] font-semibold text-[#1f2430]">
                      {event.guestOfHonor || "Not added"}
                    </p>
                    <p className="mt-1 text-[13px] text-[#6b7280]">
                      ID: {event.guestOfHonorId || "Not added"}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-[#eceff5] bg-[#fafbff] p-5">
                    <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#8b92a1]">
                      Faculty / Keynote Speaker
                    </p>
                    <p className="mt-2 text-[16px] font-semibold text-[#1f2430]">
                      {event.facultySpeaker || "Not added"}
                    </p>
                    <p className="mt-1 text-[13px] text-[#6b7280]">
                      ID: {event.facultySpeakerId || "Not added"}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-[#eceff5] bg-[#fafbff] p-5 md:col-span-2 xl:col-span-3">
                    <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#8b92a1]">
                      Zone / National Person
                    </p>
                    <p className="mt-2 text-[18px] font-semibold text-[#1f2430]">
                      {event.zoneNationalPerson || "Not added"}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-[#eceff5] bg-[#fafbff] p-5 md:col-span-2 xl:col-span-3">
                    <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#8b92a1]">
                      Event Overview
                    </p>
                    <p className="mt-3 text-[15px] leading-8 text-[#4f5666]">
                      {event.eventOverview || event.description || "Not added"}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-[#eceff5] bg-[#fafbff] p-5 md:col-span-2 xl:col-span-3">
                    <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#8b92a1]">
                      Event Invitation
                    </p>
                    {event.invitation ? (
                      <img
                        src={event.invitation}
                        alt="Event Invitation"
                        className="mt-4 max-h-[500px] rounded-[28px] object-contain ring-1 ring-[#eceff5]"
                      />
                    ) : (
                      <p className="mt-3 text-[15px] text-[#6b7280]">No invitation uploaded</p>
                    )}
                  </div>

                  <div className="rounded-[24px] border border-[#eceff5] bg-[#fafbff] p-5 md:col-span-2 xl:col-span-3">
                    <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#8b92a1]">
                      Event Gallery
                    </p>
                    {event.eventGallery && event.eventGallery.length > 0 ? (
                      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {event.eventGallery.map((img, index) => (
                          <img
                            key={index}
                            src={img}
                            alt={`Gallery ${index + 1}`}
                            className="h-[180px] w-full rounded-[22px] object-cover ring-1 ring-[#eceff5]"
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 text-[15px] text-[#6b7280]">No gallery images added</p>
                    )}
                  </div>

                  {event.report && (
                    <div className="md:col-span-2 xl:col-span-3">
                      <div className="mt-8 overflow-hidden rounded-[28px] border border-[#e5e7eb] bg-white">
                        <div className="bg-[#f9fafb] px-6 py-4 border-b border-[#e5e7eb]">
                          <h3 className="text-[1.1rem] font-bold text-[#111827]">Event Report Details</h3>
                        </div>
                        <div className="p-6">
                           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                              <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-[#6b7280]">Total Attendance</p>
                                <p className="mt-1 text-[15px] font-semibold text-[#111827]">{event.report.totalCount || "0"}</p>
                              </div>
                              <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-[#6b7280]">JCs Present</p>
                                <p className="mt-1 text-[15px] font-semibold text-[#111827]">{event.report.jcsCount || "0"}</p>
                              </div>
                              <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-[#6b7280]">Family Members</p>
                                <p className="mt-1 text-[15px] font-semibold text-[#111827]">{event.report.familyMembersCount || "0"}</p>
                              </div>
                              <div className="sm:col-span-2 lg:col-span-3">
                                <p className="text-[11px] font-bold uppercase tracking-wider text-[#6b7280]">Report Overview</p>
                                <p className="mt-2 text-[14px] leading-relaxed text-[#4b5563]">{event.report.eventOverview || "No overview provided."}</p>
                              </div>
                           </div>
                           
                           {event.report.reportImageGroup1 && event.report.reportImageGroup1.length > 0 && (
                             <div className="mt-8">
                               <p className="text-[11px] font-bold uppercase tracking-wider text-[#6b7280] mb-3">Report Images</p>
                               <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                                 {event.report.reportImageGroup1.map((img, i) => (
                                   <img key={i} src={img} alt="Report" className="h-24 w-full rounded-xl object-cover ring-1 ring-[#e5e7eb]" />
                                 ))}
                               </div>
                             </div>
                           )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function EventReportPage({
  event,
  onNavigate,
  onLogout,
  activePage,
  showSettingsPage,
  setShowSettingsPage,
}) {
  const [reportForm, setReportForm] = useState({
    eventName: "",
    vertical: "",
    date: "",
    time: "",
    program: "",
    venue: "",
    eventOverview: "",
    chiefGuestCount: "",
    guestOfHonorCount: "",
    facultyCount: "",
    lgbMembersCount: "",
    jcsCount: "",
    familyMembersCount: "",
    pastPresidentsCount: "",
    chiefGuestId: "",
    guestOfHonorId: "",
    facultyId: "",
    jacCount: "",
    nonJcCount: "",
    zoneNationalPersonCount: "",
    zoneNationalPersonId: "",
    totalCount: "",
    beneficiaryCount: "",
    description: "",
    problemIfAny: "",
    futureProgram: [""],
    submittedAt: "",
    reportImageGroup1: [],
    reportImageGroup2: [],
    reportImageGroup3: [],
    vicePresidentReport: "",
    month: "",
  });

  useEffect(() => {
    if (!event) return;

    setReportForm({
      eventName: event.eventName || "",
      vertical: event.vertical || "",
      date: event.date || "",
      time: event.time || "",
      program: event.program || "",
      venue: event.venue || "",
      eventOverview: event.report?.eventOverview || event.eventOverview || "",
      chiefGuestCount: event.report?.chiefGuestCount || "",
      guestOfHonorCount: event.report?.guestOfHonorCount || "",
      facultyCount: event.report?.facultyCount || "",
      lgbMembersCount: event.report?.lgbMembersCount || "",
      jcsCount: event.report?.jcsCount || "",
      familyMembersCount: event.report?.familyMembersCount || "",
      pastPresidentsCount: event.report?.pastPresidentsCount || "",
      chiefGuestId: event.report?.chiefGuestId || event.chiefGuestId || "",
      guestOfHonorId: event.report?.guestOfHonorId || event.guestOfHonorId || "",
      facultyId: event.report?.facultyId || event.facultySpeakerId || "",
      jacCount: event.report?.jacCount || "",
      nonJcCount: event.report?.nonJcCount || "",
      zoneNationalPersonCount: event.report?.zoneNationalPersonCount || "",
      zoneNationalPersonId: event.report?.zoneNationalPersonId || "",
      totalCount: event.report?.totalCount || "",
      reportImageGroup1: event.report?.reportImageGroup1 || [],
      reportImageGroup2: event.report?.reportImageGroup2 || [],
      reportImageGroup3: event.report?.reportImageGroup3 || [],
      beneficiaryCount: event.report?.beneficiaryCount || "",
      description: event.report?.description || "",
      problemIfAny: event.report?.problemIfAny || "",
      futureProgram:
        Array.isArray(event.report?.futureProgram) && event.report.futureProgram.length
          ? event.report.futureProgram
          : [""],
      submittedAt: event.report?.submittedAt || "",
      vicePresidentReport: event.report?.vicePresidentReport || "",
      month: event.report?.month || "",
    });
  }, [event]);

  if (!event) {
    return (
      <div className="p-8">
        <p>No event selected.</p>
        <button onClick={() => onNavigate("events")}>Back to Events</button>
      </div>
    );
  }

  const handleReportChange = (key, value) => {
    setReportForm((prev) => ({ ...prev, [key]: value }));
  };

  const addFutureProgram = () => {
    setReportForm((prev) => ({
      ...prev,
      futureProgram: [...prev.futureProgram, ""],
    }));
  };

  const removeFutureProgram = (index) => {
    setReportForm((prev) => ({
      ...prev,
      futureProgram:
        prev.futureProgram.length === 1
          ? [""]
          : prev.futureProgram.filter((_, i) => i !== index),
    }));
  };

  const handleFutureProgramChange = (index, value) => {
    const updated = [...reportForm.futureProgram];
    updated[index] = value;

    setReportForm((prev) => ({
      ...prev,
      futureProgram: updated,
    }));
  };

  const convertFilesToBase64 = async (files) => {
    return await Promise.all(
      Array.from(files)
        .slice(0, 10)
        .map(
          (file) =>
            new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(file);
            })
        )
    );
  };

  const handleReportImageUpload = async (key, e) => {
    const files = e.target.files || [];
    if (!files.length) return;
    const converted = await convertFilesToBase64(files);
    setReportForm((prev) => ({
      ...prev,
      [key]: converted,
    }));
  };

  const handleSaveReport = async () => {
    const reportData = {
      eventOverview: reportForm.eventOverview,
      chiefGuestCount: reportForm.chiefGuestCount,
      guestOfHonorCount: reportForm.guestOfHonorCount,
      facultyCount: reportForm.facultyCount,
      lgbMembersCount: reportForm.lgbMembersCount,
      jcsCount: reportForm.jcsCount,
      familyMembersCount: reportForm.familyMembersCount,
      pastPresidentsCount: reportForm.pastPresidentsCount,
      chiefGuestId: reportForm.chiefGuestId,
      guestOfHonorId: reportForm.guestOfHonorId,
      facultyId: reportForm.facultyId,
      jacCount: reportForm.jacCount,
      nonJcCount: reportForm.nonJcCount,
      zoneNationalPersonCount: reportForm.zoneNationalPersonCount,
      zoneNationalPersonId: reportForm.zoneNationalPersonId,
      totalCount: reportForm.totalCount,
      reportImageGroup1: reportForm.reportImageGroup1,
      reportImageGroup2: reportForm.reportImageGroup2,
      reportImageGroup3: reportForm.reportImageGroup3,
      beneficiaryCount: reportForm.beneficiaryCount,
      description: reportForm.description,
      problemIfAny: reportForm.problemIfAny,
      futureProgram: reportForm.futureProgram,
      submittedAt: reportForm.submittedAt,
      vicePresidentReport: reportForm.vicePresidentReport,
      month: reportForm.month,
    };

    try {
      const res = await fetch(`/api/admin/events/${event._id || event.id}/report`, {
        method: "PUT",
        headers: getAdminHeaders(),
        body: JSON.stringify({ report: reportData }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Event report saved successfully!");
        onNavigate("eventDetails", "All", { ...event, report: reportData });
      } else {
        alert(data.message || "Failed to save report.");
      }
    } catch (err) {
      console.error(err);
      alert("Connection error.");
    }
  };

  const inputClass =
    "h-[52px] w-full rounded-2xl border border-[#e8ebf2] bg-white px-4 text-[14px] text-[#495160] outline-none";

  const labelClass =
    "mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]";

  const formatRichText = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const handleRichTextInput = (field, e) => {
    handleReportChange(field, e.currentTarget.innerHTML);
  };

  const isManagement =
    (reportForm.vertical || "").trim().toLowerCase() === "management";

  return (
    <div className="flex min-h-screen bg-[#f5f7fb]">
      <main className="flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6 lg:px-8 lg:py-7">
        <div className="mx-auto max-w-[1400px]">
          <button
            onClick={() => onNavigate("events")}
            className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-[#5b3df5] shadow-sm ring-1 ring-[#eceff5]"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Events
          </button>

          <section className="rounded-[30px] bg-white p-6 shadow-[0_8px_24px_rgba(25,30,60,0.04)] ring-1 ring-[#efeff3]">
            <h2 className="text-[1.8rem] font-bold tracking-[-0.04em] text-[#1f2430]">
              Event Reports
            </h2>

            {isManagement ? (
              <div className="mt-6 rounded-[24px] border border-[#e6eaf2] bg-[#fafbff] p-5 sm:p-6">
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className={labelClass}>Report of Vice President</label>
                    <input
                      value={reportForm.vicePresidentReport || ""}
                      onChange={(e) =>
                        handleReportChange("vicePresidentReport", e.target.value)
                      }
                      className={inputClass}
                      placeholder="Enter report of vice president"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>For the Month</label>
                    <input
                      type="month"
                      value={reportForm.month}
                      onChange={(e) => handleReportChange("month", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className={labelClass}>Submitted at</label>
                    <input
                      value={reportForm.submittedAt}
                      onChange={(e) =>
                        handleReportChange("submittedAt", e.target.value)
                      }
                      className={inputClass}
                      placeholder="Enter submitted place / submitted at"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Host</label>
                    <input
                      value={reportForm.eventOverview}
                      onChange={(e) =>
                        handleReportChange("eventOverview", e.target.value)
                      }
                      className={inputClass}
                      placeholder="Enter host"
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-[1.2rem] font-bold text-[#1f2430]">
                    Action Taken on Assignment
                  </h3>
                  <p className="mt-4 text-[15px] font-semibold text-[#1f2430]">
                    1. Event Details
                  </p>

                  <div className="mt-4 overflow-hidden rounded-[18px] border border-[#d9deea]">
                    <div className="grid grid-cols-[1fr_1fr] bg-[#f3f5fa] text-[13px] font-bold text-[#1f2430]">
                      <div className="border-r border-[#d9deea] px-4 py-3">
                        Particulars
                      </div>
                      <div className="px-4 py-3">Details</div>
                    </div>

                    {[
                      ["Event Name", reportForm.eventName],
                      ["Vertical", reportForm.vertical],
                      ["Date", reportForm.date],
                      ["Time", reportForm.time],
                      ["Program", reportForm.program],
                      ["Venue", reportForm.venue],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="grid grid-cols-[1fr_1fr] border-t border-[#d9deea] text-[14px]"
                      >
                        <div className="border-r border-[#d9deea] px-4 py-3 font-semibold text-[#1f2430]">
                          {label}
                        </div>
                        <div className="px-4 py-3 text-[#4f5666]">
                          {value || "-"}
                        </div>
                      </div>
                    ))}
                  </div>

                  {event.eventGallery && event.eventGallery.length > 0 && (
                    <div className="mt-8">
                      <h4 className="text-[14px] font-bold text-[#1f2430] mb-3">Event Gallery (from creation)</h4>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                        {event.eventGallery.map((img, i) => (
                          <img key={i} src={img} alt="Original Gallery" className="h-20 w-full rounded-xl object-cover ring-1 ring-[#e2e8f0]" />
                        ))}
                      </div>
                    </div>
                  )}

                    {[
                      ["Chief Guest", "chiefGuestCount"],
                      ["Guest of Honor", "guestOfHonorCount"],
                      ["Faculty / Keynote Speaker", "facultyCount"],
                      ["LGB Members", "lgbMembersCount"],
                      ["Jc's", "jcsCount"],
                      ["Family Members", "familyMembersCount"],
                      ["Past Presidents", "pastPresidentsCount"],
                      ["Chief Guest ID", "chiefGuestId"],
                      ["Guest of Honor ID", "guestOfHonorId"],
                      ["Faculty", "facultyId"],
                      ["JAC", "jacCount"],
                      ["Non-JC", "nonJcCount"],
                      ["Beneficiary", "beneficiaryCount"],
                      ["Total Attendance", "totalCount"],
                    ].map(([label, key]) => (
                      <div
                        key={key}
                        className="grid grid-cols-[1fr_1fr] border-t border-[#d9deea] text-[14px]"
                      >
                        <div className="border-r border-[#d9deea] px-4 py-3 font-semibold text-[#1f2430]">
                          {label}
                        </div>
                        <div className="px-4 py-2">
                          <input
                            value={reportForm[key]}
                            onChange={(e) =>
                              handleReportChange(key, e.target.value)
                            }
                            className="w-full rounded-xl border border-[#e6eaf2] bg-white px-3 py-2 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
                            placeholder="Enter details"
                          />
                        </div>
                      </div>
                    ))}

                    <div className="grid grid-cols-[1fr_1fr] border-t border-[#d9deea] text-[14px]">
                      <div className="border-r border-[#d9deea] px-4 py-3 font-semibold text-[#1f2430]">
                        Description
                      </div>

                      <div className="px-4 py-2">
                        <div className="overflow-hidden rounded-xl border border-[#d9deea] bg-white">
                          <div className="flex flex-wrap items-center gap-2 border-b border-[#e5e7eb] bg-[#f8fafc] px-3 py-2">
                            <select
                              className="rounded-md border border-[#d9deea] bg-white px-2 py-1 text-[13px] outline-none"
                              onChange={(e) =>
                                formatRichText("formatBlock", e.target.value)
                              }
                              defaultValue=""
                            >
                              <option value="">Normal</option>
                              <option value="H1">Heading 1</option>
                              <option value="H2">Heading 2</option>
                              <option value="P">Paragraph</option>
                            </select>

                            <button
                              type="button"
                              onClick={() => formatRichText("bold")}
                              className="rounded-md border border-[#d9deea] px-2 py-1 text-[13px] font-bold"
                            >
                              B
                            </button>

                            <button
                              type="button"
                              onClick={() => formatRichText("italic")}
                              className="rounded-md border border-[#d9deea] px-2 py-1 text-[13px] italic"
                            >
                              I
                            </button>

                            <button
                              type="button"
                              onClick={() => formatRichText("underline")}
                              className="rounded-md border border-[#d9deea] px-2 py-1 text-[13px] underline"
                            >
                              U
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                formatRichText("insertUnorderedList")
                              }
                              className="rounded-md border border-[#d9deea] px-2 py-1 text-[13px]"
                            >
                              • List
                            </button>

                            <button
                              type="button"
                              onClick={() => formatRichText("insertOrderedList")}
                              className="rounded-md border border-[#d9deea] px-2 py-1 text-[13px]"
                            >
                              1. List
                            </button>

                            <button
                              type="button"
                              onClick={() => formatRichText("justifyLeft")}
                              className="rounded-md border border-[#d9deea] px-2 py-1 text-[13px]"
                            >
                              Left
                            </button>

                            <button
                              type="button"
                              onClick={() => formatRichText("justifyCenter")}
                              className="rounded-md border border-[#d9deea] px-2 py-1 text-[13px]"
                            >
                              Center
                            </button>
                          </div>

                          <div
                            contentEditable
                            suppressContentEditableWarning
                            onInput={(e) => handleRichTextInput("description", e)}
                            dangerouslySetInnerHTML={{
                              __html: reportForm.description || "",
                            }}
                            className="min-h-[140px] w-full px-4 py-3 text-[14px] text-[#1f2430] outline-none"
                            style={{ whiteSpace: "pre-wrap" }}
                          />

                          {!reportForm.description && (
                            <div className="pointer-events-none -mt-[132px] px-4 py-3 text-[14px] text-[#9ca3af]">
                              Text box, Bulletins
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className={labelClass}>Problem if any</label>
                    <textarea
                      value={reportForm.problemIfAny}
                      onChange={(e) =>
                        handleReportChange("problemIfAny", e.target.value)
                      }
                      rows={4}
                      className="w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 py-3 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
                      placeholder="Text Box"
                    />
                  </div>

                  <div className="mt-6">
                    <div className="mb-3 flex items-center justify-between">
                      <label className={labelClass}>Future Program</label>

                      <button
                        type="button"
                        onClick={addFutureProgram}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#5b3df5] text-white shadow"
                      >
                        +
                      </button>
                    </div>

                    <div className="space-y-4">
                      {reportForm.futureProgram.map((item, index) => (
                        <div
                          key={index}
                          className="overflow-hidden rounded-2xl border border-[#e6eaf2] bg-white"
                        >
                          <div className="flex flex-wrap items-center gap-2 border-b border-[#e5e7eb] bg-[#f8fafc] px-3 py-2">
                            <select
                              className="rounded-md border border-[#d9deea] bg-white px-2 py-1 text-[13px] outline-none"
                              onChange={(e) =>
                                formatRichText("formatBlock", e.target.value)
                              }
                              defaultValue=""
                            >
                              <option value="">Normal</option>
                              <option value="H1">Heading 1</option>
                              <option value="H2">Heading 2</option>
                              <option value="P">Paragraph</option>
                            </select>

                            <button
                              type="button"
                              onClick={() => formatRichText("bold")}
                              className="rounded-md border border-[#d9deea] px-2 py-1 text-[13px] font-bold"
                            >
                              B
                            </button>

                            <button
                              type="button"
                              onClick={() => formatRichText("italic")}
                              className="rounded-md border border-[#d9deea] px-2 py-1 text-[13px] italic"
                            >
                              I
                            </button>

                            <button
                              type="button"
                              onClick={() => formatRichText("underline")}
                              className="rounded-md border border-[#d9deea] px-2 py-1 text-[13px] underline"
                            >
                              U
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                formatRichText("insertUnorderedList")
                              }
                              className="rounded-md border border-[#d9deea] px-2 py-1 text-[13px]"
                            >
                              • List
                            </button>

                            <button
                              type="button"
                              onClick={() => formatRichText("insertOrderedList")}
                              className="rounded-md border border-[#d9deea] px-2 py-1 text-[13px]"
                            >
                              1. List
                            </button>

                            <button
                              type="button"
                              onClick={() => formatRichText("justifyLeft")}
                              className="rounded-md border border-[#d9deea] px-2 py-1 text-[13px]"
                            >
                              Left
                            </button>

                            <button
                              type="button"
                              onClick={() => formatRichText("justifyCenter")}
                              className="rounded-md border border-[#d9deea] px-2 py-1 text-[13px]"
                            >
                              Center
                            </button>
                          </div>

                          <div
                            contentEditable
                            suppressContentEditableWarning
                            onInput={(e) =>
                              handleFutureProgramChange(
                                index,
                                e.currentTarget.innerHTML
                              )
                            }
                            dangerouslySetInnerHTML={{ __html: item || "" }}
                            className="min-h-[120px] px-4 py-3 text-[14px] text-[#1f2430] outline-none"
                            style={{ whiteSpace: "pre-wrap" }}
                          />

                          {!item && (
                            <div className="pointer-events-none -mt-[112px] px-4 py-3 text-[14px] text-[#9ca3af]">
                              Enter future program details
                            </div>
                          )}

                          <div className="flex justify-end p-2">
                            <button
                              type="button"
                              onClick={() => removeFutureProgram(index)}
                              className="text-[12px] font-medium text-red-500"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Event Name</label>
                  <input value={reportForm.eventName} readOnly className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Vertical</label>
                  <input value={reportForm.vertical} readOnly className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Date</label>
                  <input value={reportForm.date} readOnly className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Time</label>
                  <input value={reportForm.time} readOnly className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Program</label>
                  <input value={reportForm.program} readOnly className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Venue</label>
                  <input value={reportForm.venue} readOnly className={inputClass} />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>Event Overview</label>
                  <textarea
                    rows={5}
                    value={reportForm.eventOverview}
                    onChange={(e) => handleReportChange("eventOverview", e.target.value)}
                    className="w-full rounded-2xl border border-[#e8ebf2] bg-white px-4 py-3 text-[14px] text-[#495160] outline-none"
                  />
                </div>

                <div>
                  <label className={labelClass}>Chief Guest</label>
                  <input
                    value={reportForm.chiefGuestCount}
                    onChange={(e) => handleReportChange("chiefGuestCount", e.target.value)}
                    className={inputClass}
                    placeholder="Numerical"
                  />
                </div>

                <div>
                  <label className={labelClass}>Chief Guest ID</label>
                  <input
                    value={reportForm.chiefGuestId}
                    onChange={(e) => handleReportChange("chiefGuestId", e.target.value)}
                    className={inputClass}
                    placeholder="ID"
                  />
                </div>

                <div>
                  <label className={labelClass}>Guest of Honor</label>
                  <input
                    value={reportForm.guestOfHonorCount}
                    onChange={(e) => handleReportChange("guestOfHonorCount", e.target.value)}
                    className={inputClass}
                    placeholder="Numerical"
                  />
                </div>

                <div>
                  <label className={labelClass}>Guest of Honor ID</label>
                  <input
                    value={reportForm.guestOfHonorId}
                    onChange={(e) => handleReportChange("guestOfHonorId", e.target.value)}
                    className={inputClass}
                    placeholder="ID"
                  />
                </div>

                <div>
                  <label className={labelClass}>Faculty / Keynote Speaker</label>
                  <input
                    value={reportForm.facultyCount}
                    onChange={(e) => handleReportChange("facultyCount", e.target.value)}
                    className={inputClass}
                    placeholder="Numerical"
                  />
                </div>

                <div>
                  <label className={labelClass}>Faculty ID</label>
                  <input
                    value={reportForm.facultyId}
                    onChange={(e) => handleReportChange("facultyId", e.target.value)}
                    className={inputClass}
                    placeholder="ID"
                  />
                </div>

                <div>
                  <label className={labelClass}>LGB Members</label>
                  <input
                    value={reportForm.lgbMembersCount}
                    onChange={(e) => handleReportChange("lgbMembersCount", e.target.value)}
                    className={inputClass}
                    placeholder="Numerical"
                  />
                </div>

                <div>
                  <label className={labelClass}>JC's</label>
                  <input
                    value={reportForm.jcsCount}
                    onChange={(e) => handleReportChange("jcsCount", e.target.value)}
                    className={inputClass}
                    placeholder="Numerical"
                  />
                </div>

                <div>
                  <label className={labelClass}>Family Members</label>
                  <input
                    value={reportForm.familyMembersCount}
                    onChange={(e) => handleReportChange("familyMembersCount", e.target.value)}
                    className={inputClass}
                    placeholder="Numerical"
                  />
                </div>

                <div>
                  <label className={labelClass}>Past Presidents</label>
                  <input
                    value={reportForm.pastPresidentsCount}
                    onChange={(e) => handleReportChange("pastPresidentsCount", e.target.value)}
                    className={inputClass}
                    placeholder="Numerical"
                  />
                </div>

                <div>
                  <label className={labelClass}>JAC</label>
                  <input
                    value={reportForm.jacCount}
                    onChange={(e) => handleReportChange("jacCount", e.target.value)}
                    className={inputClass}
                    placeholder="Numerical"
                  />
                </div>

                <div>
                  <label className={labelClass}>Non-JC</label>
                  <input
                    value={reportForm.nonJcCount}
                    onChange={(e) => handleReportChange("nonJcCount", e.target.value)}
                    className={inputClass}
                    placeholder="Numerical"
                  />
                </div>

                <div>
                  <label className={labelClass}>Zone / National Person</label>
                  <input
                    value={reportForm.zoneNationalPersonCount}
                    onChange={(e) => handleReportChange("zoneNationalPersonCount", e.target.value)}
                    className={inputClass}
                    placeholder="Numerical"
                  />
                </div>

                <div>
                  <label className={labelClass}>Zone / National Person ID</label>
                  <input
                    value={reportForm.zoneNationalPersonId}
                    onChange={(e) => handleReportChange("zoneNationalPersonId", e.target.value)}
                    className={inputClass}
                    placeholder="ID"
                  />
                </div>

                <div>
                  <label className={labelClass}>Total</label>
                  <input
                    value={reportForm.totalCount}
                    onChange={(e) => handleReportChange("totalCount", e.target.value)}
                    className={inputClass}
                    placeholder="Numerical"
                  />
                </div>

                <div className="md:col-span-2 grid gap-5 md:grid-cols-3">
                  {[
                    ["reportImageGroup1", "Event Gallery 1"],
                    ["reportImageGroup2", "Event Gallery 2"],
                    ["reportImageGroup3", "Event Gallery 3"],
                  ].map(([key, label]) => (
                    <div key={key}>
                      <label className={labelClass}>{label}</label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleReportImageUpload(key, e)}
                        className="block w-full text-[13px]"
                      />
                      <p className="mt-2 text-[12px] text-[#7b8494]">
                        Upload up to 10 images
                      </p>

                      {reportForm[key].length > 0 && (
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          {reportForm[key].map((img, index) => (
                            <img
                              key={index}
                              src={img}
                              alt={`${label} ${index + 1}`}
                              className="h-20 w-full rounded-xl object-cover"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSaveReport}
                className="rounded-full bg-gradient-to-r from-[#4e3ae9] to-[#6a42f5] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_14px_22px_rgba(78,58,233,0.22)]"
              >
                Save Event Report
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}


let classificationCache = null;
let classificationCacheTime = 0;

function Memberclassification({
  onLogout,
  onNavigate,
  activePage,
  showSettingsPage,
  setShowSettingsPage,
  adminUser,
}) {
  const [classLoading, setClassLoading] = useState(true);
  const [catCounts, setCatCounts] = useState({});
  const [segCounts, setSegCounts] = useState(buildEmptySegmentCounts);
  const [categoryGrowth, setCategoryGrowth] = useState({});
  const [topStats, setTopStats] = useState({ totalCategories: 0, growthMomentum: "+0%", topPerforming: "None", maxMembers: 1 });

  useEffect(() => {
    const fetchClassData = async () => {
      if (classificationCache && Date.now() - classificationCacheTime < 60000) {
         setCatCounts(classificationCache.catCounts);
         setSegCounts(classificationCache.segCounts);
         setCategoryGrowth(classificationCache.categoryGrowth);
         setTopStats(classificationCache.topStats);
         setClassLoading(false);
         return;
      }
      try {
        const res = await fetch('/api/admin/members?limit=500', { headers: getAdminHeaders() });
        if (res.status === 401 || res.status === 403) {
          clearAdminSessionStorage();
          onLogout();
          return;
        }
        const data = await res.json();
        if (res.ok) {
          const members = data.members || [];
          const cats = {};
          const segs = buildEmptySegmentCounts();
          const catGrowth = {};
          const segGrowth = {};
          let recent = 0;
          let prev = 0;
          const now = Date.now();

          members.forEach(m => {
            const isRecent = m.createdAt && (now - new Date(m.createdAt).getTime() <= 30 * 24 * 60 * 60 * 1000);
            const isPrev = m.createdAt && (!isRecent) && (now - new Date(m.createdAt).getTime() <= 60 * 24 * 60 * 60 * 1000);
            if (isRecent) recent++;
            if (isPrev) prev++;

            const cat = m.membershipCategory || 'Member';
            cats[cat] = (cats[cat] || 0) + 1;
            if (!catGrowth[cat]) catGrowth[cat] = { recent: 0, prev: 0 };
            if (isRecent) catGrowth[cat].recent++;
            if (isPrev) catGrowth[cat].prev++;

            const seg = m.memberSegment;
            if (seg) {
               segs[seg] = (segs[seg] || 0) + 1;
               if (!segGrowth[seg]) segGrowth[seg] = { recent: 0, prev: 0 };
               if (isRecent) segGrowth[seg].recent++;
               if (isPrev) segGrowth[seg].prev++;
            }
          });

          const g = prev === 0 ? (recent > 0 ? "+100%" : "0%") : `${recent >= prev ? "+" : ""}${Math.round(((recent - prev)/prev)*100)}%`;
          
          let topName = "None";
          let maxVal = -1;
          for (const [k, v] of Object.entries(cats)) {
             if (v > maxVal) { maxVal = v; topName = k; }
          }

          Object.keys(catGrowth).forEach(k => {
             const r = catGrowth[k].recent;
             const p = catGrowth[k].prev;
             catGrowth[k].str = p === 0 ? (r > 0 ? "+100%" : "0%") : `${r >= p ? "+" : ""}${Math.round(((r - p)/p)*100)}%`;
             catGrowth[k].class = r >= p ? "text-emerald-500 bg-emerald-50" : "text-red-500 bg-red-50";
          });
          Object.keys(segGrowth).forEach(k => {
             const r = segGrowth[k].recent;
             const p = segGrowth[k].prev;
             segGrowth[k].str = p === 0 ? (r > 0 ? "+100%" : "0%") : `${r >= p ? "+" : ""}${Math.round(((r - p)/p)*100)}%`;
             segGrowth[k].class = r >= p ? "text-emerald-500 bg-emerald-50" : "text-red-500 bg-red-50";
          });

          const maxMembersObj = Math.max(...Object.values(cats), ...Object.values(segs), 1);
          const stats = { totalCategories: Object.keys(cats).length + Object.keys(segs).length, growthMomentum: g, topPerforming: topName, maxMembers: maxMembersObj };

          setCatCounts(cats);
          setSegCounts(segs);
          setCategoryGrowth({ ...catGrowth, ...segGrowth });
          setTopStats(stats);

          classificationCache = { catCounts: cats, segCounts: segs, topStats: stats, categoryGrowth: { ...catGrowth, ...segGrowth } };
          classificationCacheTime = Date.now();
        }
      } catch (e) { console.error(e); }
      finally { setClassLoading(false); }
    };
    fetchClassData();
  }, [onLogout]);

  const defaultSegments = [
    { name: "Member", bar: "bg-[#10b981]", iconWrap: "bg-[#ecfdf5] text-[#10b981]", icon: <Users className="h-4 w-4" />, group: "categories" },
    { name: "Appointee", bar: "bg-[#3B82F6]", iconWrap: "bg-[#eef5ff] text-[#3B82F6]", icon: <Briefcase className="h-4 w-4" />, group: "categories" },
    { name: "Coordinator", bar: "bg-[#06B6D4]", iconWrap: "bg-[#ecfeff] text-[#06B6D4]", icon: <LayoutGrid className="h-4 w-4" />, group: "categories" },
    { name: "Director", bar: "bg-[#F59E0B]", iconWrap: "bg-[#fffbeb] text-[#F59E0B]", icon: <FolderKanban className="h-4 w-4" />, group: "categories" },
    { name: "Vice President", bar: "bg-[#8B5CF6]", iconWrap: "bg-[#f5edff] text-[#8B5CF6]", icon: <Sparkles className="h-4 w-4" />, group: "categories" },
    { name: "Secretary", bar: "bg-[#EC4899]", iconWrap: "bg-[#fdf2f8] text-[#EC4899]", icon: <Mail className="h-4 w-4" />, group: "categories" },
    { name: "Treasurer", bar: "bg-[#14B8A6]", iconWrap: "bg-[#f0fdfa] text-[#14B8A6]", icon: <CreditCard className="h-4 w-4" />, group: "categories" },
    { name: "President", bar: "bg-[#64748B]", iconWrap: "bg-[#f1f5f9] text-[#64748B]", icon: <ShieldCheck className="h-4 w-4" />, group: "categories" },
    ...MEMBER_SEGMENT_OPTIONS.map((name) => ({
      name,
      ...SEGMENT_CLASSIFICATION_META[name],
      group: "segment",
    })),
  ];

  const segments = defaultSegments.map(s => {
    const isCat = s.group === "categories";
    const membersCount = (isCat ? catCounts[s.name] : segCounts[s.name]) || 0;
    const growthData = categoryGrowth[s.name] || {};
    return {
      ...s,
      members: membersCount,
      growth: growthData.str || "0%",
      growthClass: growthData.class || "text-slate-500 bg-slate-50",
      action: "View Members",
    };
  });

  const updates = [
    {
      title: "New Member in JAC",
      subtitle: "Jon Sen Smith joined 2 hours ago",
      time: "2m ago",
    },
    {
      title: "Category Renamed",
      subtitle: "LGB updated to LGB Member",
      time: "5h ago",
    },
  ];

  const [activeCategoryTab, setActiveCategoryTab] = useState("categories");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredSegments = segments.filter(
    (item) => item.group === activeCategoryTab
  );

  return (
    <div className="min-h-screen w-full bg-[#eef0f5] p-0 lg:p-2 sm:p-3">
      <div className="min-h-screen w-full rounded-none border-0 bg-white shadow-none lg:min-h-[calc(100vh-1rem)] lg:rounded-[22px] lg:border lg:border-[#dfe3ee] lg:shadow-[0_20px_60px_rgba(25,30,60,0.08)] sm:lg:min-h-[calc(100vh-1.5rem)]">
        <div className="flex h-full w-full">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="fixed right-4 top-4 z-50 rounded-full bg-[#5b3df5] p-3 text-white shadow-lg lg:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Mobile Overlay */}
          {mobileMenuOpen && (
            <div
              className="fixed inset-0 z-30 bg-black/30 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside
           className={`fixed inset-y-0 left-0 z-40 h-full w-[260px] transform border-r border-[#edf0f5] bg-[#f7f9fc] px-4 py-5 transition-transform duration-300 ease-in-out sm:px-5 sm:py-6 lg:static lg:z-auto lg:h-auto lg:self-stretch lg:translate-x-0 ${
  mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
}`}
          >
            <div className="flex h-full flex-col">
              <SidebarBrand />

              <nav className="mt-8 space-y-1 sm:mt-10 sm:space-y-2">
                <SidebarItem
                  icon={LayoutDashboard}
                  label="Dashboard"
                  active={activePage === "dashboard"}
                  onClick={() => {
                    onNavigate("dashboard");
                    setMobileMenuOpen(false);
                  }}
                />

                <SidebarItem
                  icon={Users}
                  label="Members"
                  active={activePage === "members"}
                  onClick={() => {
                    onNavigate("members");
                    setMobileMenuOpen(false);
                  }}
                />

                <SidebarItem
                  icon={FolderKanban}
                  label={MEMBER_CLASSIFICATION_LABEL}
                  active={activePage === "Memberclassification"}
                  onClick={() => {
                    onNavigate("Memberclassification");
                    setMobileMenuOpen(false);
                  }}
                />

                <SidebarItem
                  icon={CalendarDays}
                  label="Events"
                  active={activePage === "events"}
                  onClick={() => {
                    onNavigate("events");
                    setMobileMenuOpen(false);
                  }}
                />

                <SidebarItem
                  icon={BarChart3}
                  label="Analytics"
                  active={activePage === "analytics"}
                  onClick={() => {
                    onNavigate("analytics");
                    setMobileMenuOpen(false);
                  }}
                />

                <SettingsToggleBlock
                  activePage={activePage}
                  onNavigate={(page) => {
                    onNavigate(page);
                    setMobileMenuOpen(false);
                  }}
                  showSettingsPage={showSettingsPage}
                  setShowSettingsPage={setShowSettingsPage}
                />
              </nav>

              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="mt-auto flex h-[50px] w-full items-center justify-center rounded-full bg-gradient-to-r from-[#FF0000] to-[#FF0000] text-[14px] font-semibold text-white shadow-[0_20px_30px_rgba(78,58,233,0.25)] sm:h-[56px] sm:text-[16px]"
              >
                Logout
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="relative z-10 min-w-0 flex-1 bg-[#f5f7fb] px-4 py-4 pt-20 sm:px-5 sm:py-5 sm:pt-20 md:px-6 md:py-6 md:pt-24 lg:pt-6">
            <div className="mx-auto w-full max-w-none">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex h-[44px] w-full max-w-[430px] items-center gap-2 rounded-full border border-[#edf0f6] bg-white px-3 shadow-sm sm:gap-3 sm:px-4">
                  <Search className="h-3.5 w-3.5 text-[#9ca3b1] sm:h-4 sm:w-4" />
                  <input
                    className="w-full bg-transparent text-[13px] text-[#4b5563] outline-none placeholder:text-[#b3bac6] sm:text-[14px]"
                    placeholder="Search categories..."
                  />
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                  <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#636b7b] shadow-sm ring-1 ring-[#eceef4] transition hover:bg-[#fafbff] sm:h-12 sm:w-12">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#5b3df5] sm:top-3.5 sm:right-3.5"></span>
                  </button>
                  <AdminHeader adminUser={adminUser} />
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:mt-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h1 className="text-[1.6rem] font-bold leading-none tracking-[-0.04em] text-[#1f2430] sm:text-[1.8rem] md:text-[2rem] lg:text-[2.1rem]">
                    Category Management
                  </h1>
                  <p className="mt-1.5 text-[12px] text-[#7b8393] sm:mt-2 sm:text-[13px] md:text-[14px]">
                    Organize and curate your business directory&apos;s expertise
                    segments.
                  </p>
                </div>

                <button className="rounded-full bg-gradient-to-r from-[#5b3df5] to-[#6b4cf6] px-5 py-2 text-[12px] font-semibold text-white shadow-[0_18px_30px_rgba(91,61,245,0.28)] sm:px-6 sm:py-2.5 sm:text-[13px] md:text-[14px]">
                  + Add New Category
                </button>
              </div>

              <section className="mt-4 grid grid-cols-1 gap-3 sm:mt-5 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="relative overflow-hidden rounded-[20px] bg-white p-4 shadow-sm ring-1 ring-[#edf0f5] sm:p-5">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#a3a9b7] sm:text-[12px]">
                    Total Categories
                  </p>
                  <h3 className="mt-2 text-[1.8rem] font-bold text-[#1f2430] sm:text-[2rem] md:text-[2.2rem]">
                    {topStats.totalCategories}
                  </h3>
                  <p className="mt-4 text-[11px] font-semibold text-[#6b5bf6] sm:mt-5 sm:text-[12px] md:mt-6">
                    ↗ Active Growth
                  </p>
                  <div className="absolute bottom-2 right-3 text-[56px] font-bold leading-none text-[#f3f4f8] sm:bottom-3 sm:right-4 sm:text-[64px] md:text-[72px]">
                    △
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-[20px] bg-white p-4 shadow-sm ring-1 ring-[#edf0f5] sm:p-5">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#a3a9b7] sm:text-[12px]">
                    Growth Momentum
                  </p>
                  <h3 className="mt-2 text-[1.8rem] font-bold text-[#1f2430] sm:text-[2rem] md:text-[2.2rem]">
                    {topStats.growthMomentum}
                  </h3>
                  <p className="mt-4 text-[11px] font-semibold text-[#6b5bf6] sm:mt-5 sm:text-[12px] md:mt-6">
                    Last 30 Days
                  </p>
                  <div className="absolute bottom-2 right-3 text-[48px] font-bold leading-none text-[#f3f4f8] sm:bottom-3 sm:right-4 sm:text-[56px] md:text-[62px]">
                    ✦
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-[20px] bg-white p-4 shadow-sm ring-1 ring-[#edf0f5] sm:p-5">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#a3a9b7] sm:text-[12px]">
                    Top Performing
                  </p>
                  <h3 className="mt-2 text-[1.8rem] font-bold text-[#1f2430] sm:text-[2rem] md:text-[2.1rem]">
                    {topStats.topPerforming}
                  </h3>
                  <p className="mt-4 text-[11px] font-semibold text-[#6b5bf6] sm:mt-5 sm:text-[12px] md:mt-6">
                    ★ Most Active Group
                  </p>
                  <div className="absolute bottom-2 right-3 text-[52px] font-bold leading-none text-[#f3f4f8] sm:bottom-3 sm:right-4 sm:text-[58px] md:text-[62px]">
                    ✓
                  </div>
                </div>
              </section>

              <section className="mt-5 sm:mt-6">
                <div className="flex items-center gap-2 rounded-2xl bg-[#f3f5f9] p-1.5 ring-1 ring-[#e7ebf3] sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveCategoryTab("categories")}
                    className={`rounded-xl px-4 py-2 text-[12px] font-semibold transition sm:px-5 sm:py-2.5 sm:text-[13px] md:text-[14px] ${
                      activeCategoryTab === "categories"
                        ? "bg-[#5b3df5] text-white shadow-[0_10px_24px_rgba(91,61,245,0.28)]"
                        : "text-[#8f97a8] hover:text-[#2c3445]"
                    }`}
                  >
                    Categories
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCategoryTab("segment")}
                    className={`rounded-xl px-4 py-2 text-[12px] font-semibold transition sm:px-5 sm:py-2.5 sm:text-[13px] md:text-[14px] ${
                      activeCategoryTab === "segment"
                        ? "bg-[#5b3df5] text-white shadow-[0_10px_24px_rgba(91,61,245,0.28)]"
                        : "text-[#8f97a8] hover:text-[#2c3445]"
                    }`}
                  >
                    Segment
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:mt-5 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredSegments.map((segment) => (
                    <div
                      key={segment.name}
                      className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-[#edf0f5] sm:p-5"
                    >
                      <div className="flex items-start justify-between">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-2xl ${segment.iconWrap} sm:h-11 sm:w-11 md:h-12 md:w-12`}
                        >
                          {segment.icon}
                        </div>
                        <span
                          className={`rounded-full px-2 py-1 text-[10px] font-semibold sm:px-3 sm:py-1 sm:text-[11px] md:text-[12px] ${segment.growthClass}`}
                        >
                          {segment.growth}
                        </span>
                      </div>

                      <h3 className="mt-4 text-[1.1rem] font-bold tracking-[-0.03em] text-[#1f2430] sm:mt-5 sm:text-[1.2rem]">
                        {segment.name}
                      </h3>

                      <p className="mt-1 text-[11px] text-[#8b93a3] sm:text-[12px]">
                        {segment.members} members total
                      </p>

                      <div className="mt-4 h-2 rounded-full bg-[#edf0f5] sm:mt-5">
                        <div className={`h-2 rounded-full ${segment.bar}`} style={{ width: `${Math.max(2, Math.round((segment.members / Math.max(1, topStats.maxMembers)) * 100))}%` }} />
                      </div>

                      <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#eef1f6] py-2 text-[12px] font-semibold text-[#3b4354] sm:mt-5 sm:py-2.5 sm:text-[13px]">
                        ✎ Manage
                      </button>

                      <button onClick={() => onNavigate("members", segment.name)} className="mt-2 w-full text-center text-[11px] font-medium text-[#8a91a2] hover:text-[#5b3df5] sm:mt-3 sm:text-[12px]">
                        {segment.action}
                      </button>
                    </div>
                  ))}
                </div>
              </section>

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}



let dashboardCache = null;
let dashboardCacheTime = 0;

function DashboardPage({ onLogout, onNavigate, activePage, showSettingsPage, setShowSettingsPage, adminUser }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({ totalMembers: 0, newThisMonth: 0, totalEvents: 0, activeMembers: 0 });
  const [categoryStats, setCategoryStats] = useState([]);
  const [segmentStats, setSegmentStats] = useState([]);
  const [membersList, setMembersList] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (dashboardCache && Date.now() - dashboardCacheTime < 60000) {
        setStats(dashboardCache.stats);
        setCategoryStats(dashboardCache.categoryStats);
        setSegmentStats(dashboardCache.segmentStats);
        setMembersList(dashboardCache.membersList);
        setStatsLoading(false);
        return;
      }
      setStatsLoading(true);
      try {
        const [statsRes, membersRes] = await Promise.all([
          fetch('/api/admin/stats', { headers: getAdminHeaders() }),
          fetch('/api/admin/members?limit=200', { headers: getAdminHeaders() }),
        ]);
        const statsData = await statsRes.json();
        const membersData = await membersRes.json();

        if (
          statsRes.status === 401 ||
          statsRes.status === 403 ||
          membersRes.status === 401 ||
          membersRes.status === 403
        ) {
          clearAdminSessionStorage();
          onLogout();
          return;
        }

        if (statsRes.ok) setStats(statsData);

        if (membersRes.ok) {
          const members = membersData.members || [];
          // Count by membershipCategory
          const catCounts = {};
          const segCounts = buildEmptySegmentCounts();
          members.forEach(m => {
            const cat = m.membershipCategory || 'Member';
            catCounts[cat] = (catCounts[cat] || 0) + 1;
            if (m.memberSegment && Object.prototype.hasOwnProperty.call(segCounts, m.memberSegment)) {
              segCounts[m.memberSegment] += 1;
            }
          });
          const CATEGORY_COLORS = [
            { color: 'from-[#4e3ae9] to-[#6a42f5]' }, { color: 'from-[#6a5af9] to-[#8d88ff]' },
            { color: 'from-[#06b6d4] to-[#67e8f9]' }, { color: 'from-[#f59e0b] to-[#fcd34d]' },
            { color: 'from-[#8b5cf6] to-[#c4b5fd]' }, { color: 'from-[#ec4899] to-[#f9a8d4]' },
            { color: 'from-[#14b8a6] to-[#5eead4]' }, { color: 'from-[#64748b] to-[#cbd5e1]' },
          ];
          const CATEGORY_ORDER = ['Member','Appointee','Coordinator','Director','Vice President','Secretary','Treasurer','President'];
          const cats = CATEGORY_ORDER.map((name, i) => ({
            name, value: catCounts[name] || 0, color: CATEGORY_COLORS[i % CATEGORY_COLORS.length].color
          }));
          if (cats.length === 0 && Object.keys(catCounts).length > 0) {
            Object.entries(catCounts).forEach(([name, value], i) => cats.push({ name, value, color: CATEGORY_COLORS[i % CATEGORY_COLORS.length].color }));
          }
          setCategoryStats(cats);
          const currentSegmentStats = buildSegmentStats(segCounts);
          setSegmentStats(currentSegmentStats);
          setMembersList(members);

          dashboardCache = {
            stats: statsData,
            categoryStats: cats,
            segmentStats: currentSegmentStats,
            membersList: members
          };
          dashboardCacheTime = Date.now();
        }
      } catch (e) {
        console.error('Dashboard data fetch error:', e);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchDashboardData();
  }, [onLogout]);

  return (
    <div className="bg-[#f4f5f7] text-[#1f2430]">
      <div className="flex">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="fixed top-4 right-4 z-50 rounded-full bg-[#5b3df5] p-3 text-white shadow-lg lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>

        <aside className={`fixed inset-y-0 left-0 z-40 w-[260px] transform border-r border-[#edf0f5] bg-[#f7f9fc] px-4 py-5 transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} sm:px-5 sm:py-6`}>
          <div className="flex h-full flex-col">
            <div>
              <SidebarBrand />

              <nav className="mt-8 space-y-1 sm:mt-10 sm:space-y-2">
                <SidebarItem
                  icon={LayoutDashboard}
                  label="Dashboard"
                  active={activePage === "dashboard"}
                  onClick={() => {
                    onNavigate("dashboard");
                    setMobileMenuOpen(false);
                  }}
                />
                <SidebarItem
                  icon={Users}
                  label="Members"
                  active={activePage === "members"}
                  onClick={() => {
                    onNavigate("members");
                    setMobileMenuOpen(false);
                  }}
                />
                <SidebarItem
                  icon={FolderKanban}
                  label={MEMBER_CLASSIFICATION_LABEL}
                  active={activePage === "Memberclassification"}
                  onClick={() => {
                    onNavigate("Memberclassification");
                    setMobileMenuOpen(false);
                  }}
                />
                <SidebarItem
                  icon={CalendarDays}
                  label="Events"
                  active={activePage === "events"}
                  onClick={() => {
                    onNavigate("events");
                    setMobileMenuOpen(false);
                  }}
                />
                <SidebarItem
                  icon={BarChart3}
                  label="Analytics"
                  active={activePage === "analytics"}
                  onClick={() => {
                    onNavigate("analytics");
                    setMobileMenuOpen(false);
                  }}
                />
                <SettingsToggleBlock
                  activePage={activePage}
                  onNavigate={(page) => {
                    onNavigate(page);
                    setMobileMenuOpen(false);
                  }}
                  showSettingsPage={showSettingsPage}
                  setShowSettingsPage={setShowSettingsPage}
                />
              </nav>
            </div>

            <button
              onClick={() => {
                onLogout();
                setMobileMenuOpen(false);
              }}
              className="mt-auto flex h-[50px] w-full items-center justify-center rounded-full bg-[#ff1a12] text-[14px] font-semibold text-white shadow-[0_20px_30px_rgba(255,26,18,0.22)] sm:h-[56px] sm:text-[16px]"
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="relative z-10 flex-1 px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-7 xl:px-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex h-[48px] w-full max-w-[540px] items-center gap-2 rounded-full border border-[#eff1f5] bg-[#f8f9fb] px-3 shadow-inner sm:gap-3 sm:px-4 md:px-5">
              <Search className="h-4 w-4 text-[#9ca3b1] sm:h-4.5 sm:w-4.5 md:h-5 md:w-5" />
              <input className="w-full bg-transparent text-[13px] text-[#48505f] outline-none placeholder:text-[#afb5c2] sm:text-[14px] md:text-[15px]" placeholder="Search members or data..." />
            </div>

            <div className="flex items-center justify-end gap-3 sm:gap-4">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#636b7b] shadow-sm ring-1 ring-[#eceef4] transition hover:bg-[#fafbff] sm:h-12 sm:w-12">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#5b3df5] sm:top-3.5 sm:right-3.5"></span>
            </button>
            <AdminHeader adminUser={adminUser} />
            </div>
          </div>

          <section className="mt-5 sm:mt-6 md:mt-7 lg:mt-8">
            <h1 className="text-[2rem] font-bold tracking-[-0.05em] leading-none sm:text-[2.5rem] md:text-[2.8rem] lg:text-[3.2rem]">Welcome, {(adminUser?.name || "Admin").replace("System Administrator", "Admin")}</h1>
            <p className="mt-2 text-[1.1rem] text-[#6f7787] sm:mt-2.5 sm:text-[1.2rem] md:mt-3 md:text-[1.25rem] lg:text-[1.35rem]">
              Your directory ecosystem is growing. Here's the live overview.
            </p>
          </section>

          <section className="mt-5 grid gap-4 sm:mt-6 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-[22px] bg-white p-5 shadow-[0_8px_24px_rgba(25,30,60,0.04)] ring-1 ring-[#efeff3]">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#a3a9b7]">Total Members</p>
              <p className="mt-2 text-[2rem] font-bold text-[#1f2430]">{statsLoading ? '—' : stats.totalMembers}</p>
            </div>
            <div className="rounded-[22px] bg-white p-5 shadow-[0_8px_24px_rgba(25,30,60,0.04)] ring-1 ring-[#efeff3]">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#a3a9b7]">Active Members</p>
              <p className="mt-2 text-[2rem] font-bold text-[#1f2430]">{statsLoading ? '—' : stats.activeMembers}</p>
            </div>
            <div className="rounded-[22px] bg-white p-5 shadow-[0_8px_24px_rgba(25,30,60,0.04)] ring-1 ring-[#efeff3]">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#a3a9b7]">New This Month</p>
              <p className="mt-2 text-[2rem] font-bold text-[#1f2430]">{statsLoading ? '—' : stats.newThisMonth}</p>
            </div>
            <div className="rounded-[22px] bg-white p-5 shadow-[0_8px_24px_rgba(25,30,60,0.04)] ring-1 ring-[#efeff3]">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#a3a9b7]">Total Events</p>
              <p className="mt-2 text-[2rem] font-bold text-[#1f2430]">{statsLoading ? '—' : stats.totalEvents}</p>
            </div>
          </section>

          <section className="mt-5 sm:mt-6 md:mt-7 lg:mt-8">
            <GrowthChart members={membersList} />
          </section>

          <section className="mt-5 space-y-6 sm:mt-6 sm:space-y-7 md:mt-7 md:space-y-8">
            <section className="mt-5 grid gap-4 sm:mt-6 sm:gap-5 lg:grid-cols-2">
              {/* Categories of Members Section - Live DB data */}
              <div className="rounded-[32px] bg-[linear-gradient(135deg,#ffffff_0%,#f7f4ff_52%,#eef4ff_100%)] p-5 shadow-[0_24px_60px_rgba(91,61,245,0.10)] ring-1 ring-[#ebe7ff] sm:p-6 md:p-7 lg:p-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-[1.3rem] font-bold tracking-[-0.04em] text-[#1f2430] sm:text-[1.5rem] md:text-[1.7rem] lg:text-[1.9rem]">
                    Categories of Members
                  </h3>
                  <button className="text-[#8f96a4] text-[16px] leading-none sm:text-[17px] md:text-[18px]">•••</button>
                </div>
                <div className="mt-5 space-y-4 sm:mt-6 sm:space-y-5 md:mt-7 md:space-y-6">
                  {statsLoading ? (
                    <p className="text-sm text-[#9aa2b0]">Loading...</p>
                  ) : categoryStats.length === 0 ? (
                    <p className="text-sm text-[#9aa2b0]">No members yet.</p>
                  ) : (() => {
                    const max = Math.max(...categoryStats.map(c => c.value), 1);
                    return categoryStats.map((item) => {
                      const perc = Math.round((item.value / max) * 100);
                      return (
                        <div
                          key={item.name}
                          className="rounded-[24px] bg-gradient-to-r from-[#f8f6ff] to-[#ffffff] p-4 ring-1 ring-[#eceff5] shadow-[0_10px_24px_rgba(25,30,60,0.04)]"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <span className={`h-3 w-3 rounded-full ${item.color.replace('from-', 'bg-').split(' ')[0] || 'bg-[#5b3df5]'}`} />
                              <div>
                                <p className="text-[15px] font-bold text-[#1f2430] sm:text-[16px]">
                                  {item.name}
                                </p>
                                <p className="mt-1 text-[12px] font-medium text-[#8b92a1]">
                                  Category
                                </p>
                              </div>
                            </div>
                    
                            <div className="text-right">
                              <p className="text-[18px] font-bold tracking-[-0.03em] text-[#1f2430] sm:text-[20px]">
                                {item.value}
                              </p>
                              <p className="text-[11px] uppercase tracking-[0.16em] text-[#9aa2b0]">
                                Members
                              </p>
                            </div>
                          </div>
                    
                          <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/80 ring-1 ring-[#eceff5]">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                              style={{ width: `${perc}%` }}
                            />
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Segment of Members Section - Live DB data */}
              <div className="rounded-[32px] bg-[linear-gradient(135deg,#ffffff_0%,#f7f5ff_55%,#eef4ff_100%)] p-5 shadow-[0_20px_50px_rgba(91,61,245,0.08)] ring-1 ring-[#ebe7ff] sm:p-6 md:p-7 lg:p-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-[1.3rem] font-bold tracking-[-0.04em] text-[#1f2430] sm:text-[1.5rem] md:text-[1.6rem] lg:text-[1.7rem]">
                    Segment of Members
                  </h3>
                  <button className="text-[#8f96a4] text-[16px] leading-none sm:text-[17px] md:text-[18px]">•••</button>
                </div>
                <div className="mt-5 space-y-4 sm:mt-6 sm:space-y-5">
                  {statsLoading ? (
                    <p className="text-sm text-[#9aa2b0]">Loading...</p>
                  ) : (() => {
                    const maxSeg = Math.max(...segmentStats.map(s => s.value), 1);
                    const SEG_COLORS = ['from-[#4e3ae9] via-[#6a42f5] to-[#8b5cf6]', 'from-[#06b6d4] via-[#3b82f6] to-[#7c3aed]'];
                    return segmentStats.map((seg, i) => {
                      const perc = Math.round((seg.value / maxSeg) * 100);
                      const bar = SEG_COLORS[i % SEG_COLORS.length];
                      const dot = bar.split(' ')[0].replace('from-', 'bg-');
                      const card = i % 2 === 0 ? "from-[#f4f0ff] to-[#ffffff]" : "from-[#eef8ff] to-[#ffffff]";
                      return (
                        <div
                          key={seg.name}
                          className={`rounded-[24px] bg-gradient-to-r ${card} p-4 ring-1 ring-[#eceff5] shadow-[0_10px_24px_rgba(25,30,60,0.04)]`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <span className={`h-3 w-3 rounded-full ${dot}`} />
                              <div>
                                <p className="text-[15px] font-bold text-[#1f2430] sm:text-[16px]">
                                  {seg.name}
                                </p>
                                <p className="mt-1 text-[12px] font-medium text-[#8b92a1]">
                                  Segment
                                </p>
                              </div>
                            </div>
                    
                            <div className="text-right">
                              <p className="text-[18px] font-bold tracking-[-0.03em] text-[#1f2430] sm:text-[20px]">
                                {seg.value}
                              </p>
                              <p className="text-[11px] uppercase tracking-[0.16em] text-[#9aa2b0]">
                                Members
                              </p>
                            </div>
                          </div>
                    
                          <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/80 ring-1 ring-[#eceff5]">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${bar}`}
                              style={{ width: `${perc}%` }}
                            />
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </section>
            <RecentActivity members={membersList} />
          </section>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [adminUser, setAdminUser] = useState(() => getAdminUser());
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY)));
  const [isSessionChecking, setIsSessionChecking] = useState(() => Boolean(localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY)));
  const [activePage, setActivePage] = useState("dashboard");
  const [showSettingsPage, setShowSettingsPage] = useState(false);
  const [membersFilter, setMembersFilter] = useState("All");
  const [eventCategoryFilter, setEventCategoryFilter] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const validateAdminSession = async () => {
      const session = await fetchAuthenticatedAdmin();

      if (!isMounted) {
        return;
      }

      if (session.ok) {
        localStorage.setItem(ADMIN_USER_STORAGE_KEY, JSON.stringify(session.member));
        setAdminUser(session.member);
        setIsLoggedIn(true);
      } else {
        clearAdminSessionStorage();
        setAdminUser(null);
        setIsLoggedIn(false);
      }

      setIsSessionChecking(false);
    };

    if (!localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY)) {
      setIsSessionChecking(false);
      return undefined;
    }

    validateAdminSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogin = (user) => {
    setAdminUser(user);
    setIsLoggedIn(true);
    setIsSessionChecking(false);
  };

  const handleLogout = () => {
    clearAdminSessionStorage();
    setIsLoggedIn(false);
    setAdminUser(null);
    setActivePage("dashboard");
    setMembersFilter("All");
    setEventCategoryFilter("All");
    setSelectedEvent(null);
    setShowSettingsPage(false);
  };



 const handleNavigate = (page, filter = "All", eventData = null) => {
  setActivePage(page);
  setEventCategoryFilter?.(filter);
  setSelectedEvent?.(eventData);

  if (page === "members") {
    setMembersFilter(filter || "All");
  }
};

  useEffect(() => {
    if (!showSettingsPage && activePage === "settings") {
      setActivePage("dashboard");
    }
  }, [showSettingsPage, activePage]);

  if (isSessionChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f5f7] px-4 text-[#1f2430]">
        <div className="w-full max-w-md rounded-[30px] border border-[#e5e8f0] bg-white px-8 py-10 text-center shadow-[0_20px_60px_rgba(25,30,60,0.08)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5b3df5] text-white shadow-[0_18px_30px_rgba(91,61,245,0.24)]">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-[2rem] font-bold tracking-[-0.04em] text-[#1f2430]">
            Verifying admin access
          </h1>
          <p className="mt-3 text-[15px] leading-7 text-[#8c90a0]">
            Please wait while we confirm your session and permissions.
          </p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <LoginPage
        onLogin={handleLogin}
        onGoogleLogin={() => setIsLoggedIn(true)}
      />
    );
  }

  if (activePage === "members") {
  return (
    <MembersPage
      onLogout={handleLogout}
      onNavigate={handleNavigate}
      activePage={activePage}
      showSettingsPage={showSettingsPage}
      setShowSettingsPage={setShowSettingsPage}
      defaultFilter={membersFilter}
      adminUser={adminUser}
    />
  );
}

  if (activePage === "events") {
    return (
      <EventsPage
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        activePage={activePage}
        showSettingsPage={showSettingsPage}
        setShowSettingsPage={setShowSettingsPage}
        eventCategoryFilter={eventCategoryFilter}
        setEventCategoryFilter={setEventCategoryFilter}
        adminUser={adminUser}
      />
    );
  }

  if (activePage === "eventDetails") {
    return (
      <EventDetailsPage
        event={selectedEvent}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        activePage={activePage}
        showSettingsPage={showSettingsPage}
        setShowSettingsPage={setShowSettingsPage}
        adminUser={adminUser}
      />
    );
  }


  if (activePage === "eventReport") {
  return (
    <EventReportPage
      event={selectedEvent}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
      activePage={activePage}
      showSettingsPage={showSettingsPage}
      setShowSettingsPage={setShowSettingsPage}
      adminUser={adminUser}
    />
  );
}


  if (activePage === "analytics") {
    return (
      <AnalyticsPage
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        activePage={activePage}
        showSettingsPage={showSettingsPage}
        setShowSettingsPage={setShowSettingsPage}
        adminUser={adminUser}
      />
    );
  }

  if (activePage === "Memberclassification") {
    return (
      <Memberclassification
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        activePage={activePage}
        showSettingsPage={showSettingsPage}
        setShowSettingsPage={setShowSettingsPage}
        adminUser={adminUser}
      />
    );
  }

  if (activePage === "settings" && showSettingsPage) {
    return (
      <SettingsPage
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        activePage={activePage}
        showSettingsPage={showSettingsPage}
        setShowSettingsPage={setShowSettingsPage}
        adminUser={adminUser}
        onAdminUpdate={handleLogin}
      />
    );
  }

  return (
    <DashboardPage
      onLogout={handleLogout}
      onNavigate={handleNavigate}
      activePage={activePage}
      showSettingsPage={showSettingsPage}
      setShowSettingsPage={setShowSettingsPage}
      adminUser={adminUser}
    />
  );
}
