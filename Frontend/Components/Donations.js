import { useState, useRef, useEffect } from "react"
import { View, StyleSheet, FlatList, Dimensions, Animated } from "react-native"
import {
  Appbar,
  Searchbar,
  Text,
  Card,
  Chip,
  ProgressBar,
  Surface,
  TouchableRipple,
  Button,
  IconButton,
  Portal,
  Modal,
  Paragraph,
  FAB,
  Badge,
  Divider,
  useTheme,
} from "react-native-paper"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useThemeContext } from "../constants/ThemeContext"

const { width } = Dimensions.get("window")

const donations = [
  {
    id: 1,
    title: "Give Life To My Mother",
    description:
      "In a tragic turn of events, NCTI (NGO) reached out for your help through this fundraiser for Shahid's mother. She is currently in the ICU, battling Stage 4 ovarian cancer that has spread to her liver, lymph nodes, and beyond.",
    totalRaised: 100000,
    amountRaised: 79800,
    image:
      "https://www.washingtonpost.com/wp-apps/imrs.php?src=https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/NJ5J33U2DQI6VIUCHBXVNVLZ4Y.jpg&w=1440",
    tags: ["Health", "Humanitarian", "Urgent"],
  },
  {
    id: 2,
    title: "Leg Transplant of a 12 Years Old",
    description:
      "Help a brave 12-year-old receive a life-changing leg transplant! Your support can give them the gift of mobility and a brighter future.",
    totalRaised: 990000,
    amountRaised: 0,
    image: "https://i.postimg.cc/wjxLGmDV/84058109-1731366391843849-r.webp",
    tags: ["Health", "Children", "Medical"],
  },
  {
    id: 3,
    title: "Fundraise for CHETNA",
    description:
      "CHETNA NGO is committed to providing childhood empowerment through training and action, with a special focus on street-connected children and especially girls, to ensure their rights. Help support this cause for a better future.",
    totalRaised: 500000,
    amountRaised: 0,
    image: "https://chetnango.org/wp-content/uploads/2015/07/fundraise-for-chetna.jpg",
    tags: ["Education", "Empowerment", "Children"],
  },
  {
    id: 4,
    title: "Animal Rescue Mission",
    description:
      "Join us in rescuing and rehabilitating stray animals who are in desperate need of help. Your donation will ensure a safer life for countless animals in distress.",
    totalRaised: 300000,
    amountRaised: 250000,
    image:
      "https://cdn.shopify.com/s/files/1/1199/8502/files/Charlie_s_Animal_Rescue_Centre_Bengaluru.jpg?v=1663755279",
    tags: ["Animal", "Rescue", "Urgent"],
  },
  {
    id: 5,
    title: "Save The Environment",
    description:
      "Help us reduce carbon emissions and plant trees to combat global warming. Your contribution will go towards tree plantations and awareness campaigns.",
    totalRaised: 450000,
    amountRaised: 180000,
    image: "https://s3.ap-south-1.amazonaws.com/floweraura-blog-img/saveEnvironment-2019/01.jpg",
    tags: ["Environment", "Sustainability", "Green"],
  },
  {
    id: 6,
    title: "Education for Every Child",
    description:
      "Education is the key to unlocking a better future. Help us provide free education for underprivileged children, so they can break the cycle of poverty and build a brighter future.",
    totalRaised: 800000,
    amountRaised: 450000,
    image: "https://www.ukcry.org/wp-content/uploads/Education.png",
    tags: ["Education", "Children", "Empowerment"],
  },
]

const DonationScreen = () => {
  const navigation = useNavigation()
  const paperTheme = useTheme() // Get the Paper theme

  // Use a try-catch to handle potential context errors
  const themeContext = useThemeContext()

  const { mode, toggleTheme, isDarkMode } = themeContext

  // Fallback theme colors if the context doesn't provide them
  const themeColors = {
    background: isDarkMode ? "#1A1A1E" : "#f3e5e1",
    surface: isDarkMode ? "#2B2B2E" : "#FFFFFF",
    primary: isDarkMode ? "#FF9E80" : "#FF6B4A",
    primaryContainer: isDarkMode ? "#3A2A25" : "#FFF2EE",
    onPrimary: isDarkMode ? "#000000" : "#FFFFFF",
    cardBackground: isDarkMode ? "#2F2F33" : "#FFFFFF",
    cardText: isDarkMode ? "#F0F0F0" : "#2E2E2E",
    cardSecondary: isDarkMode ? "#B0B0B0" : "#666666",
    text: isDarkMode ? "#FFFFFF" : "#0D1B2A",
    placeholder: isDarkMode ? "#9BA6AF" : "#888",
    onPrimaryContainer: isDarkMode ? "#FFE0D6" : "#5A2A1E",
  }

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState("")
  const [visible, setVisible] = useState(false)
  const [selectedDonation, setSelectedDonation] = useState(null)
  const [donationAmount, setDonationAmount] = useState(0)

  // Animation references
  const scrollY = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(0)).current
  const fabAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(fabAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start()
  }, [fadeAnim, fabAnim])

  const showModal = (donation) => {
    setSelectedDonation(donation)
    setVisible(true)
  }

  const hideModal = () => setVisible(false)

  const filteredDonations = donations.filter(
    (donation) =>
      (donation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        donation.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedTag === "" || donation.tags.includes(selectedTag)),
  )

  // Calculate total raised amount
  const totalRaised = donations.reduce((acc, donation) => acc + donation.amountRaised, 0)
  const totalGoal = donations.reduce((acc, donation) => acc + donation.totalRaised, 0)
  const progressPercentage = (totalRaised / totalGoal) * 100

  const renderDonationCard = ({ item, index }) => {
    const progress = item.totalRaised === 0 ? 0 : item.amountRaised / item.totalRaised

    // Staggered animation for cards
    const inputRange = [-1, 0, (index + 1) * 300, (index + 1.5) * 300]
    const opacity = scrollY.interpolate({
      inputRange,
      outputRange: [1, 1, 1, 0],
    })

    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [1, 1, 1, 0.9],
      extrapolate: "clamp",
    })

    const translateY = scrollY.interpolate({
      inputRange,
      outputRange: [0, 0, 0, 50],
      extrapolate: "clamp",
    })

    return (
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale }, { translateY }],
          marginBottom: 16,
        }}
      >
        <Card style={[styles.card, { backgroundColor: themeColors.cardBackground }]} mode="elevated" elevation={2}>
          <TouchableRipple onPress={() => showModal(item)} borderless>
            <>
              <Card.Cover source={{ uri: item.image }} style={styles.cardImage} />

              {/* Urgent tag badge */}
              {item.tags.includes("Urgent") && (
                <Badge style={styles.urgentBadge} size={24}>
                  URGENT
                </Badge>
              )}

              <Card.Content style={styles.cardContent}>
                <Text variant="titleMedium" style={[styles.cardTitle, { color: themeColors.cardText }]}>
                  {item.title}
                </Text>

                <Text
                  variant="bodyMedium"
                  style={[styles.cardDescription, { color: themeColors.cardSecondary }]}
                  numberOfLines={2}
                >
                  {item.description}
                </Text>

                <View style={styles.tagsContainer}>
                  {item.tags.map((tag, idx) => (
                    <Chip
                      key={idx}
                      style={[styles.tag, { backgroundColor: themeColors.primaryContainer }]}
                      textStyle={{ fontSize: 12, color: themeColors.primary }}
                      onPress={() => setSelectedTag(tag)}
                    >
                      {tag}
                    </Chip>
                  ))}
                </View>

                <ProgressBar progress={progress} color={themeColors.primary} style={styles.progressBar} />

                <View style={styles.progressTextContainer}>
                  <Text variant="labelMedium" style={[styles.progressText, { color: themeColors.cardSecondary }]}>
                    ₹{item.amountRaised.toLocaleString()} raised
                  </Text>
                  <Text variant="labelMedium" style={[styles.progressText, { color: themeColors.cardSecondary }]}>
                    of ₹{item.totalRaised.toLocaleString()}
                  </Text>
                </View>
              </Card.Content>

              <Card.Actions>
                <Button
                  mode="contained"
                  style={{ backgroundColor: themeColors.primary }}
                  textColor={themeColors.onPrimary}
                  onPress={() => showModal(item)}
                  icon="heart-outline"
                >
                  Donate Now
                </Button>
                <Button
                  mode="outlined"
                  style={{ borderColor: themeColors.primary }}
                  textColor={themeColors.primary}
                  onPress={() => {}}
                  icon="share-variant-outline"
                >
                  Share
                </Button>
              </Card.Actions>
            </>
          </TouchableRipple>
        </Card>
      </Animated.View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Appbar.Header style={{ backgroundColor: themeColors.surface }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Active Donations" />
        <IconButton
          icon={isDarkMode ? "white-balance-sunny" : "moon-waning-crescent"}
          size={24}
          onPress={toggleTheme}
          iconColor={themeColors.text}
        />
        <Appbar.Action icon="filter" onPress={() => {}} />
      </Appbar.Header>

      <Animated.View
        style={[
          styles.searchContainer,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Searchbar
          placeholder="Search Program"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[styles.searchBar, { backgroundColor: themeColors.surface }]}
          iconColor={themeColors.primary}
          inputStyle={{ color: themeColors.text }}
          placeholderTextColor={themeColors.placeholder}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.statsContainer,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Surface style={[styles.statsSurface, { backgroundColor: themeColors.cardBackground }]} elevation={1}>
          <Text variant="titleMedium" style={[styles.statsTitle, { color: themeColors.cardText }]}>
            ₹{(totalRaised / 10000000).toFixed(1)}Cr raised on the App
          </Text>
          <ProgressBar progress={progressPercentage / 100} color={themeColors.primary} style={styles.overallProgress} />

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="hand-heart" size={24} color={themeColors.primary} />
              <Text style={[styles.statValue, { color: themeColors.cardText }]}>{donations.length}</Text>
              <Text style={[styles.statLabel, { color: themeColors.cardSecondary }]}>Campaigns</Text>
            </View>

            <Divider style={{ height: "100%", width: 1 }} />

            <View style={styles.statItem}>
              <MaterialCommunityIcons name="account-group" size={24} color={themeColors.primary} />
              <Text style={[styles.statValue, { color: themeColors.cardText }]}>1.2K</Text>
              <Text style={[styles.statLabel, { color: themeColors.cardSecondary }]}>Donors</Text>
            </View>

            <Divider style={{ height: "100%", width: 1 }} />

            <View style={styles.statItem}>
              <MaterialCommunityIcons name="currency-inr" size={24} color={themeColors.primary} />
              <Text style={[styles.statValue, { color: themeColors.cardText }]}>
                {(totalRaised / 100000).toFixed(1)}L
              </Text>
              <Text style={[styles.statLabel, { color: themeColors.cardSecondary }]}>Raised</Text>
            </View>
          </View>
        </Surface>
      </Animated.View>

      <Text variant="titleMedium" style={[styles.sectionTitle, { color: themeColors.text }]}>
        Donate now
      </Text>

      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        }}
      >
        <FlatList
          horizontal
          data={["All", "Health", "Education", "Animal", "Environment", "Children", "Urgent"]}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Chip
              selected={selectedTag === item || (item === "All" && selectedTag === "")}
              showSelectedCheck={false}
              style={[
                styles.filterChip,
                (selectedTag === item || (item === "All" && selectedTag === "")) && {
                  backgroundColor: themeColors.primaryContainer,
                },
              ]}
              textStyle={[
                styles.filterChipText,
                (selectedTag === item || (item === "All" && selectedTag === "")) && {
                  color: themeColors.primary,
                },
              ]}
              onPress={() => setSelectedTag(item === "All" ? "" : item)}
            >
              {item}
            </Chip>
          )}
          contentContainerStyle={styles.filterContainer}
          showsHorizontalScrollIndicator={false}
        />
      </Animated.View>

      <Animated.FlatList
        data={filteredDonations}
        renderItem={renderDonationCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
      />

      {/* Floating Action Button */}
      <Animated.View
        style={[
          styles.fabContainer,
          {
            transform: [
              { scale: fabAnim },
              {
                translateY: fabAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [100, 0],
                }),
              },
            ],
          },
        ]}
      >
        <FAB
          icon="plus"
          label="Start a Fundraiser"
          style={[styles.fab, { backgroundColor: themeColors.primary }]}
          color={themeColors.onPrimary}
          onPress={() => {}}
          extended
        />
      </Animated.View>

      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
          {selectedDonation && (
            <Surface style={[styles.modalContent, { backgroundColor: themeColors.cardBackground }]} elevation={5}>
              <IconButton
                icon="close"
                size={24}
                onPress={hideModal}
                style={styles.closeButton}
                iconColor={themeColors.cardText}
              />

              <Text variant="headlineSmall" style={[styles.modalTitle, { color: themeColors.cardText }]}>
                {selectedDonation.title}
              </Text>

              <Card style={styles.modalImageCard} elevation={0}>
                <Card.Cover source={{ uri: selectedDonation.image }} style={styles.modalImage} />
              </Card>

              <Paragraph style={[styles.modalDescription, { color: themeColors.cardSecondary }]}>
                {selectedDonation.description}
              </Paragraph>

              <View style={styles.modalTagsContainer}>
                {selectedDonation.tags.map((tag, idx) => (
                  <Chip
                    key={idx}
                    style={[styles.modalTag, { backgroundColor: themeColors.primaryContainer }]}
                    textStyle={{ color: themeColors.primary }}
                  >
                    {tag}
                  </Chip>
                ))}
              </View>

              <Text variant="titleMedium" style={[styles.donationProgressTitle, { color: themeColors.cardText }]}>
                Donation Progress
              </Text>

              <ProgressBar
                progress={selectedDonation.amountRaised / selectedDonation.totalRaised}
                color={themeColors.primary}
                style={styles.modalProgressBar}
              />

              <View style={styles.modalProgressTextContainer}>
                <Text variant="bodyMedium" style={{ color: themeColors.cardSecondary }}>
                  ₹{selectedDonation.amountRaised.toLocaleString()} raised of ₹
                  {selectedDonation.totalRaised.toLocaleString()}
                </Text>
                <Text variant="bodyMedium" style={{ color: themeColors.cardSecondary }}>
                  {Math.round((selectedDonation.amountRaised / selectedDonation.totalRaised) * 100)}% complete
                </Text>
              </View>

              <View style={styles.donationAmountContainer}>
                <Text variant="titleMedium" style={[styles.donationAmountTitle, { color: themeColors.cardText }]}>
                  Select Donation Amount
                </Text>
                <View style={styles.amountButtonsRow}>
                  {[500, 1000, 2000, 5000].map((amount) => (
                    <Chip
                      key={amount}
                      selected={donationAmount === amount}
                      onPress={() => setDonationAmount(amount)}
                      style={[
                        styles.amountChip,
                        donationAmount === amount && { backgroundColor: themeColors.primaryContainer },
                      ]}
                      textStyle={[
                        { color: themeColors.cardSecondary },
                        donationAmount === amount && { color: themeColors.primary },
                      ]}
                    >
                      ₹{amount}
                    </Chip>
                  ))}
                </View>
              </View>

              <Button
                mode="contained"
                style={[styles.donateButton, { backgroundColor: themeColors.primary }]}
                textColor={themeColors.onPrimary}
                onPress={() => {
                  hideModal()
                  // Navigate to donation form
                }}
                icon="heart"
              >
                Donate Now
              </Button>
            </Surface>
          )}
        </Modal>
      </Portal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  searchBar: {
    elevation: 0,
    borderRadius: 8,
  },
  statsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  statsSurface: {
    padding: 16,
    borderRadius: 12,
  },
  statsTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  overallProgress: {
    height: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    padding: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    marginBottom: 8,
    fontWeight: "bold",
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  filterChip: {
    marginRight: 8,
    height: 36,
  },
  filterChipText: {
    fontSize: 12,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    borderRadius: 12,
    overflow: "hidden",
  },
  cardImage: {
    height: 180,
  },
  urgentBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "red",
    color: "white",
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  cardDescription: {
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  tag: {
    marginRight: 8,
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  progressTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  progressText: {
    color: "#666",
  },
  fabContainer: {
    position: "absolute",
    right: 0,
    bottom: 16,
    left: 0,
    alignItems: "center",
  },
  fab: {
    borderRadius: 28,
  },
  modalContainer: {
    padding: 20,
    margin: 20,
  },
  modalContent: {
    padding: 20,
    borderRadius: 12,
  },
  closeButton: {
    position: "absolute",
    right: 8,
    top: 8,
    zIndex: 1,
  },
  modalTitle: {
    fontWeight: "bold",
    marginBottom: 16,
    paddingRight: 40,
  },
  modalImageCard: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
  modalImage: {
    height: 200,
  },
  modalDescription: {
    marginBottom: 16,
    lineHeight: 22,
  },
  modalTagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  modalTag: {
    marginRight: 8,
    marginBottom: 8,
  },
  donationProgressTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  modalProgressBar: {
    height: 8,
    borderRadius: 4,
  },
  modalProgressTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 24,
  },
  donationAmountContainer: {
    marginBottom: 24,
  },
  donationAmountTitle: {
    fontWeight: "bold",
    marginBottom: 12,
  },
  amountButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  amountChip: {
    minWidth: 70,
    justifyContent: "center",
  },
  donateButton: {
    borderRadius: 8,
  },
})

export default DonationScreen
