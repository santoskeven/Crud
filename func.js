const AbrirModal = () => document.getElementById('modal').classList.add('ModalActive');
const FecharModal = () => {
    LimparCampos();
     document.getElementById('modal').classList.remove('ModalActive');
}

//PARA ABRIR/FECHAR A CAIXA DE CONFIRMAÇÃO PARA DELETAR UM SÓ CLIENTE (A FUNÇÃO NÃO ESTÃ FUNCIONANDO)
// const AbrirConfirm = () => {
//     const dbclient = PegarDadosLocais();
//         if(dbclient.length <= 0){
//             alert('não há usuários para deletar!!!')
//             return false
//         }else{
//             document.getElementById('msg_confirm').innerHTML ='Deseja realmente apagar todos os usuários?'
//             document.getElementById('confirm').classList.add(' ')
//         }
// }

// const FecharConfirm = () => {
//     document.getElementById('confirm').classList.remove('ConfirmAtivo')
// }

const LimparCampos = () => {
    const campos = document.getElementsByClassName('modal-field');
    for(let i=0; i < campos.length; i++){
        campos[i].value = '';
    };
    document.getElementById('nome').dataset.index = 'new';
}

document.getElementById('FecharModal').addEventListener('click', FecharModal);
document.getElementById('cancelar').addEventListener('click', FecharModal);

document.getElementById('CadastrarCliente').addEventListener('click', AbrirModal);

// 

const PegarDadosLocais =  () => JSON.parse(localStorage.getItem('db_client')) ?? [];
const AdicionarDadosLocal = (dbclient) => localStorage.setItem("db_client", JSON.stringify(dbclient));

// CRIAR UM USUÁRIO
const CriarCliente = (cliente) => {
     const dbclient = PegarDadosLocais();
     dbclient.push(cliente);
     AdicionarDadosLocal(dbclient)
}

// ATUALIZAR UM USUÁRIO
const AtualizarCliente = (index, client) => {
    const dbclient = readclient();
    dbclient[index] = client;
    AdicionarDadosLocal(dbclient);
}

const readclient = () => PegarDadosLocais();

const DeletarCliente = (index) => {
   const dbclient = readclient();
   dbclient.splice(index, 1)
   AdicionarDadosLocal(dbclient)
}

//LIMPAR TABELA
const LimparTabela = () => {
    const linhas = document.querySelectorAll('#tableClient>tbody tr')
    linhas.forEach(linha => linha.parentNode.removeChild(linha));
}

const NumeroClientes = () => {
    const dbclient = PegarDadosLocais();
    let NumeroCliente = document.getElementsByClassName('NumeroClientes')
    NumeroCliente[0].innerHTML = `${dbclient.length} usuário(s)`
}


//ATUALIZAR TABELA
const AtualizarTabela = () => {
    const dbclient = readclient();
    LimparTabela();
    dbclient.forEach(CriarLinha) 
    NumeroClientes()
    VerificarTr()
}

//VALIDAÇÃO DE CAMPOS 
const validacaocampos = () => {
    return (document.getElementById('form'))?.reportValidity()
}

//SALVAR CLIENTE CASO PASSE PELA VALIDAÇÃO
const salvarusuario = () => {
    if(validacaocampos()){  
       
        const cliente = {
            nome: (document.getElementById('nome')).value,
            email: (document.getElementById('email')).value,
            celular: (document.getElementById('celular')).value,
            cidade: (document.getElementById('cidade')).value
        }

        const index = document.getElementById('nome').dataset.index;
        if(index == 'new'){
            CriarCliente(cliente);
            AtualizarTabela();
            FecharModal()
        }else{
            AtualizarCliente(index, cliente);
            AtualizarTabela();
            FecharModal();
          
        }
    }
}

//CRIAR LINHAS DE CADA USUÁRIO
let CriarLinha =  (cliente, index) => {
   
    let NovaLinha = document.createElement('tr');

    NovaLinha.innerHTML = `
    <div class="Wmarc"><p>${cliente.nome}</p></div>
    <div class="Wmarc"><p>${cliente.email}</p></div>
    <div class="Wmarc"><p>${cliente.celular}</p></div>
    <div class="Wmarc"><p>${cliente.cidade}</p></div>
    <div class="Wmarc">
        <button style="margin-right: 5px;" type="button class="button action btn" id="edit-${index}"><img class="ImBt" src="img/edit.svg" style="width: 15px; margin-right: 5px">Modificar</button>
        <button style="margin-left: 5px"type="button class="button action btn" id="delete-${index}"><img class="ImBt" src="img/trash.svg" style="width: 13px; margin-right: 5px;">Excluir</button>
    </div>
    `
    document.querySelector('#tableClient>tbody')?.appendChild(NovaLinha)

}

//ADICIONAR VALORES DOS CAMPOS
const PreencherLinhas = (cliente) => {
    nome: (document.getElementById('nome')).value = cliente.nome;
    email: (document.getElementById('email')).value = cliente.email;
    celular: (document.getElementById('celular')).value = cliente.celular;
    cidade: (document.getElementById('cidade')).value = cliente.cidade;
    document.getElementById('nome').dataset.index = cliente.index
}

//EDITAR CLIENTE
const EditarCliente = (index) => {
    const cliente = readclient()[index];
    cliente.index = index;
    PreencherLinhas(cliente);
    AbrirModal()
}

//DELETAR SOMENTE UM 
const DeleteAlvo = (event) => {

    if(event.target.nodeName == 'BUTTON'){
        const [action, index] = event.target.id.split('-')

        if(action == 'edit'){
            EditarCliente(index)
        }else{
            const Cliente = readclient()[index]
            const response = confirm(`Realmente deseja excluir o cliente?`)

            if(response){
                DeletarCliente(index)
                AtualizarTabela()
            }
        }
    }

}

//EXCLUIR TUDO
const DeletarTudo = () => {
    const Deletar = PegarDadosLocais()
    const math = Deletar.length
    Deletar.splice(0, math)
    AdicionarDadosLocal(Deletar)
    AtualizarTabela()   
    FecharConfirm()
}

// document.getElementById('AborteBtn').addEventListener('click', FecharConfirm)



document.getElementById('DeletarTudo')?.addEventListener('click', DeletarTudo);
document.querySelector('#tableClient>tbody')?.addEventListener('click', DeleteAlvo)
document.getElementById('salvar').addEventListener('click', salvarusuario)

const LinkAtivo = () => {
    const Link = document.getElementsByClassName('links')

    for(let i=0; i < Link.length; i++){
        Link[i].addEventListener('click', () => {
            
            function LinkAtual () {
                if(Link[i].classList.contains('ativa')){
                   return true
                }else{
                    Link[0].classList.remove('ativa')
                    Link[1].classList.remove('ativa')
                    Link[2].classList.remove('ativa')

                    Link[i].classList.add('ativa')
                }
            }  

            LinkAtual()

        })
    }
}

LinkAtivo()

// PARA O LAYOUT DO GRID DE AMOSTRA DE CONTEÚDO DAS INFORMAÇÕES 

const VerificarTr = () => {

    let contemClasse = document.getElementById('tbdoy').classList.contains('tbodyGrid')

    console.log(contemClasse)
   
    if(contemClasse == true){
        let tr = document.querySelectorAll('tr')
        for(let i = 0; i < tr.length; i++){tr[i].classList.add('TrColumn3')}
    }else{
        return false;
    }

}

let SetLayout = document.getElementsByClassName('grid-cover')
let LayoutConfirm = false;

const Layout3 = () => {

    document.getElementById('tbdoy').classList.add('tbodyGrid')

    let wmarc = document.getElementsByClassName('Wmarc')
    for(let i = 0; i < wmarc.length; i++){wmarc[i].style.whiteSpace =  "nowrap";}

    let tr = document.querySelectorAll('tr')
    for(let i = 0; i < tr.length; i++){tr[i].classList.add('TrColumn3')}
}

const SetPadrãoLayout = () => {
    document.getElementById('tbdoy').classList.remove('tbodyGrid')

    let wmarc = document.getElementsByClassName('Wmarc')
    for(let i = 0; i < wmarc.length; i++){wmarc[i].style.whiteSpace =  "";}

    let tr = document.querySelectorAll('tr')
    for(let i = 0; i < tr.length; i++){tr[i].classList.remove('TrColumn3')}

}

SetLayout[0].addEventListener('click', () => {
    const alvo = document.querySelectorAll('#tableClient>tbody tr')
    if(alvo.length > 0){
        Layout3()
    }else{
        alert('não há elementos para mudar o Layout')
    }
})

SetLayout[1].addEventListener('click', () => {
    const alvo = document.querySelectorAll('#tableClient>tbody tr')
    if(alvo.length > 0){
        SetPadrãoLayout()
    }else{
        alert('não há elementos para mudar o Layout')
    }
})

AtualizarTabela()