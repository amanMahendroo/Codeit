class User {
	constructor(p, n, b) {
		this.id = getUserId();
		this.account = new Account(p, n, b)
		this.pref = new Preferences()
		this.archives = []
		this.own = []
	}
}

class Account {
	constructor(p, n, b, pw) {
		this.pfp = p
		this.name = n
		this.birth = new Date()
		this.password = pw
	}

	get age() {
		return time(new Date() - this.birth)
	}
}

class Preferences {
	constructor() {
		this.liked = []
		this.pref = []
		this.prefTotal = 0
	}

	set pref(postId) {
		if (this.liked.length >= 1000) {
			let x = getPostFromId(this.liked[0])
			for (var i = 0; i < x.content.tags.length; i++) {
				this.pref[i] -= x.content.tags[i]
			}
			this.liked.shift()
		}
		this.liked.push(postId)
		let y = getPostFromId(postId)
		for (var i = 0; i < y.content.tags.length; i++) {
			this.pref[i] += y.content.tags[i]
		}
		this.prefTotal = this.pref.reduce((a, b) => a + b, 0)
	}
}

function getUserId() {
	return Math.floor(Math.random() * 100)
}

function time(milli) {
	return floor(milli/86400000)
}