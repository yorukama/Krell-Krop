
const TokenFarm = artifacts.require('TokenFarm')
const DaiToken = artifacts.require('DaiToken')
const KrellKoin = artifacts.require('KrellKoin')

require('chai')
	.use(require('chai-as-promised'))
	.should()

function tokens(n){
	return web3.utils.toWei(n,'ether')
}

contract('TokenFarm', ([owner, investor])=>{
	let daiToken, krellKoin, tokenFarm

	before(async()=>{
		//load contracts
		daiToken = await DaiToken.new()
		krellKoin = await KrellKoin.new()
		tokenFarm = await TokenFarm.new(krellKoin.address, daiToken.address)
		//xfer dap tokens to farm
		await krellKoin.transfer(tokenFarm.address, tokens('1000000'))
		//xfer investor tokens
		await daiToken.transfer(investor, tokens('100'), {from:owner})
	})
	
	describe('Mock Dai deployment', async() =>{
		it('has a name', async() =>{
			const name = await daiToken.name()
			assert.equal(name,'Mock DAI Token')
		})
	})
	describe('Krell Koin deployment', async() =>{
		it('has a name', async() =>{
			const name = await krellKoin.name()
			assert.equal(name,'Krell Koin')
		})
	})
	describe('Token Farm deployment', async() =>{
		it('has a name', async() =>{
			const name = await tokenFarm.name()
			assert.equal(name,'KrellKrop')
		})
		it('contract has tokens', async() =>{
			let balance = await krellKoin.balanceOf(tokenFarm.address)
			assert.equal(balance.toString(), tokens('1000000'))
		})
	})
	describe('Farming tokens', async() =>{
		it('rewards for staking tokens', async() =>{
			let result
			//check investor balance before staking
			result = await daiToken.balanceOf(investor)
			assert.equal(result.toString(), tokens('100'),'investor dai wallet is correct before staking ')
			// stake dai tokens
			await daiToken.approve(tokenFarm.address, tokens('100'), {from:investor})
			await tokenFarm.stakeTokens(tokens('100'), {from:investor})
			//check staking result 
			result = await daiToken.balanceOf(investor)
			assert.equal(result.toString(), tokens('0'),'investor dai balance is correct after staking ')
			result = await daiToken.balanceOf(tokenFarm.address)
			assert.equal(result.toString(), tokens('100'),'token farm balance is correct after staking ')
			//check investor balance
			result = await tokenFarm.isStaking(investor)
			assert.equal(result.toString(), 'true','investor staking staus is correct ')
			//issue tokens
			await tokenFarm.issueTokens({from: owner })
			//check balance 
			result = await krellKoin.balanceOf(investor)
			assert.equal(result.toString(), tokens('100'), 'Investor token waller ballance is correct after being issued')
			//ensure only owner can issue tokens
			await tokenFarm.issueTokens({from: investor}).should.be.rejected
			//unstake tokens
			await tokenFarm.unstakeTokens({from: investor})
			//check results
			result = await daiToken.balanceOf(investor);
			assert.equal(result.toString(), tokens('100'),'investor dai  is correct after staking')
			result = await daiToken.balanceOf(tokenFarm.address)
			assert.equal(result.toString(), tokens('0'),'token farm dai is correct after staking')
			result = await tokenFarm.stakingBalance(investor)
			assert.equal(result.toString(), tokens('0'),'investor staking balance is correct after staking')
			result = await tokenFarm.isStaking(investor)
			assert.equal(result.toString(), 'false','investor staking status is correct after staking')
		})
	})	

})