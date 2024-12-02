import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  Text,
  TextInput,
  Button,
  ProgressBar,
  IconButton,
  Portal,
  Modal,
  List,
  Card,
  Chip,
  HelperText,
  Menu,
} from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import {
  updatePersonalInfo,
  addEducation,
  addExperience,
  updateSkills,
  updateLanguages,
  addCertification,
  selectPersonalInfo,
  selectEducation,
  selectExperience,
  selectSkills,
  selectLanguages,
  selectCertifications,
} from '../redux/slices/cvSlice';
import { selectSelectedTemplate } from '../redux/slices/templateSlice';

const sections = [
  'Personal Info',
  'Education',
  'Experience',
  'Skills',
  'Languages',
  'Certifications',
];

const phoneRegExp = /^[0-9]{10}$/;
const proficiencyLevels = ['Basic', 'Intermediate', 'Advanced', 'Native/Fluent'];

const CVEditorScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [currentSection, setCurrentSection] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [showCertificationForm, setShowCertificationForm] = useState(false);
  const personalInfo = useSelector(selectPersonalInfo);
  const education = useSelector(selectEducation);
  const experience = useSelector(selectExperience);
  const skills = useSelector(selectSkills);
  const languages = useSelector(selectLanguages);
  const certifications = useSelector(selectCertifications);
  const selectedTemplate = useSelector(selectSelectedTemplate);
  const progress = Math.round((currentSection / (sections.length - 1)) * 100) / 100;
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerField, setDatePickerField] = useState(null);
  const [datePickerValue, setDatePickerValue] = useState(new Date());
  const [showProficiencyMenu, setShowProficiencyMenu] = useState(false);

  const getTemplateColor = () => selectedTemplate?.color || '#2563eb';

  const previewSectionTitleStyle = {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: getTemplateColor(),
  };

  const personalInfoSchema = Yup.object().shape({
    fullName: Yup.string()
      .min(2, 'Name is too short')
      .required('Full name is required'),
    email: Yup.string()
      .email('Invalid email')
      .required('Email is required'),
    phone: Yup.string()
      .matches(phoneRegExp, 'Phone number must be 10 digits')
      .required('Phone number is required'),
    address: Yup.string()
      .required('Address is required'),
    summary: Yup.string()
      .min(50, 'Summary should be at least 50 characters')
      .max(500, 'Summary should not exceed 500 characters')
      .required('Professional summary is required'),
  });

  const educationSchema = Yup.object().shape({
    institution: Yup.string().required('Institution name is required'),
    degree: Yup.string().required('Degree is required'),
    fieldOfStudy: Yup.string().required('Field of study is required'),
    startDate: Yup.string().required('Start date is required'),
    endDate: Yup.string(),
    grade: Yup.string(),
    description: Yup.string(),
  });

  const experienceSchema = Yup.object().shape({
    company: Yup.string().required('Company name is required'),
    position: Yup.string().required('Position is required'),
    startDate: Yup.string().required('Start date is required'),
    endDate: Yup.string(),
    location: Yup.string(),
    description: Yup.string(),
  });

  const skillsSchema = Yup.object().shape({
    name: Yup.string().required('Skill name is required'),
    level: Yup.string().required('Skill level is required'),
  });

  const languageSchema = Yup.object().shape({
    name: Yup.string().required('Language name is required'),
    proficiency: Yup.string().required('Proficiency level is required'),
  });

  const certificationSchema = Yup.object().shape({
    name: Yup.string().required('Certification name is required'),
    issuer: Yup.string().required('Issuer is required'),
    date: Yup.string().required('Date is required'),
    expiry: Yup.string(),
    description: Yup.string(),
  });

  // Check if template is selected
  if (!selectedTemplate) {
    navigation.replace('TemplateSelection');
    return null;
  }

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate && datePickerField) {
      const formattedDate = moment(selectedDate).format('MM/YYYY');
      datePickerField.setFieldValue(datePickerField.name, formattedDate);
    }
  };

  const renderDatePicker = (field, label, formProps) => (
    <View>
      <TextInput
        label={label}
        value={formProps.values[field]}
        onFocus={() => {
          setDatePickerField({ name: field, setFieldValue: formProps.setFieldValue });
          setShowDatePicker(true);
        }}
        error={formProps.touched[field] && formProps.errors[field]}
        style={styles.input}
        editable={false}
        right={<TextInput.Icon icon="calendar" />}
      />
      {formProps.touched[field] && formProps.errors[field] && (
        <HelperText type="error">{formProps.errors[field]}</HelperText>
      )}
      {showDatePicker && Platform.OS !== 'web' && (
        <DateTimePicker
          value={datePickerValue}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );

  const renderEducationForm = () => (
    <Formik
      initialValues={{
        institution: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        grade: '',
        description: '',
      }}
      validationSchema={educationSchema}
      onSubmit={(values, { resetForm }) => {
        dispatch(addEducation(values));
        resetForm();
        setShowEducationForm(false);
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View style={styles.formContainer}>
          <TextInput
            label="Institution"
            value={values.institution}
            onChangeText={handleChange('institution')}
            onBlur={handleBlur('institution')}
            error={touched.institution && errors.institution}
            style={styles.input}
          />
          {touched.institution && errors.institution && (
            <Text style={styles.errorText}>{errors.institution}</Text>
          )}

          <TextInput
            label="Degree"
            value={values.degree}
            onChangeText={handleChange('degree')}
            onBlur={handleBlur('degree')}
            error={touched.degree && errors.degree}
            style={styles.input}
          />
          {touched.degree && errors.degree && (
            <Text style={styles.errorText}>{errors.degree}</Text>
          )}

          <TextInput
            label="Field of Study"
            value={values.fieldOfStudy}
            onChangeText={handleChange('fieldOfStudy')}
            onBlur={handleBlur('fieldOfStudy')}
            error={touched.fieldOfStudy && errors.fieldOfStudy}
            style={styles.input}
          />
          {touched.fieldOfStudy && errors.fieldOfStudy && (
            <Text style={styles.errorText}>{errors.fieldOfStudy}</Text>
          )}

          <TextInput
            label="Start Date (MM/YYYY)"
            value={values.startDate}
            onChangeText={handleChange('startDate')}
            onBlur={handleBlur('startDate')}
            error={touched.startDate && errors.startDate}
            style={styles.input}
          />
          {touched.startDate && errors.startDate && (
            <Text style={styles.errorText}>{errors.startDate}</Text>
          )}

          <TextInput
            label="End Date (MM/YYYY or Present)"
            value={values.endDate}
            onChangeText={handleChange('endDate')}
            onBlur={handleBlur('endDate')}
            error={touched.endDate && errors.endDate}
            style={styles.input}
          />

          <TextInput
            label="Grade/GPA (Optional)"
            value={values.grade}
            onChangeText={handleChange('grade')}
            onBlur={handleBlur('grade')}
            style={styles.input}
          />

          <TextInput
            label="Description (Optional)"
            value={values.description}
            onChangeText={handleChange('description')}
            onBlur={handleBlur('description')}
            multiline
            numberOfLines={4}
            style={[styles.input, styles.multilineInput]}
          />

          <View style={styles.formActions}>
            <Button
              mode="outlined"
              onPress={() => setShowEducationForm(false)}
              style={styles.formButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.formButton}
            >
              Add Education
            </Button>
          </View>
        </View>
      )}
    </Formik>
  );

  const renderEducationList = () => (
    <View style={styles.content}>
      <Button
        mode="contained"
        onPress={() => setShowEducationForm(true)}
        style={styles.addButton}
        icon="plus"
      >
        Add Education
      </Button>

      {education.map((edu, index) => (
        <Card key={index} style={styles.educationCard}>
          <Card.Content>
            <Text style={styles.institutionText}>{edu.institution}</Text>
            <Text style={styles.degreeText}>{edu.degree} in {edu.fieldOfStudy}</Text>
            <Text style={styles.dateText}>
              {edu.startDate} - {edu.endDate || 'Present'}
            </Text>
            {edu.grade && <Text style={styles.gradeText}>Grade: {edu.grade}</Text>}
            {edu.description && <Text style={styles.descriptionText}>{edu.description}</Text>}
          </Card.Content>
        </Card>
      ))}

      <Button
        mode="contained"
        onPress={handleNext}
        style={styles.button}
      >
        Next: Experience
      </Button>
    </View>
  );

  const renderExperienceForm = () => (
    <Formik
      initialValues={{
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        location: '',
        description: '',
      }}
      validationSchema={experienceSchema}
      onSubmit={(values, { resetForm }) => {
        dispatch(addExperience(values));
        resetForm();
        setShowExperienceForm(false);
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View style={styles.formContainer}>
          <TextInput
            label="Company"
            value={values.company}
            onChangeText={handleChange('company')}
            onBlur={handleBlur('company')}
            error={touched.company && errors.company}
            style={styles.input}
          />
          {touched.company && errors.company && (
            <Text style={styles.errorText}>{errors.company}</Text>
          )}

          <TextInput
            label="Position"
            value={values.position}
            onChangeText={handleChange('position')}
            onBlur={handleBlur('position')}
            error={touched.position && errors.position}
            style={styles.input}
          />
          {touched.position && errors.position && (
            <Text style={styles.errorText}>{errors.position}</Text>
          )}

          <TextInput
            label="Start Date (MM/YYYY)"
            value={values.startDate}
            onChangeText={handleChange('startDate')}
            onBlur={handleBlur('startDate')}
            error={touched.startDate && errors.startDate}
            style={styles.input}
          />
          {touched.startDate && errors.startDate && (
            <Text style={styles.errorText}>{errors.startDate}</Text>
          )}

          <TextInput
            label="End Date (MM/YYYY or Present)"
            value={values.endDate}
            onChangeText={handleChange('endDate')}
            onBlur={handleBlur('endDate')}
            style={styles.input}
          />

          <TextInput
            label="Location (Optional)"
            value={values.location}
            onChangeText={handleChange('location')}
            onBlur={handleBlur('location')}
            style={styles.input}
          />

          <TextInput
            label="Description"
            value={values.description}
            onChangeText={handleChange('description')}
            onBlur={handleBlur('description')}
            multiline
            numberOfLines={4}
            style={[styles.input, styles.multilineInput]}
          />

          <View style={styles.formActions}>
            <Button
              mode="outlined"
              onPress={() => setShowExperienceForm(false)}
              style={styles.formButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.formButton}
            >
              Add Experience
            </Button>
          </View>
        </View>
      )}
    </Formik>
  );

  const renderExperienceList = () => (
    <View style={styles.content}>
      <Button
        mode="contained"
        onPress={() => setShowExperienceForm(true)}
        style={styles.addButton}
        icon="plus"
      >
        Add Experience
      </Button>

      {experience.map((exp, index) => (
        <Card key={index} style={styles.experienceCard}>
          <Card.Content>
            <Text style={styles.companyText}>{exp.company}</Text>
            <Text style={styles.positionText}>{exp.position}</Text>
            <Text style={styles.dateText}>
              {exp.startDate} - {exp.endDate || 'Present'}
            </Text>
            {exp.location && <Text style={styles.locationText}>{exp.location}</Text>}
            {exp.description && <Text style={styles.descriptionText}>{exp.description}</Text>}
          </Card.Content>
        </Card>
      ))}

      <Button
        mode="contained"
        onPress={handleNext}
        style={styles.button}
      >
        Next: Skills
      </Button>
    </View>
  );

  const renderSkillsSection = () => (
    <View style={styles.content}>
      <Formik
        initialValues={{ skills: skills || [] }}
        onSubmit={(values) => {
          dispatch(updateSkills(values.skills));
          handleNext();
        }}
      >
        {({ values, setFieldValue, handleSubmit }) => (
          <View>
            <TextInput
              label="Add Skill"
              onSubmitEditing={(e) => {
                const newSkill = e.nativeEvent.text;
                if (newSkill && !values.skills.includes(newSkill)) {
                  setFieldValue('skills', [...values.skills, newSkill]);
                  e.target.clear();
                }
              }}
              style={styles.input}
            />

            <View style={styles.skillsContainer}>
              {values.skills.map((skill, index) => (
                <Chip
                  key={index}
                  onClose={() => {
                    const newSkills = values.skills.filter((_, i) => i !== index);
                    setFieldValue('skills', newSkills);
                  }}
                  style={styles.skillChip}
                >
                  {skill}
                </Chip>
              ))}
            </View>

            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.button}
            >
              Next: Languages
            </Button>
          </View>
        )}
      </Formik>
    </View>
  );

  const renderLanguagesSection = () => (
    <View style={styles.content}>
      <Formik
        initialValues={{ languages: languages || [] }}
        onSubmit={(values) => {
          dispatch(updateLanguages(values.languages));
          handleNext();
        }}
      >
        {({ values, setFieldValue, handleSubmit }) => (
          <View>
            <View style={styles.languageInputContainer}>
              <TextInput
                label="Language"
                style={[styles.input, styles.languageInput]}
                value={values.currentLanguage || ''}
                onChangeText={(text) => setFieldValue('currentLanguage', text)}
              />
              <Menu
                visible={showProficiencyMenu}
                onDismiss={() => setShowProficiencyMenu(false)}
                anchor={
                  <TextInput
                    label="Proficiency"
                    value={values.currentProficiency || ''}
                    onFocus={() => setShowProficiencyMenu(true)}
                    style={[styles.input, styles.proficiencyInput]}
                    editable={false}
                    right={<TextInput.Icon icon="chevron-down" />}
                  />
                }
              >
                {proficiencyLevels.map((level) => (
                  <Menu.Item
                    key={level}
                    onPress={() => {
                      setFieldValue('currentProficiency', level);
                      setShowProficiencyMenu(false);
                    }}
                    title={level}
                  />
                ))}
              </Menu>
              <Button
                mode="contained"
                onPress={() => {
                  if (values.currentLanguage && values.currentProficiency) {
                    setFieldValue('languages', [
                      ...values.languages,
                      {
                        language: values.currentLanguage,
                        proficiency: values.currentProficiency,
                      },
                    ]);
                    setFieldValue('currentLanguage', '');
                    setFieldValue('currentProficiency', '');
                  }
                }}
              >
                Add
              </Button>
            </View>

            {values.languages.map((lang, index) => (
              <Card key={index} style={styles.languageCard}>
                <Card.Content style={styles.languageCardContent}>
                  <Text style={styles.languageText}>{lang.language}</Text>
                  <Text style={styles.proficiencyText}>{lang.proficiency}</Text>
                  <IconButton
                    icon="close"
                    size={20}
                    onPress={() => {
                      const newLanguages = values.languages.filter((_, i) => i !== index);
                      setFieldValue('languages', newLanguages);
                    }}
                  />
                </Card.Content>
              </Card>
            ))}

            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.button}
            >
              Next: Certifications
            </Button>
          </View>
        )}
      </Formik>
    </View>
  );

  const renderCertificationsForm = () => (
    <Formik
      initialValues={{
        name: '',
        issuer: '',
        date: '',
        expiry: '',
        description: '',
      }}
      validationSchema={certificationSchema}
      onSubmit={(values, { resetForm }) => {
        dispatch(addCertification(values));
        resetForm();
        setShowCertificationForm(false);
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View style={styles.formContainer}>
          <TextInput
            label="Certification Name"
            value={values.name}
            onChangeText={handleChange('name')}
            onBlur={handleBlur('name')}
            error={touched.name && errors.name}
            style={styles.input}
          />
          {touched.name && errors.name && (
            <Text style={styles.errorText}>{errors.name}</Text>
          )}

          <TextInput
            label="Issuing Organization"
            value={values.issuer}
            onChangeText={handleChange('issuer')}
            onBlur={handleBlur('issuer')}
            error={touched.issuer && errors.issuer}
            style={styles.input}
          />
          {touched.issuer && errors.issuer && (
            <Text style={styles.errorText}>{errors.issuer}</Text>
          )}

          <TextInput
            label="Date Earned (MM/YYYY)"
            value={values.date}
            onChangeText={handleChange('date')}
            onBlur={handleBlur('date')}
            error={touched.date && errors.date}
            style={styles.input}
          />
          {touched.date && errors.date && (
            <Text style={styles.errorText}>{errors.date}</Text>
          )}

          <TextInput
            label="Expiry Date (Optional)"
            value={values.expiry}
            onChangeText={handleChange('expiry')}
            onBlur={handleBlur('expiry')}
            style={styles.input}
          />

          <TextInput
            label="Description (Optional)"
            value={values.description}
            onChangeText={handleChange('description')}
            onBlur={handleBlur('description')}
            multiline
            numberOfLines={4}
            style={[styles.input, styles.multilineInput]}
          />

          <View style={styles.formActions}>
            <Button
              mode="outlined"
              onPress={() => setShowCertificationForm(false)}
              style={styles.formButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.formButton}
            >
              Add Certification
            </Button>
          </View>
        </View>
      )}
    </Formik>
  );

  const renderCertificationsList = () => (
    <View style={styles.content}>
      <Button
        mode="contained"
        onPress={() => setShowCertificationForm(true)}
        style={styles.addButton}
        icon="plus"
      >
        Add Certification
      </Button>

      {certifications.map((cert, index) => (
        <Card key={index} style={styles.certificationCard}>
          <Card.Content>
            <Text style={styles.certificationName}>{cert.name}</Text>
            <Text style={styles.issuerText}>{cert.issuer}</Text>
            <Text style={styles.dateText}>
              Earned: {cert.date}
              {cert.expiry && ` (Expires: ${cert.expiry})`}
            </Text>
            {cert.description && <Text style={styles.descriptionText}>{cert.description}</Text>}
          </Card.Content>
        </Card>
      ))}

      <Button
        mode="contained"
        onPress={() => setShowPreview(true)}
        style={styles.button}
      >
        Preview CV
      </Button>
    </View>
  );

  const renderPreviewModal = () => (
    <Portal>
      <Modal
        visible={showPreview}
        onDismiss={() => setShowPreview(false)}
        contentContainerStyle={styles.previewModal}
      >
        <ScrollView>
          <Text style={styles.previewTitle}>CV Preview</Text>
          
          {/* Personal Info */}
          <Card style={styles.previewSection}>
            <Card.Content>
              <Text style={styles.previewName}>{personalInfo.fullName}</Text>
              <Text style={styles.previewContact}>{personalInfo.email} | {personalInfo.phone}</Text>
              <Text style={styles.previewContact}>{personalInfo.address}</Text>
              <Text style={styles.previewSummary}>{personalInfo.summary}</Text>
            </Card.Content>
          </Card>

          {/* Education */}
          {education.length > 0 && (
            <Card style={styles.previewSection}>
              <Card.Content>
                <Text style={previewSectionTitleStyle}>Education</Text>
                {education.map((edu, index) => (
                  <View key={index} style={styles.previewItem}>
                    <Text style={styles.previewItemTitle}>{edu.institution}</Text>
                    <Text style={styles.previewItemSubtitle}>
                      {edu.degree} in {edu.fieldOfStudy}
                    </Text>
                    <Text style={styles.previewItemDate}>
                      {edu.startDate} - {edu.endDate || 'Present'}
                    </Text>
                    {edu.grade && <Text style={styles.previewItemDetail}>Grade: {edu.grade}</Text>}
                  </View>
                ))}
              </Card.Content>
            </Card>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <Card style={styles.previewSection}>
              <Card.Content>
                <Text style={previewSectionTitleStyle}>Experience</Text>
                {experience.map((exp, index) => (
                  <View key={index} style={styles.previewItem}>
                    <Text style={styles.previewItemTitle}>{exp.position}</Text>
                    <Text style={styles.previewItemSubtitle}>{exp.company}</Text>
                    <Text style={styles.previewItemDate}>
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </Text>
                    {exp.location && <Text style={styles.previewItemDetail}>{exp.location}</Text>}
                    {exp.description && <Text style={styles.previewItemDescription}>{exp.description}</Text>}
                  </View>
                ))}
              </Card.Content>
            </Card>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <Card style={styles.previewSection}>
              <Card.Content>
                <Text style={previewSectionTitleStyle}>Skills</Text>
                <View style={styles.previewSkillsContainer}>
                  {skills.map((skill, index) => (
                    <Chip key={index} style={styles.previewSkillChip}>{skill}</Chip>
                  ))}
                </View>
              </Card.Content>
            </Card>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <Card style={styles.previewSection}>
              <Card.Content>
                <Text style={previewSectionTitleStyle}>Languages</Text>
                {languages.map((lang, index) => (
                  <View key={index} style={styles.previewLanguageItem}>
                    <Text style={styles.previewLanguage}>{lang.language}</Text>
                    <Text style={styles.previewProficiency}>{lang.proficiency}</Text>
                  </View>
                ))}
              </Card.Content>
            </Card>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <Card style={styles.previewSection}>
              <Card.Content>
                <Text style={previewSectionTitleStyle}>Certifications</Text>
                {certifications.map((cert, index) => (
                  <View key={index} style={styles.previewItem}>
                    <Text style={styles.previewItemTitle}>{cert.name}</Text>
                    <Text style={styles.previewItemSubtitle}>{cert.issuer}</Text>
                    <Text style={styles.previewItemDate}>
                      Earned: {cert.date}
                      {cert.expiry && ` (Expires: ${cert.expiry})`}
                    </Text>
                    {cert.description && <Text style={styles.previewItemDescription}>{cert.description}</Text>}
                  </View>
                ))}
              </Card.Content>
            </Card>
          )}
        </ScrollView>

        <View style={styles.previewActions}>
          <Button
            mode="outlined"
            onPress={() => setShowPreview(false)}
            style={styles.previewButton}
          >
            Close
          </Button>
          <Button
            mode="contained"
            onPress={() => {
              setShowPreview(false);
              navigation.navigate('Preview');
            }}
            style={styles.previewButton}
          >
            Generate PDF
          </Button>
        </View>
      </Modal>
    </Portal>
  );

  const renderPersonalInfo = () => (
    <Formik
      initialValues={personalInfo}
      validationSchema={personalInfoSchema}
      onSubmit={(values) => {
        dispatch(updatePersonalInfo(values));
        handleNext();
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View style={styles.content}>
          <TextInput
            label="Full Name"
            value={values.fullName}
            onChangeText={handleChange('fullName')}
            onBlur={handleBlur('fullName')}
            error={touched.fullName && errors.fullName}
            style={styles.input}
          />
          {touched.fullName && errors.fullName && (
            <Text style={styles.errorText}>{errors.fullName}</Text>
          )}

          <TextInput
            label="Email"
            value={values.email}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            error={touched.email && errors.email}
            style={styles.input}
          />
          {touched.email && errors.email && (
            <Text style={styles.errorText}>{errors.email}</Text>
          )}

          <TextInput
            label="Phone"
            value={values.phone}
            onChangeText={handleChange('phone')}
            onBlur={handleBlur('phone')}
            error={touched.phone && errors.phone}
            style={styles.input}
          />
          {touched.phone && errors.phone && (
            <Text style={styles.errorText}>{errors.phone}</Text>
          )}

          <TextInput
            label="Address"
            value={values.address}
            onChangeText={handleChange('address')}
            onBlur={handleBlur('address')}
            error={touched.address && errors.address}
            style={styles.input}
          />
          {touched.address && errors.address && (
            <Text style={styles.errorText}>{errors.address}</Text>
          )}

          <TextInput
            label="Professional Summary"
            value={values.summary}
            onChangeText={handleChange('summary')}
            onBlur={handleBlur('summary')}
            error={touched.summary && errors.summary}
            multiline
            numberOfLines={4}
            style={[styles.input, styles.multilineInput]}
          />
          {touched.summary && errors.summary && (
            <Text style={styles.errorText}>{errors.summary}</Text>
          )}

          <View style={styles.navigation}>
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.button}
            >
              Next
            </Button>
          </View>
        </View>
      )}
    </Formik>
  );

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Step {currentSection + 1} of {sections.length}</Text>
        <Text style={styles.sectionTitle}>{sections[currentSection]}</Text>
        <ProgressBar
          progress={progress}
          style={styles.progressBar}
          color={getTemplateColor()}
        />
      </View>

      <ScrollView style={styles.content}>
        {currentSection === 0 && renderPersonalInfo()}
        {currentSection === 1 && (showEducationForm ? renderEducationForm() : renderEducationList())}
        {currentSection === 2 && (showExperienceForm ? renderExperienceForm() : renderExperienceList())}
        {currentSection === 3 && renderSkillsSection()}
        {currentSection === 4 && renderLanguagesSection()}
        {currentSection === 5 && (showCertificationForm ? renderCertificationsForm() : renderCertificationsList())}
      </ScrollView>

      <View style={styles.navigation}>
        <Button
          mode="outlined"
          onPress={handleBack}
          style={styles.navButton}
          disabled={currentSection === 0}
        >
          {currentSection > 0 ? `Back: ${sections[currentSection - 1]}` : 'Back'}
        </Button>
        <Button
          mode="contained"
          onPress={() => {
            if (currentSection === sections.length - 1) {
              setShowPreview(true);
            } else {
              handleNext();
            }
          }}
          style={styles.navButton}
        >
          {currentSection === sections.length - 1 ? 'Preview CV' : `Next: ${sections[currentSection + 1]}`}
        </Button>
      </View>

      {renderPreviewModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    elevation: 4,
  },
  headerText: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    marginTop: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  multilineInput: {
    height: 100,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 16,
  },
  navigation: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 8,
  },
  navButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  button: {
    marginTop: 16,
  },
  formContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  formButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  addButton: {
    marginBottom: 16,
  },
  educationCard: {
    marginBottom: 16,
  },
  institutionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  degreeText: {
    fontSize: 16,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  gradeText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    marginTop: 8,
  },
  previewModal: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 8,
    maxHeight: '90%',
  },
  previewTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  previewSection: {
    marginBottom: 16,
  },
  previewSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  previewName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  previewContact: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  previewSummary: {
    fontSize: 16,
    marginTop: 12,
    lineHeight: 24,
  },
  previewItem: {
    marginBottom: 16,
  },
  previewItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  previewItemSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  previewItemDate: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  previewItemDetail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  previewItemDescription: {
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
  previewSkillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  previewSkillChip: {
    margin: 4,
  },
  previewLanguageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewLanguage: {
    fontSize: 16,
    fontWeight: '500',
  },
  previewProficiency: {
    fontSize: 14,
    color: '#666',
  },
  previewActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  previewButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  skillChip: {
    margin: 4,
  },
  languageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  languageInput: {
    flex: 2,
    marginRight: 8,
  },
  proficiencyInput: {
    flex: 1,
    marginRight: 8,
  },
  languageCard: {
    marginBottom: 8,
  },
  languageCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  languageText: {
    flex: 2,
    fontSize: 16,
    fontWeight: '500',
  },
  proficiencyText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  experienceCard: {
    marginBottom: 16,
  },
  companyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  positionText: {
    fontSize: 16,
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  certificationCard: {
    marginBottom: 16,
  },
  certificationName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  issuerText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
});

export default CVEditorScreen; 