export enum StocksCodesEnum {
  META = "META",
  APPL = "APPL",
  TSLA = "TSLA",
}

export class Stocks {
  constructor(
    public code: StocksCodesEnum,
    public currentPrice: number,
  ) {}
}

export class StocksAvailable {
  constructor(public data: Record<StocksCodesEnum, Stocks>) {}
}

export class Portfolio {
  constructor(private stockAvailable: StocksAvailable) {}

  // Setear <stock, cantidad_stock>
  setStockCurrents(data: Partial<Record<StocksCodesEnum, number>>) {
    this.stocksCurrents = data;
  }

  // Stocks que tiene actualmente y su cantidad <stock, cantidad>
  stocksCurrents: Partial<Record<StocksCodesEnum, number>> = {};

  // El porcentaje portfolio que deberia de tener. ojo que se refiere al valor monetario total (quantity * price)
  // <stock code , porcentaje que deberia tener> //los porcentajes a teber debe sumar 100 %
  StocksAllocated: Partial<Record<StocksCodesEnum, number>> = {};

  //<stock, porcentaje_del_portafolio>
  setStockAllocated(data: Partial<Record<StocksCodesEnum, number>>) {
    this.StocksAllocated = data;
  }

  calculateAmountTotal(): number {
    return Object.entries(this.stocksCurrents).reduce(
      (prev, [stockCode, quantity]) =>
        prev +
        quantity *
          this.stockAvailable.data[stockCode as StocksCodesEnum].currentPrice,
      0,
    );
  }

  calculatePercentPerStockOfTotal(
    amountTotal: number,
  ): Record<StocksCodesEnum, { percent: string; amount: number }> {
    return Object.entries(this.stocksCurrents).reduce(
      (prev, [stockCode, quantity]) => {
        const stockAmount =
          this.stockAvailable.data[stockCode as StocksCodesEnum].currentPrice *
          quantity;
        prev[stockCode as StocksCodesEnum] = {
          percent: ((stockAmount / amountTotal) * 100).toFixed(2),
          amount: stockAmount,
        };
        return prev;
      },
      {} as Record<StocksCodesEnum, { percent: string; amount: number }>,
    );
  }

  rebalanceo() {
    // Valor monetario total del portafolio
    const amountTotal = this.calculateAmountTotal();
    console.log("**********");
    console.log("Monto total Portafolio actual: ", amountTotal);
    console.log("Porcentaje total: 100%");
    console.log("**************");

    // Porcentaje del portafolio por stock code
    const stocksWithPercentageCurrent =
      this.calculatePercentPerStockOfTotal(amountTotal);
    console.log(stocksWithPercentageCurrent);

    // Cantidad de acciones que debe comprar o vender para llegar al porcentaje
    const result = {
      BUY: {} as Record<StocksCodesEnum, number>,
      SELL: {} as Record<StocksCodesEnum, number>,
    };

    Object.entries(this.StocksAllocated).forEach(
      ([stockCodeAllocated, percentAllocated]) => {
        const amountToMustHave = (percentAllocated / 100) * amountTotal;
        const stock =
          this.stockAvailable.data[stockCodeAllocated as StocksCodesEnum];

        if (!(stockCodeAllocated in this.stocksCurrents)) {
          // Si no tiene debe comprar todo el porcentaje
          const quantityToBuy = Number(
            (amountToMustHave / stock.currentPrice).toFixed(1),
          );
          if (quantityToBuy > 0)
            result.BUY[stockCodeAllocated as StocksCodesEnum] = quantityToBuy;
        } else {
          // El stock requerido si lo tiene, evalua si tiene menos o más
          const amountCurrent =
            this.stocksCurrents[stockCodeAllocated as StocksCodesEnum]! *
            stock.currentPrice;
          if (amountCurrent > amountToMustHave) {
            // si tiene mas => vende
            const quantityToSell = Number(
              ((amountCurrent - amountToMustHave) / stock.currentPrice).toFixed(
                1,
              ),
            );
            if (quantityToSell > 0)
              result.SELL[stockCodeAllocated as StocksCodesEnum] =
                quantityToSell;
          } else if (amountCurrent < amountToMustHave) {
            const quantityToBuy = Number(
              ((amountToMustHave - amountCurrent) / stock.currentPrice).toFixed(
                1,
              ),
            );
            if (quantityToBuy > 0)
              result.BUY[stockCodeAllocated as StocksCodesEnum] = quantityToBuy;
          }
        }
      },
    );

    Object.keys(this.stocksCurrents).forEach((stockCurrentCode) => {
      // Calculo de los que tiene pero debe vender
      if (
        !Object.keys(this.StocksAllocated).includes(
          stockCurrentCode as StocksCodesEnum,
        )
      ) {
        result.SELL[stockCurrentCode as StocksCodesEnum] =
          this.stocksCurrents[stockCurrentCode as StocksCodesEnum]!;
      }
    });

    console.log(
      "************ resultado cantidades a comprar o vender ********",
    );
    console.log(result);
    return result;
  }
}

/*
let stocksAvailables = new StocksAvailable({
  [StocksCodesEnum.META]: new Stocks(StocksCodesEnum.META, 10),
  [StocksCodesEnum.APPL]: new Stocks(StocksCodesEnum.APPL, 20),
  [StocksCodesEnum.TSLA]: new Stocks(StocksCodesEnum.TSLA, 30),
});

const myPortfolio = new Portfolio(stocksAvailables);
   myPortfolio.setStockCurrents({
      META: 10,
      APPL: 10,
    });
    myPortfolio.setStockAllocated({
      META: 50,
      APPL: 50,
    });
myPortfolio.rebalanceo();
*/
