import React, { useState, useEffect, useMemo, useCallback } from "react";
// ATTENZIONE: Assicurati di aver aggiunto "lucide-react" e "firebase" nelle Dependencies di CodeSandbox!
import {
  Search,
  PlusCircle,
  Save,
  HardHat,
  Factory,
  History,
  User,
  X,
  Trash2,
  Lock,
  Settings,
  ChevronRight,
  ChevronDown,
  Monitor,
  Smartphone,
  RefreshCw,
  Layers,
  Calendar as CalendarIcon,
  ClipboardList,
  Briefcase,
  Printer,
  Activity,
  AlertOctagon,
  Terminal,
  LogOut,
  Users,
  Palette,
  ArrowLeft,
  Edit,
  AlertTriangle,
  Trophy,
  PieChart,
  BarChart3,
  Database,
  Merge,
  Wifi,
  WifiOff,
  DatabaseZap,
  Clock,
  ListTree,
} from "lucide-react";
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  limit,
  where,
  getDocs,
  enableIndexedDbPersistence,
} from "firebase/firestore";

// --- CSS GLOBALE ED EFFETTI ---
const GlobalStyles = () => (
  <style>{`
    html { scroll-behavior: smooth; }
    body { background-color: #f8fafc; overflow-x: hidden; }
    .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(148, 163, 184, 0.4); border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(148, 163, 184, 0.7); }
    .glass-effect { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.4); }
    @keyframes slideUpFade { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes zoomInFade { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .anim-slide-up { animation: slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .anim-zoom-in { animation: zoomInFade 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .anim-fade-in { animation: fadeIn 0.3s ease-out forwards; }
  `}</style>
);

// --- CONFIGURAZIONE FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyCQ3VhCtvxIP2cxtdSgMzYXaTg4E1zPlZE",
  authDomain: "mora-app-36607.firebaseapp.com",
  projectId: "mora-app-36607",
  storageBucket: "mora-app-36607.firebasestorage.app",
  messagingSenderId: "1039836991600",
  appId: "1:1039836991600:web:dc33445a0cd54a9473e4b5",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

try {
  enableIndexedDbPersistence(db).catch((err) =>
    console.log("Persistenza:", err.code)
  );
} catch (e) {
  console.log("Err Persistenza:", e);
}

const appId = "mora-maintenance-v1";
const ADMIN_PASSWORD = "Mora1932";

const DEFAULT_LAYOUT = {
  themeColor: "blue",
  borderRadius: "3xl",
  appTitle: "Assistenza Mora",
  dashboardOrder: ["new", "explore", "history", "database", "office", "admin"],
  formOrder: [
    "technician",
    "date",
    "ticketNumber",
    "customer",
    "machine",
    "capacity",
    "description",
    "custom",
  ],
  customFields: [],
  formSettings: {
    showMachineId: true,
    showMachineType: true,
    showCapacity: true,
  },
};

// --- DIZIONARIO COLORI STATICO (Indispensabile per CodeSandbox) ---
const THEMES = {
  blue: {
    bg600: "bg-blue-600",
    bg500: "bg-blue-500",
    bg100: "bg-blue-100",
    bg50: "bg-blue-50",
    bg50_80: "bg-blue-50/80",
    bg50_30: "bg-blue-50/30",
    text700: "text-blue-700",
    text600: "text-blue-600",
    text500: "text-blue-500",
    text100: "text-blue-100",
    text400: "text-blue-400",
    border500: "border-blue-500",
    border300: "border-blue-300",
    border200: "border-blue-200",
    border400: "hover:border-blue-400",
    ring500: "focus:ring-blue-500/15",
    shadow500: "shadow-blue-500/30",
    shadowHover: "hover:shadow-blue-500/40",
    shadowLight: "shadow-blue-500/10",
    shadow20: "shadow-blue-500/20",
    hoverBg50: "hover:bg-blue-50",
    hoverBg600: "hover:bg-blue-600",
    hoverText600: "hover:text-blue-600",
    hoverBorder200: "hover:border-blue-200",
    hoverBorder300: "hover:border-blue-300",
    focusBorder: "focus:border-blue-500",
    groupHoverText: "group-hover:text-blue-600",
    groupHoverText700: "group-hover:text-blue-700",
    groupHoverBg: "group-hover:bg-blue-50",
    gradient: "from-blue-500 to-blue-600",
    gradientLight: "from-blue-100 to-blue-200",
  },
  emerald: {
    bg600: "bg-emerald-600",
    bg500: "bg-emerald-500",
    bg100: "bg-emerald-100",
    bg50: "bg-emerald-50",
    bg50_80: "bg-emerald-50/80",
    bg50_30: "bg-emerald-50/30",
    text700: "text-emerald-700",
    text600: "text-emerald-600",
    text500: "text-emerald-500",
    text100: "text-emerald-100",
    text400: "text-emerald-400",
    border500: "border-emerald-500",
    border300: "border-emerald-300",
    border200: "border-emerald-200",
    border400: "hover:border-emerald-400",
    ring500: "focus:ring-emerald-500/15",
    shadow500: "shadow-emerald-500/30",
    shadowHover: "hover:shadow-emerald-500/40",
    shadowLight: "shadow-emerald-500/10",
    shadow20: "shadow-emerald-500/20",
    hoverBg50: "hover:bg-emerald-50",
    hoverBg600: "hover:bg-emerald-600",
    hoverText600: "hover:text-emerald-600",
    hoverBorder200: "hover:border-emerald-200",
    hoverBorder300: "hover:border-emerald-300",
    focusBorder: "focus:border-emerald-500",
    groupHoverText: "group-hover:text-emerald-600",
    groupHoverText700: "group-hover:text-emerald-700",
    groupHoverBg: "group-hover:bg-emerald-50",
    gradient: "from-emerald-500 to-emerald-600",
    gradientLight: "from-emerald-100 to-emerald-200",
  },
  red: {
    bg600: "bg-red-600",
    bg500: "bg-red-500",
    bg100: "bg-red-100",
    bg50: "bg-red-50",
    bg50_80: "bg-red-50/80",
    bg50_30: "bg-red-50/30",
    text700: "text-red-700",
    text600: "text-red-600",
    text500: "text-red-500",
    text100: "text-red-100",
    text400: "text-red-400",
    border500: "border-red-500",
    border300: "border-red-300",
    border200: "border-red-200",
    border400: "hover:border-red-400",
    ring500: "focus:ring-red-500/15",
    shadow500: "shadow-red-500/30",
    shadowHover: "hover:shadow-red-500/40",
    shadowLight: "shadow-red-500/10",
    shadow20: "shadow-red-500/20",
    hoverBg50: "hover:bg-red-50",
    hoverBg600: "hover:bg-red-600",
    hoverText600: "hover:text-red-600",
    hoverBorder200: "hover:border-red-200",
    hoverBorder300: "hover:border-red-300",
    focusBorder: "focus:border-red-500",
    groupHoverText: "group-hover:text-red-600",
    groupHoverText700: "group-hover:text-red-700",
    groupHoverBg: "group-hover:bg-red-50",
    gradient: "from-red-500 to-red-600",
    gradientLight: "from-red-100 to-red-200",
  },
  purple: {
    bg600: "bg-purple-600",
    bg500: "bg-purple-500",
    bg100: "bg-purple-100",
    bg50: "bg-purple-50",
    bg50_80: "bg-purple-50/80",
    bg50_30: "bg-purple-50/30",
    text700: "text-purple-700",
    text600: "text-purple-600",
    text500: "text-purple-500",
    text100: "text-purple-100",
    text400: "text-purple-400",
    border500: "border-purple-500",
    border300: "border-purple-300",
    border200: "border-purple-200",
    border400: "hover:border-purple-400",
    ring500: "focus:ring-purple-500/15",
    shadow500: "shadow-purple-500/30",
    shadowHover: "hover:shadow-purple-500/40",
    shadowLight: "shadow-purple-500/10",
    shadow20: "shadow-purple-500/20",
    hoverBg50: "hover:bg-purple-50",
    hoverBg600: "hover:bg-purple-600",
    hoverText600: "hover:text-purple-600",
    hoverBorder200: "hover:border-purple-200",
    hoverBorder300: "hover:border-purple-300",
    focusBorder: "focus:border-purple-500",
    groupHoverText: "group-hover:text-purple-600",
    groupHoverText700: "group-hover:text-purple-700",
    groupHoverBg: "group-hover:bg-purple-50",
    gradient: "from-purple-500 to-purple-600",
    gradientLight: "from-purple-100 to-purple-200",
  },
  orange: {
    bg600: "bg-orange-600",
    bg500: "bg-orange-500",
    bg100: "bg-orange-100",
    bg50: "bg-orange-50",
    bg50_80: "bg-orange-50/80",
    bg50_30: "bg-orange-50/30",
    text700: "text-orange-700",
    text600: "text-orange-600",
    text500: "text-orange-500",
    text100: "text-orange-100",
    text400: "text-orange-400",
    border500: "border-orange-500",
    border300: "border-orange-300",
    border200: "border-orange-200",
    border400: "hover:border-orange-400",
    ring500: "focus:ring-orange-500/15",
    shadow500: "shadow-orange-500/30",
    shadowHover: "hover:shadow-orange-500/40",
    shadowLight: "shadow-orange-500/10",
    shadow20: "shadow-orange-500/20",
    hoverBg50: "hover:bg-orange-50",
    hoverBg600: "hover:bg-orange-600",
    hoverText600: "hover:text-orange-600",
    hoverBorder200: "hover:border-orange-200",
    hoverBorder300: "hover:border-orange-300",
    focusBorder: "focus:border-orange-500",
    groupHoverText: "group-hover:text-orange-600",
    groupHoverText700: "group-hover:text-orange-700",
    groupHoverBg: "group-hover:bg-orange-50",
    gradient: "from-orange-500 to-orange-600",
    gradientLight: "from-orange-100 to-orange-200",
  },
  slate: {
    bg600: "bg-slate-600",
    bg500: "bg-slate-500",
    bg100: "bg-slate-100",
    bg50: "bg-slate-50",
    bg50_80: "bg-slate-50/80",
    bg50_30: "bg-slate-50/30",
    text700: "text-slate-700",
    text600: "text-slate-600",
    text500: "text-slate-500",
    text100: "text-slate-100",
    text400: "text-slate-400",
    border500: "border-slate-500",
    border300: "border-slate-300",
    border200: "border-slate-200",
    border400: "hover:border-slate-400",
    ring500: "focus:ring-slate-500/15",
    shadow500: "shadow-slate-500/30",
    shadowHover: "hover:shadow-slate-500/40",
    shadowLight: "shadow-slate-500/10",
    shadow20: "shadow-slate-500/20",
    hoverBg50: "hover:bg-slate-50",
    hoverBg600: "hover:bg-slate-600",
    hoverText600: "hover:text-slate-600",
    hoverBorder200: "hover:border-slate-200",
    hoverBorder300: "hover:border-slate-300",
    focusBorder: "focus:border-slate-500",
    groupHoverText: "group-hover:text-slate-600",
    groupHoverText700: "group-hover:text-slate-700",
    groupHoverBg: "group-hover:bg-slate-50",
    gradient: "from-slate-500 to-slate-600",
    gradientLight: "from-slate-100 to-slate-200",
  },
};

const getTheme = (colorName) => THEMES[colorName] || THEMES.blue;

const getProInputClass = (color = "blue") => {
  const t = getTheme(color);
  return `w-full p-3.5 bg-white/60 backdrop-blur-sm border border-slate-200/80 rounded-2xl text-sm font-semibold text-slate-800 shadow-sm focus:bg-white focus:ring-4 ${t.ring500} ${t.focusBorder} hover:border-slate-300 transition-all duration-300 outline-none placeholder:text-slate-400`;
};

const PRO_BUTTON_SECONDARY =
  "bg-white/90 backdrop-blur-sm text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-300 font-bold rounded-2xl";

const getButtonPrimaryClass = (color = "blue") => {
  const t = getTheme(color);
  return `${t.bg600} text-white shadow-lg ${t.shadow500} hover:bg-opacity-90 hover:shadow-xl ${t.shadowHover} hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-300 border border-transparent font-bold tracking-wide rounded-2xl`;
};

const getProPanelClass = () =>
  `bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/50 border border-white relative overflow-hidden`;

const getProCardClass = (color = "blue") => {
  const t = getTheme(color);
  return `bg-white rounded-3xl shadow-md border border-slate-100/80 hover:shadow-xl ${t.shadowLight} ${t.hoverBorder200} transition-all duration-300`;
};

const NavButton = React.memo(
  ({ icon: Icon, label, active, onClick, desktop = false, color = "blue" }) => {
    const t = getTheme(color);
    if (desktop) {
      return (
        <button
          onClick={onClick}
          className={`px-5 py-2.5 rounded-2xl flex items-center gap-2 font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
            active
              ? `${t.bg600} text-white shadow-lg ${t.shadow500}`
              : `text-slate-500 hover:bg-slate-100 hover:text-slate-800`
          }`}
        >
          <Icon className="w-4 h-4" /> {label}
        </button>
      );
    }
    return (
      <button
        onClick={onClick}
        className="flex-1 flex flex-col items-center justify-center gap-1 group py-1.5 transition-all duration-300 active:scale-95"
      >
        <div
          className={`p-2.5 rounded-2xl transition-all duration-300 ${
            active
              ? `${t.bg600} text-white shadow-lg ${t.shadowHover} scale-110 -translate-y-1`
              : "text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600"
          }`}
        >
          <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
        </div>
        <span
          className={`text-[9px] font-bold uppercase tracking-tight transition-colors duration-300 ${
            active ? `${t.text700} opacity-100` : "text-slate-400 opacity-80"
          }`}
        >
          {label}
        </span>
      </button>
    );
  }
);

const AdminTab = React.memo(
  ({ active, onClick, icon: Icon, label, color = "blue" }) => {
    const t = getTheme(color);
    return (
      <button
        onClick={onClick}
        className={`flex-1 min-w-[90px] flex items-center justify-center gap-2 py-3 px-3 rounded-2xl font-bold text-[10px] uppercase tracking-wider transition-all duration-300 ${
          active
            ? `${t.bg600} text-white shadow-lg ${t.shadow500}`
            : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-200 hover:border-slate-300 shadow-sm"
        }`}
      >
        <Icon className="w-4 h-4" /> {label}
      </button>
    );
  }
);

const AdminLoginModal = ({
  onSuccess,
  onCancel,
  title = "Admin",
  color = "blue",
}) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const handleLogin = () => {
    if (pin === ADMIN_PASSWORD) onSuccess();
    else {
      setError(true);
      setPin("");
    }
  };
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[150] flex items-center justify-center p-4 anim-fade-in">
      <div
        className={`w-full max-w-xs p-8 space-y-6 anim-zoom-in ${getProPanelClass()}`}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-white shadow-sm">
            <Lock className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Area Riservata
          </p>
        </div>
        <input
          type="password"
          autoFocus
          className={`${getProInputClass(
            color
          )} text-center text-3xl tracking-[0.3em] font-black h-16 ${
            error
              ? "border-red-500 bg-red-50/50 text-red-600 ring-4 ring-red-500/20"
              : ""
          }`}
          placeholder="••••"
          value={pin}
          onChange={(e) => {
            setPin(e.target.value);
            setError(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
        <div className="flex flex-col gap-3">
          <button
            onClick={handleLogin}
            className={`w-full py-4 text-xs uppercase ${getButtonPrimaryClass(
              "slate"
            )}`}
          >
            Accedi
          </button>
          <button
            onClick={onCancel}
            className={`w-full py-4 text-xs uppercase ${PRO_BUTTON_SECONDARY}`}
          >
            Annulla
          </button>
        </div>
      </div>
    </div>
  );
};

const DeleteConfirmDialog = ({
  onConfirm,
  onCancel,
  pin,
  setPin,
  error,
  title,
  isFree,
}) => (
  <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[200] flex items-center justify-center p-4 anim-fade-in">
    <div
      className={`p-8 max-w-xs w-full text-center space-y-6 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-red-500/10 border border-white anim-zoom-in`}
    >
      <div
        className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto shadow-sm border border-white ${
          isFree ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
        }`}
      >
        <Trash2 className="w-8 h-8" />
      </div>
      <div>
        <h4 className="font-black text-slate-800 uppercase text-lg tracking-tight">
          {title}
        </h4>
        <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
          {isFree
            ? "Modifica recente: eliminazione consentita senza PIN."
            : "Azione irreversibile. Inserisci il PIN per confermare."}
        </p>
      </div>
      {!isFree && (
        <input
          type="password"
          placeholder="••••"
          className={`${getProInputClass(
            "red"
          )} text-center text-2xl tracking-[0.2em] font-black`}
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onConfirm()}
          autoFocus
        />
      )}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onConfirm}
          className="py-4 bg-red-600 text-white rounded-2xl font-bold text-xs uppercase shadow-lg shadow-red-600/30 hover:bg-red-500 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-300"
        >
          Elimina
        </button>
        <button
          onClick={onCancel}
          className={`py-4 text-xs uppercase ${PRO_BUTTON_SECONDARY}`}
        >
          Annulla
        </button>
      </div>
    </div>
  </div>
);

const EditLogModal = ({
  log,
  customers,
  technicians,
  machineTypes,
  onClose,
  color = "blue",
  layoutConfig,
}) => {
  const [data, setData] = useState({ ...log });
  const [loading, setLoading] = useState(false);
  const customFields = layoutConfig?.customFields || [];
  const formSettings =
    layoutConfig?.formSettings || DEFAULT_LAYOUT.formSettings;
  const t = getTheme(color);

  const handleSave = async () => {
    setLoading(true);
    try {
      const newMachineId = data.machineId
        .toUpperCase()
        .replace(/\//g, "-")
        .trim();
      await updateDoc(
        doc(
          db,
          "artifacts",
          appId,
          "public",
          "data",
          "maintenance_logs",
          log.id
        ),
        {
          ...data,
          technician: data.technician,
          customer: data.customer.toUpperCase(),
          machineId: newMachineId,
          machineType: data.machineType,
          capacity: data.capacity,
          description: data.description,
          dateString: data.dateString,
          ticketNumber: data.ticketNumber || "",
        }
      );
      onClose();
    } catch (e) {
      alert("Errore durante il salvataggio.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[200] flex items-center justify-center p-4 anim-fade-in">
      <div
        className={`w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] anim-zoom-in ${getProPanelClass()}`}
      >
        <div className="px-6 py-5 border-b border-slate-100/50 flex justify-between items-center bg-white/50 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 ${t.bg100} ${t.text600} rounded-xl`}>
              <Edit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-800 uppercase tracking-tight text-md">
                Modifica
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                ID: {log.id.substring(0, 8)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-5 overflow-y-auto bg-slate-50/30 custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">
                Tecnico
              </label>
              <select
                className={getProInputClass(color)}
                value={data.technician}
                onChange={(e) =>
                  setData({ ...data, technician: e.target.value })
                }
              >
                {technicians.map((tc) => (
                  <option key={tc.id} value={tc.name}>
                    {tc.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">
                Data
              </label>
              <input
                type="text"
                className={getProInputClass(color)}
                value={data.dateString}
                onChange={(e) =>
                  setData({ ...data, dateString: e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">
              N. Assistenza (Opz)
            </label>
            <input
              type="text"
              className={getProInputClass(color)}
              value={data.ticketNumber || ""}
              onChange={(e) =>
                setData({ ...data, ticketNumber: e.target.value })
              }
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">
              Cliente
            </label>
            <select
              className={getProInputClass(color)}
              value={data.customer}
              onChange={(e) =>
                setData({ ...data, customer: e.target.value.toUpperCase() })
              }
            >
              {customers.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {formSettings.showMachineId && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                  Matricola
                </label>
                <input
                  type="text"
                  className={getProInputClass(color)}
                  value={data.machineId}
                  onChange={(e) =>
                    setData({
                      ...data,
                      machineId: e.target.value.toUpperCase(),
                    })
                  }
                />
              </div>
            )}
            {formSettings.showMachineType && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                  Tipo
                </label>
                <select
                  className={getProInputClass(color)}
                  value={data.machineType || ""}
                  onChange={(e) =>
                    setData({ ...data, machineType: e.target.value })
                  }
                >
                  <option value="">Sel...</option>
                  {machineTypes.map((mt) => (
                    <option key={mt.id} value={mt.name}>
                      {mt.name}
                    </option>
                  ))}
                  {data.machineType &&
                    !machineTypes.some(
                      (mt) => mt.name === data.machineType
                    ) && (
                      <option value={data.machineType}>
                        {data.machineType}
                      </option>
                    )}
                </select>
              </div>
            )}
            {formSettings.showCapacity && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                  Portata
                </label>
                <input
                  type="text"
                  className={getProInputClass(color)}
                  value={data.capacity}
                  onChange={(e) =>
                    setData({ ...data, capacity: e.target.value })
                  }
                />
              </div>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">
              Descrizione
            </label>
            <textarea
              rows="4"
              className={getProInputClass(color)}
              value={data.description}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
            />
          </div>
        </div>
        <div className="p-6 border-t border-slate-100/50 bg-white/80 backdrop-blur-xl">
          <button
            onClick={handleSave}
            disabled={loading}
            className={`w-full py-4 text-xs uppercase ${getButtonPrimaryClass(
              color
            )}`}
          >
            {loading ? "Salvataggio..." : "Salva Modifiche"}
          </button>
        </div>
      </div>
    </div>
  );
};

const EditMachineModal = ({
  machine,
  customers,
  machineTypes,
  onClose,
  themeColor,
  allMachines,
}) => {
  const [data, setData] = useState({ ...machine });
  const [loading, setLoading] = useState(false);
  const color = themeColor || "blue";
  const t = getTheme(color);

  const handleSave = async () => {
    const newId = data.id.toUpperCase().replace(/\//g, "-").trim();
    const oldId = machine.id;
    if (newId !== oldId && allMachines.some((m) => m.id === newId))
      return alert("Esiste già una macchina con questa matricola!");
    setLoading(true);
    try {
      const promises = [];
      const logsSnap = await getDocs(
        query(
          collection(
            db,
            "artifacts",
            appId,
            "public",
            "data",
            "maintenance_logs"
          ),
          where("machineId", "==", oldId)
        )
      );
      logsSnap.forEach((d) => {
        promises.push(
          updateDoc(d.ref, {
            machineId: newId,
            customer: data.customerName.toUpperCase(),
            machineType: data.type,
            capacity: data.capacity,
          })
        );
      });
      const docRef = doc(
        db,
        "artifacts",
        appId,
        "public",
        "data",
        "machines",
        oldId.toLowerCase()
      );
      if (newId !== oldId) {
        promises.push(deleteDoc(docRef));
        promises.push(
          setDoc(
            doc(
              db,
              "artifacts",
              appId,
              "public",
              "data",
              "machines",
              newId.toLowerCase()
            ),
            {
              id: newId,
              customerName: data.customerName.toUpperCase(),
              type: data.type,
              capacity: data.capacity,
            }
          )
        );
      } else
        promises.push(
          setDoc(
            docRef,
            {
              id: newId,
              customerName: data.customerName.toUpperCase(),
              type: data.type,
              capacity: data.capacity,
            },
            { merge: true }
          )
        );
      await Promise.all(promises);
      onClose();
    } catch (e) {
      alert("Errore");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[200] flex items-center justify-center p-4 anim-fade-in">
      <div
        className={`w-full max-w-sm overflow-hidden p-8 space-y-6 anim-zoom-in ${getProPanelClass()}`}
      >
        <div className="text-center">
          <div
            className={`w-14 h-14 mx-auto ${t.bg50} ${t.text600} rounded-3xl flex items-center justify-center mb-3 shadow-inner`}
          >
            <Factory className="w-6 h-6" />
          </div>
          <h3 className="font-black text-slate-800 uppercase text-lg tracking-tight">
            Modifica Gru
          </h3>
        </div>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
              Matricola
            </label>
            <input
              type="text"
              className={getProInputClass(color)}
              value={data.id}
              onChange={(e) =>
                setData({ ...data, id: e.target.value.toUpperCase() })
              }
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
              Cliente
            </label>
            <select
              className={getProInputClass(color)}
              value={data.customerName}
              onChange={(e) =>
                setData({ ...data, customerName: e.target.value.toUpperCase() })
              }
            >
              {customers.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
              Tipo
            </label>
            <select
              className={getProInputClass(color)}
              value={data.type || ""}
              onChange={(e) => setData({ ...data, type: e.target.value })}
            >
              <option value="">Seleziona...</option>
              {machineTypes.map((mt) => (
                <option key={mt.id} value={mt.name}>
                  {mt.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
              Portata
            </label>
            <input
              type="text"
              className={getProInputClass(color)}
              value={data.capacity || ""}
              onChange={(e) => setData({ ...data, capacity: e.target.value })}
            />
          </div>
        </div>
        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={loading}
            className={`w-full py-4 text-xs uppercase ${getButtonPrimaryClass(
              color
            )}`}
          >
            Salva
          </button>
          <button
            onClick={onClose}
            className={`w-full py-4 text-xs uppercase ${PRO_BUTTON_SECONDARY}`}
          >
            Annulla
          </button>
        </div>
      </div>
    </div>
  );
};

const EditCustomerModal = ({
  customer,
  allCustomers,
  onClose,
  color = "blue",
}) => {
  const [name, setName] = useState(customer.name || "");
  const [loading, setLoading] = useState(false);
  const t = getTheme(color);

  const handleSave = async () => {
    const cleanName = name.toUpperCase().trim();
    if (
      !cleanName ||
      (cleanName !== customer.name &&
        allCustomers.some((c) => c.name === cleanName))
    )
      return;
    setLoading(true);
    try {
      const promises = [
        updateDoc(
          doc(
            db,
            "artifacts",
            appId,
            "public",
            "data",
            "customers",
            customer.id
          ),
          { name: cleanName }
        ),
      ];
      const logsSnap = await getDocs(
        query(
          collection(
            db,
            "artifacts",
            appId,
            "public",
            "data",
            "maintenance_logs"
          ),
          where("customer", "==", customer.name)
        )
      );
      logsSnap.forEach((d) =>
        promises.push(updateDoc(d.ref, { customer: cleanName }))
      );
      const machinesSnap = await getDocs(
        query(
          collection(db, "artifacts", appId, "public", "data", "machines"),
          where("customerName", "==", customer.name)
        )
      );
      machinesSnap.forEach((d) =>
        promises.push(updateDoc(d.ref, { customerName: cleanName }))
      );
      await Promise.all(promises);
      onClose();
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[200] flex items-center justify-center p-4 anim-fade-in">
      <div
        className={`w-full max-w-sm overflow-hidden p-8 space-y-6 anim-zoom-in ${getProPanelClass()}`}
      >
        <div className="text-center">
          <div
            className={`w-14 h-14 mx-auto ${t.bg50} ${t.text600} rounded-3xl flex items-center justify-center mb-3 shadow-inner`}
          >
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-black text-slate-800 uppercase text-lg tracking-tight">
            Modifica Cliente
          </h3>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
            Ragione Sociale
          </label>
          <input
            type="text"
            className={getProInputClass(color)}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-3 pt-4">
          <button
            onClick={handleSave}
            disabled={loading}
            className={`w-full py-4 text-xs uppercase ${getButtonPrimaryClass(
              color
            )}`}
          >
            Salva
          </button>
          <button
            onClick={onClose}
            className={`w-full py-4 text-xs uppercase ${PRO_BUTTON_SECONDARY}`}
          >
            Annulla
          </button>
        </div>
      </div>
    </div>
  );
};

const MergeModal = ({
  sourceItem,
  allItems,
  onConfirm,
  onClose,
  type,
  color = "blue",
}) => {
  const [targetId, setTargetId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (
      !targetId ||
      !window.confirm(
        `Unire "${sourceItem.name || sourceItem.id}" irreversibilmente?`
      )
    )
      return;
    setLoading(true);
    await onConfirm(
      sourceItem,
      allItems.find((i) => i.id === targetId)
    );
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[220] flex items-center justify-center p-4 anim-fade-in">
      <div
        className={`w-full max-w-sm overflow-hidden p-8 space-y-6 anim-zoom-in ${getProPanelClass()}`}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-inner border border-white">
            <Merge className="w-8 h-8" />
          </div>
          <h3 className="font-black text-slate-800 uppercase text-lg tracking-tight">
            Unisci {type === "customer" ? "Cliente" : "Gru"}
          </h3>
        </div>
        <div className="space-y-1.5 pt-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
            Destinazione
          </label>
          <select
            className={getProInputClass("purple")}
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
          >
            <option value="">Seleziona...</option>
            {allItems
              .filter((i) => i.id !== sourceItem.id)
              .map((i) => (
                <option key={i.id} value={i.id}>
                  {type === "customer" ? i.name : `${i.id} (${i.customerName})`}
                </option>
              ))}
          </select>
        </div>
        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={handleConfirm}
            disabled={loading || !targetId}
            className={`w-full py-4 text-xs uppercase ${getButtonPrimaryClass(
              "purple"
            )}`}
          >
            {loading ? "Unione..." : "Conferma"}
          </button>
          <button
            onClick={onClose}
            className={`w-full py-4 text-xs uppercase ${PRO_BUTTON_SECONDARY}`}
          >
            Annulla
          </button>
        </div>
      </div>
    </div>
  );
};

const CustomerDetailModal = ({
  customerName,
  machines,
  onClose,
  onOpenMachine,
  color = "blue",
}) => {
  const customerMachines = useMemo(
    () =>
      machines.filter(
        (m) => m.customerName.toUpperCase() === customerName.toUpperCase()
      ),
    [machines, customerName]
  );
  const t = getTheme(color);
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[210] flex items-center justify-center p-4 anim-fade-in">
      <div
        className={`w-full max-w-4xl h-[85vh] rounded-[2rem] overflow-hidden flex flex-col shadow-2xl anim-zoom-in ${getProPanelClass()}`}
      >
        <div
          className={`bg-white/80 backdrop-blur-xl p-6 md:p-8 flex flex-col gap-6 border-b border-slate-100/50`}
        >
          <div className="flex justify-between items-start">
            <button
              onClick={onClose}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-[10px] uppercase tracking-wider ${PRO_BUTTON_SECONDARY}`}
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />{" "}
              Indietro
            </button>
            <button
              onClick={onClose}
              className="p-2.5 bg-slate-100/80 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-5">
            <div
              className={`p-4 ${t.bg50} ${t.text600} rounded-3xl shadow-inner border border-white`}
            >
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight leading-tight text-slate-800 drop-shadow-sm">
                {customerName}
              </h2>
              <p className="text-slate-500 text-xs font-bold mt-1.5 uppercase tracking-wider">
                Parco Macchine: {customerMachines.length}
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-slate-50/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {customerMachines.map((m) => (
              <div
                key={m.id}
                onClick={() => onOpenMachine(m.id)}
                className={`p-6 cursor-pointer group ${getProCardClass(color)}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span
                    className={`text-sm font-black ${t.text600} ${t.bg50} px-2.5 py-1 rounded-xl uppercase tracking-wider`}
                  >
                    {m.id}
                  </span>
                  <div
                    className={`p-2 bg-slate-50 rounded-full text-slate-400 ${t.groupHoverBg} ${t.groupHoverText} transition-colors`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
                <div className="space-y-1 mt-4">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    {m.type}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    {m.capacity || "N.D."}
                  </p>
                </div>
              </div>
            ))}
            {customerMachines.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-40">
                <Factory className="w-16 h-16 text-slate-400 mb-4" />
                <p className="font-black uppercase text-sm tracking-widest text-slate-500">
                  Nessuna macchina registrata
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MachineHistoryModal = ({
  machineId,
  machines,
  allLogs,
  onClose,
  onOpenCustomer,
  themeColor,
}) => {
  const liveMachine = useMemo(
    () =>
      machines.find((m) => m.id.toLowerCase() === machineId.toLowerCase()) || {
        id: machineId,
        customerName: "N.D.",
        type: "N.D.",
        capacity: "N.D.",
      },
    [machines, machineId]
  );
  const machineLogs = useMemo(
    () =>
      allLogs.filter(
        (l) => l.machineId.toLowerCase() === machineId.toLowerCase()
      ),
    [allLogs, machineId]
  );
  const color = themeColor || "blue";
  const t = getTheme(color);

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[200] flex items-center justify-center p-4 anim-fade-in">
      <div
        className={`w-full max-w-4xl h-[90vh] rounded-[2rem] overflow-hidden flex flex-col shadow-2xl anim-zoom-in ${getProPanelClass()}`}
      >
        <div
          className={`bg-white/80 backdrop-blur-xl p-6 md:p-8 flex flex-col gap-6 border-b border-slate-100/50`}
        >
          <div className="flex justify-between items-start">
            <button
              onClick={onClose}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-[10px] uppercase tracking-wider ${PRO_BUTTON_SECONDARY}`}
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />{" "}
              Indietro
            </button>
            <button
              onClick={onClose}
              className="p-2.5 bg-slate-100/80 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-5">
            <div
              className={`p-4 ${t.bg50} ${t.text600} rounded-3xl shadow-inner border border-white`}
            >
              <Factory className="w-8 h-8" />
            </div>
            <div>
              <button
                onClick={() => onOpenCustomer(liveMachine.customerName)}
                className="text-left group/title"
              >
                <h2
                  className={`text-2xl md:text-3xl font-black uppercase tracking-tight leading-tight text-slate-800 ${t.groupHoverText} transition-colors drop-shadow-sm`}
                >
                  {liveMachine.customerName}
                </h2>
              </button>
              <div className="flex flex-wrap gap-2 text-[10px] font-bold text-slate-500 mt-2.5">
                <span
                  className={`${t.bg50} ${t.text700} px-2.5 py-1 rounded-lg`}
                >
                  MAT: {liveMachine.id}
                </span>
                <span className="bg-slate-100 px-2.5 py-1 rounded-lg">
                  {liveMachine.type}
                </span>
                {liveMachine.capacity && (
                  <span className="bg-slate-100 px-2.5 py-1 rounded-lg">
                    {liveMachine.capacity} kg
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-slate-50/50">
          <div className="space-y-6">
            {machineLogs.map((log, idx) => (
              <div key={log.id} className="flex gap-5 group">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-4 h-4 ${t.bg500} rounded-full ring-4 ring-white mt-2 shrink-0 shadow-sm`}
                  ></div>
                  {idx !== machineLogs.length - 1 && (
                    <div className="w-1 bg-gradient-to-b from-slate-200 to-slate-100 flex-1 my-2 rounded-full"></div>
                  )}
                </div>
                <div className={`p-6 flex-1 ${getProCardClass(color)}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className={`flex items-center gap-2.5 ${t.bg50_80} px-3 py-1.5 rounded-xl ${t.text700}`}
                    >
                      <CalendarIcon className="w-3.5 h-3.5" />
                      <span className="font-bold text-[10px] uppercase tracking-widest">
                        {log.dateString}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-100/80 px-3 py-1.5 rounded-xl text-slate-600">
                      <User className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        {log.technician}
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed font-medium italic whitespace-pre-wrap break-words">
                    "{log.description}"
                  </p>
                </div>
              </div>
            ))}
            {machineLogs.length === 0 && (
              <div className="text-center flex flex-col items-center justify-center py-20 opacity-40">
                <ClipboardList className="w-16 h-16 mb-4 text-slate-400" />
                <p className="font-black uppercase text-sm tracking-widest text-slate-500">
                  Nessun intervento registrato
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ExploreView = React.memo(
  ({ customers, machines, logs, color = "blue" }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedCustomer, setExpandedCustomer] = useState(null);
    const [expandedMachine, setExpandedMachine] = useState(null);
    const t = getTheme(color);

    const filteredCustomers = useMemo(
      () =>
        searchTerm
          ? customers.filter((c) =>
              c.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
          : customers,
      [customers, searchTerm]
    );
    const getCustomerMachines = useCallback(
      (customerName) => machines.filter((m) => m.customerName === customerName),
      [machines]
    );
    const getMachineLogs = useCallback(
      (machineId) => logs.filter((l) => l.machineId === machineId),
      [logs]
    );

    const toggleCustomer = (cName) => {
      setExpandedCustomer((p) => (p === cName ? null : cName));
      setExpandedMachine(null);
    };
    const toggleMachine = (e, mId) => {
      e.stopPropagation();
      setExpandedMachine((p) => (p === mId ? null : mId));
    };

    return (
      <div className="h-[80vh] flex flex-col anim-slide-up">
        <div className={`p-4 md:p-6 mb-6 ${getProPanelClass()}`}>
          <div className="relative">
            <input
              type="text"
              placeholder="Cerca Cliente..."
              className={`${getProInputClass(color)} pl-12 text-lg py-4`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pb-24 px-1">
          {filteredCustomers.map((c) => {
            const isCustExpanded = expandedCustomer === c.name;
            const myMachines = isCustExpanded
              ? getCustomerMachines(c.name)
              : [];
            return (
              <div
                key={c.id}
                className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-sm border transition-all duration-300 overflow-hidden ${
                  isCustExpanded
                    ? `${t.border300} shadow-md ${t.shadowLight}`
                    : "border-slate-200/60 hover:border-slate-300"
                }`}
              >
                <div
                  onClick={() => toggleCustomer(c.name)}
                  className={`p-5 flex justify-between items-center cursor-pointer transition-colors ${
                    isCustExpanded ? t.bg50_30 : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2.5 rounded-xl ${
                        isCustExpanded
                          ? `${t.bg100} ${t.text600}`
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="font-black text-sm md:text-base text-slate-800 tracking-tight">
                      {c.name}
                    </span>
                  </div>
                  <div
                    className={`p-2 rounded-full transition-all duration-300 ${
                      isCustExpanded
                        ? `${t.bg100} ${t.text600} rotate-90`
                        : "bg-slate-50 text-slate-300"
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
                {isCustExpanded && (
                  <div className="bg-slate-50/50 border-t border-slate-100">
                    {myMachines.length === 0 && (
                      <div className="p-6 text-xs text-slate-400 font-medium italic text-center">
                        Nessuna gru registrata.
                      </div>
                    )}
                    {myMachines.map((m) => {
                      const isMachExpanded = expandedMachine === m.id;
                      const myLogs = isMachExpanded ? getMachineLogs(m.id) : [];
                      return (
                        <div
                          key={m.id}
                          className="border-b border-slate-200/50 last:border-0"
                        >
                          <div
                            onClick={(e) => toggleMachine(e, m.id)}
                            className={`p-4 pl-10 flex justify-between items-center cursor-pointer transition-colors ${
                              isMachExpanded ? "bg-white" : "hover:bg-white/60"
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={`p-2 rounded-lg ${
                                  isMachExpanded
                                    ? "bg-orange-100 text-orange-600"
                                    : "bg-slate-100 text-slate-400"
                                }`}
                              >
                                <Factory className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="text-sm font-black text-slate-800 tracking-tight block">
                                  {m.id}
                                </span>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                    {m.type}
                                  </span>
                                  {m.capacity && (
                                    <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                      {m.capacity} kg
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <ChevronRight
                              className={`w-4 h-4 text-slate-300 transition-transform duration-300 ${
                                isMachExpanded ? "rotate-90" : ""
                              }`}
                            />
                          </div>
                          {isMachExpanded && (
                            <div className="bg-slate-100/50 p-4 pl-14 space-y-3 shadow-inner">
                              {myLogs.length === 0 && (
                                <div className="text-[10px] text-slate-400 font-medium italic">
                                  Nessun intervento.
                                </div>
                              )}
                              {myLogs.map((l) => (
                                <div
                                  key={l.id}
                                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative anim-fade-in hover:shadow-md transition-shadow"
                                >
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-bold bg-slate-100 px-2.5 py-1 rounded-lg text-slate-600 tracking-wider flex items-center gap-1.5">
                                      <CalendarIcon className="w-3 h-3" />
                                      {l.dateString}
                                    </span>
                                    <span
                                      className={`text-[10px] font-bold ${t.text600} flex items-center gap-1`}
                                    >
                                      <User className="w-3 h-3" />
                                      {l.technician}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap break-words font-medium italic">
                                    "{l.description}"
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

const DatabaseView = ({
  customers,
  machines,
  logs,
  themeColor,
  onOpenCustomer,
  onOpenMachine,
}) => {
  const [tab, setTab] = useState("customers");
  const [searchTerm, setSearchTerm] = useState("");
  const color = themeColor || "blue";
  const t = getTheme(color);

  const filteredData = useMemo(() => {
    const s = searchTerm.toLowerCase();
    if (tab === "customers")
      return customers.filter(
        (c) => c.name && c.name.toLowerCase().includes(s)
      );
    if (tab === "machines")
      return machines.filter(
        (m) =>
          (m.id && m.id.toLowerCase().includes(s)) ||
          (m.customerName && m.customerName.toLowerCase().includes(s))
      );
    if (tab === "logs")
      return logs.filter(
        (l) =>
          (l.description && l.description.toLowerCase().includes(s)) ||
          (l.machineId && l.machineId.toLowerCase().includes(s)) ||
          (l.customer && l.customer.toLowerCase().includes(s))
      );
    return [];
  }, [tab, searchTerm, customers, machines, logs]);

  return (
    <div
      className={`h-[80vh] flex flex-col anim-slide-up ${getProPanelClass()}`}
    >
      <div className="p-5 border-b border-slate-100 bg-white/50 backdrop-blur-md">
        <div className="flex p-1.5 bg-slate-100/80 rounded-2xl mb-4 shadow-inner gap-1">
          <button
            onClick={() => setTab("customers")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
              tab === "customers"
                ? `${t.bg600} text-white shadow-md`
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            }`}
          >
            Clienti
          </button>
          <button
            onClick={() => setTab("machines")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
              tab === "machines"
                ? `${t.bg600} text-white shadow-md`
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            }`}
          >
            Gru
          </button>
          <button
            onClick={() => setTab("logs")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
              tab === "logs"
                ? `${t.bg600} text-white shadow-md`
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            }`}
          >
            Interventi
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Cerca nel database..."
            className={`${getProInputClass(color)} pl-12`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 custom-scrollbar space-y-3">
        {filteredData.length === 0 && (
          <div className="text-center py-20 opacity-40 font-black text-slate-500 uppercase text-sm tracking-widest flex flex-col items-center">
            <Database className="w-12 h-12 mb-4" />
            Nessun dato trovato
          </div>
        )}
        {tab === "customers" &&
          filteredData.map((c) => (
            <div
              key={c.id}
              onClick={() => onOpenCustomer(c.name)}
              className={`p-4 bg-white rounded-2xl border border-slate-100 flex justify-between items-center cursor-pointer transition-all duration-300 hover:shadow-lg ${t.shadowLight} ${t.hoverBorder200} group`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 ${t.bg50} rounded-xl ${t.text600} group-hover:scale-110 transition-transform`}
                >
                  <Users className="w-5 h-5" />
                </div>
                <span className="font-black text-sm text-slate-800 tracking-tight">
                  {c.name}
                </span>
              </div>
              <div
                className={`p-2 rounded-full bg-slate-50 text-slate-400 ${t.groupHoverBg} ${t.groupHoverText} transition-colors`}
              >
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        {tab === "machines" &&
          filteredData.map((m) => (
            <div
              key={m.id}
              onClick={() => onOpenMachine(m.id)}
              className={`p-4 bg-white rounded-2xl border border-slate-100 flex justify-between items-center cursor-pointer transition-all duration-300 hover:shadow-lg ${t.shadowLight} ${t.hoverBorder200} group`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 bg-slate-50 rounded-xl text-slate-400 ${t.groupHoverText} transition-colors`}
                >
                  <Factory className="w-5 h-5" />
                </div>
                <div>
                  <span
                    className={`font-black text-sm ${t.text600} block tracking-tight`}
                  >
                    {m.id}
                  </span>
                  <p className="text-[10px] font-bold text-slate-500 mt-0.5 uppercase tracking-wider">
                    {m.customerName}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg uppercase">
                  {m.type}
                </span>
              </div>
            </div>
          ))}
        {tab === "logs" &&
          filteredData.map((l) => (
            <div
              key={l.id}
              className="p-5 bg-white rounded-2xl border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3" />
                  {l.dateString}
                </span>
                <span
                  className={`text-[10px] font-bold ${t.text600} flex items-center gap-1`}
                >
                  <User className="w-3 h-3" />
                  {l.technician}
                </span>
              </div>
              <div className="font-black text-sm text-slate-800 mb-2 tracking-tight">
                {l.customer} <span className="text-slate-300 mx-2">|</span>{" "}
                <span className={t.text600}>{l.machineId}</span>
              </div>
              <p className="text-[11px] text-slate-600 italic font-medium whitespace-pre-wrap break-words leading-relaxed">
                "{l.description}"
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

const SimpleCalendar = ({
  logs,
  onDayClick,
  month,
  year,
  onMonthChange,
  themeColor = "blue",
}) => {
  const t = getTheme(themeColor);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const startDay = firstDay === 0 ? 6 : firstDay - 1;
  const monthNames = [
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novembre",
    "Dicembre",
  ];
  const getInterventionsForDay = (day) =>
    logs.filter(
      (l) =>
        l.dateString &&
        parseInt(l.dateString.split("/")[0]) === day &&
        parseInt(l.dateString.split("/")[1]) === month + 1 &&
        parseInt(l.dateString.split("/")[2]) === year
    );

  return (
    <div className={`p-6 ${getProPanelClass()}`}>
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() =>
            onMonthChange(
              month === 0 ? 11 : month - 1,
              month === 0 ? year - 1 : year
            )
          }
          className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-slate-600"
        >
          <ChevronDown className="w-5 h-5 rotate-90" />
        </button>
        <h3 className="font-black text-lg text-slate-800 uppercase tracking-tight">
          {monthNames[month]} <span className={t.text600}>{year}</span>
        </h3>
        <button
          onClick={() =>
            onMonthChange(
              month === 11 ? 0 : month + 1,
              month === 11 ? year + 1 : year
            )
          }
          className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-slate-600"
        >
          <ChevronDown className="w-5 h-5 -rotate-90" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 md:gap-2 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
        <div>Lu</div>
        <div>Ma</div>
        <div>Me</div>
        <div>Gi</div>
        <div>Ve</div>
        <div>Sa</div>
        <div>Do</div>
      </div>
      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {Array.from({ length: startDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dailyLogs = getInterventionsForDay(day);
          const count = dailyLogs.length;
          return (
            <div
              key={day}
              onClick={() =>
                count > 0 &&
                onDayClick(dailyLogs, `${day} ${monthNames[month]} ${year}`)
              }
              className={`h-10 md:h-12 flex flex-col items-center justify-center rounded-xl border-2 transition-all duration-300 ${
                count > 0
                  ? `${t.bg50} ${t.border200} hover:bg-opacity-80 hover:border-opacity-80 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5`
                  : "border-transparent text-slate-400 hover:bg-slate-50"
              }`}
            >
              <span
                className={`text-xs md:text-sm font-black ${
                  count > 0 ? t.text700 : ""
                }`}
              >
                {day}
              </span>
              {count > 0 && (
                <div
                  className={`w-1.5 h-1.5 ${t.bg500} rounded-full mt-0.5`}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const OfficeView = ({
  logs,
  machines,
  customers,
  layoutConfig,
  technicians,
}) => {
  const today = new Date();
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedMachine, setSelectedMachine] = useState("");
  const [selectedTech, setSelectedTech] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [popoverData, setPopoverData] = useState(null);

  const color = layoutConfig?.themeColor || "blue";
  const t = getTheme(color);
  const monthNames = [
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novembre",
    "Dicembre",
  ];
  const dynamicMonthLabel = `(${monthNames[calMonth]} ${calYear})`;

  const calendarFilteredLogs = useMemo(
    () =>
      logs.filter(
        (log) =>
          log.dateString &&
          parseInt(log.dateString.split("/")[1]) - 1 === calMonth &&
          parseInt(log.dateString.split("/")[2]) === calYear
      ),
    [logs, calMonth, calYear]
  );
  const advancedStats = useMemo(() => {
    const techCounts = {};
    const machineTypeCounts = {};
    const customerCounts = {};
    calendarFilteredLogs.forEach((l) => {
      if (l.technician)
        techCounts[l.technician] = (techCounts[l.technician] || 0) + 1;
      if (l.machineType)
        machineTypeCounts[l.machineType] =
          (machineTypeCounts[l.machineType] || 0) + 1;
      if (l.customer)
        customerCounts[l.customer] = (customerCounts[l.customer] || 0) + 1;
    });
    return {
      topTechs: Object.entries(techCounts).sort(([, a], [, b]) => b - a),
      topMachineTypes: Object.entries(machineTypeCounts).sort(
        ([, a], [, b]) => b - a
      ),
      topCustomers: Object.entries(customerCounts).sort(
        ([, a], [, b]) => b - a
      ),
    };
  }, [calendarFilteredLogs]);

  const stats = useMemo(() => {
    let yearCount = 0;
    logs.forEach((l) => {
      if (l.dateString && parseInt(l.dateString.split("/")[2]) === calYear)
        yearCount++;
    });
    return {
      total: logs.length,
      year: yearCount,
      month: calendarFilteredLogs.length,
    };
  }, [logs, calYear, calendarFilteredLogs]);

  const filteredLogs = useMemo(
    () =>
      logs.filter((log) => {
        let matches = true;
        if (startDate || endDate) {
          const [d, m, y] = log.dateString.split("/").map(Number);
          const logDate = new Date(y, m - 1, d);
          if (startDate && logDate < new Date(startDate)) matches = false;
          if (endDate && logDate > new Date(endDate)) matches = false;
        }
        if (
          matches &&
          selectedCustomer &&
          !log.customer.includes(selectedCustomer.toUpperCase())
        )
          matches = false;
        if (
          matches &&
          selectedMachine &&
          !log.machineId.includes(selectedMachine.toUpperCase())
        )
          matches = false;
        if (matches && selectedTech && log.technician !== selectedTech)
          matches = false;
        return matches;
      }),
    [logs, startDate, endDate, selectedCustomer, selectedMachine, selectedTech]
  );

  const generatePDF = () => {
    if (filteredLogs.length === 0) return alert("Nessun intervento trovato.");
    const printWindow = window.open("", "_blank");
    if (!printWindow)
      return alert("Impossibile aprire il report. Controlla il blocco popup.");
    const html = `<html><head><title>Report</title><style>body{font-family:sans-serif;padding:20px} table{width:100%;border-collapse:collapse} th,td{border:1px solid #ccc;padding:8px} th{background:#eee}</style></head><body><h2>Report Interventi</h2><button onclick="window.print()">Stampa / Salva</button><table><thead><tr><th>Data/Tecnico</th><th>Cliente/Macchina</th><th>Descrizione</th></tr></thead><tbody>${filteredLogs
      .map(
        (l) =>
          `<tr><td>${l.dateString}<br/>${l.technician}</td><td>${l.customer}<br/>${l.machineId} (${l.machineType})</td><td>${l.description}</td></tr>`
      )
      .join("")}</tbody></table></body></html>`;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handleDownloadExcel = () => {
    if (filteredLogs.length === 0) return alert("Nessun dato.");
    const rows = filteredLogs.map((l) => [
      l.dateString,
      l.ticketNumber || "",
      l.technician,
      l.customer,
      l.machineId,
      `"${l.description.replace(/"/g, '""')}"`,
    ]);
    const csv =
      "data:text/csv;charset=utf-8," +
      [
        "Data,Ticket,Tecnico,Cliente,Matricola,Descrizione",
        ...rows.map((e) => e.join(",")),
      ].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", "report.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6 md:space-y-8 anim-slide-up">
      <div className={`p-6 md:p-8 ${getProPanelClass()}`}>
        <div className="flex items-center gap-4 mb-8">
          <div
            className={`p-3 ${t.bg50} ${t.text600} rounded-2xl shadow-inner border border-white`}
          >
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
              Panoramica
            </h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Statistiche Globali
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 md:gap-6">
          <div className="text-center p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">
              Globale
            </span>
            <div className="text-2xl md:text-4xl font-black text-slate-800">
              {stats.total}
            </div>
          </div>
          <div className="text-center p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">
              Anno Sel.
            </span>
            <div className={`text-2xl md:text-4xl font-black ${t.text600}`}>
              {stats.year}
            </div>
          </div>
          <div className="text-center p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">
              Mese Sel.
            </span>
            <div className="text-2xl md:text-4xl font-black text-emerald-500">
              {stats.month}
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`p-6 ${getProPanelClass()} flex flex-col`}>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100/50">
            <div className="p-2 bg-yellow-50 text-yellow-500 rounded-xl">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase text-slate-800 tracking-tight">
                Tecnici
              </h4>
              <p className="text-[9px] font-bold text-slate-400 uppercase">
                {dynamicMonthLabel}
              </p>
            </div>
          </div>
          <div className="flex-1 space-y-2 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
            {advancedStats.topTechs.map(([tech, count], i) => (
              <div
                key={tech}
                onClick={() =>
                  setPopoverData({
                    date: `Interventi: ${tech}`,
                    logs: calendarFilteredLogs.filter(
                      (l) => l.technician === tech
                    ),
                  })
                }
                className={`flex justify-between items-center cursor-pointer p-3 rounded-2xl transition-all duration-300 border border-transparent ${t.hoverBorder200} hover:shadow-md hover:-translate-y-0.5 bg-white ${t.hoverBg50_30} group`}
              >
                <div className="flex gap-3 items-center">
                  <span
                    className={`font-black w-6 h-6 flex items-center justify-center rounded-full text-[10px] shadow-inner shrink-0 ${
                      i === 0
                        ? "bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span
                    className={`font-bold text-sm text-slate-700 ${t.groupHoverText} transition-colors`}
                  >
                    {tech}
                  </span>
                </div>
                <span
                  className={`font-black ${t.text700} ${t.bg50} px-3 py-1 rounded-lg shadow-sm`}
                >
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className={`p-6 ${getProPanelClass()} flex flex-col`}>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100/50">
            <div className="p-2 bg-purple-50 text-purple-500 rounded-xl">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase text-slate-800 tracking-tight">
                Tipi Macchina
              </h4>
              <p className="text-[9px] font-bold text-slate-400 uppercase">
                {dynamicMonthLabel}
              </p>
            </div>
          </div>
          <div className="flex-1 space-y-5">
            {advancedStats.topMachineTypes.slice(0, 5).map(([type, count]) => {
              const pct = Math.round((count / stats.month) * 100) || 0;
              return (
                <div key={type} className="group">
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-2 group-hover:text-purple-600 transition-colors">
                    <span className="uppercase tracking-wide">{type}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full shadow-inner overflow-hidden border border-white">
                    <div
                      className="h-full bg-gradient-to-r from-purple-400 to-purple-500 rounded-full transition-all duration-1000"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className={`p-6 ${getProPanelClass()} flex flex-col`}>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100/50">
            <div className="p-2 bg-orange-50 text-orange-500 rounded-xl">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase text-slate-800 tracking-tight">
                Clienti Top
              </h4>
              <p className="text-[9px] font-bold text-slate-400 uppercase">
                {dynamicMonthLabel}
              </p>
            </div>
          </div>
          <div className="flex-1 space-y-2 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
            {advancedStats.topCustomers.map(([cust, count], i) => (
              <div
                key={cust}
                onClick={() =>
                  setPopoverData({
                    date: `Interventi: ${cust}`,
                    logs: calendarFilteredLogs.filter(
                      (l) => l.customer === cust
                    ),
                  })
                }
                className={`flex justify-between items-center cursor-pointer p-3 rounded-2xl transition-all duration-300 border border-transparent hover:border-orange-200 hover:shadow-md hover:-translate-y-0.5 bg-white hover:bg-orange-50 group`}
              >
                <div className="flex gap-3 items-center">
                  <span
                    className={`font-black w-6 h-6 flex items-center justify-center rounded-full text-[10px] shadow-inner shrink-0 ${
                      i === 0
                        ? "bg-gradient-to-br from-orange-100 to-orange-200 text-orange-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span
                    className={`font-bold text-sm text-slate-700 group-hover:text-orange-600 transition-colors truncate max-w-[140px] md:max-w-[160px]`}
                  >
                    {cust}
                  </span>
                </div>
                <span
                  className={`font-black text-orange-700 bg-orange-50 px-3 py-1 rounded-lg shadow-sm`}
                >
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SimpleCalendar
        logs={logs}
        month={calMonth}
        year={calYear}
        onMonthChange={(m, y) => {
          setCalMonth(m);
          setCalYear(y);
        }}
        onDayClick={(dayLogs, dateLabel) =>
          setPopoverData({ logs: dayLogs, date: dateLabel })
        }
        themeColor={color}
      />
      <div className={`p-6 md:p-8 ${getProPanelClass()} mt-8`}>
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100/50">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-inner border border-white">
            <Printer className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
              Esporta Report
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          <input
            type="text"
            placeholder="Filtra Cliente..."
            className={getProInputClass(color)}
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filtra Gru..."
            className={getProInputClass(color)}
            value={selectedMachine}
            onChange={(e) => setSelectedMachine(e.target.value)}
          />
          <select
            className={getProInputClass(color)}
            value={selectedTech}
            onChange={(e) => setSelectedTech(e.target.value)}
          >
            <option value="">Tutti i Tecnici</option>
            {technicians.map((tc) => (
              <option key={tc.id} value={tc.name}>
                {tc.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <input
            type="date"
            className={getProInputClass(color)}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className={getProInputClass(color)}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <button
            onClick={generatePDF}
            className={`flex-1 py-4 rounded-2xl font-black uppercase text-xs text-white bg-slate-800 hover:bg-slate-700 shadow-lg`}
          >
            Genera PDF
          </button>
          <button
            onClick={handleDownloadExcel}
            className={`flex-1 py-4 rounded-2xl font-black uppercase text-xs text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg`}
          >
            Scarica Excel
          </button>
        </div>
      </div>
      {popoverData && (
        <div
          className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md anim-fade-in"
          onClick={() => setPopoverData(null)}
        >
          <div
            className={`w-full max-w-md anim-zoom-in ${getProPanelClass()} flex flex-col max-h-[85vh]`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-slate-100/50 bg-white/80 backdrop-blur-xl flex justify-between items-center">
              <h3 className="font-black text-slate-800 uppercase tracking-tight text-lg">
                {popoverData.date}
              </h3>
              <button
                onClick={() => setPopoverData(null)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
              {popoverData.logs.map((l, i) => (
                <div
                  key={i}
                  className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md">
                      {l.dateString} - {l.technician}
                    </span>
                    <span
                      className={`text-[10px] font-black text-white ${t.bg600} px-2.5 py-1 rounded-md`}
                    >
                      {l.machineId}
                    </span>
                  </div>
                  <p className="text-sm font-black text-slate-800 mb-2">
                    {l.customer}
                  </p>
                  <p className="text-xs text-slate-600 italic">
                    "{l.description}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const NewEntryForm = ({
  user,
  customers,
  technicians,
  machineTypes,
  machines,
  onSuccess,
  isMobile,
  onTechUpdate,
  layoutConfig,
  allLogs,
}) => {
  const [formData, setFormData] = useState({
    technician: "",
    customer: "",
    machineType: "",
    machineId: "",
    capacity: "",
    description: "",
    ticketNumber: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMachineSuggestions, setShowMachineSuggestions] = useState(false);
  const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);
  const [relatedMachines, setRelatedMachines] = useState([]);
  const [lastIntervention, setLastIntervention] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const color = layoutConfig?.themeColor || "blue";
  const t = getTheme(color);
  const formOrder = layoutConfig?.formOrder || DEFAULT_LAYOUT.formOrder;

  useEffect(() => {
    const saved = localStorage.getItem("mora_tech_last_name");
    if (saved) {
      setFormData((p) => ({ ...p, technician: saved }));
      setIsLocked(true);
    }
  }, []);

  const handleMachineIdChange = (e) => {
    const val = e.target.value.toUpperCase().replace(/\//g, "-");
    if (!val) {
      setFormData((p) => ({
        ...p,
        machineId: "",
        customer: "",
        machineType: "",
        capacity: "",
      }));
      setRelatedMachines([]);
      setShowMachineSuggestions(false);
      setLastIntervention(null);
      return;
    }
    const found = machines.find((m) => m.id === val);
    if (found) {
      setFormData((p) => ({
        ...p,
        machineId: val,
        customer: found.customerName,
        machineType: found.type,
        capacity: found.capacity,
      }));
      setRelatedMachines([]);
      if (allLogs) {
        const logs = allLogs.filter((l) => l.machineId === val);
        setLastIntervention(logs.length > 0 ? logs[0] : null);
      }
    } else {
      setFormData((p) => ({ ...p, machineId: val }));
      setLastIntervention(null);
    }
    setShowMachineSuggestions(true);
  };
  const handleCustomerChange = (e) => {
    const val = e.target.value.toUpperCase();
    if (!val) {
      setFormData((p) => ({
        ...p,
        customer: "",
        machineId: "",
        machineType: "",
        capacity: "",
      }));
      setRelatedMachines([]);
      setLastIntervention(null);
      return;
    }
    setFormData((p) => ({ ...p, customer: val }));
    setRelatedMachines(machines.filter((m) => m.customerName.includes(val)));
    setShowCustomerSuggestions(true);
  };
  const selectMachine = (m) => {
    setFormData((p) => ({
      ...p,
      machineId: m.id,
      customer: m.customerName,
      machineType: m.type,
      capacity: m.capacity,
    }));
    setShowMachineSuggestions(false);
    setRelatedMachines([]);
    if (allLogs) {
      const logs = allLogs.filter((l) => l.machineId === m.id);
      setLastIntervention(logs.length > 0 ? logs[0] : null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.technician || !formData.customer || !formData.description)
      return alert("Compila i campi obbligatori");
    setIsSubmitting(true);
    try {
      if (onTechUpdate) onTechUpdate(formData.technician);
      localStorage.setItem("mora_tech_last_name", formData.technician);
      await addDoc(
        collection(
          db,
          "artifacts",
          appId,
          "public",
          "data",
          "maintenance_logs"
        ),
        {
          ...formData,
          machineId: formData.machineId.toUpperCase(),
          customer: formData.customer.toUpperCase(),
          dateString: new Date().toLocaleDateString("it-IT"),
          userId: user.uid,
          createdAt: serverTimestamp(),
        }
      );
      await setDoc(
        doc(
          db,
          "artifacts",
          appId,
          "public",
          "data",
          "machines",
          formData.machineId.toLowerCase()
        ),
        {
          id: formData.machineId,
          customerName: formData.customer.toUpperCase(),
          type: formData.machineType,
          capacity: formData.capacity,
        },
        { merge: true }
      );
      await setDoc(
        doc(
          db,
          "artifacts",
          appId,
          "public",
          "data",
          "customers",
          formData.customer.toLowerCase().replace(/\s+/g, "_")
        ),
        { name: formData.customer.toUpperCase() },
        { merge: true }
      );
      onSuccess();
      setIsLocked(true);
    } catch (e) {
      alert("Errore salvataggio");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (key) => {
    switch (key) {
      case "technician":
        return (
          <div key="tech" className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">
              Tecnico
            </label>
            <div className="relative">
              {isLocked ? (
                <div className="w-full p-4 bg-slate-100/80 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 flex justify-between items-center shadow-inner">
                  <span>{formData.technician}</span>
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>
              ) : (
                <>
                  <select
                    className={getProInputClass(color)}
                    value={formData.technician}
                    onChange={(e) =>
                      setFormData({ ...formData, technician: e.target.value })
                    }
                  >
                    <option value="">Seleziona...</option>
                    {technicians.map((tc) => (
                      <option key={tc.id} value={tc.name}>
                        {tc.name}
                      </option>
                    ))}
                  </select>
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                </>
              )}
            </div>
          </div>
        );
      case "machine":
        return (
          <div key="mach" className="grid grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-1.5 relative">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-2">
                Matricola
              </label>
              <div className="relative">
                <input
                  type="text"
                  className={getProInputClass(color)}
                  value={formData.machineId}
                  onChange={handleMachineIdChange}
                  onFocus={() => setShowMachineSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowMachineSuggestions(false), 200)
                  }
                />
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 w-4 h-4" />
              </div>
              {showMachineSuggestions && (
                <ul className="absolute z-50 left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl max-h-48 overflow-y-auto anim-zoom-in">
                  {machines
                    .filter(
                      (m) =>
                        (!formData.customer ||
                          m.customerName === formData.customer) &&
                        (!formData.machineId ||
                          m.id.includes(formData.machineId.toUpperCase()))
                    )
                    .slice(0, 50)
                    .map((m) => (
                      <li
                        key={m.id}
                        onClick={() => selectMachine(m)}
                        className="p-4 hover:bg-slate-50 cursor-pointer border-b border-slate-100/50 flex justify-between"
                      >
                        <span className="font-bold text-sm text-slate-800">
                          {m.id}
                        </span>
                        <span className="text-[9px] bg-slate-100 px-2 py-1 rounded-md uppercase font-bold">
                          {m.type}
                        </span>
                      </li>
                    ))}
                </ul>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-2">
                Tipo
              </label>
              <select
                className={getProInputClass(color)}
                value={formData.machineType}
                onChange={(e) =>
                  setFormData({ ...formData, machineType: e.target.value })
                }
              >
                <option value="">Seleziona...</option>
                {machineTypes.map((mt) => (
                  <option key={mt.id} value={mt.name}>
                    {mt.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
      case "customer":
        return (
          <div key="cust" className="space-y-1.5 relative">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-2">
              Cliente
            </label>
            <div className="relative">
              <input
                type="text"
                className={getProInputClass(color)}
                value={formData.customer}
                onChange={handleCustomerChange}
                onFocus={() => setShowCustomerSuggestions(true)}
                onBlur={() =>
                  setTimeout(() => setShowCustomerSuggestions(false), 200)
                }
              />
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 w-4 h-4" />
            </div>
            {showCustomerSuggestions && (
              <ul className="absolute z-50 left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl max-h-48 overflow-y-auto anim-zoom-in">
                {customers
                  .filter(
                    (c) =>
                      !formData.customer ||
                      c.name.includes(formData.customer.toUpperCase())
                  )
                  .map((c) => (
                    <li
                      key={c.id}
                      onClick={() => {
                        setFormData({ ...formData, customer: c.name });
                        setShowCustomerSuggestions(false);
                      }}
                      className="p-4 hover:bg-slate-50 cursor-pointer font-bold text-sm text-slate-800 border-b border-slate-100/50"
                    >
                      {c.name}
                    </li>
                  ))}
              </ul>
            )}
            {relatedMachines.length > 0 && !formData.machineId && (
              <div className="mt-4 anim-fade-in">
                <span className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-2 block">
                  Gru di {formData.customer}:
                </span>
                <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar snap-x">
                  {relatedMachines.map((m) => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => selectMachine(m)}
                      className={`snap-start flex flex-col items-start p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-${color}-400 group min-w-[140px] shrink-0`}
                    >
                      <div
                        className={`p-2.5 ${t.bg50} ${t.text600} rounded-xl mb-3 group-hover:bg-${color}-600 group-hover:text-white transition-colors`}
                      >
                        <Factory className="w-5 h-5" />
                      </div>
                      <span className="font-black text-slate-800 text-sm block">
                        {m.id}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case "description":
        return (
          <div key="desc" className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-2">
              Descrizione Intervento
            </label>
            <textarea
              rows="4"
              className={getProInputClass(color)}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
        );
      case "capacity":
        return layoutConfig.formSettings.showCapacity ? (
          <div key="cap" className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-2">
              Portata
            </label>
            <input
              type="text"
              className={getProInputClass(color)}
              value={formData.capacity}
              onChange={(e) =>
                setFormData({ ...formData, capacity: e.target.value })
              }
            />
          </div>
        ) : null;
      case "date":
        return (
          <div key="date" className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-2">
              Data
            </label>
            <div className="w-full p-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl text-sm text-slate-500 font-bold flex items-center gap-3">
              <CalendarIcon className="w-5 h-5 text-slate-400" />
              {new Date().toLocaleDateString("it-IT")}
            </div>
          </div>
        );
      case "ticketNumber":
        return (
          <div key="ticketNumber" className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-2">
              N. Assistenza
            </label>
            <input
              type="text"
              className={getProInputClass(color)}
              value={formData.ticketNumber}
              onChange={(e) =>
                setFormData({ ...formData, ticketNumber: e.target.value })
              }
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`anim-slide-up ${getProPanelClass()} mb-8`}>
      <div className="px-6 md:px-8 py-6 md:py-8 border-b border-slate-100/50 flex justify-between items-center bg-white/40">
        <h2 className="font-black text-slate-800 text-2xl uppercase">
          Nuovo Rapporto
        </h2>
        <div
          className={`bg-gradient-to-br ${t.gradient} text-white p-4 rounded-2xl shadow-lg`}
        >
          <HardHat className="w-6 h-6" />
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="p-6 md:p-8 space-y-6 md:space-y-8 bg-slate-50/30"
      >
        {formOrder.map((key) => renderField(key))}
        {lastIntervention && (
          <div className="bg-amber-50/80 p-5 rounded-2xl border border-amber-200/50 anim-zoom-in shadow-sm">
            <div className="flex items-center gap-2.5 mb-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h4 className="text-xs font-black text-amber-800 uppercase">
                Ultimo Lavoro ({lastIntervention.dateString})
              </h4>
            </div>
            <p className="text-sm text-amber-900/80 font-medium italic ml-7">
              "{lastIntervention.description}"
            </p>
            <div className="text-[10px] text-amber-700/60 mt-3 font-black text-right uppercase">
              - {lastIntervention.technician}
            </div>
          </div>
        )}
        <div className="pt-4 border-t border-slate-100/50">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-5 text-sm uppercase ${getButtonPrimaryClass(
              color
            )} flex items-center justify-center gap-3`}
          >
            {isSubmitting ? (
              <RefreshCw className="animate-spin w-5 h-5" />
            ) : (
              <Save className="w-5 h-5" />
            )}{" "}
            Salva Rapporto
          </button>
        </div>
      </form>
    </div>
  );
};

const HistoryView = ({
  logs,
  machines,
  customers,
  technicians,
  machineTypes,
  loading,
  isMobile,
  onAuthAdmin,
  isAdmin,
  layoutConfig,
  onOpenCustomer,
  onOpenMachine,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState(null);
  const [isEditing, setIsEditing] = useState(null);
  const [pin, setPin] = useState("");
  const [err, setErr] = useState(false);
  const [isFreeAction, setIsFreeAction] = useState(false);
  const color = layoutConfig?.themeColor || "blue";
  const t = getTheme(color);

  const filtered = logs.filter((l) => {
    const s = searchTerm.toLowerCase();
    return (
      (l.customer && l.customer.toLowerCase().includes(s)) ||
      (l.machineId && l.machineId.toLowerCase().includes(s)) ||
      (l.description && l.description.toLowerCase().includes(s))
    );
  });
  const ITEMS_PER_PAGE = 50;
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const handleDelete = (log) => {
    const isRecent =
      log.createdAt &&
      Date.now() - log.createdAt.seconds * 1000 < 3 * 60 * 1000;
    if (isAdmin || isRecent) {
      setIsFreeAction(isRecent && !isAdmin);
      setIsDeleting(log.id);
    } else onAuthAdmin();
  };
  const handleEdit = (log) => {
    const isRecent =
      log.createdAt &&
      Date.now() - log.createdAt.seconds * 1000 < 3 * 60 * 1000;
    if (isAdmin || isRecent) setIsEditing(log.id);
    else onAuthAdmin();
  };
  const confirmDelete = async () => {
    if (!isFreeAction && pin !== ADMIN_PASSWORD) return setErr(true);
    await deleteDoc(
      doc(
        db,
        "artifacts",
        appId,
        "public",
        "data",
        "maintenance_logs",
        isDeleting
      )
    );
    setIsDeleting(null);
    setPin("");
  };

  if (loading)
    return (
      <div className="py-32 text-center anim-fade-in">
        <RefreshCw className={`animate-spin mx-auto ${t.text500} w-12 h-12`} />
      </div>
    );

  return (
    <div className="space-y-6 md:space-y-8 anim-slide-up">
      <div
        className={`relative group max-w-2xl mx-auto shadow-xl shadow-slate-200/40 rounded-3xl ${getProPanelClass()}`}
      >
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
        <input
          type="text"
          placeholder="Cerca nello storico..."
          className="w-full pl-16 pr-6 py-5 bg-white/50 backdrop-blur-sm font-bold outline-none text-base"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className={getProPanelClass()}>
        {isMobile ? (
          <div className="divide-y divide-slate-100/60 bg-white/40">
            {paginated.map((log) => (
              <div
                key={log.id}
                className="p-6 space-y-4 hover:bg-white/80 transition-all duration-300"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-3">
                    <h4
                      className={`font-black text-slate-800 uppercase text-sm ${t.hoverText600} hover:underline cursor-pointer`}
                      onClick={() => onOpenCustomer(log.customer)}
                    >
                      {log.customer}
                    </h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span
                        className={`text-[9px] font-black text-white ${t.bg500} px-2 py-1 rounded-md uppercase cursor-pointer`}
                        onClick={() => onOpenMachine(log.machineId)}
                      >
                        {log.machineId}
                      </span>
                      <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md uppercase">
                        {log.machineType}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                      <CalendarIcon className="w-3 h-3" />
                      {log.dateString}
                    </span>
                    {log.ticketNumber && (
                      <span className="text-[9px] font-black text-blue-700 bg-blue-50 border border-blue-200/50 px-2 py-0.5 rounded-lg uppercase shadow-sm">
                        # {log.ticketNumber}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-slate-600 text-sm font-medium italic bg-slate-50/80 p-4 rounded-2xl">
                  "{log.description}"
                </p>
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-slate-100 rounded-lg text-slate-400">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] font-black uppercase text-slate-600">
                      {log.technician}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(log)}
                      className={`p-2.5 bg-slate-50 text-slate-400 rounded-xl ${t.hoverBg50} ${t.hoverText600}`}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(log)}
                      className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left table-fixed bg-white/40">
              <thead className="bg-slate-50/80 border-b border-slate-200/60 backdrop-blur-md">
                <tr>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase w-[110px]">
                    Data
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase w-[250px]">
                    Cliente & Impianto
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase">
                    Descrizione
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase w-[140px]">
                    Tecnico
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase text-center w-[120px]">
                    Azioni
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/60">
                {paginated.map((log) => (
                  <tr key={log.id} className="hover:bg-white/80 group">
                    <td className="px-6 py-5 align-top">
                      <div className="text-xs font-black text-slate-600 flex items-center gap-1.5 bg-slate-100/80 w-fit px-2.5 py-1 rounded-lg">
                        <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />{" "}
                        {log.dateString}
                      </div>
                      {log.ticketNumber && (
                        <div className="text-[9px] font-black text-blue-700 bg-blue-50 border border-blue-200/50 px-2 py-0.5 rounded-md mt-2 inline-block">
                          # {log.ticketNumber}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5 align-top">
                      <div className="flex flex-col">
                        <span
                          className={`font-black text-slate-800 uppercase text-sm cursor-pointer ${t.hoverText600}`}
                          onClick={() => onOpenCustomer(log.customer)}
                        >
                          {log.customer}
                        </span>
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          <span
                            className={`text-[10px] font-black text-white ${t.bg500} px-2 py-0.5 rounded cursor-pointer`}
                            onClick={() => onOpenMachine(log.machineId)}
                          >
                            {log.machineId}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {log.machineType}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600 font-medium italic break-words whitespace-pre-wrap align-top leading-relaxed">
                      "{log.description}"
                    </td>
                    <td className="px-6 py-5 align-top">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-slate-100 rounded-lg text-slate-400">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[10px] font-black uppercase text-slate-600">
                          {log.technician}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center align-top">
                      <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => handleEdit(log)}
                          className={`p-2 bg-slate-50 text-slate-400 rounded-lg ${t.hoverBg50} ${t.hoverText600}`}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(log)}
                          className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {totalPages > 1 && (
          <div className="p-5 flex justify-between items-center bg-white/60 border-t border-slate-100/50 backdrop-blur-md">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className={`px-4 py-2 text-xs font-black uppercase ${PRO_BUTTON_SECONDARY} ${
                page === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Prec
            </button>
            <span className="text-xs font-black text-slate-400">
              Pagina {page} di {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className={`px-4 py-2 text-xs font-black uppercase ${PRO_BUTTON_SECONDARY} ${
                page === totalPages ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Succ
            </button>
          </div>
        )}
      </div>
      {isDeleting && (
        <DeleteConfirmDialog
          onConfirm={confirmDelete}
          onCancel={() => setIsDeleting(null)}
          pin={pin}
          setPin={setPin}
          error={err}
          title="Elimina Rapporto"
          isFree={isFreeAction}
        />
      )}
      {isEditing && (
        <EditLogModal
          log={logs.find((l) => l.id === isEditing)}
          customers={customers}
          technicians={technicians}
          machineTypes={machineTypes}
          onClose={() => setIsEditing(null)}
          color={color}
          layoutConfig={layoutConfig}
        />
      )}
    </div>
  );
};

const AdminPanel = ({
  customers,
  technicians,
  machines,
  machineTypes,
  isMobile,
  layoutConfig,
  onUpdateLayout,
}) => {
  const [view, setView] = useState("design");
  const [inputValue, setInputValue] = useState("");
  const [logs, setLogs] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editingMachine, setEditingMachine] = useState(null);
  const [mergingItem, setMergingItem] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const color = layoutConfig?.themeColor || "blue";
  const t = getTheme(color);

  useEffect(() => {
    const handleOn = () => setIsOnline(true);
    const handleOff = () => setIsOnline(false);
    window.addEventListener("online", handleOn);
    window.addEventListener("offline", handleOff);
    return () => {
      window.removeEventListener("online", handleOn);
      window.removeEventListener("offline", handleOff);
    };
  }, []);

  useEffect(() => {
    if (view === "diagnostics") {
      const unsubLogs = onSnapshot(
        query(
          collection(db, "artifacts", appId, "public", "data", "access_logs"),
          orderBy("timestamp", "desc"),
          limit(50)
        ),
        (s) => setLogs(s.docs.map((d) => ({ id: d.id, ...d.data() })))
      );
      const unsubActive = onSnapshot(
        collection(db, "artifacts", appId, "public", "data", "active_users"),
        (s) => {
          const now = Date.now();
          setActiveUsers(
            s.docs
              .map((d) => ({ id: d.id, ...d.data() }))
              .filter(
                (u) =>
                  u.lastActive &&
                  now - u.lastActive.seconds * 1000 < 5 * 60 * 1000
              )
              .sort((a, b) => b.lastActive.seconds - a.lastActive.seconds)
          );
        }
      );
      return () => {
        unsubLogs();
        unsubActive();
      };
    }
  }, [view]);

  const addItem = async () => {
    if (!inputValue) return;
    const coll = view === "techs" ? "technicians" : "machine_types";
    const id = inputValue.toLowerCase().replace(/\s+/g, "_");
    await setDoc(doc(db, "artifacts", appId, "public", "data", coll, id), {
      name: inputValue,
    });
    setInputValue("");
  };
  const deleteItem = async (coll, id) => {
    if (window.confirm("Eliminare definitivamente?"))
      await deleteDoc(doc(db, "artifacts", appId, "public", "data", coll, id));
  };

  const handleMergeCustomers = async (source, target) => {
    /* Omissis: identico */
  };
  const handleMergeMachines = async (source, target) => {
    /* Omissis: identico */
  };

  return (
    <div className="space-y-6 md:space-y-8 anim-slide-up">
      <div className="flex p-2.5 rounded-[2rem] border border-slate-200/60 bg-white/60 backdrop-blur-xl shadow-lg shadow-slate-200/30 overflow-x-auto gap-2 custom-scrollbar">
        <AdminTab
          active={view === "design"}
          onClick={() => setView("design")}
          icon={Palette}
          label="Design"
          color={color}
        />
        <AdminTab
          active={view === "techs"}
          onClick={() => setView("techs")}
          icon={User}
          label="Staff"
          color={color}
        />
        <AdminTab
          active={view === "types"}
          onClick={() => setView("types")}
          icon={Layers}
          label="Tipi"
          color={color}
        />
        <AdminTab
          active={view === "clients"}
          onClick={() => setView("clients")}
          icon={Users}
          label="Clienti"
          color={color}
        />
        <AdminTab
          active={view === "machines"}
          onClick={() => setView("machines")}
          icon={Factory}
          label="Gru"
          color={color}
        />
        <AdminTab
          active={view === "diagnostics"}
          onClick={() => setView("diagnostics")}
          icon={AlertOctagon}
          label="System"
          color={color}
        />
      </div>

      {view === "design" && (
        <div className={`p-8 ${getProPanelClass()}`}>
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-slate-100 text-slate-600 rounded-2xl">
              <Palette className="w-6 h-6" />
            </div>
            <h3 className="font-black text-slate-800 text-xl uppercase tracking-tight">
              Tema
            </h3>
          </div>
          <div className="mb-8">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
              Colore Principale
            </h4>
            <div className="flex flex-wrap gap-4">
              {Object.keys(THEMES).map((c) => (
                <button
                  key={c}
                  onClick={() =>
                    onUpdateLayout({ ...layoutConfig, themeColor: c })
                  }
                  className={`w-12 h-12 rounded-2xl shadow-lg transition-all duration-300 hover:scale-110 ${
                    THEMES[c].bg500
                  } ${
                    layoutConfig.themeColor === c
                      ? "ring-4 ring-slate-800 ring-offset-2 scale-110"
                      : ""
                  }`}
                ></button>
              ))}
            </div>
          </div>
          <div className="border-t border-slate-100/50 pt-8">
            <button
              onClick={() =>
                onUpdateLayout({
                  ...layoutConfig,
                  appTitle:
                    prompt("Nuovo Titolo:", layoutConfig.appTitle) ||
                    layoutConfig.appTitle,
                })
              }
              className={`w-full py-4 text-xs uppercase ${getButtonPrimaryClass(
                "slate"
              )}`}
            >
              Modifica Nome App
            </button>
          </div>
        </div>
      )}

      {(view === "techs" || view === "types") && (
        <div className={`p-8 max-w-xl mx-auto ${getProPanelClass()}`}>
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              className={getProInputClass(color)}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Inserisci nuovo..."
            />
            <button
              onClick={addItem}
              className={`px-6 py-3.5 text-xs uppercase ${getButtonPrimaryClass(
                color
              )} shrink-0`}
            >
              Aggiungi
            </button>
          </div>
          <div className="space-y-2.5 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
            {(view === "techs" ? technicians : machineTypes).map((i) => (
              <div
                key={i.id}
                className="flex justify-between items-center p-4 bg-white border border-slate-100 shadow-sm rounded-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm text-slate-700">
                    {String(i.name)}
                  </span>
                </div>
                <button
                  onClick={() =>
                    deleteItem(
                      view === "techs" ? "technicians" : "machine_types",
                      i.id
                    )
                  }
                  className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-xl"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === "clients" && (
        <div className={`p-8 ${getProPanelClass()}`}>
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-black text-slate-800 uppercase text-lg">
              Anagrafica Clienti
            </h4>
            <span className="bg-slate-100 text-slate-500 font-bold px-3 py-1 rounded-lg text-xs">
              {customers.length} Totali
            </span>
          </div>
          <div className="max-h-[500px] overflow-y-auto space-y-2.5 custom-scrollbar pr-2">
            {customers.map((c) => (
              <div
                key={c.id}
                className="flex justify-between p-4 bg-white border border-slate-100 rounded-2xl items-center group shadow-sm"
              >
                <span className="font-bold text-sm text-slate-800">
                  {String(c.name)}
                </span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() =>
                      setMergingItem({ item: c, type: "customer" })
                    }
                    className="p-2 text-slate-400 hover:bg-purple-50 hover:text-purple-600 rounded-xl"
                    title="Unisci"
                  >
                    <Merge className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditingCustomer(c)}
                    className="p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-xl"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteItem("customers", c.id)}
                    className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === "machines" && (
        <div className={`p-8 ${getProPanelClass()}`}>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
            <h4 className="font-black text-slate-800 uppercase text-lg flex items-center gap-3">
              <Factory className="w-6 h-6 text-slate-400" /> Archivio Gru
            </h4>
            <input
              type="text"
              placeholder="Filtra matricola/cliente..."
              className={`${getProInputClass(color)} md:max-w-xs`}
              onChange={(e) => {
                document
                  .querySelectorAll(".machine-item")
                  .forEach(
                    (el) =>
                      (el.style.display = el.textContent
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase())
                        ? "flex"
                        : "none")
                  );
              }}
            />
          </div>
          <div className="max-h-[500px] overflow-y-auto space-y-2.5 custom-scrollbar pr-2">
            {machines.map((m) => (
              <div
                key={m.id}
                className="machine-item flex justify-between p-4 bg-white border border-slate-100 rounded-2xl items-center group shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`font-black text-sm text-white ${t.bg500} px-3 py-1.5 rounded-lg`}
                  >
                    {m.id}
                  </span>
                  <span className="font-bold text-sm text-slate-700">
                    {m.customerName}
                  </span>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => setMergingItem({ item: m, type: "machine" })}
                    className="p-2 text-slate-400 hover:bg-purple-50 hover:text-purple-600 rounded-xl"
                    title="Unisci"
                  >
                    <Merge className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditingMachine(m)}
                    className="p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-xl"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteItem("machines", m.id.toLowerCase())}
                    className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === "diagnostics" && (
        <div className={`p-8 ${getProPanelClass()}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            <div className="p-5 rounded-3xl border border-slate-100 bg-white flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    isOnline
                      ? "bg-gradient-to-br from-green-400 to-green-500 text-white"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {isOnline ? (
                    <Wifi className="w-5 h-5" />
                  ) : (
                    <WifiOff className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h5 className="font-black text-sm text-slate-800">
                    Connessione DB
                  </h5>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                    {isOnline ? "Online - Sync Attiva" : "Offline"}
                  </p>
                </div>
              </div>
              <DatabaseZap
                className={`w-6 h-6 ${
                  isOnline ? "text-green-500 animate-pulse" : "text-red-500"
                }`}
              />
            </div>
            <button
              onClick={() => window.location.reload()}
              className="p-5 rounded-3xl border border-slate-100 bg-white flex items-center justify-start gap-4 shadow-sm group"
            >
              <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center group-hover:rotate-180 transition-transform">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h5 className="font-black text-sm text-slate-800 uppercase">
                  Riavvia App
                </h5>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">
                  Forza ricaricamento
                </p>
              </div>
            </button>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-100/50">
            <button
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                window.location.reload();
              }}
              className="w-full p-5 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center gap-3 font-black uppercase"
            >
              <LogOut className="w-5 h-5" /> Scollega Il Mio Dispositivo
            </button>
          </div>
        </div>
      )}

      {editingCustomer && (
        <EditCustomerModal
          customer={editingCustomer}
          allCustomers={customers}
          onClose={() => setEditingCustomer(null)}
          color={layoutConfig.themeColor}
        />
      )}
      {editingMachine && (
        <EditMachineModal
          machine={editingMachine}
          customers={customers}
          machineTypes={machineTypes}
          allMachines={machines}
          onClose={() => setEditingMachine(null)}
          themeColor={layoutConfig.themeColor}
        />
      )}
      {mergingItem && (
        <MergeModal
          sourceItem={mergingItem.item}
          type={mergingItem.type}
          allItems={mergingItem.type === "customer" ? customers : machines}
          onClose={() => setMergingItem(null)}
          onConfirm={
            mergingItem.type === "customer"
              ? handleMergeCustomers
              : handleMergeMachines
          }
          color={layoutConfig.themeColor}
        />
      )}
    </div>
  );
};

const DashboardView = ({
  onNavigate,
  isMobile,
  layoutConfig,
  onAdminAccess,
}) => {
  const color = layoutConfig?.themeColor || "blue";
  const order = layoutConfig?.dashboardOrder || DEFAULT_LAYOUT.dashboardOrder;
  const buttonsMap = {
    new: { icon: PlusCircle, label: "Nuovo", sub: "Rapporto", color: color },
    explore: {
      icon: ListTree,
      label: "Esplora",
      sub: "Archivio",
      color: "orange",
    },
    history: {
      icon: History,
      label: "Storico",
      sub: "Cerca",
      color: "emerald",
    },
    database: {
      icon: Database,
      label: "Database",
      sub: "Liste",
      color: "blue",
    },
    office: {
      icon: Briefcase,
      label: "Ufficio",
      sub: "Gestionale",
      color: "purple",
    },
    admin: {
      icon: Settings,
      label: "Admin",
      sub: "Dati",
      color: "slate",
      action: onAdminAccess,
    },
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 anim-zoom-in">
      <div
        className={`grid ${
          isMobile ? "grid-cols-2 gap-4" : "grid-cols-3 gap-6"
        }`}
      >
        {order.map((key, index) => {
          const btn = buttonsMap[key];
          if (!btn) return null;
          const t = getTheme(btn.color);
          return (
            <button
              key={key}
              onClick={btn.action || (() => onNavigate(key))}
              className="p-6 md:p-8 flex flex-col items-center gap-5 transition-all duration-300 ease-out group hover:-translate-y-1.5 active:scale-95 bg-white/80 backdrop-blur-md rounded-[2rem] shadow-lg shadow-slate-200/50 border border-white hover:border-slate-100 hover:shadow-2xl hover:bg-white"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div
                className={`w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 bg-gradient-to-br ${t.gradient} text-white ${t.shadow500} border border-white/20`}
              >
                <btn.icon
                  className="w-8 h-8 md:w-10 md:h-10"
                  strokeWidth={2.5}
                />
              </div>
              <div className="text-center">
                <h3 className="text-lg md:text-xl font-black text-slate-800 uppercase tracking-tight group-hover:text-slate-900 transition-colors">
                  {btn.label}
                </h3>
                <p
                  className={`text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 ${t.groupHoverText} transition-colors`}
                >
                  {btn.sub}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [logs, setLogs] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [machines, setMachines] = useState([]);
  const [machineTypes, setMachineTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [currentTechName, setCurrentTechName] = useState(
    localStorage.getItem("mora_tech_last_name") || ""
  );
  const [layoutConfig, setLayoutConfig] = useState(DEFAULT_LAYOUT);
  const [isAppLoading, setIsAppLoading] = useState(true);

  const [viewingMachineHistory, setViewingMachineHistory] = useState(null);
  const [viewingCustomerDetail, setViewingCustomerDetail] = useState(null);

  // INIETTORE TAILWIND (RISOLVE I PROBLEMI SU CODESANDBOX)
  useEffect(() => {
    if (!document.getElementById("tailwind-cdn")) {
      const script = document.createElement("script");
      script.id = "tailwind-cdn";
      script.src = "https://cdn.tailwindcss.com";
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (e) {
        console.error(e);
      }
    };
    initAuth();
    onAuthStateChanged(auth, (u) => {
      setUser(u);
      setTimeout(() => setIsAppLoading(false), 1500);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsubLayout = onSnapshot(
      doc(db, "artifacts", appId, "public", "data", "settings", "layout"),
      (s) => {
        if (s.exists()) {
          const data = s.data();
          let order = data.dashboardOrder || DEFAULT_LAYOUT.dashboardOrder;
          if (!order.includes("explore")) {
            order = [...order];
            const idx = order.indexOf("new");
            if (idx !== -1) order.splice(idx + 1, 0, "explore");
            else order.unshift("explore");
          }
          setLayoutConfig((prev) => ({
            ...DEFAULT_LAYOUT,
            ...data,
            dashboardOrder: order,
          }));
        }
      }
    );
    const unsubLogs = onSnapshot(
      collection(db, "artifacts", appId, "public", "data", "maintenance_logs"),
      (s) => {
        setLogs(
          s.docs
            .map((d) => ({ id: d.id, ...d.data() }))
            .sort((a, b) => {
              const parseDate = (ds) => {
                if (!ds) return 0;
                const parts = ds.split("/");
                if (parts.length !== 3) return 0;
                const [d, m, y] = parts.map(Number);
                return new Date(y, m - 1, d).getTime() || 0;
              };
              const dateA = parseDate(a.dateString);
              const dateB = parseDate(b.dateString);
              if (dateA !== dateB) return dateB - dateA;
              return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
            })
        );
        setLoading(false);
      }
    );
    const unsubCust = onSnapshot(
      collection(db, "artifacts", appId, "public", "data", "customers"),
      (s) =>
        setCustomers(
          s.docs
            .map((d) => ({ id: d.id, ...d.data() }))
            .sort((a, b) => a.name.localeCompare(b.name))
        )
    );
    const unsubTech = onSnapshot(
      collection(db, "artifacts", appId, "public", "data", "technicians"),
      (s) => setTechnicians(s.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    const unsubMach = onSnapshot(
      collection(db, "artifacts", appId, "public", "data", "machines"),
      (s) => setMachines(s.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    const unsubTypes = onSnapshot(
      collection(db, "artifacts", appId, "public", "data", "machine_types"),
      (s) => setMachineTypes(s.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    return () => {
      unsubLayout();
      unsubLogs();
      unsubCust();
      unsubTech();
      unsubMach();
      unsubTypes();
    };
  }, [user]);

  const handleAdminAccess = () => {
    if (!isAdminAuthenticated) setShowAdminLogin(true);
    else setActiveTab("admin");
  };
  const handleUpdateLayout = async (cfg) => {
    setLayoutConfig(cfg);
    await setDoc(
      doc(db, "artifacts", appId, "public", "data", "settings", "layout"),
      cfg
    );
  };
  const openMachineDetail = (mId) => {
    setViewingMachineHistory(
      machines.find((m) => m.id.toLowerCase() === mId.toLowerCase()) || {
        id: mId,
        customerName: "N.D.",
        type: "N.D.",
        capacity: "N.D.",
      }
    );
    setViewingCustomerDetail(null);
  };
  const openCustomerDetail = (customerName) => {
    setViewingCustomerDetail(customerName);
    setViewingMachineHistory(null);
  };

  const color = layoutConfig.themeColor || "blue";
  const t = getTheme(color);

  if (isAppLoading)
    return (
      <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center z-[100] transition-opacity duration-1000">
        <div className="relative flex flex-col items-center anim-zoom-in">
          <div
            className={`p-6 rounded-[2rem] bg-gradient-to-br ${t.gradient} shadow-2xl mb-8 ${t.shadow500} border border-white/10`}
          >
            <HardHat className="w-16 h-16 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-3 drop-shadow-md">
            {layoutConfig.appTitle}
          </h1>
          <p
            className={`${t.text400} text-xs font-bold uppercase tracking-widest animate-pulse`}
          >
            Caricamento sistema...
          </p>
        </div>
      </div>
    );

  return (
    <>
      <GlobalStyles />
      <div
        className={`min-h-screen font-sans ${
          isMobileView ? "pb-28" : ""
        } relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-slate-100 to-slate-200 text-slate-900 anim-fade-in`}
      >
        <header
          className={`sticky top-0 z-50 p-4 transition-colors duration-300 glass-effect shadow-sm border-t-4 ${t.border500}`}
        >
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div
              className="flex items-center gap-4 cursor-pointer group"
              onClick={() => setActiveTab("dashboard")}
            >
              <div
                className={`p-2.5 rounded-[1rem] bg-gradient-to-br ${t.gradient} text-white shadow-lg ${t.shadow500} group-hover:scale-105 transition-transform`}
              >
                <HardHat className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-black uppercase tracking-tighter leading-none text-slate-800 drop-shadow-sm">
                  {layoutConfig.appTitle}
                </h1>
                <span
                  className={`text-[10px] font-black ${t.text600} uppercase tracking-widest block mt-1 opacity-80`}
                >
                  {currentTechName ? `Ciao, ${currentTechName}` : "Tecnico"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {activeTab !== "dashboard" && (
          <div className="sticky top-[80px] z-40 w-full py-4 px-4 pointer-events-none">
            <div className="max-w-6xl mx-auto pointer-events-auto">
              <button
                onClick={() => {
                  setActiveTab("dashboard");
                  window.scrollTo(0, 0);
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest ${PRO_BUTTON_SECONDARY} shadow-lg shadow-slate-200/50`}
              >
                <ArrowLeft className="w-4 h-4" /> Home
              </button>
            </div>
          </div>
        )}

        <main className="max-w-6xl mx-auto p-4 md:p-8">
          {!user ? (
            <div className="py-40 text-center">
              <RefreshCw
                className={`animate-spin mx-auto ${t.text500} w-12 h-12`}
              />
            </div>
          ) : (
            <div key={activeTab}>
              {activeTab === "dashboard" && (
                <DashboardView
                  onNavigate={setActiveTab}
                  isMobile={isMobileView}
                  layoutConfig={layoutConfig}
                  onAdminAccess={handleAdminAccess}
                />
              )}
              {activeTab === "explore" && (
                <ExploreView
                  customers={customers}
                  machines={machines}
                  logs={logs}
                  color={color}
                />
              )}
              {activeTab === "history" && (
                <HistoryView
                  logs={logs}
                  machines={machines}
                  customers={customers}
                  technicians={technicians}
                  machineTypes={machineTypes}
                  loading={loading}
                  isMobile={isMobileView}
                  onAuthAdmin={() => setShowAdminLogin(true)}
                  isAdmin={isAdminAuthenticated}
                  layoutConfig={layoutConfig}
                  onOpenCustomer={openCustomerDetail}
                  onOpenMachine={openMachineDetail}
                />
              )}
              {activeTab === "office" && (
                <OfficeView
                  logs={logs}
                  machines={machines}
                  customers={customers}
                  layoutConfig={layoutConfig}
                  technicians={technicians}
                />
              )}
              {activeTab === "database" && (
                <DatabaseView
                  logs={logs}
                  machines={machines}
                  customers={customers}
                  themeColor={color}
                  onOpenCustomer={openCustomerDetail}
                  onOpenMachine={openMachineDetail}
                />
              )}
              {activeTab === "new" && (
                <NewEntryForm
                  user={user}
                  customers={customers}
                  technicians={technicians}
                  machineTypes={machineTypes}
                  machines={machines}
                  onSuccess={() => setActiveTab("history")}
                  isMobile={isMobileView}
                  onTechUpdate={setCurrentTechName}
                  layoutConfig={layoutConfig}
                  allLogs={logs}
                />
              )}
              {activeTab === "admin" && isAdminAuthenticated && (
                <AdminPanel
                  customers={customers}
                  technicians={technicians}
                  machines={machines}
                  machineTypes={machineTypes}
                  isMobile={isMobileView}
                  layoutConfig={layoutConfig}
                  onUpdateLayout={handleUpdateLayout}
                />
              )}
            </div>
          )}
        </main>

        {viewingMachineHistory && (
          <MachineHistoryModal
            machineId={viewingMachineHistory.id}
            machines={machines}
            allLogs={logs}
            onClose={() => setViewingMachineHistory(null)}
            onOpenCustomer={openCustomerDetail}
            themeColor={color}
          />
        )}
        {viewingCustomerDetail && (
          <CustomerDetailModal
            customerName={viewingCustomerDetail}
            machines={machines}
            onClose={() => setViewingCustomerDetail(null)}
            onOpenMachine={openMachineDetail}
            themeColor={color}
          />
        )}

        {isMobileView && (
          <nav className="fixed bottom-5 left-4 right-4 p-2 flex justify-around z-50 rounded-[2rem] glass-effect shadow-2xl shadow-slate-300/60 border border-white/50">
            <NavButton
              icon={PlusCircle}
              label="Nuovo"
              active={activeTab === "new"}
              onClick={() => setActiveTab("new")}
              color={color}
            />
            <NavButton
              icon={History}
              label="Storico"
              active={activeTab === "history"}
              onClick={() => setActiveTab("history")}
              color={color}
            />
            <NavButton
              icon={Settings}
              label="Admin"
              active={activeTab === "admin"}
              onClick={handleAdminAccess}
              color={color}
            />
          </nav>
        )}

        {showAdminLogin && (
          <AdminLoginModal
            onSuccess={() => {
              setIsAdminAuthenticated(true);
              setShowAdminLogin(false);
              if (activeTab === "admin") setActiveTab("admin");
            }}
            onCancel={() => setShowAdminLogin(false)}
            color={color}
          />
        )}
      </div>
    </>
  );
}
