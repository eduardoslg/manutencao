import firebase from "./firebaseConnection";
import { useState } from "react";
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

  function App() {

  const [ descricao, setDescricao] = useState('');
  const [ autor, setAutor] = useState('');


  async function handleAdd(){

    if(descricao === '' || autor === ''){
      return toast.warn(`Todos os campos precisam estar preenchidos!!!`)
      
    }

    await firebase.firestore().collection('posts')
    .add({
      descricao: descricao,
      autor: autor
    })
    .then(() =>{
      toast.success('Criado com sucesso!');
      setAutor('');
      setDescricao('');
    })
  }

  return (
    <div className="w-[600px] flex flex-col border m-auto mt-[100px]">

      <div className="flex flex-col">
        <h1 className="font-bold">ATM OUTSOURCING</h1> <br/>

        <label className="border-2 bg-slate-600 text-white">Descrição</label>
        <textarea className="border-2 placeholder-black" typeof="text" value={descricao} placeholder="...escreva uma descrição aqui" onChange={ (e) => setDescricao(e.target.value)}/>

        <label className="border-2 bg-slate-600 text-white">Usuário: </label>
        <input className="border-1" type="text" value={autor} onChange={ (e) => setAutor(e.target.value)} />

        <button className="border-2 bg-slate-300" onClick={ handleAdd }>Postar</button>
      </div>


      <ToastContainer autoClose={3000}/>
    </div>
  );
}

export default App;
