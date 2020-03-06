<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="/schema-forms/assets/js/bower-webfontloader/webfont.js" ></script>
<script src="/schema-forms/assets/js/snap.svg/snap.svg-min.js" ></script>
<script src="/schema-forms/assets/js/underscore/underscore-min.js" ></script>
<script src="/schema-forms/assets/js/js-sequence-diagrams/sequence-diagram-min.js" ></script>

A backward-compatible extension for [HAL-Form](http://rwcbook.github.io/hal-forms/) to provide support dynamic runtime input forms with JSON Schema

# Motivation

# Use Cases

Example API [/api/employees.yaml](https://petstore.swagger.io/?url=https://viigit.github.io/schema-forms/api/employees.yaml)

### Collections

<div class="diagram">
Note over Consumer: 1. Read localized JSON Schema\nof Employees
Consumer->Provider: GET /employees ('application/schema+json')
Note right of Provider: Localized static JSON\nof the Employee Resource\nwith an ETag Header
Note right of Provider: Depends on `Cache-Control`\n304 or 200)
Provider-->Consumer: 304: Not modified
Provider-->Consumer: 200: JSON Schema
Note over Consumer: 2. Read Employees (Read only)
Consumer->Provider: GET /employees ('application/hal+json')
Note right of Provider: Collection of Employees\nwith HAL links
Provider-->Consumer: JSON Data
Note over Consumer: 3. Add Employees
Consumer->Provider: GET /employees ('application/prs.hal-forms+json; profile=""')
Note right of Provider: Collection of Employees\nwith HAL links and HAL-Form's templates
Provider-->Consumer: JSON Data
</div>

### Resources

<div class="diagram">
Note over Consumer: 1. Read localized JSON Schema\nof Employees
Consumer->Provider: GET /employees ('application/schema+json')
Note right of Provider: Localized static JSON\nof the Employee Resource\nwith an ETag Header
Note right of Provider: Depends on `Cache-Control`\n304 or 200)
Provider-->Consumer: 304: Not modified
Provider-->Consumer: 200: JSON Schema
Note over Consumer: 2. Read Employees (Read only)
Consumer->Provider: GET /employees ('application/hal+json')
Note right of Provider: Collection of Employees\nwith HAL links
Provider-->Consumer: JSON Data
Note over Consumer: 3. Add Employees
Consumer->Provider: GET /employees ('application/prs.hal-forms+json; profile=""')
Note right of Provider: Collection of Employees\nwith HAL links and HAL-Form's templates
Provider-->Consumer: JSON Data
</div>


# References
HAL-Form [http://rwcbook.github.io/hal-forms](http://rwcbook.github.io/hal-forms/)
The home of JSON Schema [https://json-schema.org](https://json-schema.org)
Inspired by [APIs you won't hate](https://apisyouwonthate.com/blog/lets-stop-building-apis-around-a-network-hack)
ETag [Cache-Control](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching)
This Page [https://viigit.github.io/schema-forms/](https://viigit.github.io/schema-forms/)

<script> 
    var options = {theme: 'simple'};
    $(".diagram").sequenceDiagram(options);
</script>
