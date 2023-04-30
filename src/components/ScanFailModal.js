import React, { useState, useEffect } from 'react';
import { Modal, Text, View } from 'react-native';

export default function ScanFailModal({ isVisible, closeModal, reason }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setVisible(true);
      setTimeout(() => {
        setVisible(false);
        closeModal();
      }, 1500);
    }
  }, [isVisible]);

  return (
    <Modal visible={visible} transparent>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: 'red', padding: 20, borderRadius: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 10 }}>Entrada no escaneada con éxito</Text>
          <View style={{ marginBottom: 10 }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Detalles:</Text>
            {/* <Text style={{ color: 'white' }}>{reason}</Text> */}
          </View>
        </View>
      </View>
    </Modal>
  );
};

