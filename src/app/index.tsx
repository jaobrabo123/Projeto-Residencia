import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Text style={styles.titulo}>Nome do App</Text>
      <Text style={styles.subtitulo}>
        Bem-vindo! Aqui vai uma frase curta sobre o app.
      </Text>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => alert('Botão clicado!')}
      >
        <Text style={styles.textoBotao}>Começar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  titulo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  subtitulo: {
    fontSize: 16,
    color: '#E0E7FF',
    textAlign: 'center',
    marginBottom: 40,
  },
  botao: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  textoBotao: {
    color: '#4F46E5',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
