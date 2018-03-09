const YahooLeague = require('../leagues/yahoo');
const ctmlLeague = new YahooLeague('chickentendermelt');

(async() => {
  try {
    let leagueInfo = await ctmlLeague.getLeagueInfo();
    console.log(leagueInfo);
  } catch(eligibilityImportError) {
    console.error(eligibilityImportError);
  } finally { await ctmlLeague.dispose(); }
})();