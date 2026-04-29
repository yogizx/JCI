const dns = require('dns');

const hosts = [
  'ac-jkp5tpn-shard-00-00.0l8gs4p.mongodb.net',
  'ac-jkp5tpn-shard-00-01.0l8gs4p.mongodb.net',
  'ac-jkp5tpn-shard-00-02.0l8gs4p.mongodb.net'
];

function testDns() {
  hosts.forEach(host => {
    dns.lookup(host, (err, address, family) => {
      if (err) {
        console.error(`Lookup failed for ${host}:`, err.message);
      } else {
        console.log(`Lookup successful for ${host}: ${address} (IPv${family})`);
      }
    });
  });
}

testDns();
