import Icon from 'react-native-vector-icons/MaterialIcons'
import { Swipeable } from 'react-native-gesture-handler'
import COLORS from '../../consts/colors';
import { Animated, SafeAreaView, Modal } from 'react-native'
import axios from "axios";
import * as React from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Image,
  Text,
  View,
  StyleSheet,
  FlatList,
  LayoutAnimation,
  UIManager,
  Platform,
  TouchableOpacity,
  Dimensions,
  Pressable
} from "react-native";
import { PrimaryButton } from '../components/Button';
import { BaseURL } from '../../consts/BaseURL';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

const { width } = Dimensions.get('window');

const layoutAnimConfig = {
  duration: 300,
  update: {
    type: LayoutAnimation.Types.easeInEaseOut,
  },
  delete: {
    duration: 100,
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
};

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function CartScreen() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [productImage, setProductImage] = useState('');

  const removeItem = async (id) => {
    let arr = data.filter(function (item) {
      return item.productId !== id
    })
    
    const cartID = await AsyncStorage.getItem("cartId");
    const cartId2 = parseInt(cartID)
    // CALL API DELETE PRODUCT IN CART
    axios.delete(`${BaseURL}/api/v1/cart/product?cartId=${cartId2}&productId=${id}`)
      .then((res) => {
        console.log(res.data.message)
        axios.get(`${BaseURL}/api/v1/user/image?filename=${res.data.productImage}`)
          .then((res) => {
            let x = res.data.slice(0,-1);
            setProductImage(x);
          })
      })
      .catch((err) => {
        console.log('Errors: ', err);
      })

    setData(arr);
  
    LayoutAnimation.configureNext(layoutAnimConfig);
  };

  // CACULATE SUBTOTAL
  const subtotal = data.reduce((acc, item) => {
    return acc + (item.price * item.amount) ; 
  }, 0)

  React.useEffect(async () => {
    setLoading(true);
    const cartID = await AsyncStorage.getItem("cartId");
    const cartId2 = parseInt(cartID)
    console.log("const cartID: ", typeof (cartID), cartID)
    console.log("const cartId2: ", typeof (cartId2), cartId2)

    axios.get(`${BaseURL}/api/v1/cart/product?cartId=${cartId2}`)
      .then((res) => setData(res.data))
      .catch((error) => console.log("Error: ", error))
      .finally(() => setLoading(false))
  }, [])

  const handleInscrease = async (id) => {
    const cartID = await AsyncStorage.getItem("cartId");
    const cartId2 = parseInt(cartID)

    axios.post(`${BaseURL}/api/v1/cart/product?cartId=${cartId2}&productId=${id}&amount=${1}`)
        .then((res) => {
            console.log("Add product to cart response: ", res.data.message);
        })
        .catch((err) => {
            console.log("Add product to cart error: ", err)
        })
    
    navigation.goBack();
    navigation.navigate('CartScreen');
  }

  const handleDecrease = async (id) => {
    const cartID = await AsyncStorage.getItem("cartId");
    const cartId2 = parseInt(cartID)

    axios.post(`${BaseURL}/api/v1/cart/product?cartId=${cartId2}&productId=${id}&amount=${-1}`)
        .then((res) => {
            console.log("Add product to cart response: ", res.data.message);
        })
        .catch((err) => {
            console.log("Add product to cart error: ", err)
        })
    
    navigation.goBack();
    navigation.navigate('CartScreen');
  }

  if (loading) {
    return (
      <SafeAreaView style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ marginTop: width / 1.5 }}>Loading......</Text>
      </SafeAreaView>
    )
  }
  return (
    <SafeAreaView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Notification</Text> 
              <Image source={require('../../assets/succesfully.gif')} style={{width: 150, height: 150}} />
              <Text style={styles.modalText}>Delete product succesfully</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]} removeItem
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>Done</Text>
              </Pressable>
            </View>
          </View>
      </Modal>
      <View style={styles.header}>
        <Icon name='arrow-back-ios' size={28} onPress={navigation.goBack} />
        <Text style={{ fontWeight: 'bold' }}>My cart</Text>
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatList}
        data={data}
        keyExtractor={(item) => item.productId}
        renderItem={({ item }) => {

          // leftSwipe components 
          const leftSwipe = (progress, dragX) => {
            const scale = dragX.interpolate({
              inputRange: [0, 100],
              outputRange: [0, 1],
              extrapolate: 'clamp',
            });
            return (
              <View style={{ flexDirection: 'row' }}>

                <TouchableOpacity activeOpacity={0.6} style={{ marginLeft: 5, }}  >
                  <View style={styles.deleteBox}>
                    <Animated.Text style={{ transform: [{ scale: scale }] }}>
                      <TouchableOpacity onPress={() => {
                        setModalVisible(true);
                        removeItem(item.productId);
                      }}>
                        <Icon name='delete' size={40} color={COLORS.white} />
                        <Text style={{ fontWeight: 'bold', color: COLORS.white }}>Delete</Text>
                      </TouchableOpacity>
                    </Animated.Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.6} style={{ marginLeft: 5, }}  >
                  <View style={styles.viewBox}>
                    <Animated.Text style={{ transform: [{ scale: scale }] }}>
                      <TouchableOpacity onPress={() => navigation.navigate('ProductDetailScreen', item)} >
                        <Icon name='search' size={40} color={COLORS.white} />
                        <Text style={{ fontWeight: 'bold', color: COLORS.white }}>View</Text>
                      </TouchableOpacity>
                    </Animated.Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          };
          return (
            <Swipeable renderLeftActions={leftSwipe}>
              <View style={styles.cartCard}>
                <Image source={{ uri: item.productImage.slice(0,-1) }} style={{ height: 80, width: 80 }} />
                <View style={{ flex: 1, paddingVertical: 20, marginLeft: 10, height: 100 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.productName}</Text>
                  <Text style={{ fontSize: 13, color: COLORS.white }}>{item.productId}</Text>
                  <Text style={{ fontSize: 17, color: COLORS.white, fontWeight: 'bold' }}>{item.price} VNĐ</Text>
                </View>
                <View style={{ marginRight: 20, alignItems: 'center' }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{item.amount}</Text>
                  <View style={styles.actionBtn}>
                    <TouchableOpacity onPress={() => handleDecrease(item.productId)}>
                      <Icon name='remove' size={25} color={COLORS.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleInscrease(item.productId)}>
                      <Icon name='add' size={25} color={COLORS.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Swipeable>
          );
        }}
        ListFooterComponentStyle={{paddingHorizontal: 20, marginTop: 20}}
        ListFooterComponent={() => (
          <View>
            
                <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginVertical: 15,
                }}>
                  <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                    Total price
                  </Text>
                  <Text style={{fontSize: 20, fontWeight: 'bold'}}>{subtotal} VNĐ</Text>
                </View> 
            
            <View style={{marginHorizontal: 60}}>
              <PrimaryButton title="CHECKOUT" 
                onPress={() => navigation.navigate('CheckoutScreen')}
              />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",

    backgroundColor: "#ecf0f1",
    padding: 8,

  },
  flatList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  cardContainer: {
    height: 100,
    width: width * 0.5,
    marginRight: 8,
    marginVertical: 10
  },
  card: {
    height: 100,
    width: width * 0.5,
    borderRadius: 12,
    padding: 10,
  },
  text: { color: "black", fontWeight: 'bold' }

  ,
  deleteBox: {
    height: 100,
    width: 80,
    elevation: 15,
    borderRadius: 10,
    backgroundColor: 'red',
    marginVertical: 10,
    opacity: 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  viewBox: {
    height: 100,
    width: 80,
    elevation: 15,
    borderRadius: 10,
    backgroundColor: 'green',
    marginVertical: 10,
    opacity: 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  cartCard: {
    height: 100,
    elevation: 15,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    marginVertical: 10,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    backgroundColor: COLORS.white,
    height: 30,
    width: 80,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    paddingHorizontal: 5,
  },
// MODAL VISIBLE NOTIFICATION
centeredView: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 22,

},
modalView: {
  margin: 20,
  backgroundColor: 'white',
  borderRadius: 20,
  padding: 35,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
},
button: {
  borderRadius: 20,
  padding: 10,
  elevation: 2,
},
buttonOpen: {
  backgroundColor: '#F194FF',
},
buttonClose: {
  backgroundColor: COLORS.primary,
  padding: 10,
},
textStyle: {
  color: 'white',
  fontWeight: 'bold',
  textAlign: 'center',
  padding: 10,
},
modalTitle: {
  marginBottom: 20,
  textAlign: 'center',
  fontSize: 20,
  width: 200,
  lineHeight: 30,
  fontWeight: "bold",
},
modalText: {
  marginBottom: 20,
  textAlign: 'center',
  fontSize: 18,
  width: 200,
  lineHeight: 30,
},
});