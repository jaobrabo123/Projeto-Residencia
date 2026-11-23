import { type Href, router, Stack } from "expo-router";
import {
  CalendarDays,
  CircleCheck,
  LogOut,
  RefreshCw,
  User,
  X,
} from "lucide-react-native";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DURACAO = 220;

// Dados de exemplo enquanto o sistema da escola não está conectado.
const ALUNO = {
  nome: "Ana Beatriz Silva",
  matricula: "2024005847",
};

const ESCOLA = {
  nome: "EMEF Prof. Adalberto Lima",
  turno: "Turno Manhã · 2024",
};

export default function MenuLateral() {
  const { width } = useWindowDimensions();
  // A gaveta ocupa a maior parte da tela e deixa uma faixa da tela anterior
  // escurecida à esquerda, como no protótipo.
  const larguraGaveta = Math.min(Math.round(width * 0.82), 360);

  const [progresso] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(progresso, {
      toValue: 1,
      duration: DURACAO,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [progresso]);

  // Anima a saída antes de voltar para a tela de onde o menu foi aberto.
  function fechar(aoTerminar?: () => void) {
    Animated.timing(progresso, {
      toValue: 0,
      duration: DURACAO,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      if (aoTerminar) aoTerminar();
      else if (router.canGoBack()) router.back();
      else router.replace("/inicio");
    });
  }

  function abrirTela(rota: Href) {
    // Fecha o menu e abre a tela escolhida por cima da tela anterior,
    // para que o botão voltar retorne de onde o menu foi aberto.
    fechar(() => {
      if (router.canGoBack()) router.back();
      router.push(rota);
    });
  }

  function encerrarSessao() {
    // Descarta todas as telas empilhadas (menu + telas internas) antes de
    // abrir o login, para que o botão voltar não leve de volta ao app.
    if (router.canDismiss()) router.dismissAll();
    router.replace("/login");
  }

  function sairDaConta() {
    // No web o Alert com botões não é exibido, então usa o confirm do navegador.
    if (Platform.OS === "web") {
      if (window.confirm("Deseja realmente sair da sua conta?")) {
        encerrarSessao();
      }
      return;
    }

    Alert.alert("Sair da conta", "Deseja realmente sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: encerrarSessao },
    ]);
  }

  return (
    <View style={styles.raiz}>
      <Stack.Screen
        options={{
          headerShown: false,
          presentation: "transparentModal",
          animation: "none",
        }}
      />
      <StatusBar barStyle="light-content" />

      {/* Fundo escurecido: tocar fora da gaveta fecha o menu */}
      <Animated.View
        style={[styles.fundo, { opacity: progresso }]}
        pointerEvents="box-none"
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          accessibilityRole="button"
          accessibilityLabel="Fechar menu"
          onPress={() => fechar()}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.gaveta,
          {
            width: larguraGaveta,
            transform: [
              {
                translateX: progresso.interpolate({
                  inputRange: [0, 1],
                  outputRange: [larguraGaveta, 0],
                }),
              },
            ],
          },
        ]}
      >
        {/* Cabeçalho */}
        <SafeAreaView edges={["top"]} style={styles.cabecalho}>
          <View style={styles.cabecalhoLinha}>
            <View style={styles.avatar}>
              <User size={24} color="#3B2A8C" fill="#3B2A8C" />
            </View>

            <View style={styles.aluno}>
              <View style={styles.marca}>
                <View style={styles.marcaSelo}>
                  <Text style={styles.marcaSeloTexto}>ME</Text>
                </View>
                <Text style={styles.marcaNome} numberOfLines={1}>
                  Mobile Educational
                </Text>
              </View>

              <Text style={styles.alunoDados}>
                {ALUNO.nome} · Mat. {ALUNO.matricula}
              </Text>
            </View>

            <Pressable
              style={styles.fechar}
              accessibilityRole="button"
              accessibilityLabel="Fechar menu"
              hitSlop={8}
              onPress={() => fechar()}
            >
              <X size={22} color="#DCE6FF" />
            </Pressable>
          </View>
        </SafeAreaView>

        {/* Conteúdo */}
        <ScrollView
          style={styles.conteudo}
          contentContainerStyle={styles.conteudoInterno}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.escola}>
            <Text style={styles.escolaLogo}>ME</Text>
            <View style={styles.escolaInfo}>
              <Text style={styles.escolaNome}>{ESCOLA.nome}</Text>
              <Text style={styles.escolaTurno}>{ESCOLA.turno}</Text>
            </View>
          </View>

          <Text style={styles.secaoTitulo}>ACESSAR SEÇÃO</Text>

          <ItemMenu
            titulo="Calendário Escolar"
            descricao="Feriados, provas e eventos"
            icone={<CalendarDays size={20} color="#1D4ED8" />}
            aoPressionar={() => abrirTela("/calendario")}
          />
          <ItemMenu
            titulo="Atividades e Tarefas"
            descricao="Pendentes e concluídas"
            icone={<CircleCheck size={20} color="#1D4ED8" />}
            aoPressionar={() => abrirTela("/atividades")}
          />
          <ItemMenu
            titulo="Rematrícula"
            descricao="Confirmar para 2025/2026"
            icone={<RefreshCw size={20} color="#1D4ED8" />}
            aoPressionar={() => abrirTela("/rematricula")}
          />
        </ScrollView>

        {/* Rodapé */}
        <SafeAreaView edges={["bottom"]} style={styles.rodape}>
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.sair,
              pressed && styles.pressionado,
            ]}
            onPress={sairDaConta}
          >
            <LogOut size={18} color="#E5252A" />
            <Text style={styles.sairTexto}>Sair da conta</Text>
          </Pressable>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}

function ItemMenu({
  titulo,
  descricao,
  icone,
  aoPressionar,
}: {
  titulo: string;
  descricao: string;
  icone: ReactNode;
  aoPressionar: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [styles.item, pressed && styles.pressionado]}
      onPress={aoPressionar}
    >
      <View style={styles.itemIcone}>{icone}</View>

      <View style={styles.itemTexto}>
        <Text style={styles.itemTitulo}>{titulo}</Text>
        <Text style={styles.itemDescricao}>{descricao}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  raiz: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  fundo: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(11,27,68,0.45)",
  },

  gaveta: {
    height: "100%",
    backgroundColor: "#FFFFFF",
  },

  // Cabeçalho
  cabecalho: {
    backgroundColor: "#1D4ED8",
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 20,
  },

  cabecalhoLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },

  aluno: {
    flex: 1,
  },

  marca: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  marcaSelo: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.22)",
  },

  marcaSeloTexto: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "bold",
  },

  marcaNome: {
    flexShrink: 1,
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "bold",
  },

  alunoDados: {
    color: "#DCE6FF",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },

  fechar: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },

  // Conteúdo
  conteudo: {
    flex: 1,
  },

  conteudoInterno: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },

  escola: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    marginBottom: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D3DDF4",
    backgroundColor: "#EEF2FF",
  },

  escolaLogo: {
    color: "#1D4ED8",
    fontSize: 16,
    fontWeight: "bold",
  },

  escolaInfo: {
    flex: 1,
  },

  escolaNome: {
    color: "#1D4ED8",
    fontSize: 13,
    fontWeight: "600",
  },

  escolaTurno: {
    color: "#7486A8",
    fontSize: 12,
    marginTop: 3,
  },

  secaoTitulo: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1.2,
    marginLeft: 4,
    marginBottom: 12,
  },

  // Itens
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    marginBottom: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D5DEF1",
    backgroundColor: "#F4F6FD",
  },

  itemIcone: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8EDFF",
    alignItems: "center",
    justifyContent: "center",
  },

  itemTexto: {
    flex: 1,
  },

  itemTitulo: {
    color: "#0B1B44",
    fontSize: 15,
    fontWeight: "600",
  },

  itemDescricao: {
    color: "#7486A8",
    fontSize: 12,
    marginTop: 3,
  },

  // Rodapé
  rodape: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: "#E3E9F5",
    backgroundColor: "#FFFFFF",
  },

  sair: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FFC4C4",
    backgroundColor: "#FFE3E3",
  },

  sairTexto: {
    color: "#E5252A",
    fontSize: 14,
    fontWeight: "600",
  },

  pressionado: {
    opacity: 0.75,
  },
});
