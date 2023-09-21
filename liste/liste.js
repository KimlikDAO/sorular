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
 * @param {!Array<string>} adresler
 * @return {!Object<string, !Array<string>>} her bir adres için o adrese denk
 *     gelen bütün KimlikDAO-IPFS hashleri. Dikkat edersek bir adrese en fazla
 *     6 tane hash denk gelebilir.
 */
const handlelarıBul = async (adresler) => {
  const sonuçlar = {}; // Her ağ için sonuçları saklayacak nesne

  // Her ağı dolaşarak adresleri sorgulandı.
  for (const ağKodu in NodeURLleri) {
    sonuçlar[ağKodu] = []; // Her ağ için sonuçları saklayacak dizi

    // Her adrese yapılan sorgular map kullanılarak bir dizi Promise oluşturuldu.
    const sorgular = adresler.map((adres) =>
      jsonrpc.call(NodeURLleri[ağKodu], "eth_call", [
        {
          to: TCKT_ADDR,
          data: "0xc50a1514" + evm.address(adres),
        },
        "latest",
      ])
    );

    // Bütün sorgular eş zamanlı olarak çalışır.
    await Promise.all(
      sorgular.map(async (sorgu, index) => {
        try {
          const handle = await sorgu;
          sonuçlar[ağKodu][index] = handle;
        } catch (err) {
          console.log(`Hata oluştu: ${err}`);
        }
      })
    );
  }

  return sonuçlar;
};

// Adresleri alıp handleları bulur.
fetch("https://sorular.kimlikdao.org/adresler")
  .then((res) => res.json())
  .then(handlelarıBul)
  .then(console.log)
  .catch((err) => console.error(`Adresleri alırken hata oluştu: ${err}`));
