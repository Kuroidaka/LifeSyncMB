import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import GoogleLinkButton from '../../components/LinkGGBtn';
import UserProfileCard from './UserGgProfile';
import { AuthContext } from '../../context/auth.context';

const LinkAccountSetting: React.FC = () => {
  const authContext = useContext(AuthContext)
  const [ggUser, setGGUser] = useState(authContext?.userData);

  useEffect(() => {
    if (authContext?.userData) setGGUser(authContext.userData);
  }, [authContext?.userData]);

  return (
    <View style={styles.container}>
      {/* Title Wrapper */}
      <View style={styles.titleWrapper}>
        <View style={styles.title}>
          <Text style={styles.titleText}>Link Account</Text>
          <Text style={styles.description}>
            Connect a Google account for{' '}
            <Text style={styles.strong}>@{ggUser.username || authContext?.userData?.username}</Text> to sponsor maintainers with. Get recognition on GitHub for sponsorships made on Patreon when the sponsored person has linked Patreon and GitHub, too, and has a public GitHub Sponsors profile.
          </Text>
        </View>
      </View>

      {/* Content Wrapper */}
      <View style={styles.contentWrapper}>
        {authContext && ggUser.googleCredentials ? (
          <UserProfileCard user={ggUser} unlink={authContext?.unlinkGoogleAccount} />
        ) : (
          <GoogleLinkButton />
        )}
      </View>
    </View>
  );
};

export default LinkAccountSetting;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  titleWrapper: {
    marginBottom: 20,
  },
  title: {
    borderBottomWidth: 1,
    borderBottomColor: '#cfcfcf',
    paddingBottom: 10,
    marginBottom: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#333',
  },
  strong: {
    fontWeight: 'bold',
  },
  contentWrapper: {
    // You can add additional styles here if needed
  },
});
