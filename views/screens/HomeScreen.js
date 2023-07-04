import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { View, Text, SafeAreaView, StyleSheet, Image, Modal, TouchableOpacity, Dimensions, Pressable } from 'react-native'
import { TextInput, ScrollView, FlatList } from 'react-native-gesture-handler'
import COLORS from '../../consts/colors'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import listVoucher from '../../consts/vouchers'
import Slider from '../components/Slider'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BaseURL } from '../../consts/BaseURL'

const { width } = Dimensions.get("screen");
const cardWidth = width / 2;

const HomeScreen = ({ navigation }) => {
  const convert = (x) => {
    const y = x.toString();
    return y;
  };
  // MODAL VISIBLE
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleAddCart, setModalVisibleAddCart] = useState(false);

  const [user, setUser] = useState({});
  const [linkAvatar, setLinkAvatar] = useState('');
  const [cartAmount, setCartAmount] = useState(0);

  const [cartId, setCartId] = useState();

  const [allProduct, setAllProduct] = useState([]);
  const [flashSaleProduct, setFlashSaleProduct] = useState([]);
  const [hotProduct, setHotProduct] = useState([]);
  const [voucher, setVoucher] = useState([]);

  // SEARCH BAR PRODUCT STATE:
  const [searchProductText, setSearchProductText] = useState('');
  
  // HANDLE ADD PRODUCT TO CART
  const handleAddToCart = (productId) => {
    
    axios.post(`${BaseURL}/api/v1/cart/product?cartId=${cartId}&productId=${productId}&amount=1`)
      .then((res) => {
        console.log("Add product to cart response: ", res.data.message);
        setModalVisibleAddCart(true);
      })
      .catch((err) => {
        console.log("Add product to cart error: ", err)
      })
  }

  useEffect(async () => {
    const userID = await AsyncStorage.getItem("userId");

    const userID2 = parseInt(userID)
    console.log("const userID: ", typeof (userID), userID)
    console.log("const userID2: ", typeof (userID2), userID2)

    axios
      .get(`${BaseURL}/api/v1/user/${userID2}`)
      .then((res) => {
        setUser(res.data);

        // GET AVATAR USER:
        axios.get(`${BaseURL}/api/v1/user/image?filename=${res.data.image}`)
          .then((res) => setLinkAvatar(res.data))
          .catch((err) => console.log(err))

      })
      .catch((err) => console.log(err));

    // GET ALL PRODUCT
    axios.get(`${BaseURL}/api/v1/product`)
      .then((res) => {
        setAllProduct(res.data);
        // FLASH SALE
        let x = res.data.filter((item) => item.discount >= 40)
        setFlashSaleProduct(x);
        // HOT PRODUCT
        let y = res.data.filter((item) => item.rate > 3)
        setHotProduct(y)
      })
      .catch((err) => console.log(err));

    // API GET CART BY USERID
    axios
      .get(`${BaseURL}/api/v1/cart/user?userId=${userID2}`)
      .then(async (res) => {
        console.log('Cart data: ', res.data);
        const cartId = convert(res.data.cartId);
        await AsyncStorage.setItem('cartId', cartId);
        console.log('CartID: ', typeof (res.data.cartId))
        setCartAmount(res.data.amount);
        setCartId(res.data.cartId);
      })
      .catch((err) => console.log(err));
    // GET ALL VOUCHER
    axios.get(`${BaseURL}/api/v1/voucher`)
      .then((res) => {
        setVoucher(res.data);
      })
      .catch((err) => {
        console.log("Error voucher: ", err);
      })
  }, []);

  const Card = ({ food }) => {
    return (
      <View style={style.card}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate("ProductDetailScreen", food)}
        >
          {
            food.discount !== 0 &&
            <Text style={{
              position: 'absolute', top: 0, right: 0, backgroundColor: 'red', padding: 10, color: 'white', zIndex: 10, fontWeight: 'bold',
              fontSize: 20
            }}>-{food.discount}%</Text>
          }
          <View style={{ alignItems: 'center', top: 5, marginBottom: 5 }}>
            <Image source={{ uri: food.thumbnail.slice(0,-1) }} style={{ height: 120, width: 120 }} />
          </View>
        </TouchableOpacity>
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', height: 50 }}>{food.name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 14, color: COLORS.white, marginTop: 3 }}>
              {food.category}
            </Text>
            <Text style={{ fontSize: 20, color: 'yellow', marginTop: 3 }}>
              {Math.ceil(food.rate) + "★"}
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
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
            {food.price}
          </Text>
          <TouchableOpacity onPress={() => handleAddToCart(food.id)}>
            <View style={style.addToCartBtn}>
              <Icon name='add' size={20} color={COLORS.white} />
            </View>
          </TouchableOpacity>
        </View>

      </View>
    );
  }
  const VoucherCard = ({ voucher }) => {
    return (
      <View style={style.voucherCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={{uri: voucher.thumbnail}} style={{ height: 60, width: 60, margin: 10 }} />
          <View style={{}}>
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{voucher.title}</Text>
            <Text style={{ width: 120, fontSize: 13 }}>{voucher.description}</Text>
          </View>
        </View>

      </View>
    )
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleAddCart}
      >
        <View style={style.centeredView1}>
          <View style={style.modalView}>
            <Text style={style.modalTitle}>Notification</Text>
            <Image source={require('../../assets/succesfully.gif')} style={{ width: 150, height: 150 }} />
            <Text style={style.modalText}>Add product to cart successfully</Text>
            <Pressable
              style={[style.button, style.buttonClose]}
              onPress={() => setModalVisibleAddCart(!modalVisibleAddCart)}
            >
              <Text style={style.textStyle}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View style={style.centeredView}>
        <Modal
          animationType='slide'
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <View style={{
            marginTop: 50,
            width: '100%',
            height: '100%',
          }}>

            <View style={style.centeredView}>

              <Pressable onPress={() => setModalVisible(!modalVisible)}>
                <Icon size={28} style={{ color: COLORS.white, padding: 5 }} name='close' />
              </Pressable>
              <View style={style.user}>
                <Image
                  // source={require('../../assets/avatar.png')}
                  source={{ uri: linkAvatar.slice(0,-1)}}
                  style={{ height: 50, width: 50, borderRadius: 25 }}
                />
                <Text style={{ marginLeft: 10, fontWeight: 'bold', fontSize: 25, color: COLORS.white }}>{user.name}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name='supervised-user-circle' size={25} color={COLORS.white} />
                  <TouchableOpacity onPress={() => {
                    navigation.navigate("CustomerInfoScreen");
                    setModalVisible(!modalVisible);
                  }}>
                    <Text style={style.item}>Profile</Text>
                  </TouchableOpacity>
                </View>
                <Icon name='arrow-forward-ios' />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name='location-on' size={25} color={COLORS.white} />
                  <TouchableOpacity onPress={() => {
                    navigation.navigate("AddressScreen");
                    setModalVisible(!modalVisible);
                  }}>
                    <Text style={style.item}>My address</Text>
                  </TouchableOpacity>
                </View>
                <Icon name='arrow-forward-ios' />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name='shopping-bag' size={25} color={COLORS.white} />
                  <TouchableOpacity onPress={() => {
                    navigation.navigate("HistoryOrderScreen");
                    setModalVisible(!modalVisible);
                  }}>
                    <Text style={style.item}>My order</Text>
                  </TouchableOpacity>
                </View>
                <Icon name='arrow-forward-ios' />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icons name='barcode' size={25} color={COLORS.white} />
                  <TouchableOpacity onPress={() => {
                    navigation.navigate("VoucherScreen");
                    setModalVisible(!modalVisible);
                  }}>
                    <Text style={style.item}>My vouchers</Text>
                  </TouchableOpacity>
                </View>
                <Icon name='arrow-forward-ios' />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icons name='barcode' size={25} color={COLORS.white} />
                  <TouchableOpacity onPress={() => {
                    navigation.navigate("DashboardShipper");
                    setModalVisible(!modalVisible);
                  }}>
                    <Text style={style.item}>Shipper</Text>
                  </TouchableOpacity>
                </View>
                <Icon name='arrow-forward-ios' />
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name='logout' size={25} color={COLORS.white} />
                  <TouchableOpacity onPress={() => {
                    AsyncStorage.clear();
                    navigation.navigate("LoginScreen");
                    setModalVisible(!modalVisible);
                  }}>
                    <Text style={style.item}>Log out</Text>
                  </TouchableOpacity>
                </View>
                <Icon name='arrow-forward-ios' />
              </View>

            </View>
          </View>
        </Modal>
        {/* end modal */}
      </View>
      <View style={style.header}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
          >
            <Image
              source={{uri: linkAvatar.slice(0,-1)}}
              style={{ height: 50, width: 50, borderRadius: 25, marginRight: 60 }}
            />
          </TouchableOpacity>
          <View style={{ marginLeft: -55 }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontSize: 28 }}>Welcome,</Text>
              <Text style={{ fontSize: 28, fontWeight: 'bold', marginLeft: 10 }}>
                {user.name}
              </Text>
            </View>
            <Text style={{ marginTop: 5, fontSize: 22, color: COLORS.grey }}>
              What do you want today
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.navigate("CartScreen")}>
            <View style={{ flexDirection: 'row' }}>
              <Icon name='shopping-cart' size={50} />
              <View style={{
                backgroundColor: COLORS.primary, width: 15, height: 15, borderRadius: 7, justifyContent: 'center', alignItems: 'center'
                , marginLeft: -3
              }}>
                <Text style={{ color: COLORS.white, fontWeight: 'bold', fontSize: 16 }}>{cartAmount}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{}}
      >
        <View
          style={{
            marginTop: 40,
            flexDirection: 'row',
            paddingHorizontal: 20,
          }}>
          <View style={style.inputContainer}>
            <Icon name="search" size={28} />
            <TextInput
              style={{ flex: 1, fontSize: 18 }}
              placeholder="Search for food"
              onChangeText={(text) => setSearchProductText(text)}
            />
          </View>
          <TouchableOpacity onPress={() => {
              navigation.navigate("ProductsScreen", {searchProductText: searchProductText, flashSale: ''});
          }}>
            <View style={style.sortBtn}>
              <Icon name="search" size={28} color={COLORS.white} />
            </View>
          </TouchableOpacity>
        </View>
        <Slider images={images} />

        <View style={style.groupProductContainer}>
          <View style={style.highlightProduct}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginLeft: 10, }}>Hot vouchers</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, }}>
              <Icon name='arrow-forward-ios' size={25} />
              <TouchableOpacity
                onPress={() => navigation.navigate("VoucherListScreen")}
              >
                <Text style={{ fontSize: 16 }}>Show all</Text>
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}

            data={voucher}
            renderItem={({ item }) => <VoucherCard voucher={item} />}
          />
        </View>
        <View style={style.groupProductContainer}>
          <View style={style.highlightProduct}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginLeft: 10, }}>All product</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, }}>
              <Icon name='arrow-forward-ios' size={25} />
              <TouchableOpacity
                onPress={() => navigation.navigate("ProductsScreen", {searchProductText: '', flashSale: ''})}
              >
                <Text style={{ fontSize: 16 }}>Show all</Text>
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}

            data={allProduct}
            renderItem={({ item }) => <Card food={item} />}
          />
        </View>
        <View style={style.groupProductContainer}>
          <View style={style.highlightProduct}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginLeft: 10, }}>Flash Sale</Text>
            <TouchableOpacity onPress={() => navigation.navigate("ProductsScreen", {searchProductText: '', flashSale: 'Flash Sale'})}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, }}>
                <Icon name='arrow-forward-ios' size={25} />
                <Text>See all</Text>
              </View>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}

            data={flashSaleProduct}
            renderItem={({ item }) => <Card food={item} />}
          />
        </View>
        <View style={style.groupProductContainer}>
          <View style={style.highlightProduct}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginLeft: 10, }}>Hot product</Text>
            <TouchableOpacity onPress={() => navigation.navigate("ProductsScreen", {searchProductText: '', flashSale: ''})}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, }}>
                <Icon name='arrow-forward-ios' size={25} />
                <Text>See all</Text>
              </View>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}

            data={hotProduct}
            renderItem={({ item }) => <Card food={item} />}
          />
        </View>
      </ScrollView>

    </SafeAreaView>
  )
}

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
  },
  addToCartBtn: {
    height: 30,
    width: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  voucherCard: {
    height: 80,
    width: 280,
    marginHorizontal: 10,
    marginBottom: 20,
    marginTop: 10,
    elevation: 13,
    backgroundColor: COLORS.light,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
  },
  claimBtn: {
    height: 30,
    width: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },

  // modal user
  centeredView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: COLORS.primary,
  },
  user: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    marginVertical: 5, fontSize: 20, color: COLORS.white, padding: 10,

  },
  //
  groupProductContainer:
  {
    borderBottomColor: COLORS.dark, borderBottomWidth: 0.4, marginHorizontal: 10,

  },
  highlightProduct: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    justifyContent: 'space-between',
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 0,
    marginTop: 10,
    borderRadius: 10,
    shadowColor: COLORS.dark,
  },
  centeredView1: {
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
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 18,
    width: 200,
    lineHeight: 30,
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 20,
    width: 200,
    lineHeight: 30,
    fontWeight: 'bold',
  },
})

export default HomeScreen

const images = [
  'https://shopeeplus.com//upload/images/cach-tao-banner-xoay-vong.png',
  'https://daotaodigitalmarketing.vn/wp-content/uploads/2021/09/cong-cu-tao-banner-shopee.jpg',
  'https://treobangron.com.vn/wp-content/uploads/2023/01/banner-shopee-12.jpg',
]