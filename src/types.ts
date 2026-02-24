export interface GeneratedFile {
  name: string;
  content: string;
  language: string;
  path: string;
}

export interface ModuleField {
  name: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'select';
  required: boolean;
}

export interface Module {
  id: string;
  name: string;
  type: 'crud' | 'auth' | 'custom';
  description: string;
  fields?: ModuleField[];
}

export interface ProjectState {
  id: string;
  name: string;
  style: string;
  modules: Module[];
  files: GeneratedFile[];
  readme: string;
  updatedAt: number;
}

export type TabType = 'modules' | 'code' | 'preview' | 'workspace';
