import { Container } from 'react-bootstrap';
import LoginForm from './components/LoginForm'

const App = () => {
  const handleLogin = (username, password) => {
    console.log('Logging in with', username, password);
  }

  return (
    <Container className="mt-10">
      <LoginForm onLogin={handleLogin} />
    </Container>
  )
}

export default App