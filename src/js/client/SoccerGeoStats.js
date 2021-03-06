if (!window.SGS) {
	
	window.SGS = {
			
		theme : 'ui-le-frog',
		
		map : null,
		
		providers : [
		             {html: "<div style='height: 20px; float: left;'><img style='float: left; margin-top: 2px; margin-right: 5px;' src='resources/images/gb.png'/><span style='float: left; font-size: 13px; font-family: Verdana Arial;'>Google Maps</span></div>", title: 'Google Maps', value: 'google' },
		             {html: "<div style='height: 20px; float: left;'><img style='float: left; margin-top: 2px; margin-right: 5px;' src='resources/images/gb.png'/><span style='float: left; font-size: 13px; font-family: Verdana Arial;'>Open Street Maps</span></div>", title: 'Open Street Maps', value: 'osm' },
		             {html: "<div style='height: 20px; float: left;'><img style='float: left; margin-top: 2px; margin-right: 5px;' src='resources/images/gb.png'/><span style='float: left; font-size: 13px; font-family: Verdana Arial;'>Bing</span></div>", title: 'Bing', value: 'bing' },
		            ],
		            
		championships : [
		    		     {html: "<div style='height: 20px; float: left;'><img style='float: left; margin-top: 2px; margin-right: 5px;' src='resources/images/it.png'/><span style='float: left; font-size: 13px; font-family: Verdana Arial;'>Italy</span></div>", title: 'Italy', value: 'it' }
		    		    ],
		    		    
		rounds : [
		          {html: "<div style='height: 20px; float: left;'><img style='float: left; margin-top: 2px; margin-right: 5px;' src='resources/images/it.png'/><span style='float: left; font-size: 13px; font-family: Verdana Arial;'>Round 1</span></div>", title: 'Round 1', value: '1' }
		    	 ],
		    	 
		matches : [
		           {html: "<div style='height: 20px; float: left;'><img style='float: left; margin-top: 2px; margin-right: 5px;' src='resources/images/it.png'/><span style='float: left; font-size: 13px; font-family: Verdana Arial;'>Please Select...</span></div>", title: 'Round 1', value: null },
		           {html: "<div style='height: 20px; float: left;'><img style='float: left; margin-top: 2px; margin-right: 5px;' src='resources/images/it.png'/><span style='float: left; font-size: 13px; font-family: Verdana Arial;'>Napoli - Fiorentina</span></div>", title: 'Napoli - Fiorentina', value: 'nap-fio' },
		           {html: "<div style='height: 20px; float: left;'><img style='float: left; margin-top: 2px; margin-right: 5px;' src='resources/images/it.png'/><span style='float: left; font-size: 13px; font-family: Verdana Arial;'>Lazio - Palermo</span></div>", title: 'Lazio - Palermo', value: 'laz-pal' },
		           {html: "<div style='height: 20px; float: left;'><img style='float: left; margin-top: 2px; margin-right: 5px;' src='resources/images/it.png'/><span style='float: left; font-size: 13px; font-family: Verdana Arial;'>Inter - Roma</span></div>", title: 'Inter - Roma', value: 'int-rom' },
		 		  ],
			
		init : function() {
			
			$("#map_provider").jqxDropDownList({ 
				source: SGS.providers, 
				selectedIndex: 1, 
				width: '250px', 
				height: '25px', 
				theme: SGS.theme
			});
			
			$("#list_championship").jqxDropDownList({ 
				source: SGS.championships, 
				selectedIndex: 0, 
				width: '250px', 
				height: '25px', 
				theme: SGS.theme
			});
			
			$("#list_round").jqxDropDownList({ 
				source: SGS.rounds, 
				selectedIndex: 0, 
				width: '250px', 
				height: '25px', 
				theme: SGS.theme
			});
			
			SGS.populateMatchList();
			
			$('#list_match').bind('change', function (e) {
				SGS.showEvents(e.args.item.originalItem);
			});
			
		},
		
		showEvents : function(match) {
			if (SGS.map == null) {
				SGS.map = L.map('map').setView([match.location[0], match.location[1]], 17);
				L.tileLayer('http://{s}.tile.cloudmade.com/17ad8466b1c24b86b173b2a1d5492115/997/256/{z}/{x}/{y}.png', {
					attribution: 'GeoBricks',
				    maxZoom: 18
				}).addTo(SGS.map);
				for (var i = 0 ; i < match.events.length ; i++) {
					var marker = L.marker([match.events[i].location[0], match.events[i].location[1]]);
					marker.bindPopup("<b>" + match.events[i].player +"</b><br/>" + match.events[i].event + "<br/>" + match.events[i].minute + "° minute");
					marker.addTo(SGS.map);
				}
			} else {
				SGS.map.panTo([match.location[0], match.location[1]]);
				for (var i = 0 ; i < match.events.length ; i++) {
					var marker = L.marker([match.events[i].location[0], match.events[i].location[1]]);
					marker.bindPopup("<b>" + match.events[i].player +"</b><br/>" + match.events[i].event + "<br/>" + match.events[i].minute + "° minute");
					marker.addTo(SGS.map);
				}
			}
		},
		
		populateMatchList : function() {
			
			$.ajax({
				
				type: 'GET',
				url: 'http://localhost:7000/select/match/*?callback=?',
				dataType: 'jsonp',
				jsonp: 'callback',
				
				success : function(response) {
					
					var source = new Array();
					
					for (var i = 0 ; i < response.length ; i++) {
						console.log(response[i]);
						var row = {};
						row.html = "<div style='height: 20px; float: left;'><img style='float: left; margin-top: 2px; margin-right: 5px;' src='resources/images/it.png'/><span style='float: left; font-size: 13px; font-family: Verdana Arial;'>" + response[i].label + "</span></div>";
						row.events = response[i].events;
						row._id = response[i]._id;
						row.code = response[i].code;
						row.location = response[i].location;
						source[i] = row;
					}
					
					$("#list_match").jqxDropDownList({ 
						source: source, 
						selectedIndex: 0, 
						width: '250px', 
						height: '25px', 
						theme: SGS.theme
					});
					
//					SGS.showEvents(source[0]);
					
				},
				
				error : function(err, b, c) {
					alert(err.status + ", " + b + ", " + c);
				}
			
        	});
			
		}
			
	};
	
}