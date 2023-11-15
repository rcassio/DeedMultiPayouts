const DeedMultiPayouts = artifacts.require("DeedMultiPayouts");

contract('deedMultiPayouts', (accounts) => {
  let deedMultiPayouts = null;
  before(async () => {
    deedMultiPayouts = await DeedMultiPayouts.deployed();
  });

  it('Should withdraw for all payouts (1)', async () => {
    for(let i=0; i < 4; i++) {
      setTimeout(async () => {
        const balanceBefore = web3.utils.toBN(await web3.eth.getBalance(accounts[1]));
        await deedMultiPayouts.withdraw({from: accounts[0]});
        const balanceAfter = web3.utils.toBN(await web3.eth.getBalance(accounts[1]));
        assert(balanceAfter.sub(balanceBefore).toNumber() === 25);
      }, "1000");
    }
  });

  it('Should withdraw for all payouts (2)', async () => {
    const deedMultiPayouts = await DeedMultiPayouts.new(accounts[0], accounts[1], 1, {value: 100});
    for(let i=0; i < 2; i++) {
      setTimeout(async () => {
        const balanceBefore = web3.utils.toBN(await web3.eth.getBalance(accounts[1]));
        await deedMultiPayouts.withdraw({from: accounts[0]});
        const balanceAfter = web3.utils.toBN(await web3.eth.getBalance(accounts[1]));
        assert(balanceAfter.sub(balanceBefore).toNumber() === 50);
      }, "1000");
    }
  });

  it('Should withdraw', function () {
    setTimeout(async () => {
      const initialBalance = web3.utils.toBN(await web3.eth.getBalance(accounts[1]));
      await deedMultiPayouts.withdraw({from: accounts[0]});
      const finalBalance = web3.utils.toBN(await web3.eth.getBalance(accounts[1]));
      assert(finalBalance.sub(initialBalance).toNumber() === 100);
      }, "1000");
  });

  it('Should NOT withdraw if too early', async () => {
    const deedMultiPayouts = await DeedMultiPayouts.new(accounts[0], accounts[1], 1, {value: 100});
    setTimeout(async () => {
        try {
        await deedMultiPayouts.withdraw({from: accounts[0]});
      } catch (e) {
        assert(e.message.includes('Too early'));
        return;
      }
      assert(false);
    }, "1000");
});

  it('Should NOT withdraw if caller is not beneficiary', async () => {
    const deedMultiPayouts = await DeedMultiPayouts.new(accounts[0], accounts[1], 1, {value: 100});
    setTimeout(async () => {
      try {
        await deedMultiPayouts.withdraw({from: accounts[5]});
      } catch (e) {
        assert(e.message.includes('Lawyer only'));
        return;
      }
      assert(false);
    }, "1000");
  });
});
