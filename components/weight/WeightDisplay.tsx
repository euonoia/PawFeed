import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { subscribeWeight } from "../../services/HX711Service";

export default function WeightDisplay() {
  const [weight, setWeight] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeWeight(setWeight);
    return () => unsubscribe(); // clean up on unmount
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Current Food Weight:</Text>
      <Text style={styles.weight}>{weight} g</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 20,
  },
  label: {
    fontSize: 16,
    color: "#555",
  },
  weight: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
  },
});
