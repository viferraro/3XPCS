import React from "react";
import mainLogo from './logo.png';
import './stylesLogin.css';

const LoginPage = () =>{
    return (
        <div id="login">
            <div className="LoginPage-header">
                <s className="img-logo">
                <a href="#">
                    <img src={mainLogo} class="image-fluid"/>
                </a>
                </s>
                <div className="app-name">
                <h1>Gestão de Projetos</h1>
                </div>
            </div>

            <a href={"http://localhost:1989/auth/google"}>
            <button className="btnGoogle">
                Logar com Google
            </button>
            </a>
        </div>
      );
}

export default LoginPage;