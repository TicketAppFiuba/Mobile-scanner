import React, { useState, useEffect } from 'react';
import { Modal, Text, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Bar } from 'react-chartjs-2';

const AttendanceChart =  (datos) => {

  let population_1 = datos.datos.attendance_date ? datos.datos.attendance_date.attendances : 0;
  let population__2 = datos.datos.attendance_date ? datos.datos.attendance_date.availability : datos.datos.reservation_date.capacity;
  
  const data = [
    { name: 'Asistentes',population: population_1, color: '#FF6347', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Ausentes',  population: population__2, color: '#1E90FF', legendFontColor: '#7F7F7F', legendFontSize: 15 },
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