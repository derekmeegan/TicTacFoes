import React from 'react';
import {
  SafeAreaView,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  View,
} from 'react-native';

const Home = props => {
  return (
    <>
      <SafeAreaView style={props.styles.container}>
        <ImageBackground
          source={require('../../images/test.png')}
          style={props.styles.backgrounImg}>
          <View>
            <Text style={props.styles.tictactitle}>TicTac</Text>
            <Text style={props.styles.foestitle}>Foes</Text>
          </View>
          <Image
            source={require('../../images/solving-bro.png')}
            style={props.styles.homeImg}
          />
          <View>
            <TouchableOpacity
              onPress={() => props.setScreen('create-game')}
              style={props.styles.homeButton}>
              <Text style={props.styles.homtButtonText}>{'Create a Game'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                props.setScreen('join-game');
              }}
              style={props.styles.homeButton}>
              <Text style={props.styles.homtButtonText}>{'Join a Game'}</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </SafeAreaView>
    </>
  );
};

export default Home;
