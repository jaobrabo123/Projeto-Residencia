import { Redirect } from "expo-router";

// Ao abrir o aplicativo, a primeira tela é o login.
export default function Index() {
  return <Redirect href="/login" />;
}
