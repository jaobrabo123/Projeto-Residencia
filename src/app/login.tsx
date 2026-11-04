import { NativeStackNavigationProp, Stack, useNavigation } from 'expo-router';
import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Dados usados para entrar na conta
type Credenciais = {
  identificacao: string;
  senha: string;
};

// Preencher estas funções quando o serviço da escola estiver pronto.
// A autenticação deve lançar um erro se o acesso falhar.
// A navegação acontece somente depois de confirmar o acesso.
const integracao: {
  autenticar?: (dados: Credenciais) => Promise<void>;
  aoAutenticar?: () => void;
  recuperarSenha?: () => void;
  preMatricula?: () => void;
} = {};

// Validação da matrícula ou CPF
function validarIdentificacao(valor: string): string | null {
  const texto = valor.trim();

  if (!texto) {
    return 'Informe sua matrícula ou CPF.';
  }

  // Aceita matrícula numérica ou CPF completo no formato 000.000.000-00.
  // O tamanho da matrícula e a validade do cadastro dependem da escola.
  if (!/^\d+$/.test(texto) && !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(texto)) {
    return 'Use apenas números na matrícula ou CPF. Para CPF formatado, use 000.000.000-00.';
  }

  return null;
}

type NavigationProps = NativeStackNavigationProp<{formulario: undefined}>;

export default function Login() {
  // Valores dos campos e controles da tela
  const [identificacao, setIdentificacao] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigation = useNavigation<NavigationProps>();

  // Impede dois envios ao tocar rapidamente no botão.
  const envioEmAndamento = useRef(false);

  // Valida os campos antes de tentar entrar.
  async function entrar() {
    if (envioEmAndamento.current) {
      return;
    }

    const erro = validarIdentificacao(identificacao);

    if (erro) {
      setMensagem(erro);
      return;
    }

    if (!senha.trim()) {
      setMensagem('Informe sua senha.');
      return;
    }

    if (!integracao.autenticar) {
      setMensagem('Formato preenchido corretamente. A autenticação ainda não está conectada ao sistema da escola.');
      return;
    }

    envioEmAndamento.current = true;
    setCarregando(true);
    setMensagem('');

    // Equivale ao try / except / finally do Python.
    try {
      await integracao.autenticar({
        // Mantém zeros à esquerda: identificação é texto, não uma quantidade.
        identificacao: identificacao.trim().replace(/[.-]/g, ''),
        senha, // Preserva a senha exatamente como foi digitada.
      });
      setSenha('');

      if (integracao.aoAutenticar) {
        integracao.aoAutenticar();
      } else {
        setMensagem('Acesso autorizado. A navegação após o login ainda precisa ser configurada.');
      }
    } catch {
      // Não mostra detalhes técnicos nem registra a senha.
      setMensagem('Não foi possível entrar. Confira os dados e sua conexão e tente novamente.');
    } finally {
      envioEmAndamento.current = false;
      setCarregando(false);
    }
  }

  // Ações dos outros botões
  function recuperarSenha() {
    if (integracao.recuperarSenha) {
      integracao.recuperarSenha();
    } else {
      setMensagem('A recuperação de senha ainda não está disponível. Entre em contato com a secretaria da escola.');
    }
  }

  function fazerPreMatricula() {
    if (integracao.preMatricula) {
      integracao.preMatricula();
    } else {
      setMensagem('A pré-matrícula pelo aplicativo ainda não está disponível. Entre em contato com a secretaria da escola.');
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Configura apenas esta tela, sem editar o _layout.tsx. */}
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        contentContainerStyle={styles.rolagem}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >

        {/* Cabeçalho */}
        <SafeAreaView
          edges={['top', 'left', 'right']}
          style={styles.cabecalho}
        >
          <View style={styles.marca}>
            <View style={styles.logo}>
              <Text style={styles.logoTexto}>ME</Text>
            </View>
            <Text style={styles.nomeApp}>Mobile Educational</Text>
            <Text style={styles.areaAluno}>Área do Aluno</Text>
          </View>
        </SafeAreaView>

        {/* Conteúdo do login */}
        <SafeAreaView
          edges={['bottom', 'left', 'right']}
          style={styles.areaConteudo}
        >
          <View style={styles.conteudo}>
            <Text style={styles.titulo}>Bem-vindo de volta!</Text>
            <Text style={styles.subtitulo}>Acesse com sua matrícula ou CPF</Text>
            <View style={styles.formulario}>

              {/* Matrícula ou CPF */}
              <Text style={styles.rotulo}>Matrícula / CPF</Text>
              <View style={styles.campo}>
                <Icone nome="usuario" />
                <TextInput
                  style={styles.entrada}
                  accessibilityLabel="Matrícula ou CPF"
                  placeholder="Digite sua matrícula ou CPF"
                  placeholderTextColor="#8290AB"
                  value={identificacao}
                  keyboardType="number-pad"
                  editable={!carregando}
                  onChangeText={(texto) => {
                    setIdentificacao(texto);
                    setMensagem('');
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="username"
                />
              </View>

              {/* Senha */}
              <Text style={[styles.rotulo, styles.rotuloSenha]}>Senha</Text>
              <View style={styles.campo}>
                <Icone nome="cadeado" />
                <TextInput
                  style={styles.entrada}
                  accessibilityLabel="Senha"
                  placeholder="Digite sua senha"
                  placeholderTextColor="#8290AB"
                  value={senha}
                  editable={!carregando}
                  onChangeText={(texto) => {
                    setSenha(texto);
                    setMensagem('');
                  }}
                  secureTextEntry={!mostrarSenha}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="current-password"
                  returnKeyType="go"
                  onSubmitEditing={entrar}
                />
                <Pressable
                  style={styles.botaoOlho}
                  accessibilityRole="button"
                  accessibilityLabel={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                  disabled={carregando}
                  onPress={() => setMostrarSenha(!mostrarSenha)}
                >
                  <Icone nome="olho" />
                  {mostrarSenha && <View style={styles.riscoOlho} />}
                </Pressable>
              </View>

              {/* Recuperação de senha */}
              <Pressable
                style={styles.recuperar}
                accessibilityRole="button"
                disabled={carregando}
                onPress={recuperarSenha}
              >
                <Text style={styles.textoLink}>Esqueci minha senha</Text>
              </Pressable>

              {/* Avisos de validação e de acesso */}
              {mensagem !== '' && (
                <Text
                  style={styles.mensagem}
                  accessibilityLiveRegion="polite"
                >
                  {mensagem}
                </Text>
              )}

              {/* Entrar */}
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: carregando, busy: carregando }}
                disabled={carregando}
                style={({ pressed }) => [styles.botaoEntrar, (pressed || carregando) && styles.pressionado]}
                onPress={entrar}
              >
                <Text style={styles.textoEntrar}>{carregando ? 'Entrando...' : 'Entrar'}</Text>
              </Pressable>

              {/* Separador */}
              <View style={styles.separador}>
                <View style={styles.linha} />
                <Text style={styles.textoOu}>ou</Text>
                <View style={styles.linha} />
              </View>

              {/* Pré-matrícula */}
              <Pressable
                accessibilityRole="button"
                disabled={carregando}
                style={({ pressed }) => [styles.botaoMatricula, pressed && styles.pressionado]}
                onPress={() => navigation.navigate('formulario')}
              >
                <Text style={styles.textoMatricula}>Fazer Pré-Matrícula</Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Ícones desenhados com Views para não precisar instalar dependências.
function Icone({ nome }: { nome: 'usuario' | 'cadeado' | 'olho' }) {
  return (
    <View
      style={styles.icone}
      accessible={false}
    >
      {nome === 'usuario' && (
        <>
          <View style={styles.cabecaIcone} />
          <View style={styles.corpoIcone} />
        </>
      )}
      {nome === 'cadeado' && (
        <>
          <View style={styles.arcoCadeado} />
          <View style={styles.baseCadeado} />
        </>
      )}
      {nome === 'olho' && (
        <View style={styles.olho}>
          <View style={styles.pupila} />
        </View>
      )}
    </View>
  );
}

// Estilos da tela
const styles = StyleSheet.create({
  // Tela e rolagem
  container: {
    flex: 1,
    backgroundColor: '#F5F6FC',
  },

  rolagem: {
    flexGrow: 1,
  },

  // Cabeçalho
  cabecalho: {
    backgroundColor: '#2054D8',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },

  marca: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 34,
    paddingHorizontal: 20,
  },

  logo: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: '#FFFFFF26',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  logoTexto: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },

  nomeApp: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  areaAluno: {
    color: '#DFE8FF',
    fontSize: 14,
    marginTop: 6,
  },

  // Conteúdo e boas-vindas
  areaConteudo: {
    flex: 1,
  },

  conteudo: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    padding: 24,
    paddingTop: 34,
    paddingBottom: 40,
  },

  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0B1B44',
  },

  subtitulo: {
    fontSize: 14,
    color: '#7486A8',
    marginTop: 8,
  },

  // Campos do formulário
  formulario: {
    marginTop: 32,
  },

  rotulo: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0B1B44',
    marginBottom: 8,
  },

  rotuloSenha: {
    marginTop: 18,
  },

  campo: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#D3DDF4',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    paddingLeft: 14,
    paddingRight: 4,
  },

  entrada: {
    flex: 1,
    minWidth: 0,
    minHeight: 50,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0B1B44',
  },

  botaoOlho: {
    minWidth: 44,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Recuperação de senha e avisos
  recuperar: {
    alignSelf: 'flex-end',
    minHeight: 44,
    justifyContent: 'center',
    marginTop: 2,
  },

  textoLink: {
    color: '#064BFF',
    fontSize: 14,
    fontWeight: '500',
  },

  mensagem: {
    color: '#0B1B44',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },

  // Botão de entrada
  botaoEntrar: {
    minHeight: 52,
    padding: 14,
    marginTop: 8,
    borderRadius: 16,
    backgroundColor: '#205BE9',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 8px 16px rgba(32, 84, 216, 0.22)',
  },

  textoEntrar: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },

  pressionado: {
    opacity: 0.75,
  },

  // Separador e pré-matrícula
  separador: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginVertical: 30,
  },

  linha: {
    flex: 1,
    height: 1,
    backgroundColor: '#D3DDF4',
  },

  textoOu: {
    color: '#7486A8',
    fontSize: 12,
  },

  botaoMatricula: {
    minHeight: 52,
    padding: 14,
    borderWidth: 1,
    borderColor: '#D3DDF4',
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  textoMatricula: {
    color: '#064BFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Desenho dos ícones
  icone: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cabecaIcone: {
    width: 7,
    height: 7,
    borderWidth: 1.4,
    borderColor: '#7486A8',
    borderRadius: 4,
    position: 'absolute',
    top: 2,
  },

  corpoIcone: {
    width: 13,
    height: 8,
    borderWidth: 1.4,
    borderBottomWidth: 0,
    borderColor: '#7486A8',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    position: 'absolute',
    bottom: 2,
  },

  arcoCadeado: {
    width: 8,
    height: 9,
    borderWidth: 1.4,
    borderColor: '#7486A8',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    position: 'absolute',
    top: 1,
  },

  baseCadeado: {
    width: 14,
    height: 10,
    borderWidth: 1.4,
    borderColor: '#7486A8',
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    bottom: 1,
  },

  olho: {
    width: 17,
    height: 12,
    borderWidth: 1.4,
    borderColor: '#7486A8',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pupila: {
    width: 5,
    height: 5,
    borderWidth: 1.2,
    borderColor: '#7486A8',
    borderRadius: 3,
  },

  riscoOlho: {
    position: 'absolute',
    width: 21,
    height: 1.5,
    backgroundColor: '#7486A8',
    transform: [{ rotate: '-45deg' }],
  },
});
