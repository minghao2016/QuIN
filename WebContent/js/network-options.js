$(function(){
	$("#pann, #pans, #pane, #panw, #zoomin, #zoomout, #subgraph, #reset, #searchcomponents, #componentenrichment, #export, #exportoptions").button();
	
	$("#layoutselect").change( function(){
		$('#network').cytoscape('get').layout(getNetworkLayout()); });
	
	$("#pann").click(function(){
		var cy = $('#network').cytoscape('get');
		cy.panBy({ x: 0, y: -25 });
	});
	
	$("#pans").click(function(){
		var cy = $('#network').cytoscape('get');
		cy.panBy({ x: 0, y: 25 });
	});
	
	$("#pane").click(function(){
		var cy = $('#network').cytoscape('get');
		cy.panBy({ x: 25, y: 0 });
	});
	
	$("#panw").click(function(){
		var cy = $('#network').cytoscape('get');
		cy.panBy({ x: -25, y: 0 });
	});
	
	$("#zoomin").click(function(){
		var cy = $('#network').cytoscape('get');
		cy.zoom({
			level: cy.zoom()*1.1,
			renderedPosition: { x: cy.width()/2, y: cy.height()/2 }
		});
	});
	
	$("#zoomout").click(function(){
		var cy = $('#network').cytoscape('get');
		cy.zoom({
			level: cy.zoom()/1.1,
			renderedPosition: { x: cy.width()/2, y: cy.height()/2 }
		});	
	});
	
	$("#subgraph").click(function(){
		var cy = $('#network').cytoscape('get');
		cy.load(cy.$('node:selected'));
	});
	
	$("#reset").click(function(){
		var cy = $('#network').cytoscape('get');
		cy.reset();
	});
	
	$("#nlabels").change(function(){
		setNodeLabels();
	});
	
	$("#elabels").change(function(){
		setEdgeLabels();
	});
	
	$("#searchcomponents").click(function(){
		var searchterm = $("#searchterm").val();
		search(searchterm);
	});
	
	$("#componentenrichment").click(function(){
		GOEnrichment();
	});
	
	$("#exportimagedialog").dialog({
		width: 800,
		height: 600,
		autoOpen: false,
		modal: true,
		close: function(){
			$("#exportimage-image").attr('src', '');
		}
	});
	$("#exportimagedialog").parent().find(".ui-dialog-titlebar-close").css("display", "inline");


	$("#exportimagebutton").button();
	$("#exportimagebutton").click(function(){
		var cy = $('#network').cytoscape('get');
		var imgdata = cy.png({scale: 10});
		$("#exportimage-image").attr('src', imgdata);
		$("#exportimagedialog").dialog("open");
	});
	
	$("#searchresults").hide();

	$("#searchclose").click(function(e){
		e.preventDefault();
		$("#searchresults").hide();
	});
	
	
	$("#export_additionaloptions").children().hide();
	$("#exportdialog").dialog({
		autoOpen: false,
		modal: true,
		width: 'auto',
		height: 'auto'
	});
	
	
	$("#exportdialog").parent().find(".ui-dialog-titlebar-close").css("display", "inline");

	$("#exportoptions").click(function(){$("#exportdialog").dialog("open")});
	
	$("#export").click(function(){
		var type = $("#export_type").val();
		
		$("#export_network").val(ccidata.network);
		$("#export_minsize").val(ccidata.minsize);
		$("#export_maxsize").val(ccidata.maxsize);
		$("#export_genes").val(JSON.stringify(ccidata.genes));
		$("#export_diseases").val(JSON.stringify(ccidata.diseases));
		$("#export_regions").val(JSON.stringify(ccidata.regions));
		$("#export_snps").val(JSON.stringify(ccidata.snps));
		
		if(type == 1){
			//Network GML
			$("#exportform").prop("action", "exportnetwork");
			$("#exportform").submit();
		}
		else if(type == 2){
			//Nodes
			$("#exportform").prop("action", "nodeannotations");
			$("#exportform").submit();
		}
		else if(type == 3){
			//Components
			$("#exportform").prop("action", "exportca");
			$("#exportform").submit();
		}
		else if(type == 4){
			//SPA
			$("#exportform").prop("action", "exportminhop");
			$("#exportform").submit();
		}
		
	});
	
	$("#tdexport").click(function(){
		var ccidata = getTDCCIDData()
		$("#tdexport_network").val(ccidata.network);
		$("#tdexport_minsize").val(ccidata.minsize);
		$("#tdexport_maxsize").val(ccidata.maxsize);
		$("#tdexport_supportingedges").val(ccidata.supportingedges);
		$("#tdexport_s_genes").val(JSON.stringify(ccidata.s_genes));
		$("#tdexport_s_diseases").val(JSON.stringify(ccidata.s_diseases));
		$("#tdexport_s_regions").val(JSON.stringify(ccidata.s_regions));
		$("#tdexport_s_snps").val(JSON.stringify(ccidata.s_snps));
		$("#tdexport_sp").val(ccidata.sp);
		$("#tdexport_t_genes").val(JSON.stringify(ccidata.t_genes));
		$("#tdexport_t_diseases").val(JSON.stringify(ccidata.t_diseases));
		$("#tdexport_t_regions").val(JSON.stringify(ccidata.t_regions));
		$("#tdexport_t_snps").val(JSON.stringify(ccidata.t_snps));
		$("#tdexport_tp").val(ccidata.tp);
		$("#tdexportform").submit();
	});
	
	

	
	$("#loadaieh").click(function(){
		$("#sph").empty().append("Loading...");

		$.ajax({
			url : "aieheatmap",
			data: {
				network: ccidata.network,
				genes: ccidata.genes,
				diseases: ccidata.diseases,
				regions: ccidata.regions,
				snps: ccidata.snps,
				minsize: ccidata.minsize,
				maxsize: ccidata.maxsize,
				testtype: $("#ptest").prop("checked") ? "p" : $("#ittest").prop("checked") ? "it" : "t",
				permutations: $("#ptest").prop("checked") ? $("#numpermutations").val() : $("#itthresh").val(),
			},
			dataType : "json",
			cache: false,
			type : "post",
			}).success(function(data) {
				$("#sph").empty();
				
				if(data && data != null){
					$("#sph").append('<b>Heatmap of Log2 Observed/Expected frequencies:</b><br/>');
					$("#sph").append('<img src="data:image/png;base64,'+data.heatmap+'">');
					$("#sph").append('<br/><br/><b>Observed frequency of edges between annotations:</b><br/>');
					$("#sph").append(getTable(data.labels, data.countmatrix));
					if(data.expectedmatrix){
						$("#sph").append('<br/><br/><b>Permuted Expected frequency of edges between annotations (Total Edges: '+data.edgecount+'):</b><br/>');
						$("#sph").append(getTable(data.labels, data.expectedmatrix, function(a){ return parseFloat(a).toFixed(4);}));
					}
					$("#sph").append('<br/><br/><b>Theoretical Expected frequency of edges between annotations (Total Edges: '+data.edgecount+'):</b><br/>');
					$("#sph").append(getTable(data.labels, data.texpectedmatrix, function(a){ return parseFloat(a).toFixed(4);}));
					$("#sph").append('<br/><br/><b>Binomial Test P-Values (Positive values are from the Greater Than Hypothesis, Negative values are from the Less Than hypothesis):</b><br/>');
					$("#sph").append(getTable(data.labels, data.binomialmatrix, function(a){ return parseFloat(a).toExponential(4);}));
				
					if(data.expectedmatrix){
						$("#sph").append('<br/><br/><b>Two-Tailed P-Values (using the null distribution derived from permutations):</b><br/>');
						$("#sph").append(getTable(data.labels, data.permutationpval, function(a){ return parseFloat(a).toExponential(4);}));
					}
					
					/*$("#sph").append('<br/><br/><b>Number of annotations (row) interacting with another annotation (column):</b><br/>');
					var lwithvals = [];
					for(var i = 0; i < data.labels.length; i++){
						lwithvals[i] = data.labels[i]+"("+data.annotationtotals[i]+")";
					}
					$("#sph").append(getTable(lwithvals, data.annotationinteractioncount));
					
					$("#sph").append('<br/><br/><b>Number of annotations interacting with another annotation P-Value:</b><br/>');
					var lwithvals = [];
					for(var i = 0; i < data.labels.length; i++){
						lwithvals[i] = data.labels[i]+"("+data.annotationtotals[i]+")";
					}
					$("#sph").append(getTable(lwithvals, data.annotationinteractionexpected, function(a){ return parseFloat(a).toFixed(4);}));
					*/
				}
				else{
					$("#sph").append("An error occurred while performing this analysis.");
				}
			}).error(function(req, status, error) {
				//TODO
			});
	});
	
	$("#ittestdesc").hide();
	$("#permutetest").hide();
	$("#ttest").click(function(){
		$("#ittestdesc").hide();
		$("#permutetest").hide();
	});
	$("#ptest").click(function(){
		$("#ittestdesc").hide();
		$("#permutetest").show();
	});
	$("#ittest").click(function(){
		$("#ittestdesc").show();
		$("#permutetest").hide();
	});
	
	$("#gotoccb").button();
	$("#gotoccb").click(function(){
		var cc = parseInt($("#gotocc").val().trim());
		if(!isNaN(cc)){
			setCC(cc-1);
		}
	});
	
	$("#selectall").button();
	$("#selectall").click(function(){
		var cy = $('#network').cytoscape('get');
		var nodes = cy.nodes();
		nodes.select();
	});
	
	
	
	$("#selectneighbors").button();
	$("#selectneighbors").click(function(){
		var cy = $('#network').cytoscape('get');
		cy.$(':selected').neighborhood().select();
	});
	
	$("#exportselected").button();
	$("#exportselected").click(function(){
		$("#exportselectdialog").dialog("open");
		var cy = $('#network').cytoscape('get');
		var cynodes = cy.nodes();
		var cyedges = cy.edges();
		
		$("#snode").empty();
		$("#sgene").empty();
		$("#sedges").empty();

		var nodes = vnetworkdata.nodes;
		var selnids = [];
		var genesincluded = [];
		var subnetworknodes = [];
		var subnetworkedges = [];
		var subnetworksedges = [];

		for(var i = 0; i < cynodes.length; i++){
			if(cynodes[i].selected()){
				var nid = cynodes[i].id().split("_")[1];
				var id = getIndex(nodes, nid);
				selnids.push(id);
				var node = nodes[id];
				$("#snode").append(node.chr+"\t"+node.start+"\t"+node.end+"\n")
				var genes = node.genesymbols;
				for(var j = 0; j < genes.length; j++){
					if(genesincluded.indexOf(genes[j]) == -1){
						$("#sgene").append(genes[j]+"\n");
						genesincluded.push(genes[j]);
					}
				}
				subnetworknodes.push(node);
			}
		}
		
		var edges = vnetworkdata.edges;
		for(var i = 0; i < edges.length; i++){
			var n1id = getIndex(nodes, edges[i].node1);
			var n2id = getIndex(nodes, edges[i].node2);
			if(selnids.indexOf(n1id) != -1 && selnids.indexOf(n2id) != -1){
				var n1 = nodes[n1id];
				var n2 = nodes[n2id];
				$("#sedges").append(n1.chr+"\t"+n1.start+"\t"+n1.end+"\t"+n2.chr+"\t"+n2.start+"\t"+n2.end+"\t"+edges[i].petcount+"\n");
				subnetworkedges.push(edges[i]);
			}
		}
		
		var sedges = vnetworkdata.supportingedges;
		for(var i = 0; i < sedges.length; i++){
			subnetworksedges[i] = [];
		}
		for(var i = 0; i < sedges.length; i++){
			for(var j = 0; j < sedges[i].length; j++){
				var n1id = getIndex(nodes, sedges[i][j].node1);
				var n2id = getIndex(nodes, sedges[i][j].node2);
				if(selnids.indexOf(n1id) != -1 && selnids.indexOf(n2id) != -1){
					subnetworksedges[i].push(sedges[i][j]);
				}
			}
		}
		
		
		var subnetwork = {nodes: subnetworknodes, edges: subnetworkedges, supportingedges: subnetworksedges };
		
		visualizeNetwork('subnetwork', getCytoscapeNetwork(subnetwork, true));
	});
	
	$("#exportselecttabs").tabs({
		activate: function(){
			$("#subnetwork").cytoscape('get').resize();
		}
	});
	
	$("#exportselectdialog").dialog({
		width: 800,
		height: 650,
		autoOpen: false,
		modal: true,
		resizable: false,
		dragStop: function(){
			$("#subnetwork").cytoscape('get').resize();
		}
	});
	$("#exportselectdialog").parent().find(".ui-dialog-titlebar-close").css("display", "inline");

	$("#subnetworkimage").button();
	$("#subnetworkimage").click(function(){
		var cy = $('#subnetwork').cytoscape('get');
		var imgdata = cy.png({scale: 10});
		$("#exportimage-image").attr('src', imgdata);
		$("#exportimagedialog").dialog("open");
	});
});

var setNodeLabels = function(){
	var cy = $('#network').cytoscape('get');
	var nodes = cy.nodes();
	nodes.toggleClass("hidelabel", !$("#nlabels").prop("checked"));
}


var setEdgeLabels = function(){
	var cy = $('#network').cytoscape('get');
	var edges = cy.nodes().connectedEdges();
	edges.toggleClass("hidelabel", !$("#elabels").prop("checked"));
}

var getNetworkLayout = function(){
	var val = parseInt($("#layoutselect").val());
	
	var options;
	var animate = false;
	
	switch(val){
		case 1:
			options = {name: 'random', animate: animate}
		break;
		
		case 2:
			options = {name: 'grid', animate: animate}
		break;
		
		case 3:
			options = {name: 'breadthfirst', animate: animate}
		break;
		
		case 4:
			options = {name: 'dagre', animate: animate}
		break;
			
		case 5:
			options = {name: 'circle', animate: animate}
		break;
			
		case 6:
			options = {name: 'concentric', animate: animate}
		break;
			
		case 7:
			options = {name: 'cose', animate: animate};
			break;
			
		case 8:
			options = {name: 'arbor', animate: animate};
			break;
			
		case 9:
			options = {name: 'springy', animate: animate};
			break;
			
		case 10:
			options = {name: 'cola', animate: animate};
		break;
		
		default:
			options = {name: 'concentric', animate: animate};
	}
	return options;
}

var setCCLinks = function(ui, ccids, index){
	var max = ccids.length-1;
	if(max == -1){
		$(ui).empty().append('<span class="currentcc">0</span>');
	}
	
	var createLink = function(li){
		return '<a href="javascript:setCC('+li+')" class="cclink">'+(li+1)+'</a>';
	}
	
	var beforestart = Math.max(index-4, 0);
	var beforeend = index-1;
	
	var afterstart = index+1;
	var afterend = Math.min(index+4, max);
	
	var html = "";
	
	if(beforestart > 0){
		html += createLink(0);
		if(beforestart > 1){
			html += '...';
		}
	}
	
	for(var i = beforestart; i <= beforeend; i++){
		html += createLink(i);
	}
	
	html += '<span class="currentcc">'+(index+1)+'</span>'
	
	for(var i = afterstart; i <= afterend; i++){
		html += createLink(i);
	}
	
	if(afterend < max){
		if(afterend < max-1){
			html += '...';
		}
		html += createLink(max);
	}
	$(ui).empty().append(html);
}

function getGeneIds(){
	var nodes = networkdata.nodes;
	var genes = [];
	for(var i = 0; i < nodes.length; i++){
		var names = nodes[i].geneids;
		for(var j = 0; j < names.length; j++){
			var gene = names[j];
			if(genes.indexOf(gene) == -1){
				genes.push(gene);
			}
		}
	}
	return genes;
}

function GOEnrichment(){
	$("#goenrichment").empty()
	if(networkdata && networkdata != null){
		var genes = getGeneIds();

		$("#goenrichment").append("Loading...");
		if(genes.length > 0){
			var input = { geneids: genes }
			$.ajax({
				url : "go",
				data: input,
				dataType: "json",
				type : "POST"
			}).success(function(data){
				$("#goenrichment").empty();
				var html = '<table>';
				html += '<tr>';
					html += '<th>&nbsp;</th>';
					html += '<th>GO ID</th>';
					html += '<th>Description</th>';
					html += '<th>Genes In GO Term</th>';
					html += '<th>Genes In Component</th>';
					html += '<th>Expected</th>';
					html += '<th>Fisher</th>';
				html += '</tr>';
				var l = data.goids.length;
				for(var i = 0; i < l; i++){
					var id = data.goids[i];
					var label = data.terms[i];
					var numref = data.genesinterm[i];
					var numlist = data.genesincomponent[i];
					var expected = data.expected[i];
					var pvalue = data.fisher[i];
					go2gene = data.go2gene;
					if(id){
						html += '<tr>';
						html += '<td><a href="javascript:groupNodes(\''+id+'\',\''+i+'\');"">View</a>&nbsp;</td>';
						html += '<td><a href="http://amigo.geneontology.org/amigo/term/'+id+'" target="_blank">'+id+'</a></td>';
						html += '<td>'+label+'</td>';
						html += '<td>'+numref+'</td>';
						html += '<td>'+numlist+'</td>';
						html += '<td>'+expected+'</td>';
						html += '<td>'+pvalue+'</td>';
						html += '</tr>';
					}
				}
				html += '</table>';
				$("#goenrichment").append(html);
			}).error(function(){
				$("#goenrichment").empty().append("Server Error.");
			});		
		}

	}
}

function groupNodes(goid, index){
	var geneids = go2gene[index];
	var nodes = networkdata.nodes;
	var nodeids = [];
	for(var i = 0; i < nodes.length; i++){
		var ids = nodes[i].geneids;
		for(var j = 0; j < ids.length; j++){
			var geneid = ids[j];
			if(geneids.indexOf(geneid) != -1){
				nodeids.push(nodes[i].id)
				break;
			}
		}
	}
	visualizeNetwork('network', getCytoscapeNetwork(networkdata, true, goid, nodeids));

}

function selectSearch(nodeid, ccid){
	var n = "n_"+nodeid;
	var callback = function(){
		var cy = $("#network").cytoscape('get');
		var nodes = cy.nodes();
		for(var k = 0; k < nodes.length; k++){
			var nextid = nodes[k].id();
			if(nextid == n){
				nodes[k].select();
			}
		}
	}
	setCC(ccid, callback);
}

function search(searchterm){
	$("#searchresultsresults").empty();
	ccidata.search = searchterm;
	
	$.ajax({
		url : "search",
		data: ccidata,
		dataType : "json",
		cache: false,
		type : "post",
		}).success(function(data) {
			var nodeids = [];
			var components = [];
			for(var i = 0; i < data.length; i++){
				for(var j = 0; j < ccids.length; j++){
					if(data[i][0] == ccids[j]){
						nodeids.push(data[i][1])
						components.push(j);
					}
				}
			}
			
			if(nodeids.length == 0){
				$("#searchresultsresults").append("No results.");
			}
			else{
				for(var i = 0; i < nodeids.length; i++){
					var link = '<a href="javascript:selectSearch('+nodeids[i]+', '+components[i]+')">Component '+(components[i]+1)+'</a><br/>';
					$("#searchresultsresults").append(link);
				}
			}
			$("#searchresults").show();

		}).error(function(req, status, error) {
			//TODO
		});
}