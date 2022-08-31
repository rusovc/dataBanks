import DataBanks from "./dataBanks.js";

const MAX_ELEMENTS = 10; // максимальное количество выводимых элементов

const dataBanks = new DataBanks;

(async function main(){
  const output = await dataBanks.get();
  // const output = await dataBanks.getFromLocalFile();
  for (let i = 0; i < output.length && i < MAX_ELEMENTS; i++) {
    console.log(output[i])
  };
})()
