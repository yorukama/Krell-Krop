const TokenFarm = artifacts.require('TokenFarm')
module.exports = async function(callback) {
	let tokenFarm = await tokenFarm.deployed()
	await tokenFarm.issueTokens()
	console.log("Tokens issued!")
	callback()
}