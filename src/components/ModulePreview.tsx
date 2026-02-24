import React from 'react';
import { Module, ModuleField } from '../types';
import { Plus, Search, Filter, MoreVertical, Edit2, Trash2, User, MapPin, Phone, CheckCircle2 } from 'lucide-react';

interface ModulePreviewProps {
  module: Module;
}

export const ModulePreview: React.FC<ModulePreviewProps> = ({ module }) => {
  if (module.type === 'auth') {
    return (
      <div className="bg-white border border-[#141414] p-8 max-w-sm mx-auto shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
        <h3 className="text-xl font-bold uppercase mb-6 text-center">Login to {module.name}</h3>
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase opacity-50 block mb-1">Email Address</label>
            <input type="text" disabled className="w-full border border-[#141414] p-2 text-sm bg-gray-50" placeholder="admin@example.com" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase opacity-50 block mb-1">Password</label>
            <input type="password" disabled className="w-full border border-[#141414] p-2 text-sm bg-gray-50" placeholder="••••••••" />
          </div>
          <button disabled className="w-full bg-[#141414] text-white py-3 text-xs font-bold uppercase tracking-widest mt-4">
            Sign In
          </button>
          <div className="text-center text-[10px] opacity-40 uppercase mt-4">
            Don't have an account? <span className="underline">Register</span>
          </div>
        </div>
      </div>
    );
  }

  if (module.type === 'crud') {
    const fields: ModuleField[] = module.fields && module.fields.length > 0 ? module.fields : [
      { name: 'id', label: 'ID', type: 'number', required: true },
      { name: 'name', label: 'Name', type: 'string', required: true },
      { name: 'description', label: 'Description', type: 'string', required: false }
    ];
    
    return (
      <div className="flex flex-col h-full bg-white border border-[#141414] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#141414] flex justify-between items-center bg-[#f9f9f9]">
          <div>
            <h3 className="text-2xl font-serif italic">{module.name} Management</h3>
            <p className="text-[10px] uppercase font-bold opacity-40">System // Modular // CRUD // {fields.length} Fields</p>
          </div>
          <button className="bg-[#141414] text-white px-6 py-3 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <Plus size={14} />
            Add New {module.name}
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-[#141414] flex justify-between items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={14} />
            <input type="text" placeholder={`Search ${module.name.toLowerCase()}...`} className="w-full pl-10 pr-4 py-2 border border-[#141414] text-xs focus:outline-none" />
          </div>
          <div className="flex gap-2">
            <button className="border border-[#141414] p-2 hover:bg-gray-50"><Filter size={14} /></button>
            <button className="border border-[#141414] p-2 hover:bg-gray-50"><MoreVertical size={14} /></button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-[#141414]">
                <th className="p-4 text-[10px] font-bold uppercase opacity-40">#</th>
                {fields.map(f => (
                  <th key={f.name} className="p-4 text-[10px] font-bold uppercase opacity-40">{f.label}</th>
                ))}
                <th className="p-4 text-[10px] font-bold uppercase opacity-40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map(i => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-xs font-mono opacity-40">{i}</td>
                  {fields.map(f => (
                    <td key={f.name} className="p-4 text-xs">
                      {renderMockValue(f, i)}
                    </td>
                  ))}
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 border border-gray-200 hover:border-[#141414] transition-colors"><Edit2 size={12} /></button>
                      <button className="p-2 border border-gray-200 hover:border-red-500 text-red-500 transition-colors"><Trash2 size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-[#141414] flex justify-between items-center bg-[#f9f9f9]">
          <span className="text-[10px] font-mono opacity-40 uppercase">Showing 1 to 3 of 12 entries</span>
          <div className="flex gap-1">
            {[1, 2, 3].map(p => (
              <button key={p} className={`w-8 h-8 flex items-center justify-center text-[10px] font-mono border border-[#141414] ${p === 1 ? 'bg-[#141414] text-white' : 'hover:bg-white'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-12 text-center border border-dashed border-gray-300">
      <p className="text-xs opacity-40 uppercase tracking-widest">Custom Module Preview Not Available</p>
    </div>
  );
};

const renderMockValue = (field: ModuleField, index: number) => {
  const name = field.name.toLowerCase();
  
  if (name.includes('name')) {
    const names = ['John Doe', 'Jane Smith', 'Robert Johnson'];
    return (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center"><User size={10} /></div>
        {names[index - 1]}
      </div>
    );
  }
  
  if (name.includes('address') || name.includes('alamat')) {
    const addresses = ['123 Main St, Springfield', '456 Oak Ave, Metropolis', '789 Pine Rd, Gotham'];
    return (
      <div className="flex items-center gap-2 opacity-60">
        <MapPin size={10} />
        {addresses[index - 1]}
      </div>
    );
  }
  
  if (name.includes('phone') || name.includes('hp') || name.includes('tel')) {
    const phones = ['+62 812-3456-7890', '+62 857-1234-5678', '+62 819-9876-5432'];
    return (
      <div className="flex items-center gap-2 opacity-60">
        <Phone size={10} />
        {phones[index - 1]}
      </div>
    );
  }
  
  if (name.includes('status')) {
    return (
      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[9px] font-bold uppercase rounded-sm flex items-center gap-1 w-fit">
        <CheckCircle2 size={10} />
        Active
      </span>
    );
  }

  if (field.type === 'boolean') return index % 2 === 0 ? 'Yes' : 'No';
  if (field.type === 'number') return Math.floor(Math.random() * 1000);
  
  return `Sample ${field.label}`;
};
