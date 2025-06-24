import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
} from "react-native";
import React, { useState } from "react";
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { userData } from "../Details/userData";

const { width, height } = Dimensions.get('window');

const Profile = () => {
  const [edit, setEdit] = useState(false);
  const [firstName, setFirstName] = useState(userData.firstName);
  const [lastName, setLastName] = useState(userData.lastName);
  const [email, setEmail] = useState(userData.email);
  const [mobile, setMobile] = useState(userData.mobile);
  const [volunteerType, setVolunteerType] = useState(null);

  const volunteerOptions = [
    { type: "Full Time Volunteer", icon: "work", color: "#4CAF50" },
    { type: "Part Time Volunteer", icon: "schedule", color: "#FF9800" },
    { type: "Remote Volunteer", icon: "home", color: "#2196F3" },
    { type: "Event-Based Volunteer", icon: "event", color: "#9C27B0" },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#6366f1" />
      
      {/* Header Section */}
      <LinearGradient
        colors={['#6366f1', '#8b5cf6', '#a855f7']}
        style={styles.headerGradient}
      >
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: userData.userPhoto }} style={styles.profileImage} />
          <View style={styles.editImageButton}>
            <Icon name="camera-alt" size={16} color="#fff" />
          </View>
        </View>
        <Text style={styles.profileName}>
          {firstName} {lastName}
        </Text>
        <Text style={styles.profileSubtitle}>Volunteer Profile</Text>
      </LinearGradient>

      {/* Form Section */}
      <View style={styles.formContainer}>
        <View style={styles.sectionHeader}>
          <Icon name="person" size={24} color="#6366f1" />
          <Text style={styles.sectionTitle}>Personal Information</Text>
        </View>

        {/* First Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>First Name</Text>
          <View style={[styles.inputContainer, edit && styles.inputContainerActive]}>
            <TextInput
              style={[styles.textInput, { color: edit ? "#333" : "#666" }]}
              value={firstName}
              editable={edit}
              onChangeText={setFirstName}
              placeholder="Enter first name"
              placeholderTextColor="#999"
            />
            {edit && <Icon name="edit" size={20} color="#6366f1" style={styles.inputIcon} />}
          </View>
        </View>

        {/* Last Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Last Name</Text>
          <View style={[styles.inputContainer, edit && styles.inputContainerActive]}>
            <TextInput
              style={[styles.textInput, { color: edit ? "#333" : "#666" }]}
              value={lastName}
              editable={edit}
              onChangeText={setLastName}
              placeholder="Enter last name"
              placeholderTextColor="#999"
            />
            {edit && <Icon name="edit" size={20} color="#6366f1" style={styles.inputIcon} />}
          </View>
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <View style={[styles.inputContainer, edit && styles.inputContainerActive]}>
            <TextInput
              style={[styles.textInput, { color: edit ? "#333" : "#666" }]}
              value={email}
              editable={edit}
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="Enter email address"
              placeholderTextColor="#999"
            />
            <Icon name="email" size={20} color="#6366f1" style={styles.inputIcon} />
          </View>
        </View>

        {/* Phone Number */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <View style={[styles.inputContainer, edit && styles.inputContainerActive]}>
            <TextInput
              style={[styles.textInput, { color: edit ? "#333" : "#666" }]}
              value={mobile}
              editable={edit}
              keyboardType="phone-pad"
              onChangeText={setMobile}
              placeholder="Enter phone number"
              placeholderTextColor="#999"
            />
            <Icon name="phone" size={20} color="#6366f1" style={styles.inputIcon} />
          </View>
        </View>

        {/* Volunteer Type Section */}
        <View style={styles.sectionHeader}>
          <Icon name="volunteer-activism" size={24} color="#6366f1" />
          <Text style={styles.sectionTitle}>Volunteer Preferences</Text>
        </View>

        <View style={styles.radioContainer}>
          {volunteerOptions.map((option) => (
            <TouchableOpacity
              key={option.type}
              style={[
                styles.radioOption,
                volunteerType === option.type && styles.radioOptionSelected,
                !edit && styles.radioOptionDisabled
              ]}
              onPress={() => edit && setVolunteerType(option.type)}
              disabled={!edit}
            >
              <View style={styles.radioContent}>
                <View style={[styles.radioIconContainer, { backgroundColor: option.color + '20' }]}>
                  <Icon name={option.icon} size={20} color={option.color} />
                </View>
                <Text style={[
                  styles.radioText,
                  volunteerType === option.type && styles.radioTextSelected
                ]}>
                  {option.type}
                </Text>
              </View>
              <View style={[
                styles.radioCircle,
                volunteerType === option.type && styles.radioCircleSelected,
                { borderColor: option.color }
              ]}>
                {volunteerType === option.type && (
                  <View style={[styles.radioInner, { backgroundColor: option.color }]} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[styles.actionButton, edit && styles.actionButtonSave]}
          onPress={() => setEdit(!edit)}
        >
          <LinearGradient
            colors={edit ? ['#10b981', '#059669'] : ['#6366f1', '#8b5cf6']}
            style={styles.buttonGradient}
          >
            <Icon 
              name={edit ? "save" : "edit"} 
              size={20} 
              color="#fff" 
              style={styles.buttonIcon} 
            />
            <Text style={styles.buttonText}>
              {edit ? "Save Changes" : "Edit Profile"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6366f1',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  profileSubtitle: {
    fontSize: 16,
    color: '#e0e7ff',
    fontWeight: '500',
  },
  formContainer: {
    padding: 24,
    marginTop: -20,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 12,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    height: 50,
  },
  inputContainerActive: {
    borderColor: '#6366f1',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  inputIcon: {
    marginLeft: 8,
  },
  radioContainer: {
    marginBottom: 24,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  radioOptionSelected: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
  },
  radioOptionDisabled: {
    opacity: 0.6,
  },
  radioContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  radioIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  radioTextSelected: {
    color: '#1f2937',
    fontWeight: '600',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleSelected: {
    borderWidth: 2,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  actionButton: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});