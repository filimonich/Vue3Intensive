export default function connectPageHeadTags(context, router) {
	function applyHead(head){
		if(!head.title){
			console.warn('developer, set $head.title for all views, expetcted not empty!');
			head.title = 'no title';
		}

		if(process.isClient){
			document.title = head.title;
		}
		else{
			context.head = head;
		}
	}

	router.afterEach((to) => {
		let headController = to.matched.flatMap(
			record => Object.values(record.components)
		).filter(cmp => ('$head' in cmp)).pop();

		if(!headController || typeof headController.$head !== 'function'){
			console.warn('developer, set $head function for all views!');
			return;
		}

		let nativeCreated = headController.created;

		headController.created = function(){
			let head = headController.$head.call(this);

			if(nativeCreated){
				nativeCreated.call(this);
			}
			
			headController.created = nativeCreated;
			applyHead(head);
		}
	});
}