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

const GameScreen = props => {
  const [gameBoard, setgameBoard] = useState([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  const [turn, setTurn] = useState('X');
  const [resultText, setResultText] = useState('Start Game');
  const [round, setRound] = useState(1);
  const [playerData, setPlayerData] = useState(null);
  const [opponentData, setOpponentData] = useState(null);
  const [players, setPlayers] = useState([]);
  const [gameData, setGameData] = useState();

  const play = (index, turn, board) => {
    let newBoard = board;
    newBoard[index] = turn;
    return firestore()
      .collection('tic-games')
      .doc(props.gameId)
      .update({
        board: newBoard,
        sidePlaying: turn === 'X' ? 'O' : 'X',
      })
      .catch(err => {
        console.log({hasError: true, value: 'doc-not-found'});
      });
  };

  const resetGame = () => {
    return firestore()
      .collection('tic-games')
      .doc(props.gameId)
      .update({
        board: [null, null, null, null, null, null, null, null, null],
        sidePlaying: 'X',
        roundNumber: round + 1,
      });
  };

  const updateData = doc => {
    setgameBoard(doc.data().board);
    setPlayers([doc.data().player1, doc.data().player2]);
    setPlayerData(
      props.side === 'player1' ? doc.data().player1 : doc.data().player2,
    );
    setOpponentData(
      props.side === 'player1' ? doc.data().player2 : doc.data().player1,
    );
    setTurn(doc.data().sidePlaying);
    setRound(doc.data().roundNumber);
  };

  useEffect(() => {
    let sub = firestore()
      .collection('tic-games')
      .doc(props.gameId)
      .onSnapshot(doc => {
        updateData(doc);
      });

    if (playerData) {
      if (playerData['wins'] === 9) {
        sub();
        props.setScreen('winner');
      }
      if (opponentData['wins'] === 9) {
        sub();
        props.setScreen('loser');
      }
    }

    const checkWinner = arr => {
      let combos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];
      let newArr = [
        ...new Set(
          combos
            .map(subArr => [...new Set(subArr.map(y => arr[y]))])
            .filter(x => x.length === 1),
        ),
      ][0];
      newArr = newArr ? newArr.filter(x => x !== null) : [];
      return newArr.length > 0 ? newArr[0][0] : 'Draw';
    };

    const addWin = (players, num) => {
      let winner = players[num];
      winner['wins'] += 1;
      let update =
        num === 0
          ? {player1: winner, roundNumber: round + 1}
          : {player2: winner, roundNumber: round + 1};
      return firestore()
        .collection('tic-games')
        .doc(props.gameId)
        .update(update)
        .catch('couldnt add win');
    };

    const getGameBoard = () => {
      return firestore()
        .collection('tic-games')
        .doc(props.gameId)
        .get()
        .then(doc => doc.data().board);
    };

    return async () => {
      let [player1, player2] = players;
      let check = await getGameBoard();
      check = checkWinner(check);
      console.log(check);
      if (check === 'Draw') {
        setResultText(`Game is Drawn`);
      } else if (check === 'X' || check === 'O') {
        setResultText(`The winner is ${check}`);
        let winner = player1['side'] === check ? 0 : 1;
        addWin(players, winner);
      }
    };
  }, [turn]);

  return (
    <>
      <SafeAreaView style={props.styles.container}>
        <ImageBackground
          source={require('../../images/test.png')}
          style={props.styles.backgrounImg}>
          <Text style={props.styles.gameTitle}>
            {opponentData
              ? `${opponentData['name']}(${opponentData['side']}) v. ${playerData['name']}(${playerData['side']})`
              : null}
          </Text>
          <Text style={props.styles.gameTitle}>
            {`Round ${round}: ` + resultText}
          </Text>
          <Text>
            {opponentData
              ? `${opponentData['name']} : ${opponentData['wins']}`
              : null}
          </Text>
          <View style={{marginTop: 20}}>
            <BoardGroup
              group={gameBoard.slice(0, 3)}
              styles={props.styles}
              row={1}
              play={play}
              turn={turn}
              gameBoard={gameBoard}
            />
            <BoardGroup
              group={gameBoard.slice(3, 6)}
              styles={props.styles}
              row={2}
              play={play}
              turn={turn}
              gameBoard={gameBoard}
            />
            <BoardGroup
              group={gameBoard.slice(6, 9)}
              styles={props.styles}
              row={3}
              play={play}
              turn={turn}
              gameBoard={gameBoard}
            />
            <Text>
              {playerData
                ? `${playerData['name']} : ${playerData['wins']}`
                : null}
            </Text>
            <View style={props.styles.gameButtonRow}>
              <TouchableOpacity
                onPress={() => props.setScreen('home')}
                style={props.styles.startButton}>
                <Text style={props.styles.startText}>{'Go Back'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => resetGame()}
                style={props.styles.startButton}>
                <Text style={props.styles.startText}>{'Reset'}</Text>
              </TouchableOpacity>
            </View>
            <Text>{`Game Code: ${props.globalGameCode}`}</Text>
          </View>
        </ImageBackground>
      </SafeAreaView>
    </>
  );
};

export default GameScreen;
