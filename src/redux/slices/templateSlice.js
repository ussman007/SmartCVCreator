import { createSlice } from '@reduxjs/toolkit';

const initialTemplates = [
  {
    id: '1',
    name: 'Professional Modern',
    description: 'Clean and modern design perfect for any professional field',
    preview: 'modern-template.png',
    sections: ['personal', 'experience', 'education', 'skills', 'languages'],
    color: '#2563eb'
  },
  {
    id: '2',
    name: 'Creative Design',
    description: 'Stand out with this creative template design',
    preview: 'creative-template.png',
    sections: ['personal', 'portfolio', 'experience', 'skills', 'interests'],
    color: '#4f46e5'
  },
  {
    id: '3',
    name: 'Classic Professional',
    description: 'Traditional and elegant design for corporate environments',
    preview: 'classic-template.png',
    sections: ['personal', 'summary', 'experience', 'education', 'skills'],
    color: '#1e293b'
  }
];

const templateSlice = createSlice({
  name: 'templates',
  initialState: {
    templates: initialTemplates,
    selectedTemplate: null,
    loading: false,
    error: null
  },
  reducers: {
    setSelectedTemplate: (state, action) => {
      state.selectedTemplate = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setSelectedTemplate, setLoading, setError } = templateSlice.actions;

// Selectors
export const selectAllTemplates = (state) => state.templates.templates;
export const selectSelectedTemplate = (state) => state.templates.selectedTemplate;
export const selectTemplateLoading = (state) => state.templates.loading;
export const selectTemplateError = (state) => state.templates.error;

export default templateSlice.reducer; 