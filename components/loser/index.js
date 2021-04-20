import React from 'react';
import {
  SafeAreaView,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  View,
} from 'react-native';

const Loser = props => {
  return (
    <>
      <SafeAreaView style={props.styles.container}>
        <ImageBackground
          source={require('../../images/test.png')}
          style={props.styles.backgrounImg}>
          <Image
            source={require('../../images/Lost-bro.png')}
            style={{...props.styles.waitingImg, marginTop: 70}}
          />
          <Text style={props.styles.winningText}>{'You lost :('}</Text>

          <View style={props.styles.gameButtonRow}>
            <TouchableOpacity
              onPress={() => props.setScreen('home')}
              style={props.styles.startButton}>
              <Text style={props.styles.startText}>{'Exit'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => props.setScreen('create-game')}
              style={props.styles.startButton}>
              <Text style={props.styles.startText}>{'Play Again'}</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </SafeAreaView>
    </>
  );
};

export default Loser;
