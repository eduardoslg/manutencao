
import './modal.css';

import firebase from '../../services/firebaseConnection';

import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/auth';

import { toast } from 'react-toastify';

export default function ModalConfirm({item, close}){
  const { user } = useContext(AuthContext);
  const userRole = user.role;

  const handleDeleteItem = async () => {
    if(userRole === 'admin'){
      await firebase.firestore().collection('chamados').doc(item.id).delete().then(() => {
        toast.success("Deletado com sucesso!")})
    }else {
      toast.warn("Usuário sem permissão")
    }
  }
  
  return(
    <div className="modalConfirm">
      <div className="containerConfirm">
        <div className="modalContent">
          <h2 className="confirm">Você tem certeza?</h2>

          <div className="divbuttons">
            <button className="confirmButtons" style={{backgroundColor: '#3583f6' }} onClick={ close }>Voltar</button>
            <Link to="/">
            <button  className="confirmButtons" style={{backgroundColor: '#FF0000' }} onClick={ handleDeleteItem }>Deletar</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
