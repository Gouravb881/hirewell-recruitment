import React, { useState, useRef, useEffect, useCallback } from 'react';
import { UploadCloud, FileText, CheckCircle2, XCircle, Loader2, Play, Bell, Trash2, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MockDB } from '../utils/MockDatabase';
import { getActiveJobId, listCandidates, uploadCandidate } from '../api/matchingApi';
import UserMenu from '../components/UserMenu';

const CandidateQueue = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState(() => {
    const saved = localStorage.getItem("candidateFiles");
    return saved ? JSON.parse(saved) : [];
  });
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [jobId, setJobId] = useState(0);

  useEffect(() => {
    localStorage.setItem("candidateFiles", JSON.stringify(files));
  }, [files]);

  // Load existing candidates from DB
  const loadData = async (activeJobId) => {
    if (!activeJobId) {
      setFiles([]);
      return;
    }
    try {
      const data = await listCandidates(activeJobId);
      setFiles(
        data.map((c) => ({
          id: c.id,
          name: c.file_name,
          status: 'Ready',
          size: '-',
        })),
      );
    } catch (err) {
      console.warn("Backend unavailable, showing mock candidates:", err);
      // Fallback to MockDB candidates
      const mockData = MockDB.get();
      setFiles(
        mockData.candidates.map((c) => ({
          id: c.id,
          name: c.name,
          status: 'Ready',
          size: c.size || '-',
        })),
      );
    }
  };

  useEffect(() => {
    const id = getActiveJobId() || 1; // Fallback to 1 for simulation mode
    setJobId(id);
    loadData(id);
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const processFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    
    let currentJobId = jobId;
    if (!currentJobId) {
      const { getActiveJobId } = await import('../api/matchingApi');
      currentJobId = getActiveJobId() || 1; // Fallback to 1 for simulation mode
      setJobId(currentJobId);
    }

    const allowedExtensions = [".pdf", ".docx", ".txt", ".doc"];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validFiles = [];

    for (const file of Array.from(fileList)) {
      const fileName = file.name.toLowerCase();
      const isValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
      
      if (!isValidExtension) {
        alert(`Unsupported file format: ${file.name}. Please upload PDF, DOCX, or TXT resume only.`);
        continue;
      }

      if (file.size > maxSize) {
        alert(`File too large: ${file.name}. Maximum allowed size is 5MB.`);
        continue;
      }

      // Issue 3: Prevent duplicate files
      const isDuplicate = files.some(existing => 
        existing.name === file.name && 
        (existing.size === (file.size / 1024).toFixed(1) + ' KB' || existing.size === '-')
      );

      if (isDuplicate) {
        console.log(`Skipping duplicate file: ${file.name}`);
        continue;
      }
      
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setUploading(true);
    try {
      for (const file of validFiles) {
        try {
          await uploadCandidate(currentJobId, file);
        } catch (err) {
          console.warn("Backend upload failed, using local MockDB:", err);
          await MockDB.addCandidate(file);
        }
      }
      await loadData(currentJobId);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    processFiles(e.target.files);
    // Reset input so the same file can be re-selected
    e.target.value = '';
  };

  // Drag & Drop handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, []);

  const handleRemove = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    MockDB.removeCandidate(id);
  };

  const handleClearAll = () => {
    setFiles([]);
    localStorage.removeItem("candidateFiles");
    const data = MockDB.get();
    data.candidates = [];
    MockDB.save(data);
  };

  const uploadedCount = files.length;
  const readyCount = files.filter(f => f.status === 'Ready').length;

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto animate-fade-in-up">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-text mb-1 tracking-tight">Candidate Upload</h1>
          <p className="text-xs md:text-sm text-text-muted font-medium">
            {uploadedCount} files uploaded | {readyCount} ready for screening
          </p>
        </div>
        <div className="flex items-center gap-4 text-text">
          {files.length > 0 && (
            <button onClick={handleClearAll} className="flex items-center gap-2 bg-error-bg text-error px-4 py-2 rounded-xl text-xs font-bold">
              <Trash2 size={14} /> Clear All
            </button>
          )}
          <Bell size={20} />
          <UserMenu user={MockDB.get().user} />
        </div>
      </header>

      <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className="hidden" accept=".pdf,.docx,.txt,.doc" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="w-full lg:col-span-9 space-y-8 overflow-hidden">
          <div
            onClick={handleUploadClick}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`bg-white dark:bg-[#12122A] rounded-[32px] p-8 border-2 border-dashed text-center relative overflow-hidden cursor-pointer transition-all ${
              dragActive ? 'border-primary bg-primary-light/20' : 'border-primary/40'
            }`}
          >
            <UploadCloud className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-serif font-bold mb-2 text-text">{dragActive ? 'Drop your files here' : 'Upload Resume Files'}</h3>
            <p className="text-sm text-text-muted mb-4">Click to browse or drag and drop files.</p>
            {uploading && (
              <div className="absolute inset-0 bg-white/80 dark:bg-[#12122A]/80 flex items-center justify-center rounded-[32px] z-20">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <RefreshCw size={18} className="animate-spin" /> Processing files...
                </div>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-[#12122A] rounded-[32px] border border-border overflow-hidden">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h3 className="font-serif font-bold text-lg text-text">Candidate Batch Queue</h3>
              <span className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold">{files.length} Files</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="text-xs font-bold text-text-muted uppercase tracking-widest bg-surface-light/50">
                    <th className="py-4 pl-6">Batch ID</th>
                    <th className="py-4">File Name</th>
                    <th className="py-4">Size</th>
                    <th className="py-4">Parse Status</th>
                    <th className="py-4 pr-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file, i) => (
                    <tr key={file.id} className={`${i === files.length - 1 ? '' : 'border-b border-border'} text-text`}>
                      <td className="py-4 pl-6 text-sm font-bold text-text-muted">#{String(file.id).padStart(2, '0')}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-2 font-bold text-sm text-text">
                          <FileText size={16} /> {file.name}
                        </div>
                      </td>
                      <td className="py-4 text-xs text-text-muted font-bold">{file.size || '-'}</td>
                      <td className="py-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${file.status === 'Ready' ? 'bg-success-bg text-success' : 'bg-primary-light text-primary'}`}>
                          {file.status !== 'Ready' && <Loader2 size={12} className="animate-spin" />}
                          {file.status === 'Ready' && <CheckCircle2 size={12} />}
                          {file.status}
                        </span>
                      </td>
                      <td className="py-4 pr-6 text-right">
                        <button onClick={(e) => { e.stopPropagation(); handleRemove(file.id); }} className="p-1 text-text-muted hover:text-error transition-colors">
                          <XCircle size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {files.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-12 text-center text-text-muted italic">
                        No resumes uploaded yet. Click the upload zone above or drag files in.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <aside className="w-full lg:col-span-3 space-y-6">
          <div className="bg-[#10101A] rounded-[24px] p-6 text-white">
            <h4 className="text-xs font-bold uppercase opacity-60 mb-4">Upload Status</h4>
            <div className="text-4xl font-serif font-bold mb-1">{uploadedCount}</div>
            <div className="text-xs text-white/50 mb-4">Files in Database</div>
            <div className="text-xs mb-2">Ready: {readyCount}/{uploadedCount}</div>
          </div>
          <button
            onClick={() => {
              // Issue 1: JD check
              const activeJob = JSON.parse(localStorage.getItem("activeJob"));
              if (!activeJob || !activeJob.description || activeJob.description.length < 300) {
                alert("Please create and analyze a valid job description first.");
                return;
              }
              navigate('/scoring');
            }}
            disabled={readyCount === 0}
            className={`w-full py-4 rounded-[20px] font-bold transition-all flex items-center justify-center gap-2 ${readyCount === 0 ? 'bg-surface-light text-text-muted cursor-not-allowed border border-border' : 'bg-primary text-white'}`}
          >
            Initiate AI Screening <Play size={16} fill="currentColor" />
          </button>
          <button
            onClick={handleUploadClick}
            className="w-full py-4 rounded-[20px] font-bold bg-white dark:bg-[#12122A] border border-border text-text-mid flex items-center justify-center gap-2"
          >
            <UploadCloud size={16} /> Upload More Files
          </button>
        </aside>
      </div>
    </div>
  );
};

export default CandidateQueue;
