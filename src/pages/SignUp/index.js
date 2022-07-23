
import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth'


import './signup.css';
import logo from '../../assets/atm.png';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function SignUp() {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ nome, setNome ] = useState('');

  const { signUp } = useContext(AuthContext);

  function handleSubmit(e){
    e.preventDefault();

    if(nome !== '' && email !== '' && password !== ''){
      signUp(email, password, nome);
      toast.success("Conta criada com sucesso!")
    }
  }

  return (
    <div className="container-center">
      <div className="login">
        <div className="login-area">
          <img src={logo} alt="Logo ATM" />
        </div>

        <form onSubmit={handleSubmit}>
          <h1>Cadastrar uma conta</h1>
          <input type="text" placeholder="seu nome" value={nome} onChange={ (e) => setNome(e.target.value)} />
          <input type="text" placeholder="email@email.com" value={email} onChange={ (e) => setEmail(e.target.value) }/>
          <input type="password" placeholder="*******" value={password} onChange={ (e) => setPassword(e.target.value) } />
          <button type="submit">Cadastrar</button>
        </form>  

        <Link to="/">Já tem uma conta? Entre</Link>
      </div>
    </div>
  );
}

export default SignUp;
