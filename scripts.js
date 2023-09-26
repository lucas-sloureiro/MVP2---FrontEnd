/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = 'http://127.0.0.1:5000/docs';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.docs.forEach(doc => insertList(doc.doc_num, doc.descricao, doc.moeda_ori, doc.valor_ori, doc.taxa, doc.valor_brl, doc.id ))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para obter a taxa em uma API externa
  --------------------------------------------------------------------------------------
*/
var resultUSD = 0
var resultGBP = 0
var resultEUR = 0
var taxa = 0

const getRate = async () => {
   
  let urlUSD = 'https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_Ae2r3i5KHIMJ60edGDfuR83R0bpikwp3fUpxZw5Y&currencies=BRL&base_currency=USD';
    fetch(urlUSD, {
      method: 'get',
      
    })
      .then((response) => response.json())
      
      .then((data) => {
        resultUSD = data.data.BRL
      })
      

      .catch((error) => {
        console.error('Error:', error);
      });
  
  
  let urlEUR = 'https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_Ae2r3i5KHIMJ60edGDfuR83R0bpikwp3fUpxZw5Y&currencies=BRL&base_currency=EUR';
    fetch(urlEUR, {
      method: 'get',
        
      })
      .then((response) => response.json())
        
      .then((data) => {
        resultEUR = data.data.BRL
        })
        
  
      .catch((error) => {
        console.error('Error:', error);
        });
    
  
  
  let urlGBP = 'https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_Ae2r3i5KHIMJ60edGDfuR83R0bpikwp3fUpxZw5Y&currencies=BRL&base_currency=GBP';
     fetch(urlGBP, {
       method: 'get',
          
        })
      .then((response) => response.json())
          
      .then((data) => {
       resultGBP = data.data.BRL
          })
          
    
      .catch((error) => {
       console.error('Error:', error);
          });
      
  
  
}

 /*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getList()
getRate ()

/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (inputDoc_num, inputDescricao, inputMoeda_ori, inputValor_ori, inputTaxa, inputValor_brl) => {
  const formData = new FormData();
  formData.append('doc_num', inputDoc_num);
  formData.append('descricao', inputDescricao);
  formData.append('moeda_ori', inputMoeda_ori);
  formData.append('valor_ori', inputValor_ori);
  formData.append('taxa', inputTaxa);
  formData.append('valor_brl', inputValor_brl);

  let url = 'http://127.0.0.1:5000/doc';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}



/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
}


/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const idItem = div.getElementsByTagName('td')[6].innerHTML
      if (confirm("Você tem certeza?")) {
        div.remove()
        deleteItem(idItem)
        alert("Removido!")
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:5000/doc?id=' + item;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  -------------------------------------------------------------------------------------------------------
  Função para adicionar um novo item com doc_num, time do doc_num, time adversario, valor_ori e min 
  -------------------------------------------------------------------------------------------------------
*/
const newItem = () => {
  let inputDoc_num = document.getElementById("newDoc_num").value;
  let inputDescricao = document.getElementById("newDescricao").value;
  let inputMoeda_ori = document.getElementById("newMoeda_ori").value;
  let inputValor_ori = document.getElementById("newValor_ori").value;
  debugger;
  
  if (inputMoeda_ori ==='') {
    alert('A moeda Original deve ser preenchida');
  } else if (inputMoeda_ori === 'USD') {
    inputTaxa = resultUSD.toFixed(2);
  } else if (inputMoeda_ori === 'EUR') {
    inputTaxa = resultEUR.toFixed(2);
  } else if (inputMoeda_ori === 'GBP') {
    inputTaxa = resultGBP.toFixed(2);
  } 

  let BrlValue = inputTaxa * inputValor_ori;
  let inputValor_brl = BrlValue.toFixed(2)
  

  if (inputMoeda_ori === '') {
    alert("Preencha um valor de Origem");
  } else if (isNaN(inputValor_ori) || isNaN(inputTaxa)) {
    alert("Valor_ori precisam ser números!");
  }   
  { 
    insertList(inputDoc_num, inputDescricao, inputMoeda_ori, inputValor_ori, inputTaxa, inputValor_brl)
    postItem(inputDoc_num, inputDescricao, inputMoeda_ori, inputValor_ori, inputTaxa, inputValor_brl)
    
    alert("Item adicionado!")
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (id,doc_num, descricao, moeda_ori, valor_ori, taxa, valor_brl) => {
  var item = [id,doc_num, descricao, moeda_ori, valor_ori,taxa, valor_brl]
  var table = document.getElementById('myTable');
  var row = table.insertRow();
  row.className = "tabody"

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  insertButton(row.insertCell(-1));
  
  document.getElementById("newDoc_num").value = "";
  document.getElementById("newDescricao").value = "";
  document.getElementById("newMoeda_ori").value = "";
  document.getElementById("newValor_ori").value = "";


  removeElement()
}

