import React, { useLayoutEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView, View, Text, StyleSheet, RefreshControl } from 'react-native';
import GetDayOfWeek from '../libs/DayOfWeek';
import EventCard from '../components/EventCard';

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
        console.log('Este es e token = >',token)
        fetch('https://9046-181-29-197-107.sa.ngrok.io/authorizer/events', {
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
              <EventCard
                key={event.id}
                event_id={event.id}
                title={event.title}
                capacity={event.capacity}
                vacancies={event.vacancies}
                image={event.link}
                navigation={navigation}
              />
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
    width: '100%',
  },
  scrollViewContent: {
    padding: 20,
  },
  noEventsText: {
    paddingTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
