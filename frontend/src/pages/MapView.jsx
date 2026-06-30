import React, { useState, useEffect, useRef } from 'react';
import { fetchIssues } from '../services/ApiService';
import { Loader2, MapPin, AlertTriangle, ChevronRight, Layers } from 'lucide-react';

const STATUS_COLORS_MAP = {
  'Submitted': '#3b82f6',
  'In Progress': '#f59e0b',
  'Resolved': '#10b981',
  'Rejected': '#f43f5e',
};

const SEVERITY_RADIUS = { 1: 6, 2: 7, 3: 8, 4: 10, 5: 12 };

export default function MapView({ onViewIssue }) {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    loadIssues();
  }, []);

  useEffect(() => {
    if (issues.length > 0 && !mapReady) {
      initMap();
    }
  }, [issues]);

  async function loadIssues() {
    const data = await fetchIssues();
    setIssues(data);
    setLoading(false);
  }

  function initMap() {
    if (!window.L || !mapRef.current || mapInstanceRef.current) return;

    const L = window.L;
    const map = L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: false,
    }).setView([18.5204, 73.8567], 13); // Pune center

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Add markers
    issues.forEach(issue => {
      if (!issue.location?.latitude || !issue.location?.longitude) return;

      const color = STATUS_COLORS_MAP[issue.status] || '#6366f1';
      const radius = SEVERITY_RADIUS[issue.severity] || 8;

      const marker = L.circleMarker(
        [issue.location.latitude, issue.location.longitude],
        {
          radius,
          fillColor: color,
          color: color,
          weight: 2,
          opacity: 0.8,
          fillOpacity: 0.35,
        }
      ).addTo(map);

      marker.bindPopup(`
        <div style="min-width: 200px; font-family: Inter, sans-serif;">
          <div style="font-size: 13px; font-weight: 700; color: #f8fafc; margin-bottom: 6px;">${issue.title}</div>
          <div style="font-size: 11px; color: #94a3b8; margin-bottom: 8px;">${issue.location.address || ''}</div>
          <div style="display: flex; gap: 6px; margin-bottom: 8px;">
            <span style="padding: 2px 8px; border-radius: 99px; font-size: 10px; font-weight: 600; background: ${color}22; color: ${color}; border: 1px solid ${color}33;">${issue.status}</span>
            <span style="padding: 2px 8px; border-radius: 99px; font-size: 10px; font-weight: 600; background: #334155; color: #94a3b8;">Priority: ${issue.priorityScore}</span>
          </div>
          <div style="font-size: 11px; color: #64748b;">${issue.department || ''}</div>
        </div>
      `, { className: '' });

      marker.on('click', () => setSelectedIssue(issue));
      markersRef.current.push(marker);
    });

    mapInstanceRef.current = map;
    setMapReady(true);

    // Force resize after render
    setTimeout(() => map.invalidateSize(), 100);
  }

  // Load Leaflet script if not already available
  useEffect(() => {
    if (window.L) return;
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      if (issues.length > 0) initMap();
    };
    document.head.appendChild(script);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-civic-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-white">City Issue Map</h2>
          <p className="text-sm text-slate-400">{issues.length} issues mapped across Pune</p>
        </div>
        <div className="flex items-center gap-3">
          {Object.entries(STATUS_COLORS_MAP).map(([status, color]) => (
            <div key={status} className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
              {status}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Map */}
        <div className="lg:col-span-3 glass rounded-2xl overflow-hidden" style={{ height: '520px' }}>
          <div ref={mapRef} className="w-full h-full" />
        </div>

        {/* Issue sidebar */}
        <div className="glass rounded-2xl p-4 overflow-y-auto" style={{ maxHeight: '520px' }}>
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-civic-400" /> Issues
          </h3>
          <div className="space-y-2">
            {issues.map(issue => (
              <button
                key={issue.id}
                onClick={() => {
                  setSelectedIssue(issue);
                  if (mapInstanceRef.current && issue.location) {
                    mapInstanceRef.current.setView(
                      [issue.location.latitude, issue.location.longitude], 15
                    );
                  }
                }}
                className={`w-full text-left p-3 rounded-xl transition-all text-sm
                  ${selectedIssue?.id === issue.id
                    ? 'bg-civic-600/20 border border-civic-500/30'
                    : 'bg-slate-800/40 hover:bg-slate-800/60 border border-transparent'}
                `}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: STATUS_COLORS_MAP[issue.status] }}
                  />
                  <span className="text-xs text-white font-medium truncate">{issue.title}</span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">{issue.location?.address}</p>
              </button>
            ))}
          </div>

          {selectedIssue && (
            <button
              onClick={() => onViewIssue(selectedIssue.id)}
              className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-civic-600 hover:bg-civic-500 text-white text-xs font-semibold transition-colors"
            >
              View Details <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
