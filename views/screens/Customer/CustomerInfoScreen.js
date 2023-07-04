import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  Button,
  Dimensions,
} from "react-native";

import SilverRank from '../../../assets/SilverRank.png'
import DiamondRank from '../../../assets/DiamondRank.png'
import BronzeRank from '../../../assets/BronzeRank.png'
import GoldRank from '../../../assets/GoldRank.png'

import * as ImagePicker from 'expo-image-picker'

import COLORS from "../../../consts/colors";
import { useForm, Controller } from 'react-hook-form';
import { PrimaryButton } from "../../components/Button";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Icons from 'react-native-vector-icons/MaterialIcons'
import axios from "axios";
import { BaseURL } from "../../../consts/BaseURL";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";
const { width } = Dimensions.get('window');

const CustomerInfoScreen = ({ navigation }) => {
  const [loading, setLoading] = React.useState(false);

  // IMAGE PICKER
  const [localUri, setLocalUri] = useState('');
  const [filename, setFilename] = useState('');
  const [type, setType] = useState('');

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (result.canceled) {
      return;
    }
    // ImagePicker saves the taken photo to disk and returns a local URI to it
    let localUri = result.uri;
    setLocalUri(localUri);
    let filename = localUri.split('/').pop();
    setFilename(filename);
    // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    setType(type);

  }
  const uploadImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (result.canceled) {
      return;
    }
    // ImagePicker saves the taken photo to disk and returns a local URI to it
    let localUri = result.uri;
    setLocalUri(localUri);
    let filename = localUri.split('/').pop();
    setFilename(filename);
    // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    setType(type);

  }
  // END+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  // SUBMIT FUNCTION
  const { control, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = (data) => {
    if (localUri === '') {
      var dataForm = new FormData();
      dataForm.append('name', data.name);
      dataForm.append('email', data.email);
      dataForm.append('phone', user.phone);
      dataForm.append('gender', '1');

      axios.put(`${BaseURL}/api/v1/user/${user.id}`, dataForm)
        .then((res) => {
          console.log('UPdate user: ', res.data)
        })
        .catch((err) => console.log("Save customer err: ", err))
    }
    else {
      var dataForm = new FormData();
      dataForm.append('name', data.name);
      dataForm.append('email', data.email);
      dataForm.append('phone', user.phone);
      dataForm.append('image', { uri: localUri, name: filename, type });
      dataForm.append('gender', '1');

      axios.put(`${BaseURL}/api/v1/user/${user.id}`, dataForm, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
        .then((res) => {
          console.log('UPdate user: ', res.data)
        })
        .catch((err) => console.log("Save customer err: ", err))
    }

  }

  // MODAL VISIBLE
  const [modalVisible, setModalVisible] = React.useState(false);
  // API
  const [user, setUser] = useState({});
  const [userAvatar, setUserAvatar] = useState('');

  const [userRank, setUserRank] = useState({})
  const [userRole, setUserRole] = useState({});

  useEffect(async () => {
    setLoading(true);
    const userID = await AsyncStorage.getItem("userId");

    const userID2 = parseInt(userID)
    console.log("const userID: ", typeof (userID), userID)
    console.log("const userID2: ", typeof (userID2), userID2)

    axios
      .get(`${BaseURL}/api/v1/user/${userID2}`)
      .then((res) => {
        setUser(res.data);
        axios.get(`${BaseURL}/api/v1/user/image?filename=${res.data.image}`)
          .then((res) => setUserAvatar(res.data))
          .catch((err) => console.log(err))
        // setUserRank(res.data.rank);
        // setUserRole(res.data.role);
      })
      .catch((err) => {
        console.log("Customer Info ERRORS!!!");
      })
      .finally(() => setLoading(false))
  }, [])
  //SET STATE OF RANK, ROLE WHEN USER CHANGE
  useEffect(() => {
    setUserRole(user.role);
  }, [user])
  useEffect(() => {
    setUserRank(user.rank);
  }, [user])

  useEffect(async () => {
    navigation.addListener("focus", async (payload) => {
      const userID = await AsyncStorage.getItem("userId");

      const userID2 = parseInt(userID)
      console.log("const userID: ", typeof (userID), userID)
      console.log("const userID2: ", typeof (userID2), userID2)
      axios
        .get(`${BaseURL}/api/v1/user/${userID2}`)
        .then((res) => {
          setId(res.data.id)
          setUser(res.data);
          // setUserRank(res.data.rank);
          // setUserRole(res.data.role);

        })
        .catch((err) => {
          console.log("Customer Info ERRORS!!!");
        });
    });
  }, []);
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
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}

      >
        <View style={{
          width: '100%',
          height: '100%',

          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{

            width: 360,
            height: 500,
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
            <TouchableOpacity>
              <Icons
                style={{ padding: 2 }}
                size={30}
                name='close'
                onPress={() => setModalVisible(!modalVisible)} />
            </TouchableOpacity>
            <View style={styles.rankModalContainer}>
              <View style={styles.rankTitle}>
                <Text style={{fontWeight: "bold", fontSize: 20}}>Policy</Text>
                <Text style={{width: 300}}>Khi mua sản phẩm ở cửa hàng, với mỗi 100K trong tổng thanh toán khách hàng đã mua sắm sẽ được tích lũy 1 điểm</Text>
              </View>
              <View style={styles.rankDescription}>
                {/* BRONZE RANK */}
                <View style={styles.rankItem}>
                  <Image source={BronzeRank} style={{height: 60, width: 60, marginHorizontal: 10}} />
                  <View style={{marginHorizontal: 10}}>
                    <Text style={{fontWeight: 'bold'}}>Bronze</Text>
                    <Text style={{width: 200}}>Khi điểm tích lũy của khách hàng đạt mức dưới 50 điểm. Mức ưu đãi là 2 %</Text>
                  </View>
                </View>
                {/* SILVER RANK */}
                <View style={styles.rankItem}>
                  <Image source={SilverRank} style={{height: 60, width: 60, marginHorizontal: 10}} />
                  <View style={{marginHorizontal: 10}}>
                    <Text style={{fontWeight: 'bold'}}>Silver</Text>
                    <Text style={{width: 200}}>Khi điểm tích lũy của khách hàng đạt mức 50-100 điểm. Mức ưu đãi là 5 %</Text>
                  </View>
                </View>
                {/* GOLD RANK */}
                <View style={styles.rankItem}>
                  <Image source={GoldRank} style={{height: 60, width: 60, marginHorizontal: 10}} />
                  <View style={{marginHorizontal: 10}}>
                    <Text style={{fontWeight: 'bold'}}>Gold</Text>
                    <Text style={{width: 200}}>Khi điểm tích lũy của khách hàng đạt mức 100-200 điểm. Mức ưu đãi là 10 %</Text>
                  </View>
                </View>
                {/* DIAMOND RANK */}
                <View style={styles.rankItem}>
                  <Image source={DiamondRank} style={{height: 60, width: 60, marginHorizontal: 10}} />
                  <View style={{marginHorizontal: 10}}>
                    <Text style={{fontWeight: 'bold'}}>Diamond</Text>
                    <Text style={{width: 200}}>Khi điểm tích lũy của khách hàng đạt mức trên 200 điểm. Mức ưu đãi là 15 %</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.header}>
        <Icons name='arrow-back-ios' size={28} onPress={() => navigation.navigate('HomeScreen')} />
        <Text style={{ fontWeight: 'bold' }}>Profiles</Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}

      >
        <View style={{
          marginHorizontal: 10, flexDirection: "row", justifyContent: "flex-start", alignItems: "center", backgroundColor: COLORS.primary
          , paddingVertical: 10, borderRadius: 20
        }}>
          <View style={{ alignItems: "center", marginLeft: 10 }}>
            <Image

              source={{ uri: localUri ? localUri : userAvatar.slice(0, -1) }}

              style={{ height: 150, width: 150, borderRadius: 75 }}

            />
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity style={{ padding: 5, borderRadius: 5, marginTop: 5, flexDirection: "row", alignItems: "center", justifyContent: "center" }}
                onPress={() => takePhoto()}
              >
                <View style={styles.imageButton}><Icon name="camera" size={30} /></View>
              </TouchableOpacity>
              <TouchableOpacity style={{ padding: 5, borderRadius: 5, marginTop: 5, flexDirection: "row", alignItems: "center", justifyContent: "center" }}
                onPress={() => uploadImage()}
              >
                <View style={styles.imageButton}><Icon name="camera-burst" size={30} /></View>

              </TouchableOpacity>
            </View>
            <Button title="Change password" color={COLORS.white} onPress={() => navigation.navigate('WarnPasswordScreen', user.phone)} />
          </View>
          <View style={styles.customerRank}>
            <Image source={require('../../../assets/DiamondRank.png')} style={{height: 120, width: 120}} />
            <Text style={{fontSize: 30, color: COLORS.white, fontWeight: "bold"}}>{user?.rank?.name.toUpperCase()}</Text>
            <Text style={{fontSize: 20, color: COLORS.white, marginVertical: 10}}>{user.point} / 5000 (pts)</Text>
            <View style={{backgroundColor: COLORS.white, height: 25,borderRadius: 10, width: 140}}>
              <View style={{backgroundColor: '#bafc03' , height: 25,borderRadius: 10, width: 45}}>
              
              </View>
            </View>
          </View>

        </View>
        
        <View style={styles.container}>
          <Text style={styles.label}>Name</Text>
          <Controller
            name="name"
            defaultValue={user.name}
            control={control}
            rules={
              {
                required: {
                  value: true,
                  message: 'The name is required',
                }
              }
            }
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                defaultValue={user.name}
                style={styles.input}
                selectionColor={"#5188E3"}
                onChangeText={onChange}
                value={value}
                onBlur={onBlur}
              />
            )}
          />
          {errors.name && <Text style={styles.textDanger} >{errors.name.message}</Text>}
          <Text style={styles.label}>Phone</Text>
          <Controller
            name="phone"
            defaultValue={user.phone}
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                style={styles.input}
                selectionColor={"#5188E3"}
                onChangeText={onChange}
                defaultValue={user.phone}
                value={value}
                keyboardType="phone-pad"
                onBlur={onBlur}
                editable={false}
              />
            )}
          />
          {errors.phone && <Text style={styles.textDanger} >{errors.phone.message}</Text>}
          <Text style={styles.label}>Email</Text>
          <Controller
            name="email"
            defaultValue={user.email}
            control={control}
            rules={{
              required: {
                value: true,
                message: 'The email is required'
              },
            }}
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                style={styles.input}
                selectionColor={"#5188E3"}
                onChangeText={onChange}
                defaultValue={user.email}
                value={value}
                onBlur={onBlur}
              />
            )}
          />
          {errors.email && <Text style={styles.textDanger}>{errors.email.message}</Text>}
          <Text style={styles.label}>Rank</Text>
          {userRank &&
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 15 }}>
              <Text style={styles.inputRank}>{userRank.name} ({user?.rank?.discount}%)</Text>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text style={{ marginLeft: 10, color: COLORS.primary }}>View detail <Icons name="arrow-forward-ios" /></Text>
              </TouchableOpacity>
            </View>
          }
          <Text style={styles.label}>Role</Text>
          {userRole &&
            <Controller
              name="role"
              defaultValue={userRole.name}
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextInput
                  style={styles.input}
                  selectionColor={"#5188E3"}
                  onChangeText={onChange}
                  value={value}
                  defaultValue={userRole.name}
                  editable={false}
                />
              )}
            />
          }
          <PrimaryButton
            title={"Save"}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </ScrollView>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  container: {
    marginHorizontal: 10,
    marginTop: 20,

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
  inputRank: {
    borderStyle: "solid",
    borderColor: "#B7B7B7",
    borderRadius: 7,
    borderWidth: 1,
    fontSize: 15,
    height: 50,
    paddingStart: 10,
    // marginBottom: 15,
    lineHeight: 50,
    width: 200
  },
  inputApartmentNumber: {
    borderStyle: "solid",
    borderColor: "#B7B7B7",
    borderRadius: 7,
    borderWidth: 1,
    fontSize: 15,
    height: 50,
    paddingStart: 10,
    marginBottom: 15,
    width: 394
  },
  label: {
    marginBottom: 7,
    marginStart: 10,
    color: COLORS.dark,
    fontWeight: "bold",
  },
  labelApartmentNumber: {
    marginBottom: 7,
    marginStart: 10,
    color: COLORS.dark,
    marginTop: 250,

  },
  textDanger: {
    color: 'red',
    marginBottom: 10,
  },
  // rank customer
  rankModalContainer: {
    margin: 10,
  },
  rankTitle: {
    backgroundColor: COLORS.light,
    height: 100,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankDescription: {
    alignItems: "center",
    marginTop: 20,
  },
  // image
  imageButton: {
    fontSize: 14, marginVertical: 5, color: COLORS.dark, fontWeight: 400,
    backgroundColor: COLORS.light,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  // CUSTOMER RANK
  customerRank: {
    alignItems: 'center',
    justifyContent: "center",
    marginLeft: 50,
  },
  rankItem : {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10
  }
})
export default CustomerInfoScreen;


