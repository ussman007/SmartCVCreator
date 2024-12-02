import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    summary: ''
  },
  experience: [],
  education: [],
  skills: [],
  languages: [],
  interests: [],
  projects: [],
  certifications: [],
  loading: false,
  error: null,
  currentStep: 1,
  totalSteps: 5
};

const cvSlice = createSlice({
  name: 'cv',
  initialState,
  reducers: {
    updatePersonalInfo: (state, action) => {
      state.personalInfo = { ...state.personalInfo, ...action.payload };
    },
    addExperience: (state, action) => {
      state.experience.push(action.payload);
    },
    updateExperience: (state, action) => {
      const { index, data } = action.payload;
      state.experience[index] = data;
    },
    removeExperience: (state, action) => {
      state.experience.splice(action.payload, 1);
    },
    addEducation: (state, action) => {
      state.education.push(action.payload);
    },
    updateEducation: (state, action) => {
      const { index, data } = action.payload;
      state.education[index] = data;
    },
    removeEducation: (state, action) => {
      state.education.splice(action.payload, 1);
    },
    updateSkills: (state, action) => {
      state.skills = action.payload;
    },
    updateLanguages: (state, action) => {
      state.languages = action.payload;
    },
    updateInterests: (state, action) => {
      state.interests = action.payload;
    },
    addProject: (state, action) => {
      state.projects.push(action.payload);
    },
    updateProject: (state, action) => {
      const { index, data } = action.payload;
      state.projects[index] = data;
    },
    removeProject: (state, action) => {
      state.projects.splice(action.payload, 1);
    },
    addCertification: (state, action) => {
      state.certifications.push(action.payload);
    },
    updateCertification: (state, action) => {
      const { index, data } = action.payload;
      state.certifications[index] = data;
    },
    removeCertification: (state, action) => {
      state.certifications.splice(action.payload, 1);
    },
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    resetCV: (state) => {
      return initialState;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const {
  updatePersonalInfo,
  addExperience,
  updateExperience,
  removeExperience,
  addEducation,
  updateEducation,
  removeEducation,
  updateSkills,
  updateLanguages,
  updateInterests,
  addProject,
  updateProject,
  removeProject,
  addCertification,
  updateCertification,
  removeCertification,
  setCurrentStep,
  resetCV,
  setLoading,
  setError
} = cvSlice.actions;

// Selectors
export const selectPersonalInfo = (state) => state.cv.personalInfo;
export const selectExperience = (state) => state.cv.experience;
export const selectEducation = (state) => state.cv.education;
export const selectSkills = (state) => state.cv.skills;
export const selectLanguages = (state) => state.cv.languages;
export const selectInterests = (state) => state.cv.interests;
export const selectProjects = (state) => state.cv.projects;
export const selectCertifications = (state) => state.cv.certifications;
export const selectCurrentStep = (state) => state.cv.currentStep;
export const selectCVLoading = (state) => state.cv.loading;
export const selectCVError = (state) => state.cv.error;

export default cvSlice.reducer; 