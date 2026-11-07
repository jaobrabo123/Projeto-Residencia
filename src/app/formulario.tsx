import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Dados = {
  aluno_nome: string;
  aluno_nascimento: string;
  aluno_genero: string;
  aluno_endereco: string;
  resp_nome: string;
  resp_telefone: string;
  resp_email: string;
  acad_serie: string;
  saude_alergias: string;
  auto_imagem: string;
};

const DADOS_VAZIOS: Dados = {
  aluno_nome: '',
  aluno_nascimento: '',
  aluno_genero: '',
  aluno_endereco: '',
  resp_nome: '',
  resp_telefone: '',
  resp_email: '',
  acad_serie: '',
  saude_alergias: '',
  auto_imagem: '',
};

export default function Formulario() {
  const [dados, setDados] = useState<Dados>(DADOS_VAZIOS);

  const atualizarCampo = (campo: keyof Dados, valor: string) => {
    setDados((atual) => ({ ...atual, [campo]: valor }));
  };

  const enviarFormulario = async () => {
    if (!dados.aluno_nome || !dados.resp_email) {
      Alert.alert('Erro', 'Por favor, preencha o nome do aluno e o e-mail.');
      return;
    }

    try {
      // Substitua pela sua URL do Formspree
      const resposta = await fetch('https://formspree.io/f/SEU_CODIGO_AQUI', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
      });

      if (resposta.ok) {
        Alert.alert('Sucesso!', 'A matrícula foi enviada com sucesso.');
        setDados(DADOS_VAZIOS);
      } else {
        Alert.alert('Erro', 'Ocorreu um problema ao enviar. Tente novamente.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Sem conexão com a internet ou erro no servidor.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>Ficha de Matrícula</Text>

        <View style={styles.seccao}>
          <Text style={styles.seccaoTitulo}>1. Dados Pessoais do Aluno</Text>

          <Text style={styles.label}>Nome Completo</Text>
          <TextInput
            style={styles.input}
            value={dados.aluno_nome}
            onChangeText={(texto) => atualizarCampo('aluno_nome', texto)}
            placeholder="Ex: João Silva"
          />

          <Text style={styles.label}>Data de Nascimento</Text>
          <TextInput
            style={styles.input}
            value={dados.aluno_nascimento}
            onChangeText={(texto) => atualizarCampo('aluno_nascimento', texto)}
            placeholder="DD/MM/AAAA"
            keyboardType="numbers-and-punctuation"
          />

          <Text style={styles.label}>Gênero</Text>
          <TextInput
            style={styles.input}
            value={dados.aluno_genero}
            onChangeText={(texto) => atualizarCampo('aluno_genero', texto)}
          />

          <Text style={styles.label}>Endereço Completo</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={dados.aluno_endereco}
            onChangeText={(texto) => atualizarCampo('aluno_endereco', texto)}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.seccao}>
          <Text style={styles.seccaoTitulo}>2. Dados do Responsável</Text>

          <Text style={styles.label}>Nome do Responsável</Text>
          <TextInput
            style={styles.input}
            value={dados.resp_nome}
            onChangeText={(texto) => atualizarCampo('resp_nome', texto)}
          />

          <Text style={styles.label}>Telefone (Celular)</Text>
          <TextInput
            style={styles.input}
            value={dados.resp_telefone}
            onChangeText={(texto) => atualizarCampo('resp_telefone', texto)}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>E-mail Principal</Text>
          <TextInput
            style={styles.input}
            value={dados.resp_email}
            onChangeText={(texto) => atualizarCampo('resp_email', texto)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.seccao}>
          <Text style={styles.seccaoTitulo}>3. Outras Informações</Text>

          <Text style={styles.label}>Série/Ano Pretendido</Text>
          <TextInput
            style={styles.input}
            value={dados.acad_serie}
            onChangeText={(texto) => atualizarCampo('acad_serie', texto)}
          />

          <Text style={styles.label}>Alergias ou Doenças Crônicas?</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={dados.saude_alergias}
            onChangeText={(texto) => atualizarCampo('saude_alergias', texto)}
            multiline
            placeholder="Nenhuma ou listar..."
          />
        </View>

        <Pressable style={styles.botao} onPress={enviarFormulario}>
          <Text style={styles.botaoTexto}>Enviar Matrícula</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7f6',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: 20,
    marginTop: 20,
  },
  seccao: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  seccaoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#2c3e50',
    color: '#fff',
    padding: 8,
    borderRadius: 4,
    marginBottom: 15,
    overflow: 'hidden',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  botao: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
