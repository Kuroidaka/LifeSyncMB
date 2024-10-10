import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons'; // Icon replacement for IoPause and IoPlay
import { ResizeMode } from 'expo-av'; // Or from 'react-native-video' if you're using that

interface VideoChatPreviewProps {
  id: string;
  videoSrc: string;
}

const VideoChatPreview: React.FC<VideoChatPreviewProps> = ({ id, videoSrc }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<Video>(null); // Ref for the video

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pauseAsync();
      } else {
        videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false); // Set isPlaying to false when the video ends
  };

  return (
    <View style={styles.videoContainer}>
      <Video
        ref={videoRef}
        source={{ uri: "https://www.w3schools.com/html/mov_bbb.mp4" }} // Using videoSrc prop here
        style={styles.video}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay={false} // Start video paused
        isLooping={false} // Do not loop the video
        onPlaybackStatusUpdate={(status) => {
          if (status.isLoaded && status.didJustFinish) {
            handleVideoEnd(); // Handle video end event
          }
        }}
      />
      <View style={styles.controls}>
        <TouchableOpacity onPress={handlePlayPause} style={styles.playPauseButton}>
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VideoChatPreview;

const styles = StyleSheet.create({
  videoContainer: {
    position: 'relative',
    backgroundColor: 'black',
    width: '100%',
    height: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playPauseButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
