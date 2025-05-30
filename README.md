Construct a simple Portfolio class that has a collection of Stocks. Assume each Stock has a “Current Price” method that receives the last available price. Also, the Portfolio class has a collection of “allocated” Stocks that represents the distribution of the Stocks the Portfolio is aiming (i.e. 40% META, 60% APPL)
Provide a portfolio rebalance method to know which Stocks should be sold and which ones should be bought to have a balanced Portfolio based on the portfolio’s allocation.
Add documentation/comments to understand your thinking process and solution
Important: If you use LLMs that’s ok, but you must share the conversations.


###################### Consideraciones ##########
Se puede comprar fracciones de acciones con decimal de 1 digito.
El balanceo es en base al monto total (cantidad de acciones * precio x accion)

uso de eslint y prettier para calidad de codigo.


Ejecutar codigo de prueba:

npm run test



#Se uso IA para consultar acerca de lo que requeria el enunciado
https://chatgpt.com/share/6837e3f6-81dc-8012-9d9b-7b4cae859d0c