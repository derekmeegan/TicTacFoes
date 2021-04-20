import React from 'react';
import {TouchableOpacity, View} from 'react-native';

const BoardGroup = props => {
  var indexAdd = 0;
  if (props.row === 2) indexAdd = 3;
  if (props.row === 3) indexAdd = 6;
  return (
    <View style={props.styles.group}>
      {props.group.map((item, index) => (
        <TouchableOpacity
          key={index + indexAdd}
          style={props.styles.groupItem}
          onPress={() =>
            props.play(index + indexAdd, props.turn, props.gameBoard)
          }>
          <Text style={props.styles.itemText}>{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default BoardGroup;
