import React, {useState} from 'react';
import {
  SafeAreaView,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const JoinGame = props => {
  const [name, setName] = useState('');
  const [gameCode, setGameCode] = useState('');

  const checkGameCode = code => {
    return firestore()
      .collection('tic-games')
      .where('gameCode', '==', code.toUpperCase())
      .get()
      .then(doc => {
        let document = doc.docs[0];
        let p_2 = document.data().player2;
        let id = document.id;
        props.setGameId(id);
        props.setGlobalGameCode(document.data().gameCode);
        props.setSide('player2');
        return [id, p_2];
      })
      .catch(err => {
        console.log({hasError: true, value: 'doc-not-found'});
      });
  };

  const startGame = (code, u_name) => {
    checkGameCode(code)
      .then(items => {
        let newP2 = items[1];
        newP2['name'] = u_name;
        return firestore()
          .collection('tic-games')
          .doc(items[0])
          .update({
            isPlaying: true,
            player2: newP2,
          })
          .then(() => props.setScreen('game'));
      })
      .catch(err => {
        console.log('game code does not exist');
      });
  };

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
          <Text style={props.styles.waitingText}>{'Game Settings:'}</Text>
          <TextInput
            style={{...props.styles.homeButton, paddingLeft: 15}}
            placeholder="Enter Your Name"
            onChangeText={text => setName(text)}
          />
          <TextInput
            style={{...props.styles.homeButton, paddingLeft: 15}}
            placeholder="Enter Your Game Code"
            onChangeText={text => setGameCode(text)}
          />
          <View style={props.styles.buttonRow}>
            <TouchableOpacity
              onPress={() => props.setScreen('home')}
              style={props.styles.startButton}>
              <Text style={props.styles.startText}>{'Go Back'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => startGame(gameCode, name)}
              style={{
                ...props.styles.startButton,
              }}>
              <Text style={props.styles.startText}>{'Join'}</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </SafeAreaView>
    </>
  );
};

export default JoinGame;
