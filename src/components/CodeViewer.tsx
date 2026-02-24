import React, { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-markdown';
import { GeneratedFile } from '../types';

interface CodeViewerProps {
  file: GeneratedFile;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ file }) => {
  useEffect(() => {
    try {
      Prism.highlightAll();
    } catch (e) {
      console.error("Prism highlighting failed", e);
    }
  }, [file]);

  const langClass = `language-${file.language === 'typescript' ? 'tsx' : file.language}`;

  return (
    <div className="flex flex-col h-full bg-white border border-[#141414]">
      <div className="col-header flex justify-between items-center bg-[#f0f0f0]">
        <span>{file.path}</span>
        <span className="text-[10px] opacity-50 uppercase">{file.language}</span>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <pre className={langClass}>
          <code className={langClass}>
            {file.content}
          </code>
        </pre>
      </div>
    </div>
  );
};
