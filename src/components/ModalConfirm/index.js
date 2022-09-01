
import './modal.css';

import firebase from '../../services/firebaseConnection';
import { toast } from 'react-toastify';

import { Link } from 'react-router-dom';

export default function ModalConfirm({item, close}){

  async function deleteItem(item){
    await firebase.firestore().collection('chamados').doc(item.id).delete().then(() => {
      toast.success("Deletado com sucesso!")})

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