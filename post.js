class Post {
	constructor(u, th, t) {
		this.id = getPostId()
		this.userId = u
		this.time = new Date()
		this.likes = new Set()
		this.dislikes = new Set()
		this.comments
		this.content = new Content(th, t)
	}

	set onLike(userId) {
		this.likes.add(userId)
	}

	set onUnlike(userId) {
		this.likes.delete(userId)
	}

	set onDislike(userId) {
		this.dislikes.add(userId)
	}

	set onUndislike(userId) {
		this.dislikes.delete(userId)
	}
}

class Content {
	constructor(th, t) {
		this.thumb = th
		this.tags = []
	}
}

function getPostId() {
	return Math.floor(Math.random() * 1000)
}