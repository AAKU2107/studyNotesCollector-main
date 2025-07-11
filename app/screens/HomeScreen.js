import { useRouter } from 'expo-router';
import { collection, deleteDoc, doc, getFirestore, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../../firebase';

export default function HomeScreen() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const db = getFirestore();

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(
      collection(db, 'notes'),
      where('uid', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userNotes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotes(userNotes);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleNotePress = (note) => {
    Alert.alert(
      'Note Options',
      'What do you want to do?',
      [
        {
          text: 'Edit',
          onPress: () => router.push({ pathname: '/screens/AddNoteScreen', params: { edit: '1', id: note.id, subject: note.subject, topic: note.topic, date: note.date } })
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'notes', note.id));
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const renderNote = ({ item }) => (
    <TouchableOpacity onPress={() => handleNotePress(item)}>
      <View style={styles.noteCard}>
        <Text style={styles.subject}>{item.subject}</Text>
        <Text style={styles.topic}>{item.topic}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📚 Study Notes</Text>
        <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/screens/ProfileScreen')}>
          <Text style={styles.profileButtonText}>👤</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 40 }} />
      ) : notes.length === 0 ? (
        <Text style={styles.emptyText}>No notes yet. Tap ➕ to add one!</Text>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={renderNote}
          contentContainerStyle={styles.list}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/screens/AddNoteScreen')}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f9fc',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: '#2c3e50',
  },
  profileButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#e8ecf0',
  },
  profileButtonText: {
    fontSize: 22,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 30,
    fontSize: 16,
  },
  list: {
    paddingBottom: 80,
  },
  noteCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  subject: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: 4,
  },
  topic: {
    fontSize: 16,
    color: '#555',
    marginBottom: 2,
  },
  date: {
    fontSize: 14,
    color: '#888',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#007bff',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    color: '#fff',
    fontSize: 30,
    lineHeight: 32,
  },
});