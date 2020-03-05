<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="/schema-forms/assets/js/bower-webfontloader/webfont.js" ></script>
<script src="/schema-forms/assets/js/snap.svg/snap.svg-min.js" ></script>
<script src="/schema-forms/assets/js/underscore/underscore-min.js" ></script>
<script src="/schema-forms/assets/js/js-sequence-diagrams/sequence-diagram-min.js" ></script>

Hi

Example API [/api/employees.yaml](https://petstore.swagger.io/?url=https://viigit.github.io/schema-forms/api/employees.yaml)


<div class="diagram">
Note over Consumer: Get localized JSON Schema\nof Emloyees
Consumer->Provider: GET /employees ('application/schema+json')
Note right of Provider: Employees
Note over Consumer: Get list of employees
Consumer->Provider: GET /employees ('application/hal+json')
Note right of Provider: Employees
Provider-->Consumer: JSON Schema
 
</div>



[https://viigit.github.io/schema-forms/](https://viigit.github.io/schema-forms/)


<script> 

    var options = {theme: 'simple'};

    $(".diagram").sequenceDiagram(options);
    

  
</script>
