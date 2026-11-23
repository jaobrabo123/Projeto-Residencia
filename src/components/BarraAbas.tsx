import { router, type Href } from "expo-router";
import { BookOpen, Clock, FileText, House, Menu } from "lucide-react-native";
import type { ComponentType } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type IdAba = "inicio" | "horarios" | "boletim" | "servicos" | "menu";

type Icone = ComponentType<{
  size?: number;
  color?: string;
  strokeWidth?: number;
}>;

type Aba = {
  id: IdAba;
  rotulo: string;
  icone: Icone;
  // Sem rota: a seção ainda não existe e o toque mostra "Em breve".
  rota?: Href;
  // Abas principais trocam de tela (replace); o menu abre por cima (push).
  empilhar?: boolean;
};

const ABAS: Aba[] = [
  { id: "inicio", rotulo: "Início", icone: House, rota: "/inicio" },
  { id: "horarios", rotulo: "Horários", icone: Clock, rota: "/horarios" },
  { id: "boletim", rotulo: "Boletim", icone: BookOpen, rota: "/boletim" },
  { id: "servicos", rotulo: "Serviços", icone: FileText, rota: "/servicos" },
  {
    id: "menu",
    rotulo: "Menu",
    icone: Menu,
    rota: "/MenuLateral",
    empilhar: true,
  },
];

function aoPressionar(aba: Aba, ativa: boolean) {
  if (ativa) return;

  if (!aba.rota) {
    Alert.alert("Em breve", `A seção "${aba.rotulo}" ainda não está disponível.`);
    return;
  }

  if (aba.empilhar) router.push(aba.rota);
  else router.replace(aba.rota);
}

// Barra inferior compartilhada pelas telas principais (Início, Horários,
// Serviços). `corAtiva` permite que cada tela mantenha a cor do seu cabeçalho.
export default function BarraAbas({
  ativa,
  corAtiva = "#1D4ED8",
  fundoAtivo = "#E3EBFF",
}: {
  ativa: IdAba;
  corAtiva?: string;
  fundoAtivo?: string;
}) {
  return (
    <SafeAreaView edges={["bottom", "left", "right"]} style={styles.barra}>
      <View style={styles.linha}>
        {ABAS.map((aba) => {
          const selecionada = aba.id === ativa;
          const IconeAba = aba.icone;

          return (
            <Pressable
              key={aba.id}
              style={styles.aba}
              accessibilityRole="tab"
              accessibilityLabel={aba.rotulo}
              accessibilityState={{ selected: selecionada }}
              onPress={() => aoPressionar(aba, selecionada)}
            >
              <View
                style={[
                  styles.icone,
                  selecionada && { backgroundColor: fundoAtivo },
                ]}
              >
                <IconeAba
                  size={20}
                  color={selecionada ? corAtiva : "#6B7A99"}
                />
              </View>
              <Text
                style={[styles.rotulo, selecionada && { color: corAtiva }]}
              >
                {aba.rotulo}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  barra: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E3E9F5",
  },

  linha: {
    flexDirection: "row",
    paddingTop: 8,
    paddingBottom: 6,
    paddingHorizontal: 8,
  },

  aba: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    minHeight: 48,
  },

  icone: {
    width: 44,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  rotulo: {
    color: "#6B7A99",
    fontSize: 10,
    fontWeight: "600",
  },
});
