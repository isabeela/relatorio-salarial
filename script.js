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

function calcularDiasTrabalhados(dataInicio, diasNoMes) {
    var diasTrabalhados = diasNoMes - parseInt(dataInicio.split('/')[0]) + 1;
    return diasTrabalhados;
}

function gerarRelatorio() {
    var nome = document.getElementById('nome').value;
    var dataInicio = document.getElementById('data-inicio').value;
    var validadeContrato = document.getElementById('validade-contrato').value;
    var salario = parseFloat(document.getElementById('salario').value.replace(/[^\d.-]/g, ''));
    var gerarRelatorio = document.querySelector('.container');
    var btnRelatorios = document.querySelector('.btn-relatorios');
    
    // Adicionando um mês para a data de início
    var dataInicioRelatorio = new Date(parseData(dataInicio));
    var dataFinalRelatorio = new Date(parseData(validadeContrato));

    var relatorioFinal = "<h2>Relatório de Remuneração - " + nome + "</h2>" +
        "<table>" +
        "<tr>" +
        "<th>Data de Pagamento</th>" +
        "<th>Valor Mensal</th>" +
        "</tr>";

    while (dataInicioRelatorio <= dataFinalRelatorio) {
        var diasNoMesAtual = diasNoMes(dataInicioRelatorio.getMonth(), dataInicioRelatorio.getFullYear());
        var diasTrabalhados = calcularDiasTrabalhados(formatarData(dataInicio), diasNoMesAtual);
        var salarioMensalProporcional = (salario / diasNoMesAtual) * diasTrabalhados;

        var mes = (dataInicioRelatorio.getMonth() + 1).toString().padStart(2, '0'); // Garante que o mês tenha dois dígitos

        relatorioFinal += "<tr>" +
            "<td>" + "20" + '/' + mes + '/' + dataInicioRelatorio.getFullYear() + "</td>" +
            "<td>" + formatarSalario(salarioMensalProporcional) + "</td>" +
            "</tr>";

        // Avançando para o próximo mês
        dataInicioRelatorio.setMonth(dataInicioRelatorio.getMonth() + 1);
    }

    relatorioFinal += "</table>" +
        "<p> Favor enviar sua nota fiscal até 5 dias antes do pagamento </p>" +
        "<p> Caso dia 20 caia no final de semana, o pagamento será efetuado no próximo dia útil </p>" +
        "<p> * Valores salariais sujeitos a alterações </p>";

    document.getElementById('relatorio').innerHTML = relatorioFinal;

    gerarRelatorio.style.display = "none";
    btnRelatorios.style.display = "block";
}



// Função para obter o número de dias em um determinado mês
function diasNoMes(month, year) {
    return new Date(year, month + 1, 0).getDate();
}

// Função para formatar o salário
function formatarSalario(valor) {
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
