import React from 'react'
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native'
import COLORS from '../../consts/colors'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { TouchableHighlight, TouchableOpacity, Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { BaseURL } from '../../consts/BaseURL'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

const { width } = Dimensions.get("screen");
const cardWidth = width / 2 - 20;

const Card = ({ food }) => {
  const navigation = useNavigation();
  // ADD PRODUCT TO CART
  const addProduct = async () => {
    const cartID = await AsyncStorage.getItem("cartId");
    const cartId2 = parseInt(cartID);

    axios.post(`${BaseURL}/api/v1/cart/product?cartId=${cartId2}&productId=${food.id}&amount=1`)
      .then((res) => {
        console.log("Add product to cart response: ", res.data.message);
        
      })
      .catch((err) => {
        console.log("Add product to cart error: ", err)
      })
  }
  return (
    <View style={style.card}>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate("ProductDetailScreen", food)}
      >
        {
          food.discount !== 0 &&
          <Text style={{
            position: 'absolute', top: 0, right: 0, backgroundColor: 'red', padding: 5, color: 'white', zIndex: 10, fontWeight: 'bold',
            fontSize: 20
          }}>-{food.discount}%</Text>
        }
        <View style={{ alignItems: 'center', top: 5, marginBottom: 10 }}>
          <Image source={{ uri: food.thumbnail.slice(0, -1) }} style={{ height: 120, width: 120, borderRadius: 5 }} />
        </View>
      </TouchableOpacity>
      <View style={{ marginHorizontal: 20 }}>
        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{food.name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 14, color: COLORS.dark, marginTop: 3, backgroundColor: COLORS.secondary, padding: 5 }}>
            {food.category}
          </Text>
          <Text style={{ fontSize: 20, color: 'yellow', marginTop: 3 }}>
            {food.rate.toFixed(2) + "★"}
          </Text>
        </View>
      </View>
      <View
        style={{
          marginTop: 10,
          marginHorizontal: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View>
          {
            food.discount != 0 &&
            <Text style={style.originalPrice}>
              {food.price}
            </Text>
          }
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#df2020' }}>
            {food.discountPrice}
          </Text>
        </View>
        <Pressable onPress={() => addProduct()}>
          <View style={style.addToCartBtn}>
            <Icon name='add' size={20} color={COLORS.primary} />
          </View>
        </Pressable>
      </View>
      {
        food.discount >= 40 &&
        <Image
          source={require('../../assets/flashSaleIcon.png')}
          style={{ width: 75, height: 75, position: 'absolute', top: -15, left: -15, zIndex: 100 }}
        />
      }
    </View>

  );

}
export default Card

const style = StyleSheet.create({
  header: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  inputContainer: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: COLORS.light,
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sortBtn: {
    width: 50,
    height: 50,
    marginLeft: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesListContainer: {
    paddingVertical: 30,
    alignItems: 'center',
    paddingHorizontal: 20,

  },
  categoryBtn: {
    height: 45,
    width: 120,
    marginRight: 7,
    borderRadius: 30,
    alignItems: 'center',
    paddingHorizontal: 5,
    flexDirection: 'row',
  },
  categoryBtnImgCon: {
    height: 35,
    width: 35,
    backgroundColor: COLORS.white,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    height: 250,
    width: cardWidth,
    marginHorizontal: 10,
    marginBottom: 20,
    marginTop: 10,
    borderRadius: 15,
    elevation: 13,
    backgroundColor: COLORS.primary,
    position: 'relative',
  },
  addToCartBtn: {
    height: 30,
    width: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
  },
  originalPrice: {
    fontSize: 16,
    textDecorationLine: 'line-through'
  }

})