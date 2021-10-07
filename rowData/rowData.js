const rawData = require("./rowData.json")
const rawData2008 = rawData.filter(it => it.year === 2008)

const rowData = rawData2008.map(function (it) {
  return {
    athlete: it.athlete,
    age: it.age,
    country: it.country,
    sport: it.sport,
    gold: it.gold,
    silver: it.silver,
    bronze: it.bronze,
  };
})

module.exports = rowData
