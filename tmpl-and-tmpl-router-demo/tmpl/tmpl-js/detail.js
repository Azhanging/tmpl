_require.define(function() {
	var Tmpl = _require('tmpl');
	
	var router = Tmpl.router;
	
	var tmpl = new Tmpl({
		el: 'detail',
		data:{
		   page:''
		},
		routerStatus:true,
		methods: {
			getData: function(el) {
			    
                var _this = this;
                
                var page = router.query(router.search(location.hash))['id'];
                
                if(this.page == page) return;
                
                if(el) el.innerHTML = '';
                
				$.ajax({
				    cache:false,
					url: '/php/get_data.php',
					data: {
						page: page
					},
					success: function(data) {
					    _this.page = page;
						_this.render(data).appendTo(_this.view);
					}
				});
			}
		},
		created:function(){
			var view = this.fn.getEl('tmp1');
			this.view = view;
		},
		mounted: function() {
			this.getData();
			router.router['/detail']['tmpl'] = this;
		}
	});
});