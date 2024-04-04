import React,{useEffect,useState,useRef} from 'react';
import { View, 
  Text, 
  Image,
  StyleSheet, 
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  FlatList, 
  Animated,
} from 'react-native';
import TrackPlayer, {
  Capability, 
  Event, 
  RepeatMode, 
  State, 
  usePlaybackState, 
  useProgress, 
  useTrackPlayerEvents,
} from 'react-native-track-player';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Slider from '@react-native-community/slider';
import songs from '../model/Data';

const {width,height}=Dimensions.get('window');


const togglePayBack = async playBackState => {
  const currentTrack = await TrackPlayer.getCurrentTrack();
  if(currentTrack != null) {
    if(playBackState == State.Playing) {
      await TrackPlayer.pause();
    }else {
      await TrackPlayer.play();
    }
  }

};
const MusicPlayer = () => {

  const playBackState = usePlaybackState();

  const progress = useProgress();

  /* custom states */
  const [songIndex,setSongIndex]=useState(0);

  const [repeatMode, setRepeatMode] = useState('off')

  const [trackTitle, setTrackTitle] = useState();

  const [trackArtist, setTrackArtist] = useState();
  const [trackArtWork, settrackArtWork] = useState();

  /* custom references */
  const scrollX=useRef(new Animated.Value(0)).current;
  const songSlider = useRef(null);

  /* changing the track on complete */
  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if(event.type === Event.PlaybackTrackChanged && event.nextTrack !== null){
      const track = await TrackPlayer.getTrack(event.nextTrack);
      const {title, artwork, artist} =track;
      setTrackTitle(title);
      setTrackArtist(artist);
      settrackArtWork(artwork);

    }
  });

  const repeatIcon = () => {

    if(repeatMode == 'off'){
      return 'repeat-off';

    }
    if(repeatMode == 'track'){
      return 'repeat-once';

    }
    if(repeatMode == 'repeat'){
      return 'repeat';

    }

  };

  const changeRepeatMode = () => {
    if(repeatMode == 'off'){
      TrackPlayer.setRepeatMode(RepeatMode.Track);
       setRepeatMode('track');
    }
    if(repeatMode == 'track'){
      TrackPlayer.setRepeatMode(RepeatMode.Queue);
      setRepeatMode('repeat');

    }
    if(repeatMode == 'repeat'){
      TrackPlayer.setRepeatMode(RepeatMode.Off);
      setRepeatMode('off');

    }
  };

  const skipTo = async trackId => {
    await TrackPlayer.skip(trackId);
  };

useEffect(()=>{
const setupPlayer = async () => {
  try {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.Stop,
      ],
    });
    await TrackPlayer.add(songs);

  }catch(e){
    console.log(e);
  }
};

const initializePlayer = async () => {
  await setupPlayer();

scrollX.addListener(({value})=>{
const index = Math.round(value/width);
skipTo(index);
setSongIndex(index)  
})
};
initializePlayer();

return () => {
  //scrollX.removeAllListeners();
  TrackPlayer.destroy();
};
},[]);

const skipToNext = () => {
  songSlider.current.scrollToOffset({
    offset : (songIndex + 1) * width,
  });

};

const skipToPrevious = () => {
  songSlider.current.scrollToOffset({
    offset : (songIndex - 1) * width,
  })

};

const renderSongs=({item,index})=>{
  return (
    <Animated.View style={styles.mainImageWrapper}>
      <View style={[styles.imageWrapper,styles.elevation]}>
        <Image source={trackArtWork}
        style={styles.musicImage} 
        />
     </View>
    </Animated.View>
  );
};
  return (
    <SafeAreaView style={styles.container}>

      {/* music player section */}
      <View style={styles.maincontainer}> 
       {/* Image */}
        <Animated.FlatList
          ref={songSlider}
          renderItem={renderSongs}
          data={songs}
          keyExtractor={item=>item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [
              {
                nativeEvent:{
                  contentOffset:{x:scrollX},
                },
              },
            ],
            {useNativeDriver:true},
          )}
        />


        {/* Title & Artist Name */}
        <View>
          <Text style={[styles.songContent,styles.songTitle]}>{trackTitle}</Text>
          <Text style={[styles.songContent,styles.songArtist]}>{trackArtist}</Text>
        </View>
       
        {/* songslider */}
        <View>
          <Slider 
            style={styles.progressBar}
            value={progress.position}
            minimumValue={0}
            maximumValue={progress.duration}
            thumbTintColor='#FFd369'
            minimumTrackTintColor='#FFD369'
            maximumTrackTintColor='#fff'
            onSlidingComplete={async value => {
              await TrackPlayer.seekTo(value);
            }} 
          />

          {/* Progress Durations */}
          <View style={styles.progressLevelDuration}>
            <Text style ={styles.progressLabelText}>
              {new Date(progress.position * 1000).toLocaleTimeString().substring(15,4)}
            </Text>
            <Text style ={styles.progressLabelText}>
            {new Date((progress.duration - progress.position) * 1000).toLocaleTimeString().substring(15,4)}
            </Text>
          </View>
        </View>

        {/* music control */}
        <View style={styles.musicControlsContainer}>
          <TouchableOpacity onPress={skipToPrevious}>
            <Ionicons name='play-skip-back-outline' size={25} color='#FFD369'/>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>togglePayBack(playBackState)}>
            <Ionicons 
              name={
                
                playBackState === State.Playing 
                ? 'ios-pause-circle' 
                : 'ios-play-circle'
              } 
              size={65} 
              color='#FFd369'
              

            />
          </TouchableOpacity>

          <TouchableOpacity onPress={skipToNext}>
            <Ionicons name='play-skip-forward-outline' size={25} color='#FFD369'/>
          </TouchableOpacity>
        </View>
      </View>

      {/* bottom section */}
      <View style={styles.bottomcontainer}>
        <View style={styles.bottomIconWrapper}>
          <TouchableOpacity onPress={()=>{}}>
            <Ionicons name='heart-outline' size={30} color='#a9a9a9'/>
          </TouchableOpacity>

          <TouchableOpacity onPress={changeRepeatMode}>
            <MaterialCommunityIcons name={`${repeatIcon()}`} size={30} color={repeatMode !== 'off' ? '#FFD369' : '#888888'} />
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>{}}>
            <Ionicons name='share-outline' size={30} color='#a9a9a9'/>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>{}}>
            <Ionicons name='ellipsis-horizontal' size={30} color='#a9a9a9'/>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles=StyleSheet.create({
    container:{
      flex:1,
      backgroundColor:'#222831',
        
    },
    maincontainer:{
      flex:1,
      alignItems:'center',
      justifyContent:'center'
    },
    bottomcontainer:{
      width:width,
      alignItems:'center',
      paddingVertical:15,
      borderTopColor:'#393E46',
      borderWidth:1,
    },
    bottomIconWrapper:{
      flexDirection:'row',
      justifyContent:'space-between',
      width:'80%'
    },
    mainImageWrapper:{
      width:width,
      justifyContent:'center',
      alignItems:'center',
    
    },
    imageWrapper:{
      width:250,
      height:350,
      marginBottom:20,
      marginTop:20
    
    },
    musicImage:{
      width:'100%',
      height:'100%',
      borderRadius:15,
      },
    elevation:{
      elevation:5,
      shadowColor:'#ccc',
      shadowOffset:{
        width:5,
        height:5
      },
      shadowOpacity:0.5,
      shadowRadius:3.84
    },
    songContent:{
      textAlign:'center',
      color:'#EEEEEE',
    },
    songTitle:{
      fontSize:18,
      fontWeight:'600',
      textAlign:'center',
      color:'#EEEEEE',
      marginBottom:15,
      fontFamily:'DancingScript-Regular'
    },
    songArtist:{
      fontSize:16,
      fontWeight:'300',
      textAlign:'center',
      color:'#EEEEEE',
      fontFamily:'Tapestry-Regular'
    },
    progressBar:{
      width:300,
      height:40,
      marginTop:5,
      flexDirection:'row'
    },
    progressLevelDuration:{
      width:300,
      flexDirection:'row',
      justifyContent:'space-between'
    },
    progressLabelText:{
      color:'#fff',
      fontWeight:'400',
    },
    musicControlsContainer:{
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'space-between',
      width:'60%',
    },
  });
export default MusicPlayer;