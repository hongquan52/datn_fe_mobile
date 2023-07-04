import React, {useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {View, SafeAreaView, StyleSheet, Text, Image, Modal, Pressable, TextInput, TouchableOpacity
, Alert} from 'react-native'
import {Controller, useForm} from 'react-hook-form'
import Icon from 'react-native-vector-icons/MaterialIcons'
import COLORS from '../../consts/colors'
import { ScrollView } from 'react-native-gesture-handler'
import {SecondaryButton, PrimaryButton} from '../components/Button'
import {Rating} from 'react-native-elements'
import rating from '../../consts/rating'
import { useEffect } from 'react'
import { BaseURL } from '../../consts/BaseURL'
import axios from 'axios'

const ProductDetailScreen = ({navigation, route}) => {
    const [product, setProduct] = useState({});
    const [productImage, setProductImage] = useState('');
    const [review, setReview] = useState([]);
    // SUMMARY TEXT
    const [summaryText,setSummaryText] = useState(false);
    // CUSTOMER RATING
    const [defaultRating, setDefaultRating] = React.useState(2)
    const [maxRating, setMaxRating] = useState([1,2,3,4,5]);
    // TOTAL RATING
    const [totalRating, setTotalRating] = useState();
    // TOTAL REVIEW STAR
    const [total5Star, setTotal5Star] = useState(0)
    const [total4Star, setTotal4Star] = useState(0)
    const [total3Star, setTotal3Star] = useState(0)
    const [total2Star, setTotal2Star] = useState(0)
    const [total1Star, setTotal1Star] = useState(0)
    // RATING BAR
    const CustomRatingBar = () => {
        return (
        <View style={style.customRatingBar}>
            {
            maxRating.map((item, index) => {
                return (
                <TouchableOpacity
                    activeOpacity={0.7}
                    key={item}
                    onPress={() => setDefaultRating(item)}
                >
                    <Image 
                    style={style.starImage}
                    source={
                        item <= defaultRating
                        ? require('../../assets/starRating/star_filled.png')
                        : require('../../assets/starRating/star_corner.png')
                    }
                    />
                </TouchableOpacity>
                )
            })
            }
        </View>
        )
    }
    // SUBMIT FUNCTION
    const { handleSubmit, control } = useForm();
    const onSubmit = async (data) => {
        const userID = await AsyncStorage.getItem("userId");
        const userID2 = parseInt(userID)

        var dataForm = new FormData();
        dataForm.append('vote', defaultRating);
        dataForm.append('user', userID2);
        dataForm.append('product', item.id);
        dataForm.append('content', data.description)

        axios.post(`${BaseURL}/api/v1/review`, dataForm)
            .then((res) => {
                if(res.data.status ==='BAD_REQUEST') {
                    setModalVisible(false);
                    setModalFailedReviewVisible(true);
                }
                else {
                    navigation.navigate('HomeScreen');
                    navigation.navigate('ProductDetailScreen', item);
                }
                // setModalFailedReviewVisible(true);
                // console.log(modalFailedReviewVisible);

            })
            .catch((err) => {
                console.log("err create review: ", err);
            })

    }
    // END RATING ---------------------------------------------------
    const item = route.params;
    const [modalVisible, setModalVisible] = React.useState(false);
    const [modalFailedReviewVisible, setModalFailedReviewVisible] = useState(false);
    // const [messageReview, setMessageReview] = useState('');

    // ADD TO CART
    const handleAddToCart = async () => {
        const cartID = await AsyncStorage.getItem("cartId");
        const cartId2 = parseInt(cartID)

        axios.post(`${BaseURL}/api/v1/cart/product?cartId=${cartId2}&productId=${item.id}&amount=1`)
        .then((res) => {
            console.log("Add product to cart response: ", res.data.message);
        })
        .catch((err) => {
            console.log("Add product to cart error: ", err)
        })
    }

    const createOneButtonAlert = () =>
    Alert.alert('Thông báo', 'Add product to cart sucessfully', [
      {
        text: 'OK',
    },
    ]);
    const createTwoButtonAlert = () =>
    Alert.alert('Alert Title', 'My Alert Msg', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress:() => setModalVisible(!modalVisible) },
    ]);

    // CALL API GET PRODUCT BY ID
    useEffect(async () => {
        
        axios.get(`${BaseURL}/api/v1/product/${item.id}`)
        .then((res) => {
            console.log('Product Detail data: ', res.data);
            setProduct(res.data);
            let x = res.data.thumbnail.slice(0,-1);
            console.log("================================================: ", x);
            setProductImage(x);
        })
        .catch((err) => console.log(err));
        // CALL API GET REVIEW BY PRODUCT ID
        axios.get(`${BaseURL}/api/v1/review/product?productId=${item.id}`)
            .then((res) => {
                console.log('Review data: ', res.data.list);
                setReview(res.data.list.slice(-5));
                
                // GET RATING OF PRODUCT
                const subtotal = res.data.list.reduce((acc, item) => {
                    return acc + item.vote;
                  }, 0)
                setTotalRating(subtotal);
                // GET TOTAL AMOUNT REVIEW
                const total5Star = res.data.list.filter((item) => {return item.vote == 5.0})
                setTotal5Star(total5Star.length);
                const total4Star = res.data.list.filter((item) => {return item.vote == 4.0})
                setTotal4Star(total4Star.length);
                const total3Star = res.data.list.filter((item) => {return item.vote == 3.0})
                setTotal3Star(total3Star.length);
                const total2Star = res.data.list.filter((item) => {return item.vote == 2.0})
                setTotal2Star(total2Star.length);
                const total1Star = res.data.list.filter((item) => {return item.vote == 1.0})
                setTotal1Star(total1Star.length);
            })
            .catch((err) => console.log(err));
    }, [])

    return (
    <SafeAreaView style={{ backgroundColor: COLORS.white }}>
        {/* MODAL RATING */}
        <Modal
            animationType='slide'
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);}}
            
        >
            <View style={{
                width: '100%',
                height: '100%',
                
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <View style={{
                    
                    width: 300,
                    height: 300,
                    backgroundColor: COLORS.white,
                    borderColor: COLORS.white,
                    borderWidth: 1,
                    opacity: 0.96,

                    shadowColor: "#000000",
                    shadowOpacity: 0.8,
                    shadowRadius: 10,
                    shadowOffset: {
                    height: 1,
                    width: 1
                    }
                    
                }}>
                    <Pressable>
                        <Icon
                            style={{padding: 2}}
                            size={30} 
                            name='close'
                            onPress={() => setModalVisible(!modalVisible)} />
                    </Pressable>
                    <View style={{marginHorizontal: 10, justifyContent: "center"}}>
                        
                        <Controller
                            name="rating"
                            defaultValue={defaultRating}
                            control={control}
                            render={({ field: { onChange } }) => (
                            <CustomRatingBar />
                            )}
                        />
                        
                        <Text style={style.label}>Description</Text>
                        <Controller
                            name="description"
                            defaultValue={""}
                            control={control}
                            render={({ field: { value1, onChange } }) => (
                            <TextInput
                                style={style.input}
                                selectionColor={"#5188E3"}
                                onChangeText={onChange}
                                value={value1}
                                multiline
                            />
                            )}
                        />
                        <PrimaryButton title={"Save"} onPress={handleSubmit(onSubmit)} />
                    </View>

                </View>
            </View>    
        </Modal>
        {/* MODAL FAILED REVIEW */}
        <Modal
                animationType="slide"
                transparent={true}
                visible={modalFailedReviewVisible}
                onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModalFailedReviewVisible(!modalFailedReviewVisible);
                }}>
                    <View style={style.centeredView}>
                        <View style={style.modalView}>
                            <Text style={[style.modalText, {fontWeight: "bold"}]}>Notification</Text>
                            <Text style={style.modalText}>You can't rate this product before purchased</Text>
                            <Image source={require('../../assets/error.gif')} style={{width: 150, height: 150}} />
                            <Pressable
                                style={[style.button, style.buttonClose]}
                                onPress={() => setModalFailedReviewVisible(!modalFailedReviewVisible)}
                            >
                                <Text style={style.textStyle}>DONE</Text>
                            </Pressable>
                        </View>
                    </View>
        </Modal>
        <View style={style.header}>
            <Icon name='arrow-back-ios' size={28} onPress={navigation.goBack} />
            <Text style={{fontWeight: 'bold'}}>Product Details</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: 280,
                position: 'relative'
            }}>
                <Image source={{uri: productImage}} style={{height: 220, width: 220}} />
                {
                    item.discount >= 40 &&
                    <Image
                        source={require('../../assets/flashSaleIcon.png')}
                        style={{width: 130 , height: 130, position: 'absolute', top: -20, right: 0, zIndex: 100}}
                    />
                }
            </View>
            <View style={style.details}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={{fontSize: 20, fontWeight: 'bold', color: COLORS.white, marginBottom: 30}}>
                        {product.name}
                    </Text>
                </View>
                <View style={{alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row'}}>
                    <Text style={{fontWeight: 'bold', fontSize: 22, marginRight: 5}}>{item.price*((100-item.discount)/100)} VND</Text>
                    <Text style={{textDecorationLine: 'line-through', fontSize: 22}}>{item.price} VND</Text>
                    <View style={{backgroundColor: COLORS.white, height: 30, justifyContent: 'center', marginLeft: 20, padding: 5, borderRadius: 10}}>
                        <Text style={{ fontSize: 22, color: 'red', fontWeight: 'bold' }}>-{item.discount}%</Text>
                        
                    </View>
                </View>
                {/* <Text style={{ fontSize: 22, color: 'red', fontWeight: 'bold' }}>{product.category}</Text>
                <Text style={{ fontSize: 22, color: 'red', fontWeight: 'bold' }}>{product.groupProduct}</Text>
                <Text style={{ fontSize: 22, color: 'red', fontWeight: 'bold' }}>{product.brand}</Text> */}
                <Text style={{fontWeight: 'bold', fontSize: 18, marginTop: 20, marginBottom: 5}}>Description</Text>
                <View style={{borderColor: COLORS.white, borderWidth: 1, padding: 10, borderRadius: 5}} >
                    <Text style={{height: summaryText ? 200 : 50, lineHeight: 30}}>
                        Xem tất cả các ưu đãi mua kèm tại đây:
                        ⭐ Ưu đãi giảm khi mua kèm Ram Laptop.
                        ⭐ Ưu đãi giảm khi mua kèm Phụ Kiện Laptop.
                        ⭐ Mua kèm túi chống sốc GearVN chỉ với giá 49.000đ.
                        ⭐ Giảm ngay 50.000đ khi mua kèm Chuột, Bàn phím, Tai nghe, 
                        ⭐ Giảm ngay 50.000đ khi mua kèm Giá đỡ iToshiro HL306.
                        ⭐ Giảm ngay 100.000 khi mua kèm Ghế, Màn hình.
                        ⭐ Giảm ngay 100.000 khi mua kèm Microsoft 365 (Từ 01.04 - 30.06.2023)

                        Hỗ trợ trả góp MPOS (Thẻ tín dụng),
                    </Text>
                    <TouchableOpacity
                        style={{alignItems: 'center'}}
                        onPress={() => setSummaryText(!summaryText)}>
                            <Text style={{fontSize: 16 , fontWeight: 500, color: COLORS.white}}>View more</Text>
                    </TouchableOpacity>
                </View>
                <View style={style.rating}>
                    <View style={style.rating__header}>
                        <View style={{alignItems: 'center'}}>
                            <Text style={{fontWeight: 'bold', fontSize: 18, marginVertical: 5}}>Review product</Text>
                            {
                                totalRating === 0 ?
                                <Text>0/5 ({review.length} reviews)</Text>
                                :
                                <Text>{totalRating/review.length}/5 ({review.length} reviews)</Text>
                            }
                            <Rating 
                                    imageSize={16}
                                    style={{marginVertical: 10}}
                                    readonly
                                    startingValue={4.8}
                            />
                            <View style={{marginLeft: 5}}>
                                <View style={{flexDirection: 'row', marginBottom: 5}}>
                                    <Text style={{fontSize: 20, width: 10}}>5</Text>
                                    <Icon size={20} name='star-rate' style={{color: '#daa520'}} /> 
                                    <View style={{backgroundColor: COLORS.light, height: 20, width: 200}}>
                                        <View style={{backgroundColor: COLORS.primary, height: 20, width: total5Star*30}}></View>

                                    </View>
                                </View>
                                <View style={{flexDirection: 'row',marginBottom: 5}}>
                                    <Text style={{fontSize: 20, width: 10}}>4</Text>
                                    <Icon size={20} name='star-rate' style={{color: '#daa520'}} /> 
                                    <View style={{backgroundColor: COLORS.light, height: 20, width: 200}}>
                                        <View style={{backgroundColor: COLORS.primary, height: 20, width: total4Star*30}}></View>

                                    </View>
                                </View>
                                <View style={{flexDirection: 'row',marginBottom: 5}}>
                                    <Text style={{fontSize: 20, width: 10}}>3</Text>
                                    <Icon size={20} name='star-rate' style={{color: '#daa520'}} /> 
                                    <View style={{backgroundColor: COLORS.light, height: 20, width: 200}}>
                                        <View style={{backgroundColor: COLORS.primary, height: 20, width: total3Star*30}}></View>

                                    </View>
                                </View>
                                <View style={{flexDirection: 'row',marginBottom: 5}}>
                                    <Text style={{fontSize: 20, width: 10}}>2</Text>
                                    <Icon size={20} name='star-rate' style={{color: '#daa520'}} /> 
                                    <View style={{backgroundColor: COLORS.light, height: 20, width: 200}}>
                                        <View style={{backgroundColor: COLORS.primary, height: 20, width: total2Star*30}}></View>

                                    </View>
                                </View>
                                <View style={{flexDirection: 'row',marginBottom: 5}}>
                                    <Text style={{fontSize: 20, width: 10}}>1</Text>
                                    <Icon size={20} name='star-rate' style={{color: '#daa520'}} /> 
                                    <View style={{backgroundColor: COLORS.light, height: 20, width: 200}}>
                                        <View style={{backgroundColor: COLORS.primary, height: 20, width: total1Star*30}}></View>

                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row',marginBottom: 5, alignItems: 'center'}}>
                            <TouchableOpacity onPress={() => navigation.navigate('ReviewProductScreen', item.id)}>
                                <Text style={{fontSize: 16}}>Show all</Text>
                            </TouchableOpacity>
                            
                            <Icon name='arrow-forward-ios' size={20} />
                        </View>
                    </View>
                    <View style={style.rating__body}>
                        {review.length == 0 ?  
                            <View style={{height: 200, justifyContent: 'center', alignItems: 'center'}}>
                                <Image source={require('../../assets/noReview.png')}
                                        style={{height: 50, width: 50, marginVertical: 20}} />
                                <Text>Chưa có đánh giá</Text>
                            </View>
                        : null}
                        {review.map((rate, index) => (
                            <View key={rate.id} style={{marginRight: 10, justifyContent: 'flex-start', marginLeft: 10,marginVertical: 15, flexDirection: 'row',
                                        borderBottomColor: COLORS.dark, borderBottomWidth: 0.3,}}>
                                <View>
                                    <Image source={require('../../assets/avatar.png')} style={{height: 40, width: 40, marginRight: 10, borderRadius: 10}} />
                                </View>
                                <View>
                                    <Text style={{fontWeight: 'bold', fontSize: 16}}>{rate.userName}</Text>
                                    <Rating 
                                        imageSize={16}
                                        style={{marginVertical: 10, width: 100}}
                                        readonly
                                        startingValue={rate.vote}
                                    />
                                    <Text style={{width: 270}}>{rate.content}</Text>
                                </View>
                                
                            </View>
                        ))}
                        <TouchableOpacity style={{alignItems: 'center', paddingBottom: 10}} onPress={() => setModalVisible(true)}>
                            <Text style={{fontWeight: 500, fontSize: 18, color: COLORS.primary}}>Write review...</Text>
                        </TouchableOpacity>
                        
                    </View>
                </View>
                <View style={{marginBottom: 50, marginTop: 20}}> 
                    <SecondaryButton title={"Add to cart"} onPress={
                        () => {
                            createOneButtonAlert();
                            console.log("product item route: ", item)
                            handleAddToCart();
                        }
                    } />
                </View>
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}

const style = StyleSheet.create({
    header: {
      paddingVertical: 20,
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 20,
    },
    details: {
      paddingHorizontal: 20,
      paddingTop: 40,
      paddingBottom: 60,
      backgroundColor: COLORS.primary,
      borderTopRightRadius: 40,
      borderTopLeftRadius: 40,
    },
    iconContainer: {
      backgroundColor: COLORS.white,
      height: 50,
      width: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 30,
    },
    detailsText: {
        color: COLORS.white,
        fontSize: 16,
        lineHeight: 22,
        marginTop: 10,
    },
    rating: {
        marginTop: 20,
        backgroundColor: COLORS.white,
        borderRadius: 4,
        
    },
    // rating custom
    customRatingBar: {
        justifyContent: "center",
        flexDirection: "row",
        marginTop: 30,
      },
      starImage: {
        resizeMode: "cover",
        width: 40,
        height: 40,
      },
      input: {
        borderStyle: "solid",
        borderColor: "#B7B7B7",
        borderRadius: 7,
        borderWidth: 1,
        fontSize: 15,
        height: 50,
        paddingStart: 10,
        marginBottom: 15,
      },
      label: {
        
        marginVertical: 10,
        color: COLORS.dark,
        fontSize: 18
      },
      // rating product
      rating__header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 5,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.dark,
        
      },
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
      modalText: {
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 18,
        width: 200,
        lineHeight: 30,
      },
  });

export default ProductDetailScreen