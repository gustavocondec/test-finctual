import { describe, expect, test } from "@jest/globals";
import { Portfolio, Stocks, StocksAvailable, StocksCodesEnum } from "./index";

describe("Test Portfolio", () => {
  // Creamos las acciones con sus precios
  let stocksAvailables = new StocksAvailable({
    [StocksCodesEnum.META]: new Stocks(StocksCodesEnum.META, 10),
    [StocksCodesEnum.APPL]: new Stocks(StocksCodesEnum.APPL, 20),
    [StocksCodesEnum.TSLA]: new Stocks(StocksCodesEnum.TSLA, 30),
  });

  test("Rebalanceo cantidad e stocks a monto ", () => {
    // Instanciamos portafolio y le pasamos las acciones disponibles en el mercado
    let myPortfolio = new Portfolio(stocksAvailables);
    // Indicamos que acciones propias poseemos en el mercado y la cantidad
    myPortfolio.setStockCurrents({
      META: 10,
      APPL: 10,
    });
    // Indicamos que acciones deberiamos tener y el porcentaje del protafolio que deberia cubrir
    myPortfolio.setStockAllocated({
      META: 50,
      APPL: 50,
    });
    let result = myPortfolio.rebalanceo();
    expect(result).toEqual({ BUY: { META: 5 }, SELL: { APPL: 2.5 } });
  });

  test("Comprar para un balanceo de monto equitativo", () => {
    // Instanciamos portafolio y le pasamos las acciones disponibles en el mercado
    let myPortfolio = new Portfolio(stocksAvailables);
    // Indicamos que acciones propias poseemos en el mercado y la cantidad
    myPortfolio.setStockCurrents({
      META: 10,
      APPL: 10,
    });
    // Indicamos que acciones deberiamos tener y el porcentaje del protafolio que deberia cubrir
    myPortfolio.setStockAllocated({
      META: 33.3,
      APPL: 33.3,
      TSLA: 33.3,
    });
    let result = myPortfolio.rebalanceo();
    expect(result).toEqual({
      BUY: { TSLA: 3.3 },
      SELL: { APPL: 5 },
    });
  });

  test("Vender para balancear", () => {
    // Instanciamos portafolio y le pasamos las acciones disponibles en el mercado
    let myPortfolio = new Portfolio(stocksAvailables);
    // Indicamos que acciones propias poseemos en el mercado y la cantidad
    myPortfolio.setStockCurrents({
      META: 10,
      APPL: 10,
      TSLA: 10,
    });
    // Indicamos que acciones deberiamos tener y el porcentaje del protafolio que deberia cubrir
    myPortfolio.setStockAllocated({
      META: 50,
      APPL: 50,
    });
    let result = myPortfolio.rebalanceo();
    expect(result).toEqual({
      BUY: { META: 20, APPL: 5 },
      SELL: { TSLA: 10 },
    });
  });
});
