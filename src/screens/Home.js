import React, { useLayoutEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import GetDayOfWeek from '../libs/DayOfWeek';

const getData = async () => {
  try {
    const value = await AsyncStorage.getItem('token');
    if (value !== null) {
      // value previously stored
      return value;
    }
  } catch (e) {
    // error reading value
  }
};

export default function Search({ navigation }) {
  const [hasEvents, setHasEvents] = useState(false);
  const [events, setEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    // Fetch data again
    getData()
      .then((token) => {
        fetch('https://b642-201-212-239-28.ngrok-free.app/authorizer/events', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
        })
          .then((response) => response.json())
          .then((json) => {
            console.log('JSON events', json);
            if (json.length === 0) {
              setHasEvents(true);
              setEvents([]);
            } else {
              setHasEvents(false);
              setEvents(json);
            }
            setRefreshing(false);
          })
          .catch((error) => {
            console.error('ERROR FETCH', error);
            setRefreshing(false);
          });
      });
  };

  useLayoutEffect(() => {
    handleRefresh();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Eventos</Text>
      </View>
      <View style={styles.body}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        >
          {hasEvents ? <Text style={styles.noEventsText}>No hay eventos</Text> : null}
          {events.map((event) => {
            return (
              <TouchableOpacity
                style={styles.eventHeader}
                key={event.id}
                onPress={() => {
                  navigation.navigate('Statistics', {
                    eventId: event.id,
                    eventName: event.title,
                    eventCapacity: event.capacity,
                    eventVacancies: event.vacancies,
                  });
                }}
              >
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDate}>{GetDayOfWeek(event.date)}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#000',
    borderBottomWidth: 1,
  },
  headerText: {
    paddingTop: 40,
    fontSize: 20,
    fontWeight: 'bold',
  },
  body: {
    backgroundColor: '#fff',
    flex: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    padding: 20,
  },
  eventHeader: {
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  eventDate: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  noEventsText: {
    paddingTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
