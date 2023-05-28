import React, {useState, useEffect} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {ReportListItem} from './ReportListItem';

const db = firestore();

export const ReportList = ({navigation, reports}) => {
  const [reportList, setReportList] = useState([]);
  const currentUserID = auth().currentUser.uid;

  useEffect(() => {
    setReportList(reports);
    console.log(reports);
  }, [reports]);

  const renderGroup = ({item}) => (
    <ReportListItem
      title={item.message || item.comment}
      onPress={() => navigation.navigate('ReportPage', {reports: item})}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={reportList}
        renderItem={renderGroup}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 16,
  },
});
