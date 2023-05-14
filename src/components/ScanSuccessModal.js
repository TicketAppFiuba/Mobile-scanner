import React, { useState, useEffect } from 'react';
import { Modal, Text, View } from 'react-native';

export default function ScanSuccessModal({ isVisible, closeModal, data, setScanned }){
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setVisible(true);
      setTimeout(() => {
        setVisible(false);
        setScanned(false)
        closeModal();
      }, 2000);
    }
  }, [isVisible]);

  return (
    <Modal visible={visible} transparent>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: 'green', padding: 20, borderRadius: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 10 }}>Escaneo exitoso</Text>
          <View style={{ marginBottom: 10 }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Detalles:</Text>
            <Text style={{ color: 'white' }}>{data}</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

