import React, { useState, useContext } from 'react';
import { StyleSheet, SafeAreaView, Text, View } from 'react-native';
import { BottomNavigation } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../constants/ThemeContext';
import { colors } from '../config/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Home from '../Components/Home';
import Camera from '../Components/Camera';
import Profile from '../Components/Profile';
import Donations from '../Components/Donations';
import FirstAid from '../Components/FirstAid';

const MyTabs = () => {
  const { mode } = useContext(ThemeContext); // Now fetching mode instead of theme
  const insets = useSafeAreaInsets();
  const themeColors = colors[mode]; // Fetch colors based on the current mode

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'home', title: 'Home', icon: 'home' },
    { key: 'firstaid', title: 'First Aid', icon: 'medkit' },
    { key: 'camera', title: 'Camera', icon: 'camera' },
    { key: 'donations', title: 'Donations', icon: 'gift' },
    { key: 'profile', title: 'Profile', icon: 'person' },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'home':
        return <Home />;
      case 'firstaid':
        return <FirstAid />;
      case 'camera':
        return <Camera />;
      case 'donations':
        return <Donations />;
      case 'profile':
        return <Profile />;
      default:
        return null;
    }
  };

  const getIconName = (routeKey, focused) => {
    switch (routeKey) {
      case 'home':
        return focused ? 'home' : 'home-outline';
      case 'firstaid':
        return focused ? 'medkit' : 'medkit-outline';
      case 'camera':
        return focused ? 'camera' : 'camera-outline';
      case 'donations':
        return focused ? 'gift' : 'gift-outline';
      case 'profile':
        return focused ? 'person-circle' : 'person-circle-outline';
      default:
        return 'ellipse-outline';
    }
  };

  const renderTabBar = props => (
    <View
      style={[styles.tabBarContainer, { backgroundColor: themeColors.botBackground }]}
    >
      <View style={[styles.tabBar]}>
        {props.navigationState.routes.map((route, i) => {
          const focused = i === props.navigationState.index;
          const iconName = getIconName(route.key, focused);
          const iconColor = focused ? themeColors.botIcon : themeColors.onSurface60;
          const labelColor = focused ? themeColors.botIcon : themeColors.onSurface60;
          const iconBackground = focused ? themeColors.botIconBG : 'transparent';

          return (
            <View
              key={route.key}
              style={styles.tabItem}
              onTouchEnd={() => props.onTabPress({ route })}
            >
              <View
                style={[
                  styles.iconWrapper,
                  focused && [
                    styles.focusedIconWrapper,
                    { backgroundColor: iconBackground },
                  ],
                ]}
              >
                <Ionicons name={iconName} size={24} color={iconColor} />
              </View>
              <Text style={[styles.tabLabel, { color: labelColor }]}>
                {route.title}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        barStyle={{ display: 'none' }}
        sceneAnimationEnabled={true}
      />
      {renderTabBar({
        navigationState: { index, routes },
        onTabPress: ({ route }) => {
          const routeIndex = routes.findIndex(r => r.key === route.key);
          setIndex(routeIndex);
        },
      })}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabBar: {
    flexDirection: 'row',
    height: 70,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 30,
    marginBottom: 2,
  },
  focusedIconWrapper: {
    borderRadius: 30,
    width: 60,
    height: 30,
    marginBottom: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default MyTabs;
