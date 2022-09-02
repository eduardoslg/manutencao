
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

import {
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';


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

        <label className="labelCliente">Cliente:</label>

          <select className="selectCliente" value={customerSelected} onChange={handleChangeCustomers} >
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

            <div className="div-accordion">
            {chamados.map((item, index)=>{
                  return(
                    <Accordion className="Accordion" key={index} defaultIndex={[0]} allowMultiple>
                      <AccordionItem className="AccordionItem">
                        <h2 className="h2teste">
                          <AccordionButton className="AccordionButton">
                            <AccordionIcon />
                            <Box className="AccordionBox" flex='1' textAlign='left'>
                              {`# ${index + 1}`}

                              <div className="divInfo">
                                <span className="spanInfo">Assunto: {item.assunto}</span>
                                <span className="spanInfo">{item.createdFormated}</span>
                                <span className="spanInfo">Usuário: {item.usuario}</span>
                              </div>  
                            </Box>
                          </AccordionButton>
                          
                          <div className="testeAction">
                                <Link className="action" style={{backgroundColor: '#F6a935' }} to={`/new/${item.id}`} >
                                  <FiEdit2 color="#FFF" size={17} />
                                </Link>

                                <button className="action" style={{backgroundColor: '#3583f6' }} onClick={ () => togglePostModal(item) }>
                                  <FiSearch color="#FFF" size={17} />
                                </button>
                          </div>
                        </h2>
                        <AccordionPanel pb={4}>
                          {item.complemento}
                        </AccordionPanel>
                      </AccordionItem>
                    </Accordion>
                  )
                })}
            </div>

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