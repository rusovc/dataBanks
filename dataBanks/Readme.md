# dataBanks

# Парсинг данных банков с сайта Банка России 

**Перед запуском выполнить `npm install`**
**Для запуска с выводом (10 банков по умолчанию) можно использовать `npm run test`**
**Либо подключать файл dataBanks.js через import (использует синтаксис ES6)**

В эти данные входят:

1. БИК; 
2. Имя; 
3. Аккаунт.

Если у конкретного банка нет аккаунта, то в результируюший массив его включать не надо.
Могут быть банки с не сколькими аккаунтами, поэтому corrAccount - эото массив ([...]) и может иметь несколько элементов 

## Пример входных и выходных данных: 
 
- данные на входе (формат XML)

``
<BICDirectoryEntry BIC="041280103">
<ParticipantInfo NameP="УФК по Астраханской области" CntrCd="RU" Rgn="12" Ind="414056" Tnp="г" Nnp="Астрахань" Adr="ул Латышева, 6 Г" DateIn="2010-06-08" PtType="52" Srvcs="3" XchType="1" UID="1280002005" ParticipantStatus="PSAC"/>
<Accounts Account="40116810100000010010" RegulationAccountType="TRSA" CK="99" AccountCBRBIC="041280002" DateIn="2013-01-09" AccountStatus="ACAC"/>
<Accounts Account="40116810400000010011" RegulationAccountType="TRSA" CK="99" AccountCBRBIC="041280002" DateIn="2013-01-09" AccountStatus="ACAC"/>
<Accounts Account="40116810700000010012" RegulationAccountType="TRSA" CK="99" AccountCBRBIC="041280002" DateIn="2013-01-09" AccountStatus="ACAC"/>
<Accounts Account="40116810000000010013" RegulationAccountType="TRSA" CK="99" AccountCBRBIC="041280002" DateIn="2013-01-09" AccountStatus="ACAC"/>
<Accounts Account="40116810300000010014" RegulationAccountType="TRSA" CK="99" AccountCBRBIC="041280002" DateIn="2013-01-09" AccountStatus="ACAC"/>
<Accounts Account="40116810600000010015" RegulationAccountType="TRSA" CK="99" AccountCBRBIC="041280002" DateIn="2013-01-09" AccountStatus="ACAC"/>
</BICDirectoryEntry>
<BICDirectoryEntry BIC="044525597">
``

********************
- Данные на выходе (JS массив с хэшами):

``
{
  bik: '041280103',
  name: 'УФК по Астраханской области',
  corAccount: [
    '40116810100000010010',
    '40116810400000010011',
    '40116810700000010012',
    '40116810000000010013',
    '40116810300000010014',
    '40116810600000010015'
  ]
}
``

********************

_Явлется тестовым заданием для устройство на работу и распротраняется по лицензии "CC BY-NC 4.0"_
