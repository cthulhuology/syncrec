// syncrec.js
//
//
//
//

async function sync(self,fun,...args) {
	return new Promise( (resolve,reject) => {
		fun.apply(self,args.concat((err,res) => {
			if (err) return reject(err);
			resolve(res);
		}));
	})
}

async function syncrec(self,fun,arg,...args) {
	return new Promise( (resolve,reject) => {
		try {
			fun.apply(self, arg.concat(async (err,res) => {
				if (err) return reject(err);
				var ret = args.length ?  [ res ].concat(await syncrec(self,fun,...args)) : res;
				resolve(ret)
			}))
		} catch (e) {
			console.log(e)	
		}
	})
}

async function test() {
	const de = require('deep-equal')
	const t1 = async (callback) => {
		setTimeout( () => {
			callback(null,'ok')
		}, 10)
	}
	console.log('t1.', 'ok' == await sync( this, t1 ) ? 'pass' : 'fail')
	console.log('t2.', de(['ok','ok'], await syncrec( this, t1, [],[])) ? 'pass' : 'fail')
}

module.exports = { sync: sync, syncrec: syncrec, test: test }
