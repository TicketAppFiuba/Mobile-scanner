import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import ScanSuccessModal from '../components/ScanSuccessModal';
import ScanFailModal from '../components/ScanFailModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getData = async () => {
  try {
    const value = await AsyncStorage.getItem('token')
    if(value !== null) {
      // value previously stored
      return value
    }
  } catch(e) {
    // error reading value
  }
}

export default function App({route, navigation}) {
  const { eventId, eventName } = route.params;

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  const [token, setToken] = useState("");

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);
  const [scannedData, setScannedData] = useState({nombre: '', apellido: '', email: ''});
  const [failReason, setFailReason] = useState();

  const [lastScanTime, setLastScanTime] = useState(0);

  useLayoutEffect(() => {
    // get token from localstorage
    getData()
    .then((token) => {
      setToken(token)
    })
  }, [])




  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleScanSuccess = (data) => {
    setScannedData(data);
    setShowSuccessModal(true);
    setScanned(true);
  };

  const handleScanFail = (reason) => {
    console.log("handleScanFail", reason)
    setFailReason(reason);
    setShowFailModal(true);

  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setShowFailModal(false);
    setScannedData(null);
    setFailReason('');
  };


  const handleBarCodeScanned = ({ type, data }) => {
    const now = Date.now();

    if (now - lastScanTime > 5000) {
      fetch("https://71a7-201-212-239-28.ngrok-free.app/authorizer/ticket",
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({
            "event_id": eventId, 
            "reservation_code": data,
            })
      })
      .then((response) => {
        if (response.status != 200) {
          response.json()
          .then(json => handleScanFail(json.detail))
        }
        return response.json()
      })
      .then((json) => handleScanSuccess(json.detail))
      .catch((error) => {
        console.log("error: ", error)
      })
      setLastScanTime(now);
    } 
  };

  if (hasPermission === null) {
    return <Text style={{
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      flexGrow: 1,
    }}>Solicitando Permisos de cámara</Text>;
  }
  if (hasPermission === false) {
    return <Text>No se tiene accesso a la cámara</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={{fontSize: 20, paddingTop: 30, fontWeight: 'bold'}}>Escanear QR de {eventName}</Text>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {/* add a square on top of camera view to show where to scan*/}
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: 300, height: 300, borderWidth: 5, borderColor: 'red', borderRadius: 40 }} />
        </View>
        <ScanSuccessModal isVisible={showSuccessModal} closeModal={handleCloseModal} data={scannedData} setScanned={setScanned}/>
        <ScanFailModal isVisible={showFailModal} closeModal={handleCloseModal} reason={failReason} />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }

}); 