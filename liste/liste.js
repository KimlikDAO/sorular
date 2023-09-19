import jsonrpc from "../lib/api/jsonrpc";
import evm from "../lib/ethereum/evm";

/**
 * TCKT kontratının adresi. Bütün blockzincirlerde aynı adres geçerli.
 *
 * @const {string}
 * @noinline
 */
const TCKT_ADDR = "0xcCc0a9b023177549fcf26c947edb5bfD9B230cCc";

/** @const {!Object<string, string>} */
const NodeURLleri = {
  "0xa86a": "https://api.avax.network/ext/bc/C/rpc",
  "0x1": "https://cloudflare-eth.com",
  "0x89": "https://polygon-rpc.com",
  "0xa4b1": "https://arb1.arbitrum.io/rpc",
  "0x38": "https://bsc.publicnode.com",
  "0xfa": "https://rpc.ftm.tools",
};

/**
 * @param {string} ağ TCKT'nin sorgulanacağı ağ kodu
 * @param {string} adres TCKT sahibinin adresi
 */
const tekAdresinTCKTsiniYaz = (ağ, adres) => jsonrpc
  .call(NodeURLleri[ağ], "eth_call", [
    /** @type {!eth.Transaction} */ ({
      to: TCKT_ADDR,
      data: "0xc50a1514" + evm.address(adres),
    }), "latest"
  ])
  .then(
    (handle) => console.log(handle),
    (err) => console.error(err)
  );

/**
 * @param {string} ağ TCKTnin sorgulanacağı ağ kodu
 * @param {!Array<string>} adresler TCKT sahiplerinin adresleri
 */
const ikiAdresinTCKTsiniYaz = (ağ, adresler) => jsonrpc
  .callMulti(NodeURLleri[ağ], "eth_call", [
    [/** @type {!eth.Transaction} */({
      to: TCKT_ADDR,
      data: "0xc50a1514" + evm.address(adresler[0])
    }), "latest"],
    [/** @type {!eth.Transaction} */({
      to: TCKT_ADDR,
      data: "0xc50a1514" + evm.address(adresler[1])
    }), "latest"]
  ])
  .then(
    (/** @type {!Array<string>} */ handles) => console.log(handles),
    (err) => console.error(err)
  );

tekAdresinTCKTsiniYaz("0xa86a", "0x9697bde39a925ee3feb7a1d6230b00fbed99fd31");
ikiAdresinTCKTsiniYaz("0x38", [
  "0x026Aaa49B4200CD5a8227649BE52d91280cDF526",
  "0x5304eA777B594AFEa13717cf625E96263Cb86066"
]);
