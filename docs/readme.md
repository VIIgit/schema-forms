Hi


<div id="diagram">Diagram will be placed here</div>


<script src="/js/bower-webfontloader/webfont.js" />
<script src="/js/snap.svg/snap.svg-min.js" />
<script src="/js/underscore/underscore-min.js" />
<script src="/js/js-sequence-diagrams/sequence-diagram-min.js" />
<script> 
  var d = Diagram.parse("A->B: Does something");
  var options = {theme: 'simple'};
  d.drawSVG('diagram', options);
</script>