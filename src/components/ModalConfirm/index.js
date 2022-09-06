
import './modal.css';

import firebase from '../../services/firebaseConnection';
import { useContext } from 'react';
import { toast } from 'react-toastify';

import { AuthContext } from '../../contexts/auth';
import { Link } from 'react-router-dom';

export default function ModalConfirm({item, close}){
  const { user } = useContext(AuthContext);
  console.log(user);
  console.log(user.role);

  let userRole = user.role;


  async function deleteItem(item){
    
    if(userRole === 'admin'){
      await firebase.firestore().collection('chamados').doc(item.id).delete().then(() => {
        toast.success("Deletado com sucesso!")})
    }else {
      toast.warn("Usuário sem permissão")
      return;
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
            <button  className="confirmButtons" style={{backgroundColor: '#FF0000' }} onClick={ () => deleteItem(item)  }>Deletar</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
