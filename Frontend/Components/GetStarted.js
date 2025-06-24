import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  ActivityIndicator,
  Animated,
  Easing,
} from "react-native";
import logo from "../assets/logo.png";

const GetStarted = ({ navigation }) => {
  const [text, setText] = useState(""); 
  const [opacityAnimation] = useState(new Animated.Value(0)); 

  useEffect(() => {
    const fullText = "KARUNA NIDHAN";
    let index = 0;

    const typewriterInterval = setInterval(() => {
      if (index <= fullText.length) {
        setText(fullText.slice(0, index + 1)); 
        index++;
      } else {
        clearInterval(typewriterInterval);
      }
    }, 150);

    return () => clearInterval(typewriterInterval);
  }, []);

  useEffect(() => {
    Animated.timing(opacityAnimation, {
      toValue: 1,
      duration: 1500,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      navigation.navigate("MainTabs");
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigation, opacityAnimation]);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Image source={logo} style={styles.logo} />

      <Text style={styles.text}>{text}</Text>

      <Animated.View style={[styles.loader, { opacity: opacityAnimation }]}>
        <ActivityIndicator size="large" color="#8A2BE2" />
        <Text style={styles.loadingText}>Loading...</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fefae0",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 30,
    borderRadius: 100,
    elevation: 5,
  },
  text: {
    fontSize: 36,
    color: "#8A2BE2",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Courier",
  },
  loader: {
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#8A2BE2",
    marginTop: 10,
    fontWeight: "500",
  },
});

export default GetStarted;