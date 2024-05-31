import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, deleteDoc } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyAR4JMSlllhuXhZqL4uKNJDHxab_cBQGIQ",
    authDomain: "todolist-2226e.firebaseapp.com",
    projectId: "todolist-2226e",
    storageBucket: "todolist-2226e.appspot.com",
    messagingSenderId: "954134392436",
    appId: "1:954134392436:web:6aa07247fe179e9899ab21",
    measurementId: "G-CMCYW1XEXK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const App = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState(null);

  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadProfile();
    loadTasks();
  }, []);

  const loadProfile = async () => {
    try {
      const storedProfile = await AsyncStorage.getItem('profile');
      if (storedProfile !== null) {
        setProfile(JSON.parse(storedProfile));
      }
    } catch (error) {
      console.error('Error loading profile from AsyncStorage:', error);
    }
  };

  const saveProfile = async () => {
    try {
      const newProfile = { email, username };
      await AsyncStorage.setItem('profile', JSON.stringify(newProfile));
      setProfile(newProfile);

      // Save profile to Firestore
      const db = getFirestore();
      await setDoc(doc(db, 'profiles', newProfile.email), newProfile);
    } catch (error) {
      console.error('Error saving profile to AsyncStorage or Firestore:', error);
    }
  };

  const saveTask = async () => {
    try {
      const newTask = { name: taskName, description: taskDescription, email: profile.email };
      const updatedTasks = [...tasks, newTask];
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
      const db = getFirestore();
      await setDoc(doc(db, 'tasks', newTask.name), newTask);
      setTaskName('');
      setTaskDescription('');
    } catch (error) {
      console.error('Error saving task to AsyncStorage or Firestore:', error);
    }
  };

  const deleteTask = async (taskName) => {
    try {
      const updatedTasks = tasks.filter(task => task.name !== taskName);
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);

      const db = getFirestore();
      await deleteDoc(doc(db, 'tasks', taskName));
    } catch (error) {
      console.error('Error deleting task from AsyncStorage or Firestore:', error);
    }
  };
  const modifyTask = async (id: string) => {
    if (editingTaskText.trim()) {
      await firestore().collection('tasks').doc(id).update({
        text: editingTaskText,
      });
      setEditingTaskId(null);
      setEditingTaskText('');
    }
  };

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks !== null) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Error loading tasks from AsyncStorage:', error);
    }
  };

  const clearProfile = async () => {
    try {
      await AsyncStorage.removeItem('profile');
      setProfile(null);
    } catch (error) {
      console.error('Error clearing profile from AsyncStorage:', error);
      console.error('Error clearing profile from AsyncStorage:', error);
    }
  };

  const renderCreateProfileForm = () => {
    return (
      <View>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <Button title="Create Profile" onPress={saveProfile} />
      </View>
    );
  };

  const renderProfileDetails = () => {
    return (
      <View>
        <Text>Email: {profile.email}</Text>
        <Text>Username: {profile.username}</Text>
        <Button title="Back" onPress={clearProfile} />
      </View>
    );
  };

  const renderCreateTaskForm = () => {
    return (
      <View>
        <TextInput
          placeholder="Task Name"
          value={taskName}
          onChangeText={setTaskName}
          style={styles.input}
        />
        <TextInput
          placeholder="Task Description"
          value={taskDescription}
          onChangeText={setTaskDescription}
          style={styles.input}
        />
        <Button title="Save Task" onPress={saveTask} />
      </View>
    );
  };

  const renderTaskList = () => {
    return tasks.map((task, index) => (
      <View key={index} style={styles.task}>
        <Text>Task Name: {task.name}</Text>
        <Text>Task Description: {task.description}</Text>
        <Button title="Delete Task" onPress={() => deleteTask(task.name)} />

      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.title2}>Please create a new profile to start organizing your day</Text>
      {profile ? (
        <View>
          {renderProfileDetails()}
          {renderCreateTaskForm()}
          {renderTaskList()}
        </View>
      ) : (
        renderCreateProfileForm()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  title2: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: 250,
  },
  task: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    width: 250,
  },
});

export default App;
