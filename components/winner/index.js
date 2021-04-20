import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  View,
} from 'react-native';
import BoardGroup from '../boardGroup/index.js';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Winner = props => {
  return (
    <>
      <SafeAreaView style={props.styles.container}>
        <ImageBackground
          source={require('../../images/test.png')}
          style={props.styles.backgrounImg}>
          <Image
            source={require('../../images/solving-rafiki.png')}
            style={props.styles.waitingImg}
          />
          <Text style={props.styles.waitingText}>{'You won'}</Text>
        </ImageBackground>
      </SafeAreaView>
    </>
  );
};

export default Winner;
