/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import type {Node} from 'react';
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

import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import styles from './components/stylesheet/index.js';
import Home from './components/home/index.js';
import CreateGame from './components/create-game/index.js';
import JoinGame from './components/join-game/index.js';
import GameScreen from './components/game/index.js';
import Loser from './components/loser/index.js';
import Winner from './components/winner/index.js';

const App: () => Node = () => {
  const [screen, setScreen] = useState('home');
  const [userAuth, setUserAuth] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [gameId, setGameId] = useState(null);
  const [side, setSide] = useState('');
  const [globalGameCode, setGlobalGameCode] = useState('');

  var subscriber = null;

  const onAuthStateChanged = user => {
    setUserAuth(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    if (gameId) {
      let sub = firestore()
        .collection('tic-games')
        .doc(gameId)
        .onSnapshot(doc => {
          if (doc.data().isPlaying) setScreen('game');
        });
      if (screen === 'game') sub();
    } else {
      const authSubscriber = auth().onAuthStateChanged(onAuthStateChanged);

      auth()
        .signInAnonymously()
        .then(() => {
          console.log('User signed in anonymously');
        })
        .catch(err => {
          let friendlyError = {
            friendly: "We couldn't authenticate you with the game service.",
            technical: err.toString(),
          };
          setError(() => {
            throw friendlyError;
          });
        });

      return () => {
        if (subscriber !== null) {
          subscriber();
          authSubscriber();
        }
      };
    }
  }, [gameId]);

  if (initializing) return null;

  return (
    <>
      <StatusBar barStyle="dark-content" />
      {screen === 'home' ? (
        <Home styles={styles} setScreen={setScreen} />
      ) : null}
      {screen === 'create-game' ? (
        <CreateGame
          styles={styles}
          setScreen={setScreen}
          setGameId={setGameId}
          setSide={setSide}
          setGlobalGameCode={setGlobalGameCode}
        />
      ) : null}
      {screen === 'join-game' ? (
        <JoinGame
          styles={styles}
          setScreen={setScreen}
          setGameId={setGameId}
          setSide={setSide}
          setGlobalGameCode={setGlobalGameCode}
        />
      ) : null}
      {screen === 'game' ? (
        <GameScreen
          styles={styles}
          setScreen={setScreen}
          gameId={gameId}
          side={side}
          globalGameCode={globalGameCode}
        />
      ) : null}
      {screen === 'winner' ? (
        <Winner styles={styles} setScreen={setScreen} />
      ) : null}
      {screen === 'loser' ? (
        <Loser styles={styles} setScreen={setScreen} />
      ) : null}
    </>
  );
};

export default App;
