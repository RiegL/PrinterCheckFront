import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import axios from "axios";
import { useState, useEffect } from "react";
import dayjs from "dayjs";

// Configurações do gráfico
const chartSetting = {
  margin: { top: 30, right: 30, bottom: 50, left: 120 }, // Margem do gráfico
  width: 900,
  height: 400,
  sx: {
    [`.${axisClasses.right} .${axisClasses.label}`]: {
      transform: "translate(-20px, 0)", // Ajuste da posição do label do eixo Y
    },
  },
};

// Função para formatar os valores no gráfico para o formato de Real (R$)
const valueFormatter = (value) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value / 100); // Dividindo por 100 para converter centavos em reais

// Função para agrupar transações por ano e somar receitas e despesas
const agruparPorAno = (transacoes) => {
  const resumoAnual = {};

  transacoes.forEach((transacao) => {
    const ano = dayjs(transacao.data).year(); // Extrair o ano da transação

    if (!resumoAnual[ano]) {
      // Inicializa o ano no objeto se ainda não existir
      resumoAnual[ano] = { receita: 0, despesa: 0 };
    }

    // Verifica se a transação é uma Receita ou uma Despesa e soma os valores corretamente
    if (transacao.tipo === "Receita") {
      resumoAnual[ano].receita += transacao.valor || 0;
    } else if (transacao.tipo === "Despesa") {
      resumoAnual[ano].despesa += transacao.valor || 0;
    }
  });

  // Converte o objeto em um array de objetos para o gráfico
  return Object.keys(resumoAnual).map((ano) => ({
    ano: ano,
    receita: resumoAnual[ano].receita,
    despesa: resumoAnual[ano].despesa,
  }));
};

// Componente do gráfico
export const Chart = () => {
  const [transacoesChart, setTransacoesChart] = useState([]);
  const [anos, setAnos] = useState([]);

  useEffect(() => {
    const getTransacao = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/transacoes", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const transacoesData = response.data.data;

        // Agrupa as transações por ano e soma receitas e despesas
        const dataset = agruparPorAno(transacoesData);

        setTransacoesChart(dataset); // Atualiza o dataset do gráfico

        // Extrai os anos únicos e ordena
        const anosDisponiveis = [...new Set(dataset.map((transacao) => transacao.ano))]
          .sort((a, b) => a - b);

        setAnos(anosDisponiveis); // Atualiza a lista de anos
      } catch (error) {
        console.error("Erro ao buscar transações", error.message);
      }
    };
    getTransacao();
  }, []);

  return (
    <div>
      {transacoesChart.length > 0 ? (
        <BarChart
          dataset={transacoesChart} // Dados dinâmicos do gráfico
          xAxis={[{ scaleType: "band", dataKey: "ano" }]} // Configuração do eixo X
          series={[
            { dataKey: "receita", label: "Receita", valueFormatter }, // Série para receita
            { dataKey: "despesa", label: "Despesa", valueFormatter }, // Série para despesa
          ]}
          {...chartSetting} // Aplicação das configurações do gráfico
        />
      ) : (
        <p>Carregando dados...</p> // Renderiza algo enquanto os dados estão sendo carregados
      )}
    </div>
  );
};

export default Chart;
