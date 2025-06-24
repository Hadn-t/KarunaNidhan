import { useContext } from "react"
import { StyleSheet, View, Dimensions } from "react-native"
import { Card, Title, Paragraph, IconButton, useTheme, TouchableRipple, Chip, Text, Avatar } from "react-native-paper"
import { MaterialIcons } from "@expo/vector-icons"
import { ThemeContext } from "../constants/ThemeContext"
import { colors } from "../config/theme"

const { width } = Dimensions.get("window")

const VideoCard = ({ video, onPress }) => {
  const paperTheme = useTheme()
  const { mode } = useContext(ThemeContext)
  const themeColors = colors[mode]

  // Generate star rating display
  const renderRating = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <MaterialIcons key={`star-${i}`} name="star" size={16} color={themeColors.primary} style={styles.starIcon} />,
      )
    }

    if (hasHalfStar) {
      stars.push(
        <MaterialIcons
          key="half-star"
          name="star-half"
          size={16}
          color={themeColors.primary}
          style={styles.starIcon}
        />,
      )
    }

    const emptyStars = 5 - stars.length
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <MaterialIcons
          key={`empty-star-${i}`}
          name="star-outline"
          size={16}
          color={themeColors.primary}
          style={styles.starIcon}
        />,
      )
    }

    return <View style={styles.ratingContainer}>{stars}</View>
  }

  return (
    <Card style={[styles.card, { backgroundColor: themeColors.cardBackground }]} mode="elevated" elevation={2}>
      <TouchableRipple onPress={onPress} rippleColor={themeColors.primaryContainer} style={styles.touchable}>
        <View>
          <Card.Cover
            source={{ uri: video.thumbnail || `https://img.youtube.com/vi/${video.videoId}/0.jpg` }}
            style={styles.thumbnail}
          />
          <View style={styles.playButton}>
            <IconButton
              icon={() => <MaterialIcons name="play-circle-filled" size={48} color={themeColors.primary} />}
              size={48}
              onPress={onPress}
              style={styles.playIcon}
            />
          </View>

          <View style={styles.typeChipContainer}>
            <Chip
              style={[styles.typeChip, { backgroundColor: themeColors.primaryContainer }]}
              textStyle={{ color: themeColors.primary, fontWeight: "bold" }}
            >
              {video.type}
            </Chip>
          </View>

          <Card.Content style={styles.content}>
            <Title style={[styles.title, { color: themeColors.cardText }]} numberOfLines={2}>
              {video.title}
            </Title>

            <View style={styles.channelRow}>
              <Avatar.Icon
                size={24}
                icon="account"
                style={{ backgroundColor: themeColors.primaryContainer }}
                color={themeColors.primary}
              />
              <Paragraph style={[styles.channelText, { color: themeColors.cardSecondary }]}>{video.channel}</Paragraph>
            </View>

            {renderRating(video.rating)}

            <View style={styles.metaContainer}>
              <View style={styles.metaItem}>
                <MaterialIcons name="access-time" size={16} color={themeColors.cardSecondary} />
                <Text style={[styles.metaText, { color: themeColors.cardSecondary }]}>{video.time}</Text>
              </View>

              <View style={styles.metaItem}>
                <MaterialIcons name="timer" size={16} color={themeColors.cardSecondary} />
                <Text style={[styles.metaText, { color: themeColors.cardSecondary }]}>{video.duration}</Text>
              </View>
            </View>
          </Card.Content>
        </View>
      </TouchableRipple>
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
  },
  touchable: {
    borderRadius: 16,
  },
  thumbnail: {
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  playButton: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  playIcon: {
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 30,
  },
  typeChipContainer: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  typeChip: {
    height: 28,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  channelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  channelText: {
    marginLeft: 8,
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  starIcon: {
    marginRight: 2,
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    marginLeft: 4,
    fontSize: 14,
  },
})

export default VideoCard
