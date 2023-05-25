import React, { useState, useEffect } from 'react';
import { Modal, Text, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Bar } from 'react-chartjs-2';

const AttendanceChart =  (datos) => {
  
  const data = [
    { name: 'Asistentes', population: datos.datos.reservation_date.vacancies, color: '#FF6347', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Ausentes', population: datos.datos.reservation_date.occupancy, color: '#1E90FF', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  ];

  return (
    <View>
      <PieChart
        data={data}
        width={300}
        height={200}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
      
        absolute
      />
    </View>
  );
};

export default AttendanceChart;