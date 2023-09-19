# Sorular

## Liste

Bu soruda verilen EVM adreslerine ait TCKT’lerin KimlikDAO-IPFS hash'lerini bulan bir araç yazacağız.

Öncelikle bu repoyu şöyle klonlayalım:

```shells
git clone --recursive https://github.com/KimlikDAO/sorular
```

Burada `--recursive` önemli çünkü `lib/` dizinine [`kimlikdao-js`](https://github.com/KimlikDAO/kimlikdao-js) reposunu submodule olarak klonlamak istiyoruz.

KimlikDAO-IPFS hash’lerini bulmak istediğimiz adresleri REST api kullanarak `https://sorular.kimlikdao.org/adresler`'den alacağız.

Denemek için

```shell
# macOS
brew install curl
# Linux
sudo apt install curl

curl https://sorular.kimlikdao.org/adresler
```

yazabiliriz.

Şimdi repo kök dizinine gidelim ve deneme kodunu çalıştıralım:

```shell
cd sorular
node --experimental-specifier-resolution=node liste/liste.js
```

Eğer her şey doğru kurulduysa

```shell
0xa56d70606509f963753cf6079c736def8f26823a2c544fd70eab41faf82d4a25
[
  '0x06552a96e5c5e230ea620dff9a2136d1b11a1cbd841fff80395bbb9db34a8b92',
  '0x643d188c5c6f094c7fef153d8753a89355be4fbdd844852d1e0b7e85d0f8d87f'
]
```

çıktısını görmemiz gerekiyor.

Deneme kod `liste/liste.js` adresi verilen bir TCKT’nin KimlikDAO-IPFS hashini blokzincirden nasıl okuyacağımızı gösteren 2 yordam içeriyor. Bunlardan ilki `tekAdresinTCKTsiniYaz()`:

```javascript
/**
 * @param {string} ağ TCKTnin sorgulanacağı ağ kodu
 * @param {string} adres TCKT sahibinin adresis
 */
const tekAdresinTCKTsiniYaz = (ağ, adres) =>
  jsonrpc
    .call(NodeURLleri[ağ], "eth_call", [
      /** @type {!eth.Transaction} */ ({
        to: TCKT_ADDR,
        data: "0xc50a1514" + evm.address(adres),
      }),
      "latest",
    ])
    .then((handle) => console.log(handle));
```

Bu yordam verilen bir blokzincir node’una bağlanıp `TCKT_ADDR` adresindeki kontratın
`0xc50a1514` hashli fonksiyonunu çağırıyor. Burada `0xc50a1514` hash'ine denk gelen fonksiyon [`uint256 handleOf(address)`](https://github.com/KimlikDAO/TCKT/blob/10ef3ba1a54b4f1ac97099eabe7075049c02dbd3/contracts/TCKT.sol#L109C19-L109C19), yani TCKT kontratının KimlikDAO-IPFS hashi okuma fonksiyonu.
Bu fonksiyonun tek bir parametresi var bu da hashini öğrenmek istediğimiz adres. Yukarıdaki kod örneğinde `evm.address(adres)` elimizdeki adresi EVM calldata’ya uygun halde yazıyor.

TCKT kontratı şu 6 farklı blokzincirde çalışır vaziyette: Ethereum, Avalanche, Polygon, Arbitrum, BNB Chain ve Fantom. Bize verilen adres listesi ağ bilgisi içermediği için verilmiş bir adresi 6 blokzincirde de sorgulamamız gerekiyor. Bunu yaparken olabildiğince az beklemek istiyoruz, dolayısıyla bağımsız akış (asynchrony) çok önemli.

`liste.js` bu 6 blokzincirin her birisi için bir node JSON-RPC url'i içeriyor:

```javascript
/** @const {!Object<string, string>} */
const NodeURLleri = {
  "0xa86a": "https://api.avax.network/ext/bc/C/rpc",
  "0x1": "https://cloudflare-eth.com",
  "0x89": "https://polygon-rpc.com",
  "0xa4b1": "https://arb1.arbitrum.io/rpc",
  "0x38": "https://bsc.publicnode.com",
  "0xfa": "https://rpc.ftm.tools",
};
```

Bu verilen node’ları kullanabilir veya bu listeyi isteğimize göre değiştirebiliriz.

Bir blokzincir node’una tek bir sorgu yollayabileceğimiz gibi, aynı JSON-RPC isteğinin içinde istediğimiz kadar sayıda sorguyu tek seferde yollayabiliriz. Bunu yapmak için `kimlikdao-js` kütüphanesinin `jsonrpc.callMulti()` fonksiyonunu kullanabiliriz. Bunun bir örneği `liste.js`'teki `ikiAdresinTCKTsiniYaz()` yordamı.

Bu soruda bizden istenen şu arabirime sahip bir fonskiyon yazmak

```javascript
/**
 * @param {!Array<string>} adresler
 * @return {!Object<string, !Array<string>>} her bir adres için o adrese denk
 *     gelen bütün KimlikDAO-IPFS hashleri. Dikkat edersek bir adrese en fazla
 *     6 tane hash denk gelebilir.
 */
const handlelarıBul(adresler) => {}
```

Bu fonksiyonu yazdığımızda son hedefimize şöyle ulaşabiliriz
```javascript
fetch("https://sorular.kimlikdao.org/adresler")
  .then((res) => res.json())
  .then((adresler) => handlelarıBul(adresler));
```

### Görevler

1.  `liste.js`'i değiştirerek önce `https://sorular.kimlikdao.org/adresler`’ten EVM adresleri listesi alıp sonra bu listeyi TCKT’nin varolduğu 6 ağda sorgulayıp, her adrese genk gelen büyün hashleri içeren array yaratalım. Bunu yaparken hem bekleme süresini hem de request sayısını en aza indirgemeye çalışalım

2.  **(ekstra)** Yazdığımız kodu `google-closure-compiler` ile derlenebilir halde getirelim. Bunun için önce `yarn` kullanarak gerekli araçları kurmamız gerekiyor:
```shell
# ilk sefere mahsus
yarn
```

```shell
# kodu çalıştırmak istediğimizde
make liste-run
```
yazarak `liste/liste.js`i derleyip çalıştirabiliriz.
