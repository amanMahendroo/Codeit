
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.23.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\App.svelte generated by Svelte v3.23.0 */

    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let div20;
    	let div2;
    	let div0;
    	let t0;
    	let div1;
    	let img0;
    	let img0_src_value;
    	let t1;
    	let div19;
    	let div6;
    	let div3;
    	let t2;
    	let div4;
    	let t3;
    	let div5;
    	let t4;
    	let div7;
    	let img1;
    	let img1_src_value;
    	let t5;
    	let div13;
    	let div11;
    	let input0;
    	let br0;
    	let t6;
    	let input1;
    	let t7;
    	let div8;
    	let t9;
    	let div9;
    	let t11;
    	let div10;
    	let t13;
    	let div12;
    	let t14;
    	let span0;
    	let t16;
    	let div18;
    	let div14;
    	let i;
    	let t17;
    	let input2;
    	let t18;
    	let input3;
    	let br1;
    	let t19;
    	let input4;
    	let t20;
    	let div16;
    	let div15;
    	let span1;
    	let t21;
    	let span2;
    	let t22;
    	let span3;
    	let t23;
    	let span4;
    	let t24;
    	let ul;
    	let li0;
    	let t26;
    	let li1;
    	let t28;
    	let li2;
    	let t30;
    	let li3;
    	let t32;
    	let div17;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div20 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			img0 = element("img");
    			t1 = space();
    			div19 = element("div");
    			div6 = element("div");
    			div3 = element("div");
    			t2 = space();
    			div4 = element("div");
    			t3 = space();
    			div5 = element("div");
    			t4 = space();
    			div7 = element("div");
    			img1 = element("img");
    			t5 = space();
    			div13 = element("div");
    			div11 = element("div");
    			input0 = element("input");
    			br0 = element("br");
    			t6 = space();
    			input1 = element("input");
    			t7 = space();
    			div8 = element("div");
    			div8.textContent = "Login";
    			t9 = space();
    			div9 = element("div");
    			div9.textContent = "Login with facebook";
    			t11 = space();
    			div10 = element("div");
    			div10.textContent = "Login with Google";
    			t13 = space();
    			div12 = element("div");
    			t14 = text("Not a member? ");
    			span0 = element("span");
    			span0.textContent = "Register now";
    			t16 = space();
    			div18 = element("div");
    			div14 = element("div");
    			i = element("i");
    			t17 = space();
    			input2 = element("input");
    			t18 = space();
    			input3 = element("input");
    			br1 = element("br");
    			t19 = space();
    			input4 = element("input");
    			t20 = space();
    			div16 = element("div");
    			div15 = element("div");
    			span1 = element("span");
    			t21 = space();
    			span2 = element("span");
    			t22 = space();
    			span3 = element("span");
    			t23 = space();
    			span4 = element("span");
    			t24 = space();
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "more than 7 characters";
    			t26 = space();
    			li1 = element("li");
    			li1.textContent = "both lower and uppercase characters";
    			t28 = space();
    			li2 = element("li");
    			li2.textContent = "at least 1 numeric character";
    			t30 = space();
    			li3 = element("li");
    			li3.textContent = "at least 1 special character";
    			t32 = space();
    			div17 = element("div");
    			div17.textContent = "Sign Up";
    			attr_dev(div0, "class", "overlay");
    			add_location(div0, file, 21, 3, 448);
    			if (img0.src !== (img0_src_value = "https://bit.ly/3e8mSId")) attr_dev(img0, "src", img0_src_value);
    			add_location(img0, file, 23, 4, 503);
    			attr_dev(div1, "class", "image");
    			add_location(div1, file, 22, 3, 479);
    			attr_dev(div2, "class", "distract");
    			add_location(div2, file, 20, 2, 422);
    			attr_dev(div3, "class", "t1");
    			add_location(div3, file, 28, 4, 619);
    			attr_dev(div4, "class", "t2");
    			add_location(div4, file, 29, 4, 646);
    			attr_dev(div5, "class", "t3");
    			add_location(div5, file, 30, 4, 673);
    			attr_dev(div6, "class", "background-overlay");
    			add_location(div6, file, 27, 3, 582);
    			if (img1.src !== (img1_src_value = "dark.png")) attr_dev(img1, "src", img1_src_value);
    			add_location(img1, file, 33, 4, 742);
    			attr_dev(div7, "class", "logo");
    			attr_dev(div7, "id", "logo");
    			add_location(div7, file, 32, 3, 709);
    			attr_dev(input0, "type", "email");
    			attr_dev(input0, "name", "username");
    			attr_dev(input0, "placeholder", "E-mail");
    			attr_dev(input0, "spellcheck", "false");
    			attr_dev(input0, "id", "email");
    			add_location(input0, file, 37, 5, 828);
    			add_location(br0, file, 37, 92, 915);
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "name", "password");
    			attr_dev(input1, "placeholder", "Password");
    			add_location(input1, file, 38, 5, 925);
    			attr_dev(div8, "class", "submit");
    			add_location(div8, file, 39, 5, 993);
    			attr_dev(div9, "class", "facebook");
    			add_location(div9, file, 40, 5, 1030);
    			attr_dev(div10, "class", "google");
    			add_location(div10, file, 43, 5, 1096);
    			attr_dev(div11, "class", "logins");
    			add_location(div11, file, 36, 4, 802);
    			attr_dev(span0, "class", "reg");
    			add_location(span0, file, 48, 19, 1210);
    			attr_dev(div12, "class", "register");
    			add_location(div12, file, 47, 4, 1168);
    			attr_dev(div13, "class", "first");
    			add_location(div13, file, 35, 3, 778);
    			attr_dev(i, "class", "fa fa-angle-left");
    			add_location(i, file, 54, 5, 1322);
    			attr_dev(div14, "class", "back");
    			add_location(div14, file, 53, 4, 1298);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "name", "name");
    			attr_dev(input2, "placeholder", "Name");
    			add_location(input2, file, 56, 4, 1370);
    			attr_dev(input3, "type", "email");
    			attr_dev(input3, "name", "username");
    			attr_dev(input3, "placeholder", "E-mail");
    			attr_dev(input3, "spellcheck", "false");
    			attr_dev(input3, "id", "email");
    			add_location(input3, file, 57, 4, 1427);
    			add_location(br1, file, 57, 91, 1514);
    			attr_dev(input4, "type", "password");
    			attr_dev(input4, "name", "password");
    			attr_dev(input4, "placeholder", "Password");
    			add_location(input4, file, 58, 4, 1523);
    			attr_dev(span1, "class", "bar");
    			toggle_class(span1, "verif", /*strength*/ ctx[0] > 0);
    			add_location(span1, file, 61, 6, 1673);
    			attr_dev(span2, "class", "bar");
    			toggle_class(span2, "verif", /*strength*/ ctx[0] > 1);
    			add_location(span2, file, 62, 6, 1734);
    			attr_dev(span3, "class", "bar");
    			toggle_class(span3, "verif", /*strength*/ ctx[0] > 2);
    			add_location(span3, file, 63, 6, 1795);
    			attr_dev(span4, "class", "bar");
    			toggle_class(span4, "verif", /*strength*/ ctx[0] > 3);
    			add_location(span4, file, 64, 6, 1856);
    			attr_dev(div15, "class", "meter");
    			add_location(div15, file, 60, 5, 1647);
    			toggle_class(li0, "correct", /*validations*/ ctx[1][0]);
    			add_location(li0, file, 67, 6, 1951);
    			toggle_class(li1, "correct", /*validations*/ ctx[1][1]);
    			add_location(li1, file, 68, 6, 2022);
    			toggle_class(li2, "correct", /*validations*/ ctx[1][2]);
    			add_location(li2, file, 69, 6, 2106);
    			toggle_class(li3, "correct", /*validations*/ ctx[1][3]);
    			add_location(li3, file, 70, 6, 2183);
    			attr_dev(ul, "class", "req");
    			add_location(ul, file, 66, 5, 1928);
    			attr_dev(div16, "class", "analyse");
    			add_location(div16, file, 59, 4, 1620);
    			attr_dev(div17, "class", "submit");
    			add_location(div17, file, 74, 4, 2287);
    			attr_dev(div18, "class", "second");
    			add_location(div18, file, 52, 3, 1273);
    			attr_dev(div19, "class", "panel");
    			add_location(div19, file, 26, 2, 559);
    			attr_dev(div20, "class", "container");
    			add_location(div20, file, 19, 1, 396);
    			add_location(main, file, 18, 0, 388);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div20);
    			append_dev(div20, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, img0);
    			append_dev(div20, t1);
    			append_dev(div20, div19);
    			append_dev(div19, div6);
    			append_dev(div6, div3);
    			append_dev(div6, t2);
    			append_dev(div6, div4);
    			append_dev(div6, t3);
    			append_dev(div6, div5);
    			append_dev(div19, t4);
    			append_dev(div19, div7);
    			append_dev(div7, img1);
    			append_dev(div19, t5);
    			append_dev(div19, div13);
    			append_dev(div13, div11);
    			append_dev(div11, input0);
    			append_dev(div11, br0);
    			append_dev(div11, t6);
    			append_dev(div11, input1);
    			append_dev(div11, t7);
    			append_dev(div11, div8);
    			append_dev(div11, t9);
    			append_dev(div11, div9);
    			append_dev(div11, t11);
    			append_dev(div11, div10);
    			append_dev(div13, t13);
    			append_dev(div13, div12);
    			append_dev(div12, t14);
    			append_dev(div12, span0);
    			append_dev(div19, t16);
    			append_dev(div19, div18);
    			append_dev(div18, div14);
    			append_dev(div14, i);
    			append_dev(div18, t17);
    			append_dev(div18, input2);
    			append_dev(div18, t18);
    			append_dev(div18, input3);
    			append_dev(div18, br1);
    			append_dev(div18, t19);
    			append_dev(div18, input4);
    			append_dev(div18, t20);
    			append_dev(div18, div16);
    			append_dev(div16, div15);
    			append_dev(div15, span1);
    			append_dev(div15, t21);
    			append_dev(div15, span2);
    			append_dev(div15, t22);
    			append_dev(div15, span3);
    			append_dev(div15, t23);
    			append_dev(div15, span4);
    			append_dev(div16, t24);
    			append_dev(div16, ul);
    			append_dev(ul, li0);
    			append_dev(ul, t26);
    			append_dev(ul, li1);
    			append_dev(ul, t28);
    			append_dev(ul, li2);
    			append_dev(ul, t30);
    			append_dev(ul, li3);
    			append_dev(div18, t32);
    			append_dev(div18, div17);

    			if (!mounted) {
    				dispose = listen_dev(input4, "input", /*validatePassword*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*strength*/ 1) {
    				toggle_class(span1, "verif", /*strength*/ ctx[0] > 0);
    			}

    			if (dirty & /*strength*/ 1) {
    				toggle_class(span2, "verif", /*strength*/ ctx[0] > 1);
    			}

    			if (dirty & /*strength*/ 1) {
    				toggle_class(span3, "verif", /*strength*/ ctx[0] > 2);
    			}

    			if (dirty & /*strength*/ 1) {
    				toggle_class(span4, "verif", /*strength*/ ctx[0] > 3);
    			}

    			if (dirty & /*validations*/ 2) {
    				toggle_class(li0, "correct", /*validations*/ ctx[1][0]);
    			}

    			if (dirty & /*validations*/ 2) {
    				toggle_class(li1, "correct", /*validations*/ ctx[1][1]);
    			}

    			if (dirty & /*validations*/ 2) {
    				toggle_class(li2, "correct", /*validations*/ ctx[1][2]);
    			}

    			if (dirty & /*validations*/ 2) {
    				toggle_class(li3, "correct", /*validations*/ ctx[1][3]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let strength = 0;
    	let validations = [];

    	function validatePassword(e) {
    		const password = e.target.value;

    		$$invalidate(1, validations = [
    			password.length > 7,
    			password.search(/[A-Z]/) > -1 && password.search(/[a-z]/) > -1,
    			password.search(/[0-9]/) > -1,
    			password.search(/[$&+,:;=?@#]/) > -1
    		]);

    		$$invalidate(0, strength = validations.reduce((acc, cur) => acc + cur));
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);
    	$$self.$capture_state = () => ({ strength, validations, validatePassword });

    	$$self.$inject_state = $$props => {
    		if ("strength" in $$props) $$invalidate(0, strength = $$props.strength);
    		if ("validations" in $$props) $$invalidate(1, validations = $$props.validations);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [strength, validations, validatePassword];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'Aman'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
