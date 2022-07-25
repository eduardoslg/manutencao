import { useContext } from "react";
import { AuthContext } from '../../contexts/auth';

import Header from '../../components/Header';

export default function Dashboard(){
  // eslint-disable-next-line no-unused-vars
  const { signOut } = useContext(AuthContext)

  return (
    <div>
      <Header/>
      <h1>Página Dashboard</h1>
    </div>
  )
}