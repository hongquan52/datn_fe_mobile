import Icon from 'react-native-vector-icons/MaterialIcons'
import { Swipeable } from 'react-native-gesture-handler'
import COLORS from '../../../consts/colors';
import { Animated, SafeAreaView } from 'react-native'
import axios from "axios";
import * as React from "react";
import {
  Alert,
  Text,
  View,
  StyleSheet,
  FlatList,
  LayoutAnimation,
  UIManager,
  Platform,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { BaseURL } from '../../../consts/BaseURL';
import { useNavigation } from '@react-navigation/native';
import { PrimaryButton } from '../../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

export default function CheckoutScreen() {
  const [userIDDD, setUserIDDD] = useState(0);
  const navigation = useNavigation();

  const [loading, setLoading] =React.useState(false);
  const [data, setData] = React.useState([]);
  const removeItem = (id) => {
    let arr = data.filter(function (item) {
      return item.address.id !== id
    })
    setData(arr);
    axios.delete(`${BaseURL}/api/v1/address/user?userId=${userIDDD}&addressId=${id}`)
      .then((res) => {
        console.log(res.data.message)
      })
      .catch((err) => {
        console.log('Errors: ', err);
      })
    LayoutAnimation.configureNext(layoutAnimConfig)
  };
  React.useEffect(async () => {
    const userID = await AsyncStorage.getItem("userId");

    const userID2 = parseInt(userID)
    
    setUserIDDD(userID2);

    setLoading(true);

    axios.get(`${BaseURL}/api/v1/address/user?userId=${userID2}`)
      .then((res) => setData(res.data))
      .catch((error) => console.log("Error: ", error))
      .finally(() => setLoading(false))
  }, [])

  if(loading) {
    return (
      <SafeAreaView style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{marginTop: width/1.5}}>Loading......</Text>
      </SafeAreaView>
    )}
  return (
    <SafeAreaView>
      <View style={styles.header}>
        <Icon name='arrow-back-ios' size={28} onPress={navigation.goBack} />
        <Text style={{ fontWeight: 'bold' }}>My address</Text>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatList}

        data={data}
        keyExtractor={(item) => item.address.id.toString()}
        renderItem={({ item }) => {
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
                      <TouchableOpacity onPress={() => removeItem(item.address.id)}>
                        <Icon name='delete' size={40} color={COLORS.white} />
                        <Text style={{ fontWeight: 'bold', color: COLORS.white }}>Delete</Text>
                      </TouchableOpacity>
                    </Animated.Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          };
          return (
            <Swipeable renderLeftActions={leftSwipe}>
              
              <View style={styles.addressCard}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <TouchableOpacity onPress={() => navigation.navigate("EditAddressScreen", item)}>
                    <Text style={styles.addressText}>{item.address.apartmentNumber}</Text>
                    <View style={styles.addressDetail}>
                      <Text style={styles.addressText}>{JSON.parse(item.address.ward).ward_name},</Text>
                      <Text style={styles.addressText}>{JSON.parse(item.address.district).district_name},</Text>
                      <Text style={styles.addressText}>{item.address.province}</Text>
                    </View>
                    {
                      item.defaultAddress ?
                      <View style={styles.defaultAddress}>
                        <Text style={{ color: COLORS.white, fontWeight: 'bold' }}>Default address</Text>
                      </View>
                      :
                      null
                    }
                  </TouchableOpacity>
                  <Icon name='arrow-forward-ios' size={25} />
                </View>
              </View>
            </Swipeable>
          );
        }}
      />
      <View style={{ marginHorizontal: 10 }}>
        <PrimaryButton
          onPress={() => navigation.navigate('NewAddressScreen')}
          // onPress={() => console.log("Address data: ", address)}
          title={"ADD NEW ADDRESS"}
        />
      </View>
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
    height: 70,
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
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  addressCard: {
    marginBottom: 10,
    borderBottomColor: COLORS.dark,
    borderBottomWidth: 0.4,
    marginHorizontal: 10,
  },
  addressText: {
    fontSize: 15,
    marginVertical: 5,
    marginHorizontal: 3,
  },
  addressDetail: {
    height: 30,
    flexDirection: 'row',
  },
  defaultAddress: {
    backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center',
    width: 120,
    padding: 5,
    marginBottom: 5,
    borderRadius: 10,

  },
});
