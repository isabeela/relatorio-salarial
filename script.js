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
  
  function gerarRelatorio() {
    // Obtenha os valores do formulário
    var nome = document.getElementById('nome').value;
    var dataInicio = parseData(document.getElementById('data-inicio').value);
    var validadeContrato = parseData(document.getElementById('validade-contrato').value);
    var salario = parseFloat(document.getElementById('salario').value.replace(/[^\d.-]/g, ''));
    var gerarRelatorio = document.querySelector('.container');
    var btnRelatorios = document.querySelector('.btn-relatorios');
   
    // Array para armazenar os relatórios mensais
    var relatoriosMensais = [];

    // Loop entre a data de início e a validade do contrato
    var currentDate = new Date(dataInicio);

    // Garante que o loop seja executado até o mês de validade do contrato
    while (currentDate <= validadeContrato || (currentDate.getFullYear() === validadeContrato.getFullYear() && currentDate.getMonth() === validadeContrato.getMonth())) {
        var diasTrabalhados = calcularDiasTrabalhados(currentDate, dataInicio, validadeContrato);
        var salarioMensal = (salario / 30) * diasTrabalhados;

        var mes = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Garante que o mês tenha dois dígitos
        

        var relatorioMensal = {
            mesAno: mes + '/' + currentDate.getFullYear(),
            salarioMensal: salarioMensal,
        };

        relatoriosMensais.push(relatorioMensal);

        // Avance para o próximo mês
        currentDate.setMonth(currentDate.getMonth() + 1);
    }

    // Construa o relatório mensal
    var relatorioFinal = "<h2>Relatório de Remuneração  - " + "  " + nome; + "</h2>" + "<br>" + "Data de Pagamento" +  "_____________________" + "Valor Mensal"
    for (var i = 0; i < relatoriosMensais.length; i++) {
        relatorioFinal += "<p><strong>" +  "20"  + '/' + relatoriosMensais[i].mesAno + "</strong>" +  "_____________________" + formatarSalario(parseFloat(relatoriosMensais[i].salarioMensal)) + "</p>";
    }
    relatorioFinal += "<p> Favor enviar sua nota fiscal até 5 dias antes do pagamento </p>"
    relatorioFinal += "<p> * Valores salariais sujeitos a alterações </p>"


    // Exiba o relatório na div de relatório
    document.getElementById('relatorio').innerHTML = relatorioFinal;

    gerarRelatorio.style.display = "none"
    btnRelatorios.style.display = "block"
}

  // Função para calcular os dias trabalhados proporcionalmente para o primeiro e último mês
  function calcularDiasTrabalhados(currentDate, dataInicio, validadeContrato) {
      var diasNoMesAtual = diasNoMes(currentDate.getMonth(), currentDate.getFullYear());
      var diasNoMesAtual = 30;
  
      if (currentDate.getMonth() === dataInicio.getMonth() && currentDate.getFullYear() === dataInicio.getFullYear()) {
        var diasNoPrimeiroMes = diasNoMesAtual - (dataInicio.getDate());
        return diasNoPrimeiroMes
      } else if (currentDate.getMonth() === validadeContrato.getMonth() && currentDate.getFullYear() === validadeContrato.getFullYear()) {
          var diasUltimoMes = diasNoMesAtual - (diasNoMesAtual - (validadeContrato.getDate()))
          return diasUltimoMes;
      } else {
          return diasNoMesAtual;
      }
  }
  
  // Função para obter o número de dias em um determinado mês
  function diasNoMes(month, year) {
      return new Date(year, month + 1, 0).getDate();
  }
  
  // Função para formatar o salário
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
