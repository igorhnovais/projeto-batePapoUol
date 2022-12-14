let arr = [];

let usuarioAtual = prompt('qual o seu nome?');

// -- perguntar o nome do usuario para jogar no servidor

function entrarSala(){
   
    mandarUsuario = {
        name: usuarioAtual
    }

    const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', mandarUsuario);
    promessa.then(mandarNomeServidor);
    promessa.catch(deuErroUsuario);   
}

entrarSala();

function mandarNomeServidor(){
 console.log('deu certo mandar usuario');   
}

function deuErroUsuario(){

    alert('o nome ja existe, escolha outro!');
    window.location.reload();
    console.log("deu erro ao mandar usuario");
}

// -- entrar no servidor com o nome do usuario

// -- agora vamos resgatar as mensagens dos usuarios

function pegarDados(){
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promessa.then(mensagemRecebidas);
    promessa.catch(mensagemNegada);
}

setInterval(pegarDados, 3000); // -- para recarregar o site 


function mensagemRecebidas(resposta){
    //console.log(resposta.data);
    arr = resposta.data;
    renderizarMensagens();
}

function mensagemNegada(){
    console.log('mensagemfudeo');
}

function renderizarMensagens(){
    const ul = document.querySelector('.chat');
    
    ul.innerHTML = '';

    for(let i = 0; i < arr.length; i++){

        if (arr[i].type === "status"){ // entrar na sala
        ul.innerHTML += `
            <li class="mensagem cinza">             
                <spam class="tempo"> <strong> (${arr[i].time}) </strong></spam>
                <spam class="usuario"> ${arr[i].from}  </spam>   
                <spam class="texto"> <strong> ${arr[i].text} </strong> </spam>         
            </li>`
        }

        if(arr[i].type === "message"){ 
            ul.innerHTML += `
            <li class="mensagem">             
                <spam class="tempo"> <strong> (${arr[i].time}) </strong> </spam>
                <spam class="usuario">  ${arr[i].from}  </spam>
                <spam class="destinatario"> <strong> para </strong> ${arr[i].to}: </spam>
                <spam class="texto"> <strong>${arr[i].text} </strong></spam>            
            </li>`
        }

        if(arr[i].type === "private_message"){
            ul.innerHTML += `
            <li class="mensagem rosa">             
                <spam class="tempo"> <strong> (${arr[i].time}) </strong> </spam>
                <spam class="usuario"> ${arr[i].from} ig </spam>
                <spam class="destinatario"> <strong> para </strong> ${arr[i].to}:</spam>
                <spam class="texto"> <strong> ${arr[i].text} </shdgauysgdiastrong></spam>            
            </li>`
        } 
    }    
}

renderizarMensagens();

// -- fun????o para aparecer sempre a ultima mensagem
function scroll(){

    const ultimaMensagem = document.querySelector('.chat li:last-child');
    
    ultimaMensagem.scrollIntoView({behavior:"smooth"});
}
 
setInterval(scroll, 1000);
 
// -- pegamos as mensaagens do servidor

// -- agora vamos mandar as mensagens

function mandarMensagem(){
    const elementotexto = document.querySelector('.texto-escrito');
    
    const novaMensagem = {
        from: usuarioAtual,
        to: "Todos",
        text: elementotexto.value,
        type: "message"
    }

    const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', novaMensagem);
    promessa.then(pegarDados);
    promessa.catch(falhaMensagemEnviada);

    elementotexto.value = '';

    renderizarMensagens();
}

function falhaMensagemEnviada(erro){
    console.log(erro);
    alert('falha ao enviar a mensagem');
    window.location.reload();
}

// -- mandamos as mensagens

// -- agora vamos mostrar pro servidor que ainda continuamos online

function verificarStatus(){

    const aoVivo = {
        name: usuarioAtual
    }
    const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', aoVivo);

    promessa.then(continuaAoVivo);
    console.log(continuaAoVivo);

    promessa.catch(saiServidor);
}

const carregarStatus = setInterval(verificarStatus, 5000);
console.log(carregarStatus);

function continuaAoVivo(){
    console.log('ta atualizando o status');
}
function saiServidor(){
    console.log('n??o ta atualizando o status');
}

// -- ja vericamos o status
// -- enviar a mensagem com a tecla enter

document.addEventListener("keypress", enviaEnter);

function enviaEnter(botao){
    if(botao.key === "Enter"){
        mandarMensagem();
    }
}

