
import { useState, useEffect, useContext } from 'react';

import firebase from '../../services/firebaseConnection';
import { useHistory, useParams } from 'react-router-dom';

import Header from '../../components/Header';
import Title from '../../components/Title';
import { AuthContext } from '../../contexts/auth';
import { toast } from 'react-toastify';

import './new.css';
import { FiPlusCircle } from 'react-icons/fi'

export default function New(){
  const { id } = useParams();
  const history = useHistory();

  const { user } = useContext(AuthContext);
  const userRole = user.role;

  const [loadCustomers, setLoadCustomers] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [customerSelected, setCustomerSelected] = useState(0);

  const [assunto, setAssunto] = useState('');
  const [complemento, setComplemento] = useState('');

  const [idCustomer, setIdCustomer] = useState(false);

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
          setLoadCustomers(false);
          return;
        }

        setCustomers(lista);
        setLoadCustomers(false);

        if(id){
          loadId(lista);
        }

      })
      .catch((error)=>{
        console.log('DEU ALGUM ERRO!', error);
        setLoadCustomers(false);
        setCustomers([ { id: '1', nomeFantasia: '' } ]);
      })

    }

    loadCustomers();

  }, [id]);



  async function loadId(lista){
    await firebase.firestore().collection('chamados').doc(id)
    .get()
    .then((snapshot) => {
      setAssunto(snapshot.data().assunto);
      setComplemento(snapshot.data().complemento)

      const index = lista.findIndex(item => item.id === snapshot.data().clienteId );
      setCustomerSelected(index);
      setIdCustomer(true);

    })
    .catch((err)=>{
      console.log('ERRO NO ID PASSADO: ', err);
      setIdCustomer(false);
    })
  }

  async function handleRegister(e){
    e.preventDefault();

    if(idCustomer && userRole === 'admin' ){
      await firebase.firestore().collection('chamados')
      .doc(id)
      .update({
        cliente: customers[customerSelected].nomeFantasia,
        clienteId: customers[customerSelected].id,
        complemento: complemento,
        userId: user.uid,
        userName: user.nome
      })
      .then(()=>{
        toast.success('Chamado Editado com sucesso!');
        setCustomerSelected(0);
        setComplemento('');
        setAssunto('');
        history.push('/maintenance');
      })
      .catch((err)=>{
        toast.error('Ops erro ao registrar, tente mais tarde.')
        console.log(err);
      })

      return;
    }

    if(assunto === '' || complemento === ''){
      toast.warn("Complete todos os campos!")
      return;
    }

    if(userRole === 'admin'){
      await firebase.firestore().collection('chamados')
      .add({
        created: new Date(),
        cliente: customers[customerSelected].nomeFantasia,
        clienteId: customers[customerSelected].id,
        assunto: assunto,
        complemento: complemento,
        userId: user.uid,
        userName: user.nome
      })
      .then(()=> {
        toast.success('Chamado criado com sucesso!');
        setComplemento('');
        setAssunto('')
        history.push('/maintenance');
        setCustomerSelected(0);
      })
      .catch((err)=> {
        toast.error('Ops erro ao registrar, tente mais tarde.')
        console.log(err);
      })
      }else {
        toast.error("Usuário sem permissão!!");
        return;
      }


  }

  //Chamado quando troca de cliente
  function handleChangeCustomers(e){
    //console.log('INDEX DO CLIENTE SELECIONADO: ', e.target.value);
    //console.log('Cliente selecionado ', customers[e.target.value])
    setCustomerSelected(e.target.value);
  }

  return(
    <div>
      <Header/>

      <div className="content">
        <Title name="Nova Descrição">
          <FiPlusCircle size={25} />
        </Title>



        

        <div className="container">

          <form className="form-profile"  onSubmit={handleRegister} >
            
            <label>Cliente</label>

            {loadCustomers ? (
              <input type="text" disabled={true} value="Carregando clientes..." />
            ) : (
                <select value={customerSelected} onChange={handleChangeCustomers} >
                {customers.map((item, index) => {
                  return(
                    <option key={item.id} value={index} >
                      {item.nomeFantasia}
                    </option>
                  )
                })}
              </select>
            )}

            <label className="label-assunto">Assunto</label>
            <input
            type="text"
            placeholder="Descreva o assunto"
            value={assunto}
            onChange={ (e) => setAssunto(e.target.value)}
            />

            <label className="labelDescricao">Descrição</label>
            <textarea
              type="text"
              placeholder="Descreva a informação aqui"
              value={complemento}
              onChange={ (e) => setComplemento(e.target.value) }
            />
            
            <button type="submit">Registrar</button>

          </form>

        </div>

      </div>
    </div>
  )
}
