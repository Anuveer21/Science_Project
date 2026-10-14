/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { CropAnalysisResult } from '../types.ts';
import { SAMPLE_CROPS, SampleCrop, generateCropCanvasPng } from '../data/sampleCrops.ts';
import {
  Upload,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  FileImage,
  RefreshCw,
  Search,
  ExternalLink,
  Info,
} from 'lucide-react';

interface CropMonitoringSectionProps {
  analyses: CropAnalysisResult[];
  onNewAnalysis: (result: CropAnalysisResult) => void;
  selectedAnalysis: CropAnalysisResult | null;
  onSelectAnalysis: (result: CropAnalysisResult | null) => void;
}

export const CropMonitoringSection: React.FC<CropMonitoringSectionProps> = ({
  analyses,
  onNewAnalysis,
  selectedAnalysis,
  onSelectAnalysis,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [fileMime, setFileMime] = useState<string>('image/jpeg');
  const [loading, setLoading] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrorMessage('Invalid file format. Please upload a JPEG, PNG, or WebP image.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File exceeds 10MB limit. Please provide a smaller image.');
      return;
    }

    setErrorMessage(null);
    setSelectedFileName(file.name);
    setFileMime(file.type);

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Load a sample specimen
  const handleLoadSample = (sample: SampleCrop) => {
    setErrorMessage(null);
    setSelectedFileName(sample.filename);
    setFileMime('image/png');
    const pngUrl = generateCropCanvasPng(sample.id);
    setPreviewUrl(pngUrl);
  };

  // Execute Gemini vision analysis
  const handleAnalyze = async () => {
    if (!previewUrl) return;

    setLoading(true);
    setErrorMessage(null);
    setAnalysisStep('Encoding crop image payload...');

    try {
      setAnalysisStep('Submitting to Gemini 3.8 Flash agronomic model...');

      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: previewUrl,
          mimeType: fileMime === 'image/svg+xml' ? 'image/png' : fileMime,
          filename: selectedFileName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process crop analysis request.');
      }

      setAnalysisStep('Verifying structured agronomic observations...');

      const newResult: CropAnalysisResult = {
        id: data.id,
        timestamp: data.timestamp,
        imageName: data.imageName,
        imageDataUrl: previewUrl,
        plant_identification: data.plant_identification,
        observed_symptoms: data.observed_symptoms || [],
        possible_issues: data.possible_issues || [],
        condition_summary: data.condition_summary,
        recommendations: data.recommendations || [],
        uncertainty_notes: data.uncertainty_notes,
        requires_expert_review: Boolean(data.requires_expert_review),
        model: data.model || 'gemini-3.8-flash',
      };

      onNewAnalysis(newResult);
      onSelectAnalysis(newResult);
      setAnalysisStep('');
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setErrorMessage(
        err.message || 'Error occurred while communicating with Gemini API.'
      );
    } finally {
      setLoading(false);
      setAnalysisStep('');
    }
  };

  const currentDisplay = selectedAnalysis || (analyses.length > 0 ? analyses[0] : null);

  const filteredAnalyses = analyses.filter(
    (a) =>
      a.plant_identification.toLowerCase().includes(filterQuery.toLowerCase()) ||
      a.condition_summary.toLowerCase().includes(filterQuery.toLowerCase()) ||
      a.imageName.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-neutral-900">
          Crop Monitoring Station
        </h2>
        <p className="text-sm text-neutral-500">
          Upload leaf and canopy imagery for objective symptom isolation and hypothesis generation via Gemini 3.8 Flash.
        </p>
      </div>

      {/* Main Grid: Upload & Controls (Left) + Analysis Output (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Upload & Presets (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="font-semibold text-neutral-900 text-sm">
              Input Crop Imagery
            </h3>

            {/* Dropzone container */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-neutral-300 hover:border-emerald-700 rounded-xl p-6 text-center cursor-pointer transition-colors bg-neutral-50/50 hover:bg-neutral-50 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
              <Upload className="w-8 h-8 text-neutral-400 group-hover:text-emerald-800 mx-auto mb-2 transition-colors" />
              <div className="text-sm font-medium text-neutral-700">
                Click to browse or drop an image
              </div>
              <div className="text-xs text-neutral-400 mt-1">
                JPEG, PNG, or WebP up to 10MB
              </div>
            </div>

            {/* Sample Specimens Selector for fast competition testing */}
            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <div className="text-xs font-medium text-neutral-500 flex items-center justify-between">
                <span>Or load test competition specimen:</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {SAMPLE_CROPS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleLoadSample(sample)}
                    className="p-2 text-left rounded-lg border border-neutral-200 hover:border-emerald-700 hover:bg-emerald-50/40 text-xs transition-colors"
                  >
                    <div className="font-medium text-neutral-900 truncate">
                      {sample.title}
                    </div>
                    <div className="text-neutral-400 text-[11px] truncate mt-0.5">
                      {sample.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* OV7670 Autonomous Ingestion Bridge Info */}
            <div className="pt-3 border-t border-neutral-100 text-xs space-y-2">
              <div className="flex items-center justify-between text-neutral-700">
                <span className="font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  OV7670 Camera Auto-Ingest
                </span>
                <span className="font-mono text-[11px] text-neutral-400">
                  POST /api/patrol/capture
                </span>
              </div>
              <p className="text-neutral-500 text-[11px] leading-relaxed">
                Arduino patrol car automatically transmits 640x480 VGA frames via Wi-Fi HTTP POST. The backend triggers Gemini diagnosis and updates this screen automatically.
              </p>
              <button
                type="button"
                disabled={loading}
                onClick={async () => {
                  setLoading(true);
                  setErrorMessage(null);
                  setAnalysisStep('Simulating incoming OV7670 patrol car transmission...');
                  try {
                    const testPng = generateCropCanvasPng('blight');
                    const res = await fetch('/api/patrol/capture', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        image: testPng,
                        mimeType: 'image/png',
                        filename: 'ov7670_live_waypoint_3.jpg',
                      }),
                    });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.error || 'Auto-capture failed');
                    onNewAnalysis({ ...data.diagnosis, imageDataUrl: testPng });
                    onSelectAnalysis({ ...data.diagnosis, imageDataUrl: testPng });
                  } catch (err: any) {
                    setErrorMessage(err.message || 'Auto-capture test failed.');
                  } finally {
                    setLoading(false);
                    setAnalysisStep('');
                  }
                }}
                className="w-full py-1.5 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-medium transition-colors border border-neutral-200"
              >
                Test Simulate Incoming OV7670 Transmission
              </button>
            </div>

            {/* Selected image preview */}
            {previewUrl && (
              <div className="pt-3 border-t border-neutral-100 space-y-3">
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span className="truncate max-w-[200px] font-mono">
                    {selectedFileName || 'crop_image.jpg'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewUrl(null);
                      setSelectedFileName('');
                    }}
                    className="text-neutral-400 hover:text-neutral-700"
                  >
                    Clear
                  </button>
                </div>
                <div className="relative rounded-lg overflow-hidden border border-neutral-200 aspect-video bg-neutral-900">
                  <img
                    src={previewUrl}
                    alt="Selected crop preview"
                    className="w-full h-full object-contain"
                  />
                </div>

                <button
                  type="button"
                  disabled={loading}
                  onClick={handleAnalyze}
                  className="w-full py-2.5 px-4 text-sm font-medium text-white bg-emerald-900 hover:bg-emerald-800 disabled:bg-neutral-300 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing Specimen...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Run Gemini Vision Diagnosis
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Live Progress Indicator */}
            {loading && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 space-y-1">
                <div className="font-medium flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-800" />
                  <span>AI Analysis in progress</span>
                </div>
                <p className="text-emerald-700">{analysisStep}</p>
              </div>
            )}

            {/* Error Message banner */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <div>
                  <div className="font-semibold">Analysis Failed</div>
                  <p className="mt-0.5">{errorMessage}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Diagnostic Results (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {currentDisplay ? (
            <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-5">
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-neutral-100">
                <div>
                  <div className="text-xs text-neutral-400 font-mono">
                    Analysis ID: {currentDisplay.id} · {new Date(currentDisplay.timestamp).toLocaleString()}
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mt-1">
                    {currentDisplay.plant_identification}
                  </h3>
                  <div className="text-sm text-neutral-600 mt-0.5">
                    {currentDisplay.condition_summary}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  {currentDisplay.requires_expert_review ? (
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      Expert Review Required
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Routine Assessment
                    </div>
                  )}
                  <div className="text-[11px] text-neutral-400 font-mono mt-1">
                    Model: {currentDisplay.model}
                  </div>
                </div>
              </div>

              {/* Observed Symptoms vs Possible Issues */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Directly Observed Symptoms */}
                <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2">
                  <div className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
                    Observed Symptoms (Visual Evidence)
                  </div>
                  <ul className="text-xs text-neutral-700 space-y-1.5 list-disc list-inside">
                    {currentDisplay.observed_symptoms.map((symptom, i) => (
                      <li key={i}>{symptom}</li>
                    ))}
                  </ul>
                </div>

                {/* 2. Hypothesized Issues */}
                <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2">
                  <div className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
                    Possible Explanations (Hypotheses)
                  </div>
                  <ul className="text-xs text-neutral-700 space-y-1.5 list-disc list-inside">
                    {currentDisplay.possible_issues.map((issue, i) => (
                      <li key={i}>{issue}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommended Next Steps */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
                  Actionable Agronomic Recommendations
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentDisplay.recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="p-3 bg-emerald-50/50 border border-emerald-200/60 rounded-lg text-xs text-neutral-800"
                    >
                      {rec}
                    </div>
                  ))}
                </div>
              </div>

              {/* Uncertainty Notes & Diagnostic Boundaries */}
              <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-lg space-y-1.5 text-xs text-amber-950">
                <div className="font-semibold flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Uncertainty & Diagnostic Limitations</span>
                </div>
                <p className="text-neutral-700 leading-relaxed">
                  {currentDisplay.uncertainty_notes}
                </p>
                <p className="text-[11px] text-amber-800 pt-1">
                  * Photographic analysis cannot substitute for PCR pathogen assay or leaf tissue nutritional chemistry testing.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center shadow-xs">
              <FileImage className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-neutral-700">
                No Diagnostic Output
              </h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
                Select an image on the left or choose a sample test specimen to execute Gemini 3.8 Flash crop health analysis.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* History Log Section */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-neutral-900">Crop Analysis Session History</h3>
            <p className="text-xs text-neutral-500">
              Archived diagnostic records from this session
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter by crop or issue..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-800"
            />
          </div>
        </div>

        {filteredAnalyses.length === 0 ? (
          <div className="text-xs text-neutral-400 text-center py-6">
            No analyses match the filter query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider font-medium border-b border-neutral-200">
                <tr>
                  <th className="py-2.5 px-3">Specimen</th>
                  <th className="py-2.5 px-3">Plant Identification</th>
                  <th className="py-2.5 px-3">Condition Summary</th>
                  <th className="py-2.5 px-3">Review Flag</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredAnalyses.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-neutral-50/70 transition-colors"
                  >
                    <td className="py-2.5 px-3">
                      <img
                        src={item.imageDataUrl}
                        alt="Crop thumbnail"
                        className="w-8 h-8 rounded-md object-cover border border-neutral-200"
                      />
                    </td>
                    <td className="py-2.5 px-3 font-medium text-neutral-900">
                      {item.plant_identification}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-600">
                      {item.condition_summary}
                    </td>
                    <td className="py-2.5 px-3">
                      {item.requires_expert_review ? (
                        <span className="text-amber-800 font-medium">Expert Review</span>
                      ) : (
                        <span className="text-emerald-800">Routine</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-neutral-400">
                      {new Date(item.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectAnalysis(item)}
                        className="text-emerald-800 hover:text-emerald-950 font-semibold inline-flex items-center gap-1"
                      >
                        Inspect <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
