import React, {useState} from 'react';
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
  TextInput,
  Picker,
} from 'react-native';

import DropDownPicker from 'react-native-dropdown-picker';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const CreateGame = props => {
  const [name, setName] = useState('');
  const [gameCode, setGameCode] = useState('');
  const [pickerVal, setPickerVal] = useState('Random');
  const [selectedValue, setSelectedValue] = useState('Random');
  const [step, setStep] = useState('create');

  const createGameCode = (name, u_side) => {
    let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let answer = '';
    while (answer.length < 4) {
      let random = Math.floor(Math.random() * letters.length);
      answer += letters[random];
    }
    setGameCode(answer);
    if (checkGameCode(answer, name, u_side)) return answer;
  };
  const styles = StyleSheet.create({
    defaultPicker: {
      width: '70%',
      height: 20,
      borderWidth: 1,
      borderRadius: 5,
      backgroundColor: 'white',
      borderColor: '#000000',
    },
  });

  const options = [
    {label: 'Random', value: 'Random'},
    {label: 'I Play as X', value: 'X'},
    {label: 'I Play as O', value: 'O'},
  ];

  const createGame = async (name, u_side) => {
    let gcode = createGameCode(name, u_side);
    let id = await get_id(gcode);
    props.setGameId(id);
    //let side = selectedValue;
    //let u_name = name;
    props.setSide('player1');
    setStep('waiting');
    //console.log(gcode, side, u_name);
    //auth().currentUser.uid
  };

  const get_id = code => {
    return firestore()
      .collection('tic-games')
      .where('gameCode', '==', code.toUpperCase())
      .get()
      .then(doc => {
        return doc.docs[0].id;
      })
      .catch(err => {
        console.log({hasError: true, value: 'id-not-found'});
      });
  };

  const checkGameCode = (newGameCode, name, u_side) => {
    return firestore()
      .collection('tic-games')
      .where('gameCode', '==', newGameCode)
      .get()
      .then(results => {
        if (results.size > 0) {
          return createGameCode();
        } else {
          return saveGame(newGameCode, name, u_side);
        }
      })
      .catch(err => {
        return {hasError: true, value: err};
      });
  };

  const saveGame = (newGameCode, name, u_side) => {
    if (u_side === 'Random') {
      let num = Math.floor(Math.random() * 100);
      u_side = num % 2 == 0 ? 'X' : 'O';
    }
    let opponent = u_side == 'X' ? 'O' : 'X';
    return firestore()
      .collection('tic-games')
      .add({
        gameCode: newGameCode,
        board: [null, null, null, null, null, null, null, null, null],
        isPlaying: false,
        player1: {name: name, uid: null, side: u_side, wins: 0},
        player2: {name: null, uid: null, side: opponent, wins: 0},
        roundNumber: 1,
        sidePlaying: 'X',
      })
      .then(doc => {
        props.setGlobalGameCode(newGameCode);
        return console.log('doc added');
      })
      .catch(err => {
        return {hasError: true, error: err};
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
          {step === 'create' ? (
            <>
              <Text style={props.styles.waitingText}>{'Game Settings:'}</Text>
              <TextInput
                style={{...props.styles.homeButton, paddingLeft: 15}}
                placeholder="Enter Your Name"
                onChangeText={text => setName(text)}
              />
              <View style={{...props.styles.dropdown, paddingLeft: 10}}>
                <Picker
                  style={styles.defaultPicker}
                  selectedValue={selectedValue}
                  onValueChange={(itemValue, itemIndex) =>
                    setSelectedValue(itemValue)
                  }>
                  {options.map((x, index) => (
                    <Picker.Item label={x.label} value={x.value} key={index} />
                  ))}
                </Picker>
              </View>
              <View style={props.styles.buttonRow}>
                <TouchableOpacity
                  onPress={() => props.setScreen('home')}
                  style={props.styles.startButton}>
                  <Text style={props.styles.startText}>{'Go Back'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => createGame(name, selectedValue)}
                  style={props.styles.startButton}>
                  <Text style={props.styles.startText}>{'Start'}</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text
                style={{
                  ...props.styles.waitingText,
                  textAlign: 'center',
                  paddingRight: 20,
                  paddingLeft: 50,
                  marginBottom: 50,
                  marginTop: 20,
                }}>{`Waiting for Your Opponent...`}</Text>
              <Text
                style={{
                  ...props.styles.waitingText,
                  paddingLeft: 60,
                  marginBottom: 50,
                  fontWeight: 'bold',
                }}>{`Game Code: ${gameCode}`}</Text>
              <TouchableOpacity
                onPress={() => props.setScreen('home')}
                style={props.styles.startButton}>
                <Text style={props.styles.startText}>{'Go Back'}</Text>
              </TouchableOpacity>
            </>
          )}
        </ImageBackground>
      </SafeAreaView>
    </>
  );
};

export default CreateGame;

/*

containerStyle={{
              height: 60,
              width: 275,
              borderColor: '#000000',
              borderStyle: 'solid',
              borderWidth: 1,
              borderRadius: 15,
              shadowColor: 'rgba(0,0,0,0.25)',
            }}


            <DropDownPicker
            items={options}
            defaultValue={pickerVal}
            containerStyle={{
              height: 60,
              width: 275,
              borderColor: '#000000',
              borderStyle: 'solid',
              borderWidth: 1,
              borderRadius: 15,
              shadowColor: 'rgba(0,0,0,0.25)',
            }}
            itemStyle={{justifyContent: 'flex-start'}}
            onPress={item => setPickerVal(item.value)}
          />

          */
