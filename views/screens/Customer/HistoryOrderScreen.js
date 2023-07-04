import * as React from 'react';
import { View, useWindowDimensions, StyleSheet, Text, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icons from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../../../consts/colors';
import { FlatList } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import axios from 'axios';
import { BaseURL } from '../../../consts/BaseURL';
import AsyncStorage from '@react-native-async-storage/async-storage';

const tabs = [
  {
    status: 'All'
  },
  {
    status: 'Ordered'
  },
  {
    status: 'Confirmed'
  },
  {
    status: 'Wait_Delivering'
  },
  {
    status: 'Delivering'
  },
  {
    status: 'Delivered'
  },
  {
    status: 'Received'
  },
  {
    status: 'Done'
  },
  {
    status: 'Cancel'
  },
]

const HistoryOrderScreen = ({navigation}) => {
  const [status, setStatus] = React.useState('All');
  const [data, setData] = React.useState([])
  const [dataOriginal, setDataOriginal] = React.useState([])

  const setStatusFilter = status => {
    if(status !== 'All') {
      setData([...dataOriginal.filter(e => e.status===status)])
    }
    else {
      setData(dataOriginal);
    }
    setStatus(status);
  }

  useEffect( async () => {
    const userID = await AsyncStorage.getItem("userId");
    const userID2 = parseInt(userID)
    console.log("const userID: ", typeof(userID), userID)
    console.log("const userID2: ", typeof(userID2), userID2);

    // CALL API GET ORDER BY USER ID
    axios.get(`${BaseURL}/api/v1/order?userId=${userID2}`)
      .then( async (res) => {
        setData(res.data);
        setDataOriginal(res.data);
      })
      .catch((err) => console.log(err));
  }, [])

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate("HistoryOrderDetailScreen", item)
      }>
        <View  key={index} style={styles.itemContainer}>
          <View style={{ }}>
            <Text style={{marginRight: 100, marginVertical: 3,fontWeight: 'bold'}}>{item.finalPrice} VND</Text>
            {
              item.paymentMethod ==='VNPAY' && 
              
                <Image source={require('../../../assets/vnpay.png')} style={{height: 50, width: 50,borderRadius: 20}} />
              
            }
            {
              item.paymentMethod ==='COD' && 
              
                <Image source={require('../../../assets/COD.png')} style={{height: 50, width: 50,borderRadius: 20}} />
              
            }
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{width: 150, alignItems: 'center'}}>
                  {
                    item.status === 'Delivering' && <Icon name='truck-fast-outline' size={40} style={{marginBottom: 10}} />
                    
                  }
                  {
                    item.status === 'Ordered' && <Icon name='cart-check' size={40} style={{marginBottom: 10}} />
                  }
                  {
                    item.status === 'Canceled' && <Icon name='briefcase-remove' size={40} style={{marginBottom: 10}} />
                  }
                  { 
                    item.status === 'Confirmed' && <Icon name='archive-check' size={40} style={{marginBottom: 10}} />
                  }
                  {
                    item.status === 'Done' && <Icon name='check-bold' size={40} style={{marginBottom: 10}} />
                  }
                  {
                    item.status === 'Wait__Delivery' && <Icon name='bus-alert' size={40} style={{marginBottom: 10}} />
                  }
                  <Text style={{fontWeight: 'bold'}}>{item.status}</Text>
            </View>
            <Icons name='arrow-forward-ios' size={25} style={{}} />
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
            <Icons name='arrow-back-ios' size={28} onPress={navigation.goBack} />
            <Text style={{fontWeight: 'bold', fontSize: 20}}>My order</Text>
        </View>
        <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.scrollContainer}
        
      >
      
        {tabs.map(e => (
          <TouchableOpacity 
            style={[styles.btnTab, status===e.status && styles.btnTabActive]}
            onPress={() => setStatusFilter(e.status)}
          >
            <Text>{e.status}</Text>
          </TouchableOpacity>
        ))}
      
      </ScrollView>

      <FlatList 
        data={data}
        keyExtractor={(e,i) => i.toString()}
        renderItem={renderItem}
      />
    </SafeAreaView>
  )
}

export default HistoryOrderScreen;

const styles = StyleSheet.create({
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  
  listTab: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: COLORS.grey,
    height: 100,
  },
  btnTab: {
    flexDirection: 'row',
    // width: Dimensions.get('window').width / 4,
    width: 125,
    borderWidth: 0.5,
    borderColor: COLORS.white,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  btnTabActive: {
    backgroundColor: COLORS.primary
  },
  itemContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: COLORS.primary,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 20,
  },
  scrollContainer: {

  }
})