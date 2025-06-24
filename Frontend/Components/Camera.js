import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  ScrollView,
  Dimensions,
  StatusBar,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from 'expo-linear-gradient';
import Icon from "react-native-vector-icons/MaterialIcons";

const { width, height } = Dimensions.get('window');

const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [animalDetails, setAnimalDetails] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [animateInput] = useState(new Animated.Value(1));
  const [scaleAnim] = useState(new Animated.Value(1));

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

  const handleFocus = () => {
    setInputFocused(true);
    Animated.spring(animateInput, {
      toValue: 1.02,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    setInputFocused(false);
    Animated.spring(animateInput, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      Alert.alert("Missing Image", "Please select an image first!");
      return;
    }

    if (!animalDetails.trim()) {
      Alert.alert("Missing Details", "Please enter animal details!");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("image", {
      uri: selectedImage,
      type: "image/jpg",
      name: "uploaded_image.jpg",
    });
    formData.append("details", animalDetails);

    try {
      const response = await fetch("https://5ef0-2405-204-3485-a68d-28a1-36c6-989f-7798.ngrok-free.app/animal/upload", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        Alert.alert(
          "Success! 🎉", 
          `Image uploaded successfully!\nTags: ${result.tags}`,
          [{ text: "OK", onPress: () => {
            setSelectedImage(null);
            setAnimalDetails("");
          }}]
        );
      } else {
        Alert.alert("Upload Failed", "Please try again later.");
      }
    } catch (error) {
      Alert.alert("Network Error", "Please check your connection and try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#059669" />
      
      {/* Header */}
      <LinearGradient
        colors={['#059669', '#10b981', '#34d399']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>🐾 Animal Care</Text>
        <Text style={styles.headerSubtitle}>
          Upload photos and help us identify animals in need
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
              onPress={() => setSelectedImage(null)}
            >
              <Icon name="close" size={20} color="#ef4444" />
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Animal Details Input */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Animal Details</Text>
          <Animated.View
            style={[
              styles.inputContainer,
              { transform: [{ scale: animateInput }] },
              inputFocused && styles.inputContainerFocused
            ]}
          >
            <TextInput
              style={styles.textInput}
              placeholder="Describe the animal's condition, location, behavior..."
              value={animalDetails}
              onChangeText={setAnimalDetails}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            {animalDetails.length > 0 && (
              <TouchableOpacity
                style={styles.clearTextButton}
                onPress={() => setAnimalDetails("")}
              >
                <Icon name="clear" size={20} color="#6b7280" />
              </TouchableOpacity>
            )}
          </Animated.View>
          <Text style={styles.characterCount}>
            {animalDetails.length}/500 characters
          </Text>
        </View>

        {/* Upload Button */}
        <TouchableOpacity
          style={[
            styles.uploadButton,
            (!selectedImage || !animalDetails.trim() || uploading) && styles.uploadButtonDisabled
          ]}
          onPress={uploadImage}
          disabled={!selectedImage || !animalDetails.trim() || uploading}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={
              (!selectedImage || !animalDetails.trim() || uploading)
                ? ['#d1d5db', '#9ca3af']
                : ['#059669', '#10b981']
            }
            style={styles.uploadButtonGradient}
          >
            {uploading ? (
              <>
                <Icon name="hourglass-empty" size={24} color="#fff" />
                <Text style={styles.uploadButtonText}>Uploading...</Text>
              </>
            ) : (
              <>
                <Icon name="cloud-upload" size={24} color="#fff" />
                <Text style={styles.uploadButtonText}>Upload & Analyze</Text>
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
              Our AI analyzes your photo to identify the animal and suggest appropriate care measures.
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
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    position: 'relative',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  inputContainerFocused: {
    borderColor: '#059669',
    elevation: 4,
    shadowColor: '#059669',
    shadowOpacity: 0.2,
  },
  textInput: {
    padding: 16,
    fontSize: 16,
    color: '#374151',
    minHeight: 100,
    fontWeight: '500',
  },
  clearTextButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
  },
  characterCount: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'right',
    marginTop: 8,
    fontWeight: '500',
  },
  uploadButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  uploadButtonDisabled: {
    elevation: 2,
    shadowOpacity: 0.1,
  },
  uploadButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  uploadButtonText: {
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