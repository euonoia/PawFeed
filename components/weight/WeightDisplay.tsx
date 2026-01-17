import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { getCurrentWeight } from "../../services/WeightService";
import { useTheme } from "../../theme/useTheme";

export default function WeightDisplay() {
  const theme = useTheme();
  const [weight, setWeight] = useState(0);

  useEffect(() => {
    const interval = setInterval(async () => {
      const w = await getCurrentWeight();
      setWeight(w);
    }, 3000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.text }]}>
        Current Weight: {weight} g
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
});
