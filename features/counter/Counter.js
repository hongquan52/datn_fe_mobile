import React, {useState, useEffect} from 'react'
import { View, Button, Text, SafeAreaView, StyleSheet, Image, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons';
import COLORS from '../../consts/colors';
import { FlatList, ScrollView } from 'react-native-gesture-handler';

import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, onChildAdded, set, off } from "firebase/database";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Counter = ({ navigation }) => {

  const [messageList, setMessageList] = useState([]);
  const [content, setContent] = useState('');
  const [sendMessageState, setSendMessageState] = useState(false);
  const [userIDDD, setUserIDDD] = useState(0);


  const firebaseConfig = {
    apiKey: "AIzaSyDkIqYefTbKOJ5r5gexI84Fzy4Tf1oQTrE",
    authDomain: "chatapp-839b6.firebaseapp.com",
    databaseURL: "https://chatapp-839b6-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "chatapp-839b6",
    storageBucket: "chatapp-839b6.appspot.com",
    messagingSenderId: "920125762908",
    appId: "1:920125762908:web:effab25f06bc17cecf6599",
    measurementId: "G-C4S6HDSKDE"
  };
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const database = getDatabase(app);
  useEffect(() => {
    const userId = AsyncStorage.getItem('userId');
    // const userId2 = parseInt(userId);
    setUserIDDD(userId._j);
    
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const fetchChat = ref(database, "chatmessage/");

    // GET LIST MESSAGE
    let y = []
    onChildAdded(fetchChat, (snapshot) => {
      const messages = snapshot.val();

      y.push({
        userIdFrom: messages.userIdFrom,
        userIdTo: messages.userIdTo,
        content: messages.content
      })

      let z = y.filter(
        (item) => (item.userIdFrom === 3 && item.userIdTo === 2)
          || (item.userIdFrom === 2 && item.userIdTo === 3)
      )
      setMessageList(z);

    })
    off(fetchChat, (snapshot) => {
      const messages = snapshot.val();
      const message = `<li class=${messages.userIdFrom === 1 ? "sent" : "receive"
        }><span>${messages.userIdTo}: </span>${messages.content}</li>`;
      // append the message on the page
      document.getElementById("messages").innerHTML += message;
      console.log("=======================: ", messages.userIdFrom, messages.content);

    })

  }, [sendMessageState])
  useEffect( async () => {
    
    setSendMessageState(!sendMessageState);
  }, [])
  // SEND MESSAGE FUNCTION
  function sendMessage(userIdFrom, userIdTo, content) {
    const timestamp = Date.now();

    set(ref(database, 'chatmessage/' + timestamp), {
        userIdFrom: userIdFrom,
        userIdTo: userIdTo,
        content: content,

    });

    setSendMessageState(!sendMessageState);
    setContent('');
  }
  return (
    <SafeAreaView >
      <View style={styles.header}>
        <Image
          source={require('../../assets/avatar.png')}
          style={styles.headerAvatar}
        />
        <Text style={{ fontWeight: 'bold', fontSize: 30, color: COLORS.white }}>ADMIN</Text>
      </View>
      <ScrollView
        contentContainerStyle={{ marginBottom: 30, height: 480, paddingHorizontal: 10}}
        showsVerticalScrollIndicator
      >
        <View style={{}}>
          {
            messageList.map((item) => (
              <View style={{ flexDirection: item.userIdFrom === 2 ? 'row-reverse' : 'row', marginVertical: 10, alignItems: 'center' }}>
                {
                  item.userIdFrom !== 2 &&
                  <Image
                    style={{height: 40, width: 40, borderRadius: 20, marginRight: 5}}
                    source={require('../../assets/avatar.png')}
                  />
                }
                <Text
                  style={{backgroundColor: item.userIdFrom === 2 ? COLORS.primary : COLORS.light, paddingVertical: 20, paddingHorizontal: 10, fontSize: 16, borderRadius: 10}}
                >{item.content}</Text>
              </View>
            ))
          }
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TextInput
          value={content}
          placeholder='Type message'
          style={{ backgroundColor: COLORS.light, padding: 10, width: 300, height: 50, borderRadius: 10 }}
          onChangeText={(e) => setContent(e)}
        />
        <View style={{backgroundColor: COLORS.primary, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10}}>
          <Button title='Send' color={COLORS.white} onPress={() => {
            // sendMessage(2,3, content);
            // alert(`${userIDDD}, typeof: ${typeof(userIDDD)}`);
            console.log(userIDDD)
          }}
            
          />
        </View>
      </View>
    </SafeAreaView>
  )
}
export default Counter

const styles = StyleSheet.create({
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 20, paddingLeft: 10,
  },
  headerAvatar: {
    height: 60,
    width: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  }
})