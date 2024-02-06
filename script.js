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
    value = (value / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // Atualiza o valor no campo de entrada
    input.value = value;
  }
  
  document.getElementById('data-inicio').addEventListener('input', function (e) {
    e.target.value = formatarData(e.target.value);
  });
  
  document.getElementById('validade-contrato').addEventListener('input', function (e) {
    e.target.value = formatarData(e.target.value);
  });
  
function calcularDiasTrabalhados(currentDate, dataInicio, validadeContrato) {
    var diasNoMesAtual = diasNoMes(currentDate.getMonth(), currentDate.getFullYear());
    var diasNoMesInicio = diasNoMes(dataInicio.getMonth(), dataInicio.getFullYear());

    // Considera todos os dias no mês para o cálculo do primeiro mês
    if (currentDate.getMonth() === dataInicio.getMonth() && currentDate.getFullYear() === dataInicio.getFullYear()) {
        return diasNoMesInicio;
    }

    // Considera todos os dias no mês para o cálculo do último mês
    if (currentDate.getMonth() === validadeContrato.getMonth() && currentDate.getFullYear() === validadeContrato.getFullYear()) {
        return dataInicio.getDate(); // Retorna todos os dias até a validade do contrato
    }

    // Para os meses intermediários, considera o mês completo
    return diasNoMesAtual;
}



function gerarRelatorio() {
    // Obtenha os valores do formulário
    var nome = document.getElementById('nome').value;
    var dataInicio = parseData(document.getElementById('data-inicio').value);
    var validadeContrato = parseData(document.getElementById('validade-contrato').value);
    var salario = parseFloat(document.getElementById('salario').value.replace(/[^\d.-]/g, ''));
    var gerarRelatorio = document.querySelector('.container');
    var btnRelatorios = document.querySelector('.btn-relatorios');

    // Adicione um mês ao mês de início e final
    var dataInicioRelatorio = new Date(dataInicio);
    var dataFinalRelatorio = new Date(validadeContrato);
    // Array para armazenar os relatórios mensais
    var relatoriosMensais = [];

    // Construa o cabeçalho do relatório
    var relatorioFinal = "<h2>Relatório de Remuneração - " + nome + "</h2>" +
        "<table>" +
        "<tr>" +
        "<th>Data de Pagamento</th>" +
        "<th>Valor Mensal</th>" +
        "</tr>";

    // Use uma cópia de dataInicioRelatorio para iteração
    var currentDate = new Date(dataInicioRelatorio);

    // Garante que o loop seja executado até o mês de validade do contrato
    while (currentDate <= dataFinalRelatorio || (currentDate.getFullYear() === dataFinalRelatorio.getFullYear() && currentDate.getMonth() === dataFinalRelatorio.getMonth())) {
        var diasTrabalhados = calcularDiasTrabalhados(new Date(currentDate), dataInicio);
        var diasNoMesAtual = diasNoMes(currentDate.getMonth(), currentDate.getFullYear());
        var salarioMensal = (salario / diasNoMesAtual) * diasTrabalhados;

        var mes = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Garante que o mês tenha dois dígitos

        // Adicione a linha da tabela para cada mês
        relatorioFinal += "<tr>" +
            "<td>" + "20" + '/' + mes + '/' + currentDate.getFullYear() + "</td>" +
            "<td>" + formatarSalario(parseFloat(salarioMensal)) + "</td>" +
            "</tr>";

        // Avance para o próximo mês
        currentDate.setMonth(currentDate.getMonth() + 1);
    }

    relatorioFinal += "</table>" +
        "<p> Favor enviar sua nota fiscal até 5 dias antes do pagamento </p>" +
        "<p> Caso dia 20 caia no final de semana, o pagamento será efetuado no próximo dia útil </p>" +
        "<p> * Valores salariais sujeitos a alterações </p>";

    // Exiba o relatório na div de relatório
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
