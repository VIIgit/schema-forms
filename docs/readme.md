<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="/schema-forms/assets/js/bower-webfontloader/webfont.js" ></script>
<script src="/schema-forms/assets/js/snap.svg/snap.svg-min.js" ></script>
<script src="/schema-forms/assets/js/underscore/underscore-min.js" ></script>
<script src="/schema-forms/assets/js/js-sequence-diagrams/sequence-diagram-min.js" ></script>

A backward-compatible extension for [HAL-Form](http://rwcbook.github.io/hal-forms/) to provide support dynamic runtime input forms with JSON Schema

# Motivation

# Workflows
## 1. Get Data only
   
Request
```
GET /employees
Accept application/hal+json
```
Respose
```
{
  "_embedded": {
    "employees": [
      {
        "id": 1,
        "firstName": "John",
        "lastName": "string",
        "birthday": "2000-12-31",
        "status": "PART-TIME",
        "_links": {
          "self": {
            "href": "http://example.com/employees/1"
          },
          "leavesCompany": {
            "href": "http://example.com/employees/1"
          }
        }
      }
    ]
  },
  "_links": {
    "self": {
      "href": "http://example.com/employees"
    }
  }
}
```

## 2. Get Data with HAL-Schema-Forms
   
Request
```
GET /employees
Accept: application/prs.hal-forms+json;
```
Respose
```
Content-Type: application/prs.hal-forms+json;

{
  "_embedded": {
    "employees": [
      {
        "id": 1,
        "firstName": "John",
        "lastName": "string",
        "birthday": "2000-12-31",
        "status": "PART-TIME",
        "_links": {
          "self": {
            "href": "http://example.com/employees/1"
          },
          "leavesCompany": {
            "href": "http://example.com/employees/1"
          }
        }
      }
    ]
  },
  "_links": {
    "self": {
      "href": "http://example.com/employees"
    }
  },
  "_templates": {
    "addEmployee": {
      "title": "Add Employee",
      "method": "POST",
      "contentType": "application/json",
      "jsonSchema": {
        "$id": "http://example.com/api/employees",
        "$schema": "https://json-schema.org/draft/2019-09/schema",
        "type": "object",
        "required": [
          "firstName",
          "lastName",
          "birthday"
        ],
        "properties": {
          "firstName": {
          },
          "lastName": {
          },
          "birthday": {
          },
          "status": {
            "oneOf": [
              {
                "const": "PART-TIME"
              },
              {
                "const": "PERMANENT"
              }
            ]
          }
        }
      }
    }
  }
}
```



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

### Example UI

#### Employees
___
<div class="btn btn-green"> add employee </div>
<table>
  <thead>
    <tr>
      <th>ID</th>
      <th style="text-align: left">Firstname</th>
      <th style="text-align: left">Lastname</th>
      <th style="text-align: left">Date of birth</th>
      <th style="text-align: left">Status</th>
      <th style="text-align: center">Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td style="text-align: left">John</td>
      <td style="text-align: left">Doe</td>
      <td style="text-align: left">1967-12-22</td>
      <td style="text-align: left">Festangestellt</td>
      <td style="text-align: center"><div class="btn btn-red">remove</div><div class="btn btn-blue">edit</div></td>
    </tr>
    <tr>
      <td>2</td>
      <td style="text-align: left">Mary</td>
      <td style="text-align: left">Major</td>
      <td style="text-align: left">2000-02-28</td>
      <td style="text-align: left">Gekündigt</td>
      <td style="text-align: center"><div class="btn btn-blue">edit</div></td>
    </tr>
  </tbody>
</table>


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
