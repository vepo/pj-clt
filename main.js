const SALARIO_MINIMO = 1412;

const IMPOSTO_RENDA_CLT = [
    { minino: 0, alicota: 0 },
    { minino: 2112, alicota: 7.5 },
    { minino: 2826.67, alicota: 15 },
    { minino: 3751.07, alicota: 22.5 },
    { minino: 4664.68, alicota: 27.5 }
];

const IMPOSTO_RENDA_PJ = [
    { minino: 0, alicota: 15 },
    { minino: 20000, alicota: 25 }
];

function formatNumber(number, decimals = 2, decPoint = ',', thousandsSep = '.') {
    const parts = number.toFixed(decimals).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);
    return parts.join(decPoint);
}

const CLT_SALARIO_CHAVE = "CLT_ULTIMO_SALARIO";
const PJ_SALARIO_CHAVE = "PJ_ULTIMO_SALARIO";

window.onload = () => {
    console.log("Iniciando....")
    let spnSalarioMinimo = document.getElementById('spnSalarioMinimo');
    spnSalarioMinimo.textContent = formatNumber(SALARIO_MINIMO);
    {
        // CLT
        let cltUltimoSalario = localStorage.getItem(CLT_SALARIO_CHAVE);
        console.log("Ultimo salario CLT", cltUltimoSalario);
        if (cltUltimoSalario) {
            cltUltimoSalario = parseInt(cltUltimoSalario);
            if (cltUltimoSalario < SALARIO_MINIMO) {
                cltUltimoSalario = 0;
            }
        }

        let spnCLTQtdSalarioMinimos = document.getElementById('spnCLTQtdSalarioMinimos');
        let spnCLTSalarioAnual = document.getElementById('spnCLTSalarioAnual');
        let txtCLTSalario = document.getElementById("txtCLTSalario");
        let spnCLTDecimoTerceiro = document.getElementById('spnCLTDecimoTerceiro');
        let spnCLTBonusFerias = document.getElementById('spnCLTBonusFerias');

        let spnCLTIRFaixa = document.getElementById('spnCLTIRFaixa');
        let spnCLTIRDesconto = document.getElementById('spnCLTIRDesconto');
        let spnCLTIRSalarioLiquido = document.getElementById('spnCLTIRSalarioLiquido');
        let spnCLTIRSalarioLiquidoAnual = document.getElementById('spnCLTIRSalarioLiquidoAnual');

        function atualizaSalarioAnualCLT() {
            let salario = parseInt(txtCLTSalario.value);
            localStorage.setItem(CLT_SALARIO_CHAVE, salario);

            spnCLTQtdSalarioMinimos.textContent = formatNumber(salario / SALARIO_MINIMO);
            let adicionalFerias = (30 * salario) / 100;
            let salarioAnual = (13 * salario) + adicionalFerias;
            spnCLTDecimoTerceiro.textContent = formatNumber(salario);
            spnCLTBonusFerias.textContent = formatNumber(adicionalFerias);
            spnCLTSalarioAnual.textContent = formatNumber(salarioAnual);

            let alicota = IMPOSTO_RENDA_CLT.filter(a => a.minino < salario).pop();
            spnCLTIRFaixa.textContent = IMPOSTO_RENDA_CLT.indexOf(alicota) + 1;
            spnCLTIRDesconto.textContent = formatNumber((salario * alicota.alicota) / 100);
            spnCLTIRSalarioLiquido.textContent = formatNumber(salario - ((salario * alicota.alicota) / 100));
            spnCLTIRSalarioLiquidoAnual.textContent = formatNumber(salarioAnual - ((salarioAnual * alicota.alicota) / 100));

        }

        txtCLTSalario.min = SALARIO_MINIMO;
        txtCLTSalario.value = cltUltimoSalario || SALARIO_MINIMO;
        txtCLTSalario.addEventListener("input", e => {
            atualizaSalarioAnualCLT();
        });
        txtCLTSalario.addEventListener("blur", e => {
            atualizaSalarioAnualCLT();
        });
        txtCLTSalario.addEventListener("change", e => {
            atualizaSalarioAnualCLT();
        });
        atualizaSalarioAnualCLT();
    }
    {
        // PJ
        let pjUltimoSalario = localStorage.getItem(PJ_SALARIO_CHAVE);
        console.log("Ultimo salario PJ", pjUltimoSalario);
        if (pjUltimoSalario) {
            pjUltimoSalario = parseInt(pjUltimoSalario);
        }
        let txtPJSalario = document.getElementById('txtPJSalario');
        txtPJSalario.value = pjUltimoSalario || SALARIO_MINIMO;

        let spnPJQtdSalarioMinimos = document.getElementById('spnPJQtdSalarioMinimos');
        let spnPJSalarioAnual = document.getElementById('spnPJSalarioAnual');
        let spnPJFerias = document.getElementById('spnPJFerias');
        let spnPJDecimoTerceiro = document.getElementById('spnPJDecimoTerceiro');
        let spnPJSalarioLiquido = document.getElementById('spnPJSalarioLiquido');
        let spnPJIRFaixa = document.getElementById('spnPJIRFaixa');
        let spnPJIRDesconto = document.getElementById('spnPJIRDesconto');
        let spnPJIRRendimentoLiquido = document.getElementById('spnPJIRRendimentoLiquido');
        let spnPJIRRendimentoLiquidoProvisoes = document.getElementById('spnPJIRRendimentoLiquidoProvisoes');
        let spnPJRendimentoLiquidoAnual = document.getElementById('spnPJRendimentoLiquidoAnual');

        function atualizaSalarioAnualPJ() {
            let salario = parseInt(txtPJSalario.value);
            localStorage.setItem(PJ_SALARIO_CHAVE, salario);

            let provisaoFerias = (salario * 1.3) / 11;
            let provisao13Salario = salario / 11;
            let salarioLiquido = salario - provisaoFerias - provisao13Salario;
            let alicota = IMPOSTO_RENDA_PJ.filter(a => a.minino < salario).pop();
            let descontoIR = (salario * alicota.alicota) / 100;

            spnPJQtdSalarioMinimos.textContent = formatNumber(salario / SALARIO_MINIMO)
            spnPJSalarioAnual.textContent = formatNumber(salario * 11);
            spnPJFerias.textContent = formatNumber(provisaoFerias);
            spnPJDecimoTerceiro.textContent = formatNumber(provisao13Salario);
            spnPJSalarioLiquido.textContent = formatNumber(salarioLiquido);
            spnPJIRFaixa.textContent = IMPOSTO_RENDA_PJ.indexOf(alicota) + 1;
            spnPJIRDesconto.textContent = formatNumber(descontoIR);
            spnPJIRRendimentoLiquido.textContent = formatNumber(salario - descontoIR);
            spnPJIRRendimentoLiquidoProvisoes.textContent = formatNumber(salarioLiquido - descontoIR);
            spnPJRendimentoLiquidoAnual.textContent = formatNumber((salarioLiquido - descontoIR) * 11);
        }
        txtPJSalario.addEventListener("input", e => {
            atualizaSalarioAnualPJ();
        });
        txtPJSalario.addEventListener("blur", e => {
            atualizaSalarioAnualPJ();
        });
        txtPJSalario.addEventListener("change", e => {
            atualizaSalarioAnualPJ();
        });
        atualizaSalarioAnualPJ();
    }
}