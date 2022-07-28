
import './teste.css';
import Title from '../../components/Title';
import Header from '../../components/Header';
import firebase from '../../services/firebaseConnection';
import { FiAperture } from 'react-icons/fi';

export default function Teste(){
  return (
    <div>
      <Header/>

      <div className="content">
        <Title name="Teste">
          <FiAperture size={25} />
        </Title>
      </div>
    </div>
  )
}