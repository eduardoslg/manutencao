
import './maintenance.css';

import { useState, useEffect } from 'react';
import firebase from '../../services/firebaseConnection';

import Header from '../../components/Header';
import Title from '../../components/Title';
import Modal from '../../components/Modal';
import ModalConfirm from '../../components/ModalConfirm';

import {
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';

import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi';
import { AiOutlineDelete } from 'react-icons/ai';

import { Link } from 'react-router-dom';
import { format } from 'date-fns';


export default function Teste(){
  const [customers, setCustomers] = useState([]);
  const [customerSelected, setCustomerSelected] = useState(0);

  const [notes, setNotes] = useState([]);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [detail, setDetail] = useState();

 
  
  useEffect(()=> {
    async function loadCustomers(){
      await firebase.firestore().collection('customers')
      .get()
      .then((snapshot)=>{
        const lista = [];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            nomeFantasia: doc.data().nomeFantasia
          })
        })

        if(lista.length === 0){
          console.log('NENHUMA EMPRESA ENCONTRADA');
          setCustomers([ { id: '1', nomeFantasia: 'FREELA' } ]);
          return;
        }

        setCustomers(lista);


      })
      .catch((error)=>{
        console.log('DEU ALGUM ERRO!', error);
        setCustomers([ { id: '1', nomeFantasia: '' } ]);
      })

    }

    loadCustomers();

  }, []);

  useEffect(()=> {

    async function loadNotes(){

      const listRef = firebase.firestore().collection('notes').where("clienteId", "==", customers[customerSelected].id)

      await listRef
      .get()
      .then((snapshot) => {
        updateState(snapshot)
      })
      .catch((err)=>{
        console.log('Deu algum erro: ', err);
      })
  
    }

    loadNotes();

  }, [customerSelected, customers]);

  async function updateState(snapshot){
      const lista = [];

      snapshot.forEach((doc)=>{
        lista.push({
          id: doc.id,
          assunto: doc.data().assunto,
          descricao: doc.data().descricao,
          cliente: doc.data().cliente,
          clienteId: doc.data().clienteId,
          created: doc.data().created,
          createdFormated: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
          status: doc.data().status,
          usuario: doc.data().userName
        })
      })
      setNotes(lista);
  }

  const togglePostModal = (item) => {
    setShowPostModal(!showPostModal) //trocando de true pra false
    setDetail(item);
  }

  const togglePostModalConfirm = (item) => {
    setShowModal(!showModal) //trocando de true pra false
    setDetail(item);
  }
  
  //Chamado quando troca de cliente
  const handleChangeCustomers = (e) => {
    //console.log('INDEX DO CLIENTE SELECIONADO: ', e.target.value);
    //console.log('Cliente selecionado ', customers[customerSelected].id)
    setCustomerSelected(e.target.value);
  }


  return(
    <div>
      <Header/>

      <div className="content">
        <Title name="Informações">
          <FiMessageSquare size={25} />
        </Title>

        <label className="label">Cliente:</label>

          <select className="selectCliente" value={customerSelected} onChange={handleChangeCustomers} >
            {customers.map((item, index) => {
              return(
                  <option key={item.id} value={index} >
                    {item.nomeFantasia}
                  </option>
              )
            })}
          </select>

        

        {notes.length === 0 ? (
          <div className="container dashboard">
            <span>Nenhuma observação registrada...</span>

            <Link to="/new" className="new">
              <FiPlus size={25} color="#FFF" />
              Nova Observação
            </Link>
          </div>
        )  : (
          <>
            <Link to="/new" className="new">
              <FiPlus size={20} color="#FFF" />
              Nova Observação
            </Link>

            <div className="div-accordion">
            {notes.map((item, index)=>{
                  return(
                    <Accordion marginBottom={2} key={index} defaultIndex={[0]} allowMultiple>
                      <AccordionItem>
                        <Box display='flex'>
                          <AccordionButton _hover={false} className="AccordionButton">
                            <AccordionIcon />

                            <Box display='flex' flex="1" textAlign='left'>
                              {`# ${index + 1}`}
                              <span className="span-info"> {item.assunto}</span>
                            </Box>

                            <span className="span-data">
                                  {item.createdFormated}
                            </span>
                          </AccordionButton>
                          
                          <div className="div-buttons">
                                <Link className="action" style={{backgroundColor: '#F6a935' }} to={`/new/${item.id}`} >
                                  <FiEdit2 color="#FFF" size={17} />
                                </Link>

                                <button className="action" style={{backgroundColor: '#3583f6' }} onClick={ () => togglePostModal(item) }>
                                  <FiSearch color="#FFF" size={17} />
                                </button>

                                <button className="action" style={{backgroundColor: '	#FF0000' }} onClick={ () => togglePostModalConfirm(item) }>
                                  <AiOutlineDelete color="#FFF" size={17} />
                                </button>
                          </div>
                        </Box>
                        <AccordionPanel pb={4}>
                          {item.descricao}
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

      {showModal && (
        <ModalConfirm
          item={detail}
          close={togglePostModalConfirm}
        />
      )}

    </div>
  )
}