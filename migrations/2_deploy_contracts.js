const TokenFarm = artifacts.require('TokenFarm')
const DaiToken = artifacts.require('DaiToken')
const DappToken = artifacts.require('DappToken')
module.exports = async function(deployer, network, accounts) {
	//deploy dai token
	await deployer.deploy(DaiToken)
	const daiToken = await DaiToken.deployed()
	//deploy dapp token
	await deployer.deploy(DappToken)
	const dappToken = await DappToken.deployed()
	//deploy token farm
	await deployer.deploy(TokenFarm, dappToken.address, dappToken.address)
	const tokenFarm = await TokenFarm.deployed()
	//transfer all dapp tokens to token farm (1 mil)
	await dappToken.transfer(tokenFarm.address, '100000000000000000000000') 
	//transfer 100 dai to investor
	await daiToken.transfer(accounts[1], '100000000000000000000')

}
