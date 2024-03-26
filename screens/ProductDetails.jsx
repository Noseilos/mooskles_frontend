import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { defaultStyle, colors } from "../styles/styles";
import Header from "../components/Header";
import Comment from "../components/Comment";
import Carousel from "react-native-snap-carousel";
import { Avatar, Button } from "react-native-paper";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { getProductDetails } from "../redux/actions/productActions";
import { server } from "../redux/store";
import { AirbnbRating } from "react-native-ratings";
import { Table, Row, Rows, Cell } from "react-native-table-component";
import { deleteComment } from "../redux/actions/commentActions";
const SLIDER_WIDTH = Dimensions.get("window").width;
const ITEM_WIDTH = SLIDER_WIDTH;
import { FontAwesome } from 'react-native-vector-icons';

const ProductDetails = ({ route: { params } }) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const user = useSelector((state) => state.user);

  const {
    product: { name, price, stock, description, images },
  } = useSelector((state) => state.product);

  const [comments, setComments] = useState([]);
  const isCarousel = useRef(null);
  const [quantity, setQuantity] = useState(1);
  const isOutOfStock = stock === 0;

  const incrementQty = () => {
    if (stock <= quantity) {
      return Toast.show({
        type: "error",
        text1: "Maximum Value Added",
      });
    }
    setQuantity((prev) => prev + 1);
  };

  const decrementQty = () => {
    if (quantity <= 1) return;
    setQuantity((prev) => prev - 1);
  };

  const addToCardHandler = () => {
    if (stock === 0) {
      return Toast.show({
        type: "error",
        text1: "Out Of Stock",
      });
    }

    dispatch({
      type: "addToCart",
      payload: {
        product: params.id,
        name,
        price,
        image: images[0]?.url,
        stock,
        quantity,
      },
    });

    Toast.show({
      type: "success",
      text1: "Added To Cart",
    });
  };

  const addToWishlistHandler = (id, name, price, image, stock) => {
    dispatch({
      type: "addToWishlist",
      payload: {
        product:
          id,
          name,
          price,
          image,
          stock,
      }
    })
    
    Toast.show({
      type: "success",
      text1: "Added To Wishlist",
    });
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`${server}/comment/all/${params.id}`);
        const data = await response.json();
        setComments(data);
        // console.log(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [params.id, isFocused]);

  useEffect(() => {
    "";
    dispatch(getProductDetails(params.id));
  }, [dispatch, params.id, isFocused]);

  const handleDeleteComment = async (commentId) => {
    try {
      await dispatch(deleteComment(commentId));
      Toast.show({
        type: "success",
        text1: "Comment deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      Toast.show({
        type: "error",
        text1: "Failed to delete comment",
      });
    }
  };

  return (
    <ScrollView
      style={{ ...defaultStyle, padding: 0, backgroundColor: colors.color1 }}
    >
      <Header back={true} />
      <Carousel
        layout="stack"
        sliderWidth={SLIDER_WIDTH}
        itemWidth={ITEM_WIDTH}
        ref={isCarousel}
        data={images}
        renderItem={CarouselCardItem}
      />
      <View
        style={{
          backgroundColor: colors.color2,
          padding: 35,
          borderTopLeftRadius: 55,
          borderTopRightRadius: 55,
        }}
      >
        <Text numberOfLines={2} style={{ fontSize: 25 }}>
          {name}
        </Text>
        <Text style={{ fontSize: 18, fontWeight: "900" }}>₹{price}</Text>
        <Text
          style={{ letterSpacing: 1, lineHeight: 20, marginVertical: 15 }}
          numberOfLines={8}
        >
          {description}
        </Text>

        {/* Render reviews */}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 5,
          }}
        >
          <Text style={{ color: colors.color3, fontWeight: "100" }}>
            Quantity
          </Text>
          <View
            style={{
              width: 80,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={decrementQty}>
              <Avatar.Icon
                icon={"minus"}
                size={20}
                style={{
                  borderRadius: 5,
                  backgroundColor: colors.color5,
                  height: 25,
                  width: 25,
                }}
              />
            </TouchableOpacity>
            <Text style={style.quantity}>{quantity}</Text>
            <TouchableOpacity onPress={incrementQty}>
              <Avatar.Icon
                icon={"plus"}
                size={20}
                style={{
                  borderRadius: 5,
                  backgroundColor: colors.color5,
                  height: 25,
                  width: 25,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ flexDirection: "row", marginTop: 20 }}>
          <TouchableOpacity 
          activeOpacity={0.9} 
          onPress={addToCardHandler} 
          style={{ flex: 8 }}
          disabled={isOutOfStock}>
            <Button 
            icon={"cart"} 
            style={style.btn} 
            textColor={isOutOfStock ? colors.color2 : colors.color2}
            >
              {isOutOfStock ? "Out Of Stock" : "Add To Cart"}
            </Button>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => addToWishlistHandler(params.id, name, price, images[0]?.url, stock)} style={{ flex: 2, justifyContent: 'center', alignItems: 'center', padding: 10 }}>
            <FontAwesome name="heart" size={24} color={colors.color1} />
          </TouchableOpacity>
        </View>

        {/* Rating */}
        <AirbnbRating
          count={5}
          reviews={["Terrible", "Meh", "Hmm...", "Very Good", "Jesus"]}
          defaultRating={5}
          size={30}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
            marginTop: 20,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Comments</Text>
        </View>

        <FlatList
          data={comments}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontWeight: "bold" }}>{item.user}</Text>
              <Text>Rating: {item.rating}</Text>
              <Text>Comment: {item.text}</Text>
              {user &&
                user.user &&
                (user.user.role === "admin" ||
                  item.user === user.user._id ||
                  user.user.role === "Guest") && (
                  <TouchableOpacity
                    onPress={() => handleDeleteComment(item._id)}
                  >
                    <Text style={{ color: "red" }}>Delete</Text>
                  </TouchableOpacity>
                )}
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      <Comment />
    </ScrollView>
  );
};

const CarouselCardItem = ({ item, index }) => (
  <View style={style.container} key={index}>
    <Image source={{ uri: item.url }} style={style.image} />
  </View>
);

const style = StyleSheet.create({
  container: {
    backgroundColor: colors.color1,
    width: ITEM_WIDTH,
    paddingVertical: 40,
    height: 380,
  },
  image: {
    width: ITEM_WIDTH,
    resizeMode: "contain",
    height: 250,
  },
  quantity: {
    backgroundColor: colors.color4,
    height: 25,
    width: 25,
    textAlignVertical: "center",
    textAlign: "center",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.color5,
  },
  btn: {
    backgroundColor: colors.color3,
    borderRadius: 100,
    padding: 5,
    marginVertical: 35,
  },
});

export default ProductDetails;
