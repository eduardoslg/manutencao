
import './modal.css';

import { FiX, FiEdit2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function Modal({conteudo, close}){
  
  return(
    <div className="modal">
      <div className="container">

        <div className="containerButtons">
          <button className="close" onClick={ close }>
            <FiX size={23} color="#FFF" />
            Voltar
          </button>

          <Link className="actionModal" style={{backgroundColor: '#F6a935' }} to={`/new/${conteudo.id}`} >
            <FiEdit2 color="#FFF" size={17} />
            Editar
          </Link>
        </div>

        <div>
          <h2>Detalhes do chamado</h2>

          <div className="row">
            <span>
              Cliente: <i>{conteudo.cliente}</i>
            </span>
          </div>

          <div className="row">
            <span>
              Cadastrado em: <i>{conteudo.createdFormated}</i>
            </span>
          </div>

          <div className="row">
            <span>
              Usuário: <i>{conteudo.usuario}</i>
            </span>
          </div>


          {conteudo.descricao !== '' && (
            <>
              <h3 className="descricao">Descrição</h3>
              <p>
                {conteudo.descricao}
              </p>
            </>
          )}

        </div>
      </div>
    </div>
  )
}