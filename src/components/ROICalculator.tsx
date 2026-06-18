import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import { TrendingDown, ShieldAlert, Award, ArrowUpRight, CheckCircle2, DollarSign } from "lucide-react";

export default function ROICalculator() {
  const [jobValue, setJobValue] = useState<number>(4500);
  const [missedCalls, setMissedCalls] = useState<number>(35);
  const [closeRate, setCloseRate] = useState<number>(30);

  // Predefined HVAC project setups
  const presets = [
    { label: "Minor Service & Tuneup", val: 1500 },
    { label: "Commercial RTU Replacement", val: 8500 },
    { label: "Central Chiller Diagnostic", val: 18000 },
  ];

  // Live ROI formulas
  const calculations = useMemo(() => {
    const monthlyMissedLeads = missedCalls;
    const monthlyLostJobs = (monthlyMissedLeads * (closeRate / 100));
    const monthlyLostRevenue = monthlyLostJobs * jobValue;
    const annualLostRevenue = Math.round(monthlyLostRevenue * 12);

    // VocosAI captures 98% of calls and speeds up callback response under 5 mins
    const recoveredCallsWithVoco = Math.round(monthlyMissedLeads * 0.95);
    const recoveredJobsWithVoco = (recoveredCallsWithVoco * (closeRate / 100));
    const recoveredRevenueMonthly = recoveredJobsWithVoco * jobValue;
    const recoveredRevenueAnnual = Math.round(recoveredRevenueMonthly * 12);

    return {
      monthlyLostJobs: monthlyLostJobs.toFixed(1),
      annualLostRevenue,
      recoveredCallsWithVoco,
      recoveredRevenueAnnual,
      monthlyLostRevenue: Math.round(monthlyLostRevenue),
    };
  }, [jobValue, missedCalls, closeRate]);

  return (
    <div id="calculator-section" className="bg-slate-900/95 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
      <div className="bg-slate-950 px-6 py-8 md:p-10 text-white relative overflow-hidden border-b border-slate-850">
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35"></div>
        
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-semibold tracking-wide border border-blue-500/20 uppercase mb-4 font-mono">
            <TrendingDown className="w-3 h-3 animate-pulse" /> Stop the Leakage
          </span>
          <h3 className="text-3xl font-display font-black tracking-tight uppercase leading-none mb-2">
            Missed-Call Leakage Calculator
          </h3>
          <p className="text-slate-400 text-sm md:text-base font-normal leading-relaxed">
            In commercial HVAC, every phone call could represent a major contract. See exactly how much revenue is escaping when your technicians are on are job sites or offices are closed.
          </p>
        </div>
      </div>

      <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10 bg-slate-950/30">
        {/* Left Input Sliders */}
        <div className="lg:col-span-7 space-y-8">
          {/* Preset Buttons */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-3 font-mono">
              Quick HVAC Job Presets
            </label>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setJobValue(preset.val)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                    jobValue === preset.val
                      ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/10"
                      : "bg-slate-900 text-slate-300 border-slate-850 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {preset.label} (${preset.val.toLocaleString()})
                </button>
              ))}
            </div>
          </div>

          <hr className="border-slate-850" />

          {/* Slider 1: Average Job Value */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-300 font-display uppercase tracking-wider text-xs">Average Job Value</span>
              <span className="text-lg font-mono font-bold text-blue-400 bg-slate-950 border border-slate-850 px-3 py-1 rounded-lg">
                ${jobValue.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="30000"
              step="500"
              value={jobValue}
              onChange={(e) => setJobValue(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[11px] text-slate-500 px-1 font-mono">
              <span>$1,000</span>
              <span>$15,000</span>
              <span>$30,000+</span>
            </div>
          </div>

          {/* Slider 2: Missed Calls per Month */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-300 font-display uppercase tracking-wider text-xs font-bold">Estimated Missed Calls / Month</span>
              <span className="text-lg font-mono font-bold text-blue-400 bg-slate-950 border border-slate-850 px-3 py-1 rounded-lg">
                {missedCalls} calls
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="150"
              step="5"
              value={missedCalls}
              onChange={(e) => setMissedCalls(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[11px] text-slate-500 px-1 font-mono">
              <span>5 calls</span>
              <span>75 calls</span>
              <span>150 calls</span>
            </div>
          </div>

          {/* Slider 3: Win / Close Rate */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-300 font-display uppercase tracking-wider text-xs font-bold">Estimate Close Rate (%)</span>
                <span className="text-2xs text-slate-500">Percentage of quoting leads that book</span>
              </div>
              <span className="text-lg font-mono font-bold text-blue-400 bg-slate-950 border border-slate-850 px-3 py-1 rounded-lg">
                {closeRate}%
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="80"
              step="5"
              value={closeRate}
              onChange={(e) => setCloseRate(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[11px] text-slate-500 px-1 font-mono">
              <span>5% (Low)</span>
              <span>30% (Avg)</span>
              <span>80% (Refined Support)</span>
            </div>
          </div>
        </div>

        {/* Right Output Cards */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          {/* Lost Revenue Card */}
          <div className="p-6 rounded-2xl bg-rose-950/15 border border-rose-900/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl transition-all"></div>
            <div className="flex items-start gap-4 relative z-10">
              <div className="p-3 bg-rose-500/10 rounded-xl text-rose-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-rose-450 block mb-1 font-mono">
                  Annual Revenue Leakage
                </span>
                <h4 className="text-4xl font-display font-black text-rose-200 tracking-tight leading-none mb-2">
                  ${calculations.annualLostRevenue.toLocaleString()}
                </h4>
                <p className="text-rose-300/80 text-xs leading-relaxed font-normal">
                  Assuming you leak {missedCalls} commercial inquiries monthly and convert {closeRate}% of them, you lose approx. <strong className="font-semibold text-white">${calculations.monthlyLostRevenue.toLocaleString()}</strong> every 30 days.
                </p>
              </div>
            </div>
          </div>

          {/* Saved with Vocos Card */}
          <div className="p-6 rounded-2xl bg-emerald-950/15 border border-emerald-900/30 relative overflow-hidden group flex-grow flex flex-col justify-center animate-pulse-slow">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl transition-all"></div>
            <div className="flex items-start gap-4 relative z-10">
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block mb-1 font-mono font-bold">
                  Recoverable with VocosAI
                </span>
                <h4 className="text-4xl font-display font-black text-emerald-100 tracking-tight leading-none mb-2">
                  ${calculations.recoveredRevenueAnnual.toLocaleString()}
                </h4>
                <span className="text-emerald-300/85 text-xs block leading-relaxed font-normal">
                  VocosAI answers <strong>95%+</strong> of overflow and weekend calls. We capture the technician ticket detail & handle calendar bookings in real-time, instantly recovering those escaping clients.
                </span>
                <div className="mt-4 flex items-center gap-2 text-emerald-400 text-2xs font-bold uppercase tracking-wide">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Instant Customer Guarantee
                </div>
              </div>
            </div>
          </div>

          {/* Quick audit CTA button */}
          <a
            href="#audit-section"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase py-4.5 text-center rounded-2xl text-xs tracking-widest transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/15 active:scale-[0.98] outline-none"
          >
            Lock Down This Revenue Leakage
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
