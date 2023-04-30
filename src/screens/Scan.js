import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import ScanSuccessModal from '../components/ScanSuccessModal';
import ScanFailModal from '../components/ScanFailModal';


export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);
  const [scannedData, setScannedData] = useState({nombre: '', apellido: '', email: ''});
  const [failReason, setFailReason] = useState();

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
  };

  const handleScanFail = (reason) => {
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
    setScanned(true);
    setScannedData(data);
    setShowSuccessModal(true);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
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
        flexGrow: 1,
    }

}); 