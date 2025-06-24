import { useRef, useEffect, useContext } from "react";
import { StyleSheet, View, ScrollView, Dimensions, Animated } from "react-native";
import {
  Surface,
  Text,
  FAB,
  Chip,
  Avatar,
  Divider,
  IconButton,
  useTheme
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from '../constants/ThemeContext';
import { colors } from '../config/theme';

const { width } = Dimensions.get("window");

const Chetna = () => {
  const navigation = useNavigation();
  const paperTheme = useTheme();
  const { mode = "light", toggleTheme } = useContext(ThemeContext);
  const themeColors = colors[mode] || colors.light; // fallback if undefined

  // Animation references
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fabAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(fabAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const renderApproachItem = (text, index) => (
    <Animated.View
      key={index}
      style={{
        opacity: fadeAnim,
        transform: [
          {
            translateY: slideAnim.interpolate({
              inputRange: [0, 50],
              outputRange: [0, 10 * index],
            }),
          },
        ],
      }}
    >
      <View style={styles.approachItem}>
        <Avatar.Icon
          size={24}
          icon="check"
          color={themeColors.onPrimaryContainer}
          style={{ backgroundColor: themeColors.primaryContainer }}
        />
        <Text style={[styles.approachText, { color: themeColors.text }]}>{text}</Text>
      </View>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Surface
          style={[styles.headerContainer, { backgroundColor: themeColors.surface }]}
          elevation={4}
        >
          <Animated.Image
            source={require("../assets/profile.png")}
            style={[
              styles.bannerPhoto,
              { opacity: fadeAnim },
            ]}
            resizeMode="cover"
          />

          <Animated.View
            style={[
              styles.headerContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text variant="displayLarge" style={styles.heading}>
              CHETNA
            </Text>
            <Text variant="bodyLarge" style={styles.address}>
              40/22 Manohar Kunj, Gautam Nagar, New Delhi
            </Text>

            <View style={styles.verifiedContainer}>
              <Chip
                icon="check-circle"
                mode="outlined"
                style={{ backgroundColor: themeColors.primaryContainer }}
                textStyle={{ color: themeColors.primary }}
              >
                Verified NGO
              </Chip>
            </View>
          </Animated.View>
        </Surface>

        <Surface
          style={[styles.contentContainer, { backgroundColor: themeColors.cardBackground }]}
          elevation={0}
        >
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <Text variant="titleLarge" style={[styles.sectionTitle, { color: themeColors.cardText }]}>
              About Us
            </Text>
            <Text variant="bodyMedium" style={[styles.aboutText, { color: themeColors.cardSecondary }]}>
              CHETNA was registered as a public charitable trust in Delhi, India, to start its vital work on child
              empowerment on 8th March 2002. When literally translated from Hindi, CHETNA means "creating awareness" and
              stands for "Childhood Enhancement through Training and Action."
            </Text>

            <Divider style={styles.divider} />

            <Text variant="titleMedium" style={[styles.approachTitle, { color: themeColors.cardText }]}>
              Our unique approach has three key elements:
            </Text>

            {renderApproachItem("Direct Action with Children", 0)}
            {renderApproachItem("Advocacy", 1)}
            {renderApproachItem("Sensitizing Stakeholders", 2)}
          </Animated.View>
        </Surface>
      </ScrollView>

      <IconButton
        icon={mode === 'dark' ? 'white-balance-sunny' : 'moon-waning-crescent'}
        size={24}
        onPress={toggleTheme}
        style={styles.themeToggle}
        iconColor={themeColors.text}
        containerColor={themeColors.primaryContainer}
      />

      <Animated.View
        style={[
          styles.fabContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: fabAnim }],
          },
        ]}
      >
        <FAB
          icon="information-outline"
          label="Our Services"
          color={themeColors.onPrimary}
          style={[styles.fab, { backgroundColor: themeColors.primary }]}
          onPress={() => navigation.navigate("OurServices")}
          customSize={56}
          uppercase={false}
          extended
        />

        <FAB
          icon="account-heart-outline"
          label="Apply For A Volunteer"
          color={themeColors.onPrimary}
          style={[styles.fab, { backgroundColor: themeColors.primary }]}
          onPress={() => navigation.navigate("VolunteerRegistration")}
          customSize={56}
          uppercase={false}
          extended
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    height: 300,
    position: "relative",
    overflow: "hidden",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  bannerPhoto: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  headerContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  heading: {
    color: "#fff",
    fontWeight: "bold",
    letterSpacing: 2,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  address: {
    color: "#fff",
    marginTop: 4,
  },
  verifiedContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  contentContainer: {
    padding: 16,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 16,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  aboutText: {
    lineHeight: 22,
  },
  divider: {
    marginVertical: 16,
  },
  approachTitle: {
    fontWeight: "bold",
    marginBottom: 12,
  },
  approachItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  approachText: {
    marginLeft: 12,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
  },
  fab: {
    elevation: 6,
    borderRadius: 28,
    width: '80%',
  },
  themeToggle: {
    position: 'absolute',
    top: 16,
    right: 16,
    elevation: 4,
  }
});

export default Chetna;
