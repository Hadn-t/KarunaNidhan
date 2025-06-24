// Navigation/StackNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MyTabs from './TabNavigation';
import GetStarted from '../Components/GetStarted';
import Donations from '../Components/Donations';
import Home from '../Components/Home';
import Profile from '../Components/Profile';
import VolunteerRegistration from '../Components/VolunteerRegistration';
import Chetna from "../Components/Chetna";
import OurServices from "../Components/OurServices";
import FirstAid from '../Components/FirstAid';
import VideoDetails from '../Components/VideoDetails';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="GetStarted"
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="GetStarted" component={GetStarted} />
        {/* Make the tab navigator a full screen rather than a nested component */}
        <Stack.Screen
          name="MainTabs"
          component={MyTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Donations" component={Donations} />
        <Stack.Screen name="VolunteerRegistration" component={VolunteerRegistration} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Chetna" component={Chetna} />
        <Stack.Screen name="OurServices" component={OurServices} />
        <Stack.Screen name="FirstAid" component={FirstAid} options={{ title: 'First Aid' }} />
        <Stack.Screen name="VideoDetails" component={VideoDetails} options={{ title: 'Video Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;