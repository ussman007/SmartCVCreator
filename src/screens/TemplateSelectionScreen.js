import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import { Card, Text, Button, ActivityIndicator } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedTemplate, selectAllTemplates } from '../redux/slices/templateSlice';

const { width } = Dimensions.get('window');

const TemplateSelectionScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const templates = useSelector(selectAllTemplates);
  const loading = useSelector(state => state.templates.loading);
  const error = useSelector(state => state.templates.error);

  const handleTemplateSelect = (template) => {
    dispatch(setSelectedTemplate(template));
    navigation.navigate('CVEditor');
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const renderTemplate = ({ item: template }) => (
    <Card style={styles.templateCard}>
      <Card.Content>
        <Text style={styles.templateName}>{template.name}</Text>
        <Text style={styles.templateDescription}>{template.description}</Text>
      </Card.Content>
      <Card.Actions>
        <Button
          mode="contained"
          onPress={() => handleTemplateSelect(template)}
          style={styles.selectButton}
        >
          Select Template
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Choose Your Template</Text>
      <FlatList
        data={templates}
        renderItem={renderTemplate}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  templateCard: {
    marginBottom: 20,
    elevation: 4,
    borderRadius: 8,
  },
  templateName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  templateDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  selectButton: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default TemplateSelectionScreen; 