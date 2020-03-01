Hi

Form
<div id="diagram1"></div>

<script src="/schema-forms/js/bower-webfontloader/webfont.js" ></script>
<script src="/schema-forms/js/snap.svg/snap.svg-min.js" ></script>
<script src="/schema-forms/js/underscore/underscore-min.js" ></script>
<script src="/schema-forms/js/js-sequence-diagrams/sequence-diagram-min.js" ></script>
<script> 
    const diagram1 = "Note over Consumer,/employees: 1. Localized cachable schema"
        + "Consumer->/employees: GET 'application/schema+json'"
        + "Note right of /employees: Employees"
        + "/employees-->Consumer: JSON Schema";

  var d = Diagram.parse(diagram1);
  var options = {theme: 'simple'};
  d.drawSVG('diagram1', options);
</script>
