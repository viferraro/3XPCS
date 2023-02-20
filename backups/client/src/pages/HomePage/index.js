import React from "react";
import mainLogo from './logo.png';
import './stylesHome.css';

const HomePage = () =>{
    return (
    <div className="Home">
        {
        }

            <div className="container-header img-logo">
            <a href="#">
                    <img src={mainLogo} alt="Logo 3X"/>
                </a>
            </div>
            <div className="container-header app-name">  
                <h1>Gestão de Projetos</h1>
            </div>
            <div className="container-header profile-picture">
                <a href="#">
                    <img src={mainLogo} alt="Foto de perfil do usuário"/>
                </a>
            </div>

            <div className="lateral">
                <ul className="nav flex-column">
                    <li className="nav-item">
                    <a className="nav-link" aria-current="page" href="#">Home</a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link active" href="#">Time</a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link" href="#">Projetos</a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link" href="#">Tarefas</a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link" href="#">Usuários</a>
                    </li>
                </ul>
            </div>

            <div className="principal">
                <div className="cards times">
                    <h3>Times</h3>
                    <h4>Você está em <b>3 times</b>.</h4>
                </div>
                <div className="cards projetos">
                    <h3>Projetos{"\n"}</h3>
                    <h4>Você está em <b>2 projetos</b>.</h4>
                </div>
                <div className="cards tarefas">
                    <h3>Tarefas{"\n"}</h3>
                    <h4>
                        <ul>
                            <li>13 tarefas pendentes.</li>
                            <li>3 tarefas vencendo hoje.</li>
                            <li>3 tarefas vencendo essa semana.</li>
                        </ul>
                    </h4>
                </div>
            </div>

            
        </div>

  );    
}

export default HomePage;