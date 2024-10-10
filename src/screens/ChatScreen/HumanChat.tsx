import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, FlatList, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Using Ionicons instead of Feather icons in React Native
import VideoChatPreview from './VideoPreview'; // Assuming you have the VideoChatPreview converted earlier
// import ImageCom from '../../../component/Image';
import MarkDown from '../../components/MarkDown';
import { AuthContext } from '../../context/auth.context';
import { API_BASE_URL, PREFIX } from '../../constant/BaseURl';

interface UserMsgProps {
  text: string;
  imgList?: { url: string }[];
  videoRecord?: { id: string; name: string };
}

const UserMsg: React.FC<UserMsgProps> = ({ text, imgList = [], videoRecord }) => {
  const { userData } = useContext(AuthContext) || { username: '' };
  const [user, setUser] = useState(userData);

  useEffect(() => {
    setUser(userData);
  }, [userData]);

  return (
    <View style={styles.container}>
      {/* <View style={styles.iconContainer}>
        <HumanIconWrapper user={user} />
      </View> */}
      <View style={styles.chatContent}>
        <Text style={styles.chatPerson}>{user.username || user.email || 'You'}</Text>
        <View style={styles.textWrapper}>
          {imgList.length > 0 && (
            <ScrollView horizontal style={styles.imageListWrapper}>
              {imgList.map((img, index) => (
                <View key={index} style={styles.imgWrapper}>
                  {/* <ImageCom src={img.url} /> */}
                </View>
              ))}
            </ScrollView>
          )}
          <MarkDown text={text} />
        </View>
        {videoRecord && (
          <View style={styles.videoPreviewWrapper}>
            <VideoChatPreview
              id={videoRecord.id}
              videoSrc={`${API_BASE_URL}${PREFIX}file/stream/${videoRecord.name}?type=video`}
            />
          </View>
        )}
      </View>
    </View>
  );
};

interface HumanIconWrapperProps {
  user: { username: string; picture?: string };
}

const HumanIconWrapper: React.FC<HumanIconWrapperProps> = ({ user }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <View style={styles.humanIconWrapper}>
      {imgError || !user.picture ? (
        <Ionicons name="person-circle-outline" size={40} color="#00a5ff" />
      ) : (
        <Image
          source={{ uri: user.picture }}
          style={styles.userImage}
          onError={() => setImgError(true)}
        />
      )}
    </View>
  );
};

export default React.memo(UserMsg);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse',
    padding: 10,
    alignItems: 'flex-start',
    width: "100%",
    // backgroundColor: 'red',
  },
  iconContainer: {
    alignSelf: 'flex-start',
  },
  chatContent: {
    marginRight: 10,
    maxWidth: '80%',
  },
  chatPerson: {
    fontSize: 16,
    marginBottom: 7,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  textWrapper: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f7c371',
  },
  imageListWrapper: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  imgWrapper: {
    marginRight: 5,
    width: Dimensions.get('window').width / 3,
  },
  videoPreviewWrapper: {
    width: '100%',
    height: 200,
    maxWidth: 500,
    maxHeight: 200,
    marginTop: 10,
  },
  humanIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00a5ff',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  userImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
});
