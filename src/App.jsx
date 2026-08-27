import React, { useState, useEffect, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Dumbbell, Flame, TrendingUp, Utensils, Target, Award, Plus, Check, Calendar,
  Trash2, Droplet, Footprints, Settings2, Search, Bot, MessageSquare
} from "lucide-react";

const C = {
  bg: "#17181A",
  surface: "#212220",
  surfaceLight: "#2A2B27",
  border: "#3A3B36",
  text: "#F2EEE3",
  muted: "#9C978A",
  turmeric: "#F0A202",
  turmericDark: "#C97F00",
  rust: "#C1440E",
  olive: "#7A9B4A",
  water: "#3B82F6",
};

const inputStyle = {
  backgroundColor: C.surfaceLight,
  border: `1px solid ${C.border}`,
  color: C.text,
};

const todayStr = () => new Date().toISOString().slice(0, 10);

// Built-in Indian Food Database
const INDIAN_FOOD_DATABASE = [
  { name: "Roti (Whole Wheat)", unit: "1 roti (30g)", cal: 80, protein: 3, carbs: 15, fat: 0.5 },
  { name: "Paneer (Raw)", unit: "100g", cal: 265, protein: 18, carbs: 6, fat: 20 },
  { name: "Boiled Egg", unit: "1 whole", cal: 78, protein: 6, carbs: 0.6, fat: 5 },
  { name: "Egg White", unit: "1 egg white", cal: 17, protein: 3.6, carbs: 0.2, fat: 0.1 },
  { name: "Chicken Breast (Cooked)", unit: "100g", cal: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: "Whey Protein", unit: "1 scoop (30g)", cal: 120, protein: 24, carbs: 2, fat: 1.5 },
  { name: "Cooked Toor Dal", unit: "1 bowl (150g)", cal: 150, protein: 8, carbs: 22, fat: 3 },
  { name: "Curd / Dahi", unit: "1 bowl (150g)", cal: 100, protein: 5, carbs: 6, fat: 5 },
  { name: "Cooked White Rice", unit: "1 bowl (150g)", cal: 195, protein: 4, carbs: 44, fat: 0.5 },
  { name: "Oats (Raw)", unit: "50g", cal: 190, protein: 6.5, carbs: 33, fat: 3.5 },
  { name: "Milk (Full Cream)", unit: "1 glass (250ml)", cal: 150, protein: 8, carbs: 12, fat: 8 },
  { name: "Peanut Butter", unit: "1 tbsp (16g)", cal: 95, protein: 4, carbs: 3, fat: 8 },
  { name: "Banana", unit: "1 medium", cal: 105, protein: 1.3, carbs: 27, fat: 0.3 },
  { name: "Almonds", unit: "10 pieces", cal: 70, protein: 2.5, carbs: 2, fat: 6 },
  { name: "Soya Chunks (Raw)", unit: "50g", cal: 170, protein: 26, carbs: 16, fat: 0.5 },
];

const ACTIVITY_OPTIONS = [
  { id: "sedentary", label: "Sedentary", desc: "Desk job, kam movement", mult: 1.2 },
  { id: "light", label: "Light Active", desc: "Hafte mein 1-3 din exercise", mult: 1.375 },
  { id: "moderate", label: "Moderate", desc: "Hafte mein 3-5 din gym", mult: 1.55 },
  { id: "active", label: "Very Active", desc: "Roz gym + physical kaam", mult: 1.725 },
];

const GOAL_OPTIONS = [
  { id: "fatloss", label: "Fat Loss", desc: "Wajan kam karna hai", cal: 0.8, protein: 2.2 },
  { id: "musclegain", label: "Muscle Gain", desc: "Body banani hai", cal: 1.15, protein: 1.8 },
  { id: "maintain", label: "Maintain", desc: "Fit rehna hai", cal: 1.0, protein: 1.6 },
];

const DIET_OPTIONS = [
  { id: "veg", label: "Vegetarian" },
  { id: "eggetarian", label: "Eggetarian" },
  { id: "nonveg", label: "Non-Veg" },
];

const DIET_PLANS = {
  veg: [
    { meal: "Subah Uthte Hi", items: [["Bhige almonds (5-6)", 3], ["1 glass doodh (250ml)", 8]] },
    { meal: "Breakfast", items: [["Moong dal chilla (2)", 12], ["Paneer bhurji (50g)", 9]] },
    { meal: "Mid-Morning", items: [["Sprouts chaat (1 bowl)", 9], ["Roasted chana (1 mutthi)", 7]] },
    { meal: "Lunch", items: [["2 roti", 6], ["Dal (1 bowl)", 9], ["Sabzi + curd", 6]] },
    { meal: "Pre-Workout", items: [["Kela + peanut butter (1 tbsp)", 4]] },
    { meal: "Post-Workout", items: [["Whey protein shake (1 scoop)", 24]] },
    { meal: "Dinner", items: [["2 roti", 6], ["Rajma / Chole (1 bowl)", 10], ["Salad", 1]] },
  ],
  eggetarian: [
    { meal: "Subah Uthte Hi", items: [["3 ande (boiled/bhurji)", 18]] },
    { meal: "Breakfast", items: [["2 roti", 6], ["Paneer sabzi (50g)", 9]] },
    { meal: "Mid-Morning", items: [["1 glass doodh", 8], ["Roasted chana", 7]] },
    { meal: "Lunch", items: [["2 roti", 6], ["Dal (1 bowl)", 9], ["Sabzi + curd", 6]] },
    { meal: "Pre-Workout", items: [["Kela + 2 boiled ande", 12]] },
    { meal: "Post-Workout", items: [["Whey protein shake", 24]] },
    { meal: "Dinner", items: [["2 roti", 6], ["Soya chunks sabzi", 14]] },
  ],
  nonveg: [
    { meal: "Subah Uthte Hi", items: [["3 ande (boiled/bhurji)", 18]] },
    { meal: "Breakfast", items: [["2 roti", 6], ["Chicken breast (100g)", 31]] },
    { meal: "Mid-Morning", items: [["Curd / Dahi (1 bowl)", 7], ["Almonds", 3]] },
    { meal: "Lunch", items: [["2 roti", 6], ["Chicken/Fish curry (100g)", 25], ["Dal (½ bowl)", 5]] },
    { meal: "Pre-Workout", items: [["Kela + peanut butter", 4]] },
    { meal: "Post-Workout", items: [["Whey protein shake", 24]] },
    { meal: "Dinner", items: [["2 roti", 6], ["Grilled chicken/fish (100g)", 28]] },
  ],
};

const WORKOUT_PLAN = {
  day1: {
    title: "Day 1 — Push",
    sub: "Chest, Shoulders, Triceps",
    exercises: [
      { name: "Push-ups / Bench Press", sets: 3, reps: "10", rest: "60s", tip: "Elbows 45° pe rakho, chest se push karo." },
      { name: "Dumbbell Shoulder Press", sets: 3, reps: "10", rest: "60s", tip: "Halka wazan se shuru karo, core tight rakho." },
      { name: "Incline Push-ups / Press", sets: 3, reps: "10", rest: "60s", tip: "Upar chest target hoga — slow karo." },
      { name: "Tricep Dips (bench)", sets: 3, reps: "12", rest: "45s", tip: "Kohniyan body ke paas rakho." },
      { name: "Plank", sets: 3, reps: "30 sec", rest: "45s", tip: "Pet andar kheecho, kamar seedhi rakho." },
    ],
  },
  day2: {
    title: "Day 2 — Pull",
    sub: "Back, Biceps",
    exercises: [
      { name: "Lat Pulldown / Assisted Pull-up", sets: 3, reps: "10", rest: "60s", tip: "Chest thoda upar, kohni se kheecho." },
      { name: "Dumbbell / Cable Row", sets: 3, reps: "10", rest: "60s", tip: "Back seedha, jhatka mat maro." },
      { name: "Face Pulls", sets: 3, reps: "12", rest: "45s", tip: "Shoulder health ke liye zaroori hai." },
      { name: "Bicep Curls", sets: 3, reps: "12", rest: "45s", tip: "Kohni fix rakho, sirf forearm move ho." },
      { name: "Bicycle Crunches", sets: 3, reps: "15 / side", rest: "45s", tip: "Slow aur controlled, speed nahi chahiye." },
    ],
  },
  day3: {
    title: "Day 3 — Legs & Core",
    sub: "Quads, Hamstrings, Core",
    exercises: [
      { name: "Bodyweight / Barbell Squats", sets: 3, reps: "12", rest: "90s", tip: "Ghutne toes ki direction mein, back straight." },
      { name: "Lunges", sets: 3, reps: "10 / leg", rest: "60s", tip: "Balance pe focus karo." },
      { name: "Leg Press / Leg Extension", sets: 3, reps: "12", rest: "60s", tip: "Poori range of motion use karo." },
      { name: "Leg Curl", sets: 3, reps: "12", rest: "60s", tip: "Neeche lane mein control rakho (slow negative)." },
      { name: "Side Plank", sets: 3, reps: "20 sec / side", rest: "45s", tip: "Hips upar rakho, sagne mat do." },
    ],
  },
};

const PROTEIN_QUICK_ADD = [
  { label: "+ Whey Shake", grams: 24 },
  { label: "+ Ande (2)", grams: 12 },
  { label: "+ Paneer/Chicken", grams: 25 },
  { label: "+ Dal/Roti meal", grams: 15 },
];

function Pill({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl px-3 py-2 text-sm font-body text-left transition-all"
      style={{
        backgroundColor: active ? "rgba(240,162,2,0.12)" : C.surfaceLight,
        border: `1.5px solid ${active ? C.turmeric : C.border}`,
        color: active ? C.turmeric : C.text,
      }}
    >
      {children}
    </button>
  );
}

function StatCard({ label, value, unit, icon: Icon, accent }) {
  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-3"
      style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
    >
      <div className="flex items-center gap-2" style={{ color: C.muted }}>
        <Icon size={15} />
        <span className="text-xs font-body uppercase tracking-wide">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="font-display text-4xl leading-none" style={{ color: accent || C.text }}>
          {value}
        </span>
        <span className="font-mono text-xs" style={{ color: C.muted }}>{unit}</span>
      </div>
    </div>
  );
}

function ShakerDial({ percent, grams, target }) {
  const clamped = Math.min(Math.max(percent, 0), 100);
  const fillHeight = 150 * (clamped / 100);
  const fillY = 30 + (150 - fillHeight);
  return (
    <svg viewBox="0 0 120 210" className="w-32 h-56 mx-auto">
      <defs>
        <linearGradient id="liquidGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.turmeric} />
          <stop offset="100%" stopColor={C.turmericDark} />
        </linearGradient>
        <clipPath id="shakerClip">
          <rect x="20" y="30" width="80" height="150" rx="14" />
        </clipPath>
      </defs>
      <rect x="35" y="8" width="50" height="24" rx="6" fill={C.surfaceLight} stroke={C.border} strokeWidth="2" />
      <rect x="20" y="30" width="80" height="150" rx="14" fill={C.surface} stroke={C.border} strokeWidth="2" />
      <rect
        x="20" y={fillY} width="80" height={fillHeight}
        fill="url(#liquidGrad)" clipPath="url(#shakerClip)"
        style={{ transition: "y 0.7s ease, height 0.7s ease" }}
      />
      {[0.25, 0.5, 0.75].map((t, i) => (
        <line key={i} x1="20" y1={30 + 150 * (1 - t)} x2="30" y2={30 + 150 * (1 - t)} stroke={C.muted} strokeWidth="1.5" />
      ))}
      <text x="60" y="182" textAnchor="middle" className="font-display" fontSize="19" fill={C.text}>
        {grams}g
      </text>
      <text x="60" y="197" textAnchor="middle" fontSize="9" fill={C.muted} className="font-mono">
        / {target}g target
      </text>
    </svg>
  );
}

function ProfileForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(
    initial || {
      name: "", age: "", gender: "male", heightFeet: "", heightInches: "", weight: "",
      activity: "moderate", goal: "musclegain", dietPref: "veg",
    }
  );
  const [error, setError] = useState("");
  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  function submit(e) {
    e.preventDefault();
    const missing = [];
    if (!form.age || Number(form.age) <= 0) missing.push("Umar");
    if (!form.heightFeet || Number(form.heightFeet) <= 0) missing.push("Height (Feet)");
    if (!form.weight || Number(form.weight) <= 0) missing.push("Weight");
    if (missing.length) {
      setError(`Ye fields bharo: ${missing.join(", ")}`);
      return;
    }
    setError("");
    onSave({
      ...form,
      age: Number(form.age),
      heightFeet: Number(form.heightFeet),
      heightInches: Number(form.heightInches || 0),
      weight: Number(form.weight)
    });
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5 w-full max-w-md">
      <div>
        <label className="text-xs font-body uppercase tracking-wide" style={{ color: C.muted }}>Name (optional)</label>
        <input
          type="text" value={form.name} onChange={(e) => update("name", e.target.value)}
          placeholder="Your Name"
          className="w-full rounded-xl px-3 py-2.5 mt-1 font-body outline-none"
          style={inputStyle}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-body uppercase tracking-wide" style={{ color: C.muted }}>Age</label>
          <input
            type="number" value={form.age} onChange={(e) => update("age", e.target.value)}
            placeholder="22" className="w-full rounded-xl px-3 py-2.5 mt-1 font-mono outline-none" style={inputStyle}
          />
        </div>
        <div>
          <label className="text-xs font-body uppercase tracking-wide" style={{ color: C.muted }}>Weight (kg)</label>
          <input
            type="number" value={form.weight} onChange={(e) => update("weight", e.target.value)}
            placeholder="68" className="w-full rounded-xl px-3 py-2.5 mt-1 font-mono outline-none" style={inputStyle}
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-body uppercase tracking-wide" style={{ color: C.muted }}>Height (Feet & Inches)</label>
        <div className="grid grid-cols-2 gap-3 mt-1">
          <input
            type="number" value={form.heightFeet} onChange={(e) => update("heightFeet", e.target.value)}
            placeholder="5 Feet" className="w-full rounded-xl px-3 py-2.5 font-mono outline-none" style={inputStyle}
          />
          <input
            type="number" value={form.heightInches} onChange={(e) => update("heightInches", e.target.value)}
            placeholder="8 Inches" className="w-full rounded-xl px-3 py-2.5 font-mono outline-none" style={inputStyle}
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-body uppercase tracking-wide" style={{ color: C.muted }}>Gender</label>
        <div className="grid grid-cols-2 gap-2 mt-1">
          {["male", "female"].map((g) => (
            <Pill key={g} active={form.gender === g} onClick={() => update("gender", g)}>
              <span className="capitalize">{g}</span>
            </Pill>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-body uppercase tracking-wide" style={{ color: C.muted }}>Activity Level</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
          {ACTIVITY_OPTIONS.map((a) => (
            <Pill key={a.id} active={form.activity === a.id} onClick={() => update("activity", a.id)}>
              <div className="font-semibold">{a.label}</div>
              <div className="text-xs opacity-70">{a.desc}</div>
            </Pill>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-body uppercase tracking-wide" style={{ color: C.muted }}>Goal</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
          {GOAL_OPTIONS.map((g) => (
            <Pill key={g.id} active={form.goal === g.id} onClick={() => update("goal", g.id)}>
              <div className="font-semibold">{g.label}</div>
              <div className="text-xs opacity-70">{g.desc}</div>
            </Pill>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-body uppercase tracking-wide" style={{ color: C.muted }}>Diet Type</label>
        <div className="grid grid-cols-3 gap-2 mt-1">
          {DIET_OPTIONS.map((d) => (
            <Pill key={d.id} active={form.dietPref === d.id} onClick={() => update("dietPref", d.id)}>
              <span className="font-semibold">{d.label}</span>
            </Pill>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-sm font-semibold -mt-1" style={{ color: C.rust }}>{error}</p>
      )}

      <div className="flex gap-3 pt-1">
        {onCancel && (
          <button
            type="button" onClick={onCancel}
            className="flex-1 rounded-xl py-3 font-body font-semibold"
            style={{ backgroundColor: C.surfaceLight, color: C.text, border: `1px solid ${C.border}` }}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="flex-1 rounded-xl py-3 font-body font-bold"
          style={{ backgroundColor: C.turmeric, color: "#1A1400" }}
        >
          {initial ? "Save Changes" : "Shuru Karo"}
        </button>
      </div>
    </form>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [logs, setLogs] = useState({ weightLogs: [], proteinLogs: [], workoutLogs: [], waterLogs: [], stepLogs: [] });
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editing, setEditing] = useState(false);
  const [activeDay, setActiveDay] = useState("day1");
  const [weightInput, setWeightInput] = useState("");
  const [customProtein, setCustomProtein] = useState("");
  const [stepInput, setStepInput] = useState("");

  // Search & Bot States
  const [searchQuery, setSearchQuery] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { sender: "bot", text: "Yo! Main Apka Gym Buddy Bot hoon. Koi bhi food item ya workout doubt yahan pucho!" }
  ]);
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    try {
      const p = localStorage.getItem("gym_freak_profile");
      if (p) setProfile(JSON.parse(p));
      const l = localStorage.getItem("gym_freak_logs");
      if (l) setLogs(JSON.parse(l));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, []);

  function saveProfile(newProfile) {
    setProfile(newProfile);
    setEditing(false);
    setActiveTab("dashboard");
    try {
      localStorage.setItem("gym_freak_profile", JSON.stringify(newProfile));
    } catch (e) {}
  }

  function persistLogs(newLogs) {
    setLogs(newLogs);
    try {
      localStorage.setItem("gym_freak_logs", JSON.stringify(newLogs));
    } catch (e) {}
  }

  function addProtein(grams) {
    if (!grams || grams <= 0) return;
    const entry = { date: todayStr(), grams, id: Date.now() };
    persistLogs({ ...logs, proteinLogs: [...(logs.proteinLogs || []), entry] });
  }

  function toggleWaterGlass(glassIndex) {
    const today = todayStr();
    const todayEntry = (logs.waterLogs || []).find((l) => l.date === today) || { date: today, count: 0 };
    let newCount = glassIndex + 1;
    if (todayEntry.count === newCount) newCount -= 1;

    const updated = [
      ...(logs.waterLogs || []).filter((l) => l.date !== today),
      { date: today, count: newCount }
    ];
    persistLogs({ ...logs, waterLogs: updated });
  }

  function addSteps() {
    const val = Number(stepInput);
    if (!val || val <= 0) return;
    const today = todayStr();
    const updated = [
      ...(logs.stepLogs || []).filter((l) => l.date !== today),
      { date: today, steps: val }
    ];
    persistLogs({ ...logs, stepLogs: updated });
    setStepInput("");
  }

  function addWeightLog() {
    const val = Number(weightInput);
    if (!val || val <= 0) return;
    const entry = { date: todayStr(), weight: val, id: Date.now() };
    const updated = [...(logs.weightLogs || []).filter((l) => l.date !== todayStr()), entry].sort((a, b) => a.date.localeCompare(b.date));
    persistLogs({ ...logs, weightLogs: updated });
    setWeightInput("");
  }

  function deleteWeightLog(id) {
    persistLogs({ ...logs, weightLogs: logs.weightLogs.filter((l) => l.id !== id) });
  }

  function toggleWorkoutDone() {
    const today = todayStr();
    const has = (logs.workoutLogs || []).includes(today);
    const updated = has ? logs.workoutLogs.filter((d) => d !== today) : [...(logs.workoutLogs || []), today];
    persistLogs({ ...logs, workoutLogs: updated });
  }

  function resetAll() {
    try {
      localStorage.removeItem("gym_freak_profile");
      localStorage.removeItem("gym_freak_logs");
    } catch (e) {}
    setProfile(null);
    setLogs({ weightLogs: [], proteinLogs: [], workoutLogs: [], waterLogs: [], stepLogs: [] });
    setEditing(false);
  }

  const stats = useMemo(() => {
    if (!profile) return null;
    const { age, gender, heightFeet, heightInches, weight, activity, goal } = profile;
    
    const totalInches = (Number(heightFeet) * 12) + Number(heightInches || 0);
    const heightInCm = totalInches * 2.54;

    const bmr = gender === "male"
      ? 10 * weight + 6.25 * heightInCm - 5 * age + 5
      : 10 * weight + 6.25 * heightInCm - 5 * age - 161;
    const activityMult = ACTIVITY_OPTIONS.find((a) => a.id === activity)?.mult || 1.375;
    const tdee = bmr * activityMult;
    const goalCfg = GOAL_OPTIONS.find((g) => g.id === goal) || GOAL_OPTIONS[2];
    const calorieTarget = tdee * goalCfg.cal;
    const proteinTarget = Math.round(weight * goalCfg.protein);
    
    const waterTargetLiters = ((weight * 35) / 1000).toFixed(1);
    const waterTargetGlasses = Math.round((weight * 35) / 250);

    let stepTarget = 8000;
    if (goal === "fatloss") stepTarget = Math.max(10000, Math.round(weight * 130));
    else if (goal === "musclegain") stepTarget = 8000;

    const bmi = weight / ((heightInCm / 100) ** 2);
    let bmiCategory = "Normal", bmiColor = C.olive;
    if (bmi < 18.5) { bmiCategory = "Underweight"; bmiColor = C.turmeric; }
    else if (bmi >= 25 && bmi < 30) { bmiCategory = "Overweight"; bmiColor = C.turmeric; }
    else if (bmi >= 30) { bmiCategory = "Obese"; bmiColor = C.rust; }
    
    return {
      bmr: Math.round(bmr), tdee: Math.round(tdee), calorieTarget: Math.round(calorieTarget),
      proteinTarget, bmi: bmi.toFixed(1), bmiCategory, bmiColor,
      waterTargetLiters, waterTargetGlasses, stepTarget
    };
  }, [profile]);

  const todayProtein = useMemo(() => {
    return (logs.proteinLogs || []).filter((l) => l.date === todayStr()).reduce((s, l) => s + l.grams, 0);
  }, [logs.proteinLogs]);

  const todayWaterCount = useMemo(() => {
    const entry = (logs.waterLogs || []).find((l) => l.date === todayStr());
    return entry ? entry.count : 0;
  }, [logs.waterLogs]);

  const todaySteps = useMemo(() => {
    const entry = (logs.stepLogs || []).find((l) => l.date === todayStr());
    return entry ? entry.steps : 0;
  }, [logs.stepLogs]);

  const streak = useMemo(() => {
    const set = new Set(logs.workoutLogs || []);
    if (set.size === 0) return 0;
    let cursor = new Date();
    let ds = cursor.toISOString().slice(0, 10);
    if (!set.has(ds)) {
      cursor.setDate(cursor.getDate() - 1);
      ds = cursor.toISOString().slice(0, 10);
      if (!set.has(ds)) return 0;
    }
    let count = 0;
    while (set.has(cursor.toISOString().slice(0, 10))) {
      count++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return count;
  }, [logs.workoutLogs]);

  const weightChartData = useMemo(() => {
    return [...(logs.weightLogs || [])]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((l) => ({ date: l.date.slice(5), weight: l.weight }));
  }, [logs.weightLogs]);

  const filteredFoods = useMemo(() => {
    if (!searchQuery.trim()) return INDIAN_FOOD_DATABASE;
    return INDIAN_FOOD_DATABASE.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  function handleSendMessage() {
    if (!chatInput.trim()) return;
    const userText = chatInput;
    const newMsgs = [...chatMessages, { sender: "user", text: userText }];
    setChatMessages(newMsgs);
    setChatInput("");

    setTimeout(() => {
      let botResponse = "Main samjhaa nahi. Aap calories, protein, workout plan, ya paani ke bare me puch sakte ho!";
      const q = userText.toLowerCase();

      if (q.includes("roti") || q.includes("chapati")) {
        botResponse = "1 Normal Wheat Roti me lagbhag 80 Calories, 3g Protein, 15g Carbs, aur 0.5g Fat hota hai.";
      } else if (q.includes("paneer")) {
        botResponse = "100g Raw Paneer me lagbhag 265 Calories aur 18g High-Quality Protein milta hai.";
      } else if (q.includes("egg") || q.includes("anda")) {
        botResponse = "1 Boiled Whole Egg = 78 Cal, 6g Protein. 1 Egg White = 17 Cal, 3.6g Protein.";
      } else if (q.includes("chicken")) {
        botResponse = "100g Cooked Chicken Breast me lagbhag 165 Calories aur 31g Protein hota hai (fat kam hota hai).";
      } else if (q.includes("aaj") && q.includes("workout")) {
        botResponse = "Aap Workout Tab kholkar aaj ka Push, Pull ya Leg split dekh sakte ho. Form aur Controlled movement par dhyan do!";
      } else if (q.includes("water") || q.includes("paani")) {
        botResponse = `Tere weight (${profile?.weight}kg) ke hisaab se tujhe lagbhag ${stats?.waterTargetLiters} Liters paani roz peena chahiye.`;
      } else if (q.includes("fat loss") || q.includes("wajan kam")) {
        botResponse = `Tere fat loss ke liye Daily Calorie Target: ${stats?.calorieTarget} kcal aur Protein: ${stats?.proteinTarget}g hai. Daily Steps poore karo!`;
      }

      setChatMessages([...newMsgs, { sender: "bot", text: botResponse }]);
    }, 400);
  }

  const fontStyle = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Anton&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
      .font-display { font-family: 'Anton', sans-serif; letter-spacing: 0.01em; }
      .font-body { font-family: 'IBM Plex Sans', sans-serif; }
      .font-mono { font-family: 'IBM Plex Mono', monospace; }
    `}</style>
  );

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center" style={{ backgroundColor: C.bg }}>
        {fontStyle}
        <div className="font-display text-xl animate-pulse" style={{ color: C.turmeric }}>
          Data load ho raha hai...
        </div>
      </div>
    );
  }

  if (!profile || editing) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center px-4 py-10" style={{ backgroundColor: C.bg }}>
        {fontStyle}
        <div className="flex items-center gap-2 mb-1">
          <Dumbbell size={26} style={{ color: C.turmeric }} />
          <span className="font-display text-3xl" style={{ color: C.text }}>GYM F.R.E.A.K</span>
        </div>
        <p className="font-body text-sm mb-8" style={{ color: C.muted }}>Beginner se Beast tak.</p>
        <div className="w-full max-w-md mb-6">
          <h2 className="font-display text-xl" style={{ color: C.text }}>
            {editing ? "Profile Update Karo" : "Chalo Shuru Karte Hain"}
          </h2>
          <p className="font-body text-sm mt-1" style={{ color: C.muted }}>
            Apni details bharo, hum tera calorie aur protein target nikal denge.
          </p>
        </div>
        <ProfileForm
          initial={editing ? profile : null}
          onSave={saveProfile}
          onCancel={editing ? () => setEditing(false) : null}
        />
      </div>
    );
  }

  const dietPlan = DIET_PLANS[profile.dietPref] || DIET_PLANS.veg;
  const dietTotal = dietPlan.flatMap((m) => m.items).reduce((s, [, g]) => s + g, 0);
  const day = WORKOUT_PLAN[activeDay];
  const workoutDoneToday = (logs.workoutLogs || []).includes(todayStr());

  const NAV = [
    { id: "dashboard", label: "Dashboard", icon: Target },
    { id: "search", label: "Food Search", icon: Search },
    { id: "bot", label: "Gym Buddy", icon: Bot },
    { id: "diet", label: "Diet", icon: Utensils },
    { id: "workout", label: "Workout", icon: Dumbbell },
    { id: "progress", label: "Progress", icon: TrendingUp },
  ];

  return (
    <div className="w-full min-h-screen font-body" style={{ backgroundColor: C.bg, color: C.text }}>
      {fontStyle}

      {/* Header */}
      <div className="px-4 pt-6 pb-4 flex items-center justify-between max-w-3xl mx-auto">
        <div>
          <div className="flex items-center gap-2">
            <Dumbbell size={20} style={{ color: C.turmeric }} />
            <span className="font-display text-xl">GYM F.R.E.A.K</span>
          </div>
          <p className="text-sm mt-0.5" style={{ color: C.muted }}>
            Namaste{profile.name ? `, ${profile.name}` : ""}! ({profile.heightFeet}'{profile.heightInches || 0}" • {profile.weight}kg)
          </p>
        </div>
        <button
          onClick={() => setEditing(true)}
          className="rounded-full p-2.5"
          style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
          aria-label="Edit profile"
        >
          <Settings2 size={18} style={{ color: C.muted }} />
        </button>
      </div>

      {/* Nav tabs */}
      <div className="px-4 max-w-3xl mx-auto">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
          {NAV.map((n) => {
            const Icon = n.icon;
            const active = activeTab === n.id;
            return (
              <button
                key={n.id}
                onClick={() => setActiveTab(n.id)}
                className="flex flex-col items-center gap-1 rounded-xl py-2.5 transition-all"
                style={{
                  backgroundColor: active ? "rgba(240,162,2,0.12)" : "transparent",
                  border: `1px solid ${active ? C.turmeric : C.border}`,
                }}
              >
                <Icon size={17} style={{ color: active ? C.turmeric : C.muted }} />
                <span className="text-xs" style={{ color: active ? C.turmeric : C.muted }}>{n.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 max-w-3xl mx-auto pb-16">
        {/* ---------------- DASHBOARD ---------------- */}
        {activeTab === "dashboard" && stats && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="BMR" value={stats.bmr} unit="kcal" icon={Flame} />
              <StatCard label="TDEE" value={stats.tdee} unit="kcal" icon={Flame} />
              <StatCard label="Calorie Target" value={stats.calorieTarget} unit="kcal" icon={Target} accent={C.turmeric} />
              <StatCard label="Protein Target" value={stats.proteinTarget} unit="g/din" icon={Award} accent={C.turmeric} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded-2xl p-4 flex items-center justify-between" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}>
                <div>
                  <div className="text-xs uppercase tracking-wide" style={{ color: C.muted }}>BMI</div>
                  <div className="font-display text-3xl mt-1">{stats.bmi}</div>
                </div>
                <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: `${stats.bmiColor}22`, color: stats.bmiColor }}>
                  {stats.bmiCategory}
                </span>
              </div>
              <div className="rounded-2xl p-4 flex items-center justify-between" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}>
                <div>
                  <div className="text-xs uppercase tracking-wide" style={{ color: C.muted }}>Workout Streak</div>
                  <div className="font-display text-3xl mt-1">{streak} din</div>
                </div>
                <Flame size={28} style={{ color: streak > 0 ? C.turmeric : C.muted }} />
              </div>
            </div>

            {/* Step Counter Tracker */}
            <div className="rounded-2xl p-5" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Footprints size={18} style={{ color: C.turmeric }} />
                  <span className="font-display text-lg">Daily Step Counter</span>
                </div>
                <span className="text-xs font-mono" style={{ color: C.muted }}>
                  Target: {stats.stepTarget} steps
                </span>
              </div>
              
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-display text-3xl" style={{ color: C.turmeric }}>
                  {todaySteps.toLocaleString()}
                </span>
                <span className="text-xs font-mono" style={{ color: C.muted }}>
                  / {stats.stepTarget.toLocaleString()} steps ({Math.min(100, Math.round((todaySteps / stats.stepTarget) * 100))}%)
                </span>
              </div>

              <div className="w-full bg-slate-800 rounded-full h-3 mb-4 overflow-hidden border border-slate-700">
                <div 
                  className="h-full rounded-full transition-all duration-500" 
                  style={{ 
                    width: `${Math.min(100, (todaySteps / stats.stepTarget) * 100)}%`,
                    backgroundColor: C.turmeric
                  }}
                />
              </div>

              <div className="flex gap-2 max-w-xs">
                <input
                  type="number" value={stepInput} onChange={(e) => setStepInput(e.target.value)}
                  placeholder="Steps log karo (e.g. 5000)"
                  className="flex-1 rounded-xl px-3 py-2 text-sm font-mono outline-none"
                  style={inputStyle}
                />
                <button
                  onClick={addSteps}
                  className="rounded-xl px-4 py-2 text-sm font-bold"
                  style={{ backgroundColor: C.turmeric, color: "#1A1400" }}
                >
                  Log Steps
                </button>
              </div>
            </div>

            {/* Water Tracker */}
            <div className="rounded-2xl p-5" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Droplet size={18} style={{ color: C.water }} />
                  <span className="font-display text-lg">Daily Water Intake</span>
                </div>
                <span className="text-xs font-mono" style={{ color: C.muted }}>
                  Target: ~{stats.waterTargetLiters} L ({stats.waterTargetGlasses} Glasses)
                </span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 my-4">
                {Array.from({ length: 8 }).map((_, idx) => {
                  const filled = idx < todayWaterCount;
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleWaterGlass(idx)}
                      className="flex flex-col items-center justify-center p-3 rounded-xl transition-all border"
                      style={{
                        backgroundColor: filled ? "rgba(59, 130, 246, 0.15)" : C.surfaceLight,
                        borderColor: filled ? C.water : C.border,
                        color: filled ? C.water : C.muted,
                      }}
                    >
                      <Droplet size={22} fill={filled ? C.water : "none"} />
                      <span className="text-[10px] font-mono mt-1">250ml</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-center font-mono" style={{ color: C.muted }}>
                Aaj total: {todayWaterCount * 250} ml / {(todayWaterCount * 0.25).toFixed(2)} Liters
              </p>
            </div>

            {/* Protein Shaker Tracker */}
            <div className="rounded-2xl p-5" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}>
              <div className="text-center text-xs uppercase tracking-wide mb-2" style={{ color: C.muted }}>Aaj ka Protein</div>
              <ShakerDial percent={(todayProtein / stats.proteinTarget) * 100} grams={todayProtein} target={stats.proteinTarget} />
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {PROTEIN_QUICK_ADD.map((q) => (
                  <button
                    key={q.label}
                    onClick={() => addProtein(q.grams)}
                    className="rounded-full px-3 py-1.5 text-xs font-semibold flex items-center gap-1"
                    style={{ backgroundColor: C.surfaceLight, border: `1px solid ${C.border}`, color: C.text }}
                  >
                    <Plus size={12} style={{ color: C.turmeric }} /> {q.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-3 max-w-xs mx-auto">
                <input
                  type="number" value={customProtein} onChange={(e) => setCustomProtein(e.target.value)}
                  placeholder="Custom grams"
                  className="flex-1 rounded-xl px-3 py-2 text-sm font-mono outline-none"
                  style={inputStyle}
                />
                <button
                  onClick={() => { addProtein(Number(customProtein)); setCustomProtein(""); }}
                  className="rounded-xl px-4 py-2 text-sm font-bold"
                  style={{ backgroundColor: C.turmeric, color: "#1A1400" }}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- FOOD SEARCH ---------------- */}
        {activeTab === "search" && (
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-2xl">Calorie & Food Search</h2>
            <div className="relative">
              <Search className="absolute left-3 top-3.5" size={18} style={{ color: C.muted }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Khane ka naam khojo (e.g. Roti, Paneer, Egg)..."
                className="w-full rounded-xl pl-10 pr-3 py-3 text-sm outline-none"
                style={inputStyle}
              />
            </div>

            <div className="flex flex-col gap-2">
              {filteredFoods.map((item) => (
                <div key={item.name} className="p-4 rounded-xl flex items-center justify-between" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}>
                  <div>
                    <div className="font-semibold text-sm">{item.name}</div>
                    <div className="text-xs" style={{ color: C.muted }}>{item.unit} • {item.cal} Cal</div>
                    <div className="text-xs font-mono mt-1" style={{ color: C.turmeric }}>
                      P: {item.protein}g | C: {item.carbs}g | F: {item.fat}g
                    </div>
                  </div>
                  <button
                    onClick={() => addProtein(item.protein)}
                    className="p-2.5 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0"
                    style={{ backgroundColor: C.turmeric, color: "#1A1400" }}
                  >
                    <Plus size={14} /> Add Protein
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- GYM BUDDY BOT ---------------- */}
        {activeTab === "bot" && (
          <div className="flex flex-col h-[65vh] rounded-2xl p-4 justify-between" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}>
            <div className="flex items-center gap-2 pb-3 border-b" style={{ borderColor: C.border }}>
              <Bot size={22} style={{ color: C.turmeric }} />
              <div>
                <span className="font-display text-lg">GYM F.R.E.A.K Gym Buddy</span>
                <div className="text-[10px]" style={{ color: C.muted }}>Ask calories, protein or workout tips</div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto my-3 flex flex-col gap-2 pr-1">
              {chatMessages.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl max-w-[85%] text-sm ${m.sender === "user" ? "self-end" : "self-start"}`}
                  style={{
                    backgroundColor: m.sender === "user" ? C.turmeric : C.surfaceLight,
                    color: m.sender === "user" ? "#1A1400" : C.text,
                  }}
                >
                  {m.text}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Pucho: 1 roti me kitni calorie hai?..."
                className="flex-1 rounded-xl px-3 py-2.5 text-sm outline-none"
                style={inputStyle}
              />
              <button onClick={handleSendMessage} className="px-4 py-2.5 rounded-xl text-sm font-bold" style={{ backgroundColor: C.turmeric, color: "#1A1400" }}>
                Send
              </button>
            </div>
          </div>
        )}

        {/* ---------------- DIET ---------------- */}
        {activeTab === "diet" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl">Tera Diet Plan</h2>
              <span className="text-xs font-mono rounded-full px-3 py-1" style={{ backgroundColor: C.surfaceLight, color: C.turmeric, border: `1px solid ${C.border}` }}>
                ~{dietTotal}g protein/din
              </span>
            </div>
            <p className="text-sm" style={{ color: C.muted }}>
              {DIET_OPTIONS.find((d) => d.id === profile.dietPref)?.label} plan — apna target {stats?.proteinTarget}g hai, portions ko usi hisaab se ghatao/badhao.
            </p>
            {dietPlan.map((m) => (
              <div key={m.meal} className="rounded-2xl p-4" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}>
                <div className="font-display text-sm mb-2" style={{ color: C.turmeric }}>{m.meal.toUpperCase()}</div>
                <div className="flex flex-col gap-1.5">
                  {m.items.map(([name, grams]) => (
                    <div key={name} className="flex items-center justify-between text-sm">
                      <span>{name}</span>
                      <span className="font-mono" style={{ color: C.muted }}>{grams}g</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ---------------- WORKOUT ---------------- */}
        {activeTab === "workout" && (
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-2xl">Beginner Workout Plan</h2>
            <p className="text-sm" style={{ color: C.muted }}>
              Pehle 2 hafte halka wazan se form practice karo, phir weight badhao. Sets ke beech rest zaroor lo.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {Object.keys(WORKOUT_PLAN).map((d) => (
                <Pill key={d} active={activeDay === d} onClick={() => setActiveDay(d)}>
                  <span className="font-semibold text-sm">{WORKOUT_PLAN[d].title}</span>
                </Pill>
              ))}
            </div>

            <div className="rounded-2xl p-4" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-display text-lg">{day.title}</div>
                  <div className="text-xs" style={{ color: C.muted }}>{day.sub}</div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {day.exercises.map((ex) => (
                  <div key={ex.name} className="rounded-xl p-3" style={{ backgroundColor: C.surfaceLight, border: `1px solid ${C.border}` }}>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">{ex.name}</span>
                      <span className="font-mono text-xs" style={{ color: C.turmeric }}>{ex.sets} × {ex.reps}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs" style={{ color: C.muted }}>{ex.tip}</span>
                      <span className="text-xs font-mono shrink-0 ml-2" style={{ color: C.muted }}>rest {ex.rest}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={toggleWorkoutDone}
              className="rounded-xl py-3 font-bold flex items-center justify-center gap-2"
              style={{
                backgroundColor: workoutDoneToday ? "rgba(122,155,74,0.15)" : C.turmeric,
                color: workoutDoneToday ? C.olive : "#1A1400",
                border: workoutDoneToday ? `1.5px solid ${C.olive}` : "none",
              }}
            >
              <Check size={18} /> {workoutDoneToday ? "Aaj Complete! 🔥" : "Aaj ka Workout Complete Karo"}
            </button>
          </div>
        )}

        {/* ---------------- PROGRESS ---------------- */}
        {activeTab === "progress" && (
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-2xl">Apni Progress Dekho</h2>

            <div className="rounded-2xl p-4 flex gap-3 items-end" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}>
              <div className="flex-1">
                <label className="text-xs uppercase tracking-wide" style={{ color: C.muted }}>Aaj ka Weight (kg)</label>
                <input
                  type="number" value={weightInput} onChange={(e) => setWeightInput(e.target.value)}
                  placeholder={`${profile.weight}`}
                  className="w-full rounded-xl px-3 py-2.5 mt-1 font-mono outline-none" style={inputStyle}
                />
              </div>
              <button
                onClick={addWeightLog}
                className="rounded-xl px-4 py-2.5 font-bold flex items-center gap-1"
                style={{ backgroundColor: C.turmeric, color: "#1A1400" }}
              >
                <Plus size={16} /> Log
              </button>
            </div>

            <div className="rounded-2xl p-4" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}>
              {weightChartData.length === 0 ? (
                <div className="text-center py-10 text-sm" style={{ color: C.muted }}>
                  Abhi tak koi entry nahi hai — apna weight log karo aur trend dekho!
                </div>
              ) : (
                <div style={{ width: "100%", height: 220 }}>
                  <ResponsiveContainer>
                    <LineChart data={weightChartData}>
                      <CartesianGrid stroke={C.border} strokeDasharray="3 3" />
                      <XAxis dataKey="date" stroke={C.muted} fontSize={11} />
                      <YAxis stroke={C.muted} fontSize={11} domain={["auto", "auto"]} />
                      <Tooltip
                        contentStyle={{ backgroundColor: C.surfaceLight, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text }}
                      />
                      <Line type="monotone" dataKey="weight" stroke={C.turmeric} strokeWidth={2.5} dot={{ fill: C.turmeric, r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {(logs.weightLogs || []).length > 0 && (
              <div className="rounded-2xl p-4 flex flex-col gap-2" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}>
                <div className="text-xs uppercase tracking-wide mb-1" style={{ color: C.muted }}>Recent Entries</div>
                {[...(logs.weightLogs || [])].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6).map((l) => (
                  <div key={l.id} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2" style={{ color: C.muted }}>
                      <Calendar size={13} /> {l.date}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono">{l.weight} kg</span>
                      <button onClick={() => deleteWeightLog(l.id)} aria-label="Delete entry">
                        <Trash2 size={14} style={{ color: C.rust }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={resetAll}
              className="text-xs self-center mt-2 underline"
              style={{ color: C.muted }}
            >
              Sara data reset karo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}