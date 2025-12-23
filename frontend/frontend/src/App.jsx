// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

// import React, { useState, useEffect } from 'react';
// import { Upload, Settings2, Search, Split, BrainCircuit, Play, CheckCircle } from 'lucide-react';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
// import PipelineStep from './components/PipelineStep';
// import { uploadDataset, runPipeline, getEDA } from './api';

// function App() {
//   const [file, setFile] = useState(null);
//   const [fileInfo, setFileInfo] = useState(null);
//   const [targetCol, setTargetCol] = useState('');
//   const [preprocess, setPreprocess] = useState('None');
//   const [testSplit, setTestSplit] = useState(20);
//   const [model, setModel] = useState('Logistic Regression');
//   const [edaData, setEdaData] = useState(null);
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // 1. Upload Handler
//   const handleFileUpload = async (e) => {
//     const selectedFile = e.target.files[0];
//     if (!selectedFile) return;
//     setFile(selectedFile);
//     try {
//       const data = await uploadDataset(selectedFile);
//       setFileInfo(data);
//       // Auto-select last column as target default
//       if (data.columns.length > 0) handleTargetChange(data.columns[data.columns.length - 1], data.filename);
//     } catch (error) { alert("Upload failed"); }
//   };

//   // 2. Handle Target Change & Fetch EDA
//   const handleTargetChange = async (col, filenameOverride) => {
//     const fname = filenameOverride || fileInfo?.filename;
//     setTargetCol(col);
//     if (fname && col) {
//       try {
//         const stats = await getEDA(fname, col);
//         setEdaData(stats);
//       } catch (err) { console.error("EDA Failed", err); }
//     }
//   };

//   // 3. Run Pipeline
//   const handleRun = async () => {
//     setLoading(true);
//     try {
//       const config = {
//         filename: fileInfo.filename,
//         target_column: targetCol,
//         preprocessing: preprocess,
//         test_size: testSplit,
//         model: model
//       };
//       const data = await runPipeline(config);
//       setResult(data);
//     } catch (error) { alert("Pipeline Error: " + error.message); }
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 p-8 font-sans">
//       <div className="max-w-3xl mx-auto space-y-8">
        
//         {/* Header */}
//         <header className="text-center mb-10">
//           <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">ML Pipeline Builder</h1>
//           <p className="text-slate-500 mt-2">No-code workflow: From Data to Deployment</p>
//         </header>

//         {/* STEP 1: Upload */}
//         <PipelineStep title="1. Upload Dataset" icon={Upload} isActive={true} isComplete={!!fileInfo}>
//           <div className="flex items-center gap-4">
//             <input type="file" accept=".csv,.xlsx" onChange={handleFileUpload}
//               className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"/>
//             {fileInfo && <span className="text-xs font-mono bg-green-100 text-green-700 px-2 py-1 rounded">
//               {fileInfo.rows} rows x {fileInfo.cols} cols
//             </span>}
//           </div>
//         </PipelineStep>

//         {/* STEP 2: Preprocessing */}
//         <PipelineStep title="2. Preprocessing" icon={Settings2} isActive={!!fileInfo} isComplete={!!targetCol}>
//           <div className="grid grid-cols-2 gap-6">
//             <div>
//               <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Target Column</label>
//               <select className="w-full border-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//                 value={targetCol} onChange={(e) => handleTargetChange(e.target.value)} disabled={!fileInfo}>
//                 {fileInfo?.columns.map(c => <option key={c} value={c}>{c}</option>)}
//               </select>
//             </div>
//             <div>
//               <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Scaling Strategy</label>
//               <select className="w-full border-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//                 value={preprocess} onChange={(e) => setPreprocess(e.target.value)}>
//                 <option value="None">No Scaling</option>
//                 <option value="StandardScaler">StandardScaler (Z-Score)</option>
//                 <option value="MinMaxScaler">MinMaxScaler (0-1)</option>
//               </select>
//             </div>
//           </div>
//         </PipelineStep>

//         {/* STEP 3: EDA (New Feature) */}
//         {edaData?.distribution && (
//           <PipelineStep title="3. Exploratory Data Analysis (EDA)" icon={Search} isActive={true} isComplete={true}>
//             <div className="mt-2">
//               <p className="text-xs text-slate-400 mb-2 text-center">
//                 Target Class Distribution ({edaData.distribution.length} classes found)
//               </p>
              
//               {/* WE USE INLINE STYLES TO FORCE HEIGHT - THIS CANNOT FAIL */}
//               <div style={{ width: '100%', height: '300px' }}>
//                 <ResponsiveContainer>
//                   <BarChart data={edaData.distribution} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
//                     <XAxis dataKey="name" tick={{fontSize: 12}} />
//                     <YAxis />
//                     <Tooltip />
//                     <Bar dataKey="value" fill="#3b82f6" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </PipelineStep>
//         )}

//         {/* STEP 4: Split */}
//         <PipelineStep title="4. Train-Test Split" icon={Split} isActive={!!edaData} isComplete={true}>
//           <div className="px-2">
//             <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
//               <span>Train: {100 - testSplit}%</span>
//               <span>Test: {testSplit}%</span>
//             </div>
//             <input type="range" min="10" max="50" value={testSplit} onChange={(e) => setTestSplit(e.target.value)}
//               className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
//           </div>
//         </PipelineStep>

//         {/* STEP 5: Model Selection */}
//         <PipelineStep title="5. Model Training" icon={BrainCircuit} isActive={true} isComplete={true}>
//            <div className="flex gap-4">
//             {['Logistic Regression', 'Decision Tree'].map((m) => (
//               <button key={m} onClick={() => setModel(m)}
//                 className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all border ${
//                   model === m ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105' 
//                               : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
//                 }`}>
//                 {m}
//               </button>
//             ))}
//           </div>
//         </PipelineStep>

//         {/* EXECUTE */}
//         <div className="flex justify-center pt-4">
//           <button onClick={handleRun} disabled={!fileInfo || loading}
//             className="group flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-4 rounded-full font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-1">
//             {loading ? "Training Model..." : "Run Pipeline"}
//             {!loading && <Play size={20} className="fill-current" />}
//           </button>
//         </div>

//         {/* RESULTS */}
//         {result && (
//           <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100 animate-in fade-in slide-in-from-bottom-4">
//             <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
//               <CheckCircle className="text-green-500" size={28} />
//               <h2 className="text-2xl font-bold text-slate-800">Results Summary</h2>
//             </div>
            
//             <div className="grid md:grid-cols-2 gap-10">
//               {/* Metrics */}
//               <div className="space-y-6">
//                 <div>
//                   <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Model Accuracy</p>
//                   <p className={`text-5xl font-extrabold mt-1 ${result.accuracy > 80 ? 'text-green-500' : 'text-yellow-500'}`}>
//                     {result.accuracy}%
//                   </p>
//                 </div>
//                 <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm text-slate-600">
//                   <div className="flex justify-between"><span>Training Samples:</span> <b>{result.train_samples}</b></div>
//                   <div className="flex justify-between"><span>Testing Samples:</span> <b>{result.test_samples}</b></div>
//                 </div>
//               </div>

//               {/* Confusion Matrix Visualization */}
//               <div>
//                 <p className="text-xs font-bold text-slate-400 uppercase mb-3 text-center">Confusion Matrix (Test Set)</p>
//                 <div className="grid grid-cols-2 gap-1 border-2 border-slate-100 rounded-lg overflow-hidden">
//                   {/* Simplistic 2x2 render for demo - meant for binary/small class */}
//                   {result.confusion_matrix.slice(0,2).map((row, i) => 
//                     row.slice(0,2).map((val, j) => (
//                       <div key={`${i}-${j}`} className={`p-4 text-center flex flex-col justify-center h-24 ${
//                         i === j ? 'bg-blue-50 text-blue-800' : 'bg-red-50 text-red-800'
//                       }`}>
//                         <span className="text-2xl font-bold">{val}</span>
//                         <span className="text-[10px] uppercase opacity-60">
//                           {i === j ? 'Correct' : 'Misclassified'}
//                         </span>
//                       </div>
//                     ))
//                   )}
//                 </div>
//                 <p className="text-[10px] text-center text-slate-400 mt-2">
//                   *Top-left/Bottom-right are correct predictions
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;

import React, { useState, useEffect } from 'react';
import { Upload, Settings2, Search, Split, BrainCircuit, Play, CheckCircle, AlertCircle, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import PipelineStep from './components/PipelineStep';
import { uploadDataset, runPipeline, getEDA } from './api';

function App() {
  const [file, setFile] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [targetCol, setTargetCol] = useState('');
  const [preprocess, setPreprocess] = useState('None');
  const [testSplit, setTestSplit] = useState(20);
  const [model, setModel] = useState('Logistic Regression');
  const [edaData, setEdaData] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1); // UX: Track active step

  // 1. Upload Handler
  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    try {
      const data = await uploadDataset(selectedFile);
      setFileInfo(data);
      if (data.columns.length > 0) handleTargetChange(data.columns[data.columns.length - 1], data.filename);
      setActiveStep(2); // Auto-advance
    } catch (error) { alert("Upload failed"); }
  };

  // 2. Handle Target Change
  const handleTargetChange = async (col, filenameOverride) => {
    const fname = filenameOverride || fileInfo?.filename;
    setTargetCol(col);
    if (fname && col) {
      try {
        const stats = await getEDA(fname, col);
        setEdaData(stats);
        setActiveStep(4); // Skip to split after loading EDA
      } catch (err) { console.error("EDA Failed", err); }
    }
  };

  // 3. Run Pipeline
  const handleRun = async () => {
    setLoading(true);
    try {
      const config = {
        filename: fileInfo.filename,
        target_column: targetCol,
        preprocessing: preprocess,
        test_size: testSplit,
        model: model
      };
      const data = await runPipeline(config);
      setResult(data);
      setActiveStep(6); // Final state
    } catch (error) { alert("Pipeline Error: " + error.message); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* 1. PROGRESS HEADER (Visual Flow) */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              No-Code ML Builder
            </h1>
            <span className="text-xs font-medium text-slate-400">
              Step {Math.min(activeStep, 5)} of 5
            </span>
          </div>
          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-500 ease-out" 
              style={{ width: `${(activeStep / 5) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 mt-8 space-y-8">
        
        {/* STEP 1: UPLOAD (Drag & Drop Feel) */}
        <PipelineStep title="1. Upload Data" icon={Upload} isActive={activeStep === 1} isComplete={activeStep > 1}>
          <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            fileInfo ? 'border-green-300 bg-green-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
          }`}>
            <input type="file" id="file-upload" className="hidden" accept=".csv,.xlsx" onChange={handleFileUpload} />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
              {fileInfo ? (
                <>
                  <CheckCircle className="text-green-600 mb-2" size={32} />
                  <p className="font-medium text-green-800">{fileInfo.filename}</p>
                  <p className="text-xs text-green-600 mt-1">{fileInfo.rows} rows • {fileInfo.cols} columns</p>
                </>
              ) : (
                <>
                  <Upload className="text-slate-400 mb-2" size={32} />
                  <p className="text-sm font-medium text-slate-600">Click to upload CSV or Excel</p>
                  <p className="text-xs text-slate-400 mt-1">Supports standard tabular data</p>
                </>
              )}
            </label>
          </div>
        </PipelineStep>

        {/* STEP 2: PREPROCESSING (Clean Selectors) */}
        <PipelineStep title="2. Preprocessing" icon={Settings2} isActive={activeStep >= 2} isComplete={activeStep > 2}>
           <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Variable</label>
              <select 
                className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow shadow-sm"
                value={targetCol} 
                onChange={(e) => handleTargetChange(e.target.value)} 
                disabled={!fileInfo}
              >
                {!targetCol && <option>Select column...</option>}
                {fileInfo?.columns.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <p className="text-[10px] text-slate-400">The column you want to predict (e.g., Species, Yes/No).</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Scaling Strategy</label>
              <select 
                className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow shadow-sm"
                value={preprocess} 
                onChange={(e) => setPreprocess(e.target.value)}
              >
                <option value="None">No Scaling</option>
                <option value="StandardScaler">StandardScaler (Z-Score)</option>
                <option value="MinMaxScaler">MinMaxScaler (0-1)</option>
              </select>
              <p className="text-[10px] text-slate-400">Helps models converge faster by standardizing range.</p>
            </div>
          </div>
        </PipelineStep>

        {/* STEP 3: EDA (Visually Distinct) */}
        {edaData?.distribution && (
          <PipelineStep title="3. Data Analysis" icon={BarChart3} isActive={activeStep >= 3} isComplete={activeStep > 3}>
             <div className="mt-2 bg-slate-50 rounded-xl p-4 border border-slate-100">
               <div className="flex items-center justify-between mb-4">
                 <p className="text-xs font-semibold text-slate-500 uppercase">Target Balance</p>
                 <span className="text-xs bg-white border px-2 py-1 rounded text-slate-500">{edaData.distribution.length} Classes</span>
               </div>
               
               {/* Forced Height Container */}
               <div style={{ width: '100%', height: '200px' }}>
                <ResponsiveContainer>
                  <BarChart data={edaData.distribution}>
                    <XAxis dataKey="name" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{borderRadius: '8px', border:'none', boxShadow:'0 10px 15px -3px rgb(0 0 0 / 0.1)'}} cursor={{fill: 'transparent'}} />
                    <Bar dataKey="value" radius={[4, 4, 4, 4]}>
                      {edaData.distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#4f46e5" : "#818cf8"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
               </div>
               <p className="text-[10px] text-center text-slate-400 mt-2">
                 *Ideally, bars should be roughly equal height for best results.
               </p>
             </div>
          </PipelineStep>
        )}

        {/* STEP 4: SPLIT & MODEL (Combined for Flow) */}
        <PipelineStep title="4. Training Config" icon={BrainCircuit} isActive={activeStep >= 4} isComplete={activeStep > 4}>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-slate-700">Train/Test Split</span>
                <span className="text-blue-600 font-bold">{100 - testSplit}% / {testSplit}%</span>
              </div>
              <input 
                type="range" min="10" max="50" value={testSplit} 
                onChange={(e) => setTestSplit(e.target.value)}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {['Logistic Regression', 'Decision Tree'].map((m) => (
                <button 
                  key={m} 
                  onClick={() => setModel(m)}
                  className={`py-3 px-4 rounded-lg text-sm font-medium transition-all border-2 ${
                    model === m 
                    ? 'border-blue-600 bg-blue-50 text-blue-700' 
                    : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </PipelineStep>

        {/* EXECUTE ACTION */}
        <div className="pt-4 flex justify-end">
          <button 
            onClick={handleRun} 
            disabled={!fileInfo || loading}
            className="group relative inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white transition-all duration-200 bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Training...
              </span>
            ) : (
              <span className="flex items-center gap-2">Build & Run Pipeline <Play size={18} /></span>
            )}
          </button>
        </div>

        {/* RESULTS CARD (Dashboard Style) */}
        {result && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="bg-slate-900 p-6 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-full"><CheckCircle className="text-green-400" size={24} /></div>
                <div>
                  <h3 className="text-lg font-bold">Training Complete</h3>
                  <p className="text-slate-400 text-xs">Model successfully trained and evaluated.</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-green-400">{result.accuracy}%</p>
                <p className="text-slate-400 text-xs uppercase tracking-wider">Accuracy</p>
              </div>
            </div>

            <div className="p-6 grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Dataset Split</h4>
                <div className="space-y-3">
                   <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                     <span className="text-sm text-slate-600">Training Samples</span>
                     <span className="font-mono font-bold text-slate-800">{result.train_samples}</span>
                   </div>
                   <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                     <span className="text-sm text-slate-600">Testing Samples</span>
                     <span className="font-mono font-bold text-slate-800">{result.test_samples}</span>
                   </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Confusion Matrix</h4>
                <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden border border-slate-200">
                   {result.confusion_matrix.slice(0,2).map((row, i) => 
                     row.slice(0,2).map((val, j) => (
                       <div key={`${i}-${j}`} className={`h-20 flex flex-col items-center justify-center ${i===j ? 'bg-blue-50' : 'bg-red-50'}`}>
                         <span className={`text-xl font-bold ${i===j ? 'text-blue-700' : 'text-red-700'}`}>{val}</span>
                       </div>
                     ))
                   )}
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-2 px-1">
                  <span>Actual Class</span>
                  <span>Predicted Class</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;