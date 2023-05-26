import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingSpinner from '../components/LoadingSpinner';
import { Button } from "react-native";
import AttendanceChart from '../components/AttendanceChart';
import ChartExample from '../components/ChartExample';
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import GetDayOfWeek from '../libs/DayOfWeek';

const getData = async () => {
  try {
    const value = await AsyncStorage.getItem('token');
    if (value !== null) {
      return value;
    }
  } catch (e) {
    console.error('Error reading value:', e);
  }
};

export default function Options({ route, navigation }) {
  const { eventId, eventName, eventCapacity, eventVacancies } = route.params;
  const [hasEvents, setHasEvents] = useState(false);
  const [events, setEvents] = useState([]);
  const [datos, setDatos] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Nuevo estado para el indicador de carga

  const fetchData = async () => {
    try {
      const token = await getData();
      const response = await fetch(`https://b642-201-212-239-28.ngrok-free.app/authorizer/event/statistics?event_id=${eventId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("mis datos:", responseData);
        setDatos(responseData);
        setIsLoading(false); // Marcar el indicador de carga como falso después de recibir los datos
      } else {
        console.error('Error en la respuesta del servidor:', response.status);
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up an interval for automatic refresh every 30 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    // Clear the interval when the component is unmounted
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text style={[styles.headerText, styles.centerText]}>{eventName}</Text>
      <Text style={[styles.headerText]}>Ingresos por minutos</Text>
      {isLoading ? (
        <LoadingSpinner /> // Mostrar el indicador de carga mientras se espera
      ) : (
        <ChartExample datos={datos} /> // Renderizar el gráfico después de recibir los datos
      )}
 
      <Text style={[styles.headerText]}>Asistencia</Text>
      {isLoading ? (
        <LoadingSpinner /> // Mostrar el indicador de carga mientras se espera
      ) : (
        <AttendanceChart style={{ width: '100%' }} datos={datos} /> // Renderizar el gráfico después de recibir los datos
      )}
      <Button title="Escanear entradas" key={eventId} onPress={()=>{
        navigation.navigate('Scan', {
          eventId: eventId,
          eventName: eventName,
          eventCapacity: eventCapacity,
          eventVacancies: eventVacancies 
        })
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1
  },
  header: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#000',
    borderBottomWidth: 1
  },
  headerText: {
    paddingTop: 40,
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  body: {
    backgroundColor: '#fff',
    flex: 9,
    justifyContent: 'center',
    alignItems: 'center'
  },
  eventContainer: {
    backgroundColor: '#fff',
    width: '90%',
    borderColor: '#000',
    borderWidth: 1,
    marginBottom: 10
  },
  eventHeader: {
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
    padding: 10
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  eventDate: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  noEventsText: {
    paddingTop: 20,
    fontSize: 20,
    fontWeight: 'bold'
  }
});
