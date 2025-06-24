import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { userData } from '../Details/userData';

const VolunteerRegistration = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [volunteerType, setVolunteerType] = useState(null);
  const [suggestion, setSuggestion] = useState('');

  const handleJoinUs = () => {
    if (firstName) {
      Alert.alert(
        'Successfully Joined',
        `Welcome ${firstName}! You have successfully joined as a volunteer in the "${volunteerType}" category.`,
        [
            {
              text: 'Cancel',
              
            },
            {
                text: 'Back',
                onPress: () => navigation.navigate('Home'),
            },
            {
              text: 'OK',
              onPress: () => navigation.navigate('Profile'),
            },
        ]
      );
    } else {
      Alert.alert(
        'Error',
        'Please provide your first name to proceed.',
        [{ text: 'OK' }]
      );
    }
  };
  

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.maincontainer}>
          <View style={styles.userPhotoContainer}>
            <Image source={{ uri: userData.userPhoto }} style={styles.userPhoto} />
          </View>
          <View style={styles.ProfileCard}>
            <Text style={styles.heading}>First Name</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              placeholder={userData.firstName}
              onChangeText={setFirstName}
            />
            <View style={styles.separator} />
            <Text style={styles.heading}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              placeholder={userData.lastName}
              onChangeText={setLastName}
            />
            <View style={styles.separator} />
            <Text style={styles.heading}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              placeholder={userData.email}
              keyboardType="email-address"
              onChangeText={setEmail}
            />
            <View style={styles.separator} />
            <Text style={styles.heading}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={mobile}
              placeholder={userData.mobile}
              keyboardType="number-pad"
              onChangeText={setMobile}
            />
            <View style={styles.separator} />

            <Text style={styles.heading}>Volunteer Type</Text>
            <View style={styles.radioButtonContainer}>
              {[
                'Full Time Volunteer',
                'Part Time Volunteer',
                'Remote Volunteer',
                'Event-Based Volunteer',
              ].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={styles.radioButtonWrapper}
                  onPress={() => setVolunteerType(type)}
                >
                  <View
                    style={[
                      styles.circle,
                      volunteerType === type && styles.selectedCircle,
                    ]}
                  />
                  <Text style={styles.radioText}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.separator} />

            {/* New "Any Suggestion" Section */}
            <Text style={styles.heading}>Any Suggestion</Text>
            <TextInput
              style={styles.input}
              value={suggestion}
              placeholder="Any suggestions?"
              onChangeText={setSuggestion}
            />
            <View style={styles.separator} />

            <TouchableOpacity style={styles.joinUsButton} onPress={handleJoinUs}>
              <Text style={styles.joinUsText}>Join Us</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default VolunteerRegistration;

const styles = StyleSheet.create({
  separator: {
    width: '90%',
    height: 1,
    marginBottom: 1,
  },
  container: {
    flex: 1,
  },
  maincontainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  userPhoto: {
    width: 90,
    height: 90,
    borderRadius: 50,
    margin: 20,
    borderWidth: 1,
  },

  ProfileCard: {
    width: 300,
    height: 350, 
    backgroundColor: '#fcfafa',
    flex: 1,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: '20%',
    padding: 20,
    elevation: 20,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 40,
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    marginRight: 5,
  },
  selectedCircle: {
    backgroundColor: '#000',
  },
  radioText: {
    fontSize: 12,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  radioButtonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '45%', 
    marginBottom: 10,
  },
  joinUsButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  joinUsText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
