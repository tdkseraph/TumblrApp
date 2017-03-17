/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  StatusBar
} from 'react-native';
import Post from './Apps/posts.js'

export default class TumblrLab extends Component {
  render() {
    return (
      <View>
        <Post/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:10,
    margin:9,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

AppRegistry.registerComponent('TumblrLab', () => TumblrLab);
