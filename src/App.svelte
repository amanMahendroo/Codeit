<script>

	import { Router, Link, Route, navigate } from "svelte-routing";
	import Index from "./Index/Index.svelte";
	import WebEditor from "./WebEditor/WebEditor.svelte";
	import Editor from "./Editor/Editor.svelte";

	export let url = "";

	// --------------------------------------

	function login() {
		return Promise.resolve()
	}

	function goToIndex() {
		login().then(() => {
			navigate("Index/Index.svelte", { replace: true });
		});
	}

	let strength = 0
	let validations = []

	function validatePassword(e) {
		const password = e.target.value
		validations = [
		(password.length > 7),
		((password.search(/[A-Z]/) > -1) && (password.search(/[a-z]/) > -1)),
		(password.search(/[0-9]/) > -1),
		(password.search(/[!@#$%^&*()-_;:'",.<>/?\\|`~/*-+]/) > -1)
		]

		strength = validations.reduce((acc, cur) => acc + cur)
	}
</script>

<main>
	<div class="container">
		<div class="distract">
			<div class="overlay"></div>
			<div class="image">
				<img src="https://bit.ly/3e8mSId">
			</div>
		</div>
		<div class="panel">
			<div class="background-overlay">
				<div class="t1"></div>
				<div class="t2"></div>
				<div class="t3"></div>
			</div>
			<div class="logo" id="logo">
				<img src="dark.png" />
			</div>
			<div class="first">
				<div class="logins">
					<input type="email" name="username" placeholder="E-mail" spellcheck="false" id="email"><br>
					<input type="password" name="password" placeholder="Password">
					<div class="submit" on:click={goToIndex}>Login</div>
					<div class="facebook" on:click={goToIndex}>
						<span>Login with</span> Facebook
					</div>
					<div class="google" on:click={goToIndex}>
						<span>Login with</span> Google
					</div>
				</div>
				<div class="register">
					Not a member? <span class="reg">Register now</span>
				</div>
			</div>

			<div class="second">
				<div class="back">
					<i class="fa fa-angle-left"></i>
				</div>
				<input type="text" name="name" placeholder="Name" />
				<input type="email" name="username" placeholder="E-mail" spellcheck="false" id="email"><br>
				<input type="password" name="password" placeholder="Password" on:input={validatePassword} />
				<div class="analyse">
					<div class="meter">
						<span class="bar" class:verif = {strength > 0}></span>
						<span class="bar" class:verif = {strength > 1}></span>
						<span class="bar" class:verif = {strength > 2}></span>
						<span class="bar" class:verif = {strength > 3}></span>
					</div>
					<ul class="req">
						<li class:correct = {validations[0]}>more than 7 characters</li>
						<li class:correct = {validations[1]}>both lower and uppercase characters</li>
						<li class:correct = {validations[2]}>at least 1 numeric character</li>
						<li class:correct = {validations[3]}>at least 1 special character</li>
						
					</ul>
				</div>
				<div class="submit" on:click={goToIndex}>Sign Up</div>
			</div>
		</div>
	</div>
</main>

<style>
</style>

<Router url="{url}">
	<!-- <nav>
		<Link to="/">Login</Link>
		<Link to="Index">Index</Link>
		<Link to="WebEditor">Editor</Link>
	</nav>
	<div>
		<Route path="WebEditor" component="{WebEditor}" />
		<Route path="Index" component="{Index}" />
	</div> -->
</Router>