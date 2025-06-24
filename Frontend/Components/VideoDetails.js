import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const VideoDetails = ({ route }) => {
  const { video } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        <WebView
          style={styles.video}
          source={{ uri: `https://www.youtube.com/embed/${video.videoId}?autohide=1&showinfo=0` }} 
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          allowsFullscreenVideo={true} 
        />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{video.title}</Text>
        <Text style={styles.channel}>Channel: {video.channel}</Text>
        <Text style={styles.description}>{video.description}</Text>
        <Text style={styles.description}>{video.rating}</Text>
        <Text style={styles.instructions}>{video.instructions}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  videoContainer: {
    height: '26%',
    width: '100%',
  },
  video: {
    height: '100%', 
    width: '100%', 
  },
  detailsContainer: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  channel: {
    fontSize: 16,
    color: '#777',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#333',
  },
});

export default VideoDetails;
