import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

export const ReportPage = ({navigation, route}) => {
  const {reports} = route.params;
  const {id, userId, reportedUsername} = reports;

  const handleBanUser = () => {
    // Perform ban user logic
    onBanUser(id);
  };

  const handleNotBanUser = () => {
    // Perform not ban user logic
    onNotBanUser(id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Report Details</Text>
      <Text style={styles.label}>ID:</Text>
      <Text style={styles.value}>{id}</Text>
      <Text style={styles.label}>Content:</Text>
      <Text style={styles.value}>{reports?.comment || reports?.message}</Text>
      <Text style={styles.label}>User ID:</Text>
      <Text style={styles.value}>{reportedUsername}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Ban User" onPress={handleBanUser} />
        <Button title="Not Ban User" onPress={handleNotBanUser} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
  },
  value: {
    fontSize: 16,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 32,
  },
});
