const SALARIO_MINIMO = 1412;

const IMPOSTO_RENDA = [
    { minino: 0, alicota: 0 },
    { minino: 2112, alicota: 7.5 },
    { minino: 2826.67, alicota: 15 },
    { minino: 3751.07, alicota: 22.5 },
    { minino: 4664.68, alicota: 27.5 }
];

function formatNumber(number, decimals = 2, decPoint = ',', thousandsSep = '.') {
    const parts = number.toFixed(decimals).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);
    return parts.join(decPoint);
}


window.onload = () => {
    console.log("Iniciando....")

    let spnSalarioMinimo = document.getElementById('spnSalarioMinimo');
    let ultimoSalario = localStorage.getItem("ultimoSalario");
    console.log("Ultimo salario", ultimoSalario);
    if (ultimoSalario) {
        ultimoSalario = parseInt(ultimoSalario);
        if (ultimoSalario < SALARIO_MINIMO) {
            ultimoSalario = 0;
        }
    }
    spnSalarioMinimo.textContent = formatNumber(SALARIO_MINIMO);

    let spnQtdSalarioMinimos = document.getElementById('spnQtdSalarioMinimos');
    let spnSalarioAnual = document.getElementById('spnSalarioAnual');
    let txtCltSalario = document.getElementById("txtCltSalario");
    let spnDecimoTerceiro = document.getElementById('spnDecimoTerceiro');
    let spnBonusFerias = document.getElementById('spnBonusFerias');

    let spnIRFaixa = document.getElementById('spnIRFaixa');
    let spnIRDesconto = document.getElementById('spnIRDesconto');
    let spnIRSalarioLiquido = document.getElementById('spnIRSalarioLiquido');
    let spnIRSalarioLiquidoAnual = document.getElementById('spnIRSalarioLiquidoAnual');

    function atualizaSalarioAnual() {
        let salario = parseInt(txtCltSalario.value);
        localStorage.setItem("ultimoSalario", salario);

        spnQtdSalarioMinimos.textContent = formatNumber(salario / SALARIO_MINIMO);
        let adicionalFerias = (30 * salario) / 100;
        let salarioAnual = (13 * salario) + adicionalFerias;
        spnDecimoTerceiro.textContent = formatNumber(salario);
        spnBonusFerias.textContent = formatNumber(adicionalFerias);
        spnSalarioAnual.textContent = formatNumber(salarioAnual);

        let alicota = IMPOSTO_RENDA.filter(a => a.minino < salario).pop();
        spnIRFaixa.textContent = IMPOSTO_RENDA.indexOf(alicota);
        spnIRDesconto.textContent = formatNumber((salario * alicota.alicota) / 100);
        spnIRSalarioLiquido.textContent = formatNumber(salario - ((salario * alicota.alicota) / 100));
        spnIRSalarioLiquidoAnual.textContent = formatNumber(salarioAnual - ((salarioAnual * alicota.alicota) / 100));
        console.log(alicota);
    }

    txtCltSalario.min = SALARIO_MINIMO;
    txtCltSalario.value = ultimoSalario || SALARIO_MINIMO;
    txtCltSalario.addEventListener("input", e => {
        atualizaSalarioAnual();
    });
    txtCltSalario.addEventListener("blur", e => {
        atualizaSalarioAnual();
    });
    txtCltSalario.addEventListener("change", e => {
        atualizaSalarioAnual();
    });
    atualizaSalarioAnual();
}