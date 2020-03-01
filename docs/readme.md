Hi


<div id="diagram">Diagram will be placed here</div>


<script src="/schema-forms/js/bower-webfontloader/webfont.js" />
<script src="/schema-forms/js/snap.svg/snap.svg-min.js" />
<script src="/schema-forms/js/underscore/underscore-min.js" />
<script src="/schema-forms/js/js-sequence-diagrams/sequence-diagram-min.js" />
<script> 
  var d = Diagram.parse("A->B: Does something");
  var options = {theme: 'simple'};
  d.drawSVG('diagram', options);
</script>