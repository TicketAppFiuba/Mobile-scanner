
import React from 'react';
import { View } from 'react-native';
import { BarChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import { Text } from 'react-native';
import LoadingSpinner from '../components/LoadingSpinner';



const ChartExample_2 = () => {


  return (
    <View style={{ flex: 1 }}>
        <Text style={{fontSize: 15, paddingTop: 30, fontWeight: 'bold', textAlign: 'center'}}>Realize un escaneo para ver datos</Text>
        <LoadingSpinner />
     
    </View>
  );
};

export default ChartExample_2;