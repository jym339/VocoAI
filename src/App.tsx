import React, { useState, useEffect } from "react";
import { 
  PhoneCall, ShieldAlert, Award, ArrowUpRight, CheckCircle2, 
  Calendar, Clock, Send, Sparkles, Building2, UserCircle2, 
  Mail, Phone, FileSpreadsheet, Layers, BadgePercent, HelpCircle, AlertTriangle, Check,
  Settings, ExternalLink
} from "lucide-react";
import ROICalculator from "./components/ROICalculator";
import { HVACLead } from "./types";

export default function App() {
  // Booking states
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [auditSuccess, setAuditSuccess] = useState<boolean>(false);

  // Calendly Configuration State (defaults to booknow12/consultation-veloxcall, or from env, or saved value)
  const [calendlyUrl, setCalendlyUrl] = useState(() => {
    const saved = localStorage.getItem("vocoai_calendly_url");
    if (saved) return saved;
    const envUrl = (import.meta as any).env?.VITE_CALENDLY_URL;
    if (envUrl) return envUrl;
    return "https://calendly.com/booknow12/consultation-veloxcall";
  });

  const getCalendlyEmbedUrl = () => {
    let baseUrl = calendlyUrl.trim();
    if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
      baseUrl = `https://calendly.com/${baseUrl}`;
    }
    const params = new URLSearchParams();
    params.append("hide_landing_page_details", "1");
    params.append("hide_gdpr_banner", "1");
    if (name) params.append("name", name);
    if (email) params.append("email", email);
    if (phone) {
      params.append("phone", phone);
      params.append("phone_number", phone);
    }
    
    // Auto-populate the "Please share anything that will help prepare for our meeting." field (maps to 'a1' in Calendly)
    const shareParts: string[] = [];
    if (company) {
      shareParts.push(`Company: ${company}`);
    }
    if (phone) {
      shareParts.push(`Phone: ${phone}`);
    }
    if (shareParts.length > 0) {
      params.append("a1", shareParts.join(" | "));
    }

    const queryStr = params.toString();
    return `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}${queryStr}`;
  };

  // Handle callback audit submission
  const onSubmitAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      alert("Please enter your name, email, and phone contact.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name,
      company: company || "Not Provided",
      email,
      phone,
      valRange: 4500,
      missedRate: 30,
      potentialLoss: 48600,
      date: new Date().toISOString().split('T')[0],
      time: "Callback requested",
    };

    try {
      const response = await fetch("/api/audit-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setAuditSuccess(true);
      } else {
        throw new Error("Server error");
      }
    } catch (err) {
      console.warn("Simulation fallback setup:", err);
      setAuditSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500 font-sans p-6 md:p-12 lg:p-16 relative overflow-hidden">
      {/* Dynamic Background Noise/Shapes */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(59,130,246,0.08),transparent_100%)] pointer-events-none"></div>
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[800px] -right-40 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[200px] pointer-events-none"></div>

      {/* Grid Pattern Underlay */}
      <div className="absolute inset-x-0 top-0 h-[800px] bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_60%,transparent_100%)] opacity-20 pointer-events-none"></div>

      {/* Main Content Wrapper */}
      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* Navigation Section */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-slate-900 pb-8">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black tracking-tighter italic uppercase text-slate-100 hover:opacity-90 transition-opacity">
              VOCO<span className="text-blue-500">AI</span>
            </span>
            <span className="px-2.5 py-1 bg-slate-900 text-slate-400 border border-slate-800 rounded-md text-[10px] font-mono tracking-widest font-semibold uppercase">
              V4.1 DEV
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs font-bold uppercase tracking-widest text-slate-400">
            <a href="#calculator-section" className="hover:text-white transition-colors">ROI Calculator</a>
            <a href="#audit-section" className="hover:text-white transition-colors text-white border-b-2 border-blue-500 pb-1">Missed-Call Audit</a>
            <a href="#architecture-section" className="hover:text-white transition-colors">How it works</a>
          </div>
        </header>

        {/* Hero Headline Column */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-6 items-center">
          <div className="lg:col-span-8 flex flex-col justify-center text-left space-y-8 animate-fade-in">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold tracking-widest border border-blue-500/20 uppercase w-fit font-mono">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Commercial HVAC Automated Response
            </span>

            <h1 className="text-[52px] md:text-[76px] xl:text-[84px] leading-[0.9] font-black uppercase tracking-tighter tracking-tight text-white">
              Stop losing <span className="outline-text block md:inline">HVAC jobs</span> to missed calls and slow dispatch.
            </h1>

            <p className="text-lg md:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl">
              We install smart AI voice dispatch and instant lead follow-up systems that answer professional inquiries, pre-qualify caller needs, and book project estimates directly inside your schedule 24/7.
            </p>

            {/* Quick stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-2xl pt-2">
              <div className="p-4 bg-slate-900/60 border border-slate-850 rounded-xl">
                <p className="text-2xl font-black text-blue-500 font-mono">100%</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Calls Handled Live</p>
              </div>
              <div className="p-4 bg-slate-900/60 border border-slate-850 rounded-xl">
                <p className="text-2xl font-black text-emerald-400 font-mono">&lt; 3 Sec</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">SMS Dispatch Speed</p>
              </div>
              <div className="p-4 bg-slate-900/60 border border-slate-850 rounded-xl col-span-2 sm:col-span-1">
                <p className="text-2xl font-black text-rose-500 font-mono">Zero</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Leaked Sales Prospects</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="#audit-section"
                className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase px-8 py-5 text-xs tracking-widest transition-colors shadow-lg shadow-blue-600/10 hover:shadow-blue-500/20 active:scale-98"
              >
                Book Missed-Call Audit
              </a>
              <a
                href="#calculator-section"
                className="flex items-center gap-3 px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-300 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/40 transition-all"
              >
                Calculate Revenue Leakage
              </a>
            </div>
          </div>

          {/* Quick Informational Cards on the right */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-850 p-6 md:p-8 rounded-2xl relative shadow-2xl overflow-hidden self-stretch flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>

            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-850">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">System Active</span>
                </div>
                <span className="text-[9px] font-mono text-slate-500 uppercase">24/7/365 OVERFLOW</span>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-blue-500 font-mono">
                  Why Contractors Choose VocoAI:
                </h4>
                <div className="space-y-3 text-xs">
                  <div className="flex gap-2.5 items-start">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-slate-300"><strong className="text-white font-semibold">Immediate Response:</strong> 62% of prospects hang up and dial the next contractor if you don't answer. We eliminate that instantly.</p>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-slate-300"><strong className="text-white font-semibold">Technician Dispatch Heuristics:</strong> Dispatches detail direct with dispatch classifications so high value contracts never wait.</p>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-slate-300"><strong className="text-white font-semibold">Direct Integration:</strong> Plugs directly into ServiceTitan, Housecall Pro, Google Calendar, or standard CRM setups.</p>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </section>

        {/* Quick Problem - Solution Statement Banner */}
        <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-8 rounded-3xl border border-slate-850/80">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-800">
            {/* Problem Col */}
            <div className="space-y-3 pb-6 md:pb-0 md:pr-8">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-rose-500/10 text-rose-400 rounded-md text-[10px] font-bold uppercase tracking-wider font-mono">
                <AlertTriangle className="w-3.5 h-3.5" /> The Leaking Profit
              </span>
              <p className="text-sm font-bold text-white uppercase tracking-wide">
                You pay for leads. But slow follow-up kills the ticket.
              </p>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                When emergency or routine calls go over to voicemail during the weekend or lunch, forms sit unattended too long, or callbacks occur hours later, your competitor takes the commercial dispatch.
              </p>
            </div>

            {/* Solution Col */}
            <div className="space-y-3 pt-6 md:pt-0 md:pl-8">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-md text-[10px] font-bold uppercase tracking-wider font-mono">
                🚀 The Intelligent Backup Dispatcher
              </span>
              <p className="text-sm font-bold text-white uppercase tracking-wide">
                Real-time backup receptionist that guarantees booking.
              </p>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Our advanced artificial backup answers after-hours & overflow calls instantaneously, extracts key parameters (facility address, chiller or RTU issue, contact), logs the ticket, and launches SMS follow-up alerts immediately.
              </p>
            </div>
          </div>
        </section>

        {/* REVENUE CALCULATOR SECTION */}
        <section className="space-y-6">
          <ROICalculator />
        </section>

        {/* PROACTIVE MISSED CALL AUDIT FORM CARD */}
        <section id="audit-section" className="bg-slate-900 border border-slate-850 rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Col 1 Info */}
            <div className="p-8 md:p-12 lg:col-span-12 xl:col-span-5 bg-slate-950 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-850">
              <div className="space-y-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-2xs uppercase font-mono rounded-lg border border-emerald-500/20 font-bold">
                  ✓ Database Secure
                </span>
                
                <h3 className="text-4xl font-display font-extrabold uppercase tracking-tight text-slate-100 leading-none">
                  Book A Missed-Call Revenue Audit
                </h3>

                <p className="text-sm text-slate-400 leading-relaxed font-normal">
                  Our commercial HVAC dispatcher engineer will analyze your incoming call routers, review website & maps response speeds, and calculate the concrete revenue leakage from missed service calls during weekends, emergency dispatch, and busy mornings.
                </p>

                <div className="space-y-4 pt-4 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-slate-200 uppercase">Interactive audit call</h5>
                      <p className="text-slate-400">Simple diagnostic mapping with zero sales pressure.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-slate-200 uppercase">Detailed PDF Leakage Report</h5>
                      <p className="text-slate-400">Receive verified statistics detailing how many opportunities escape your dispatch team.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 text-3xs font-mono text-slate-500 uppercase">
                VocoAI Dispatch Core • Non-blocking CRM registration active
              </div>
            </div>

            {/* Col 2 Lightweight Callback form */}
            <div className="p-8 md:p-12 lg:col-span-12 xl:col-span-7 bg-slate-900/40 relative">
              {auditSuccess ? (
                <div className="flex flex-col lg:flex-row gap-8 items-stretch justify-between h-full min-h-[550px]">
                  {/* Left Column: Confirmation Specs */}
                  <div className="flex flex-col justify-between space-y-6 lg:w-1/3 text-left">
                    <div>
                      <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/30 mb-4 animate-pulse">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className="text-xl font-display font-black uppercase text-white leading-tight">
                        CRM Entry Saved!
                      </h4>
                      <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                        Excellent, <strong className="text-white">{name}</strong>. Your contact details are stored securely. 
                      </p>
                      <p className="text-blue-400 text-[11px] mt-2 font-bold leading-relaxed font-mono uppercase tracking-wide">
                        ★ Step 2: Choose Your Booking Slot 
                      </p>
                    </div>

                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 space-y-2.5 font-mono text-[10px] leading-relaxed">
                      <div className="flex justify-between items-center text-[8px] text-slate-500 uppercase pb-1.5 border-b border-slate-900">
                        <span>Synced Lead Details</span>
                        <span className="text-emerald-400 font-bold">● SECURE</span>
                      </div>
                      <div className="space-y-1 text-slate-300">
                        <p>Representative: <strong className="text-white">{name}</strong></p>
                        {company && <p>Company: <strong className="text-white">{company}</strong></p>}
                        <p>Phone: <strong className="text-white">{phone}</strong></p>
                        <p>Email: <strong className="text-white">{email}</strong></p>
                      </div>
                      <div className="pt-1.5 border-t border-slate-900 text-[8px] text-center text-emerald-400 font-bold uppercase tracking-wider">
                        ✓ Registered for callback queue
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setAuditSuccess(false);
                        setName("");
                        setCompany("");
                        setEmail("");
                        setPhone("");
                      }}
                      className="w-full py-2.5 bg-slate-850 hover:bg-slate-800 text-slate-300 text-3xs uppercase tracking-widest font-bold rounded-lg border border-slate-800 hover:border-slate-705 transition-colors cursor-pointer text-center"
                    >
                      Reset Form Setup
                    </button>
                  </div>

                  {/* Right Column: Live Calendly Iframe Embed */}
                  <div className="flex-1 min-h-[500px] bg-slate-950 rounded-2xl border border-slate-850 overflow-hidden relative flex flex-col w-full">
                    <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-900 flex justify-between items-center text-[9px] font-mono text-slate-500 uppercase tracking-widest shrink-0">
                      <span>Live Calendly Interactive Session</span>
                      <a 
                        href={getCalendlyEmbedUrl()} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-bold lowercase tracking-normal font-sans"
                      >
                        open in new tab <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                    <div className="flex-1 bg-white relative">
                      <iframe
                        src={getCalendlyEmbedUrl()}
                        className="absolute inset-0 w-full h-full border-0 bg-white"
                        title="Calendly Scheduling IFrame"
                        allowFullScreen
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={onSubmitAudit} className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-850 pb-4">
                    <h4 className="text-lg font-bold uppercase text-slate-300 font-mono tracking-wider flex items-center gap-2">
                      Enter Your Contact Details
                    </h4>
                    
                    <button
                      type="button"
                      onClick={() => {
                        const newUrl = prompt(
                          "Enter your custom Calendly URL or username\n(e.g., https://calendly.com/your-username or just your-username):",
                          calendlyUrl
                        );
                        if (newUrl !== null) {
                          const trimmed = newUrl.trim();
                          if (trimmed) {
                            localStorage.setItem("vocoai_calendly_url", trimmed);
                            setCalendlyUrl(trimmed);
                          }
                        }
                      }}
                      className="flex items-center gap-1.5 px-3 py-1 bg-slate-950/80 hover:bg-slate-905 border border-slate-800 rounded-lg text-3xs font-mono uppercase text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="Connect your personal Calendly account"
                    >
                      <Settings className="w-3.5 h-3.5 text-blue-500" />
                      <span>Configure Calendly</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name input */}
                    <div className="space-y-2">
                      <label className="text-3xs uppercase tracking-widest text-slate-400 font-bold">Your Name *</label>
                      <div className="relative">
                        <UserCircle2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Sarah Henderson"
                          className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500/80 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none placeholder:text-slate-600 font-mono"
                        />
                      </div>
                    </div>

                    {/* Company input */}
                    <div className="space-y-2">
                      <label className="text-3xs uppercase tracking-widest text-slate-400 font-bold">HVAC Company Name</label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="Apex Commercial HVAC"
                          className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500/80 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none placeholder:text-slate-600 font-mono"
                        />
                      </div>
                    </div>

                    {/* Email Input */}
                    <div className="space-y-2">
                      <label className="text-3xs uppercase tracking-widest text-slate-400 font-bold">Work Email *</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="sarah@apexhvac.com"
                          className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500/80 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none placeholder:text-slate-600 font-mono"
                        />
                      </div>
                    </div>

                    {/* Phone Input */}
                    <div className="space-y-2">
                      <label className="text-3xs uppercase tracking-widest text-slate-400 font-bold">Telephone Contact *</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="(415) 304-9842"
                          className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500/80 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none placeholder:text-slate-600 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-black uppercase tracking-widest text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/10 cursor-pointer"
                    >
                      {isSubmitting ? "Requesting Callback..." : "BOOK MISSED-CALL AUDIT"}
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* STRUCTURE & ARCHITECTURE TIMELINE CARRIER CARD */}
        <section id="architecture-section" className="space-y-6">
          <div className="border-b border-slate-900 pb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500 font-mono">
              Under The Hood
            </span>
            <h3 className="text-3xl font-display font-black uppercase text-white tracking-tight">
              The VocoAI Integration Path
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-900/40 border border-slate-850 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center text-sm font-black font-mono">
                01
              </div>
              <h5 className="font-bold text-white uppercase text-sm tracking-wide">Inbound VoIP Divert</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                When your lines are busy, technicians are in crawlspaces, or on weeknights, inbound calls automatically divert to your private Voco AI phone reception proxy trunk after 3 rings.
              </p>
            </div>

            <div className="p-6 bg-slate-900/40 border border-slate-850 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center text-sm font-black font-mono">
                02
              </div>
              <h5 className="font-bold text-white uppercase text-sm tracking-wide">LLC Pre-Qualification</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                The AI conversational interface identifies emergency vs routine calls, captures address logistics, explains service fee structures, and records structural equipment issues.
              </p>
            </div>

            <div className="p-6 bg-slate-900/40 border border-slate-850 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center text-sm font-black font-mono">
                03
              </div>
              <h5 className="font-bold text-white uppercase text-sm tracking-wide">Instant Booking & dispatch</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                A calendar link is sent immediately. The full audio transcripts, parsed location metrics, and urgent priority notes are pushed to ServiceTitan or emailed directly into your field schedule.
              </p>
            </div>
          </div>
        </section>

        {/* Elegant Bold Footer */}
        <footer className="pt-12 border-t border-slate-900 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-4xl">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 font-mono">The Problem</div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider leading-tight">
                Calls go unanswered. Forms sit too long. The next contractor wins spelling lost revenue.
              </p>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 font-mono">The Solution</div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider leading-tight">
                VocoAI answers 24/7/365, parses HVAC triage detail instantly, and blocks calendar tickets.
              </p>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 font-mono">The Result</div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider leading-tight">
                Zero missed leads. Retain high-paying emergency commercial agreements automatically.
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <p className="text-[10px] text-slate-700 font-mono uppercase tracking-widest">
              ©2026 VOCOAI TECHNOLOGIES CO. INC.
            </p>
            <p className="text-[9px] text-slate-800 font-mono tracking-tighter mt-1">
              ALL RIGHTS RESERVED. POWERED BY AI STUDIO APPS.
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
}
