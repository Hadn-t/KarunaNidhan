import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  ScrollView,
  Dimensions,
  StatusBar,
  PermissionsAndroid,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from "react-native-vector-icons/MaterialIcons";

const { width, height } = Dimensions.get('window');

const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [scaleAnim] = useState(new Animated.Value(1));

  // Get device location
  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to tag the image location.');
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Location Error', 'Unable to get current location. Using default coordinates.');
      // Return default coordinates if location fails
      return {
        latitude: 12.9716,
        longitude: 77.5946,
      };
    }
  };

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Please grant gallery access to select images.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      setSelectedImage(result.assets[0].uri);
      setAnalysisResult(null); // Clear previous analysis
      animateImageSelection();
    }
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Please grant camera access to take photos.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      setSelectedImage(result.assets[0].uri);
      setAnalysisResult(null); // Clear previous analysis
      animateImageSelection();
    }
  };

  const animateImageSelection = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const parseAnalysisData = (reportData) => {
    try {
      // Remove the ```json wrapper if present
      const jsonString = reportData.replace(/```json\n|\n```/g, '');
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error parsing analysis data:', error);
      return null;
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      Alert.alert("Missing Image", "Please select an image first!");
      return;
    }

    setUploading(true);
    setAnalysisResult(null);

    try {
      // Get current location
      const location = await getCurrentLocation();
      if (!location) {
        setUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append("image", {
        uri: selectedImage,
        type: "image/jpeg",
        name: "animal_image.jpg",
      });
      
      // Send location as JSON string
      formData.append("location", JSON.stringify({
        latitude: location.latitude,
        longitude: location.longitude,
      }));

      const response = await fetch("http://192.168.1.7:8000/animal/test-gemini/", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log('API Response:', result); // Debug log
      
      if (response.ok && result.report) {
        // Parse the nested analysis data
        const parsedAnalysis = parseAnalysisData(result.report.report_data);
        
        if (parsedAnalysis) {
          const formattedResult = {
            analysis_result: parsedAnalysis,
            location: {
              latitude: result.report.latitude,
              longitude: result.report.longitude,
            },
            report_id: result.report.report_id,
            message: result.message
          };
          
          setAnalysisResult(formattedResult);
          Alert.alert(
            "Analysis Complete! 🎉", 
            `Animal identified: ${parsedAnalysis.animal_type || 'Unknown'}\nInjury: ${parsedAnalysis.injury || 'None detected'}`,
            [{ text: "View Details", onPress: () => {} }]
          );
        } else {
          Alert.alert("Parsing Error", "Unable to parse analysis results.");
        }
      } else {
        Alert.alert("Analysis Failed", result.error || result.message || "Please try again later.");
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert("Network Error", "Please check your connection and try again.");
    } finally {
      setUploading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
  };

  const renderProcedureSteps = (procedure) => {
    if (!procedure) return null;
    
    // Split procedure by "Step" and filter out empty strings
    const steps = procedure.split(/Step \d+:/).filter(step => step.trim());
    
    return steps.map((step, index) => (
      <View key={index} style={styles.procedureStep}>
        <View style={styles.stepNumber}>
          <Text style={styles.stepNumberText}>{index + 1}</Text>
        </View>
        <Text style={styles.stepText}>{step.trim()}</Text>
      </View>
    ));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#059669" />
      
      {/* Header */}
      <LinearGradient
        colors={['#059669', '#10b981', '#34d399']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>🤖 AI Animal Care</Text>
        <Text style={styles.headerSubtitle}>
          AI-powered animal injury detection and analysis
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.galleryButton]} 
            onPress={openGallery}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#3b82f6', '#1d4ed8']}
              style={styles.actionButtonGradient}
            >
              <Icon name="photo-library" size={32} color="#fff" />
              <Text style={styles.actionText}>Gallery</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.cameraButton]} 
            onPress={openCamera}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#f59e0b', '#d97706']}
              style={styles.actionButtonGradient}
            >
              <Icon name="camera-alt" size={32} color="#fff" />
              <Text style={styles.actionText}>Camera</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Image Preview */}
        {selectedImage && (
          <Animated.View 
            style={[
              styles.imagePreviewContainer,
              { transform: [{ scale: scaleAnim }] }
            ]}
          >
            <Text style={styles.previewLabel}>Selected Image</Text>
            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            <TouchableOpacity 
              style={styles.removeImageButton}
              onPress={resetAnalysis}
            >
              <Icon name="close" size={20} color="#ef4444" />
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Analysis Results */}
        {analysisResult && analysisResult.analysis_result && (
          <View style={styles.analysisContainer}>
            <Text style={styles.analysisTitle}>🔍 AI Analysis Results</Text>
            
            {/* Report ID */}
            {analysisResult.report_id && (
              <View style={styles.reportIdCard}>
                <Icon name="description" size={16} color="#6b7280" />
                <Text style={styles.reportIdText}>
                  Report ID: {analysisResult.report_id.substring(0, 8)}...
                </Text>
              </View>
            )}
            
            {/* Basic Analysis Results */}
            <View style={styles.resultCard}>
              <Text style={styles.cardTitle}>📊 Analysis Overview</Text>
              
              <View style={styles.resultRow}>
                <Icon name="pets" size={20} color="#059669" />
                <Text style={styles.resultLabel}>Animal Type:</Text>
                <Text style={styles.resultValue}>
                  {analysisResult.analysis_result.animal_type || 'Unknown'}
                </Text>
              </View>

              {analysisResult.analysis_result.breed_guess && analysisResult.analysis_result.breed_guess !== 'N/A' && (
                <View style={styles.resultRow}>
                  <Icon name="category" size={20} color="#059669" />
                  <Text style={styles.resultLabel}>Breed:</Text>
                  <Text style={styles.resultValue}>
                    {analysisResult.analysis_result.breed_guess}
                  </Text>
                </View>
              )}

              <View style={styles.resultRow}>
                <Icon name="healing" size={20} color="#f59e0b" />
                <Text style={styles.resultLabel}>Injury:</Text>
                <Text style={styles.resultValue}>
                  {analysisResult.analysis_result.injury || 'None detected'}
                </Text>
              </View>

              {analysisResult.analysis_result.severity && (
                <View style={styles.resultRow}>
                  <Icon 
                    name="priority-high" 
                    size={20} 
                    color={getSeverityColor(analysisResult.analysis_result.severity)} 
                  />
                  <Text style={styles.resultLabel}>Severity:</Text>
                  <Text style={[
                    styles.resultValue, 
                    styles.severityBadge,
                    { 
                      color: getSeverityColor(analysisResult.analysis_result.severity),
                      backgroundColor: getSeverityColor(analysisResult.analysis_result.severity) + '20'
                    }
                  ]}>
                    {analysisResult.analysis_result.severity}
                  </Text>
                </View>
              )}

              {analysisResult.analysis_result.person_required && (
                <View style={styles.resultRow}>
                  <Icon name="person" size={20} color="#8b5cf6" />
                  <Text style={styles.resultLabel}>Personnel Required:</Text>
                  <Text style={styles.resultValue}>
                    {analysisResult.analysis_result.person_required} person(s)
                  </Text>
                </View>
              )}
            </View>

            {/* Environment Factors */}
            {analysisResult.analysis_result.environment_factors && (
              <View style={styles.resultCard}>
                <Text style={styles.cardTitle}>🌍 Environment Analysis</Text>
                <Text style={styles.environmentText}>
                  {analysisResult.analysis_result.environment_factors}
                </Text>
              </View>
            )}

            {/* Equipment Needed */}
            {analysisResult.analysis_result.equipments && analysisResult.analysis_result.equipments.length > 0 && (
              <View style={styles.resultCard}>
                <Text style={styles.cardTitle}>🛠️ Equipment Required</Text>
                <View style={styles.equipmentContainer}>
                  {analysisResult.analysis_result.equipments.map((equipment, index) => (
                    <View key={index} style={styles.equipmentItem}>
                      <Icon name="check-circle" size={16} color="#10b981" />
                      <Text style={styles.equipmentText}>{equipment}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Procedure Steps */}
            {analysisResult.analysis_result.procedure && (
              <View style={styles.resultCard}>
                <Text style={styles.cardTitle}>📋 Procedure Steps</Text>
                <View style={styles.procedureContainer}>
                  {renderProcedureSteps(analysisResult.analysis_result.procedure)}
                </View>
              </View>
            )}

            {/* Suggestions */}
            {analysisResult.analysis_result.suggestions && (
              <View style={styles.resultCard}>
                <Text style={styles.cardTitle}>💡 Recommendations</Text>
                <View style={styles.suggestionsContainer}>
                  <Icon name="lightbulb-outline" size={20} color="#3b82f6" />
                  <Text style={styles.suggestionsText}>
                    {analysisResult.analysis_result.suggestions}
                  </Text>
                </View>
              </View>
            )}

            {/* Location Card */}
            <View style={styles.locationCard}>
              <Icon name="location-on" size={20} color="#ef4444" />
              <View style={styles.locationContent}>
                <Text style={styles.locationTitle}>📍 Location Tagged</Text>
                <Text style={styles.locationText}>
                  Lat: {analysisResult.location?.latitude?.toFixed(6)}, 
                  Lng: {analysisResult.location?.longitude?.toFixed(6)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Analyze Button */}
        <TouchableOpacity
          style={[
            styles.analyzeButton,
            (!selectedImage || uploading) && styles.analyzeButtonDisabled
          ]}
          onPress={analyzeImage}
          disabled={!selectedImage || uploading}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={
              (!selectedImage || uploading)
                ? ['#d1d5db', '#9ca3af']
                : ['#7c3aed', '#5b21b6']
            }
            style={styles.analyzeButtonGradient}
          >
            {uploading ? (
              <>
                <Icon name="autorenew" size={24} color="#fff" />
                <Text style={styles.analyzeButtonText}>Analyzing...</Text>
              </>
            ) : (
              <>
                <Icon name="psychology" size={24} color="#fff" />
                <Text style={styles.analyzeButtonText}>Analyze with AI</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Icon name="info" size={24} color="#3b82f6" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>How it works</Text>
            <Text style={styles.infoText}>
              Our AI analyzes animal images to detect injuries, identify species, 
              and provide detailed care recommendations with equipment lists and step-by-step procedures.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#d1fae5',
    textAlign: 'center',
    lineHeight: 24,
  },
  content: {
    padding: 24,
    marginTop: -20,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  actionButtonGradient: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  actionText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  imagePreviewContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    position: 'relative',
  },
  previewLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    textAlign: 'center',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  analysisContainer: {
    marginBottom: 24,
  },
  analysisTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#374151',
    marginBottom: 20,
    textAlign: 'center',
  },
  reportIdCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  reportIdText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 8,
    fontFamily: 'monospace',
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 16,
    textAlign: 'center',
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginLeft: 8,
    flex: 1,
  },
  resultValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    flex: 2,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  environmentText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  equipmentContainer: {
    gap: 8,
  },
  equipmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#10b981',
  },
  equipmentText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    fontWeight: '500',
  },
  procedureContainer: {
    gap: 12,
  },
  procedureStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fef7ff',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#8b5cf6',
  },
  stepNumber: {
    backgroundColor: '#8b5cf6',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  suggestionsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  suggestionsText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
    marginLeft: 12,
    fontStyle: 'italic',
  },
  locationCard: {
    flexDirection: 'row',
    backgroundColor: '#fef2f2',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
    marginBottom: 16,
  },
  locationContent: {
    flex: 1,
    marginLeft: 12,
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: 2,
  },
  locationText: {
    fontSize: 12,
    color: '#7f1d1d',
  },
  analyzeButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  analyzeButtonDisabled: {
    elevation: 2,
    shadowOpacity: 0.1,
  },
  analyzeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  analyzeButtonText: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#eff6ff',
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  infoContent: {
    flex: 1,
    marginLeft: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 20,
  },
});

export default App;