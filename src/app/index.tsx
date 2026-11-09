import { router, Stack } from 'expo-router';
import {
  ArrowRight,
  BookOpen,
  Bell,
  CircleAlert,
  CircleCheck,
  Clock,
  FileText,
  House,
  Megaphone,
  Menu,
  TriangleAlert,
} from 'lucide-react-native';
import { useState } from 'react';
import type { ComponentType } from 'react';
import {
  Alert,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Dados de exemplo enquanto o sistema da escola não está conectado.
// Substituir por dados reais (login/API) quando estiverem disponíveis.
const ALUNO = {
  nome: 'Ana Beatriz',
  turma: '9º Ano B',
  matricula: '2024005847',
};

const RESUMO = [
  { rotulo: 'Frequência', valor: '88%', cor: '#6EE7A8' },
  { rotulo: 'Média Geral', valor: '7,4', cor: '#6EE7A8' },
  { rotulo: 'Faltas totais', valor: '14', cor: '#FF9DB1' },
];

type TipoAviso = 'geral' | 'alerta';

type Aviso = {
  id: string;
  tipo: TipoAviso;
  rotulo: string;
  data: string;
  titulo: string;
  texto: string;
};

const AVISOS: Aviso[] = [
  {
    id: '1',
    tipo: 'geral',
    rotulo: 'Aviso Geral',
    data: '28/08/2024',
    titulo: 'Reunião de Pais e Mestres',
    texto: 'Dia 30/08 às 18h no Auditório. Presença obrigatória para responsáveis.',
  },
  {
    id: '2',
    tipo: 'alerta',
    rotulo: 'Alerta',
    data: '27/08/2024',
    titulo: 'Prazo de rematrícula',
    texto: 'O prazo para confirmar a rematrícula termina em 15/09.',
  },
  {
    id: '3',
    tipo: 'geral',
    rotulo: 'Aviso Geral',
    data: '26/08/2024',
    titulo: 'Feira de Ciências',
    texto: 'Inscrições abertas até 06/09 com a coordenação pedagógica.',
  },
  {
    id: '4',
    tipo: 'geral',
    rotulo: 'Aviso Geral',
    data: '25/08/2024',
    titulo: 'Uniforme obrigatório',
    texto: 'A partir de segunda-feira o uso do uniforme completo é obrigatório.',
  },
];

type Atividade = {
  id: string;
  disciplina: string;
  titulo: string;
  entrega: string;
  urgente?: boolean;
};

const ATIVIDADES: Atividade[] = [
  { id: '1', disciplina: 'Matemática', titulo: 'Lista de exercícios — Cap. 7', entrega: '30/08', urgente: true },
  { id: '2', disciplina: 'História', titulo: 'Resenha: Revolução Industrial', entrega: '02/09' },
  { id: '3', disciplina: 'Ciências', titulo: 'Relatório de experimento', entrega: '05/09' },
];

const MONO = Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' });

const DIAS = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

// Ex.: "Quarta-feira, 28 ago 2024" (sem depender de Intl)
function dataPorExtenso(data: Date) {
  return `${DIAS[data.getDay()]}, ${data.getDate()} ${MESES[data.getMonth()]} ${data.getFullYear()}`;
}

function avisarEmBreve(secao: string) {
  Alert.alert('Em breve', `A seção "${secao}" ainda não está disponível.`);
}

type Icone = ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

const ABAS: { id: string; rotulo: string; icone: Icone; aoPressionar?: () => void }[] = [
  { id: 'inicio', rotulo: 'Início', icone: House },
  { id: 'horarios', rotulo: 'Horários', icone: Clock, aoPressionar: () => avisarEmBreve('Horários') },
  { id: 'boletim', rotulo: 'Boletim', icone: BookOpen, aoPressionar: () => avisarEmBreve('Boletim') },
  { id: 'servicos', rotulo: 'Serviços', icone: FileText, aoPressionar: () => avisarEmBreve('Serviços') },
  { id: 'menu', rotulo: 'Menu', icone: Menu, aoPressionar: () => router.push('/MenuLateral') },
];

export default function Inicio() {
  const { width } = useWindowDimensions();
  const [avisoAtual, setAvisoAtual] = useState(0);

  // Cada aviso deixa uma "espiada" do próximo cartão, como no protótipo.
  const larguraConteudo = Math.min(width, 440) - 40;
  const larguraAviso = larguraConteudo - 48;
  const passo = larguraAviso + 12;

  function aoRolarAvisos(evento: NativeSyntheticEvent<NativeScrollEvent>) {
    const indice = Math.round(evento.nativeEvent.contentOffset.x / passo);
    setAvisoAtual(Math.min(Math.max(indice, 0), AVISOS.length - 1));
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={styles.rolagem} showsVerticalScrollIndicator={false}>
        {/* Cabeçalho */}
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.cabecalho}>
          <View style={styles.cabecalhoLinha}>
            <View style={styles.saudacaoArea}>
              <Text style={styles.data}>{dataPorExtenso(new Date())}</Text>
              <Text style={styles.saudacao}>Olá, {ALUNO.nome}! 👋</Text>
              <Text style={styles.turma}>
                {ALUNO.turma} · Mat. {ALUNO.matricula}
              </Text>
            </View>

            <Pressable
              style={styles.botaoSino}
              accessibilityRole="button"
              accessibilityLabel="Notificações"
              onPress={() => avisarEmBreve('Notificações')}
            >
              <Bell size={20} color="#FFFFFF" />
              <View style={styles.sinoPonto} />
            </Pressable>
          </View>

          <View style={styles.resumo}>
            {RESUMO.map((item) => (
              <View key={item.rotulo} style={styles.resumoCard}>
                <Text style={[styles.resumoValor, { color: item.cor }]}>{item.valor}</Text>
                <Text style={styles.resumoRotulo}>{item.rotulo}</Text>
              </View>
            ))}
          </View>
        </SafeAreaView>

        <View style={styles.conteudo}>
          {/* Avisos da escola */}
          <View style={styles.secaoCabecalho}>
            <Text style={styles.secaoTitulo}>AVISOS DA ESCOLA</Text>
            <Text style={styles.contador}>
              {avisoAtual + 1}/{AVISOS.length}
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={passo}
            decelerationRate="fast"
            contentContainerStyle={styles.carrossel}
            onScroll={aoRolarAvisos}
            scrollEventThrottle={16}
          >
            {AVISOS.map((aviso) => (
              <CartaoAviso key={aviso.id} aviso={aviso} largura={larguraAviso} />
            ))}
          </ScrollView>

          <View style={styles.pontos} accessible={false}>
            {AVISOS.map((aviso, indice) => (
              <View
                key={aviso.id}
                style={[styles.ponto, indice === avisoAtual && styles.pontoAtivo]}
              />
            ))}
          </View>

          {/* Atividades pendentes */}
          <View style={[styles.secaoCabecalho, styles.secaoEspaco]}>
            <Text style={styles.secaoTitulo}>ATIVIDADES PENDENTES</Text>
            <Pressable
              style={styles.verTodas}
              accessibilityRole="button"
              onPress={() => avisarEmBreve('Atividades e Tarefas')}
            >
              <Text style={styles.verTodasTexto}>Ver todas</Text>
              <ArrowRight size={13} color="#1D4ED8" />
            </Pressable>
          </View>

          {ATIVIDADES.map((atividade) => (
            <CartaoAtividade key={atividade.id} atividade={atividade} />
          ))}
        </View>
      </ScrollView>

      {/* Barra de navegação */}
      <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.barra}>
        <View style={styles.barraLinha}>
          {ABAS.map((aba) => {
            const ativa = aba.id === 'inicio';
            const IconeAba = aba.icone;

            return (
              <Pressable
                key={aba.id}
                style={styles.aba}
                accessibilityRole="tab"
                accessibilityState={{ selected: ativa }}
                onPress={aba.aoPressionar}
              >
                <View style={[styles.abaIcone, ativa && styles.abaIconeAtivo]}>
                  <IconeAba size={20} color={ativa ? '#1D4ED8' : '#6B7A99'} />
                </View>
                <Text style={[styles.abaRotulo, ativa && styles.abaRotuloAtivo]}>{aba.rotulo}</Text>
              </Pressable>
            );
          })}
        </View>
      </SafeAreaView>
    </View>
  );
}

function CartaoAviso({ aviso, largura }: { aviso: Aviso; largura: number }) {
  const alerta = aviso.tipo === 'alerta';
  const IconeAviso = alerta ? TriangleAlert : Megaphone;
  const cor = alerta ? '#B45309' : '#1D4ED8';

  return (
    <View
      style={[
        styles.aviso,
        { width: largura },
        alerta ? styles.avisoAlerta : styles.avisoGeral,
      ]}
    >
      <View style={styles.avisoTopo}>
        <View style={styles.avisoTipo}>
          <IconeAviso size={13} color={cor} />
          <Text style={[styles.avisoRotulo, { color: cor }]}>{aviso.rotulo}</Text>
        </View>
        <Text style={styles.avisoData}>{aviso.data}</Text>
      </View>
      <Text style={styles.avisoTitulo} numberOfLines={1}>
        {aviso.titulo}
      </Text>
      <Text style={styles.avisoTexto} numberOfLines={2}>
        {aviso.texto}
      </Text>
    </View>
  );
}

function CartaoAtividade({ atividade }: { atividade: Atividade }) {
  const urgente = atividade.urgente === true;

  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [styles.atividade, pressed && styles.pressionado]}
      onPress={() => avisarEmBreve('Atividades e Tarefas')}
    >
      <View style={[styles.atividadeIcone, urgente && styles.atividadeIconeUrgente]}>
        {urgente ? (
          <CircleAlert size={22} color="#E5252A" />
        ) : (
          <CircleCheck size={22} color="#1D4ED8" />
        )}
      </View>

      <View style={styles.atividadeTexto}>
        <Text style={[styles.atividadeDisciplina, urgente && styles.textoUrgente]}>
          {atividade.disciplina}
        </Text>
        <Text style={styles.atividadeTitulo} numberOfLines={1}>
          {atividade.titulo}
        </Text>
      </View>

      <View style={styles.atividadeEntrega}>
        <Text style={[styles.atividadeData, urgente && styles.textoUrgente]}>{atividade.entrega}</Text>
        <Text style={styles.atividadeEntregaRotulo}>entrega</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FC',
  },

  rolagem: {
    flexGrow: 1,
    paddingBottom: 24,
  },

  // Cabeçalho
  cabecalho: {
    backgroundColor: '#1D4ED8',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },

  cabecalhoLinha: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },

  saudacaoArea: {
    flex: 1,
  },

  data: {
    color: '#DCE6FF',
    fontSize: 12,
  },

  saudacao: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 6,
  },

  turma: {
    color: '#DCE6FF',
    fontSize: 13,
    marginTop: 6,
  },

  botaoSino: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sinoPonto: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF9F1C',
  },

  // Resumo
  resumo: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
  },

  resumoCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },

  resumoValor: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  resumoRotulo: {
    color: '#DCE6FF',
    fontSize: 12,
    marginTop: 4,
  },

  // Conteúdo
  conteudo: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  secaoCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  secaoEspaco: {
    marginTop: 22,
  },

  secaoTitulo: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.2,
  },

  contador: {
    color: '#1D4ED8',
    fontSize: 12,
    fontWeight: '600',
  },

  // Avisos
  carrossel: {
    gap: 12,
  },

  aviso: {
    minHeight: 120,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },

  avisoGeral: {
    backgroundColor: '#EEF2FF',
    borderColor: '#D3DDF4',
  },

  avisoAlerta: {
    backgroundColor: '#FFF4CC',
    borderColor: '#F5DC8A',
  },

  avisoTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  avisoTipo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  avisoRotulo: {
    fontSize: 12,
    fontWeight: '500',
  },

  avisoData: {
    color: '#7486A8',
    fontSize: 12,
  },

  avisoTitulo: {
    color: '#0B1B44',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
  },

  avisoTexto: {
    color: '#7486A8',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 6,
  },

  pontos: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 14,
  },

  ponto: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CBD5E8',
  },

  pontoAtivo: {
    width: 18,
    backgroundColor: '#1D4ED8',
  },

  // Atividades
  verTodas: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minHeight: 32,
  },

  verTodasTexto: {
    color: '#1D4ED8',
    fontSize: 12,
    fontWeight: '600',
  },

  atividade: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    marginBottom: 8,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D5DEF1',
  },

  atividadeIcone: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EDF1FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  atividadeIconeUrgente: {
    backgroundColor: '#FFE1E1',
  },

  atividadeTexto: {
    flex: 1,
  },

  atividadeDisciplina: {
    color: '#1D4ED8',
    fontSize: 12,
    fontWeight: '500',
  },

  atividadeTitulo: {
    color: '#0B1B44',
    fontSize: 14,
    marginTop: 3,
  },

  atividadeEntrega: {
    alignItems: 'flex-end',
  },

  atividadeData: {
    color: '#475569',
    fontFamily: MONO,
    fontSize: 12,
    fontWeight: 'bold',
  },

  atividadeEntregaRotulo: {
    color: '#7486A8',
    fontSize: 11,
    marginTop: 3,
  },

  textoUrgente: {
    color: '#E5252A',
  },

  pressionado: {
    opacity: 0.75,
  },

  // Barra de navegação
  barra: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E3E9F5',
  },

  barraLinha: {
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 6,
    paddingHorizontal: 8,
  },

  aba: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    minHeight: 48,
  },

  abaIcone: {
    width: 44,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  abaIconeAtivo: {
    backgroundColor: '#E3EBFF',
  },

  abaRotulo: {
    color: '#6B7A99',
    fontSize: 10,
    fontWeight: '600',
  },

  abaRotuloAtivo: {
    color: '#1D4ED8',
  },
});
