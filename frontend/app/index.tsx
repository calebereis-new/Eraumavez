import { Redirect } from 'expo-router';

// Sempre passa pelo Splash, que decide o próximo destino (login/perfis/tabs).
export default function Index() {
  return <Redirect href="/splash" />;
}
