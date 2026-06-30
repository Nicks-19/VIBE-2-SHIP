import React, { useState, useRef } from 'react';
import { createIssue } from '../services/ApiService';
import {
  Camera, Upload, MapPin, Loader2, CheckCircle2, Sparkles,
  ArrowRight, AlertTriangle, FileText, X,
} from 'lucide-react';

export default function ReportIssue({ onSuccess }) {
  const [step, setStep] = useState(1); // 1=capture, 2=details, 3=analyzing, 4=result
  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  function handleImageSelect(e) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  }

  function detectLocation() {
    if (!navigator.geolocation) {
      setLocation({ latitude: 18.5204, longitude: 73.8567 });
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setLocationLoading(false);
      },
      () => {
        setLocation({ latitude: 18.5204, longitude: 73.8567 });
        setLocationLoading(false);
      },
      { timeout: 5000 }
    );
  }

  async function handleSubmit() {
    if (!location) {
      setError('Please detect your location first');
      return;
    }
    setStep(3);
    setError(null);

    try {
      const payload = {
        title: title || undefined,
        description: description || 'Civic infrastructure issue reported via CivicPulse AI',
        imageUrl: imagePreview || '',
        latitude: location.latitude,
        longitude: location.longitude,
      };
      
      // Simulate AI processing time for dramatic effect
      await new Promise(r => setTimeout(r, 2200));
      const res = await createIssue(payload);
      setResult(res);
      setStep(4);
    } catch (err) {
      setError('Submission failed. Please try again.');
      setStep(2);
    }
  }

  // Step 1: Image Capture
  if (step === 1) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-civic-500/10 border border-civic-500/20 text-civic-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" /> AI-Powered Analysis
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Report an Issue</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Capture or upload a photo of the infrastructure problem. Our AI will automatically classify and prioritize it.
          </p>
        </div>

        <div className="glass rounded-2xl p-8">
          {!imagePreview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-600 hover:border-civic-500/50 rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 hover:bg-civic-500/5 group"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-civic-500/10 transition-colors">
                <Camera className="w-8 h-8 text-slate-400 group-hover:text-civic-400 transition-colors" />
              </div>
              <p className="text-white font-semibold mb-1">Click to upload photo</p>
              <p className="text-slate-500 text-sm">or drag and drop • JPG, PNG up to 10MB</p>
              <div className="flex items-center justify-center gap-4 mt-6">
                <span className="flex items-center gap-2 text-xs text-slate-500">
                  <Upload className="w-3.5 h-3.5" /> Upload File
                </span>
                <span className="text-slate-700">|</span>
                <span className="flex items-center gap-2 text-xs text-slate-500">
                  <Camera className="w-3.5 h-3.5" /> Take Photo
                </span>
              </div>
            </div>
          ) : (
            <div className="relative group">
              <img
                src={imagePreview}
                alt="Issue preview"
                className="w-full h-64 object-cover rounded-xl"
              />
              <button
                onClick={() => setImagePreview(null)}
                className="absolute top-3 right-3 p-2 bg-slate-900/80 rounded-full text-white hover:bg-rose-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 bg-emerald-500/90 rounded-full text-white text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Photo captured
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageSelect}
            className="hidden"
          />

          <button
            onClick={() => { detectLocation(); setStep(2); }}
            disabled={!imagePreview}
            className={`w-full mt-6 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-sm transition-all duration-200
              ${imagePreview 
                ? 'bg-civic-600 hover:bg-civic-500 text-white shadow-lg shadow-civic-600/20' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
          >
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Step 2: Details
  if (step === 2) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Add Details</h2>
          <p className="text-slate-400 text-sm">Help us understand the issue better</p>
        </div>

        <div className="glass rounded-2xl p-8 space-y-6">
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-xl" />
          )}

          {/* Location */}
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Location</label>
            {location ? (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                <MapPin className="w-4 h-4" />
                <span>{location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</span>
                <CheckCircle2 className="w-4 h-4 ml-auto" />
              </div>
            ) : (
              <button
                onClick={detectLocation}
                disabled={locationLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm transition-colors"
              >
                {locationLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Detecting...</>
                ) : (
                  <><MapPin className="w-4 h-4" /> Detect My Location</>
                )}
              </button>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Title (optional)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Large pothole on main road"
              className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-civic-500/40 focus:border-civic-500/40 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-civic-500/40 focus:border-civic-500/40 transition-all resize-none"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
              <AlertTriangle className="w-4 h-4" /> {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-civic-600 hover:bg-civic-500 text-white font-semibold text-sm shadow-lg shadow-civic-600/20 transition-all"
            >
              <Sparkles className="w-4 h-4" /> Submit & Analyze with AI
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: AI Analyzing
  if (step === 3) {
    return (
      <div className="max-w-lg mx-auto text-center animate-fade-in py-20">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-civic-500/10 flex items-center justify-center mb-6 animate-pulse-soft">
          <Sparkles className="w-10 h-10 text-civic-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">AI is Analyzing Your Report</h2>
        <p className="text-slate-400 text-sm mb-8">Classifying issue, scoring severity, routing to department...</p>
        
        <div className="space-y-3 max-w-xs mx-auto">
          {['Image Classification', 'Severity Assessment', 'Department Routing', 'Priority Scoring'].map((label, i) => (
            <div key={label} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-800/60 text-sm"
              style={{ animationDelay: `${i * 0.5}s` }}
            >
              <Loader2 className="w-4 h-4 text-civic-400 animate-spin" />
              <span className="text-slate-300">{label}</span>
              <span className="ml-auto text-xs text-slate-500">Processing...</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Step 4: Result
  if (step === 4 && result) {
    const analysis = result.aiAnalysis || {};
    return (
      <div className="max-w-2xl mx-auto animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4 animate-bounce-in">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Issue Reported Successfully!</h2>
          <p className="text-slate-400 text-sm">Tracking ID: <strong className="text-white">{result.id}</strong></p>
        </div>

        <div className="glass rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-white">{result.title}</h3>

          {/* AI Analysis Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-slate-800/60">
              <p className="text-xs text-slate-500 mb-1">Category</p>
              <p className="text-sm font-semibold text-white">{analysis.category || 'N/A'}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/60">
              <p className="text-xs text-slate-500 mb-1">AI Confidence</p>
              <p className="text-sm font-semibold text-emerald-400">{((analysis.visionConfidence || 0) * 100).toFixed(0)}%</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/60">
              <p className="text-xs text-slate-500 mb-1">Priority Score</p>
              <p className="text-sm font-semibold text-amber-400">{result.priorityScore}/100</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/60">
              <p className="text-xs text-slate-500 mb-1">Department</p>
              <p className="text-sm font-semibold text-civic-400">{result.department || 'Auto-routing...'}</p>
            </div>
          </div>

          {/* Keywords */}
          {analysis.extractedKeywords?.length > 0 && (
            <div>
              <p className="text-xs text-slate-500 mb-2">AI Keywords</p>
              <div className="flex flex-wrap gap-2">
                {analysis.extractedKeywords.map((kw, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-full bg-civic-500/10 border border-civic-500/20 text-civic-400 text-xs font-medium">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Priority Reasons */}
          {result.priorityReasons?.length > 0 && (
            <div>
              <p className="text-xs text-slate-500 mb-2">Priority Factors</p>
              <div className="space-y-1.5">
                {result.priorityReasons.map((reason, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    {reason}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => { setStep(1); setImagePreview(null); setDescription(''); setTitle(''); setResult(null); }}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
            >
              Report Another
            </button>
            <button
              onClick={onSuccess}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-civic-600 hover:bg-civic-500 text-white font-semibold text-sm transition-all"
            >
              <FileText className="w-4 h-4" /> View My Issues
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
