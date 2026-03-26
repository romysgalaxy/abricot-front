import { AuthProvider } from '../context/AuthContext';
import './globals.css';

export const metadata = {
  title: 'Abricot - Gestion de projets',
  description: 'Application de gestion de projets et de tâches collaboratives',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
