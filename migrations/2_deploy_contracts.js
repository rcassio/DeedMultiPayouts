const DeedMultiPayouts = artifacts.require("DeedMultiPayouts");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(DeedMultiPayouts, accounts[0], accounts[1], 1, {value: 100});
};
