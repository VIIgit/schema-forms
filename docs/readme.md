<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="/schema-forms/assets/js/bower-webfontloader/webfont.js" ></script>
<script src="/schema-forms/assets/js/snap.svg/snap.svg-min.js" ></script>
<script src="/schema-forms/assets/js/underscore/underscore-min.js" ></script>
<script src="/schema-forms/assets/js/js-sequence-diagrams/sequence-diagram-min.js" ></script>

A backward-compatible extension for [HAL-Form](http://rwcbook.github.io/hal-forms/) to provide support dynamic runtime input forms with JSON Schema

# Motivation

# Workflows

Example API [/api/employees.yaml](https://petstore.swagger.io/?url=https://viigit.github.io/schema-forms/api/employees.yaml)

## Read Only
<div class="diagram">
Note over Consumer: 1. Read localized JSON Schema\nof Employees
Consumer->Provider: GET /employees\nAccept application/schema+json
Note right of Provider: Localized static JSON\nof the Employee Resource\nwith an ETag Header
Note right of Provider: Depends on `Cache-Control`
Provider-->Consumer: 304: Not modified
Note right of Provider: or
Provider-->Consumer: 200: JSON Schema
Note over Consumer: 2. Read Employees (Read only)
Consumer->Provider: GET /employees\nAccept application/hal+json
Note right of Provider: Collection of Employees\nwith HAL links
Provider-->Consumer: JSON Data
</div>

With the retieved JSON data (collection of employees) and JSON Schema (of Employees)

| ID  | Firstname | Lastname | Date of birth | Status         |
| --- | :---      | :---     | :---          | :---           |
| 1   | John      | Doe      | 1967-12-22    | Festangestellt |
| 2   | Mary      | Major    | 2000-02-28    | Gekündigt      |

## Read Only
<div class="diagram">
Note over Consumer: 1. Read localized JSON Schema\nof Employees
Consumer->Provider: GET /employees\nAccept application/schema+json
Note right of Provider: Localized static JSON\nof the Employee Resource\nwith an ETag Header
Note right of Provider: Depends on `Cache-Control`
Provider-->Consumer: 304: Not modified
Note right of Provider: or
Provider-->Consumer: 200: JSON Schema
Note over Consumer: 2. Filtering and/or adding Employees
Consumer->Provider: GET /employees\nAccept application/prs.hal-forms+json
Note right of Provider: Collection of Employees with\n- HAL links\n- HAL-Form's templates
Provider-->Consumer: JSON Data
</div>

With the retieved JSON data (collection of employees) and JSON Schema (of Employees)

| ID  | Firstname | Lastname | Date of birth | Status         |             |
| --- | :---      | :---     | :---          | :---           | :---:                          |
| 1   | John      | Doe      | 1967-12-22    | Festangestellt | \<div class="btn"\> remove \</div\>  :x: |
| 2   | Mary      | Major    | 2000-02-28    | Gekündigt      | \<div class="btn"\> remove \</div\> |

<div class="btn"> add employee </div>

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
