"use client";

import { useEffect, useMemo, useState } from "react";
import { Scale, Ruler, Calendar, User, Activity, Bookmark, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface BodyInfo {
  unit: "metric" | "imperial";
  weight: string;
  height: string;
  age: string;
  gender: string;
  activityLevel: string;
}

interface BodyInfoViewProps {
  onNavigateToBuilder?: () => void;
}

export function BodyInfoView({ onNavigateToBuilder }: BodyInfoViewProps) {
  const [bodyInfo, setBodyInfo] = useState<BodyInfo>({
    unit: "metric",
    weight: "",
    height: "",
    age: "",
    gender: "unspecified",
    activityLevel: "moderate",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("repforge-body-info");
      if (stored) setBodyInfo(JSON.parse(stored));
    } catch {}
  }, []);

  function handleSave() {
    try {
      localStorage.setItem("repforge-body-info", JSON.stringify(bodyInfo));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
  }

  // Calculate live BMI
  const bmiData = useMemo(() => {
    const w = parseFloat(bodyInfo.weight);
    const h = parseFloat(bodyInfo.height);
    if (!w || !h || w <= 0 || h <= 0) return null;
    let score = 0;
    if (bodyInfo.unit === "metric") {
      const hm = h / 100;
      score = w / (hm * hm);
    } else {
      score = (w / (h * h)) * 703;
    }
    if (!isFinite(score)) return null;
    const formatted = score.toFixed(1);
    let category = "Normal weight";
    let colorClass = "bmi-normal";
    if (score < 18.5) {
      category = "Underweight";
      colorClass = "bmi-under";
    } else if (score >= 25 && score < 30) {
      category = "Overweight";
      colorClass = "bmi-over";
    } else if (score >= 30) {
      category = "Obese";
      colorClass = "bmi-obese";
    }
    return { score: formatted, category, colorClass };
  }, [bodyInfo]);

  return (
    <div className="module-page-container">
      <section className="intro">
        <div>
          <p className="eyebrow"><span /> MODULE 02 · PROFILE</p>
          <h1>YOUR BODY PROFILE<br /><em>TRACK METRICS</em></h1>
        </div>
        <p>Save your biometric details to customize your workout intensity, volume, and recovery.</p>
      </section>

      <div className="body-info-shell">
        <div className="body-info-card">
          <div className="panel-heading">
            <div>
              <span>02</span>
              <h2>Body Information</h2>
            </div>
            <div className="unit-toggle">
              <button
                type="button"
                className={bodyInfo.unit === "metric" ? "active" : ""}
                onClick={() => setBodyInfo({ ...bodyInfo, unit: "metric" })}
              >
                Metric (kg, cm)
              </button>
              <button
                type="button"
                className={bodyInfo.unit === "imperial" ? "active" : ""}
                onClick={() => setBodyInfo({ ...bodyInfo, unit: "imperial" })}
              >
                Imperial (lbs, in)
              </button>
            </div>
          </div>

          <div className="body-form-grid">
            {/* Weight */}
            <div className="body-field">
              <label htmlFor="input-weight" className="field-label">
                <Scale className="w-3.5 h-3.5 inline mr-1" /> Weight ({bodyInfo.unit === "metric" ? "kg" : "lbs"})
              </label>
              <div className="input-affix-wrapper">
                <input
                  id="input-weight"
                  type="number"
                  placeholder="e.g. 70"
                  value={bodyInfo.weight}
                  onChange={(e) => setBodyInfo({ ...bodyInfo, weight: e.target.value })}
                />
                <span className="unit-label">{bodyInfo.unit === "metric" ? "KG" : "LBS"}</span>
              </div>
            </div>

            {/* Height */}
            <div className="body-field">
              <label htmlFor="input-height" className="field-label">
                <Ruler className="w-3.5 h-3.5 inline mr-1" /> Height ({bodyInfo.unit === "metric" ? "cm" : "in"})
              </label>
              <div className="input-affix-wrapper">
                <input
                  id="input-height"
                  type="number"
                  placeholder={bodyInfo.unit === "metric" ? "e.g. 175" : "e.g. 69"}
                  value={bodyInfo.height}
                  onChange={(e) => setBodyInfo({ ...bodyInfo, height: e.target.value })}
                />
                <span className="unit-label">{bodyInfo.unit === "metric" ? "CM" : "IN"}</span>
              </div>
            </div>

            {/* Age */}
            <div className="body-field">
              <label htmlFor="input-age" className="field-label">
                <Calendar className="w-3.5 h-3.5 inline mr-1" /> Age
              </label>
              <div className="input-affix-wrapper">
                <input
                  id="input-age"
                  type="number"
                  placeholder="e.g. 28"
                  value={bodyInfo.age}
                  onChange={(e) => setBodyInfo({ ...bodyInfo, age: e.target.value })}
                />
                <span className="unit-label">YRS</span>
              </div>
            </div>

            {/* Gender */}
            <div className="body-field">
              <label htmlFor="select-gender" className="field-label">
                <User className="w-3.5 h-3.5 inline mr-1" /> Gender
              </label>
              <select
                id="select-gender"
                className="body-select"
                value={bodyInfo.gender}
                onChange={(e) => setBodyInfo({ ...bodyInfo, gender: e.target.value })}
              >
                <option value="unspecified">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Activity Level */}
          <div className="body-field mt-4">
            <label htmlFor="select-activity" className="field-label">
              <Activity className="w-3.5 h-3.5 inline mr-1" /> Activity Level
            </label>
            <select
              id="select-activity"
              className="body-select"
              value={bodyInfo.activityLevel}
              onChange={(e) => setBodyInfo({ ...bodyInfo, activityLevel: e.target.value })}
            >
              <option value="sedentary">Sedentary (Little to no regular physical exercise)</option>
              <option value="light">Lightly Active (1–3 training days per week)</option>
              <option value="moderate">Moderately Active (3–5 training days per week)</option>
              <option value="very">Very Active (6–7 intense training days per week)</option>
            </select>
          </div>

          {/* Live BMI Summary Card */}
          {bmiData && (
            <div className="bmi-overview-card">
              <div>
                <span className="bmi-subtext">Estimated BMI Score</span>
                <strong className="bmi-number">{bmiData.score}</strong>
              </div>
              <div className="bmi-pill-wrap">
                <span className={`bmi-status-pill ${bmiData.colorClass}`}>{bmiData.category}</span>
                <p>Calculated from height and weight metrics</p>
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="body-action-row">
            <Button
              onClick={handleSave}
              size="lg"
              className={`generate-button save-profile-btn ${saved ? "saved" : ""}`}
            >
              {saved ? <Check className="w-4 h-4 mr-2" /> : <Bookmark className="w-4 h-4 mr-2" />}
              {saved ? "Information Saved" : "Save Body Information"}
            </Button>

            {onNavigateToBuilder && (
              <button
                type="button"
                onClick={onNavigateToBuilder}
                className="secondary-nav-link"
              >
                <span>Proceed to Build Your Session</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
