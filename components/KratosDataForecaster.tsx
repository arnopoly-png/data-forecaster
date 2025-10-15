// Place this file at: data-forecaster/components/KratosDataForecaster.tsx
// No external icon deps. Imports use relative paths inside data-forecaster.

"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Input } from "./ui/input";
import { Label } from "./ui/label";


// ---------- Helpers ----------
function pct(v: number) { return (v * 100).toFixed(1) + "%" }
function fmt(n: number) {
  if (!isFinite(n)) return "-";
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}
function money(n: number) {
  if (!isFinite(n)) return "-";
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function PercentSlider({ label, value, onChange, step=0.01, min=0, max=1 }: { label: string; value: number; onChange: (v:number)=>void; step?: number; min?: number; max?: number; }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm text-muted-foreground">{label}</Label>
        <div className="font-medium">{pct(value)}</div>
      </div>
      <Slider value={[value]} step={step} min={min} max={max} onValueChange={(v)=>onChange(v[0])} />
    </div>
  );
}

function NumberField({ label, value, onChange, prefix, suffix, step=1, min=0 }: { label: string; value: number; onChange: (v:number)=>void; prefix?: string; suffix?: string; step?: number; min?: number; }) {
  return (
    <div className="space-y-1">
      <Label className="text-sm text-muted-foreground">{label}</Label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{prefix}</span>}
        <Input type="number" className={`pr-10 ${prefix ? 'pl-8' : 'pl-3'}`} step={step} min={min}
          value={Number.isFinite(value) ? String(value) : ''}
          onChange={(e)=>onChange(parseFloat(e.target.value || '0'))}
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{suffix}</span>}
      </div>
    </div>
  );
}

export default function KratosDataForecaster() {
  // ---------- Base Inputs (Monthly) ----------
  const [offerPrice, setOfferPrice] = useState(7000);

  // Ads
  const [adSpend, setAdSpend] = useState(10000);
  const [cpc, setCpc] = useState(2.5);
  const [ctr, setCtr] = useState(0.015); // 1.5%

  // Funnel Rates
  const [optInRate, setOptInRate] = useState(0.35); // leads / clicks
  const [bookingRate, setBookingRate] = useState(0.20); // booked / leads
  const [showRate, setShowRate] = useState(0.70); // show / booked
  const [closeRate, setCloseRate] = useState(0.25); // deals / show
  const [cashCollectedRate, setCashCollectedRate] = useState(0.60); // portion of revenue collected now

  // Scenario tweaks (% delta multiplier for rates)
  const [rateBoost, setRateBoost] = useState(0); // -50% to +50%

  // ---------- Derived Metrics ----------
  const m = useMemo(() => {
    const clicks = adSpend > 0 && cpc > 0 ? adSpend / cpc : 0;
    const impressions = ctr > 0 ? clicks / ctr : 0;

    const optIn = Math.max(0, optInRate * (1 + rateBoost));
    const bookR = Math.max(0, bookingRate * (1 + rateBoost));
    const showR = Math.max(0, showRate * (1 + rateBoost));
    const closeR = Math.max(0, closeRate * (1 + rateBoost));

    const leads = clicks * optIn;
    const cpl = leads > 0 ? adSpend / leads : Infinity;

    const booked = leads * bookR;
    const shows = booked * showR;
    const costPerShow = shows > 0 ? adSpend / shows : Infinity;

    const deals = shows * closeR;
    const cpa = deals > 0 ? adSpend / deals : Infinity;

    const revenue = deals * offerPrice;
    const newCash = revenue * cashCollectedRate;

    const roasNewCash = adSpend > 0 ? newCash / adSpend : 0;
    const roasRevenue = adSpend > 0 ? revenue / adSpend : 0;
    const roasCashCollected = adSpend > 0 ? newCash / adSpend : 0; // identical to roasNewCash in this MVP

    return {
      clicks, impressions, leads, cpl, booked, shows, costPerShow, deals, cpa,
      revenue, newCash, cashCollected: newCash,
      roasNewCash, roasRevenue, roasCashCollected,
      optIn, bookR, showR, closeR,
    };
  }, [adSpend, cpc, ctr, optInRate, bookingRate, showRate, closeRate, offerPrice, cashCollectedRate, rateBoost]);

  function resetAll() {
    setOfferPrice(7000);
    setAdSpend(10000); setCpc(2.5); setCtr(0.015);
    setOptInRate(0.35); setBookingRate(0.20); setShowRate(0.70); setCloseRate(0.25);
    setCashCollectedRate(0.60); setRateBoost(0);
  }

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Kratos Data Forecaster</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetAll}>Reset</Button>
          <Button>Recalculate</Button>
        </div>
      </header>

      {/* Top KPIs */}
      <div className="grid md:grid-cols-4 gap-4">
        <Kpi title="Revenue" value={money(m.revenue)} sub={fmt(m.deals) + " deals"} />
        <Kpi title="New Cash Collected" value={money(m.newCash)} sub={"Cash rate " + pct(cashCollectedRate)} />
        <Kpi title="ROAS (Revenue)" value={fmt(m.roasRevenue) + "x"} sub={"Spend " + money(adSpend)} />
        <Kpi title="ROAS (New Cash)" value={fmt(m.roasNewCash) + "x"} sub={"CPA " + (isFinite(m.cpa)?money(m.cpa):"-")} />
      </div>

      {/* Controls */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Offer Level */}
        <Section title="Offer Level">
          <NumberField label="Offer price" prefix="$" value={offerPrice} onChange={setOfferPrice} step={100} />
        </Section>

        {/* Ads Level */}
        <Section title="Ads Level">
          <NumberField label="Ads spent" prefix="$" value={adSpend} onChange={setAdSpend} step={100} />
          <NumberField label="Cost per click (CPC)" prefix="$" value={cpc} onChange={setCpc} step={0.1} />
          <PercentSlider label="CTR" value={ctr} onChange={setCtr} step={0.001} max={0.2} />
          <div className="grid grid-cols-2 gap-3 pt-3">
            <Stat label="# Clicks" value={fmt(m.clicks)} />
            <Stat label="Impressions (est.)" value={fmt(m.impressions)} />
          </div>
        </Section>

        {/* Lead Level */}
        <Section title="Lead Level">
          <PercentSlider label="Opt-In Rate" value={optInRate} onChange={setOptInRate} step={0.005} />
          <div className="grid grid-cols-2 gap-3 pt-3">
            <Stat label="# of Leads" value={fmt(m.leads)} />
            <Stat label="CPL" value={isFinite(m.cpl) ? money(m.cpl) : "-"} />
          </div>
        </Section>

        {/* Sales Level */}
        <Section title="Sales Level">
          <PercentSlider label="Booking rate (out of leads)" value={bookingRate} onChange={setBookingRate} step={0.005} />
          <PercentSlider label="Show up rate" value={showRate} onChange={setShowRate} step={0.005} />
          <PercentSlider label="Closing rate" value={closeRate} onChange={setCloseRate} step={0.005} />
          <div className="grid grid-cols-2 gap-3 pt-3">
            <Stat label="# Booked calls" value={fmt(m.booked)} />
            <Stat label="# Show calls" value={fmt(m.shows)} />
            <Stat label="# Closed deals" value={fmt(m.deals)} />
            <Stat label="Cost per show" value={isFinite(m.costPerShow) ? money(m.costPerShow) : "-"} />
            <Stat label="Cost per acquisition" value={isFinite(m.cpa) ? money(m.cpa) : "-"} />
          </div>
        </Section>

        {/* Rentability Level */}
        <Section title="Rentability Level">
          <PercentSlider label="Cash collected rate (from revenue)" value={cashCollectedRate} onChange={setCashCollectedRate} step={0.01} />
          <div className="grid grid-cols-2 gap-3 pt-3">
            <Stat label="Revenue" value={money(m.revenue)} />
            <Stat label="New Cash collected from closes" value={money(m.newCash)} />
            <Stat label="Cash collected" value={money(m.cashCollected)} />
            <Stat label="ROAS on New Cash" value={`${fmt(m.roasNewCash)}x`} />
            <Stat label="ROAS on Revenue" value={`${fmt(m.roasRevenue)}x`} />
            <Stat label="ROAS on Cash collected" value={`${fmt(m.roasCashCollected)}x`} />
          </div>
        </Section>

        {/* Scenario Boost */}
        <Section title="Scenario Forecaster">
          <div className="space-y-3">
            <Label className="text-sm text-muted-foreground">Global rate change (affects Opt-in, Booking, Show, Close)</Label>
            <div className="flex items-center justify-between">
              <span className="text-sm">-50%</span>
              <span className="text-sm">+50%</span>
            </div>
            <Slider value={[rateBoost]} min={-0.5} max={0.5} step={0.01} onValueChange={(v)=>setRateBoost(v[0])} />
            <div className="text-sm text-muted-foreground">Current boost: <span className="font-medium">{pct(rateBoost)}</span></div>
            <div className="rounded-xl border p-3 bg-muted/40">
              <p className="text-sm leading-relaxed">Glissez pour voir l'impact d'une amélioration ou détérioration globale de vos taux (opt-in, booking, show, close). Tous les KPIs se recalculent instantanément.</p>
            </div>
          </div>
        </Section>
      </div>

      {/* Notes */}
      <Card className="border-dashed">
        <CardContent className="p-5 text-sm text-muted-foreground space-y-2">
          <p><span className="font-semibold">Hypothèses MVP :</span> Clicks = Ads spent / CPC. Leads = Clicks × Opt-in. Booked = Leads × Booking. Shows = Booked × Show. Deals = Shows × Close. Revenue = Deals × Offer price. New Cash = Revenue × Cash collected rate.</p>
          <p>Vous pouvez adapter les champs et les plages des sliders selon votre business (ex: devises CAD, plages CTR plus élevées pour UGC, etc.).</p>
        </CardContent>
      </Card>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-5 space-y-4">
        <div className="font-semibold text-lg">{title}</div>
        {children}
      </CardContent>
    </Card>
  );
}

function Kpi({ title, value, sub }: { title: string; value: string; sub?: string }) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className="text-2xl font-bold leading-tight">{value}</div>
        {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-xl border bg-background">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-base font-medium">{value}</div>
    </div>
  );
}
