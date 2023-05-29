import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import admin from 'firebase-admin';

const db = firestore();

export const ReportPage = ({navigation, route}) => {
  const {reports} = route.params;
  const {id, userId, reportedUsername} = reports;

  const handleBanUser = async userId => {
    // Step 1: Delete user from Firebase Authentication
    try {
      await admin.auth().deleteUser(userId);
    } catch (error) {
      console.error('Error deleting user from Firebase Authentication:', error);
      // Handle error
      return;
    }

    // Step 2: Remove user from all groups
    try {
      const groupsSnapshot = await db.collection('chatGroups').get();
      const batch = db.batch();

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

      await batch.commit();
    } catch (error) {
      console.error('Error removing user from groups:', error);
      // Handle error
      return;
    }

    // Step 3: Remove user's messages from chats if not the owner
    try {
      const chatsSnapshot = await db.collection('chatGroups').get();
      const batch = db.batch();

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

      await batch.commit();
    } catch (error) {
      console.error('Error removing user messages from chats:', error);
      // Handle error
      return;
    }

    // Step 4: Remove user's ID from admins array in group chats
    try {
      const groupChatsSnapshot = await db.collection('chatGroups').get();
      const batch = db.batch();

      groupChatsSnapshot.forEach(groupChatDoc => {
        const groupChatData = groupChatDoc.data();
        const {admins} = groupChatData;

        if (admins.includes(userId)) {
          const updatedAdmins = admins.filter(admin => admin !== userId);
          batch.update(groupChatDoc.ref, {admins: updatedAdmins});
        }
      });

      await batch.commit();
    } catch (error) {
      console.error(
        'Error removing user ID from group chat admins array:',
        error,
      );
      // Handle error
      return;
    }

    // Step 5: Remove user from other users' friends lists
    try {
      const usersSnapshot = await db.collection('users').get();
      const batch = db.batch();

      usersSnapshot.forEach(userDoc => {
        const userData = userDoc.data();
        const {friends} = userData;

        if (friends.includes(userId)) {
          const updatedFriends = friends.filter(friend => friend !== userId);
          batch.update(userDoc.ref, {friends: updatedFriends});
        }
      });

      await batch.commit();
    } catch (error) {
      console.error('Error removing user from friends lists:', error);
      // Handle error
      return;
    }

    // Step 6: Remove user from conversations
    try {
      const conversationsSnapshot = await db.collection('conversations').get();
      const batch = db.batch();

      conversationsSnapshot.forEach(conversationDoc => {
        const conversationData = conversationDoc.data();
        const {participants} = conversationData;

        if (participants.includes(userId)) {
          batch.delete(conversationDoc.ref);
        }
      });

      await batch.commit();
    } catch (error) {
      console.error('Error removing user from conversations:', error);
      // Handle error
      return;
    }

    // User ban operations completed successfully
    console.log('User banned successfully');
  };

  const handleNotBanUser = () => {};

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
        <Button title="Ban User" onPress={() => handleBanUser(id)} />
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
