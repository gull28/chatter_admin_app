import React, {useState} from 'react';
import {View, Text, Button, StyleSheet, ActivityIndicator} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {errorToast} from '../../helpers/helpers';

const db = firestore();

export const ReportPage = ({navigation, route}) => {
  const {reports} = route.params;
  const {id, reportedUser, reportedUsername, email} = reports;
  const [loading, setLoading] = useState(false);
  console.log('id', id);
  const handleBanUser = async userId => {
    setLoading(true);

    try {
      const batch = db.batch();

      // Step 1: Delete user from Firebase Authentication
      await db
        .collection('bannedUsers')
        .doc(userId)
        .set(
          {banned: true, username: reportedUsername, email: email},
          {merge: true},
        );

      // Step 2: Remove user from all groups
      const groupsSnapshot = await db.collection('chatGroups').get();
      groupsSnapshot.forEach(groupDoc => {
        const groupData = groupDoc.data();
        const {groupOwner, participants, admins} = groupData;

        // Remove user from participants array
        if (participants.includes(userId)) {
          const updatedParticipants = participants.filter(
            participant => participant !== userId,
          );
          batch.update(groupDoc.ref, {participants: updatedParticipants});
        }

        // Remove user from admins array
        if (admins.includes(userId)) {
          const updatedAdmins = admins.filter(admin => admin !== userId);
          batch.update(groupDoc.ref, {admins: updatedAdmins});
        }

        // Delete group if user is the owner
        if (groupOwner === userId) {
          batch.delete(groupDoc.ref);
        }
      });

      // Step 3: Remove user's messages from chats if not the owner
      const chatsSnapshot = await db.collection('chatGroups').get();
      chatsSnapshot.forEach(chatDoc => {
        const chatData = chatDoc.data();
        const {groupOwner} = chatData;

        if (groupOwner !== userId) {
          const messagesCollectionRef = chatDoc.ref.collection('messages');
          const userMessagesQuery = messagesCollectionRef.where(
            'sender',
            '==',
            userId,
          );

          userMessagesQuery.get().then(querySnapshot => {
            querySnapshot.forEach(messageDoc => {
              batch.delete(messageDoc.ref);
            });
          });
        }
      });

      // Step 4: Remove user's ID from admins array in group chats
      const groupChatsSnapshot = await db.collection('chatGroups').get();
      groupChatsSnapshot.forEach(groupChatDoc => {
        const groupChatData = groupChatDoc.data();
        const {admins} = groupChatData;

        if (admins.includes(userId)) {
          const updatedAdmins = admins.filter(admin => admin !== userId);
          batch.update(groupChatDoc.ref, {admins: updatedAdmins});
        }
      });

      // Step 5: Remove user from other users' friends lists
      const usersSnapshot = await db
        .collection('users')
        .where('friends', 'array-contains', userId)
        .get();
      usersSnapshot.forEach(userDoc => {
        const userData = userDoc.data();
        const {friends} = userData;

        const updatedFriends = friends.filter(friend => friend !== userId);
        batch.update(userDoc.ref, {friends: updatedFriends});
      });

      // Step 6: Remove user from conversations
      const conversationsSnapshot = await db.collection('conversations').get();
      conversationsSnapshot.forEach(conversationDoc => {
        const conversationData = conversationDoc.data();
        const {participants} = conversationData;

        if (participants.includes(userId)) {
          batch.delete(conversationDoc.ref);
        }
      });

      // Step 7: Update report status to closed
      const reportRef = db.collection('userReports').doc(id);
      batch.update(reportRef, {open: false});

      await batch.commit();

      navigation.navigate('MenuPage');
      setLoading(true);
      // User ban operations completed successfully
      errorToast('User banned successfully!');
    } catch (error) {
      console.error('Error performing user ban operations:', error);
      // Handle error
      return;
    }
  };

  const handleNotBanUser = async () => {
    try {
      const reportRef = db.collection('userReports').doc(id);
      await reportRef.update({open: false});
      navigation.navigate('MenuPage');
    } catch (error) {
      console.error('Error updating report status to closed:', error);
      // Handle error
      return;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Report Details</Text>
      <View style={styles.section}>
        <Text style={styles.label}>ID:</Text>
        <Text style={styles.value}>{reportedUser}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Content:</Text>
        <Text style={styles.value}>{reports?.comment || reports?.message}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>User ID:</Text>
        <Text style={styles.value}>{reportedUsername}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Ban User"
          onPress={() => handleBanUser(reportedUser)}
          style={styles.button}
        />
        <Button
          title="Not Ban User"
          onPress={handleNotBanUser}
          style={styles.button}
        />
      </View>
      {loading && (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2196F3',
  },
  section: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 8,
    padding: 16,
    backgroundColor: 'white',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  value: {
    fontSize: 16,
    marginTop: 4,
    color: '#333333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 32,
  },
  button: {
    borderRadius: 20,
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
