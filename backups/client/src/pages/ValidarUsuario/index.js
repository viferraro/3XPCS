import React from "react";
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';

//VALIDANDO USUARIO NO BD...
const ValidarUsuario = () => {
    // ! Instanciando o useNavigate para redirecionar o 
    const redirect = useNavigate();

    const vrfUsuario = () => {
        const location = window.location.href;

        // * The current location.
        console.log(location);

        //Transformando localização em url e buscando parametros;
        let url = new URL(location);
        let params = new URLSearchParams(url.search);

        Axios.put("http://localhost:1003/validarusuario-az", {
            emailUsu: params.get('email').toString(),
            urlImgUsu: params.get('foto').toString(),
        }).then(response => {
            console.log(response); //* TESTANDO RESPOSTA!


            switch (response.data) {
                case 1:
                    redirect("/cadastro?email=" + params.get('email').toString()
                        + "&adm=" + 0);
                    break;
                case 2:
                    redirect("/cadastro?email=" + params.get('email').toString()
                        + "&adm=" + 1);
                    break;
                case 3:
                    redirect("/home?email=" + params.get('email').toString()
                        + "&adm=" + 0);
                    break;
                case 4:
                    redirect("/home?email=" + params.get('email').toString()
                        + "&adm=" + 1);
                    break;
                default:
                    //REDIRECIONAR PRA PAGINA DE SEM ACESSO!
                    redirect("/?email=" + params.get('email').toString()
                        + "&adm=" + 0);
                    break;
            }


        });
    };

    vrfUsuario();

    return (
        <div id="vrfLogin">
            Validando informações do usuário
        </div>
    );

}

export default ValidarUsuario;