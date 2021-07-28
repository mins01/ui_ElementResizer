const ElementResizer = (function(){
	class ElementResizer {
		static autoApplyAll(d) {
			if(!d && document){d = document}
			if(!d){
				console.warn('ElementResizer::autoApplyAll d가 없습니다.');
				return false;
			}
			let rs = []
			d.querySelectorAll('.er-container').forEach((container) => {
				let er = new ElementResizer(container);
				er.on();
				rs.push(er);
			});
			return rs;
		}
		constructor(container) {
			this.debug = false;
			this.container = null;
			this.target = null;

			let elementResizer = this;
			let state = {
				rect_org:{width:-1,height:-1},
				xy_org:{x:-1,y:-1},
				down:false,
				erBar:'', //v,h,b
				target:null
			}
			this.cb_ontouchstart = function(event){
				return elementResizer.ontouchstart(event,state)
			}
			this.cb_onpointerdown = function(event){
				return elementResizer.onpointerdown(event,state)
			}
			this.cb_onpointermove = function(event){
				return elementResizer.onpointermove(event,state)
			}
			this.cb_onpointerup = function(event){
				return elementResizer.onpointerup(event,state)
			}

			if(container){
				this.setContainer(container);
			}
		}
		setContainer(container){
			if(this.container){
				delete this.container.__er
			}
			this.container = container;
			this.container.__er = this;
			this.target = container.querySelector('.er-target');
			if(!this.target){
				if(this.debug) console.warn(".er-target이 없습니다."); return false;
			}
		}
		on(){
			if(!this.target){
				if(this.debug) console.warn(".er-target이 없습니다."); return false;
			}
			if(!this.container.dataset.erOn){
				this.container.dataset.erOn = 'on';
			}else{
				return false;
			}

			this.container.addEventListener('pointerdown',this.cb_onpointerdown)
			this.container.addEventListener('touchstart',this.cb_ontouchstart,{passive: false})
			this.container.ownerDocument.defaultView.addEventListener('touchmove',this.cb_ontouchstart,{passive: false})
			this.container.ownerDocument.addEventListener('pointermove',this.cb_onpointermove)
			this.container.ownerDocument.addEventListener('pointerup',this.cb_onpointerup)
			return true;
		}
		off(){
			this.container.removeEventListener('pointerdown',this.cb_onpointerdown)
			this.container.removeEventListener('touchstart',this.cb_ontouchstart)
			this.container.ownerDocument.defaultView.removeEventListener('touchmove',this.cb_ontouchstart)
			this.container.ownerDocument.removeEventListener('pointermove',this.cb_onpointermove)
			this.container.ownerDocument.removeEventListener('pointerup',this.cb_onpointerup)
			delete this.container.dataset.erOn;

			return true;
		}
		onpointerdown(event,state){
			if(!event.target.classList.contains('er-bar')){return;}
			state.down = true;
			event.stopPropagation();
			if (event.cancelable) event.preventDefault();
			state.rect_org = this.target.getBoundingClientRect();
			state.xy_org.x = event.x;
			state.xy_org.y = event.y;
			
			state.erBar = event.target.dataset.erBar;
			this.container.dataset.erBar=state.erBar;
			this.container.ownerDocument.body.dataset.erBar=state.erBar;
			
			if(this.debug) console.log(event.type,state);
		}
		onpointermove(event,state){
			if(!state.down){return;}
			event.stopPropagation();
			if (event.cancelable) event.preventDefault();
			let x = event.x;
			let y = event.y;
			let w = null;
			let h = null;
			if(state.erBar.indexOf('e')>-1){
				w = state.rect_org.width+x-state.xy_org.x
			}else if(state.erBar.indexOf('w')>-1){
				w = state.rect_org.width-x+state.xy_org.x
			}
			if(state.erBar.indexOf('s')>-1){
				h = state.rect_org.height+y-state.xy_org.y
			}else if(state.erBar.indexOf('n')>-1){
				h = state.rect_org.height-y+state.xy_org.y
			}
			this.resizeTo(w,h);
			if(this.debug) console.log(event.type);
		}
		onpointerup(event,state){
			if(!state.down){return;}
			state.down = false;
			state.erBar = '';
			delete this.container.dataset.erBar;
			delete this.container.ownerDocument.body.dataset.erBar;
			if(this.debug) console.log(event.type,state);
		}
		ontouchstart(event,state){
			if(!state.down && !event.target.classList.contains('er-bar')){
				if(this.debug) console.log(event.type,'continue',event.target);
				return;
			}
			event.stopPropagation();
			// event.stopImmediatePropagation();
			if (event.cancelable) event.preventDefault();
			if(this.debug) console.log(event.type,'stop',event.target);
			return false;
		}
		resizeTo(w,h){
			if(!this.target){
				if(this.debug) console.warn(".er-target이 없습니다."); return false;
			}
			if(w!==null) this.target.style.width = w+'px';
			if(h!==null) this.target.style.height = h+'px';
		}
		
	}
	return ElementResizer;
})()