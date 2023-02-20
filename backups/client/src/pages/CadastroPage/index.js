import React from "react";
import './stylesCadastro.css'
import mainLogo from '../HomePage/logo.png'

const CadastroPage = () => {
    return(
        <div className="Cadastro">
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

            <div className="container-formulario">
                <div className="form">
                    <div className="perfil">
                        <img alt="Foto perfil"/>
                        <p>Nome</p>
                    </div>
                    <form>
                        <label>
                            E-mail 
                            <input type="email" name="email"></input>
                        </label>
                        <label>
                            Função 
                            <input type="text" name="funcao"></input>
                        </label>
                        <label>
                            CEP
                            <input type="number" name="cep"></input>
                        </label>
                        <label>
                            Endereço 
                            <input type="text" name="endereco"></input>
                        </label>
                        <label>
                            Nº
                            <input type="number" className="numero" ></input>
                        </label>
                        <label>
                            Complemento 
                            <input type="text" className="complemento"></input>
                        </label>
                        <label>
                            Cidade 
                            <input type="text" className="cidade"></input>
                        </label>
                        <label>
                            Estado
                            <input type="text"  className="estado"></input>
                        </label>
                        <label>
                            LinkedIn
                            <input type="url" name="linkedin"></input>
                        </label>
                        <label>
                            Github 
                            <input type="url" name="github"></input>
                        </label>                        
                    </form>

                    <input type="button" name="concluir" label="Concluir cadastro"></input>
                </div>                
            </div>
        </div>
    )
}

export default CadastroPage;