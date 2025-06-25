import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  StatusBar,
  useWindowDimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import { TextInput } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from 'react-native-safe-area-context';
import { ngos } from "../Details/ngoData";
import { userData } from "../Details/userData";
import { useNavigation } from '@react-navigation/native';


const Home = () => {
  const navigation=useNavigation();
  const { height, width } = useWindowDimensions(); 
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNGOs, setFilteredNGOs] = useState(ngos);
  const [showAll, setShowAll] = useState(false);
  const [numOfCards, setNumOfCards] = useState(2);

  useEffect(() => {
    const cardHeight = 150; 
    const maxCards = Math.floor((height - 200) / cardHeight);
    setNumOfCards(maxCards); 
  }, [height]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredNGOs(ngos);
    } else {
      setFilteredNGOs(
        ngos.filter(
          (ngo) =>
            ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ngo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ngo.location.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery]);

  const displayedNGOs = showAll
    ? filteredNGOs
    : filteredNGOs.slice(0, numOfCards);

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle={"default"} hidden={false} />
      <View>
      <Text style={styles.User}>Hello {userData.firstName}</Text>
      <Text style={styles.Head}>Choose Your NGOs</Text>
      <Image
        source={{ uri: userData.userPhoto }}
        style={styles.userPhoto}
      />
      </View>
      <TextInput
        placeholder="Search"
        style={styles.search}
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
      <Icon name="search" size={20} color="#888" style={styles.searchIcon} />

     <Image
     source={require("../assets/profile1.png")}
     style={styles.monthlyPhoto}
   />
      <Text style={styles.monthtext1}>    NGO</Text>
      <Text style={styles.monthtext2}>    OF THE MONTH</Text>
      <Text style={styles.allNGOs}></Text>
      <Text style={styles.listed}>Listed NGOs</Text>
      {filteredNGOs.length > numOfCards && (
        <TouchableOpacity onPress={() => setShowAll(!showAll)}>
          <Text style={styles.viewAll}>
            {showAll ? "View Less" : "View All"}
          </Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={displayedNGOs}
        renderItem={({ item }) => (
          <TouchableOpacity
          onPress={() =>
           (item.name == "CHETNA")
              ? navigation.navigate('Chetna')
              : alert(`${item.name} page is not implemented yet!`)
          }
        >
            <View style={styles.card}>
              <Image source={{ uri: item.photo }} style={styles.ngoImage} />
              <View style={styles.ngoDetails}>
                <Text style={styles.ngoName}>{item.name}</Text>
                <Text style={styles.ngoDescription}>{item.description}</Text>
                <Text style={styles.ngoLocation}>{item.location}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        horizontal={false}
        contentContainerStyle={styles.flatlistContainer}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20, color: "#666" }}>
            No NGOs found matching your search.
          </Text>
        }
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  monthtext1: {
    fontSize: 40,
    color: "white",
    fontWeight: "bold",
    position: "absolute",
    top: "35%",
    left: "63%",
    fontWeight: "bold",
    fontFamily: "times",
    color: "#fff", 
    textShadowColor: "black", 
    textShadowOffset: { width: 2, height: 2 }, 
    textShadowRadius: 5,
  },
  monthtext2: {
    fontSize: 40,
    color: "white",
    fontWeight: "bold",
    position: "absolute",
    top: "40%",
    left: "4%",
    fontWeight: "bold",
    fontFamily: "times",
    color: "#fff", 
    textShadowColor: "#000", 
    textShadowOffset: { width: 2, height: 2 }, 
    textShadowRadius: 5, 
  },
  userPhoto: {
    width: 70,
    height: 70,
    borderRadius: 200,
    position: "absolute",
    right: "3%",
    top: "1%",
  },
  User: {
    color: "grey",
    paddingTop: 10,
  },
  Head: {
    fontSize: 20,
    fontFamily: "Times",
    fontWeight: "bold",
  },
  monthlyPhoto: {
    width: "100%",
    height: "26%",
    borderRadius: 15,
    marginTop: 0,
  },
  searchIcon: {
    position: "realtive",
    top: "-30",
    left: "8",
    zIndex: 1,
  },

  search: {
    width: "100%", 
    height: 40,
    backgroundColor: "#ffff",
    borderColor: "black",
    borderWidth: 1,
    marginTop: "10%",
    borderRadius: 10,
    paddingLeft: 45, 
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  mainContainer: {
    padding: 10,
    backgroundColor: "#f3e5e1",
    flex: 1,
  },
  flatlistContainer: {
    marginTop: 10,
  },
  card: {
    flexDirection: "row", 
    backgroundColor: "#fff",
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
  },
  ngoImage: {
    width: 80,
    height: 80, 
    borderRadius: 10,
    marginRight: 15,
  },
  ngoDetails: {
    flexDirection: "column", 
    justifyContent: "center",
    position: "absolute",
    left: "35%",
  },
  ngoName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  ngoDescription: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  ngoLocation: {
    fontSize: 12,
    color: "#888",
  },
  allNGOs: {
    fontSize: 24,
    color: "Black",
    fontWeight: "Condensed",
    marginTop: 34,
    position: "realtive",
    top: "1%",
    left: "5%",
    fontFamily:'serif',
  },
  viewAll: {
    color: "#FF5733",
    fontSize: 16,
    textAlign: "right",
    marginTop: -20,
    fontWeight: "bold",
  },
  listed:{
    fontSize: 24,
    color: "Black",
    fontWeight: "Condensed",
    marginTop: -60,
    position: "realtive",
    top: "0.1%",
    left: "1%",
    fontFamily:'serif',
  }
});