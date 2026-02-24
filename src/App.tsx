import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  Code2, 
  Play, 
  Download, 
  Cpu, 
  Layers, 
  ChevronRight, 
  Search,
  Loader2,
  FileCode,
  Globe,
  Database,
  Plus,
  Trash2,
  Settings,
  Layout
} from 'lucide-react';
import { generateModule } from './services/gemini';
import { ProjectState, TabType, GeneratedFile, Module } from './types';
import { CodeViewer } from './components/CodeViewer';
import { ModulePreview } from './components/ModulePreview';
import ReactMarkdown from 'react-markdown';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const INITIAL_STATE: ProjectState = {
  id: "default",
  name: "New Project",
  style: "Modern Minimalist (Clean, high contrast, Inter font)",
  modules: [],
  files: [],
  readme: `# 🚀 GopherScript Modular Architect
Welcome to your new project workspace. 

### Getting Started
1. **Define your Style**: Select a visual theme from the sidebar.
2. **Add Modules**: Use the architect input to describe features (e.g., "Add a User CRUD with profile pictures").
3. **Review Code**: Inspect the generated Go backend and React frontend in the 'Source Code' tab.
4. **Live Preview**: See a virtual representation of your modules in the 'Live Preview' tab.

### Production Readiness
- All generated code follows industry standard patterns.
- Data relationships are maintained across modules.
- Export your project as a ZIP to deploy to your own infrastructure.`,
  updatedAt: Date.now()
};

export default function App() {
  const [project, setProject] = useState<ProjectState>(() => {
    const saved = localStorage.getItem('gots_project');
    return saved ? JSON.parse(saved) : { ...INITIAL_STATE, id: Math.random().toString(36).substr(2, 9) };
  });
  const [workspace, setWorkspace] = useState<ProjectState[]>(() => {
    const saved = localStorage.getItem('gots_workspace');
    return saved ? JSON.parse(saved) : [];
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('modules');
  const [selectedFile, setSelectedFile] = useState<GeneratedFile | null>(null);
  const [selectedPreviewModuleId, setSelectedPreviewModuleId] = useState<string | null>(null);
  const [newModuleRequest, setNewModuleRequest] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem('gots_project', JSON.stringify(project));
  }, [project]);

  useEffect(() => {
    localStorage.setItem('gots_workspace', JSON.stringify(workspace));
  }, [workspace]);

  const handleExport = async () => {
    if (project.files.length === 0) return;
    
    const zip = new JSZip();
    
    // Add all files to zip
    project.files.forEach(file => {
      zip.file(file.path, file.content);
    });
    
    // Add metadata
    zip.file('architect_metadata.json', JSON.stringify({
      name: project.name,
      style: project.style,
      modules: project.modules,
      exportedAt: new Date().toISOString()
    }, null, 2));

    // Add README
    zip.file('README.md', project.readme);

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${project.name.toLowerCase().replace(/\s+/g, '-')}-source.zip`);
  };

  const saveToWorkspace = () => {
    const updatedProject = { ...project, updatedAt: Date.now() };
    setProject(updatedProject);
    setWorkspace(prev => {
      const exists = prev.find(p => p.id === updatedProject.id);
      if (exists) {
        return prev.map(p => p.id === updatedProject.id ? updatedProject : p);
      }
      return [updatedProject, ...prev];
    });
    alert('Project saved to workspace.');
  };

  const loadFromWorkspace = (p: ProjectState) => {
    setProject(p);
    setActiveTab('modules');
    setSelectedFile(null);
    setSelectedPreviewModuleId(null);
  };

  const deleteFromWorkspace = (id: string) => {
    if (confirm('Are you sure you want to delete this project from workspace?')) {
      setWorkspace(prev => prev.filter(p => p.id !== id));
    }
  };

  const createNewProject = () => {
    if (confirm('Start a new project? Current unsaved changes might be lost if not in workspace.')) {
      setProject({ ...INITIAL_STATE, id: Math.random().toString(36).substr(2, 9) });
      setActiveTab('modules');
      setSelectedFile(null);
      setSelectedPreviewModuleId(null);
    }
  };

  // Ensure a module is selected for preview if none is selected
  useEffect(() => {
    if (!selectedPreviewModuleId && project.modules.length > 0) {
      setSelectedPreviewModuleId(project.modules[0].id);
    }
  }, [project.modules, selectedPreviewModuleId]);

  const selectedPreviewModule = project.modules.find(m => m.id === selectedPreviewModuleId) || null;

  const styles = [
    "Modern Minimalist (Clean, high contrast, Inter font)",
    "Glassmorphism (Frosted glass, soft shadows, vibrant gradients)",
    "Neo-Brutalism (Bold borders, high saturation, thick shadows)",
    "Corporate Sleek (Professional, blue/slate tones, rounded corners)",
    "Dark Mode Luxury (Deep blacks, gold/emerald accents, serif fonts)"
  ];

  const handleAddModule = async () => {
    if (!newModuleRequest.trim()) return;
    setIsGenerating(true);
    setLogs(['Initializing modular architect...', 'Analyzing project dependencies...', 'Generating module code...']);
    
    const logInterval = setInterval(() => {
      const messages = [
        'Syncing backend models...',
        'Updating frontend routes...',
        'Injecting Tailwind components...',
        'Refactoring shared services...',
        'Finalizing module integration...'
      ];
      setLogs(prev => [...prev, messages[Math.floor(Math.random() * messages.length)]].slice(-5));
    }, 1500);

    try {
      const updatedProject = await generateModule(project, newModuleRequest);
      setProject(updatedProject);
      setNewModuleRequest('');
      setActiveTab('code');
      if (updatedProject.files.length > 0) {
        setSelectedFile(updatedProject.files[0]);
      }
      if (updatedProject.modules.length > 0) {
        setSelectedPreviewModuleId(updatedProject.modules[updatedProject.modules.length - 1].id);
      }
    } catch (error) {
      console.error(error);
      alert('Module generation failed. Please try again.');
    } finally {
      clearInterval(logInterval);
      setIsGenerating(false);
      setLogs([]);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset the entire project?')) {
      setProject(INITIAL_STATE);
      setActiveTab('modules');
      setSelectedFile(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-[#141414] bg-white px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#141414] flex items-center justify-center rounded-sm">
            <Cpu className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight uppercase">{project.name}</h1>
            <p className="text-[10px] opacity-50 uppercase tracking-widest font-mono">Modular Code Architect // v2.0</p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-[11px] font-mono uppercase opacity-70">
          <button 
            onClick={saveToWorkspace}
            className="text-emerald-600 hover:underline cursor-pointer font-bold"
          >
            [ Save Project ]
          </button>
          <button 
            onClick={handleReset}
            className="text-red-500 hover:underline cursor-pointer font-bold"
          >
            [ Reset System ]
          </button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            System Ready
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar / Module Management */}
        <div className="w-[400px] border-r border-[#141414] flex flex-col bg-[#f5f5f5]">
          <div className="col-header flex justify-between items-center">
            <span>Project Modules</span>
            <span className="text-[10px] opacity-50">{project.modules.length} Active</span>
          </div>
          
          <div className="flex-1 overflow-auto p-6 flex flex-col gap-6">
            {/* Project Settings */}
            <div className="flex flex-col gap-4 border-b border-gray-300 pb-6">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase font-bold opacity-60">Project Name</label>
                <input 
                  type="text"
                  value={project.name}
                  onChange={(e) => setProject(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 bg-white border border-[#141414] font-mono text-xs focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase font-bold opacity-60">Visual Style</label>
                <select 
                  value={project.style}
                  onChange={(e) => setProject(prev => ({ ...prev, style: e.target.value }))}
                  className="w-full p-2 bg-white border border-[#141414] font-mono text-xs focus:outline-none"
                >
                  {styles.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Module List */}
            <div className="flex flex-col gap-2">
              {project.modules.length === 0 ? (
                <div className="border border-dashed border-gray-400 p-8 text-center opacity-40">
                  <Layout className="mx-auto mb-2 opacity-20" size={24} />
                  <p className="text-[10px] uppercase font-bold">No modules added yet</p>
                </div>
              ) : (
                project.modules.map(mod => (
                  <div key={mod.id} className="bg-white border border-[#141414] p-4 flex flex-col gap-1 group relative">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono font-bold uppercase opacity-40">{mod.type}</span>
                      <Settings size={12} className="opacity-0 group-hover:opacity-30 cursor-pointer" />
                    </div>
                    <h3 className="text-sm font-bold uppercase">{mod.name}</h3>
                    <p className="text-[11px] opacity-60 line-clamp-2">{mod.description}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Module Input */}
            <div className="mt-auto flex flex-col gap-4 border-t border-gray-300 pt-6">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase font-bold opacity-60">Add New Feature / Module</label>
                <textarea 
                  value={newModuleRequest}
                  onChange={(e) => setNewModuleRequest(e.target.value)}
                  placeholder="e.g. Add a CRUD for 'Customers' with name, address, and phone..."
                  className="w-full h-32 p-4 bg-white border border-[#141414] font-mono text-sm focus:outline-none focus:ring-1 focus:ring-[#141414] resize-none"
                />
              </div>

              <button 
                onClick={handleAddModule}
                disabled={isGenerating || !newModuleRequest.trim()}
                className="w-full bg-[#141414] text-white py-4 flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase text-sm font-bold tracking-widest"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Architecting...
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Add Module
                  </>
                )}
              </button>

              {isGenerating && (
                <div className="p-3 bg-[#141414] text-[#00FF00] font-mono text-[10px] border border-[#141414] h-24 overflow-hidden">
                  {logs.map((log, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="opacity-50">[{new Date().toLocaleTimeString()}]</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Tabs */}
          <div className="flex border-b border-[#141414]">
            <button 
              onClick={() => setActiveTab('modules')}
              className={`px-6 py-3 text-[11px] uppercase font-bold tracking-widest border-r border-[#141414] transition-colors ${activeTab === 'modules' ? 'bg-[#141414] text-white' : 'hover:bg-gray-100'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('code')}
              disabled={project.files.length === 0}
              className={`px-6 py-3 text-[11px] uppercase font-bold tracking-widest border-r border-[#141414] transition-colors disabled:opacity-30 ${activeTab === 'code' ? 'bg-[#141414] text-white' : 'hover:bg-gray-100'}`}
            >
              Source Code
            </button>
            <button 
              onClick={() => setActiveTab('preview')}
              disabled={project.files.length === 0}
              className={`px-6 py-3 text-[11px] uppercase font-bold tracking-widest border-r border-[#141414] transition-colors disabled:opacity-30 ${activeTab === 'preview' ? 'bg-[#141414] text-white' : 'hover:bg-gray-100'}`}
            >
              Live Preview
            </button>
            <button 
              onClick={() => setActiveTab('workspace')}
              className={`px-6 py-3 text-[11px] uppercase font-bold tracking-widest border-r border-[#141414] transition-colors ${activeTab === 'workspace' ? 'bg-[#141414] text-white' : 'hover:bg-gray-100'}`}
            >
              Workspace
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab === 'modules' && (
                <motion.div 
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="h-full p-8 overflow-auto"
                >
                  <div className="max-w-4xl mx-auto">
                    <div className="col-header mb-6">README.md</div>
                    <div className="bg-white p-8 border border-[#141414] shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
                      <div className="markdown-body prose prose-slate max-w-none">
                        <ReactMarkdown>{project.readme}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'code' && project.files.length > 0 && (
                <motion.div 
                  key="code"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex"
                >
                  {/* File Tree */}
                  <div className="w-64 border-r border-[#141414] bg-[#f9f9f9] flex flex-col">
                    <div className="col-header flex justify-between items-center">
                      <span>Project Files</span>
                      <button onClick={handleExport} className="hover:opacity-60" title="Download ZIP">
                        <Download size={14} />
                      </button>
                    </div>
                    <div className="flex-1 overflow-auto p-2">
                      {/* Group by directory */}
                      {Array.from(new Set(project.files.map(f => f.path.split('/')[0]))).map(dir => (
                        <div key={dir} className="mb-4">
                          <div className="text-[10px] uppercase font-bold opacity-40 px-2 mb-1">{dir}</div>
                          {project.files.filter(f => f.path.startsWith(dir)).map(file => (
                            <button 
                              key={file.path}
                              onClick={() => setSelectedFile(file)}
                              className={`w-full text-left px-3 py-2 text-xs font-mono flex items-center gap-2 transition-colors ${selectedFile?.path === file.path ? 'bg-[#141414] text-white' : 'hover:bg-gray-200'}`}
                            >
                              {file.language === 'go' ? <Database size={14} /> : <Globe size={14} />}
                              {file.name}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Editor */}
                  <div className="flex-1 overflow-hidden">
                    {selectedFile && <CodeViewer file={selectedFile} />}
                  </div>
                </motion.div>
              )}

              {activeTab === 'preview' && project.files.length > 0 && (
                <motion.div 
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex overflow-hidden"
                >
                  {/* Module Selector for Preview */}
                  <div className="w-64 border-r border-[#141414] bg-[#f9f9f9] flex flex-col">
                    <div className="col-header">Select Page</div>
                    <div className="flex-1 overflow-auto p-2">
                      {project.modules.map(mod => (
                        <button 
                          key={mod.id}
                          onClick={() => setSelectedPreviewModuleId(mod.id)}
                          className={`w-full text-left px-3 py-2 text-xs font-mono flex items-center gap-2 transition-colors mb-1 ${selectedPreviewModuleId === mod.id ? 'bg-[#141414] text-white' : 'hover:bg-gray-200'}`}
                        >
                          <Layout size={14} />
                          {mod.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preview Area */}
                  <div className="flex-1 p-8 flex flex-col gap-6 overflow-auto bg-[#f0f0f0]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-[11px] font-mono opacity-50 ml-4 uppercase tracking-widest">Live System Preview</span>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={handleExport}
                          className="flex items-center gap-2 text-[11px] font-bold uppercase border border-[#141414] px-4 py-2 bg-white hover:bg-gray-100 transition-colors"
                        >
                          <Download size={14} />
                          Download ZIP
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex-1 border border-[#141414] bg-white shadow-[12px_12px_0px_0px_rgba(20,20,20,1)] overflow-hidden flex flex-col">
                      <div className="bg-[#141414] text-white px-4 py-2 text-[10px] font-mono flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Globe size={12} />
                          http://localhost:5173/{selectedPreviewModule?.name.toLowerCase().replace(/\s+/g, '-')}
                        </div>
                        <div className="opacity-50">SECURE SESSION // AES-256</div>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        {selectedPreviewModule ? (
                          <ModulePreview module={selectedPreviewModule} />
                        ) : (
                          <div className="h-full flex items-center justify-center text-center p-12">
                            <div>
                              <Layout className="w-16 h-16 opacity-10 mx-auto mb-4" />
                              <h3 className="text-xl font-serif italic">Select a module to preview</h3>
                              <p className="text-xs opacity-40 uppercase mt-2">The virtual renderer is ready</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'workspace' && (
                <motion.div 
                  key="workspace"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full p-8 overflow-auto bg-[#f9f9f9]"
                >
                  <div className="max-w-5xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <h2 className="text-3xl font-serif italic">Project Workspace</h2>
                        <p className="text-[10px] uppercase font-bold opacity-40 mt-1">Manage your saved architectural designs</p>
                      </div>
                      <button 
                        onClick={createNewProject}
                        className="bg-[#141414] text-white px-6 py-3 text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                      >
                        <Plus size={16} />
                        New Project
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {workspace.length === 0 ? (
                        <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-300 bg-white">
                          <Layers className="w-12 h-12 opacity-10 mx-auto mb-4" />
                          <p className="text-xs uppercase font-bold opacity-30 tracking-widest">Workspace is empty</p>
                          <p className="text-[10px] opacity-40 mt-2">Save your current project to see it here</p>
                        </div>
                      ) : (
                        workspace.map(p => (
                          <div 
                            key={p.id} 
                            className={`bg-white border-2 border-[#141414] p-6 flex flex-col gap-4 shadow-[6px_6px_0px_0px_rgba(20,20,20,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] transition-all ${p.id === project.id ? 'ring-4 ring-emerald-500/20' : ''}`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="text-[9px] font-mono font-bold uppercase opacity-30">
                                {new Date(p.updatedAt).toLocaleDateString()} // {new Date(p.updatedAt).toLocaleTimeString()}
                              </div>
                              {p.id === project.id && (
                                <span className="text-[8px] bg-emerald-500 text-white px-2 py-0.5 font-bold uppercase">Active</span>
                              )}
                            </div>
                            <div>
                              <h3 className="text-lg font-bold uppercase truncate">{p.name}</h3>
                              <p className="text-[10px] opacity-50 font-mono mt-1">{p.style}</p>
                            </div>
                            <div className="flex gap-4 mt-2">
                              <div className="flex flex-col">
                                <span className="text-[10px] font-bold uppercase opacity-30">Modules</span>
                                <span className="text-sm font-mono">{p.modules.length}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[10px] font-bold uppercase opacity-30">Files</span>
                                <span className="text-sm font-mono">{p.files.length}</span>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                              <button 
                                onClick={() => loadFromWorkspace(p)}
                                className="flex-1 bg-[#141414] text-white py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-opacity-90"
                              >
                                Load
                              </button>
                              <button 
                                onClick={() => deleteFromWorkspace(p.id)}
                                className="p-2 border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="border-t border-[#141414] bg-[#141414] text-white px-6 py-2 flex justify-between items-center font-mono text-[10px] uppercase tracking-widest">
        <div className="flex gap-6">
          <span>Status: {isGenerating ? 'Processing' : 'Idle'}</span>
          <span>Modules: {project.modules.length}</span>
          <span>Files: {project.files.length}</span>
        </div>
        <div>
          &copy; 2026 GopherScript Architect // All Rights Reserved
        </div>
      </footer>
    </div>
  );
}
