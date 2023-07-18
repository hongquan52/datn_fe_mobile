import React from 'react'
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Modal, Image, Button } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { TextInput } from 'react-native-gesture-handler'
import { PrimaryButton, SecondaryButton } from '../components/Button'
import Icon from 'react-native-vector-icons/MaterialIcons'
import COLORS from '../../consts/colors'
import categories from '../../consts/categories'
import { Controller, useForm } from 'react-hook-form'
// import Slider from '../components/Slider'
import Card from '../components/Card'
import { useNavigation } from '@react-navigation/native'
import { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'
import { BaseURL } from '../../consts/BaseURL'
import { Suspense } from 'react'

const Slider = React.lazy(() => import('../components/Slider'));


const images = [
  'https://treobangron.com.vn/wp-content/uploads/2023/01/banner-shopee-12.jpg',
  'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh8SISDW3DMU6c18rbgwn15ZaWksRvfyW3qiO2tN8K8-ANZ4sWo8mGOjcPqnCGKWbPJ28FzZ-X_eyshUv5HohOk5hlWm8JEy0QualVSzMkSCH5Yq992C2gtstscRQjfeSr72KOvO-cc2ATYtstsXq9Bl1cA2M06c7r3NDpcGgN0cTmP4-EZiAKc6YuGZA/s1920/saleluongve.jpg',
  'https://mgg.vn/wp-content/uploads/2018/11/banner-shopee-sieu-sale.png',
]

const ProductsScreen = ({ navigation, route }) => {
  // GET VALUE SEARCH TEXT FROM HOME SCREEN
  const item = route.params;
  console.log("================================================================: ", item)
  const [selectedCategoryIndex, setSelectedCategoryIndex] = React.useState(0);

  const [productData, setProductData] = useState([]);
  const [productDataOriginal, setProductDataOriginal] = useState([]);
  // FILTER MODAL
  const [filterRating, setFilterRating] = useState(6);
  const [filterBrand, setFilterBrand] = useState('');
  const [filterTag, setFilterTag] = useState('');

  const [filterMode, setFilterMode] = useState(false);
  const [category, setCategory] = useState('All');

  const [filterMinPrice, setFilterMinPrice] = useState(0);
  const [filterMaxPrice, setFilterMaxPrice] = useState(100000000);
  // SEARCH PRODUCT
  const [searchText, setSearchText] = useState('');
  const [searchedProduct, setSearchedProduct] = useState([]);
  // MODAL FILTER STATE:
  const [modalFilterVisible, setModalFilterVisible] = useState(false);
  useEffect(() => {
    if (category === 'All') {
      let x = productData.filter((item) => {
        if (searchText === '')
          return item;
        if (item.name.toLowerCase().includes(searchText?.toLowerCase()))
          return item
      })
      setSearchedProduct(x);
    } else {
      let y = productData.filter(
        (item) => item.category === category
      )
      let z = y.filter((item) => {
        if (searchText === '')
          return item;
        if (item.name.toLowerCase().includes(searchText?.toLowerCase()))
          return item
      })
      setSearchedProduct(z);
    }
  }, [category, searchText, productData])

  // FILTER PRODUCT FUNCTION
  useEffect(() => {
    let min = parseInt(filterMinPrice);
    let max = parseInt(filterMaxPrice);
    if (filterTag === 'Flash Sale') {
      if (filterRating === 6) {
        if (filterBrand !== '') {
          const x = productDataOriginal.filter(
            (item) => item.brand === filterBrand && item.discount >= 40 && item.discountPrice >= min && item.discountPrice <= max
          )
          setProductData(x);
        }
        else {
          const y = productDataOriginal.filter(
            (item) => item.discount >= 40 && item.discountPrice >= min && item.discountPrice <= max
          )
          setProductData(y);
        }
      }
      else {
        if (filterBrand !== '') {
          const x = productDataOriginal.filter(
            (item) => item.brand === filterBrand && item.rate <= filterRating && item.rate >= (filterRating - 1) && item.discount >= 40
                && item.discountPrice >= min && item.discountPrice <= max
          )
          setProductData(x);
        }
        else {
          const x = productDataOriginal.filter(
            (item) => item.rate <= filterRating && item.rate >= (filterRating - 1) && item.discount >= 40
                      && item.discountPrice >= min && item.discountPrice <= max
          )
          setProductData(x);
        }
      }
    }
    else {
      if (filterRating === 6) {
        if (filterBrand !== '') {
          const x = productDataOriginal.filter(
            (item) => item.brand === filterBrand && item.discountPrice >= min && item.discountPrice <= max
          )
          setProductData(x);
        }
        else {
          let z = productDataOriginal.filter(
            (item) => item.discountPrice >= min && item.discountPrice <= max
          )
          setProductData(z);
        }
      }
      else {
        if (filterBrand !== '') {
          const x = productDataOriginal.filter(
            (item) => item.brand === filterBrand && item.rate <= filterRating && item.rate >= (filterRating - 1)
                    && item.discountPrice >= min && item.discountPrice <= max
          )
          setProductData(x);
        }
        else {
          const x = productDataOriginal.filter(
            (item) => item.rate <= filterRating && item.rate >= (filterRating - 1)
                    && item.discountPrice >= min && item.discountPrice <= max
          )
          setProductData(x);
        }
      }
    }
  }, [filterMode])
  const ListCategories = () => {
    return (

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ marginBottom: 30 }}
      >
        {categories.map((category, index) => (
          <TouchableOpacity key={index}
            activeOpacity={0.8}
            onPress={() => {
              setSelectedCategoryIndex(index);
              setCategory(category.name);
            }}>
            <View style={{
              ...style.categoryBtn,
              borderBottomColor: COLORS.dark,
              borderBottomWidth: selectedCategoryIndex === index ? 1 : 0,
              justifyContent: 'center',
              marginHorizontal: 10,
            }
            }>

              <Text style={{ marginLeft: 10, fontSize: selectedCategoryIndex == index ? 21 : 20, fontWeight: selectedCategoryIndex == index ? 'bold' : null }}>
                {category.name}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };
  // SUBMIT FUNCTION
  const { handleSubmit, control } = useForm();
  const onSubmit = (data) => {
    data.searchValue = searchValue;
    console.log("New data: ", data)
  }
  useEffect(() => {

    // GET ALL PRODUCT
    axios.get(`${BaseURL}/api/v1/product`)
      .then((res) => {
        setProductData(res.data);
        setProductDataOriginal(res.data);

        // SEARCH PRODUCT WHEN NAVIGATION FROM HOME TO SHOPPING SCREEN
        item?.searchProductText !== undefined && setSearchText(item?.searchProductText);
        setFilterTag(item.flashSale);
        item.flashSale === 'Flash Sale' && setFilterMode(!filterMode)
        // HOT PRODUCT

      })
      .catch((err) => console.log(err));
  }, [])
  return (
    <SafeAreaView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalFilterVisible}
      >
        <View style={style.centeredView1}>
          <View style={style.modalView}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Lọc sản phẩm</Text>
              <Icon name='highlight-remove' size={30} onPress={() => setModalFilterVisible(!modalFilterVisible)} />
            </View>
            <View style={{ width: '100%', marginTop: 20 }}>
              <View>
                <Text style={{ fontSize: 20 }}>Đánh giá</Text>
                <View style={{ marginTop: 10, flexDirection: 'row', marginBottom: 20 }}>
                  {
                    [1, 2, 3, 4, 5].map((item) => (
                      <TouchableOpacity
                        onPress={() => setFilterRating(item)}
                      >
                        <View style={filterRating !== item ? style.filter__ratingItem : style.filter__ratingItemActive}>
                          <Text style={{ fontSize: 20, color: filterRating === item ? 'white' : 'black' }}>{item}</Text>
                          <Icon name='star' size={20} style={{ color: filterRating === item ? 'white' : 'black' }} />
                        </View>
                      </TouchableOpacity>
                    ))
                  }
                </View>
              </View>
              <Text style={{ fontSize: 20 }}>Thương hiệu</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                <View style={{ marginTop: 10, flexDirection: 'row', marginBottom: 20 }}>
                  <TouchableOpacity filter__BrandItemActive
                    style={[{ marginRight: 10 }, filterBrand === 'Samsung' && style.filter__BrandItemActive]}
                    onPress={() => setFilterBrand('Samsung')}
                  >
                    <Image
                      source={require('../../assets/brandLogo/SamsungLogo.png')}
                      style={{ width: 80, height: 50, borderRadius: 10 }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[{ marginRight: 10 }, filterBrand === 'Asus' && style.filter__BrandItemActive]}
                    onPress={() => setFilterBrand('Asus')}
                  >
                    <Image
                      source={require('../../assets/brandLogo/AsusLogo.png')}
                      style={{ width: 80, height: 50, borderRadius: 10 }}
                    />

                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[{ marginRight: 10 }, filterBrand === 'Kingston' && style.filter__BrandItemActive]}
                    onPress={() => setFilterBrand('Kingston')}
                  >
                    <Image
                      source={require('../../assets/brandLogo/KingstonLogo.png')}
                      style={{ width: 80, height: 50, borderRadius: 10 }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[{ marginRight: 10 }, filterBrand === 'Intel' && style.filter__BrandItemActive]}
                    onPress={() => setFilterBrand('Intel')}
                  >
                    <Image
                      source={require('../../assets/brandLogo/IntelLogo.png')}
                      style={{ width: 80, height: 50, borderRadius: 10 }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[{ marginRight: 10 }, filterBrand === 'MSI' && style.filter__BrandItemActive]}
                    onPress={() => setFilterBrand('MSI')}
                  >
                    <Image
                      source={require('../../assets/brandLogo/MSILogo.png')}
                      style={{ width: 80, height: 50, borderRadius: 10 }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[{ marginRight: 10 }, filterBrand === 'Logitech' && style.filter__BrandItemActive]}
                    onPress={() => setFilterBrand('Logitech')}
                  >
                    <Image
                      source={require('../../assets/brandLogo/LogitechLogo.png')}
                      style={{ width: 80, height: 50, borderRadius: 10 }}
                    />
                  </TouchableOpacity>
                </View>
              </ScrollView>
              <View>
                <Text style={{ fontSize: 20 }}>Khoảng giá</Text>
                <View style={{ marginTop: 10, flexDirection: 'row', marginBottom: 20, alignItems: 'center', justifyContent: 'space-around' }}>
                  <TextInput 
                    placeholder='Min Price'
                    value={filterMinPrice}
                    style={{width: 100, height: 30, backgroundColor: COLORS.light, padding: 3, marginHorizontal: 5, borderRadius: 5}}
                    onChangeText={(text) => setFilterMinPrice(text)}
                    
                  />
                  <Text style={{fontSize: 30}}>-</Text>
                  <TextInput 
                    placeholder='Max Price'
                    value={filterMaxPrice}
                    style={{width: 100, height: 30, backgroundColor: COLORS.light, padding: 3, marginHorizontal: 5, borderRadius: 5}}
                    onChangeText={(e) => setFilterMaxPrice(e)}
                    
                  />
                  
                </View>
              </View>
              <View>
                <Text style={{ fontSize: 20 }}>Tags</Text>
                <View style={{ marginTop: 10, flexDirection: 'row', marginBottom: 20 }}>
                  {
                    ['Flash Sale', 'Best sales'].map((item) => (
                      <TouchableOpacity
                        onPress={() => setFilterTag(item)}
                      >
                        <View style={filterTag !== item ? style.filter__tagsItem : style.filter__tagsItemActive}>
                          <Text
                            style={{ color: filterTag === item ? COLORS.white : COLORS.dark }}
                          >{item}</Text>
                        </View>
                      </TouchableOpacity>
                    ))
                  }
                </View>
              </View>
              <PrimaryButton title={"Filter"}
                onPress={() => {
                  setFilterMode(!filterMode);
                }}
              />
              <View style={{ marginTop: 10 }}>
                <SecondaryButton title={"Refresh"}
                  onPress={() => {
                    setFilterMinPrice(0);
                    setFilterMaxPrice(100000000);
                    setFilterBrand('');
                    setFilterRating(6);
                    setFilterTag('');
                    setFilterMode(!filterMode);
                    // setProductData(productDataOriginal);
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <View
        style={{
          marginTop: 20,
          flexDirection: 'row',
          paddingHorizontal: 10,
        }}>
        <Controller
          name='searchValue'
          defaultValue={searchText}
          control={control}
          render={({ field: { onChangeText } }) => (
            <View style={style.inputContainer}>
              <Icon name="search" size={28} />
              <TextInput
                style={{ flex: 1, fontSize: 18 }}
                defaultValue={item?.searchProductText}
                placeholder="Search for food"
                onChangeText={(text) => setSearchText(text)}

              />
              {/* <TouchableOpacity onPress={() => setSearchText('')}>
                <Icon name='close' size={20} />
              </TouchableOpacity> */}
            </View>
          )}
        />

        <TouchableOpacity onPress={() => setModalFilterVisible(true)}>
          <View style={style.sortBtn}>
            <Icon name="tune" size={28} color={COLORS.white} />
          </View>
        </TouchableOpacity>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: 100 }}
      >
        <Suspense fallback={<Text>Loading...</Text>}>
          <Slider images={images} />
        </Suspense>
        <ListCategories />

        {
          searchedProduct.length > 0 ?
            <FlatList
              numColumns={2}
              showsVerticalScrollIndicator={false}
              data={searchedProduct}
              renderItem={({ item }) => <Card food={item} />}
            />
            :
            <Text>Không tìm thấy sản phẩm phù hợp</Text>
        }

      </ScrollView>

    </SafeAreaView>
  )
}

const style = StyleSheet.create({
  header: {
    flexDirection: 'row',
    paddingVertical: 20,
    alignItems: 'center',
    marginHorizontal: 20,
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
    height: 60,
    width: 125,
    marginRight: 2,
    alignItems: 'center',
    paddingHorizontal: 5,
    flexDirection: 'row',
  },
  // modal filter
  centeredView1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,

  },
  modalView: {
    width: 350,
    // height: 500,
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
  filter__ratingItem: {
    backgroundColor: COLORS.light,
    marginHorizontal: 10,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10,
  },
  filter__ratingItemActive: {
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    marginHorizontal: 10,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10,
  },
  filter__tagsItem: {
    backgroundColor: COLORS.light,
    marginHorizontal: 10,
    height: 40,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10,
  },
  filter__tagsItemActive: {
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    marginHorizontal: 10,
    height: 40,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10,
  },
  filter__BrandItemActive: {
    borderColor: COLORS.dark,
    borderWidth: 1,
  }

})

export default ProductsScreen
