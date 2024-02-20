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

function calcularSalarioProporcional(dataInicio, salario, diasNoMes, primeiraIteracao) {
    var diaInicio = parseInt(dataInicio.split('/')[0]);
    console.log("Dia de Início:", diaInicio);
    console.log("Dias no Mês:", diasNoMes);
    
    if (primeiraIteracao) {
        var salarioProporcional = (salario / 30) * (diasNoMes - diaInicio + 1);
        console.log("Salário Proporcional:", salarioProporcional);
        return salarioProporcional;
    } else {
        console.log("Salário Proporcional:", salario);
        return salario;
    }
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
    var primeiraIteracao = true;
    while (dataInicioRelatorio < dataFinalRelatorio) {
        var mes = dataInicioRelatorio.getMonth() + 1; // Mês atual
        var ano = dataInicioRelatorio.getFullYear();
    
        var diasNoMes = new Date(ano, mes, 0).getDate();
        var salarioProporcional = calcularSalarioProporcional(dataInicio, salario, diasNoMes, primeiraIteracao);
        primeiraIteracao = false;
    
        var mesRelatorio = mes + 1; // Próximo mês para exibição no relatório
        var anoRelatorio = ano;
        if (mesRelatorio > 12) {
            mesRelatorio = 1;
            anoRelatorio++;
        }
    
        relatorioFinal += "<tr>" +
            "<td>20/" + mesRelatorio + "/" + anoRelatorio + "</td>" +
            "<td>" + formatarSalario(salarioProporcional) + "</td>" +
            "</tr>";
    
        // Adiciona um mês para exibir no relatório
        dataInicioRelatorio.setMonth(dataInicioRelatorio.getMonth() + 1);
    }
    
       if (dataInicioRelatorio.getMonth() !== dataFinalRelatorio.getMonth() || dataInicioRelatorio.getFullYear() !== dataFinalRelatorio.getFullYear()) {
        var ultimoMesContrato = dataFinalRelatorio.getMonth() + 1;
        var ultimoAnoContrato = dataFinalRelatorio.getFullYear();
        var ultimoMesRelatorio = ultimoMesContrato + 1; // Próximo mês para exibição no relatório
        var ultimoAnoRelatorio = ultimoAnoContrato;
        if (ultimoMesRelatorio > 12) {
            ultimoMesRelatorio = 1;
            ultimoAnoRelatorio++;
        }
       }
        
        relatorioFinal += "<tr>" +
            "<td>20/" + ultimoMesRelatorio + "/" + ultimoAnoRelatorio + "</td>" +
            "<td>" + formatarSalario(salarioProporcional) + "</td>" +
            "</tr>";

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
