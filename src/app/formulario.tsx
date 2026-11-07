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

type Campos = {
  nome: string;
  dataNascimento: string;
  turma: string;
  responsavel: string;
  telefone: string;
};

type Erros = Partial<Record<keyof Campos, string>>;

const VAZIO: Campos = {
  nome: '',
  dataNascimento: '',
  turma: '',
  responsavel: '',
  telefone: '',
};

// Máscara simples: 12/03/2010
function mascaraData(texto: string) {
  const n = texto.replace(/\D/g, '').slice(0, 8);
  if (n.length <= 2) return n;
  if (n.length <= 4) return `${n.slice(0, 2)}/${n.slice(2)}`;
  return `${n.slice(0, 2)}/${n.slice(2, 4)}/${n.slice(4)}`;
}

// Máscara simples: (79) 99999-9999
function mascaraTelefone(texto: string) {
  const n = texto.replace(/\D/g, '').slice(0, 11);
  if (n.length <= 2) return n;
  if (n.length <= 7) return `(${n.slice(0, 2)}) ${n.slice(2)}`;
  return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
}

function dataValida(texto: string) {
  const m = texto.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return false;
  const [, d, mes, a] = m.map(Number);
  const data = new Date(a, mes - 1, d);
  return (
    data.getFullYear() === a &&
    data.getMonth() === mes - 1 &&
    data.getDate() === d &&
    data <= new Date()
  );
}

function validar(campos: Campos): Erros {
  const erros: Erros = {};
  if (campos.nome.trim().split(' ').filter(Boolean).length < 2) {
    erros.nome = 'Informe o nome completo.';
  }
  if (!dataValida(campos.dataNascimento)) {
    erros.dataNascimento = 'Data inválida (use DD/MM/AAAA).';
  }
  if (!campos.turma.trim()) {
    erros.turma = 'Informe a turma.';
  }
  if (campos.responsavel.trim().length < 3) {
    erros.responsavel = 'Informe o nome do responsável.';
  }
  const tel = campos.telefone.replace(/\D/g, '');
  if (tel.length < 10) {
    erros.telefone = 'Telefone inválido.';
  }
  return erros;
}

export default function Formulario() {
  const [campos, setCampos] = useState<Campos>(VAZIO);
  const [erros, setErros] = useState<Erros>({});

  const atualizar = (campo: keyof Campos, valor: string) => {
    setCampos((atual) => ({ ...atual, [campo]: valor }));
    if (erros[campo]) setErros((atual) => ({ ...atual, [campo]: undefined }));
  };

  const salvar = () => {
    const novosErros = validar(campos);
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    // TODO: enviar para a API / banco quando o back-end estiver pronto
    console.log('Aluno cadastrado:', campos);
    Alert.alert('Sucesso', 'Aluno cadastrado com sucesso!');
    setCampos(VAZIO);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>Cadastro do Aluno</Text>

        <Campo label="Nome completo" erro={erros.nome}>
          <TextInput
            style={[styles.input, erros.nome && styles.inputErro]}
            placeholder="Ex.: Maria da Silva"
            value={campos.nome}
            onChangeText={(t) => atualizar('nome', t)}
            autoCapitalize="words"
          />
        </Campo>

        <Campo label="Data de nascimento" erro={erros.dataNascimento}>
          <TextInput
            style={[styles.input, erros.dataNascimento && styles.inputErro]}
            placeholder="DD/MM/AAAA"
            value={campos.dataNascimento}
            onChangeText={(t) => atualizar('dataNascimento', mascaraData(t))}
            keyboardType="numeric"
            maxLength={10}
          />
        </Campo>

        <Campo label="Turma" erro={erros.turma}>
          <TextInput
            style={[styles.input, erros.turma && styles.inputErro]}
            placeholder="Ex.: 7º A"
            value={campos.turma}
            onChangeText={(t) => atualizar('turma', t)}
          />
        </Campo>

        <Campo label="Nome do responsável" erro={erros.responsavel}>
          <TextInput
            style={[styles.input, erros.responsavel && styles.inputErro]}
            placeholder="Nome do pai, mãe ou responsável"
            value={campos.responsavel}
            onChangeText={(t) => atualizar('responsavel', t)}
            autoCapitalize="words"
          />
        </Campo>

        <Campo label="Telefone do responsável" erro={erros.telefone}>
          <TextInput
            style={[styles.input, erros.telefone && styles.inputErro]}
            placeholder="(00) 00000-0000"
            value={campos.telefone}
            onChangeText={(t) => atualizar('telefone', mascaraTelefone(t))}
            keyboardType="phone-pad"
            maxLength={15}
          />
        </Campo>

        <Pressable style={styles.botao} onPress={salvar}>
          <Text style={styles.botaoTexto}>Salvar</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Campo({
  label,
  erro,
  children,
}: {
  label: string;
  erro?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.campo}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: 20, gap: 16 },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  campo: { gap: 6 },
  label: { fontSize: 14, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  inputErro: { borderColor: '#d32f2f' },
  erro: { color: '#d32f2f', fontSize: 12 },
  botao: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
