import React, { useContext } from "react"
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
  Animated,
  Dimensions,
} from "react-native"
import {
  Surface,
  ActivityIndicator,
  Text,
  IconButton,
  Appbar,
  Searchbar,
} from "react-native-paper"
import VideoCard from "./VideoCard"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import { videoData } from "../Details/videoData"
import { ThemeContext } from "../constants/ThemeContext"
import { colors } from "../config/theme"
import { LinearGradient } from 'expo-linear-gradient'

const { width } = Dimensions.get('window')

const FirstAid = () => {
  const navigation = useNavigation()

  // Safe fallback in case ThemeContext or mode is missing
  const theme = useContext(ThemeContext) || {}
  const mode = theme.mode || "light"
  const themeColors = colors[mode] || colors.light

  const fadeAnim = React.useRef(new Animated.Value(0)).current
  const slideAnim = React.useRef(new Animated.Value(50)).current
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true)

      setTimeout(() => {
        setLoading(false)
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.spring(slideAnim, {
            toValue: 0,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
          })
        ]).start()
      }, 800)

      return () => {
        fadeAnim.setValue(0)
        slideAnim.setValue(50)
      }
    }, [fadeAnim, slideAnim])
  )

  const handleCardPress = (video) => {
    navigation.navigate("VideoDetails", { video })
  }

  const filteredVideos = videoData.filter(
    (video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.channel.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <LinearGradient
        colors={[themeColors.primary + '20', themeColors.background]}
        style={styles.loadingContainer}
      >
        <View style={styles.loadingContent}>
          <ActivityIndicator animating={true} color={themeColors.primary} size="large" />
          <Text style={[styles.loadingText, { color: themeColors.text }]}>
            Loading first aid videos...
          </Text>
          <Text style={[styles.loadingSubtext, { color: themeColors.text + '80' }]}>
            Preparing life-saving content
          </Text>
        </View>
      </LinearGradient>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Appbar.Header 
        style={[styles.header, { backgroundColor: themeColors.primary }]}
        statusBarHeight={0}
      >
        <Appbar.BackAction 
          onPress={() => navigation.goBack()} 
          iconColor="#fff"
        />
        <Appbar.Content 
          title="First Aid Videos" 
          titleStyle={styles.headerTitle}
        />
        <Appbar.Action 
          icon="heart-pulse" 
          iconColor="#fff"
          onPress={() => {}}
        />
      </Appbar.Header>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search videos, topics, or channels..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[styles.searchBar, { backgroundColor: themeColors.surface }]}
          iconColor={themeColors.primary}
          inputStyle={{ color: themeColors.text, fontSize: 16 }}
          placeholderTextColor={themeColors.placeholder}
          elevation={4}
        />
        {filteredVideos.length > 0 && (
          <Text style={[styles.resultCount, { color: themeColors.text + '80' }]}>
            {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''} found
          </Text>
        )}
      </View>

      <Animated.View 
        style={[
          styles.contentContainer,
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <FlatList
          data={filteredVideos}
          renderItem={({ item, index }) => (
            <Animated.View
              style={[
                styles.cardContainer,
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [30 * (index % 3), 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <VideoCard video={item} onPress={() => handleCardPress(item)} />
            </Animated.View>
          )}
          keyExtractor={(item) => item.videoId}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={[styles.emptyTitle, { color: themeColors.text }]}>
                No videos found
              </Text>
              <Text style={[styles.emptyText, { color: themeColors.text + '80' }]}>
                Try adjusting your search terms or browse all videos
              </Text>
            </View>
          }
        />
      </Animated.View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  searchContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  searchBar: {
    elevation: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  resultCount: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
  },
  cardContainer: {
    marginHorizontal: 4,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 100,
  },
  separator: {
    height: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    marginTop: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
})

export default FirstAid