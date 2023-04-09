import { View, Text,StyleSheet ,StatusBar} from 'react-native';
import React from 'react';
import MusicPlayer from './screens/MusicPlayer';

const App = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <MusicPlayer />
    </View>
  )
}

const styles=StyleSheet.create({
  container:{
    flex:1,
  },
});

export default App;