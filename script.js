async function gerarPDF() {
  const pdf = new window.jspdf.jsPDF();
  const elementoRelatorio = document.getElementById('relatorio');

  // Use html2canvas para converter o HTML para uma imagem
  const canvas = await window.html2canvas(elementoRelatorio);

  // Adicione a imagem convertida ao PDF
  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 15, 15);

  // Salve o PDF
  pdf.save('relatorio.pdf');
}

function formatarData(inputValue) {
    inputValue = inputValue.replace(/\D/g, ''); // Remove caracteres não numéricos
  
    if (inputValue.length > 2) {
      inputValue = inputValue.replace(/(\d{2})(\d)/, "$1/$2");
    }
    if (inputValue.length > 4) {
      inputValue = inputValue.replace(/(\d{2})(\d)/, "$1/$2");
    }
  
    // Limita o comprimento total a 10 caracteres
    return inputValue.slice(0, 10);
}

function formatarDinheiro(input) {
    // Remove caracteres não numéricos
    let value = input.value.replace(/\D/g, '');

    // Formata como dinheiro (R$)
    value = (parseFloat(value) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // Atualiza o valor no campo de entrada
    input.value = value;
}
  
document.getElementById('data-inicio').addEventListener('input', function (e) {
    e.target.value = formatarData(e.target.value);
});
  
document.getElementById('validade-contrato').addEventListener('input', function (e) {
    e.target.value = formatarData(e.target.value);
});

function calcularSalarioProporcional(dataInicio, salario, diasNoMes, dataInicioRelatorio) {
    var diaInicio = parseInt(dataInicio.split('/')[0]);
    console.log("Dia de Início:", diaInicio);
    console.log("Dias no Mês:", diasNoMes);
    var salarioProporcional = salario;
  
    var diaInicioRelatorio = dataInicioRelatorio.getDate();
    var mesInicioRelatorio = dataInicioRelatorio.getMonth() + 1;
    var anoInicioRelatorio = dataInicioRelatorio.getFullYear();
    var dataInicioRelatorioFormatada = diaInicioRelatorio.toString().padStart(2, '0') + '/' + mesInicioRelatorio.toString().padStart(2, '0') + '/' + anoInicioRelatorio;

    if (dataInicio === dataInicioRelatorioFormatada) {
        salarioProporcional = (salario / 30) * (diasNoMes - diaInicio + 1);
        console.log("Salário Proporcional:", salarioProporcional);
    }
    
    return salarioProporcional;
}





function gerarRelatorio() {
    var nome = document.getElementById('nome').value;
    var dataInicio = document.getElementById('data-inicio').value;
    var validadeContrato = document.getElementById('validade-contrato').value;
    var salario = parseFloat(document.getElementById('salario').value.replace(/[^\d.-]/g, ''));
    var gerarRelatorio = document.querySelector('.container');
    var btnRelatorios = document.querySelector('.btn-relatorios');

    var dataInicioRelatorio = new Date(parseData(dataInicio));
    var dataFinalRelatorio = new Date(parseData(validadeContrato));

    var relatorioFinal = "<h2>Relatório de Remuneração - " + nome + "</h2>" +
        "<table>" +
        "<tr>" +
        "<th>Data de Pagamento</th>" +
        "<th>Valor Mensal</th>" +
        "</tr>";

    while (dataInicioRelatorio < dataFinalRelatorio) {
        var mesInicio = dataInicioRelatorio.getMonth() + 1; // Mês de início
        var ano = dataInicioRelatorio.getFullYear();
        var diasNoMesInicio = new Date(ano, mesInicio, 0).getDate(); // Dias no mês de início
        var salarioProporcional = calcularSalarioProporcional(dataInicio, salario, diasNoMesInicio);

        // Adiciona um mês para exibir no relatório
        var mesRelatorio = mesInicio + 1;
        var anoRelatorio = ano;
        if (mesRelatorio > 12) {
            mesRelatorio = 1;
            anoRelatorio++;
        }

        relatorioFinal += "<tr>" +
            "<td>20/" + mesRelatorio + "/" + anoRelatorio + "</td>" +
            "<td>" + formatarSalario(salarioProporcional) + "</td>" +
            "</tr>";

        // Avança para o próximo mês de início
        dataInicioRelatorio.setMonth(dataInicioRelatorio.getMonth() + 1);
    }

    relatorioFinal += "</table>" +
        "<p> Favor enviar sua nota fiscal até 5 dias antes do pagamento </p>" +
        "<p> Caso dia 20 caia no final de semana, o pagamento será efetuado no próximo dia útil </p>" +
        "<p> * Valores salariais sujeitos a alterações </p>";

    document.getElementById('relatorio').innerHTML = relatorioFinal;

    // Esconde o formulário de geração de relatório e mostra o botão de voltar
    gerarRelatorio.style.display = "none";
    btnRelatorios.style.display = "block";
}

// Função para obter o número de dias em um determinado mês
function diasNoMes(month, year) {
    return new Date(year, month + 1, 0).getDate();
}

 function formatarSalario(valor) {
    valor = valor * 1000
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }


// Função para analisar a string de data no formato DD/MM/AAAA e retornar um objeto Date
function parseData(dataString) {
    var partes = dataString.split('/');
    return new Date(partes[2], partes[1] - 1, partes[0]);
}

function reiniciarPagina() {
    location.reload();
}
