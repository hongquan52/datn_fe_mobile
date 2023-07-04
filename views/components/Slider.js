import React, { useState, useCallback } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image, Dimensions
} from "react-native";
import COLORS from "../../consts/colors";
import { ScrollView } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("screen");
const Slider = ( {images}) => {

  const [imageActive, setImageActive] = useState(0);
  onchange = (nativeEvent) => {
    if(nativeEvent) {
      const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
      if(slide != imageActive) {
        setImageActive(slide);
      }
    }
  }

  return (
    <SafeAreaView>
      <View style={{marginHorizontal:0}}>
        <View style={styles.wrap}> 
          <ScrollView
            onScroll={({nativeEvent}) => onchange(nativeEvent)}
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            horizontal
            style={styles.wrap}
          >
            {
              images.map((e, index) => (
                <Image
                  key={index}
                  resizeMethod="scale"
                  style={styles.wrap}
                  source={{uri: e}}
                />
              ))
            }
          </ScrollView>
          <View style={styles.wrapDot}>
            {
              images.map((e, index) => (
                <View
                  key={e}
                  style={index === imageActive ? styles.dotActive : styles.dot}
                >

                </View>
              ))
            }
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  wrap: {
    width: width,
    height: height*0.15,
    borderRadius: 10,
  }
  ,
  wrapDot: {
    position: "absolute",
    bottom: 3,
    flexDirection: "row",
    alignSelf: "center",
  },
  dotActive: {
    margin: 3,
    backgroundColor: COLORS.primary,
    width: 30,
    height: 10,
  },
  dot: {
    margin: 3,
    backgroundColor: COLORS.white,
    width: 10,
    height: 10
  }
})
export default Slider