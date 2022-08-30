
import './teste.css';
import { useState, useEffect, useContext } from 'react';

import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

import { AuthContext } from '../../contexts/auth';

import firebase from '../../services/firebaseConnection';
import Modal from '../../components/Modal';


export default function Teste(){

  const { user } = useContext(AuthContext);


  const [loadCustomers, setLoadCustomers] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [customerSelected, setCustomerSelected] = useState(0);

  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [lastDocs, setLastDocs] = useState();

  const [showPostModal, setShowPostModal] = useState(false);
  const [detail, setDetail] = useState();

 
  
  useEffect(()=> {
    async function loadCustomers(){
      await firebase.firestore().collection('customers')
      .get()
      .then((snapshot)=>{
        let lista = [];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            nomeFantasia: doc.data().nomeFantasia
          })
        })

        if(lista.length === 0){
          console.log('NENHUMA EMPRESA ENCONTRADA');
          setCustomers([ { id: '1', nomeFantasia: 'FREELA' } ]);
          setLoadCustomers(false);
          return;
        }

        setCustomers(lista);
        setLoadCustomers(false);


      })
      .catch((error)=>{
        console.log('DEU ALGUM ERRO!', error);
        setLoadCustomers(false);
        setCustomers([ { id: '1', nomeFantasia: '' } ]);
      })

    }

    loadCustomers();

  }, []);

  useEffect(()=> {

    async function loadChamados(){

      let listRef = firebase.firestore().collection('chamados').where("clienteId", "==", customers[customerSelected].id)

      await listRef
      .get()
      .then((snapshot) => {
        updateState(snapshot)
        console.log(listRef)
      })
      .catch((err)=>{
        console.log('Deu algum erro: ', err);
        setLoadingMore(false);
      })
  
      setLoading(false);
  
    }

    loadChamados();

    return () => {

    }
  }, [customerSelected, customers]);

  async function updateState(snapshot){
    const isCollectionEmpty = snapshot.size === 0;

    if(!isCollectionEmpty){
      let lista = [];

      snapshot.forEach((doc)=>{
        lista.push({
          id: doc.id,
          assunto: doc.data().assunto,
          cliente: doc.data().cliente,
          clienteId: doc.data().clienteId,
          created: doc.data().created,
          createdFormated: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
          status: doc.data().status,
          complemento: doc.data().complemento,
          usuario: doc.data().userName
        })
      })

      setChamados(lista)
      console.log(lista)
    }else{
      setIsEmpty(true);
    }

    setLoadingMore(false);

  }



  function togglePostModal(item){
    setShowPostModal(!showPostModal) //trocando de true pra false
    setDetail(item);
  }
  
  //Chamado quando troca de cliente
  function handleChangeCustomers(e){
    //console.log('INDEX DO CLIENTE SELECIONADO: ', e.target.value);
    console.log('Cliente selecionado ', customers[customerSelected].id)
    setCustomerSelected(e.target.value);
  }


  return(
    <div>
      <Header/>

      <div className="content">
        <Title name="Informações">
          <FiMessageSquare size={25} />
        </Title>

        <label>Cliente</label>


            <select value={customerSelected} onChange={handleChangeCustomers} >
            {customers.map((item, index) => {
              return(
                <option key={item.id} value={index} >
                  {item.nomeFantasia}
                </option>
              )
            })}
          </select>

        

        {chamados.length === 0 ? (
          <div className="container dashboard">
            <span>Nenhum chamado registrado...</span>

            <Link to="/new" className="new">
              <FiPlus size={25} color="#FFF" />
              Novo chamado
            </Link>
          </div>
        )  : (
          <>
            <Link to="/new" className="new">
              <FiPlus size={20} color="#FFF" />
              Nova Observação
            </Link>

            <table>
              <thead>
                <tr>
                  <th scope="col">Cliente</th>
                  <th scope="col">Cadastrado em</th>
                  <th scope="col">Assunto</th>
                  <th scope="col">Visualizar/Editar</th>
                  <th scope="col">Usuário</th>
                </tr>
              </thead>
              <tbody>
                {chamados.map((item, index)=>{
                  return(
                    <tr key={index}>
                      <td data-label="Cliente">{item.cliente}</td>
                      <td data-label="Cadastrado">{item.createdFormated}</td>
                      <td data-label="Assunto">{item.complemento}</td>
                      
                      <td data-label="Visualizar/Editar">
                        <button className="action" style={{backgroundColor: '#3583f6' }} onClick={ () => togglePostModal(item) }>
                          <FiSearch color="#FFF" size={17} />
                        </button>
                        <Link className="action" style={{backgroundColor: '#F6a935' }} to={`/new/${item.id}`} >
                          <FiEdit2 color="#FFF" size={17} />
                        </Link>
                      </td>
                      <td data-label="Usuário">{item.usuario}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            

          </>
        )}

      </div>

      {showPostModal && (
        <Modal
          conteudo={detail}
          close={togglePostModal}
        />
      )}

    </div>
  )
}
