import { ThemeProvider } from './contexts/ThemeContext';
import ShellLayout from './components/shell/ShellLayout';

function App() {
  return (
    <ThemeProvider>
      <ShellLayout />
    </ThemeProvider>
  );
}

export default App;
