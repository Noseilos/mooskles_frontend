import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { defaultStyle } from "../styles/styles";
import Header from "../components/Header";
import Heading from "../components/Heading";
import { Button } from "react-native-paper";
import { colors } from "../styles/styles";
import CartItem from "../components/CartItem";
import { useNavigation } from "@react-navigation/native";

export const cartItems = [
  {
    name: "Xiaomi",
    image: "https://pngimg.com/d/dumbbell_PNG102651.png",
    product: "cbfwbbwcc",
    stock: 5,
    price: 150,
    quantity: 2,
  },
  {
    name: "Poco",
    image: "https://pngimg.com/d/dumbbell_PNG102651.png",
    product: "cbfwbbrwcc",
    stock: 5,
    price: 1520,
    quantity: 1,
  },
  {
    name: "Redmi",
    image: "https://pngimg.com/d/dumbbell_PNG102651.png",
    product: "cbfwbeewefbwcc",
    stock: 5,
    price: 1504,
    quantity: 2,
  },
  {
    name: "Xiaomi",
    image: "https://pngimg.com/d/dumbbell_PNG102651.png",
    product: "cbfwbngfnbwcc",
    stock: 5,
    price: 150,
    quantity: 2,
  },
  {
    name: "Poco",
    image: "https://pngimg.com/d/dumbbell_PNG102651.png",
    product: "cbfwbfgnbrwcc",
    stock: 5,
    price: 1520,
    quantity: 1,
  },
  {
    name: "Redmi",
    image: "https://pngimg.com/d/dumbbell_PNG102651.png",
    product: "cbfwbeewgnefbwcc",
    stock: 5,
    price: 1504,
    quantity: 2,
  },
];

const Cart = () => {
  const navigate = useNavigation();

  const incrementHandler = (id, name, price, image, stock, quantity) => {
    const newQty = quantity + 1;
    if (stock <= quantity)
      return Toast.show({
        type: "error",
        text1: "Maximum value added",
      });
  };

  const decrementHandler = (id, name, price, image, stock, quantity) => {
    const newQty = quantity - 1;

    if (1 >= quantity) return;
  };

  return (
    <View
      style={{
        ...defaultStyle,
        padding: 0,
      }}
    >
      {/* Header */}
      <Header back={true} emptyCart={true} />

      {/* Heading */}
      <Heading
        text1="Shopping"
        text2="Cart"
        containerStyle={{ paddingTop: 70, marginLeft: 35 }}
      />

      <View
        style={{
          paddingVertical: 20,
          flex: 1,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {cartItems.length > 0 ? (
            cartItems.map((i, index) => (
              <CartItem
                navigate={navigate}
                key={i.product}
                id={i.product}
                name={i.name}
                stock={i.stock}
                amount={i.price}
                imgSrc={i.image}
                index={index}
                qty={i.quantity}
                incrementhandler={incrementHandler}
                decrementHandler={decrementHandler}
              />
            ))
          ) : (
            <Text style={{ textAlign: "center", fontSize: 18 }}>
              No Items Yet
            </Text>
          )}
        </ScrollView>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 35,
        }}
      >
        <Text>5 Items</Text>
        <Text>₹124</Text>
      </View>

      <TouchableOpacity
        onPress={
          cartItems.length > 0 ? () => navigate.navigate("confirmorder") : null
        }
      >
        <Button
          style={{
            backgroundColor: colors.color3,
            borderRadius: 100,
            padding: 5,
            margin: 30,
          }}
          icon={"cart"}
          textColor={colors.color2}
        >
          Checkout
        </Button>
      </TouchableOpacity>
    </View>
  );
};

export default Cart;
