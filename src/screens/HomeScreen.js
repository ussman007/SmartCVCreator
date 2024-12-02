import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, Card, useTheme } from 'react-native-paper';
import LottieView from 'lottie-react-native';

const HomeScreen = ({ navigation }) => {
  const theme = useTheme();
  const animationRef = useRef(null);

  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.play();
    }
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Smart CV Creator</Text>
        <Text style={styles.subtitle}>Create professional resumes in minutes</Text>
      </View>

      <View style={styles.animationContainer}>
        <LottieView
          ref={animationRef}
          source={require('../assets/animations/resume-animation.json')}
          autoPlay={false}
          loop={true}
          style={styles.animation}
          speed={0.7}
          renderMode="HARDWARE"
        />
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Get Started</Text>
          <Text style={styles.cardDescription}>
            Choose from our professionally designed templates and create your perfect CV
          </Text>
        </Card.Content>
        <Card.Actions style={styles.cardActions}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('TemplateSelection')}
            style={styles.button}
          >
            Create New CV
          </Button>
        </Card.Actions>
      </Card>

      <View style={styles.features}>
        <Text style={styles.featuresTitle}>Features</Text>
        <View style={styles.featuresList}>
          {[
            'Professional Templates',
            'Real-time Preview',
            'Easy to Use Interface',
            'Customizable Sections',
            'Export to PDF',
            'Modern Designs',
          ].map((feature, index) => (
            <Card key={index} style={styles.featureCard}>
              <Card.Content>
                <Text style={styles.featureText}>{feature}</Text>
              </Card.Content>
            </Card>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  animationContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  animation: {
    width: 300,
    height: 300,
  },
  card: {
    margin: 20,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  cardActions: {
    justifyContent: 'center',
    padding: 16,
  },
  button: {
    width: '100%',
  },
  features: {
    padding: 20,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    marginBottom: 15,
  },
  featureText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default HomeScreen; 