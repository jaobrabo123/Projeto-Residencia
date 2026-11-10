import React from "react";

import {
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  ArrowRight,
  BookOpen,
  Clipboard,
  Clock,
  FileText,
  Home,
  Menu,
  Plus,
} from "lucide-react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

type StatusProtocolo = "analise" | "aprovado" | "concluido";

type Protocolo = {
  titulo: string;
  codigo: string;
  data: string;
  status: StatusProtocolo;
};

const STATUS = {
  analise: { rotulo: "Em análise", cor: "#D97706", fundo: "#FBF0C0" },
  aprovado: { rotulo: "Aprovado", cor: "#059669", fundo: "#D9F7E6" },
  concluido: { rotulo: "Concluído", cor: "#4338CA", fundo: "#EEEEFD" },
};

const SERVICOS = [
  { icone: "🏫", titulo: "Troca de Escola", descricao: "Solicitar transferência" },
  { icone: "📝", titulo: "Segunda Chamada", descricao: "Solicitação de prova" },
  { icone: "📄", titulo: "Declaração", descricao: "Matrícula ativa" },
  { icone: "📋", titulo: "Histórico", descricao: "Histórico escolar" },
];

const ATALHOS = [
  { icone: "🗓️", titulo: "Calendário" },
  { icone: "✅", titulo: "Atividades" },
  { icone: "🔄", titulo: "Rematrícula" },
];

const PROTOCOLOS: Protocolo[] = [
  { titulo: "Troca de Escola", codigo: "P20240087", data: "15/08/2024", status: "analise" },
  { titulo: "Segunda Chamada de Prova", codigo: "P20240063", data: "02/08/2024", status: "aprovado" },
  { titulo: "Declaração Escolar", codigo: "P20240041", data: "20/07/2024", status: "concluido" },
  { titulo: "Histórico Escolar", codigo: "P20240028", data: "05/07/2024", status: "concluido" },
];

export default function Servicos() {
  const acessar = (nome: string) => {
    Alert.alert("Acessar", `Você selecionou: ${nome}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar backgroundColor="#3D3BC7" barStyle="light-content" />

      <View style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.headerEyebrow}>Central de Atendimento</Text>
          <Text style={styles.headerTitle}>Protocolos e Serviços</Text>
          <Text style={styles.headerSub}>Abra e acompanhe suas solicitações</Text>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>SOLICITAR SERVIÇO</Text>

          <View style={styles.servicesGrid}>
            {SERVICOS.map((s) => (
              <ServiceCard
                key={s.titulo}
                icone={s.icone}
                titulo={s.titulo}
                descricao={s.descricao}
                onPress={() => acessar(s.titulo)}
              />
            ))}
          </View>

          <View style={styles.quickRow}>
            {ATALHOS.map((a) => (
              <TouchableOpacity
                key={a.titulo}
                style={styles.quickItem}
                activeOpacity={0.7}
                onPress={() => acessar(a.titulo)}
              >
                <Text style={styles.quickIcon}>{a.icone}</Text>
                <Text style={styles.quickText}>{a.titulo}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.protocolsHeader}>
            <Text style={styles.sectionTitleInline}>MEUS PROTOCOLOS</Text>

            <TouchableOpacity
              style={styles.newButton}
              activeOpacity={0.8}
              onPress={() => acessar("Novo protocolo")}
            >
              <Plus size={15} color="#FFFFFF" />
              <Text style={styles.newButtonText}>Novo</Text>
            </TouchableOpacity>
          </View>

          {PROTOCOLOS.map((p) => (
            <ProtocolItem
              key={p.codigo}
              protocolo={p}
              onPress={() => acessar(`Protocolo ${p.codigo}`)}
            />
          ))}
        </ScrollView>

        <BottomTabs onPress={acessar} />
      </View>
    </SafeAreaView>
  );
}

function ServiceCard({
  icone,
  titulo,
  descricao,
  onPress,
}: {
  icone: string;
  titulo: string;
  descricao: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.serviceCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.serviceIcon}>{icone}</Text>
      <Text style={styles.serviceTitle}>{titulo}</Text>
      <Text style={styles.serviceDescription}>{descricao}</Text>
    </TouchableOpacity>
  );
}

function ProtocolItem({
  protocolo,
  onPress,
}: {
  protocolo: Protocolo;
  onPress: () => void;
}) {
  const status = STATUS[protocolo.status];

  return (
    <TouchableOpacity
      style={styles.protocolItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.protocolIcon, { backgroundColor: status.fundo }]}>
        <Clipboard size={18} color={status.cor} />
      </View>

      <View style={styles.protocolBody}>
        <View style={styles.protocolRow}>
          <Text style={styles.protocolTitle} numberOfLines={1}>
            {protocolo.titulo}
          </Text>

          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: status.cor }]} />
            <Text style={[styles.statusText, { color: status.cor }]}>
              {status.rotulo}
            </Text>
          </View>
        </View>

        <View style={styles.protocolRow}>
          <Text style={styles.protocolMeta}>
            {protocolo.codigo} · {protocolo.data}
          </Text>

          <ArrowRight size={16} color="#6B7194" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

function BottomTabs({ onPress }: { onPress: (nome: string) => void }) {
  const insets = useSafeAreaInsets();

  const abas = [
    { nome: "Início", icone: Home },
    { nome: "Horários", icone: Clock },
    { nome: "Boletim", icone: BookOpen },
    { nome: "Serviços", icone: FileText },
    { nome: "Menu", icone: Menu },
  ];

  return (
    <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      {abas.map(({ nome, icone: Icone }) => {
        const ativa = nome === "Serviços";
        const cor = ativa ? "#4338CA" : "#6B7194";

        return (
          <TouchableOpacity
            key={nome}
            style={styles.tabItem}
            activeOpacity={0.7}
            onPress={() => onPress(nome)}
          >
            <View style={[styles.tabIconWrapper, ativa && styles.tabIconActive]}>
              <Icone size={20} color={cor} />
            </View>
            <Text style={[styles.tabText, { color: cor }]}>{nome}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3D3BC7",
  },

  screen: {
    flex: 1,
    backgroundColor: "#F4F4FC",
  },

  header: {
    backgroundColor: "#3D3BC7",
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 26,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  headerEyebrow: {
    fontSize: 13,
    fontWeight: "500",
    color: "#C9C8FF",
    marginBottom: 4,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },

  headerSub: {
    fontSize: 14,
    color: "#C9C8FF",
  },

  content: {
    flex: 1,
  },

  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 28,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7194",
    letterSpacing: 1.2,
    marginBottom: 14,
  },

  sectionTitleInline: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7194",
    letterSpacing: 1.2,
  },

  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },

  serviceCard: {
    width: "48%",
    minHeight: 108,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCDFF0",
    borderRadius: 16,
    padding: 16,
  },

  serviceIcon: {
    fontSize: 26,
    marginBottom: 18,
  },

  serviceTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#12123A",
    marginBottom: 2,
  },

  serviceDescription: {
    fontSize: 13,
    color: "#6B7194",
  },

  quickRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },

  quickItem: {
    flex: 1,
    height: 82,
    backgroundColor: "#EEEEFD",
    borderWidth: 1,
    borderColor: "#D3D5F5",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  quickIcon: {
    fontSize: 22,
  },

  quickText: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#4338CA",
  },

  protocolsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 26,
    marginBottom: 14,
  },

  newButton: {
    height: 38,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 18,
    backgroundColor: "#4338CA",
    borderRadius: 999,
  },

  newButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  protocolItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCDFF0",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  protocolIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  protocolBody: {
    flex: 1,
    gap: 4,
  },

  protocolRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  protocolTitle: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: "bold",
    color: "#12123A",
  },

  protocolMeta: {
    fontSize: 12,
    color: "#6B7194",
    fontFamily: Platform.select({
      ios: "Menlo",
      android: "monospace",
      default: "monospace",
    }),
  },

  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  statusText: {
    fontSize: 12.5,
    fontWeight: "600",
  },

  tabBar: {
    flexDirection: "row",
    paddingTop: 10,
    paddingHorizontal: 8,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#DCDFF0",
  },

  tabItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },

  tabIconWrapper: {
    width: 46,
    height: 30,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },

  tabIconActive: {
    backgroundColor: "#EEEEFD",
  },

  tabText: {
    fontSize: 11,
    fontWeight: "600",
  },
});
