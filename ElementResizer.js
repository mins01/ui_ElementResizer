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
				er.addEvents();
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
				dir:'', //v,h,b
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
			this.container = container;
			this.target = container.querySelector('.er-target');
			if(!this.target){
				if(this.debug) console.warn(".er-target이 없습니다."); return false;
			}
		}
		addEvents(){
			if(!this.target){
				if(this.debug) console.warn(".er-target이 없습니다."); return false;
			}
			if(!this.container.dataset.erOn){
				this.container.dataset.erOn = 'on';
			}else{
				return false;
			}

			this.container.addEventListener('pointerdown',this.cb_onpointerdown)
			this.container.addEventListener('touchstart',this.cb_ontouchstart)
			this.container.ownerDocument.addEventListener('pointermove',this.cb_onpointermove)
			this.container.ownerDocument.addEventListener('pointerup',this.cb_onpointerup)
			return true;
		}
		removeEvents(){
			this.container.removeEventListener('pointerdown',this.cb_onpointerdown)
			this.container.removeEventListener('touchstart',this.cb_ontouchstart)
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
			
			state.dir = event.target.dataset.erDir;
			this.container.dataset.erDir=state.dir;
			this.container.ownerDocument.body.dataset.erDir=state.dir;
			
			if(this.debug) console.log(event.type,state);
		}
		onpointermove(event,state){
			if(!state.down){return;}
			event.stopPropagation();
			if (event.cancelable) event.preventDefault();
			let x = event.x;
			let y = event.y;

			
			switch(state.dir){
				case 'w':
				this.resizeTo(state.rect_org.width+x-state.xy_org.x ,null);
				break;
				case 'h':
				this.resizeTo(null ,state.rect_org.height+y-state.xy_org.y);
				break;
				case 'b':
				this.resizeTo(state.rect_org.width+x-state.xy_org.x ,state.rect_org.height+y-state.xy_org.y);
				break;
			}
			if(this.debug) console.log(event.type);
		}
		onpointerup(event,state){
			if(!state.down){return;}
			state.down = false;
			state.dir = '';
			delete this.container.dataset.erDir;
			delete this.container.ownerDocument.body.dataset.erDir;
			if(this.debug) console.log(event.type,state);
		}
		ontouchstart(event){
			if(!event.target.classList.contains('er-bar')){return;}
			event.stopPropagation();
			if (event.cancelable) event.preventDefault();
			event.stopImmediatePropagation();
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