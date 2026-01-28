import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from "react-native";
import { useTheme } from "@/theme/useTheme";

interface Props {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function FeedButton({ title, onPress, isLoading, disabled }: Props) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.button,
        { backgroundColor: theme.primary },
        (disabled || isLoading) && { backgroundColor: theme.muted + '50', elevation: 0 }
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color="#FFF" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%", 
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  text: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});