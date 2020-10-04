const TokenFarm = artifacts.require('TokenFarm')
const DaiToken = artifacts.require('DaiToken')
const KrellKoin = artifacts.require('KrellKoin')
module.exports = async function(deployer, network, accounts) {
	//deploy dai token
	await deployer.deploy(DaiToken)
	const daiToken = await DaiToken.deployed()
	//deploy krell koin
	await deployer.deploy(KrellKoin)
	const krellKoin = await KrellKoin.deployed()
	//deploy token farm
	await deployer.deploy(TokenFarm, krellKoin.address, daiToken.address)
	const tokenFarm = await TokenFarm.deployed()
	//transfer all krell koins to token farm (1 mil)
	await krellKoin.transfer(tokenFarm.address, '100000000000000000000000') 
	//transfer 100 dai to investor
	await daiToken.transfer(accounts[1], '100000000000000000000')

}
