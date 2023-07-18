import * as React from 'react';
import {
  SafeAreaView,
  Text,
  Animated,
  View,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import COLORS from '../../consts/colors';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { TabView, SceneMap } from 'react-native-tab-view';
import { ScrollView } from 'react-native-gesture-handler';

import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { BaseURL } from '../../consts/BaseURL';

// const FirstRoute = () => {
//   const navigation = useNavigation();
//   const [loading, setLoading] = React.useState(false);

//   // DELIVERY STATE
//   const [deliveryData, setDeliveryData] = React.useState([]);
//   // GET ALL DELIVERY BY SHIPPER
//   React.useEffect(() => {
//     let shipperID = 6;

//     setLoading(true);
//     axios.get(`${BaseURL}/api/v1/delivery/shipper?shipperId=${shipperID}`)
//       .then((res) => setDeliveryData(res.data))
//       .catch((err) => console.log(err))
//       .finally(() => setLoading(false))
//   }, [])

//   if(loading) {
//     return (
//       <Text>Loading...</Text>
//     )
//   }

//   return (
//     <View style={[styles.container, { backgroundColor: COLORS.light }]}>
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//       >
//         {
//           deliveryData.map((order, index) => {
//             if(order.status === 'Wait_Delivering') {
  
//               return (
//                 <TouchableOpacity
//                   onPress={() => navigation.navigate('DeliveryDetailScreen', order)}
//                 >
//                   <View style={{flexDirection: 'row', backgroundColor: COLORS.white, alignItems: 'center', borderBottomColor: COLORS.dark,
//                       borderBottomWidth: 0.5, marginHorizontal: 10, justifyContent: 'space-between'}}>
//                     <View style={{marginVertical: 10, height: 120, justifyContent: 'space-between', paddingLeft: 10}}>
//                       <Text style={{fontSize: 16, fontWeight: 'bold'}}>Deilvery ID: {order.id}</Text>
//                       <Text style={{fontSize: 16, fontWeight: 'bold'}}>Price: {order.totalPrice}</Text>
//                       { order.status ==='Wait_Delivering' &&
//                         <Text style={{fontSize: 16, backgroundColor: '#F9813A', width: 90, padding: 5, color: 'white'}}
//                         >Wait delivery</Text>
//                       }
//                       <View style={{flexDirection: 'row', alignItems: 'center'}}>
//                         <Icon name='location-on' size={25} />
//                         <Text style={{fontSize: 16, width: 300}}>
//                           {order.deliveryApartmentNumber}
//                           , {order.deliveryWard[0] === '{' ? JSON.parse(order.deliveryWard).ward_name : order.deliveryWard}
//                           , {order.deliveryDistrict[0] === '{' ? JSON.parse(order.deliveryDistrict).district_name : order.deliveryDistrict}
//                           , {order.deliveryProvince}
//                         </Text>
//                       </View>
//                     </View>
//                     <View>
//                       <Icon
//                         style={{marginRight: 5}}
//                         name='arrow-forward-ios'
//                         size={30}/>
//                     </View>
//                   </View>
//                 </TouchableOpacity>
//               )
//             }
//             else {
//               return (
//                 null
//               )
//             }
//           }
            
//           )
//         }
//       </ScrollView>
//     </View>
//   );
// }
const SecondRoute = () => {
  const navigation = useNavigation();

  // DELIVERY STATE
  const [deliveryData, setDeliveryData] = React.useState([]);
  // GET ALL DELIVERY BY SHIPPER
  React.useEffect(() => {
    let shipperID = 6;
    axios.get(`${BaseURL}/api/v1/delivery/shipper?shipperId=${shipperID}`)
      .then((res) => setDeliveryData(res.data))
      .catch((err) => console.log(err))
  }, [])
  return (
    <View style={[styles.container, { backgroundColor: COLORS.light }]}>
      {
        deliveryData.map((order, index) => {
          if(order.status === 'Delivering') {

            return (
                <TouchableOpacity
                  onPress={() => navigation.navigate('DeliveryDetailScreen', order)}
                >
                  <View style={{flexDirection: 'row', backgroundColor: COLORS.white, alignItems: 'center', borderBottomColor: COLORS.dark,
                      borderBottomWidth: 0.5, marginHorizontal: 10, justifyContent: 'space-between'}}>
                    <View style={{marginVertical: 10, height: 120, justifyContent: 'space-between', paddingLeft: 10}}>
                      <Text style={{fontSize: 16, fontWeight: 'bold'}}>Deilvery ID: {order.id}</Text>
                      <Text style={{fontSize: 16, fontWeight: 'bold'}}>Price: {order.totalPrice}</Text>
                      { order.status ==='Delivering' &&
                        <Text style={{fontSize: 16, backgroundColor: '#F9813A', width: 90, padding: 5, color: 'white'}}
                        >Đang giao</Text>
                      }
                      <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Icon name='location-on' size={25} />
                        <Text style={{fontSize: 16, width: 300}}>
                          {order.deliveryApartmentNumber}
                          , {order.deliveryWard[0] === '{' ? JSON.parse(order.deliveryWard).ward_name : order.deliveryWard}
                          , {order.deliveryDistrict[0] === '{' ? JSON.parse(order.deliveryDistrict).district_name : order.deliveryDistrict}
                          , {order.deliveryProvince}
                        </Text>
                      </View>
                    </View>
                    <View>
                      <Icon
                        style={{marginRight: 5}}
                        name='arrow-forward-ios'
                        size={30}/>
                    </View>
                  </View>
                </TouchableOpacity>
            )
          }
          else {
            return (
              null
            )
          }
        }
          
        )
      }
    </View>
  )
};
const ThirdRoute = () => {
  const navigation = useNavigation();

  // DELIVERY STATE
  const [deliveryData, setDeliveryData] = React.useState([]);
  // GET ALL DELIVERY BY SHIPPER
  React.useEffect(() => {
    let shipperID = 6;
    axios.get(`${BaseURL}/api/v1/delivery/shipper?shipperId=${shipperID}`)
      .then((res) => setDeliveryData(res.data))
      .catch((err) => console.log(err))
  }, [])
  return (
    <View style={[styles.container, { backgroundColor: COLORS.light }]}>
      {
        deliveryData.map((order, index) => {
          if(order.status === 'Delivered') {

            return (
                <TouchableOpacity
                  onPress={() => navigation.navigate('DeliveryDetailScreen', order)}
                >
                  <View style={{flexDirection: 'row', backgroundColor: COLORS.white, alignItems: 'center', borderBottomColor: COLORS.dark,
                      borderBottomWidth: 0.5, marginHorizontal: 10, justifyContent: 'space-between'}}>
                    <View style={{marginVertical: 10, height: 120, justifyContent: 'space-between', paddingLeft: 10}}>
                      <Text style={{fontSize: 16, fontWeight: 'bold'}}>Deilvery ID: {order.id}</Text>
                      <Text style={{fontSize: 16, fontWeight: 'bold'}}>Price: {order.totalPrice}</Text>
                      { order.status ==='Delivered' &&
                        <Text style={{fontSize: 16, backgroundColor: 'blue', width: 90, padding: 5, color: 'white'}}
                        >Đã giao</Text>
                      }
                      <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Icon name='location-on' size={25} />
                        <Text style={{fontSize: 16, width: 300}}>
                          {order.deliveryApartmentNumber}
                          , {order.deliveryWard[0] === '{' ? JSON.parse(order.deliveryWard).ward_name : order.deliveryWard}
                          , {order.deliveryDistrict[0] === '{' ? JSON.parse(order.deliveryDistrict).district_name : order.deliveryDistrict}
                          , {order.deliveryProvince}
                        </Text>
                      </View>
                    </View>
                    <View>
                      <Icon
                        style={{marginRight: 5}}
                        name='arrow-forward-ios'
                        size={30}/>
                    </View>
                  </View>
                </TouchableOpacity>
            )
          }
          else {
            return (
              null
            )
          }
        }
          
        )
      }
    </View>
  )
};
const FourRoute = () => {
  const navigation = useNavigation();

  // DELIVERY STATE
  const [deliveryData, setDeliveryData] = React.useState([]);
  // GET ALL DELIVERY BY SHIPPER
  React.useEffect(() => {
    let shipperID = 6;
    axios.get(`${BaseURL}/api/v1/delivery/shipper?shipperId=${shipperID}`)
      .then((res) => setDeliveryData(res.data))
      .catch((err) => console.log(err))
  }, [])
  return (
    <View style={[styles.container, { backgroundColor: COLORS.light }]}>
      {
        deliveryData.map((order, index) => {
          if(order.status === 'Done') {

            return (
                <TouchableOpacity
                  onPress={() => navigation.navigate('DeliveryDetailScreen', order)}
                >
                  <View style={{flexDirection: 'row', backgroundColor: COLORS.white, alignItems: 'center', borderBottomColor: COLORS.dark,
                      borderBottomWidth: 0.5, marginHorizontal: 10, justifyContent: 'space-between'}}>
                    <View style={{marginVertical: 10, height: 120, justifyContent: 'space-between', paddingLeft: 10}}>
                      <Text style={{fontSize: 16, fontWeight: 'bold'}}>Delivery ID: {order.id}</Text>
                      <Text style={{fontSize: 16, fontWeight: 'bold'}}>Price: {order.totalPrice}</Text>
                      { order.status ==='Done' &&
                        <Text style={{fontSize: 16, backgroundColor: 'green', width: 90, padding: 5, color: 'white'}}
                        >Hoàn tất</Text>
                      }
                      <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Icon name='location-on' size={25} />
                        <Text style={{fontSize: 16, width: 300}}>
                          {order.deliveryApartmentNumber}
                          , {order.deliveryWard[0] === '{' ? JSON.parse(order.deliveryWard).ward_name : order.deliveryWard}
                          , {order.deliveryDistrict[0] === '{' ? JSON.parse(order.deliveryDistrict).district_name : order.deliveryDistrict}
                          , {order.deliveryProvince}
                        </Text>
                      </View>
                    </View>
                    <View>
                      <Icon
                        style={{marginRight: 5}}
                        name='arrow-forward-ios'
                        size={30}/>
                    </View>
                  </View>
                </TouchableOpacity>
            )
          }
          else {
            return (
              null
            )
          }
        }
          
        )
      }
    </View>
  )
}
// const FiveRoute = () => {
//   const navigation = useNavigation();

//   // DELIVERY STATE
//   const [deliveryData, setDeliveryData] = React.useState([]);
//   // GET ALL DELIVERY BY SHIPPER
//   React.useEffect(() => {
//     let shipperID = 6;
//     axios.get(`${BaseURL}/api/v1/delivery/shipper?shipperId=${shipperID}`)
//       .then((res) => setDeliveryData(res.data))
//       .catch((err) => console.log(err))
//   }, [])
//   return (
//     <View style={[styles.container, { backgroundColor: COLORS.light }]}>
//       {
//         deliveryData.map((order, index) => {
//           if(order.status === 'Cancel') {

//             return (
//                 <TouchableOpacity
//                   onPress={() => navigation.navigate('DeliveryDetailScreen', order)}
//                 >
//                   <View style={{flexDirection: 'row', backgroundColor: COLORS.white, alignItems: 'center', borderBottomColor: COLORS.dark,
//                       borderBottomWidth: 0.5, marginHorizontal: 10, justifyContent: 'space-between'}}>
//                     <View style={{marginVertical: 10, height: 120, justifyContent: 'space-between', paddingLeft: 10}}>
//                       <Text style={{fontSize: 16, fontWeight: 'bold'}}>Deilvery ID: {order.id}</Text>
//                       <Text style={{fontSize: 16, fontWeight: 'bold'}}>Price: {order.totalPrice}</Text>
//                       { order.status ==='Cancel' &&
//                         <Text style={{fontSize: 16, backgroundColor: 'red', width: 90, padding: 5, color: 'white'}}
//                         >Cancel</Text>
//                       }
//                       <View style={{flexDirection: 'row', alignItems: 'center'}}>
//                         <Icon name='location-on' size={25} />
//                         <Text style={{fontSize: 16, width: 300}}>
//                           {order.deliveryApartmentNumber}
//                           , {order.deliveryWard[0] === '{' ? JSON.parse(order.deliveryWard).ward_name : order.deliveryWard}
//                           , {order.deliveryDistrict[0] === '{' ? JSON.parse(order.deliveryDistrict).district_name : order.deliveryDistrict}
//                           , {order.deliveryProvince}
//                         </Text>
//                       </View>
//                     </View>
//                     <View>
//                       <Icon
//                         style={{marginRight: 5}}
//                         name='arrow-forward-ios'
//                         size={30}/>
//                     </View>
//                   </View>
//                 </TouchableOpacity>
//             )
//           }
//           else {
//             return (
//               null
//             )
//           }
//         }
          
//         )
//       }
//     </View>
//   )
// }

export default class TestScreen  extends React.Component {
  
  state = {
    index: 0,
    routes: [
      // { key: 'first', title: 'Wait delivery' },
      { key: 'second', title: 'Delivering' },
      { key: 'third', title: 'Delivered' },
      { key: 'four', title: 'Done' },
      // { key: 'five', title: 'Cancel' },
    ],
  };

  _handleIndexChange = (index) => this.setState({ index });

  _renderTabBar = (props) => {
    const inputRange = props.navigationState.routes.map((x, i) => i);

    return (
      <SafeAreaView>
        <View style={styles.header}>
            <Icon name='arrow-back-ios' size={28} onPress={() => { this.props.navigation.goBack() }} />
            <Text style={{fontWeight: 'bold'}}>My delivery</Text>
        </View>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >

        <View style={styles.tabBar}>
          {props.navigationState.routes.map((route, i) => {
            const opacity = props.position.interpolate({
              inputRange,
              outputRange: inputRange.map((inputIndex) =>
                inputIndex === i ? 1 : 0.5
              ),
            });

            return (
              
                <TouchableOpacity
                  style={styles.tabItem}
                  onPress={() => this.setState({ index: i })}>
                  <Animated.Text style={{ opacity }}>{route.title}</Animated.Text>
                </TouchableOpacity>

              
            );
          })}
      </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

  _renderScene = SceneMap({
    // first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
    four: FourRoute,
    // five: FiveRoute,
  });

  render() {
    return (
      <TabView
        navigationState={this.state}
        renderScene={this._renderScene}
        renderTabBar={this._renderTabBar}
        onIndexChange={this._handleIndexChange}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    // paddingTop: StatusBar.currentHeight,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    padding: 25,
  },
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
});

