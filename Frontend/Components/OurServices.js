import React from "react";
import { StyleSheet, Text, View, FlatList, Image, Dimensions } from "react-native";

const services = [
  {
    id: "1",
    title: "Help Homeless",
    description:
      "Extend a helping hand to those without a home. Your support provides warm meals, safe shelter, and a chance to rebuild their lives. Together, we can offer hope and dignity to those who need it most.",
    image: "https://imgs.search.brave.com/Q2SvtG3cRoSMdLUPZnAgVN2UJ2Bs-d6spsxy8vwBNHY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTcy/NzY2NjU1L3Bob3Rv/L2EtbG9zdC1pbi10/aW1lLWNvbmNlcHQt/aW1hZ2Utb2YtdHdv/LWNoaWxkcmVuLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz0x/ZVNuYjdLM3ZmWEEz/ajcyVzA1SGJKOXAx/T2s3ajNLei03VXdw/cXhMY0lRPQ",
  },
  {
    id: "2",
    title: "Slums to school",
    description:
      "A significant number of children, primarily from challenging backgrounds, ended up being away from schools. Last academic year, we successfully enrolled more than 500 children (234 boys and 266 girls) in 34 govt schools across west Delhi",
    image: "https://static.toiimg.com/thumb/msid-109384874,imgsize-26230,width-400,height-225,resizemode-72/109384874.jpg",
  },
  {
    id: "3",
    title: "Direct Action with Children",
    description:
      "The participation of children is fundamental to the achievement of our objectives at CHETNA. Through working directly with the children, together we design the programme of activities that can best meet their needs.",
    image: "https://chetnango.org/wp-content/uploads/2015/08/IMG_0629.jpg",
  },
  {
    id: "4",
    title: "Advocacy",
    description:
      "We use advocacy as a tool to make a positive impact on policy making and bring about the desired refinement in the policies that are being implemented, drafted or discussed. Therefore it is vital in helping us reach our overall vision.",
    image: "https://chetnango.org/wp-content/uploads/2015/08/Children-connected-with-CHETNA-NGO-presenting-handmade-Railway-Engine-made-of-waste-materials-to-Honbl-Maneka-Gandhi-at-the-Foundation-Day-of-NCPCR.jpg",
  },
  {
    id: "5",
    title: "Sensitizing Stakeholders",
    description:
      "We cannot change the situation that Street and Working Children find themselves in without changing the attitudes of those around them. We work to ensure their immediate stakeholders and society in general better understand their struggle and what can be done to ensure their rights.",
    image: "https://chetnango.org/wp-content/uploads/2015/07/police-station-visit.jpg",
  },
  {
    id: "6",
    title: "Monthly Donations",
    description:
      "Make a difference every month with your kindness! Monthly donations ensure consistent support for our programs, from feeding the hungry to educating children.",
    image: "https://chetnango.org/wp-content/uploads/2015/07/what.jpg",
  },
];

const ServiceCard = ({ item }) => {
  const imageSource = item.image || item.image1;
  const imageStyle = item.style?.image1 || styles.image;

  return (
    <View style={styles.card}>
      <Image source={{ uri: imageSource }} style={imageStyle} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );
};

const Services = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Our Services</Text>
      <FlatList
        data={services}
        renderItem={({ item }) => <ServiceCard item={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Services;

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
    elevation: 5, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  textContainer: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});
