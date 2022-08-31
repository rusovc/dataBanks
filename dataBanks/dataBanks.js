import AdmZip from 'adm-zip';
import fetch from 'node-fetch';
import iconv from 'iconv-lite';

const CBR_URL = 'https://www.cbr.ru/s/newbik';

class MuchRequestOnSite extends Error {
  constructor() {
    super("Код 403, видимо слишком много запросов с вашего IP. Запустите dataBanksFromLocalFile для проверки с локальным файлом");
    this.name = "MuchRequestOnSite";
  };
};

export default class DataBanks {
  // Основной метод для взятия данных с сайта (https://www.cbr.ru/s/newbik)
  get() {
    return fetch(CBR_URL)
          .then(res => {
            if (res.status === 403) throw new MuchRequestOnSite
            return res.arrayBuffer()
          })
          .then(zipFile => {
              const dataFromZip = this.#toBuffer(zipFile)
              const xmlData = this.#getXMLDataFromZip(dataFromZip);
              const arrayOfDataBanks = this.#parseEntriesOfBanks(xmlData);
              return arrayOfDataBanks;
          });
  };

  // Когда тестил из-за большого количество словил 403 (forbiden)
  // При первых запусках основного метод такого быть не должно 
  // Но также можно запустить эту функицию передав ей путь до локального файла 
  // Дабы дополнительно протестировать код
  getFromLocalFile(pathZipLocalFile = "20220830ED01OSBR.zip") {
    const xmlData = this.#getXMLDataFromZip(pathZipLocalFile);
    const dataBanks = this.#parseEntriesOfBanks(xmlData);
    return dataBanks;
  };

  // **********
  // Вспомогательные методы (приватные)
  // **********

  // Переводит ArrayBuffer в Buffer - обычный буфер евляется устаревшим
  #toBuffer(arrayBuffer) {
    const buffer = Buffer.alloc(arrayBuffer.byteLength);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i];
    };
    return buffer;
  };

  // Парсит zip архив в этой логике допускается только один вложенный внутри архива файл (как и ожидается) 
  // в ином случае можно просто пройтись forEach'ем
  // На выходе отдаёт xml верстку в обычной JS-строке (на выходе тип String)
  #getXMLDataFromZip(zipData) {
    const zip = new AdmZip(zipData);
    const entries = zip.getEntries();
    const fileWithdata = entries[0].getData();
    const decodedXMLData = iconv.decode(fileWithdata, 'win1251');
    return decodedXMLData;
  };

  // Парсит строку и отдаёт массив с хэшами вида: [{bic: '11111', name: 'Банк "имя банка" ', corrAccount: "321321"}, ...]
  // Так как указано в описании тестового задания 
  // + меняет в имени банка [&quot] на ["] (думаю для значений в базе это будет лучше)
  #parseEntriesOfBanks (stringOfXML) {
    let banksData = [];
    let i = 1;
    const entriesMatch = stringOfXML.split("BICDirectoryEntry");
    while (i < entriesMatch.length) {
      const entry = entriesMatch[i];
      let accounts = [...entry.matchAll(/Account="(\d+)/gi)];

      if (accounts !== []) {
        accounts = accounts.map(account => account[1]);

        let bikAndName = [...entry.matchAll(/BIC="(\d+).+NameP="([^"]+)/gi)];
        const bik = bikAndName[0][1];
        const nameP = bikAndName[0][2].replaceAll('&quot;', '"');
        banksData.push({ "bic": bik, "name": nameP.replaceAll('&quot;', '"'), "corrAccount": accounts });
      };
      i += 2;
    };
    return banksData;
  };
};
