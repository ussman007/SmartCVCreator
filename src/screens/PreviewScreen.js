import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { Button, Text, ActivityIndicator, Portal, Modal } from 'react-native-paper';
import RNPdf from 'react-native-pdf';
import RNFS from 'react-native-fs';

const PreviewScreen = () => {
  const [loading, setLoading] = useState(false);
  const [pdfPath, setPdfPath] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const cv = useSelector((state) => state.cv);

  const generatePDF = async () => {
    setLoading(true);
    try {
      // In a real app, this would make an API call to generate the PDF
      // For now, we'll simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulated PDF generation
      const fileName = `CV_${cv.personalInfo.fullName.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
      const path = Platform.select({
        ios: `${RNFS.DocumentDirectoryPath}/${fileName}`,
        android: `${RNFS.DownloadDirectoryPath}/${fileName}`,
      });

      setPdfPath(path);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderSection = (title, content) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{content}</View>
    </View>
  );

  const renderPersonalInfo = () => (
    <View>
      <Text style={styles.name}>{cv.personalInfo.fullName}</Text>
      <Text style={styles.contact}>{cv.personalInfo.email}</Text>
      <Text style={styles.contact}>{cv.personalInfo.phone}</Text>
      <Text style={styles.contact}>{cv.personalInfo.address}</Text>
      <Text style={styles.summary}>{cv.personalInfo.summary}</Text>
    </View>
  );

  const renderEducation = () => (
    <View>
      {cv.education.map((edu, index) => (
        <View key={index} style={styles.item}>
          <Text style={styles.itemTitle}>{edu.degree}</Text>
          <Text style={styles.itemSubtitle}>{edu.institution}</Text>
          <Text style={styles.itemDate}>{`${edu.startDate} - ${edu.endDate}`}</Text>
        </View>
      ))}
    </View>
  );

  const renderExperience = () => (
    <View>
      {cv.experience.map((exp, index) => (
        <View key={index} style={styles.item}>
          <Text style={styles.itemTitle}>{exp.position}</Text>
          <Text style={styles.itemSubtitle}>{exp.company}</Text>
          <Text style={styles.itemDate}>{`${exp.startDate} - ${exp.endDate}`}</Text>
          <Text style={styles.itemDescription}>{exp.description}</Text>
        </View>
      ))}
    </View>
  );

  const renderSkills = () => (
    <View style={styles.skillsContainer}>
      {cv.skills.map((skill, index) => (
        <View key={index} style={styles.skill}>
          <Text>{skill}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.preview}>
        {renderSection('Personal Information', renderPersonalInfo())}
        {renderSection('Education', renderEducation())}
        {renderSection('Experience', renderExperience())}
        {renderSection('Skills', renderSkills())}
      </ScrollView>

      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={generatePDF}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          Generate PDF
        </Button>
      </View>

      <Portal>
        <Modal
          visible={showSuccess}
          onDismiss={() => setShowSuccess(false)}
          contentContainerStyle={styles.modal}
        >
          <Text style={styles.modalTitle}>PDF Generated Successfully!</Text>
          <Text style={styles.modalText}>
            Your CV has been saved to:
            {'\n'}
            {pdfPath}
          </Text>
          <Button
            mode="contained"
            onPress={() => setShowSuccess(false)}
            style={styles.modalButton}
          >
            OK
          </Button>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  preview: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1a237e',
  },
  sectionContent: {
    paddingLeft: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  contact: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  summary: {
    fontSize: 16,
    marginTop: 12,
    lineHeight: 24,
  },
  item: {
    marginBottom: 16,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  itemDate: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  itemDescription: {
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  skill: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  actions: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    height: 48,
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    marginTop: 8,
  },
});

export default PreviewScreen; 