import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/auth';
import {TabView} from '../../components/TabView';
import {ReportList} from '../../components/ReportList';
import {useFocusEffect} from '@react-navigation/native';

const items = [
  {label: 'Message', value: true},
  {label: 'User', value: false},
];

const db = firestore();

export const MenuPage = ({navigation, route}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [userReports, setUserReports] = useState([]);
  const [messageReports, setMessageReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = firebase.auth().currentUser;

  useFocusEffect(
    useCallback(() => {
      const fetchReports = async () => {
        let messageArray = [];
        let userArray = [];
        try {
          const reportsRef = db
            .collection('userReports')
            .where('open', '==', true);
          const snapshot = await reportsRef.get();
          const fetchedReports = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          if (fetchedReports?.message) {
          }
          await fetchedReports.map(report => {
            if (report?.message) {
              messageArray.push(report);
            } else {
              userArray.push(report);
            }
          });

          setMessageReports(messageArray);
          setUserReports(userArray);

          setLoading(false);
        } catch (error) {
          console.log('Error fetching reports: ', error);
        }
      };

      fetchReports();
    }, []),
  );

  const handleTabChange = index => {
    setSelectedTab(index);
  };

  useEffect(() => {
    console.log(selectedTab);
  }, [selectedTab]);

  const handleProfile = () => {
    navigation.navigate('ProfilePage', {user: currentUser.uid});
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBarContainer}></View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => handleProfile()}>
          <Text style={styles.profileButtonText}>Profile</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <TabView
          tabs={items}
          initialTab={selectedTab}
          onTabChange={handleTabChange}
        />
        {selectedTab === 0 && (
          <ReportList reports={messageReports} navigation={navigation} />
        )}
        {selectedTab === 1 && (
          <ReportList reports={userReports} navigation={navigation} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchBarContainer: {
    flex: 1,
    marginRight: 10,
  },
  profileButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  profileButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 10,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  activeTabText: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  inactiveTabText: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    color: '#666',
  },
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  reportList: {
    width: '100%',
  },
  reportItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  reportText: {
    fontSize: 16,
  },
});
