const dns = require('dns');

const hosts = [
  'ac-jkp5tpn-shard-00-00.0l8gs4p.mongodb.net',
  'ac-jkp5tpn-shard-00-01.0l8gs4p.mongodb.net',
  'ac-jkp5tpn-shard-00-02.0l8gs4p.mongodb.net'
];

async function testDns() {
  for (const host of hosts) {
    try {
      const addresses = await dns.promises.resolve4(host);
      console.log(`Resolved ${host} to: ${addresses.join(', ')}`);
    } catch (err) {
      console.error(`Failed to resolve ${host}:`, err.message);
    }
  }
}

testDns();
