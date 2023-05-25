
import React from 'react';
import { View } from 'react-native';
import { BarChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import { Text } from 'react-native-svg';



const ChartExample = (datos) => {
  const barData = datos.datos.distribution_per_hour.map(element => element.attendances);
  const labels = datos.datos.distribution_per_hour.map(element => element.hour);

const axesSvg = { fontSize: 10, fill: 'grey' };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ width: '100%', height: '80%', flexDirection: 'row' }}>
        <YAxis
          data={barData}
          contentInset={{ top: 20, bottom: 20 }}
          svg={axesSvg}
        />
        <BarChart
          style={{ flex: 1, marginLeft: 16 }}
          data={barData}
          svg={{
            fill: '#5B2C6F',
          }}
          contentInset={{ top: 20, bottom: 20 }}
        >
          <Grid />
        </BarChart>
      </View>
      <XAxis
        style={{ marginHorizontal: -10, height: 20 }}
        data={barData}
        formatLabel={(value, index) => labels[index]}
        contentInset={{ left: 20, right: 20 }}
        svg={axesSvg}
      />
    </View>
  );
};

export default ChartExample;