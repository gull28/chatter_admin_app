import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {TabView} from '../components/TabView';

const items = [
  {label: 'Message', value: true},
  {label: 'User', value: false},
];

const db = firestore();

const ReportItem = ({report}) => {
  return (
    <View style={styles.reportItem}>
      <Text style={styles.reportText}>{report.message || report.user}</Text>
    </View>
  );
};

export const MenuPage = ({navigation, route}) => {
  const [selectedTab, setSelectedTab] = useState(false);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const reportsRef = db.collection('reports').where('open', '==', true);
        const snapshot = await reportsRef.get();
        const fetchedReports = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReports(fetchedReports);
        setLoading(false);
      } catch (error) {
        console.log('Error fetching reports: ', error);
      }
    };

    fetchReports();
  }, []);

  const messages = reports.filter(report => report.message);
  const users = reports.filter(report => !report.message);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBarContainer}></View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => handleProfile(currentUser)}>
          <Text style={styles.profileButtonText}>Profile</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <TabView
          items={items}
          selectedTab={selectedTab}
          onSelectTab={setSelectedTab}>
          <View key="messages" style={styles.tabContent}>
            {loading ? (
              <Text>Loading messages...</Text>
            ) : (
              <View>
                {messages.map(report => (
                  <ReportItem key={report.id} report={report} />
                ))}
              </View>
            )}
          </View>
          <View key="users" style={styles.tabContent}>
            {loading ? (
              <Text>Loading users...</Text>
            ) : (
              <View>
                {users.map(report => (
                  <ReportItem key={report.id} report={report} />
                ))}
              </View>
            )}
          </View>
        </TabView>
      </View>
    </View>
  );
};

const styles = {
  // ...existing styles

  content: {
    flex: 1,
    padding: 10,
  },
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
};
